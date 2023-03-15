import { Button, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import Timer from "../../../components/timer";
import Character from "../../../types/character";
import Graph from "./graph";
import Stages from "../../../types/stages";

/**
 * The typeracer Singleplayer component
 *
 * @export
 * @returns {*}
 */
export default function TypeRacer() {
    // State variables that track the quote, progress, completed quote, countdown, stages, array of characters, wrong keys, and total keys
    // this is the same as multiplayer, except instead of storing in the database, it is in state variable forms
    let [quote, setQuote] = useState("");
    let [progress, setProgress] = useState(0);
    let [completedQuote, setCompletedQuote] = useState("");
    let [countdown, setCountdown] = useState<null | number>(null);
    let [stages, setStages] = useState<Stages>(-1);
    let [arr, setArr] = useState<Character[]>([]);
    let [wrongKeys, setWrongKeys] = useState(0);
    let [totalKeys, setTotalKeys] = useState(0);

    // A useEffect hook that fetches a quote from the quotable API
    useEffect(() => {
        if (stages !== -1) return;
        fetch(
            "https://api.quotable.io/random?" +
                new URLSearchParams({
                    // The minimum length of the quote should be 50
                    minLength: "50",
                })
        ).then((response) => {
            // when we get back a response, we parse it as JSON
            response.json().then((value) => {
                setQuote(`${value.content}`);
                // we then set the stages to 1, which is the stage where the user is typing
                setStages(Stages.STARTING);
            });
        });
    }, []);

    // if the user is done typing, the quote exists and the stage of the game is not "ended" yet, then we set the stage to "ended"
    if (
        progress === quote.length &&
        quote.length !== 0 &&
        stages !== Stages.ENDED
    ) {
        setStages(Stages.ENDED);
    }

    return (
        <div id="typeracer" style={{ paddingRight: "1vw" }}>
            <Stack
                style={{
                    backgroundColor: "#0d104f",
                    borderRadius: "1vw",
                    padding: "1vw",
                    marginRight: "1vw",
                }}
            >
                {stages === Stages.STARTED ? (
                    // display a timer for the user to keep track of the time, if the game has started
                    <h3 style={{ display: "flex", justifyContent: "right" }}>
                        Time Elapsed: <Timer />
                    </h3>
                ) : null}

                {/* Show the current game's quote that the players have to type. This is separated into yellow (typed already), yellow with a line (last typed character), red (characters that were mistyped), white (characters that have yet to be touched) */}
                <Stack id="text-display">
                    <p
                        style={{
                            fontFamily: "Fira Code, monospace",
                            fontWeight: "bold",
                        }}
                    >
                        <p
                            style={{
                                color: "yellow",
                                fontFamily: "Fira Code, monospace",
                                fontWeight: "bold",
                                display: "inline",
                            }}
                        >{`${quote.substring(0, progress - 1)}`}</p>
                        <u
                            style={{
                                color: "yellow",
                                fontFamily: "Fira Code, monospace",
                                fontWeight: "bold",
                                display: "inline",
                            }}
                        >{`${quote.substring(progress - 1, progress)}`}</u>
                        <p
                            style={{
                                color: "red",
                                fontFamily: "Fira Code, monospace",
                                fontWeight: "bold",
                                display: "inline",
                            }}
                        >{`${completedQuote}`}</p>
                        {`${quote.substring(progress, quote.length)}`}
                    </p>
                </Stack>

                {stages <= 1 ? (
                    // if the game has not started yet, then show a button that says "START" or "LOADING QUOTE..."
                    <Button
                        variant="contained"
                        onClick={() => {
                            // if the countdown is not null, or if the stages is not "error", then continue with the starting of the game
                            if (countdown !== null || stages == Stages.ERROR)
                                return;
                            // update the variables at various intervals to show a countdown
                            setCountdown(3);
                            setTimeout(() => {
                                setCountdown(2);
                            }, 1000);
                            setTimeout(() => {
                                setCountdown(1);
                            }, 2000);
                            setTimeout(() => {
                                setCountdown(0);
                                setStages(2);
                                setArr([
                                    {
                                        character: "",
                                        acc: 100,
                                        time: Date.now(),
                                    },
                                ]);
                            }, 3000);
                        }}
                        // vary the colour of the button depending on the state of the game
                        color={
                            countdown !== null
                                ? "error"
                                : stages == -1
                                ? "warning"
                                : "success"
                        }
                    >
                        {/* Vary the message on the button depending on whether the game has found a quote */}
                        {countdown === null
                            ? stages == -1
                                ? "LOADING QUOTE..."
                                : "START"
                            : countdown}
                    </Button>
                ) : stages == 2 ? (
                    // hidden text field that is used to track the user's typing
                    // if the user unfocuses the text field, then it will refocus itself
                    <TextField
                        style={{ opacity: 0, height: 0 }}
                        value={completedQuote}
                        autoFocus
                        id="typeracer-input"
                        onKeyDown={(e) => {
                            // prevent shortcuts like ctrl-v
                            if (e.ctrlKey || e.altKey || e.metaKey) {
                                e.preventDefault();
                            }
                        }}
                        onBlur={(e) => {
                            // refocus the text field
                            e.target.focus();
                            // this is in case the browser does not allow refocusing immediately
                            setTimeout(() => e.target.focus(), 100);
                        }}
                        onChange={(e) => {
                            let val = e.target.value;
                            let len = val.length;
                            // update the total keys that the user has typed
                            setTotalKeys((k) => k + 1);
                            // if the user has typed the correct character, then update the progress of the quote and add the character to the array of characters
                            if (
                                val == quote.substring(progress, progress + len)
                            ) {
                                // update all the game's state variables
                                setProgress((p) => p + len);
                                setCompletedQuote("");
                                setArr((arr) => {
                                    let newArr = [...arr];
                                    // add the character to the array of characters
                                    newArr.push({
                                        character: quote.substring(
                                            progress,
                                            progress + len
                                        ),
                                        acc:
                                            100 - (wrongKeys / totalKeys) * 100,
                                        time: Date.now(),
                                    });
                                    return newArr;
                                });
                            } else {
                                // if the user has typed the wrong character, then update the completed quote and add the character to the array of characters
                                setCompletedQuote(val);
                                setWrongKeys((k) => k + 1);
                            }
                        }}
                    ></TextField>
                ) : (
                    // if the game has ended, then show the user's accuracy and a graph of their accuracy
                    <Graph arr={arr} accuracy={wrongKeys / totalKeys} />
                )}
            </Stack>
        </div>
    );
}
