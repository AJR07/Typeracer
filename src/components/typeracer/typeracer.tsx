import { Button, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import Character from "./character";
import Graph from "./graph";
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
    let [arr, setArr] = useState<Character[]>([]);
    let [wrongKeys, setWrongKeys] = useState(0);
    let [totalKeys, setTotalKeys] = useState(0);

    useEffect(() => {
        fetch(
            "https://api.quotable.io/random?" +
                new URLSearchParams({
                    minLength: "50",
                })
        ).then((response) => {
            response.json().then((value) => {
                setQuote(`"${value.content}" - ${value.author}`);
            });
        });
    }, []);

    if (progress === quote.length && quote.length !== 0 && stages !== 3) {
        setStages(3);
    }

    return (
        <div id="typeracer">
            <Stack
                style={{
                    backgroundColor: "#444477",
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
                        }}
                    >
                        <mark
                            style={{
                                backgroundColor: "green",
                                fontFamily: "Fira Code, monospace",
                                fontWeight: "bold",
                            }}
                        >{`${quote.substring(0, progress)}`}</mark>
                        {`${quote.substring(progress, quote.length)}`}
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
                                setArr([{ character: "", time: Date.now() }]);
                            }, 4000);
                        }}
                    >
                        {countdown === null ? "Start" : countdown}
                    </Button>
                ) : stages == 2 ? (
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
                            setTotalKeys(totalKeys + 1);
                            if (
                                val == quote.substring(progress, progress + len)
                            ) {
                                setProgress(progress + len);
                                setCompletedQuote("");
                                let newArr = [...arr];
                                newArr.push({
                                    character: quote.substring(
                                        progress,
                                        progress + len
                                    ),
                                    time: Date.now(),
                                });
                                setArr(newArr);
                            } else {
                                setCompletedQuote(val);
                                setWrongKeys(wrongKeys + 1);
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
