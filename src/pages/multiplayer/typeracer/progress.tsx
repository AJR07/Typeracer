import { LinearProgress } from "@mui/material";
import { Stack } from "@mui/system";
import { PlayerData } from "../../../types/game";

interface ProgressProps {
    userData: PlayerData;
    quoteLength: number;
}

export default function Progress(props: ProgressProps) {
    console.log((props.userData.progress / props.quoteLength) * 100);
    return (
        <Stack
            direction="row"
            style={{ display: "flex", alignItems: "center" }}
        >
            <p style={{ width: "10vw" }}>{props.userData.name}</p>
            <LinearProgress
                variant="determinate"
                value={(props.userData.progress / props.quoteLength) * 100}
                sx={{ width: "100%" }}
            />
        </Stack>
    );
}
