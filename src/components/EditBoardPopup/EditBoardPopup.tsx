import React, { HTMLAttributes, useContext, useEffect, useState } from "react";
import {
  getBoard,
  updateBoard,
  deleteBoard,
} from "../../services/BoardService";
import EditPopup from "../EditPopup/EditPopup";
import { UpdateBoardDto } from "../../services/dto/update-board.dto";
import { BoardData } from "../../services/responses/responses";
import UserContext from "../../store/userContext";
import Box from "../Box/Box";
import Button from "../Button/Button";
import Flexbox from "../Flexbox/Flexbox";
import Input from "../Input";

import "./EditBoardPopup.scss";

interface EditBoardPopupProps {
  boardId: string;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
}

export default function EditBoardPopup({
  boardId,
  title,
  onClose,
  onSubmit,
  ...rest
}: EditBoardPopupProps & HTMLAttributes<HTMLDivElement>) {
  const { setTextPopup } = useContext(UserContext);

  const [titleValue, setTitleValue] = useState("");
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const getBoardInfo = async () => {
    const boardResponse = await getBoard(boardId);
    if (boardResponse?.status !== 200 || !boardResponse) return;

    const boardData = boardResponse.data as BoardData;
    setBoardData(boardData);
    setTitleValue(boardData.title);
  };

  const handleUpdateBoard = async () => {
    if (titleValue === boardData?.title) {
      return;
    }

    const newBoard: UpdateBoardDto = { title: titleValue };
    await updateBoard(boardId, newBoard);
    onSubmit();
  };

  const handleDeleteBoard = async () => {
    const response = await deleteBoard(boardId);
    if (response?.status === 200) {
      setTextPopup("Board deleted!");
      onSubmit();
      onClose();
    }
  };

  useEffect(() => {
    getBoardInfo();
  }, []);
  const mainContent = (
    <>
      <Input
        value={titleValue}
        onInput={(event: any) => {
          setTitleValue(event.currentTarget.value);
        }}
        label="Title"
        data-testid="edit-board-title"
      />
      <Box margin="10px 0px 0px 0px">
        <Button onClick={handleDeleteBoard} data-testid="edit-board-delete-btn">
          Delete board
        </Button>
      </Box>
    </>
  );

  const bottomContent = (
    <>
      <Flexbox fluid justifyContent="flex-end">
        <Button onClick={handleUpdateBoard} data-testid="edit-board-update-btn">
          Done
        </Button>
      </Flexbox>
    </>
  );
  return (
    <EditPopup
      title={title}
      onClose={onClose}
      mainContent={mainContent}
      bottomContent={bottomContent}
      {...rest}
    />
  );
}
