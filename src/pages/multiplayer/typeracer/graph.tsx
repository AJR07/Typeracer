import { Stack } from "@mui/system";
import ReactECharts from "echarts-for-react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import firebaseApp from "../../../lib/firebase";
import { UserData } from "../../../types/user";
import { PlayerData } from "../../../types/game";

/**
 * Props for the graph component
 *
 * @interface GraphProps
 * @typedef {GraphProps}
 */
interface GraphProps {
    /**
     * player data to be displayed on the graph
     *
     * @type {{ [id: string]: PlayerData }}
     */
    playerData: { [id: string]: PlayerData };
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
 * Graph component that shows the progress of the WPM and accuracy of the users
 * Also responsible for uploading the results to the web
 *
 * @export
 * @param {GraphProps} props
 * @returns {*}
 */
export default function Graph(props: GraphProps) {
    // State variables that track if the data has been uploaded
    let [uploadedData, setUploadedData] = useState(false);

    // variables to store the users WPM and accuracy of the current user
    let userWPMArray: number[][] = [],
        userAccArray: number[][] = [];

    // constants to be used in options1 and 2
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

    // stores the configurations of the WPM and Accuracy graphs that we want to display
    // we are using a cartesian graph system
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

    // loops through the player data and adds the data to the graph
    for (let playerID in props.playerData) {
        let playerInfo = props.playerData[playerID];
        // tracks the number of characters typed so far
        let characterSoFar = 0,
            wpmArray: number[][] = [],
            accArray: number[][] = [];

        // loops through the array of characters typed and adds the data to the graph
        for (let char of playerInfo.arr) {
            characterSoFar += char.character.length;
            if (wpmArray.length > 0) {
                // WPM calculations
                let wpm =
                    characterSoFar /
                    5 /
                    ((char.time - playerInfo.arr[0].time) / 1000 / 60);
                wpmArray.push([characterSoFar, Math.round(wpm)]);

                // accuracy calculations
                let accuracy = Math.round(char.acc);
                accArray.push([characterSoFar, isNaN(accuracy) ? 0 : accuracy]);
            } else {
                // initial WPM coordinates
                wpmArray.push([0, 0]);
            }
        }
        // add the user's WPM and accuracy to the graph
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

        // if the player that we are processing is the current user, store the data in the userWPMArray and userAccArray
        if (playerID === auth.currentUser?.uid) {
            userWPMArray = wpmArray;
            userAccArray = accArray;
        }
    }

    // upload the data to the database
    useEffect(() => {
        // don't upload if it has been uploaded
        if (uploadedData) return;

        let uid = auth.currentUser?.uid;
        if (!uid) return;
        else {
            // set the uploadedData to true so that we don't upload the data again
            setUploadedData(true);
            // upload the data
            getDoc(doc(db, "users", uid))
                .then((val) => {
                    // parse the user's data to add it to the history of the user
                    let userData = val.data();
                    if (userData === undefined) return;

                    let user = userData as UserData;
                    user.averageWPM.push(
                        userWPMArray[userWPMArray.length - 1][1]
                    );
                    user.averageAccuracy.push(
                        userAccArray[userAccArray.length - 1][1]
                    );
                    // increment the number of games played
                    user.numberOfGamesPlayed += 1;
                    // update the user's data
                    setDoc(doc(db, "users", uid!), user).catch();
                })
                .catch();
        }
    }, []);

    // display the data!
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
