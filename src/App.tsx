import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import TopBar from "./components/TopBar/TopBar";
import Home from "./pages/Home/Home";
import Pin from "./pages/Pin/Pin";
import PinBuilder from "./pages/PinBuilder/PinBuilder";

import "./App.scss";
import Toolbar from "./components/Toolbar/Toolbar";
import AuthPopup from "./components/AuthPopup/AuthPopup";
import { checkLogin } from "./services/PinterestService";
import User from "./pages/User";

function App() {
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  return (
    <div className="App" style={{ height: "400px" }}>
      <TopBar
        isAuth={isAuth}
        onClickLogin={() => {
          setShowAuthPopup(true);
        }}
        onClickRegister={() => {
          setShowRegisterPopup(true);
        }}
      />
      <Toolbar />
      {showAuthPopup && (
        <AuthPopup
          onClose={() => {
            setShowAuthPopup(false);
          }}
          onSubmit={() => {
            setIsAuth(true);
          }}
        />
      )}
      {showRegisterPopup && (
        <AuthPopup
          onClose={() => {
            setShowRegisterPopup(false);
          }}
          onSubmit={() => {}}
          registerMode={true}
        />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pin-builder" element={<PinBuilder />} />
        <Route path="/pin/:id" element={<Pin />} />
        <Route path="/user/:id" element={<User />} />
      </Routes>
    </div>
  );
}

export default App;
