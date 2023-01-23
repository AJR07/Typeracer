import { IconButton } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";

interface FAQComponentProps {
    question: string;
    answer: string;
}

export default function FAQComponent(props: FAQComponentProps) {
    let [hidden, setHidden] = useState(true);

    return (
        <div className="faq" style={{ textAlign: "left" }}>
            <Stack id="toggle" direction="row" spacing={1}>
                <IconButton
                    onClick={() => setHidden(!hidden)}
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
            <p hidden={hidden}>{props.answer}</p>
        </div>
    );
}
