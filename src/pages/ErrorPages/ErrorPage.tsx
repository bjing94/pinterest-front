import React from "react";
import Box from "../../components/Box/Box";
import Flexbox from "../../components/Flexbox/Flexbox";
import Toolbar from "../../components/Toolbar/Toolbar";
import Typography from "../../components/Typgoraphy/Typography";

import "./ErrorPage.scss";

interface ErrorPageProps {
  errorCode: number;
}

export default function ErrorPage({ errorCode }: ErrorPageProps) {
  let description;
  switch (errorCode) {
    case 400:
      description = "Bad request";
      break;
    case 404:
      description = "Not found";
      break;
  }
  return (
    <div className="error-page__container">
      <Toolbar />
      <Box margin="140px 0px 0px 0px">
        <Flexbox flexDirection="column" fluid>
          <img
            className="error-page__img"
            src="https://i.pinimg.com/564x/36/1f/01/361f0121332de3d36c152261e4d92fdb.jpg"
            width={320}
            height={400}
            alt="not_found"
          />
          <Typography>{errorCode}</Typography>
          <Typography>{description}</Typography>
        </Flexbox>
      </Box>
    </div>
  );
}
