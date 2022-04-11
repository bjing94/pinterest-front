import React, { useEffect, useState } from "react";
import { Col, Grid, Row } from "react-flexbox-grid";
import { AiFillBell, AiFillMessage } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { checkLogin, login } from "../../services/PinterestService";
import Button from "../Button/Button";
import Container from "../Container/Container";
import Flexbox from "../Flexbox/Flexbox";
import InputSearch from "../InputSearch/InputSearch";
import RoundButton from "../RoundButton/RoundButton";

import "./TopBar.scss";

interface TopBarProps {
  onClickLogin?: any;
  onClickRegister?: any;
  isAuth: boolean;
}

export default function TopBar({
  onClickLogin,
  onClickRegister,
  isAuth,
}: TopBarProps) {
  const darkGray = " #767676";

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
                  <Button>Главная</Button>
                </Link>
              </Flexbox>
            </Col>
            <Col xs={true} style={{ flexGrow: 1 }}>
              <InputSearch placeholder="Поиск" />
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
                  <RoundButton size={32}>
                    <FaUser size={24} fill={darkGray} />
                  </RoundButton>
                </Flexbox>
              ) : (
                <Flexbox>
                  <Button onClick={onClickLogin}>Login</Button>
                  <Button onClick={onClickRegister}>Register</Button>
                </Flexbox>
              )}
            </Col>
          </Row>
        </Grid>
      </Container>
    </div>
  );
}
