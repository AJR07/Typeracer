import { Button, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { paragraph } from "txtgen";
import Stages from "./stages";

interface TypeRacerProps {
    publicGame: boolean;
    userIDs: string[];
    hostID: string;
}

export default function TypeRacer(props: TypeRacerProps) {
    let [quote, setQuote] = useState("");
    let [progress, setProgress] = useState(0);
    let [completedQuote, setCompletedQuote] = useState("");
    let [countdown, setCountdown] = useState<null | number>(null);
    let [stages, setStages] = useState<Stages>(props.publicGame ? 0 : 1);

    useEffect(() => {
        let rand = Math.floor(Math.random() * 10000);
        while (rand != 0) {
            paragraph(5);
            rand--;
        }
        setQuote(paragraph(5));
    }, []);

    let blankSpace = "";
    for (let i = 0; i < progress; i++) {
        blankSpace += "&nbsp;";
    }

    return (
        <div id="typeracer">
            <Stack
                style={{
                    backgroundColor: "#337733",
                    borderRadius: "1vw",
                    padding: "1vw",
                    marginRight: "1vw",
                }}
            >
                <Stack id="text-display">
                    <p
                        style={{
                            fontFamily: "Fira Code, monospace",
                            fontWeight: "bold",
                            marginRight: "2vw",
                            color: "yellow",
                        }}
                    >
                        {quote}
                    </p>
                    <p
                        style={{
                            fontFamily: "Fira Code, monospace",
                            fontWeight: "bold",
                            position: "absolute",
                            zIndex: 2,
                        }}
                    >
                        {`${quote.substring(0, progress)}`}
                    </p>
                </Stack>

                {stages <= 1 ? (
                    <Button
                        variant="contained"
                        onClick={() => {
                            setTimeout(() => {
                                setCountdown(3);
                            }, 1000);
                            setTimeout(() => {
                                setCountdown(2);
                            }, 2000);
                            setTimeout(() => {
                                setCountdown(1);
                            }, 3000);
                            setTimeout(() => {
                                setCountdown(0);
                                setStages(2);
                            }, 4000);
                        }}
                    >
                        {countdown === null ? "Start" : countdown}
                    </Button>
                ) : (
                    <TextField
                        style={{
                            backgroundColor: "#ddffdd",
                            borderRadius: "1vw",
                            padding: "1vw",
                            marginRight: "1vw",
                        }}
                        value={completedQuote}
                        onChange={(e) => {
                            let val = e.target.value;
                            let len = val.length;
                            if (
                                val == quote.substring(progress, progress + len)
                            ) {
                                setProgress(progress + len);
                                setCompletedQuote("");
                            } else {
                                setCompletedQuote(val);
                            }
                        }}
                    ></TextField>
                )}
            </Stack>
        </div>
    );
}
