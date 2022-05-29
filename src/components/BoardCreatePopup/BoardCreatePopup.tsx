import React, { useContext, useRef } from "react";
import { getCurrentUser } from "../../services/AuthService";
import { createBoard } from "../../services/BoardService";
import {
  BoardData,
  ErrorData,
  UserData,
} from "../../services/responses/responses";
import UserContext from "../../store/userContext";
import Box from "../Box/Box";
import Button from "../Button/Button";
import Flexbox from "../Flexbox/Flexbox";
import Input from "../Input";
import Popup from "../Popup";
import Typography from "../Typgoraphy/Typography";

import "./BoardCreatePopup.scss";

interface BoardCreatePopupProps {
  onClose: any;
  onSubmit: any;
  registerMode?: boolean;
}

export default function BoardCreatePopup({
  onClose,
  onSubmit,
}: BoardCreatePopupProps) {
  const { setTextPopup, setErrorPopup } = useContext(UserContext);
  const titleRef = useRef<HTMLInputElement>(null);

  const handleCreateBoard = async () => {
    if (!titleRef || !titleRef.current) {
      setErrorPopup("Reference error!");
      return;
    }
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.status !== 200) {
      setErrorPopup("Please log in!");
      return;
    }
    const userData = currentUser.data as UserData;
    const newBoard = await createBoard({
      pins: [],
      title: titleRef.current.value,
      userId: userData._id,
    });

    if (!newBoard) {
      setErrorPopup("Server error!");
      return;
    }
    if (newBoard.status !== 201) {
      const error = newBoard.data as ErrorData;
      setErrorPopup(error.message);
      return;
    } else {
      newBoard.data as BoardData;
      setTextPopup("Board created!");
      onClose();
      onSubmit();
    }
  };
  return (
    <Popup containerClass="create-board-popup" onClickBackground={onClose}>
      <Flexbox flexDirection="column" fluid>
        <Typography fontSize={18} fontWeight="bold">
          Create board
        </Typography>
        <Box margin="45px 0 0 0" width="100%">
          <Input placeholder="имя доски" ref={titleRef} />
        </Box>
        <Flexbox fluid justifyContent="flex-end">
          <Box margin="30px 0 0 0">
            <Button className="board-create__btn" onClick={handleCreateBoard}>
              Create
            </Button>
          </Box>
        </Flexbox>
      </Flexbox>
    </Popup>
  );
}
