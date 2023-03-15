import { Stack } from "@mui/system";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavigationBar from "../components/navbar";
import PageNotFound from "./404/PageNotFound";
import About from "./about/about";
import SignInOrUp from "./auth/auth";
import Home from "./home/home";
import MultiPlayer from "./multiplayer/multiplayer";
import SinglePlayer from "./singleplayer/singleplayer";

/**
 * The App component - the main component that is rendered (that renders all other pages)
 *
 * @export
 * @returns {*}
 */
export default function App() {
    // using react-router, we can render different pages based on the URL
    return (
        <div id="app">
            <BrowserRouter>
                <Stack direction="row" spacing={3}>
                    {/* Hook the navigation bar up so it appears for all pages  */}
                    <NavigationBar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/profile" element={<SignInOrUp />} />
                        <Route
                            path="/singleplayer"
                            element={<SinglePlayer />}
                        />
                        <Route path="/multiplayer" element={<MultiPlayer />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </Stack>
            </BrowserRouter>
        </div>
    );
}
