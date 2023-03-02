import { getAuth } from "firebase/auth";
import TypeRacer from "./typeracer/typeracer";
import firebaseApp from "../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const auth = getAuth(firebaseApp);

export default function SinglePlayer() {
    const [user, loading, error] = useAuthState(auth);
    const [reload, setReload] = useState(true);
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
        <div
            onKeyDown={(e) => {
                if (e.key === "Tab") {
                    e.preventDefault();
                    setReload(false);
                    setTimeout(() => setReload(true), 100);
                }
            }}
        >
            <h1>Singleplayer</h1>
            {reload ? <TypeRacer /> : <></>}
        </div>
    );
}
