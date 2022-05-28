import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import Box from "../Box/Box";
import Card from "../Card/Card";
import Flexbox from "../Flexbox/Flexbox";
import Popup from "../Popup";
import RoundButton from "../RoundButton/RoundButton";
import Typography from "../Typgoraphy/Typography";

import "./EditPopup.scss";

interface EditBoardPopupProps {
  title: string;
  onClose: () => void;
  mainContent: any;
  bottomContent: any;
}

export default function EditPopup({
  onClose,
  title,
  mainContent,
  bottomContent,
}: EditBoardPopupProps) {
  return (
    <Popup containerClass="edit-popup__background" onClickBackground={onClose}>
      <Box
        margin="100px 0px 0px 0px"
        onClick={(event: Event) => {
          event.stopPropagation();
        }}
        height="fit-content"
      >
        <Card className="edit-popup__container">
          <Flexbox flexDirection="column" style={{ height: "100%" }}>
            <Box margin="0px 0px 20px 0px" width="400px">
              <Flexbox fluid justifyContent="center" alignItems="center">
                <Typography fontSize={18} fontWeight="bold">
                  {title}
                </Typography>
                <RoundButton size={32} onClick={onClose}>
                  <AiOutlineClose size={24} />
                </RoundButton>
              </Flexbox>
            </Box>
            <div className="edit-popup__list">{mainContent}</div>
            <div className="edit-popup__bottom">{bottomContent}</div>
          </Flexbox>
        </Card>
      </Box>
    </Popup>
  );
}
