import React from "react";
import { UserData } from "../services/responses/responses";

interface UserContextInteface {
  isAuth: boolean;
  setTextPopup: (msg: string) => void;
  setErrorPopup: (msg: string) => void;
  updateUserInfo: () => void;
  authUserData?: UserData;
}
const UserContext = React.createContext<UserContextInteface>({
  isAuth: false,
  setTextPopup: (msg: string) => {},
  setErrorPopup: (msg: string) => {},
  updateUserInfo: () => {},
  authUserData: undefined,
});
export const UserProvider = UserContext.Provider;
export default UserContext;
