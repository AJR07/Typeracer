import { IconButton } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import { motion } from "framer-motion";

interface FAQComponentProps {
    question: string;
    answer: string;
}

export default function FAQComponent(props: FAQComponentProps) {
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
                hidden={hidden}
                style={{ color: "white" }}
                animate={{
                    y: hidden ? -30 : 0,
                    color: hidden
                        ? "rgba(255, 255, 255, 0)"
                        : "rgba(255, 255, 255, 1)",
                }}
            >
                {props.answer}
            </motion.p>
        </div>
    );
}
