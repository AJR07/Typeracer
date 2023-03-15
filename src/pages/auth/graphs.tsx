import { Stack } from "@mui/system";
import ReactECharts from "echarts-for-react";

/**
 * Props for the graph component - so it can display the user's WPM and Accuracy history
 *
 * @interface GraphProps
 * @typedef {GraphProps}
 */
interface GraphProps {
    /**
     * The user's WPM History
     *
     * @type {number[]}
     */
    WPM: number[];
    /**
     * The user's Accuracy History
     *
     * @type {number[]}
     */
    ACC: number[];
}

/**
 * The Graph Component - Displays the user's WPM and Accuracy history
 *
 * @export
 * @param {GraphProps} props
 * @returns {*}
 */
export default function ProfileGraph(props: GraphProps) {
    // using JS Map to parse WPM and Accuracy
    let parsedWPM = props.WPM.map((value, index) => {
        return [index, value];
    });
    let parsedACC = props.ACC.map((value, index) => {
        return [index, value];
    });

    // 2 "options" variables so that we can customise the look of the graphs
    // 1 option variable for WPM and 1 for Accuracy
    let options1 = {
            xAxis: {
                name: "Games Games",
                type: "value",
                axisLabel: {
                    formatter: "{value} Games",
                },
            },
            yAxis: {
                type: "value",
                name: "Accuracy",
                min: 0,
                max: 100,
                axisLabel: {
                    formatter: "{value}%",
                },
            },
            series: {
                name: "Accuracy",
                tooltip: {
                    valueFormatter: (value: number) => {
                        return value + "%";
                    },
                },
                data: parsedACC,
                type: "line",
                smooth: true,
            },
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
                name: "Games Games",
                type: "value",
                axisLabel: {
                    formatter: "{value} Games",
                },
            },
            yAxis: {
                type: "value",
                name: "Words Per Minute",
                axisLabel: {
                    formatter: "{value} WPM",
                },
            },
            series: {
                name: "WPM",
                tooltip: {
                    valueFormatter: (value: number) => {
                        return value + " WPM";
                    },
                },
                data: parsedWPM,
                type: "line",
                smooth: true,
            },
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

    // parse those options variables to ReactECharts so it can process and display it for us.
    return (
        <Stack>
            <h3>Account Progress</h3>
            <ReactECharts option={options1} />
            <ReactECharts option={options2} />
        </Stack>
    );
}
