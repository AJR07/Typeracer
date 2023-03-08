import { Button, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import firebaseApp from "../../lib/firebase";
import { get, getDatabase, onDisconnect, ref, set } from "firebase/database";
import Game from "../../types/game";
import { User } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { UserData } from "../../types/user";

const db = getDatabase(firebaseApp);
const firebaseDB = getFirestore(firebaseApp);

interface JoinGameProps {
    setGameID: React.Dispatch<React.SetStateAction<string | null>>;
    user: User;
}

export default function JoinGame(props: JoinGameProps) {
    let [joinGameVal, setJoinGameVal] = useState<string>("");
    let [processing, setProcessing] = useState<boolean>(false);
    let [notification, setNotification] = useState<string>("");

    useEffect(() => {
        if (notification != "") {
            const curNotif = notification;
            setTimeout(() => {
                if (notification == curNotif) setNotification("");
            }, 3000);
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

async function joinGame(
    setNotification: React.Dispatch<React.SetStateAction<string>>,
    setProcessing: React.Dispatch<React.SetStateAction<boolean>>,
    props: JoinGameProps,
    gameID: string
) {
    setProcessing(true);
    setNotification("Joining game...");
    let dbRef = ref(db, "games/" + gameID);
    let userDetails = await getDoc(doc(firebaseDB, "users", props.user.uid));
    let snapshot = await get(dbRef);

    if (snapshot.exists() && userDetails.exists()) {
        let gameData = snapshot.val() as Game;
        let userData = userDetails.data() as UserData;
        gameData.playerData[props.user.uid] = {
            progress: 0,
            wrongKeys: 0,
            totalKeys: 0,
            name: userData.name,
            arr: [],
        };
        await set(dbRef, gameData);
        onDisconnect(
            ref(db, "games/" + gameID + "/playerData/" + props.user.uid)
        ).remove();
        setNotification("Game created!");
        setProcessing(false);
        props.setGameID(gameID);
    } else {
        setNotification("An error occured while joining a game.");
        setProcessing(false);
    }
}

async function createGame(
    setNotification: React.Dispatch<React.SetStateAction<string>>,
    setProcessing: React.Dispatch<React.SetStateAction<boolean>>,
    props: JoinGameProps
) {
    let id =
        Math.random().toString(36).substring(5) +
        Math.random().toString(36).substring(5) +
        Math.random().toString(36).substring(5);
    setProcessing(true);
    setNotification("Creating game...");
    let dbRef = ref(db, "games/" + id);
    let userDetails = await getDoc(doc(firebaseDB, "users", props.user.uid));
    let snapshot = await get(dbRef);

    if (snapshot.exists()) {
        createGame(setNotification, setProcessing, props);
    } else if (userDetails.exists()) {
        let quote = await fetch(
            "https://api.quotable.io/random?" +
                new URLSearchParams({
                    minLength: "50",
                })
        );
        let value = await quote.json();
        await set(dbRef, {
            id: id,
            hostID: props.user.uid,
            stages: 0,
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
        onDisconnect(dbRef).remove();
        setNotification("Game created!");
        setProcessing(false);
        props.setGameID(id);
    } else {
        setNotification("An error occured while creating a game.");
        setProcessing(false);
    }
}
