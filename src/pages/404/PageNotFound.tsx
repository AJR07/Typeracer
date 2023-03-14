import { motion } from "framer-motion";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/system";

/**
 * The page that is displayed when the user accesses a page that does not exist
 *
 * @export
 * @returns {*}
 */
export default function PageNotFound() {
    // uses the navigate hook to navigate to another page programmatically using react-router
    const navigate = useNavigate();

    // styling the page
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
                    // this button uses the navigate hook to navigate to the home page
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
