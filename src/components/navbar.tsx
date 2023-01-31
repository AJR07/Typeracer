import { IconButton, Stack, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { motion } from "framer-motion";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import KeyboardAltIcon from "@mui/icons-material/KeyboardAlt";

interface NavBarButtonProps {
    to: string;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    navigate: NavigateFunction;
}

function NavBarButton(props: NavBarButtonProps) {
    return (
        <motion.div>
            <IconButton
                onClick={() => {
                    props.navigate(props.to);
                }}
                sx={{
                    color: "white",
                    width: "30px",
                    paddingRight: "15px",
                    marginLeft: "0.5vw",
                }}
            >
                <props.icon id="icon" />
            </IconButton>
        </motion.div>
    );
}

export default function NavigationBar() {
    const navigate = useNavigate();
    return (
        <motion.div
            id="navbar"
            whileHover={{ backgroundColor: "#4477ff" }}
            style={{
                width: "50px",
                backgroundColor: "#4488ff",
                height: "80vh",
                marginTop: "10vh",
                borderTopRightRadius: "15px",
                borderBottomRightRadius: "15px",
            }}
        >
            <Stack
                direction="column"
                spacing={2}
                style={{ display: "flex", alignItems: "center" }}
            >
                <Link to="/home">
                    <img
                        src="/typing.png"
                        style={{ width: "30px", padding: "7.5px" }}
                    ></img>
                </Link>

                <NavBarButton
                    navigate={navigate}
                    to="singleplayer"
                    icon={KeyboardIcon}
                />
                <NavBarButton
                    navigate={navigate}
                    to="multiplayer"
                    icon={KeyboardAltIcon}
                />
                <NavBarButton
                    navigate={navigate}
                    to="profile"
                    icon={PersonIcon}
                />
                <NavBarButton navigate={navigate} to="about" icon={InfoIcon} />
            </Stack>
        </motion.div>
    );
}
