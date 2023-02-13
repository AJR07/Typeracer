import { Button } from "@mui/material";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import firebaseApp from "../../lib/firebase";
import JoinGame from "./joingame";

const auth = getAuth(firebaseApp);

export default function MultiPlayer() {
    const [gameID, setGameID] = useState<string | null>(null);
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();

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
