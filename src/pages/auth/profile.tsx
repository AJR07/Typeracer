import { getAuth, signOut, User } from "firebase/auth";
import firebaseApp from "../../lib/firebase";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { doc, getFirestore } from "firebase/firestore";
import { UserDataReceive } from "../../types/user";
import { Button } from "@mui/material";
import { useState } from "react";
import ProfileGraph from "./graphs";

/**
 * Reference to the firestore database (long term storage of user data)
 *
 * @type {*}
 */
const db = getFirestore(firebaseApp);
/**
 * Auth of the current app
 *
 * @type {*}
 */
const auth = getAuth(firebaseApp);

/**
 * Props for the profile component - so it can display the user's profile details
 *
 * @interface ProfileProps
 * @typedef {ProfileProps}
 */
interface ProfileProps {
    /**
     * The user's reference variable, so we can access their details
     *
     * @type {User}
     */
    user: User;
}

/**
 * The Profile Component - Displays the user's profile details
 *
 * @export
 * @param {ProfileProps} props
 * @returns {*}
 */
export default function Profile(props: ProfileProps) {
    // useDocumentOnce is a hook that fetches the user's data from the database (from the "users" section)
    const [snapshot, loading, error] = useDocumentOnce(
        doc(db, "users", props.user.uid)
    );
    // state variable: stores the notification message
    let [notification, setNotification] = useState("");

    // if the user's data is still loading, show a loading message
    if (loading) {
        return <p>Loading...</p>;
    }
    // if there is an error, show an error message
    if (error || !snapshot?.exists()) {
        return <h1>An error has occurred while loading your profile.</h1>;
    }

    // show the details of the user's account (name, email, etc.) and the graph
    let user = snapshot.data() as UserDataReceive;
    return (
        <div style={{ width: "100%" }}>
            <h1>Profile of {user.name}</h1>
            <p>
                Account Creation Date:{" "}
                {new Date(user.creationDate.seconds * 1000).toLocaleDateString(
                    "US-en"
                )}
            </p>
            <p>Email: {user.email}</p>
            <p>ID: {user.uid}</p>
            <p>Games Played: {user.numberOfGamesPlayed}</p>
            <ProfileGraph ACC={user.averageAccuracy} WPM={user.averageWPM} />

            <Button
                // provide a button to log out
                variant="contained"
                onClick={() => {
                    signOut(auth).catch(() => {
                        setNotification("An error has occurred.");
                    });
                }}
            >
                Logout
            </Button>
            <p hidden={notification === ""} style={{ color: "red" }}>
                {notification}
            </p>
            <br />
            <br />
        </div>
    );
}
