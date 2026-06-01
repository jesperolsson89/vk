import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Game from "./components/Game";
import UserProfile from "./components/UserProfile";
import Instructions from "./components/Instructions";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Instructions />} />
          <Route path="/game" element={<Game />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;