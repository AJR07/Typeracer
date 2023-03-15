import { Button, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import Timer from "../../../components/timer";
import Game, { PlayerData } from "../../../types/game";
import Stages from "../../../types/stages";
import Graph from "./graph";
import Progress from "./progress";

/**
 * Props for typeracer component - for multiplayer games
 *
 * @interface TypeRacerProps
 * @typedef {TypeRacerProps}
 */
interface TypeRacerProps {
    /**
     * Game data of the current typeracer game
     *
     * @type {Game}
     */
    gameData: Game;
    /**
     * function to update the game data
     *
     * @type {React.Dispatch<React.SetStateAction<Game | null>>}
     */
    setGameData: React.Dispatch<React.SetStateAction<Game | null>>;
    /**
     * User object of the current user
     *
     * @type {User}
     */
    user: User;
}

/**
 * Typeracer Component - the logic of the actual typeracer game
 *
 * @export
 * @param {TypeRacerProps} props
 * @returns {*}
 */
export default function TypeRacer(props: TypeRacerProps) {
    // state variables: completed quote (the quote that the user has completed typing)
    // progress (the progress of the user in the game)
    let [completedQuote, setCompletedQuote] = useState("");
    let [progress, setProgress] = useState(0);

    // useEffect hook - runs everytime the game data changes
    useEffect(() => {
        // don't do anything if the game has been completed
        if (props.gameData.stages == Stages.ENDED) return;

        // check if all users have completed the typeracer
        let allComplete = true;
        for (let player of Object.entries(props.gameData.playerData)) {
            if (player[1].progress < props.gameData.quote.length) {
                allComplete = false;
                break;
            }
        }

        // if all users have completed the typeracer, update the game data to show that the game has ended
        if (allComplete) {
            props.setGameData({
                ...props.gameData,
                stages: Stages.ENDED,
            });
        }
    }, [props.gameData]);

    // get the user-specific data from the game data
    let userData = getOwnData(props.gameData, props.user);

    return (
        <div id="typeracer">
            <Stack
                style={{
                    backgroundColor: "#0d104f",
                    borderRadius: "1vw",
                    padding: "1vw",
                    marginRight: "1vw",
                }}
            >
                {/* Show the timer if the game has started */}
                {props.gameData.stages === Stages.STARTED ? (
                    <h3 style={{ display: "flex", justifyContent: "right" }}>
                        Time Elapsed: <Timer />
                    </h3>
                ) : null}

                {/* Show the player's progress bars throughout, to show how much they have typed already. */}
                <Stack id="progress-bars">
                    {Object.entries(props.gameData.playerData).map((player) => {
                        return (
                            <Progress
                                quoteLength={props.gameData.quote.length}
                                userData={player[1] as PlayerData}
                                key={player[0]}
                            />
                        );
                    })}
                </Stack>

                {/* Show the current game's quote that the players have to type. This is separated into yellow (typed already), yellow with a line (last typed character), red (characters that were mistyped), white (characters that have yet to be touched) */}
                <Stack id="text-display">
                    <div
                        style={{
                            fontFamily: "Fira Code, monospace",
                            fontWeight: "bold",
                            padding: "1vw",
                        }}
                    >
                        <p
                            style={{
                                color: "yellow",
                                fontFamily: "Fira Code, monospace",
                                fontWeight: "bold",
                                display: "inline",
                            }}
                        >{`${props.gameData.quote.substring(
                            0,
                            userData.progress - 1
                        )}`}</p>
                        <u
                            style={{
                                color: "yellow",
                                fontFamily: "Fira Code, monospace",
                                fontWeight: "bold",
                                display: "inline",
                            }}
                        >{`${props.gameData.quote.substring(
                            userData.progress - 1,
                            userData.progress
                        )}`}</u>
                        <p
                            style={{
                                color: "red",
                                fontFamily: "Fira Code, monospace",
                                fontWeight: "bold",
                                display: "inline",
                            }}
                        >{`${props.gameData.quote.substring(
                            userData.progress,
                            Math.min(
                                userData.progress + completedQuote.length,
                                props.gameData.quote.length
                            )
                        )}`}</p>
                        {`${props.gameData.quote.substring(
                            Math.min(
                                userData.progress + completedQuote.length,
                                props.gameData.quote.length
                            ),
                            props.gameData.quote.length
                        )}`}
                    </div>
                </Stack>

                {/* Show the button to start the game, if the game hasn't started */}
                {props.gameData.stages <= Stages.STARTING ? (
                    <div>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => {
                                // only allow the host to start the game, when the game has not started yet
                                if (
                                    !checkHost(props.gameData, props.user) ||
                                    props.gameData.countdown !== 4
                                )
                                    return;

                                // set the game data at the right time to sync the countdown on all devices
                                setTimeout(() => {
                                    props.setGameData({
                                        ...props.gameData,
                                        countdown: 3,
                                    });
                                }, 1000);
                                setTimeout(() => {
                                    props.setGameData({
                                        ...props.gameData,
                                        countdown: 2,
                                    });
                                }, 2000);
                                setTimeout(() => {
                                    props.setGameData({
                                        ...props.gameData,
                                        countdown: 1,
                                    });
                                }, 3000);

                                // a the 4 second mark, start the game
                                setTimeout(() => {
                                    props.setGameData((data) => {
                                        let newData = { ...(data as Game) };
                                        // set all player's initial data to to start the "first character" from now
                                        for (let player of Object.entries(
                                            newData.playerData
                                        )) {
                                            player[1].arr = [
                                                {
                                                    time: Date.now(),
                                                    character: "",
                                                    acc: 0,
                                                },
                                            ];
                                        }
                                        // set the game to the "started" stage
                                        newData.countdown = 0;
                                        newData.stages = Stages.STARTED;
                                        return newData;
                                    });
                                }, 4000);
                            }}
                            // change the color of the button depending on the state of the game and who is playing
                            color={
                                !checkHost(props.gameData, props.user)
                                    ? "warning"
                                    : props.gameData.countdown !== 4
                                    ? "error"
                                    : "success"
                            }
                        >
                            {/* Change the text on the button based on who is at the client side (host or not) */}
                            {props.gameData.countdown === 4
                                ? checkHost(props.gameData, props.user)
                                    ? "Start"
                                    : "Waiting for host to start"
                                : props.gameData.countdown}
                        </Button>
                    </div>
                ) : props.gameData.stages == 2 ? (
                    // If the game has started, create the text input field
                    // This is a hidden text field that is used to capture the user's input
                    // The text field is hidden, but the user can still type in it, and it is auto focused on load
                    <TextField
                        style={{ opacity: 0, height: 0 }}
                        value={completedQuote}
                        autoFocus
                        id="typeracer-input"
                        onKeyDown={(e) => {
                            // prevent usage of shortcuts like control-v
                            if (e.ctrlKey || e.altKey || e.metaKey) {
                                e.preventDefault();
                            }
                        }}
                        onBlur={(e) => {
                            // if the user clicks out of the text field accidentally, refocus it
                            e.target.focus();
                            // attempt a refocus again in case the browser does not allow an immediate refocus
                            setTimeout(() => e.target.focus(), 100);
                        }}
                        onChange={(e) => {
                            // logic to handle what happens when a user types a character
                            let val = e.target.value;
                            let len = val.length;
                            // if the user's current progress is descyned with the databases' current progress, it is likely due to race conditions
                            // thus, we ignore the user's input
                            if (userData.progress != progress) return;
                            // if the user's input is the same as the current character in the quote, we add the character to the completed quote
                            if (
                                val ==
                                props.gameData.quote.substring(
                                    userData.progress,
                                    userData.progress + len
                                )
                            ) {
                                // reset the text in the current text field
                                setCompletedQuote("");
                                // update the progress of the user
                                setProgress((p) => p + len);
                                // update the game data in the database
                                props.setGameData((data) => {
                                    let newData = { ...data } as Game;
                                    // update the progress of the user
                                    newData.playerData![
                                        props.user.uid
                                    ]!.progress = len + progress;
                                    // add the character to the user's array of characters
                                    newData.playerData![
                                        props.user.uid
                                    ]!.arr.push({
                                        character:
                                            props.gameData.quote.substring(
                                                userData.progress,
                                                userData.progress + len
                                            ),
                                        acc:
                                            100 -
                                            (userData.wrongKeys /
                                                (userData.totalKeys + 1)) *
                                                100,
                                        time: Date.now(),
                                    });
                                    // update the user's total keys and wrong keys
                                    newData.playerData![
                                        props.user.uid
                                    ]!.totalKeys = userData.totalKeys + 1;
                                    return newData;
                                });
                            } else {
                                // if the user's input is wrong, we update the completed quote state, but we also add it to the wrong keys
                                setCompletedQuote(val);
                                // update the game data in the database
                                props.setGameData((data) => {
                                    let newData = { ...data } as Game;
                                    // update the progress of the user
                                    newData.playerData![
                                        props.user.uid
                                    ]!.wrongKeys = userData.wrongKeys + 1;
                                    // add the character to the user's array of characters
                                    newData.playerData![
                                        props.user.uid
                                    ]!.totalKeys = userData.totalKeys + 1;
                                    return newData;
                                });
                            }
                        }}
                    ></TextField>
                ) : (
                    // if the game is over, show the results
                    <Graph playerData={props.gameData.playerData} />
                )}
            </Stack>
        </div>
    );
}

/**
 * Utility function to get the player's data
 *
 * @param {Game} data
 * @param {User} user
 * @returns {*}
 */
function getOwnData(data: Game, user: User) {
    return data.playerData[user.uid];
}

/**
 * Utility function to check if the user is the host
 *
 * @param {Game} data
 * @param {User} user
 * @returns {boolean}
 */
function checkHost(data: Game, user: User) {
    if (data.hostID === user.uid) return true;
    return false;
}
