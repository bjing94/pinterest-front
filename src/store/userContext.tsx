import React from "react";
import { BoardData } from "../services/responses/responses";

interface UserContextInteface {
  isAuth: boolean;
  _id: string;
  displayId: string;
  setTextPopup: (msg: string) => void;
  setErrorPopup: (msg: string) => void;
  updateUserInfo: () => void;
  userBoards: BoardData[];
  currentSavedPins: string[];
}
const UserContext = React.createContext<UserContextInteface>({
  isAuth: false,
  _id: "",
  displayId: "",
  setTextPopup: (msg: string) => {},
  setErrorPopup: (msg: string) => {},
  updateUserInfo: () => {},
  userBoards: [],
  currentSavedPins: [],
});
export const UserProvider = UserContext.Provider;
export default UserContext;
