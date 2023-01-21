import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "./about/about";

export default function App() {
  return (
    <div id="app">
      <BrowserRouter>
        <Routes>
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
