import { Stack } from "@mui/system";
import ReactECharts from "echarts-for-react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import firebaseApp from "../../../lib/firebase";
import Character from "../../../types/character";
import { UserData } from "../../../types/user";

interface GraphProps {
    arr: Character[];
    accuracy: number;
}

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export default function Graph(props: GraphProps) {
    let [uploadedData, setUploadedData] = useState(false);
    let characterSoFar = 0,
        wpmArray: number[][] = [],
        accArray: number[][] = [];

    for (let char of props.arr) {
        characterSoFar += char.character.length;
        if (wpmArray.length > 0) {
            let wpm =
                60 /
                ((char.time - props.arr[0].time) / 1000 / (characterSoFar / 5));
            wpmArray.push([characterSoFar, Math.round(wpm)]);
            let accuracy = Math.round(char.acc);
            accArray.push([characterSoFar, isNaN(accuracy) ? 0 : accuracy]);
        } else {
            wpmArray.push([0, 0]);
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
                    user.averageWPM.push(wpmArray[wpmArray.length - 1][1]);
                    user.averageAccuracy.push(100 - props.accuracy * 100);
                    user.numberOfGamesPlayed += 1;
                    setDoc(doc(db, "users", uid!), user).catch();
                })
                .catch();
        }
    }, []);

    let options = {
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
            {
                type: "value",
                name: "Accuracy",
                min: 0,
                max: 100,
                interval: 20,
                axisLabel: {
                    formatter: "{value}%",
                },
            },
        ],
        series: [
            {
                name: "WPM",
                tooltip: {
                    valueFormatter: (value: number) => {
                        return value + " WPM";
                    },
                },
                data: wpmArray,
                type: "line",
                smooth: true,
            },
            {
                name: "Accuracy",
                tooltip: {
                    valueFormatter: (value: number) => {
                        return value + "%";
                    },
                },
                data: accArray,
                type: "line",
                smooth: true,
            },
        ],
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
    return (
        <Stack>
            <h3>
                WPM: {Math.round(wpmArray[wpmArray.length - 1][1])} Words Per
                Minute <br />
                Accuracy: {Math.round(100 - props.accuracy * 100)}% <br />{" "}
            </h3>
            <ReactECharts option={options} />{" "}
        </Stack>
    );
}
