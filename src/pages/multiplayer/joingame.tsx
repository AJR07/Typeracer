import { Button, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import firebaseApp from "../../lib/firebase";
import { get, getDatabase, onDisconnect, ref, set } from "firebase/database";
import Game from "../../types/game";
import { User } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { UserData } from "../../types/user";
import Stages from "../../types/stages";

/**
 * Real Time DataBase reference - used for storing/updating real-time game data
 *
 * @type {*}
 */
const db = getDatabase(firebaseApp);
/**
 * Firestore reference - used for storing/updating long term user data
 *
 * @type {*}
 */
const firebaseDB = getFirestore(firebaseApp);

/**
 * Props for the JoinGame component
 *
 * @interface JoinGameProps
 * @typedef {JoinGameProps}
 */
interface JoinGameProps {
    /**
     * Allows the component to set the gameID state variable and update the component at the outer umbrella
     *
     * @type {React.Dispatch<React.SetStateAction<string | null>>}
     */
    setGameID: React.Dispatch<React.SetStateAction<string | null>>;
    /**
     * The user object of the current user
     *
     * @type {User}
     */
    user: User;
}

/**
 * The JoinGame component - allows the user to create/join a game
 *
 * @export
 * @param {JoinGameProps} props
 * @returns {*}
 */
export default function JoinGame(props: JoinGameProps) {
    // Tracks the ID of the game that the player wants to join
    let [joinGameVal, setJoinGameVal] = useState<string>("");
    // Tracks whether the user is currently creating/joining a game
    let [processing, setProcessing] = useState<boolean>(false);
    // Tracks the notification to be displayed
    let [notification, setNotification] = useState<string>("");

    // This useEffect is used to clear the notification after 5 seconds
    useEffect(() => {
        if (notification != "") {
            const curNotif = notification;
            setTimeout(() => {
                if (notification == curNotif) setNotification("");
            }, 5000);
        }
    }, [notification]);

    return (
        <Stack
            direction="column"
            sx={{
                backgroundColor: "lightblue",
                borderRadius: "1vw",
                padding: "1vw",
            }}
            spacing={5}
        >
            <Button
                variant="contained"
                onClick={() => {
                    createGame(setNotification, setProcessing, props).catch(
                        () => {
                            setNotification(
                                "An error occured while creating a game."
                            );
                        }
                    );
                }}
                disabled={processing}
            >
                Create Game
            </Button>

            <Stack direction="row" spacing={5}>
                <TextField
                    label="Game ID"
                    value={joinGameVal}
                    fullWidth
                    onChange={(e) => {
                        setJoinGameVal(e.target.value);
                    }}
                />
                <Button
                    onClick={() =>
                        joinGame(
                            setNotification,
                            setProcessing,
                            props,
                            joinGameVal
                        ).catch(() =>
                            setNotification(
                                "An error occured while creating a game."
                            )
                        )
                    }
                    variant="contained"
                    disabled={processing}
                >
                    Join Game
                </Button>
            </Stack>

            <h3 hidden={notification == ""} style={{ color: "black" }}>
                {notification}
            </h3>
        </Stack>
    );
}

/**
 * Function that allows the user to join the game
 *
 * @async
 * @param {React.Dispatch<React.SetStateAction<string>>} setNotification
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setProcessing
 * @param {JoinGameProps} props
 * @param {string} gameID
 * @returns {*}
 */
async function joinGame(
    setNotification: React.Dispatch<React.SetStateAction<string>>,
    setProcessing: React.Dispatch<React.SetStateAction<boolean>>,
    props: JoinGameProps,
    gameID: string
) {
    // let the component above know that the game is being created
    setProcessing(true);
    setNotification("Joining game...");

    // get the user data from the database
    let userDetails = await getDoc(doc(firebaseDB, "users", props.user.uid));

    // get the game data from the database
    let dbRef = ref(db, "games/" + gameID);
    let snapshot = await get(dbRef);

    // if the game exists and the user exists, add the user to the game
    if (snapshot.exists() && userDetails.exists()) {
        let gameData = snapshot.val() as Game;
        let userData = userDetails.data() as UserData;
        // create the user's data for the game
        gameData.playerData[props.user.uid] = {
            progress: 0,
            wrongKeys: 0,
            totalKeys: 0,
            name: userData.name,
            arr: [],
        };
        // update the game data in the database
        await set(dbRef, gameData);
        // remove the user from the game if they disconnect
        onDisconnect(
            ref(db, "games/" + gameID + "/playerData/" + props.user.uid)
        ).remove();
        // let the component above know that the game has been created
        setNotification("Game created!");
        setProcessing(false);
        // set the gameID state variable to the gameID of the game we just joined
        props.setGameID(gameID);
    } else {
        // if the game doesn't exist, let the user know
        setNotification("An error occured while joining a game.");
        setProcessing(false);
    }
}

/**
 * Function that allows the user to create a game
 *
 * @async
 * @param {React.Dispatch<React.SetStateAction<string>>} setNotification
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setProcessing
 * @param {JoinGameProps} props
 * @returns {*}
 */
async function createGame(
    setNotification: React.Dispatch<React.SetStateAction<string>>,
    setProcessing: React.Dispatch<React.SetStateAction<boolean>>,
    props: JoinGameProps
) {
    // generate a random gameID
    let id =
        Math.random().toString(36).substring(5) +
        Math.random().toString(36).substring(5);
    // let the component above know that the game is being created
    setProcessing(true);
    setNotification("Creating game...");

    // get the user data from the database
    let userDetails = await getDoc(doc(firebaseDB, "users", props.user.uid));

    // get the game data from the database
    let dbRef = ref(db, "games/" + id);
    let snapshot = await get(dbRef);

    if (snapshot.exists()) {
        // if the game already exists, try again
        createGame(setNotification, setProcessing, props);
    } else if (userDetails.exists()) {
        // if the game doesn't exist and the user exists, create the game

        // get a random quote from the quotable API
        let quote = await fetch(
            "https://api.quotable.io/random?" +
                new URLSearchParams({
                    // ensure that the quote is sufficiently long "at least 50 characters"
                    minLength: "50",
                })
        );
        let value = await quote.json();

        // create the game in the database, initialling all the values to its default
        await set(dbRef, {
            id: id,
            hostID: props.user.uid,
            stages: Stages.IDLE,
            countdown: 4,
            quote: `${value.content}`,
            playerData: {
                [props.user.uid]: {
                    progress: 0,
                    wrongKeys: 0,
                    totalKeys: 0,
                    name: (userDetails.data() as UserData).name,
                    arr: [],
                },
            },
        } as Game);

        // remove the entire game from the database if the host disconnects
        onDisconnect(dbRef).remove();

        // let the component above know that the game has been created
        setNotification("Game created!");
        setProcessing(false);
        // set the gameID state variable to the gameID of the game we just created
        props.setGameID(id);
    } else {
        // if the user doesn't exist, let the user know
        setNotification("An error occured while creating a game.");
        setProcessing(false);
    }
}
