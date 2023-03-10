import { Stack } from "@mui/system";
import ReactECharts from "echarts-for-react";

interface GraphProps {
    WPM: number[];
    ACC: number[];
}

export default function ProfileGraph(props: GraphProps) {
    let parsedWPM = props.WPM.map((value, index) => {
        return [index, value];
    });
    let parsedACC = props.ACC.map((value, index) => {
        return [index, value];
    });

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
    return (
        <Stack>
            <h3>Account Progress</h3>
            <ReactECharts option={options1} />
            <ReactECharts option={options2} />
        </Stack>
    );
}
