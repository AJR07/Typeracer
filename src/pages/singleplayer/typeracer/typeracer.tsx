import { Button, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import Timer from "../../../components/timer";
import Character from "../../../types/character";
import Graph from "./graph";
import Stages from "../../../types/stages";

export default function TypeRacer() {
    let [quote, setQuote] = useState("");
    let [progress, setProgress] = useState(0);
    let [completedQuote, setCompletedQuote] = useState("");
    let [countdown, setCountdown] = useState<null | number>(null);
    let [stages, setStages] = useState<Stages>(-1);
    let [arr, setArr] = useState<Character[]>([]);
    let [wrongKeys, setWrongKeys] = useState(0);
    let [totalKeys, setTotalKeys] = useState(0);

    useEffect(() => {
        if (stages !== -1) return;
        fetch(
            "https://api.quotable.io/random?" +
                new URLSearchParams({
                    minLength: "50",
                })
        ).then((response) => {
            response.json().then((value) => {
                setQuote(`${value.content}`);
                setStages(1);
            });
        });
    }, []);

    if (progress === quote.length && quote.length !== 0 && stages !== 3) {
        setStages(3);
    }

    return (
        <div id="typeracer" style={{ paddingRight: "1vw" }}>
            <Stack
                style={{
                    backgroundColor: "#0d104f",
                    borderRadius: "1vw",
                    padding: "1vw",
                    marginRight: "1vw",
                }}
            >
                {stages === 2 ? (
                    <h3 style={{ display: "flex", justifyContent: "right" }}>
                        Time Elapsed: <Timer />
                    </h3>
                ) : null}
                <Stack id="text-display">
                    <p
                        style={{
                            fontFamily: "Fira Code, monospace",
                            fontWeight: "bold",
                        }}
                    >
                        <p
                            style={{
                                color: "yellow",
                                fontFamily: "Fira Code, monospace",
                                fontWeight: "bold",
                                display: "inline",
                            }}
                        >{`${quote.substring(0, progress - 1)}`}</p>
                        <u
                            style={{
                                color: "yellow",
                                fontFamily: "Fira Code, monospace",
                                fontWeight: "bold",
                                display: "inline",
                            }}
                        >{`${quote.substring(progress - 1, progress)}`}</u>
                        <p
                            style={{
                                color: "red",
                                fontFamily: "Fira Code, monospace",
                                fontWeight: "bold",
                                display: "inline",
                            }}
                        >{`${completedQuote}`}</p>
                        {`${quote.substring(progress, quote.length)}`}
                    </p>
                </Stack>

                {stages <= 1 ? (
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (countdown !== null || stages == -1) return;
                            setCountdown(3);
                            setTimeout(() => {
                                setCountdown(2);
                            }, 1000);
                            setTimeout(() => {
                                setCountdown(1);
                            }, 2000);
                            setTimeout(() => {
                                setCountdown(0);
                                setStages(2);
                                setArr([
                                    {
                                        character: "",
                                        acc: 100,
                                        time: Date.now(),
                                    },
                                ]);
                            }, 3000);
                        }}
                        color={
                            countdown !== null
                                ? "error"
                                : stages == -1
                                ? "warning"
                                : "success"
                        }
                    >
                        {countdown === null
                            ? stages == -1
                                ? "LOADING QUOTE..."
                                : "START"
                            : countdown}
                    </Button>
                ) : stages == 2 ? (
                    <TextField
                        style={{ opacity: 0, height: 0 }}
                        value={completedQuote}
                        autoFocus
                        id="typeracer-input"
                        onKeyDown={(e) => {
                            // prevent shortcuts
                            if (e.ctrlKey || e.altKey || e.metaKey) {
                                e.preventDefault();
                            }
                        }}
                        onBlur={(e) => {
                            e.target.focus();
                            setTimeout(() => e.target.focus(), 100);
                        }}
                        onChange={(e) => {
                            let val = e.target.value;
                            let len = val.length;
                            setTotalKeys((k) => k + 1);
                            if (
                                val == quote.substring(progress, progress + len)
                            ) {
                                setProgress((p) => p + len);
                                setCompletedQuote("");
                                setArr((arr) => {
                                    let newArr = [...arr];
                                    newArr.push({
                                        character: quote.substring(
                                            progress,
                                            progress + len
                                        ),
                                        acc:
                                            100 - (wrongKeys / totalKeys) * 100,
                                        time: Date.now(),
                                    });
                                    return newArr;
                                });
                            } else {
                                setCompletedQuote(val);
                                setWrongKeys((k) => k + 1);
                            }
                        }}
                    ></TextField>
                ) : (
                    <Graph arr={arr} accuracy={wrongKeys / totalKeys} />
                )}
            </Stack>
        </div>
    );
}
