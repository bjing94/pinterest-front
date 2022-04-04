import React from "react";
import { Route, Routes } from "react-router-dom";
import TopBar from "./components/TopBar/TopBar";
import Home from "./pages/Home/Home";
import Pin from "./pages/Pin/Pin";
import PinBuilder from "./pages/PinBuilder/PinBuilder";

import "./App.scss";
import Toolbar from "./components/Toolbar/Toolbar";

function App() {
  return (
    <div className="App" style={{ height: "400px" }}>
      <TopBar />
      <Toolbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pin-builder" element={<PinBuilder />} />
        <Route path="/pin/:id" element={<Pin />} />
      </Routes>
    </div>
  );
}

export default App;
