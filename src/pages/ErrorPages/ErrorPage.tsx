import React from "react";
import Box from "../../components/Box/Box";
import Flexbox from "../../components/Flexbox/Flexbox";
import Toolbar from "../../components/Toolbar/Toolbar";
import Typography from "../../components/Typgoraphy/Typography";

import "./ErrorPage.scss";

interface ErrorPageProps {
  code: number;
  message: string;
}

export default function ErrorPage({ code, message }: ErrorPageProps) {
  return (
    <div className="error-page__container">
      <Toolbar />
      <Box margin="140px 0px 0px 0px">
        <Flexbox flexDirection="column" fluid>
          <Typography fontSize={64} fontWeight="bold">
            {code}
          </Typography>
          <Typography fontSize={24}>{message}</Typography>
        </Flexbox>
      </Box>
    </div>
  );
}
