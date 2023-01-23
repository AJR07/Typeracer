import { Stack } from "@mui/system";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavigationBar from "../components/navbar";
import PageNotFound from "./404/PageNotFound";
import About from "./about/about";

export default function App() {
    return (
        <div id="app">
            <BrowserRouter>
                <Stack direction="row">
                    <NavigationBar />
                    <Routes>
                        <Route path="/about" element={<About />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </Stack>
            </BrowserRouter>
        </div>
    );
}
