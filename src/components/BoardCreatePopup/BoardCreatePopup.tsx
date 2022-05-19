import React, { useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { register, login, getCurrentUser } from "../../services/AuthService";
import { createBoard } from "../../services/BoardService";
import {
  BoardData,
  ErrorData,
  UserData,
} from "../../services/responses/responses";
import Box from "../Box/Box";
import Button from "../Button/Button";
import Flexbox from "../Flexbox/Flexbox";
import Input from "../Input";
import RoundButton from "../RoundButton/RoundButton";
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
  const titleRef = useRef<HTMLInputElement>(null);
  const [errorText, setErrorText] = useState("");

  const handleCreateBoard = async () => {
    setErrorText("");
    if (!titleRef || !titleRef.current) {
      setErrorText("Reference error!");
      return;
    }
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.status !== 200) {
      setErrorText("Please log in!");
      return;
    }
    const userData = currentUser.data as UserData;
    const newBoard = await createBoard({
      pins: [],
      title: titleRef.current.value,
      userId: userData._id,
    });

    if (!newBoard) {
      setErrorText("Server error!");
      return;
    }
    if (newBoard.status !== 201) {
      const error = newBoard.data as ErrorData;
      setErrorText(error.message);
      return;
    } else {
      const board = newBoard.data as BoardData;
      onClose();
    }
  };

  return (
    <div className="create-board-popup">
      <div className="create-board-popup__background" onClick={onClose}></div>
      <div className="create-board-popup__container" style={{ width: "400px" }}>
        <Flexbox flexDirection="column" fluid>
          {errorText && (
            <Typography fontSize={12} color="error">
              {errorText}
            </Typography>
          )}
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
      </div>
    </div>
  );
}
