import { Stack } from "@mui/system";
import ReactECharts from "echarts-for-react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import firebaseApp from "../../../lib/firebase";
import { UserData } from "../../../types/user";
import Character from "./character";

interface GraphProps {
    arr: Character[];
    accuracy: number;
}

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export default function Graph(props: GraphProps) {
    let [uploadedData, setUploadedData] = useState(false);
    let characterSoFar = 0,
        cpmArray: number[][] = [],
        accArray: number[][] = [],
        spaces = 0;

    for (let char of props.arr) {
        characterSoFar += char.character.length;
        if (cpmArray.length > 0) {
            let cpm =
                60 / ((char.time - props.arr[0].time) / 1000 / characterSoFar);
            cpmArray.push([characterSoFar, Math.round(cpm)]);
            let accuracy = Math.round(char.acc);
            accArray.push([characterSoFar, isNaN(accuracy) ? 0 : accuracy]);
        } else {
            cpmArray.push([0, 0]);
        }
        for (let charr of char.character) {
            if (charr == " ") spaces++;
        }
    }

    let wpm =
        60 /
        ((props.arr[props.arr.length - 1].time - props.arr[0].time) /
            1000 /
            spaces);

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
                    user.averageWPM.push(wpm);
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
                name: "Characters Per Minute",
                axisLabel: {
                    formatter: "{value} CPM",
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
                name: "CPM",
                tooltip: {
                    valueFormatter: (value: number) => {
                        return value + " CPM";
                    },
                },
                data: cpmArray,
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
                WPM: {Math.round(wpm)} Words Per Minute <br />
                CPM: {Math.round(cpmArray[cpmArray.length - 1][1])} Characters
                Per Minute <br />
                Accuracy: {Math.round(100 - props.accuracy * 100)}% <br />{" "}
            </h3>
            <ReactECharts option={options} />{" "}
        </Stack>
    );
}
