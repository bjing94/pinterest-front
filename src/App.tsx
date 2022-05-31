import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import TopBar from "./components/TopBar/TopBar";
import Home from "./pages/Home/Home";
import Pin from "./pages/Pin/Pin";
import PinBuilder from "./pages/PinBuilder/PinBuilder";
import AuthPopup from "./components/AuthPopup/AuthPopup";
import User from "./pages/User";
import { checkLogin, getCurrentUser, logout } from "./services/AuthService";

import "./App.scss";
import { UserProvider } from "./store/userContext";
import { UserData } from "./services/responses/responses";
import TextPopup from "./components/TextPopup";
import BoardPage from "./pages/BoardPage/BoardPage";
import Search from "./pages/Search";
import Sidebar from "./components/Sidebar";
import ErrorHandler from "./components/ErrorHandler";

function App() {
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>();
  const [textPopupMsg, setTextPopupMsg] = useState<string>("");
  const [textPopupTimer, setTextPopupTimer] = useState<number>();
  const [errorPopupMsg, setErrorPopupMsg] = useState<string>("");
  const [errorPopupTimer, setErrorPopupTimer] = useState<number>();

  const getAuthUserInfo = async () => {
    const userResponse = await getCurrentUser();
    if (!userResponse || userResponse.status !== 200) {
      return;
    }
    const user = userResponse.data as UserData;
    setCurrentUser(user);
  };

  const checkIsAuth = async () => {
    const auth = await checkLogin();
    setIsAuth(auth);
  };

  const handleSetTextPopup = async (msg: string) => {
    if (textPopupTimer) {
      clearTimeout(textPopupTimer);
    }
    setTextPopupMsg(msg);
    const timer: number = window.setTimeout(() => {
      setTextPopupMsg("");
    }, 2000);

    setTextPopupTimer(timer);
  };

  const handleSetErrorPopup = async (msg: string) => {
    if (errorPopupTimer) {
      clearTimeout(errorPopupTimer);
    }
    setErrorPopupMsg(msg);
    const timer: number = window.setTimeout(() => {
      setErrorPopupMsg("");
    }, 2000);

    setErrorPopupTimer(timer);
  };

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  useEffect(() => {
    checkIsAuth();
    getAuthUserInfo();
  }, []);

  return (
    <UserProvider
      value={{
        isAuth: isAuth,
        setTextPopup: handleSetTextPopup,
        setErrorPopup: handleSetErrorPopup,
        updateUserInfo: getAuthUserInfo,
        authUserData: currentUser || undefined,
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
          onClickLogout={handleLogout}
          onClickBurger={() => {
            setShowSidebar(!showSidebar);
          }}
        />
        {textPopupMsg && <TextPopup>{textPopupMsg}</TextPopup>}
        {errorPopupMsg && <TextPopup type="error">{errorPopupMsg}</TextPopup>}
        {showAuthPopup && (
          <AuthPopup
            onClose={() => {
              setShowAuthPopup(false);
            }}
          />
        )}
        {showRegisterPopup && (
          <AuthPopup
            onClose={() => {
              setShowRegisterPopup(false);
            }}
            registerMode={true}
          />
        )}
        <Sidebar
          isAuth={isAuth}
          show={showSidebar}
          onClickLogin={() => {
            setShowAuthPopup(true);
          }}
          onClickRegister={() => {
            setShowRegisterPopup(true);
          }}
        />
        <ErrorHandler>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pin-builder" element={<PinBuilder />} />
            <Route path="/pin/:id" element={<Pin />} />
            <Route path="/user/:id" element={<User />} />
            <Route path="/board/:id" element={<BoardPage />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </ErrorHandler>
      </div>
    </UserProvider>
  );
}

export default App;
