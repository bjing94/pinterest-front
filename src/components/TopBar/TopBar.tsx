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

export default function TopBar() {
  const [isAuth, setIsAuth] = useState(false);

  const checkAuth = async () => {
    const res = await checkLogin();
    setIsAuth(res);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async () => {
    await login({ email: "kovriklol@gmail.com", password: "12345678" });
    // checkAuth();
  };

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
                  <Button onClick={handleLogin}>Login</Button>
                </Flexbox>
              )}
            </Col>
          </Row>
        </Grid>
      </Container>
    </div>
  );
}
