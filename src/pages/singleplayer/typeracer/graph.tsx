import { Stack } from "@mui/system";
import ReactECharts from "echarts-for-react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import firebaseApp from "../../../lib/firebase";
import Character from "../../../types/character";
import { UserData } from "../../../types/user";

/**
 * Props for the graph component
 *
 * @interface GraphProps
 * @typedef {GraphProps}
 */
interface GraphProps {
    /**
     * character data to be displayed on the graph
     *
     * @type {Character[]}
     */
    arr: Character[];
    /**
     * Final accuracy of the user
     *
     * @type {number}
     */
    accuracy: number;
}

/**
 * Firestore - Database that stores user data in the long term
 *
 * @type {*}
 */
const db = getFirestore(firebaseApp);
/**
 * Authentication - Firebase's authentication service
 *
 * @type {*}
 */
const auth = getAuth(firebaseApp);

/**
 * Graph component that shows the progress of the WPM and accuracy of the user
 *
 * @export
 * @param {GraphProps} props
 * @returns {*}
 */
export default function Graph(props: GraphProps) {
    // State variables that track if the data has been uploaded
    let [uploadedData, setUploadedData] = useState(false);

    // variables to store the users WPM and accuracy of the current user
    let characterSoFar = 0,
        wpmArray: number[][] = [],
        accArray: number[][] = [];

    // perform WPM and Accuracy calculations on all the characters that the user has typed
    for (let char of props.arr) {
        // track the number of characters typed so far
        characterSoFar += char.character.length;
        if (wpmArray.length > 0) {
            // calculate the WPM and accuracy of the user
            let wpm =
                characterSoFar /
                5 /
                ((char.time - props.arr[0].time) / 1000 / 60);
            wpmArray.push([characterSoFar, Math.round(wpm)]);
            let accuracy = Math.round(char.acc);
            accArray.push([characterSoFar, isNaN(accuracy) ? 0 : accuracy]);
        } else {
            // push the initial values to the arrays
            wpmArray.push([0, 0]);
        }
    }

    // upload the data to the database only initially
    useEffect(() => {
        // if the data has already been uploaded, return
        if (uploadedData) return;

        let uid = auth.currentUser?.uid;
        if (!uid) return;
        else {
            // set the uploadedData to true so that the data is not uploaded again
            setUploadedData(true);
            // get the user data from the database
            getDoc(doc(db, "users", uid))
                .then((val) => {
                    // so that we can update the user data
                    let userData = val.data();
                    if (userData === undefined) return;

                    // update the user's WPM and Accuracy Histories
                    let user = userData as UserData;
                    user.averageWPM.push(wpmArray[wpmArray.length - 1][1]);
                    user.averageAccuracy.push(
                        Math.round(100 - props.accuracy * 100)
                    );
                    // increment the number of games played
                    user.numberOfGamesPlayed += 1;
                    // update the user data in the database
                    setDoc(doc(db, "users", uid!), user).catch();
                })
                .catch();
        }
    }, []);

    // use one configuration to display both the WPM and Accuracy
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

    // display the statistics of the current game
    return (
        <Stack>
            <h3>
                WPM: {Math.round(wpmArray[wpmArray.length - 1][1])} Words Per
                Minute <br />
                Accuracy: {Math.round(100 - props.accuracy * 100)}%
            </h3>
            <ReactECharts option={options} />{" "}
        </Stack>
    );
}
