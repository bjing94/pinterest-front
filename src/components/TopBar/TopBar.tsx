import React, { useContext, useEffect, useState } from "react";
import { Col, Grid, Row } from "react-flexbox-grid";
import { AiFillBell, AiFillMessage } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
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
}

export default function TopBar({ onClickLogin, onClickRegister }: TopBarProps) {
  const location = useLocation();
  const darkGray = " #767676";
  const currUserInfo = useContext(UserContext);
  const { isAuth, displayId } = currUserInfo;

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
                    type={`${location.pathname === "/" ? "filled" : "text"}`}
                  >
                    Home
                  </Button>
                </Link>
              </Flexbox>
            </Col>
            <Col xs={true} style={{ flexGrow: 1 }}>
              <InputSearch placeholder="Search" />
            </Col>
            <Col xs={true} style={{ flexGrow: 0 }}>
              {isAuth ? (
                <Flexbox>
                  <RoundButton size={32}>
                    <AiFillBell size={24} fill={darkGray} />
                  </RoundButton>
                  <RoundButton size={32}>
                    <AiFillMessage size={24} fill={darkGray} />
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
