import { Stack } from "@mui/system";
import ReactECharts from "echarts-for-react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import firebaseApp from "../../../lib/firebase";
import { UserData } from "../../../types/user";
import { PlayerData } from "../../../types/game";

interface GraphProps {
    playerData: { [id: string]: PlayerData };
}

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export default function Graph(props: GraphProps) {
    let [uploadedData, setUploadedData] = useState(false);
    let userWPMArray: number[][] = [],
        userAccArray: number[][] = [];
    const series: {
            name: string;
            tooltip: { valueFormatter: (value: number) => string };
            data: number[][];
            type: string;
            smooth: true;
        }[] = [],
        series2: {
            name: string;
            tooltip: { valueFormatter: (value: number) => string };
            data: number[][];
            type: string;
            smooth: true;
        }[] = [];
    let options1 = {
            xAxis: {
                name: "Characters Typed",
                type: "value",
                axisLabel: {
                    formatter: "{value} Characters",
                },
            },
            yAxis: [
                {
                    type: "value",
                    name: "Words Per Minute",
                    axisLabel: {
                        formatter: "{value} WPM",
                    },
                },
            ],
            series: series,
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                },
            },
            toolbox: {
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ["line", "bar"] },
                    saveAsImage: { show: true },
                },
            },
        },
        options2 = {
            xAxis: {
                name: "Characters Typed",
                type: "value",
                axisLabel: {
                    formatter: "{value} Characters",
                },
            },
            yAxis: {
                type: "value",
                name: "Accuracy",
                min: 0,
                max: 100,
                interval: 20,
                axisLabel: {
                    formatter: "{value}%",
                },
            },
            series: series2,
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                },
            },
            toolbox: {
                feature: {
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ["line", "bar"] },
                    saveAsImage: { show: true },
                },
            },
        };

    for (let playerID in props.playerData) {
        let playerInfo = props.playerData[playerID];
        let characterSoFar = 0,
            wpmArray: number[][] = [],
            accArray: number[][] = [];
        for (let char of playerInfo.arr) {
            characterSoFar += char.character.length;
            if (wpmArray.length > 0) {
                let wpm =
                    characterSoFar /
                    5 /
                    ((char.time - playerInfo.arr[0].time) / 1000) /
                    60;
                wpmArray.push([characterSoFar, Math.round(wpm)]);
                let accuracy = Math.round(char.acc);
                accArray.push([characterSoFar, isNaN(accuracy) ? 0 : accuracy]);
            } else {
                wpmArray.push([0, 0]);
            }
        }
        options1.series.push({
            name: `${playerInfo.name} - WPM`,
            tooltip: {
                valueFormatter: (value: number) => {
                    return value + " WPM";
                },
            },
            data: wpmArray,
            type: "line",
            smooth: true,
        });
        options2.series.push({
            name: `${playerInfo.name} - Accuracy`,
            tooltip: {
                valueFormatter: (value: number) => {
                    return value + "%";
                },
            },
            data: accArray,
            type: "line",
            smooth: true,
        });

        if (playerID === auth.currentUser?.uid) {
            userWPMArray = wpmArray;
            userAccArray = accArray;
        }
    }

    useEffect(() => {
        if (uploadedData) return;

        let uid = auth.currentUser?.uid;
        if (!uid) return;
        else {
            setUploadedData(true);
            getDoc(doc(db, "users", uid))
                .then((val) => {
                    let userData = val.data();
                    if (userData === undefined) return;

                    let user = userData as UserData;
                    user.averageWPM.push(
                        userWPMArray[userWPMArray.length - 1][1]
                    );
                    user.averageAccuracy.push(
                        userAccArray[userAccArray.length - 1][1]
                    );
                    user.numberOfGamesPlayed += 1;
                    setDoc(doc(db, "users", uid!), user).catch();
                })
                .catch();
        }
    }, []);

    return (
        <Stack>
            <h3>
                WPM: {Math.round(userWPMArray[userWPMArray.length - 1][1])}{" "}
                Words Per Minute <br />
                Accuracy: {Math.round(userAccArray[userAccArray.length - 1][1])}
                % <br />{" "}
            </h3>
            <ReactECharts option={options1} />
            <ReactECharts option={options2} />
        </Stack>
    );
}
