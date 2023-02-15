import { Button, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import Timer from "../../../components/timer";
import Game from "../../../types/game";
import Graph from "./graph";

interface TypeRacerProps {
    gameData: Game;
    setGameData: React.Dispatch<React.SetStateAction<Game | null>>;
    user: User;
}

export default function TypeRacer(props: TypeRacerProps) {
    let [completedQuote, setCompletedQuote] = useState("");

    useEffect(() => {
        if (props.gameData.stages == 3) return;

        let allComplete = true;
        for (let player of Object.entries(props.gameData.playerData)) {
            if (player[1].progress < props.gameData.quote.length) {
                allComplete = false;
                break;
            }
        }
        if (allComplete) {
            props.setGameData({
                ...props.gameData,
                stages: 3,
            });
        }
    }, [props.gameData]);

    let userData = getOwnData(props.gameData, props.user);

    return (
        <div id="typeracer">
            <Stack
                style={{
                    backgroundColor: "#0d104f",
                    borderRadius: "1vw",
                    padding: "1vw",
                    marginRight: "1vw",
                }}
            >
                {props.gameData.stages === 2 ? (
                    <h3 style={{ display: "flex", justifyContent: "right" }}>
                        Time Elapsed: <Timer />
                    </h3>
                ) : null}
                <Stack id="text-display">
                    <div
                        style={{
                            fontFamily: "Fira Code, monospace",
                            fontWeight: "bold",
                            padding: "1vw",
                        }}
                    >
                        <p
                            style={{
                                color: "yellow",
                                fontFamily: "Fira Code, monospace",
                                fontWeight: "bold",
                                display: "inline",
                            }}
                        >{`${props.gameData.quote.substring(
                            0,
                            userData.progress - 1
                        )}`}</p>
                        <u
                            style={{
                                color: "yellow",
                                fontFamily: "Fira Code, monospace",
                                fontWeight: "bold",
                                display: "inline",
                            }}
                        >{`${props.gameData.quote.substring(
                            userData.progress - 1,
                            userData.progress
                        )}`}</u>
                        <p
                            style={{
                                color: "red",
                                fontFamily: "Fira Code, monospace",
                                fontWeight: "bold",
                                display: "inline",
                            }}
                        >{`${props.gameData.quote.substring(
                            userData.progress,
                            Math.min(
                                userData.progress + completedQuote.length,
                                props.gameData.quote.length
                            )
                        )}`}</p>
                        {`${props.gameData.quote.substring(
                            Math.min(
                                userData.progress + completedQuote.length,
                                props.gameData.quote.length
                            ),
                            props.gameData.quote.length
                        )}`}
                    </div>
                </Stack>

                {props.gameData.stages <= 1 ? (
                    <div>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => {
                                if (
                                    !checkHost(props.gameData, props.user) ||
                                    props.gameData.countdown !== 4
                                )
                                    return;
                                setTimeout(() => {
                                    props.setGameData({
                                        ...props.gameData,
                                        countdown: 3,
                                    });
                                }, 1000);
                                setTimeout(() => {
                                    props.setGameData({
                                        ...props.gameData,
                                        countdown: 2,
                                    });
                                }, 2000);
                                setTimeout(() => {
                                    props.setGameData({
                                        ...props.gameData,
                                        countdown: 1,
                                    });
                                }, 3000);
                                setTimeout(() => {
                                    props.setGameData({
                                        ...props.gameData,
                                        countdown: 0,
                                        stages: 2,
                                    });
                                }, 4000);
                            }}
                            color={
                                !checkHost(props.gameData, props.user)
                                    ? "warning"
                                    : props.gameData.countdown !== 4
                                    ? "error"
                                    : "success"
                            }
                        >
                            {props.gameData.countdown === 4
                                ? checkHost(props.gameData, props.user)
                                    ? "Start"
                                    : "Waiting for host to start"
                                : props.gameData.countdown}
                        </Button>
                    </div>
                ) : props.gameData.stages == 2 ? (
                    <TextField
                        style={{
                            backgroundColor: "#ddffdd",
                            borderRadius: "1vw",
                            padding: "1vw",
                            marginRight: "1vw",
                        }}
                        value={completedQuote}
                        onKeyDown={(e) => {
                            // prevent shortcuts
                            if (e.ctrlKey || e.altKey || e.metaKey) {
                                e.preventDefault();
                            }
                        }}
                        onChange={(e) => {
                            // let val = e.target.value;
                            // let len = val.length;
                            // setTotalKeys((k) => k + 1);
                            // if (
                            //     val == quote.substring(progress, progress + len)
                            // ) {
                            //     setProgress((p) => p + len);
                            //     setCompletedQuote("");
                            //     setArr((arr) => {
                            //         let newArr = [...arr];
                            //         newArr.push({
                            //             character: quote.substring(
                            //                 progress,
                            //                 progress + len
                            //             ),
                            //             acc:
                            //                 100 - (wrongKeys / totalKeys) * 100,
                            //             time: Date.now(),
                            //         });
                            //         return newArr;
                            //     });
                            // } else {
                            //     setCompletedQuote(val);
                            //     setWrongKeys((k) => k + 1);
                            // }
                        }}
                    ></TextField>
                ) : (
                    <Graph
                        arr={userData.arr}
                        accuracy={userData.wrongKeys / userData.totalKeys}
                    />
                )}
            </Stack>
        </div>
    );
}

function getOwnData(data: Game, user: User) {
    return data.playerData[user.uid];
}

function checkHost(data: Game, user: User) {
    if (data.hostID === user.uid) return true;
    return false;
}
