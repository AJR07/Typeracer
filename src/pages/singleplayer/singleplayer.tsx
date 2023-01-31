import { getAuth } from "firebase/auth";
import TypeRacer from "./typeracer/typeracer";
import firebaseApp from "../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const auth = getAuth(firebaseApp);

export default function SinglePlayer() {
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
        <div>
            <h1>TypeRacer - Single Player!</h1>
            <TypeRacer
                publicGame={false}
                userIDs={[user.uid]}
                hostID={user.uid}
            />
        </div>
    );
}
