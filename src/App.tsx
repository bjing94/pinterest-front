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
import { BoardData, UserData } from "./services/responses/responses";
import TextPopup from "./components/TextPopup";
import { getBoards } from "./services/BoardService";

function App() {
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>();
  const [textPopupMsg, setTextPopupMsg] = useState<string>("");
  const [textPopupTimer, setTextPopupTimer] = useState<number>();
  const [currentBoards, setCurrentBoards] = useState<BoardData[] | null>(null);

  const currUser = async () => {
    const userResponse = await getCurrentUser();
    if (!userResponse || userResponse.status !== 200) return;
    const user = userResponse.data as UserData;
    setCurrentUser(user);

    const boards = await getBoards(user.boards);
    setCurrentBoards(boards);

    console.log("User", user);
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
        setTextPopup: handleSetTextPopup,
        userBoards: currentBoards || [],
        currentSavedPins: currentUser?.savedPins || [],
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
        {textPopupMsg && <TextPopup>{textPopupMsg}</TextPopup>}
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
