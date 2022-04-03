import React from "react";
import { Col, Grid, Row } from "react-flexbox-grid";
import { AiFillBell, AiFillMessage } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import Button from "../Button/Button";
import Container from "../Container/Container";
import Flexbox from "../Flexbox/Flexbox";
import InputSearch from "../InputSearch/InputSearch";
import RoundButton from "../RoundButton/RoundButton";

import "./TopBar.scss";

export default function TopBar() {
  const darkGray = " #767676";

  return (
    <div className="top-bar ">
      <Container>
        <Grid fluid>
          <Row start="xs" middle="xs">
            <Col xs={true} style={{ flexGrow: 0 }}>
              <Flexbox>
                <RoundButton>
                  <img className="logo" width={25} height={25} />
                </RoundButton>
                <Button>Главная</Button>
              </Flexbox>
            </Col>
            <Col xs={true} style={{ flexGrow: 1 }}>
              <InputSearch placeholder="Поиск" />
            </Col>
            <Col xs={true} style={{ flexGrow: 0 }}>
              <Flexbox>
                <RoundButton>
                  <AiFillBell size={24} fill={darkGray} />
                </RoundButton>
                <RoundButton>
                  <AiFillMessage size={24} fill={darkGray} />
                </RoundButton>
                <RoundButton>
                  <FaUser size={24} fill={darkGray} />
                </RoundButton>
              </Flexbox>
            </Col>
          </Row>
        </Grid>
      </Container>
    </div>
  );
}
