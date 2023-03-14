import { IconButton, Stack, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { motion } from "framer-motion";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

/**
 * Description placeholder
 *
 * @interface NavBarButtonProps
 * @typedef {NavBarButtonProps}
 */
interface NavBarButtonProps {
    /**
     * Description placeholder
     *
     * @type {string}
     */
    to: string;
    /**
     * Description placeholder
     *
     * @type {OverridableComponent<SvgIconTypeMap<{}, "svg">>}
     */
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    /**
     * Description placeholder
     *
     * @type {NavigateFunction}
     */
    navigate: NavigateFunction;
}

/**
 * Description placeholder
 *
 * @param {NavBarButtonProps} props
 * @returns {*}
 */
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

/**
 * Description placeholder
 *
 * @export
 * @returns {*}
 */
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
                    icon={PersonIcon}
                />
                <NavBarButton
                    navigate={navigate}
                    to="multiplayer"
                    icon={GroupsIcon}
                />
                <NavBarButton
                    navigate={navigate}
                    to="profile"
                    icon={AccountBoxIcon}
                />
                <NavBarButton navigate={navigate} to="about" icon={InfoIcon} />
            </Stack>
        </motion.div>
    );
}
