import { LinearProgress } from "@mui/material";
import { Stack } from "@mui/system";
import { PlayerData } from "../../../types/game";

/**
 * Props for the Progress component
 *
 * @interface ProgressProps
 * @typedef {ProgressProps}
 */
interface ProgressProps {
    /**
     * Relevant user data that the progress component intends to show
     *
     * @type {PlayerData}
     */
    userData: PlayerData;
    /**
     * The length of the quote that the user is typing
     *
     * @type {number}
     */
    quoteLength: number;
}

/**
 * Progress component that shows the progress of the user
 *
 * @export
 * @param {ProgressProps} props
 * @returns {*}
 */
export default function Progress(props: ProgressProps) {
    return (
        <Stack
            direction="row"
            style={{ display: "flex", alignItems: "center" }}
        >
            <p style={{ width: "10vw" }}>{props.userData.name}</p>
            {/* Use MUI's progress bar to show and animate between different progress */}
            <LinearProgress
                variant="determinate"
                value={(props.userData.progress / props.quoteLength) * 100}
                sx={{ width: "100%" }}
            />
        </Stack>
    );
}
