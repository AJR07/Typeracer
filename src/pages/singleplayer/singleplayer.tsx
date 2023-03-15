import { getAuth } from "firebase/auth";
import TypeRacer from "./typeracer/typeracer";
import firebaseApp from "../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

/**
 * Authentication - Firebase's authentication service
 *
 * @type {*}
 */
const auth = getAuth(firebaseApp);

/**
 * Singleplayer component that shows the singleplayer page
 *
 * @export
 * @returns {*}
 */
export default function SinglePlayer() {
    // useAuthState is a hook that tracks the user's state
    const [user, loading, error] = useAuthState(auth);
    // useNavigate is a hook that allows us to navigate to different pages
    const navigate = useNavigate();
    // reload is a state variable that is used to reload the typeracer component (so that the user can press "tab" to reload)
    const [reload, setReload] = useState(true);

    if (loading) {
        // If the user is still loading, show a loading message
        return <p> Loading...</p>;
    }
    if (error || user === null || user === undefined) {
        // If there is an error, or the user is not signed in, show an error message
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

    // If the user is signed in, show the singleplayer page
    return (
        <div
            onKeyDown={(e) => {
                // logic to reload the typeracer component if the user presses "tab"
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
