import React, { useEffect, useState } from "react";
import { FaPlus, FaQuestion } from "react-icons/fa";
import { Route, Routes } from "react-router-dom";
import RoundButton from "./components/RoundButton/RoundButton";
import TopBar from "./components/TopBar/TopBar";
import About from "./pages/About";
import Home from "./pages/Home";
import PinBuilder from "./pages/PinBuilder/PinBuilder";
import { getPin } from "./services/PinterestService";

function App() {
  // const [apiResult, SetApiResult] = useState("Waiting");

  // useEffect(() => {
  //   async function fetchAPI() {
  //     const res = await getPin("624459439fd35f48dec69791");
  //     console.log(res);
  //     SetApiResult(res);
  //   }
  //   fetchAPI();
  // }, []);
  return (
    <div className="App" style={{ height: "2000px" }}>
      <TopBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="pin-builder" element={<PinBuilder />} />
      </Routes>
    </div>
  );
}

export default App;
