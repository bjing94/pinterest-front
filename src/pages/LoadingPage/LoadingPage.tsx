import React from "react";
import { GridLoader } from "react-spinners";
import Box from "../../components/Box/Box";
import Flexbox from "../../components/Flexbox/Flexbox";
import Toolbar from "../../components/Toolbar/Toolbar";
import Typography from "../../components/Typgoraphy/Typography";

import "./LoadingPage.scss";

export default function LoadingPage() {
  return (
    <div className="loading-page__container">
      <Toolbar />
      <Box margin="140px 0px 0px 0px">
        <Flexbox flexDirection="column" fluid>
          <GridLoader size={48} margin={5} color="red" />
          <Box margin="20px 0px 0px 0px">
            <Typography>Loading</Typography>
          </Box>
        </Flexbox>
      </Box>
    </div>
  );
}
