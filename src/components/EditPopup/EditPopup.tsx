import React, { HTMLAttributes } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Box from "../Box/Box";
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
  ...rest
}: EditBoardPopupProps & HTMLAttributes<HTMLDivElement>) {
  return (
    <Popup
      containerClass="edit-popup__container"
      onClickBackground={onClose}
      {...rest}
    >
      <Flexbox flexDirection="column" style={{ height: "100%" }}>
        <Box margin="0px 0px 20px 0px">
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
    </Popup>
  );
}
