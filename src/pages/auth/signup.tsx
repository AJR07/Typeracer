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

/**
 * Auth of the current app
 *
 * @type {*}
 */
const auth = getAuth(firebaseApp);
/**
 * Reference to the firestore database (long term storage of user data)
 *
 * @type {*}
 */
const db = getFirestore(firebaseApp);

/**
 * Function to manage the signing up of users, using their email and password
 *
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @param {React.Dispatch<React.SetStateAction<string>>} setNotification
 */
function SignUpWithEmailPassword(
    name: string,
    email: string,
    password: string,
    setNotification: React.Dispatch<React.SetStateAction<string>>
) {
    // Create the user with the email and password, using Firebase Auth
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // if the user is successfully created, add their details to the database
            setDoc(doc(db, "users", userCredential.user.uid), {
                name: name,
                email: email,
                uid: userCredential.user.uid,
                creationDate: new Date(),
                averageWPM: [],
                averageAccuracy: [],
                numberOfGamesPlayed: 0,
            } as UserData).catch(() => {
                // if there is an error, show an error message
                setNotification("An error has occurred.");
                signOut(auth);
            });
        })
        .catch((error) => {
            // if there is an error, show an error message
            setNotification(
                "An error has occurred. Please ensure that your email is valid and your password is strong."
            );
        });
}

/**
 * The Sign Up Component - Displays the sign up form
 *
 * @export
 * @returns {*}
 */
export default function SignUp() {
    // state variables: stores the user's details, and the notification message
    let [name, setName] = useState("");
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");
    let [confirmPassword, setConfirmPassword] = useState("");
    let [notification, setNotification] = useState("");

    useEffect(() => {
        // if there is a notification message, show it for 5 seconds, after which remove it
        if (notification !== "") {
            setTimeout(() => {
                setNotification("");
            }, 5000);
        }
    }, [notification]);

    // show the sign up form - with the notification message if there is one
    // consists of: name, email, password, confirm password text fields, and a sign up button
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
                {/* Create text-fields that update state variables to track details of user input */}
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
                            // if the passwords match, sign up the user
                            SignUpWithEmailPassword(
                                name,
                                email,
                                password,
                                setNotification
                            );
                        } else {
                            // if the passwords do not match, show an error message
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
