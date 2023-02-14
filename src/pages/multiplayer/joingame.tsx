import { Button, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import firebaseApp from "../../lib/firebase";
import {
    DataSnapshot,
    get,
    getDatabase,
    onDisconnect,
    onValue,
    ref,
    set,
} from "firebase/database";
import Game from "../../types/game";
import { User } from "firebase/auth";

const db = getDatabase(firebaseApp);

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
                    createGame(setNotification, setProcessing, props);
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
    let snapshot = await get(dbRef);

    if (snapshot.exists()) {
        let gameData = snapshot.val() as Game;
        gameData.playerData[props.user.uid] = {
            progress: 0,
            accuracy: 0,
        };
        await set(dbRef, gameData);
        delete gameData.playerData[props.user.uid];
        onDisconnect(dbRef).update(gameData);
        setNotification("Game created!");
        setProcessing(false);
        props.setGameID(gameID);
    } else {
        setNotification("An error occured while joining a game.");
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
    let snapshot = await get(dbRef);

    if (snapshot.exists()) {
        createGame(setNotification, setProcessing, props);
    } else {
        await set(dbRef, {
            id: id,
            hostID: props.user.uid,
            started: false,
            ended: false,
            playerData: {
                [props.user.uid]: {
                    progress: 0,
                    accuracy: 0,
                },
            },
        } as Game);
        onDisconnect(dbRef).remove();
        setNotification("Game created!");
        setProcessing(false);
        props.setGameID(id);
    }
}
