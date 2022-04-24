import React, { useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import {
  register,
  login,
  getCurrentUser,
} from "../../../../services/AuthService";
import { createBoard } from "../../../../services/BoardService";
import {
  BoardData,
  ErrorData,
  UserData,
} from "../../../../services/responses/responses";
import Box from "../../../../components/Box/Box";
import Button from "../../../../components/Button/Button";
import Flexbox from "../../../../components/Flexbox/Flexbox";
import Input from "../../../../components/Input";
import RoundButton from "../../../../components/RoundButton/RoundButton";
import Typography from "../../../../components/Typgoraphy/Typography";

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
  const titleRef = useRef<HTMLInputElement>(null);

  const handleCreateBoard = async () => {
    if (!titleRef || !titleRef.current) {
      return;
    }
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.status !== 200) {
      return;
    }
    const userData = currentUser.data as UserData;
    const newBoard = await createBoard({
      pins: [],
      title: titleRef.current.value,
      userId: userData._id,
    });

    if (!newBoard) {
      return;
    }
    if (newBoard.status !== 201) {
      const error = newBoard.data as ErrorData;
      console.log(error.statusCode, error.message);
      return;
    } else {
      const board = newBoard.data as BoardData;
      console.log(board);
    }
  };

  return (
    <div className="create-board-popup">
      <div className="create-board-popup__background" onClick={onClose}></div>
      <div className="create-board-popup__container" style={{ width: "400px" }}>
        <Flexbox flexDirection="column" fluid>
          <Typography fontSize={1.75} fontWeight="bold">
            Создание доски
          </Typography>
          <Box margin="45px 0 0 0" width="100%">
            <Input placeholder="имя доски" ref={titleRef} />
          </Box>

          <Flexbox fluid justifyContent="flex-end">
            <Box margin="30px 0 0 0">
              <Button className="board-create__btn" onClick={handleCreateBoard}>
                Создать
              </Button>
            </Box>
          </Flexbox>
        </Flexbox>
      </div>
    </div>
  );
}
