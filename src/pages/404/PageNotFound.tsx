import { motion } from "framer-motion";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/system";

export default function PageNotFound() {
    const navigate = useNavigate();
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
            }}
        >
            <Stack direction="column">
                <h1 style={{ marginBottom: "5vh" }}>
                    Oops, the page you are looking for cannot be found.
                </h1>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        navigate("/");
                    }}
                    style={{
                        marginLeft: "40%",
                        marginRight: "40%",
                        marginTop: "-2.5%",
                    }}
                >
                    Home
                </Button>
            </Stack>
        </motion.div>
    );
}
