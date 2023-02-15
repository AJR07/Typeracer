import { Button, Stack } from "@mui/material";
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import firebaseApp from "../../lib/firebase";
import Game from "../../types/game";
import JoinGame from "./joingame";
import TypeRacer from "./typeracer/typeracer";

const auth = getAuth(firebaseApp);
const db = getDatabase(firebaseApp);

export default function MultiPlayer() {
    const [gameID, setGameID] = useState<string | null>(null);
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    const [gameData, setGameData] = useState<Game | null>(null);

    useEffect(() => {
        const dbRef = ref(db, "games/" + gameID);
        onValue(dbRef, (snapshot) => {
            if (!snapshot.exists()) return;
            setGameData(snapshot.val() as Game);
        });
    }, [gameID]);

    useEffect(() => {
        // upload
        if (gameData && user) {
            const dbRef = ref(db, "games/" + gameID);
            set(dbRef, gameData);
        }
    }, [gameData]);

    if (loading) {
        return <p> Loading...</p>;
    }
    if (error || user === null || user === undefined) {
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
        <div id="multiplayer" style={{ width: "100%" }}>
            <h1 style={{ textAlign: "center" }}>Multiplayer</h1>
            {!gameID ? (
                <JoinGame setGameID={setGameID} user={user} />
            ) : (
                <Stack spacing={2}>
                    <Stack direction="column">
                        <h3>Game ID: {gameID}</h3>
                        <p>
                            Share the Game ID with your friends for them to join
                            the same game as you!
                        </p>
                        <h3>Players Available: </h3>
                        {gameData && gameData.playerData ? (
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
