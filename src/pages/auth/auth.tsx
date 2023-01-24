import firebaseApp from "../../lib/firebase";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Profile from "./profile";
import { motion } from "framer-motion";
import { Button, Stack, TextField } from "@mui/material";
import SignIn from "./signin";
import SignUp from "./signup";

const auth = getAuth(firebaseApp);

export default function SignInOrUp() {
    const [user, loading, error] = useAuthState(auth);
    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <h1>An error has occurred while loading your profile.</h1>;
    }
    if (user !== null && user !== undefined) {
        return <Profile user={user} />;
    }

    return (
        <Stack
            style={{ width: "100%", margin: "0" }}
            direction="column"
            spacing={3}
        >
            <SignUp />
            <SignIn />
        </Stack>
    );
}
