import firebaseApp from "../../lib/firebase";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import Profile from "./profile";
import { motion } from "framer-motion";
import { Stack } from "@mui/material";

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
        <Stack style={{ width: "100%" }} direction="column" spacing={3}>
            <motion.div
                style={{
                    backgroundColor: "rgba(150, 255, 50, 0.6)",
                    width: "94vw",
                    marginLeft: "1vw",
                    borderTopLeftRadius: "1vw",
                    borderBottomLeftRadius: "1vw",
                }}
                whileHover={{
                    backgroundColor: "rgba(150, 255, 50, 0.5)",
                    borderTopLeftRadius: "1.5vw",
                    borderBottomLeftRadius: "1.5vw",
                }}
            >
                <Stack direction="column">
                    <h1 style={{ textAlign: "center", marginBottom: "0" }}>
                        Sign Up
                    </h1>
                    <h3 style={{ textAlign: "center" }}>
                        If you have an account.
                    </h3>
                </Stack>
            </motion.div>

            <motion.div
                style={{
                    backgroundColor: "rgba(50, 255, 150, 0.6)",
                    width: "94vw",
                    marginLeft: "1vw",
                    borderTopLeftRadius: "1vw",
                    borderBottomLeftRadius: "1vw",
                }}
                whileHover={{
                    backgroundColor: "rgba(50, 255, 150, 0.5)",
                    borderTopLeftRadius: "1.5vw",
                    borderBottomLeftRadius: "1.5vw",
                }}
            >
                <Stack direction="column">
                    <h1 style={{ textAlign: "center", marginBottom: "0" }}>
                        Sign In
                    </h1>
                    <h3 style={{ textAlign: "center" }}>
                        If you have an account.
                    </h3>
                </Stack>
            </motion.div>
        </Stack>
    );
}
