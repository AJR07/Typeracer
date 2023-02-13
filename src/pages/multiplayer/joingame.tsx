import { Button, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import firebaseApp from "../../lib/firebase";
import { DataSnapshot, get, getDatabase, ref, set } from "firebase/database";
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
                    onClick={() => setProcessing(true)}
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

function createGame(
    setNotification: React.Dispatch<React.SetStateAction<string>>,
    setProcessing: React.Dispatch<React.SetStateAction<boolean>>,
    props: JoinGameProps
) {
    let id = Math.random().toString(36).substring(7);
    setProcessing(true);
    setNotification("Creating game...");
    let dbRef = ref(db, "games/" + id);
    get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                console.log("HI");
                createGame(setNotification, setProcessing, props);
            } else {
                set(dbRef, {
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
                } as Game)
                    .then(() => {
                        setNotification("Game created!");
                        setProcessing(false);
                        props.setGameID(id);
                    })
                    .catch((err) => {
                        setNotification("Error creating game!");
                        console.log(err);
                        setProcessing(false);
                    });
            }
        })
        .catch((err) => {
            setNotification("Error creating game!");
            console.log(err);
            setProcessing(false);
        });
}
