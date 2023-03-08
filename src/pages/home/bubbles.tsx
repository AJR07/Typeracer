import { Stack } from "@mui/system";
import { motion, MotionValue } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface BubbleProps {
    to: string;
    name: string;
    description: string;
}

function getRandomColor() {
    return `rgb(${Math.floor(Math.random() * 20 + 40)}, ${Math.floor(
        Math.random() * 20 + 40
    )}, ${Math.floor(Math.random() * 155 + 100)})`;
}

export default function Bubble(props: BubbleProps) {
    const navigate = useNavigate();

    const clr = getRandomColor();
    return (
        <motion.div
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
            whileHover={{
                scale: 1.1,
                transition: { duration: 0.2 },
            }}
            whileTap={{
                scale: 0.9,
                transition: { duration: 0.2 },
            }}
            onClick={() => {
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
