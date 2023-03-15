import { IconButton, Stack, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { motion } from "framer-motion";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

/**
 * Navigation bar component props, used to show the details of each button on the navigation bar
 *
 * @interface NavBarButtonProps
 * @typedef {NavBarButtonProps}
 */
interface NavBarButtonProps {
    /**
     * Shows the url to be navigated to
     *
     * @type {string}
     */
    to: string;
    /**
     * Shows the icon to be displayed (From MUI)
     *
     * @type {OverridableComponent<SvgIconTypeMap<{}, "svg">>}
     */
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
    /**
     * Allows the component to navigate to a different page
     *
     * @type {NavigateFunction}
     */
    navigate: NavigateFunction;
}

/**
 * Navigation bar button component - displays a button on the navigation bar
 *
 * @param {NavBarButtonProps} props
 * @returns {*}
 */
function NavBarButton(props: NavBarButtonProps) {
    // uses the "to" property to navigate to the specified page
    // uses the "icon" property to display the specified icon
    // uses the "navigate" function to navigate to the specified page
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
 * Navigation bar component - displays the navigation bar on the left side of the screen
 *
 * @export
 * @returns {*}
 */
export default function NavigationBar() {
    // a hook that allows the component to navigate to a different page
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
