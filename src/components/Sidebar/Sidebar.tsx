import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../store/userContext";
import Box from "../Box/Box";
import Dropdown from "../Dropdown";
import Typography from "../Typgoraphy/Typography";

import "./Sidebar.scss";
interface SidebarProps {
  isAuth: boolean;
  show: boolean;
  onClickLogin: () => void;
  onClickRegister: () => void;
}
export default function Sidebar({
  isAuth,
  show,
  onClickLogin,
  onClickRegister,
}: SidebarProps) {
  const { authUserData } = useContext(UserContext);
  return (
    <Dropdown className={`sidebar ${show ? "show" : ""}`}>
      <Link to="/">
        <Typography fontSize={18} fontWeight="bold">
          Home
        </Typography>
      </Link>

      {!isAuth && (
        <Box onClick={onClickLogin}>
          <Typography fontSize={18} fontWeight="bold">
            Login
          </Typography>
        </Box>
      )}
      {!isAuth && (
        <Box onClick={onClickRegister}>
          <Typography fontSize={18} fontWeight="bold">
            Register
          </Typography>
        </Box>
      )}

      {isAuth && authUserData && (
        <Link to={`/user/${authUserData._id}`}>
          <Typography fontSize={18} fontWeight="bold">
            Profile
          </Typography>
        </Link>
      )}
    </Dropdown>
  );
}
