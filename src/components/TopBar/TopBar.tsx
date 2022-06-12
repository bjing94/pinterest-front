import React, { useContext, useRef } from "react";
import { Col, Grid, Row } from "react-flexbox-grid";
import { AiOutlineMenu } from "react-icons/ai";
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
  onClickBurger?: any;
}

export default function TopBar({
  onClickLogin,
  onClickRegister,
  onClickLogout,
  onClickBurger,
  ...rest
}: TopBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const darkGray = " #767676";
  const { authUserData, isAuth } = useContext(UserContext);
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    if (!searchRef.current || searchRef.current.value.length === 0) return;

    const value = searchRef.current.value;
    navigate(`/search/?q=${value}&random=false`);
  };
  const desktopGrid = (
    <Grid fluid className="desktop-grid">
      <Row start="xs" middle="xs">
        <Col xs={true} style={{ flexGrow: 0 }}>
          <Flexbox>
            <Link to="/">
              <RoundButton size={32} data-testid="top-bar-logo">
                <img alt="logo" className="logo" width={24} height={24} />
              </RoundButton>
            </Link>
            <Link to="/">
              <Button
                color={`${location.pathname === "/" ? "secondary" : "primary"}`}
                variant={`${location.pathname === "/" ? "filled" : "text"}`}
                data-testid="home-btn"
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
            data-testid="top-bar-search"
          />
        </Col>
        <Col xs={true} style={{ flexGrow: 0 }}>
          {isAuth && authUserData ? (
            <Flexbox>
              <RoundButton
                size={32}
                onClick={onClickLogout}
                data-testid="logout-btn"
              >
                <IoIosLogOut size={24} fill={darkGray} />
              </RoundButton>
              <Link to={`/user/${authUserData.displayId}`}>
                <RoundButton size={32} data-testid="profile-btn">
                  <FaUser size={24} fill={darkGray} />
                </RoundButton>
              </Link>
            </Flexbox>
          ) : (
            <Flexbox>
              <Button
                onClick={onClickLogin}
                color="secondary"
                data-testid="login-btn"
              >
                Login
              </Button>
              <Box margin="0px 0px 0px 10px">
                <Button
                  onClick={onClickRegister}
                  color="secondary"
                  data-testid="register-btn"
                >
                  Register
                </Button>
              </Box>
            </Flexbox>
          )}
        </Col>
      </Row>
    </Grid>
  );

  const phoneGrid = (
    <Grid fluid className="phone-grid" data-testid="phone-grid">
      <Row start="xs" middle="xs">
        <Col xs={12}>
          <Flexbox>
            <Box margin="0px 10px 0px 0px">
              <Link to="/">
                <RoundButton size={32} data-testid="top-bar-logo-mobile">
                  <img alt="logo" className="logo" width={24} height={24} />
                </RoundButton>
              </Link>
            </Box>
            <InputSearch
              placeholder="Search"
              ref={searchRef}
              onKeyPress={(ev) => {
                if (ev.key === "Enter") {
                  ev.preventDefault();
                  handleSearch();
                }
              }}
              data-testid="top-bar-search-mobile"
            />

            <RoundButton
              size={32}
              className="burger-button"
              onClick={onClickBurger}
              data-testid="top-bar-burger-mobile"
            >
              <AiOutlineMenu size={24} />
            </RoundButton>
          </Flexbox>
        </Col>
      </Row>
    </Grid>
  );
  return (
    <div className="top-bar " {...rest}>
      <Container>
        {desktopGrid}
        {phoneGrid}
      </Container>
    </div>
  );
}
