import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import TopBar from "./components/TopBar/TopBar";
import Home from "./pages/Home/Home";
import Pin from "./pages/Pin/Pin";
import PinBuilder from "./pages/PinBuilder/PinBuilder";

import "./App.scss";
import Toolbar from "./components/Toolbar/Toolbar";
import AuthPopup from "./components/AuthPopup/AuthPopup";
import User from "./pages/User";
import { checkLogin } from "./services/AuthService";

function App() {
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    checkLogin().then((res) => {
      setIsAuth(res);
    });
  }, []);
  return (
    <div className="App">
      <TopBar
        isAuth={isAuth}
        onClickLogin={() => {
          setShowAuthPopup(true);
        }}
        onClickRegister={() => {
          setShowRegisterPopup(true);
        }}
      />
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
