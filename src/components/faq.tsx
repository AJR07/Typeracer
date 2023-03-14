import { IconButton } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import { motion } from "framer-motion";

/**
 * Props for the FAQ Component
 *
 * @interface FAQComponentProps
 * @typedef {FAQComponentProps}
 */
interface FAQComponentProps {
    /**
     * The question/title of the dropdown
     *
     * @type {string}
     */
    question: string;
    /**
     * The hidden text, revealed after opening the dropdown
     *
     * @type {string}
     */
    answer: string;
}

/**
 * A dropdown/FAQ component
 *
 * @export
 * @param {FAQComponentProps} props
 * @returns {*}
 */
export default function FAQComponent(props: FAQComponentProps) {
    // control whether the embedded text is hidden or not
    let [hidden, setHidden] = useState(true);

    return (
        <div className="faq" style={{ textAlign: "left" }}>
            <Stack
                id="toggle"
                direction="row"
                spacing={1}
                onClick={() => setHidden(!hidden)}
                style={{ cursor: "pointer" }}
            >
                <IconButton
                    // this is the logic and styles behind the dropdown and how hidden is also used to change the angle of the dropdown
                    style={{
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        padding: "0",
                        margin: "0",
                        width: "1.5vw",
                    }}
                >
                    <ArrowDropDownCircleIcon
                        sx={{
                            color: "white",
                            rotate: hidden ? "270deg" : "360deg",
                            width: "25px",
                        }}
                    />
                </IconButton>
                <h2>{props.question}</h2>
            </Stack>
            <motion.p
                // hidden is used here to control the animation, transitions and whether the paragraph is hidden
                hidden={hidden}
                style={{ color: "white" }}
                // using framer-motion to animate the paragraph
                animate={{
                    y: hidden ? -30 : 0,
                    color: hidden
                        ? "rgba(255, 255, 255, 0)"
                        : "rgba(255, 255, 255, 1)",
                }}
                transition={{ type: "spring", stiffness: 100 }}
            >
                {props.answer}
            </motion.p>
        </div>
    );
}
