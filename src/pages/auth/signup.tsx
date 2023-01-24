import { Button, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import {
    createUserWithEmailAndPassword,
    getAuth,
    signOut,
} from "firebase/auth";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import firebaseApp from "../../lib/firebase";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { UserData } from "../../types/user";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

function SignUpWithEmailPassword(
    name: string,
    email: string,
    password: string,
    setNotification: React.Dispatch<React.SetStateAction<string>>
) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            setDoc(doc(db, "users", userCredential.user.uid), {
                name: name,
                email: email,
                uid: userCredential.user.uid,
                creationDate: new Date(),
                averageWPM: 0,
                averageAccuracy: 0,
                numberOfGamesPlayed: 0,
            } as UserData).catch(() => {
                setNotification("An error has occurred.");
                signOut(auth);
            });
        })
        .catch((error) => {
            console.log(error);
            setNotification(
                "An error has occurred. Please ensure that your email is valid and your password is strong."
            );
        });
}

export default function SignUp() {
    let [name, setName] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [confirmPassword, setConfirmPassword] = useState("");
    let [notification, setNotification] = useState("");

    useEffect(() => {
        if (notification !== "") {
            setTimeout(() => {
                setNotification("");
            }, 5000);
        }
    }, [notification]);

    return (
        <motion.div
            style={{
                backgroundColor: "rgba(150, 255, 50, 0.6)",
                width: "95vw",
                marginLeft: "1vw",
                borderTopLeftRadius: "1vw",
                borderBottomLeftRadius: "1vw",
            }}
            whileHover={{
                backgroundColor: "rgba(150, 255, 50, 0.7)",
            }}
        >
            <Stack
                direction="column"
                style={{ display: "flex", alignItems: "center" }}
                spacing={2}
            >
                <div style={{ textAlign: "center" }}>
                    <h1 style={{ marginBottom: "0", color: "black" }}>
                        Sign Up
                    </h1>
                    <p style={{ color: "black" }}>
                        If you don't have an account.
                    </p>
                </div>
                <TextField
                    label="Name"
                    style={{ width: "80vw" }}
                    onChange={(evt) => {
                        setName(evt.target.value);
                    }}
                    value={name}
                />
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
                <TextField
                    label="Confirm Password"
                    style={{ width: "80vw" }}
                    type="password"
                    onChange={(evt) => {
                        setConfirmPassword(evt.target.value);
                    }}
                    value={confirmPassword}
                />

                <Button
                    variant="contained"
                    style={{ marginBottom: "1vw" }}
                    onClick={() => {
                        if (password === confirmPassword) {
                            SignUpWithEmailPassword(
                                name,
                                email,
                                password,
                                setNotification
                            );
                        } else {
                            setNotification(
                                "Your passwords do not match. Please try again."
                            );
                        }
                    }}
                >
                    Submit
                </Button>
                <p
                    id="notification"
                    hidden={notification === ""}
                    style={{ marginBottom: "1vw", color: "red" }}
                >
                    {notification}
                </p>
            </Stack>
        </motion.div>
    );
}
