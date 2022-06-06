import React, { HTMLAttributes, useContext, useRef } from "react";
import { createBoard } from "../../services/BoardService";
import { BoardData } from "../../services/responses/responses";
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
  ...rest
}: BoardCreatePopupProps & HTMLAttributes<HTMLDivElement>) {
  const { setTextPopup, setErrorPopup, authUserData } = useContext(UserContext);
  const titleRef = useRef<HTMLInputElement>(null);

  const handleCreateBoard = async () => {
    if (!titleRef || !titleRef.current) {
      setErrorPopup("Reference error!");
      return;
    }
    if (!authUserData) {
      setErrorPopup("Please log in!");
      return;
    }
    const newBoard = await createBoard({
      pins: [],
      title: titleRef.current.value,
      userId: authUserData._id,
    });

    if (!newBoard) {
      setErrorPopup("Server error!");
      return;
    }
    if (newBoard.status !== 201) {
      return;
    } else {
      newBoard.data as BoardData;
      setTextPopup("Board created!");
      onClose();
      onSubmit();
    }
  };
  return (
    <Popup
      containerClass="create-board-popup"
      onClickBackground={onClose}
      {...rest}
    >
      <Flexbox flexDirection="column" fluid>
        <Typography
          data-testid="board-create-title"
          fontSize={18}
          fontWeight="bold"
        >
          Create board
        </Typography>
        <Box margin="45px 0 0 0" width="100%">
          <Input placeholder="Board name" ref={titleRef} />
        </Box>
        <Flexbox fluid justifyContent="flex-end">
          <Box margin="30px 0 0 0">
            <Button
              data-testid="board-create-btn"
              className="board-create__btn"
              onClick={handleCreateBoard}
            >
              Create
            </Button>
          </Box>
        </Flexbox>
      </Flexbox>
    </Popup>
  );
}
