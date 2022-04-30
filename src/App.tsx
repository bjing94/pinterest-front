import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import TopBar from "./components/TopBar/TopBar";
import Home from "./pages/Home/Home";
import Pin from "./pages/Pin/Pin";
import PinBuilder from "./pages/PinBuilder/PinBuilder";
import AuthPopup from "./components/AuthPopup/AuthPopup";
import User from "./pages/User";
import { checkLogin, getCurrentUser } from "./services/AuthService";

import "./App.scss";
import { UserProvider } from "./store/userContext";
import { UserData } from "./services/responses/responses";

function App() {
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>();

  const currUser = async () => {
    const userResponse = await getCurrentUser();
    if (!userResponse || userResponse.status !== 200) return;
    const user = userResponse.data as UserData;
    setCurrentUser(user);
  };

  const checkIsAuth = async () => {
    const auth = await checkLogin();
    setIsAuth(auth);
  };

  useEffect(() => {
    checkIsAuth();
    currUser();
  }, []);

  return (
    <UserProvider
      value={{
        isAuth: isAuth,
        _id: currentUser?._id || "",
        displayId: currentUser?.displayId || "",
      }}
    >
      <div className="App">
        <TopBar
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
          <Route path="/pin-builder" element={<PinBuilder isAuth={isAuth} />} />
          <Route path="/pin/:id" element={<Pin />} />
          <Route path="/user/:id" element={<User />} />
        </Routes>
      </div>
    </UserProvider>
  );
}

export default App;
