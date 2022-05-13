import React, { useContext, useRef } from "react";
import { Col, Grid, Row } from "react-flexbox-grid";
import { FaUser } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import UserContext from "../../store/userContext";
import Box from "../Box/Box";
import Button from "../Button/Button";
import Container from "../Container/Container";
import Flexbox from "../Flexbox/Flexbox";
import InputSearch from "../InputSearch/InputSearch";
import RoundButton from "../RoundButton/RoundButton";

import "./TopBar.scss";

interface TopBarProps {
  onClickLogin?: any;
  onClickRegister?: any;
  onClickLogout?: any;
}

export default function TopBar({
  onClickLogin,
  onClickRegister,
  onClickLogout,
}: TopBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const darkGray = " #767676";
  const currUserInfo = useContext(UserContext);
  const searchRef = useRef<HTMLInputElement>(null);
  const { isAuth, displayId } = currUserInfo;

  const handleSearch = async () => {
    if (!searchRef.current || searchRef.current.value.length === 0) return;

    console.log("searching");

    const value = searchRef.current.value;
    navigate(`/search/?q=${value}&random=false`);
  };

  return (
    <div className="top-bar ">
      <Container>
        <Grid fluid>
          <Row start="xs" middle="xs">
            <Col xs={true} style={{ flexGrow: 0 }}>
              <Flexbox>
                <RoundButton size={32}>
                  <img className="logo" width={24} height={24} />
                </RoundButton>
                <Link to="/">
                  <Button
                    color={`${
                      location.pathname === "/" ? "secondary" : "primary"
                    }`}
                    variant={`${location.pathname === "/" ? "filled" : "text"}`}
                  >
                    Home
                  </Button>
                </Link>
              </Flexbox>
            </Col>
            <Col xs={true} style={{ flexGrow: 1 }}>
              <InputSearch
                placeholder="Search"
                ref={searchRef}
                onKeyPress={(ev) => {
                  if (ev.key === "Enter") {
                    ev.preventDefault();
                    handleSearch();
                  }
                }}
              />
            </Col>
            <Col xs={true} style={{ flexGrow: 0 }}>
              {isAuth ? (
                <Flexbox>
                  <RoundButton size={32} onClick={onClickLogout}>
                    <IoIosLogOut size={24} fill={darkGray} />
                  </RoundButton>
                  <Link to={`/user/${displayId}`}>
                    <RoundButton size={32}>
                      <FaUser size={24} fill={darkGray} />
                    </RoundButton>
                  </Link>
                </Flexbox>
              ) : (
                <Flexbox>
                  <Button onClick={onClickLogin} color="secondary">
                    Login
                  </Button>
                  <Box margin="0px 0px 0px 10px">
                    <Button onClick={onClickRegister} color="secondary">
                      Register
                    </Button>
                  </Box>
                </Flexbox>
              )}
            </Col>
          </Row>
        </Grid>
      </Container>
    </div>
  );
}
