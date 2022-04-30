import React from "react";

const UserContext = React.createContext({
  isAuth: false,
  _id: "",
  displayId: "",
});
export const UserProvider = UserContext.Provider;
export default UserContext;
