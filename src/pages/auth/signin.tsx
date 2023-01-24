import { Button, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { motion } from "framer-motion";
import { useState } from "react";
import firebaseApp from "../../lib/firebase";

const auth = getAuth(firebaseApp);

export default function SignIn() {
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [notification, setNotification] = useState("");

    return (
        <motion.div
            style={{
                backgroundColor: "rgba(50, 255, 150, 0.6)",
                width: "95vw",
                marginLeft: "1vw",
                borderTopLeftRadius: "1vw",
                borderBottomLeftRadius: "1vw",
            }}
            whileHover={{
                backgroundColor: "rgba(50, 255, 150, 0.7)",
            }}
        >
            <Stack
                direction="column"
                style={{ display: "flex", alignItems: "center" }}
                spacing={2}
            >
                <div style={{ textAlign: "center" }}>
                    <h1 style={{ marginBottom: "0", color: "black" }}>
                        Sign In
                    </h1>
                    <p style={{ color: "black" }}>If you have an account.</p>
                </div>
                <TextField
                    label="Email"
                    style={{ width: "80vw" }}
                    onChange={(evt) => {
                        setEmail(evt.target.value);
                    }}
                    value={email}
                />
                <TextField
                    label="Password"
                    style={{ width: "80vw" }}
                    type="password"
                    onChange={(evt) => {
                        setPassword(evt.target.value);
                    }}
                    value={password}
                />
                <Button
                    variant="contained"
                    style={{ marginBottom: "1vw" }}
                    onClick={() => {
                        signInWithEmailAndPassword(auth, email, password).catch(
                            () => {
                                setNotification("Invalid email or password.");
                            }
                        );
                    }}
                >
                    Submit
                </Button>
                <p
                    id="notification"
                    hidden={notification === ""}
                    style={{ color: "red", paddingBottom: "1vw" }}
                >
                    {notification}
                </p>
            </Stack>
        </motion.div>
    );
}
