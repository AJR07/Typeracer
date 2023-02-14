import { Button } from "@mui/material";
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import firebaseApp from "../../lib/firebase";
import Game from "../../types/game";
import JoinGame from "./joingame";

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
            console.log(gameData);
        });
    }, [gameID]);

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

    return (
        <div id="multiplayer" style={{ width: "100%" }}>
            <h1 style={{ textAlign: "center" }}>Multiplayer</h1>
            {!gameID ? (
                <JoinGame setGameID={setGameID} user={user} />
            ) : (
                <div>
                    <h1>Game ID: {gameID}</h1>
                </div>
            )}
        </div>
    );
}
