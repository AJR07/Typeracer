import { Stack } from "@mui/system";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/**
 * Props for the bubble component
 *
 * @interface BubbleProps
 * @typedef {BubbleProps}
 */
interface BubbleProps {
    /**
     * the link to the page that the bubble will navigate to
     *
     * @type {string}
     */
    to: string;
    /**
     * the name of the page that the bubble will navigate to
     *
     * @type {string}
     */
    name: string;
    /**
     * the description of the page that the bubble will navigate to
     *
     * @type {string}
     */
    description: string;
}

/**
 * A utility function to generate random colours, that are more likely to be dark blue
 *
 * @returns {string}
 */
function getRandomColor() {
    return `rgb(${Math.floor(Math.random() * 20 + 40)}, ${Math.floor(
        Math.random() * 20 + 40
    )}, ${Math.floor(Math.random() * 155 + 100)})`;
}

/**
 * A component that displays a bubble with a name and description that navigates to a page when clicked
 *
 * @export
 * @param {BubbleProps} props
 * @returns {*}
 */
export default function Bubble(props: BubbleProps) {
    // uses the navigate hook to navigate to another page programmatically using react-router
    const navigate = useNavigate();

    const clr = getRandomColor();
    return (
        <motion.div
            // styling the bubble
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "20vw",
                height: "20vw",
                backgroundColor: `${clr}`,
                borderRadius: "12.5vw",
                boxShadow: `0 0 2vw ${clr}`,
            }}
            // animation for the bubble
            whileHover={{
                scale: 1.1,
                transition: { duration: 0.2 },
            }}
            whileTap={{
                scale: 0.9,
                transition: { duration: 0.2 },
            }}
            onClick={() => {
                // this bubble uses the navigate hook to navigate to the page specified by the props
                navigate(props.to);
            }}
        >
            <Stack style={{ textAlign: "center", margin: "2vw" }}>
                <h1 style={{ color: "white", fontSize: "2.5vw" }}>
                    {props.name}
                </h1>
                <p style={{ color: "white", fontSize: "1vw", margin: "0" }}>
                    {props.description}
                </p>
            </Stack>
        </motion.div>
    );
}
