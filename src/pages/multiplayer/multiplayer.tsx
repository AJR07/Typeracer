import { Button, Stack } from "@mui/material";
import { getAuth } from "firebase/auth";
import { get, getDatabase, onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import firebaseApp from "../../lib/firebase";
import Game from "../../types/game";
import JoinGame from "./joingame";
import TypeRacer from "./typeracer/typeracer";

/**
 * Authentication reference - used for getting the current user
 *
 * @type {*}
 */
const auth = getAuth(firebaseApp);
/**
 * Real Time DataBase reference - used for storing/updating real-time game data
 *
 * @type {*}
 */
const db = getDatabase(firebaseApp);

/**
 * The MultiPlayer component - displays the page for multiplayer games
 *
 * @export
 * @returns {*}
 */
export default function MultiPlayer() {
    // The useNavigate hook allows us to navigate to different pages
    const navigate = useNavigate();

    // The useAuthState hook allows us to get the current user
    const [user, loading, error] = useAuthState(auth);

    // state variables: current game ID (used when the user joins a game)
    // public game data (used to track the games that are ongoing/idle, so users can join)
    // game data (the game data of the game the user is currently playing)
    // old game data (stores the previous version of game data)
    const [gameID, setGameID] = useState<string | null>(null);
    const [publicGameData, setPublicGameData] = useState<{
        [id: string]: Game;
    }>({});
    const [gameData, setGameData] = useState<Game | null>(null);
    const [oldGameData, setOldGameData] = useState<Game | null>(null);

    // useEffect hook - this runs once when component is first mounted
    useEffect(() => {
        const publicRef = ref(db, "games/");

        // ensures that the public game data is updated when it changes
        onValue(publicRef, (snapshot) => {
            if (!snapshot.exists()) setPublicGameData({});
            else {
                setPublicGameData(snapshot.val());
            }
        });

        // gets the public game data from the database
        get(publicRef).then((snapshot) => {
            if (!snapshot.exists()) setPublicGameData({});
            else {
                setPublicGameData(snapshot.val());
            }
        });
    }, []);

    // useEffect hook - this runs when the gameID state variable changes
    useEffect(() => {
        const dbRef = ref(db, "games/" + gameID);
        // ensures that the game data of the game the user is in is updated when it changes
        onValue(dbRef, (snapshot) => {
            if (!snapshot.exists()) return;
            setGameData(snapshot.val() as Game);
        });
    }, [gameID]);

    // useEffect hook - this runs when the gameData state variable changes
    useEffect(() => {
        // this hook's goal is to update the database with the latest game data if it changes on the client side
        // this is done by comparing the old game data with the new game data
        if (gameData && user) {
            let objData = Object.entries(gameData);
            let changedGlobalVars = false;
            // if the old game data exists, compare the old game data with the new game data
            // compare only the global variables (not the player data)
            if (oldGameData) {
                let objOldData = Object.entries(oldGameData);
                for (let i = 0; i < objData.length; i++) {
                    if (objData[i][0] === "playerData") continue;
                    if (objData[i][1] !== objOldData[i][1]) {
                        changedGlobalVars = true;
                    }
                }
            } else changedGlobalVars = true;

            if (changedGlobalVars) {
                // if the global variables have changed, update the entire game's database with the new game data
                const dbRef = ref(db, "games/" + gameID);
                set(dbRef, gameData);
            } else {
                // if the global variables have not changed, only update the player's data in the database
                const dbRef = ref(
                    db,
                    "games/" + gameID + "/playerData/" + user.uid
                );
                set(dbRef, gameData.playerData[user.uid]);
            }
        }
        setOldGameData(gameData);
    }, [gameData]);

    if (loading) {
        // if the user's data is loading, display a loading message
        return <p> Loading...</p>;
    }
    if (error || user === null || user === undefined) {
        // if the user is not signed in, display an error message
        return (
            <div id="error">
                <h1>An error has occurred while loading your profile.</h1>
                <p>
                    Please ensure that you are signed in, by clicking the button
                    below.
                </p>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/profile")}
                >
                    Profile
                </Button>
            </div>
        );
    }

    let count = 0;
    return (
        <div id="multiplayer" style={{ width: "97%", marginRight: "3%" }}>
            <h1 style={{ textAlign: "center" }}>Multiplayer</h1>
            {!gameID ? (
                // if the user is not in a game, display the public games and the join game component
                <Stack spacing={5}>
                    <JoinGame setGameID={setGameID} user={user} />
                    <Stack
                        direction="column"
                        sx={{
                            backgroundColor: "lightblue",
                            borderRadius: "1vw",
                            padding: "1vw",
                        }}
                    >
                        <h2 style={{ color: "black" }}>Public Games</h2>
                        {Object.entries(publicGameData).map((gameID) => {
                            // display the available games for the player to join using map
                            return (
                                <p style={{ color: "black" }}>
                                    {gameID[0]}:{" "}
                                    {Object.entries(gameID[1].playerData).map(
                                        (player, playerID) => {
                                            return playerID != 0
                                                ? ","
                                                : player[1].name;
                                        }
                                    )}
                                </p>
                            );
                        })}
                    </Stack>
                </Stack>
            ) : (
                // if the user is in a game, display the game ID and the players in the game
                <Stack spacing={2}>
                    <Stack direction="column">
                        <h3>Game ID: {gameID}</h3>
                        <p>
                            Share the Game ID with your friends for them to join
                            the same game as you!
                        </p>
                        <h3>Players Available: </h3>
                        {gameData && gameData.playerData ? (
                            // display the players in the game from the playerData using map
                            <Stack direction="column">
                                {Object.entries(gameData?.playerData).map(
                                    (player) => {
                                        return (
                                            <pre
                                                style={{
                                                    padding: 0,
                                                    margin: 0,
                                                }}
                                                key={player[0]}
                                            >
                                                {++count}. {player[1].name}
                                            </pre>
                                        );
                                    }
                                )}
                            </Stack>
                        ) : (
                            <p>Waiting for players...</p>
                        )}
                    </Stack>

                    {/* If we are in a game, show the typeracer component */}
                    {gameData ? (
                        <TypeRacer
                            gameData={gameData!}
                            setGameData={setGameData}
                            user={user}
                        />
                    ) : (
                        <></>
                    )}
                </Stack>
            )}
        </div>
    );
}
