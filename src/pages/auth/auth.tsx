import firebaseApp from "../../lib/firebase";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Profile from "./profile";
import { Stack } from "@mui/material";
import SignIn from "./signin";
import SignUp from "./signup";

/**
 * Auth of the current app
 *
 * @type {*}
 */
const auth = getAuth(firebaseApp);

/**
 * Main Auth Page - Decide whether to show the sign in or sign up page based on if the user is signed in or not
 *
 * @export
 * @returns {*}
 */
export default function SignInOrUp() {
    // useAuthState is a hook that listens to changes in the auth state
    const [user, loading, error] = useAuthState(auth);

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <h1>An error has occurred while loading your profile.</h1>;
    }
    if (user !== null && user !== undefined) {
        // If the user is signed in, show the profile page
        return <Profile user={user} />;
    }

    // If the user is not signed in, show the sign in and sign up page
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
