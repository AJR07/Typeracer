import { getAuth, signOut, User } from "firebase/auth";
import firebaseApp from "../../lib/firebase";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { doc, getFirestore } from "firebase/firestore";
import { UserDataReceive } from "../../types/user";
import { Button } from "@mui/material";
import { useState } from "react";

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

interface ProfileProps {
    user: User;
}

export default function Profile(props: ProfileProps) {
    const [snapshot, loading, error] = useDocumentOnce(
        doc(db, "users", props.user.uid)
    );
    let [notification, setNotification] = useState("");

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error || !snapshot?.exists()) {
        return <h1>An error has occurred while loading your profile.</h1>;
    }

    let user = snapshot.data() as UserDataReceive;
    return (
        <div>
            <h1>Profile of {user.name}</h1>
            <p>
                Account Creation Date:{" "}
                {new Date(user.creationDate.seconds * 1000).toLocaleDateString(
                    "US-en"
                )}
            </p>
            <p>Email: {user.email}</p>
            <p>WPM: {user.averageWPM}</p>
            <p>Accuracy: {user.averageAccuracy}</p>
            <p>Games Played: {user.numberOfGamesPlayed}</p>

            <Button
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
        </div>
    );
}
