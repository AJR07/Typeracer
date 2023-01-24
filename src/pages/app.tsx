import { Stack } from "@mui/system";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavigationBar from "../components/navbar";
import PageNotFound from "./404/PageNotFound";
import About from "./about/about";
import SignInOrUp from "./auth/auth";

export default function App() {
    return (
        <div id="app">
            <BrowserRouter>
                <Stack direction="row" spacing={3}>
                    <NavigationBar />
                    <Routes>
                        <Route path="/about" element={<About />} />
                        <Route path="/profile" element={<SignInOrUp />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </Stack>
            </BrowserRouter>
        </div>
    );
}
