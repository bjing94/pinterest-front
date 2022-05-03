import { AxiosResponse } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaCross, FaWindowClose } from "react-icons/fa";
import Avatar from "../../../../components/Avatar/Avatar";
import Box from "../../../../components/Box/Box";
import Button from "../../../../components/Button/Button";
import Card from "../../../../components/Card/Card";
import Flexbox from "../../../../components/Flexbox/Flexbox";
import Input from "../../../../components/Input";
import RoundButton from "../../../../components/RoundButton/RoundButton";
import Toolbar from "../../../../components/Toolbar/Toolbar";
import Typography from "../../../../components/Typgoraphy/Typography";
import {
  deleteBoard,
  getBoard,
  updateBoard,
} from "../../../../services/BoardService";
import { UpdateBoardDto } from "../../../../services/dto/update-board.dto";
import { BoardData, UserData } from "../../../../services/responses/responses";
import { getUser } from "../../../../services/UserService";
import UserContext from "../../../../store/userContext";

import "./EditBoardPopup.scss";

interface EditBoardPopupProps {
  boardId: string;
  title: string;
  onClose: () => void;
}

export default function EditBoardPopup({
  boardId,
  title,
  onClose,
}: EditBoardPopupProps) {
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
      console.log("Nothing to update!");
      return;
    }

    const newBoard: UpdateBoardDto = { title: titleValue };
    await updateBoard(boardId, newBoard);
  };

  const handleDeleteBoard = async () => {
    const response = await deleteBoard(boardId);
    console.log(response);
    if (response?.status === 200) {
      setTextPopup("Board deleted!");
      onClose();
    }
  };

  useEffect(() => {
    getBoardInfo();
  }, []);

  return (
    <div className="edit-board-popup__background" onClick={onClose}>
      <Box
        margin="100px 0px 0px 0px"
        onClick={(event: Event) => {
          event.stopPropagation();
        }}
      >
        <Card className="edit-board-popup__container">
          <Flexbox flexDirection="column" style={{ height: "100%" }}>
            <Box margin="0px 0px 20px 0px" width="400px">
              <Flexbox fluid justifyContent="center" alignItems="center">
                <Typography fontSize={1.5} fontWeight="bold">
                  {title}
                </Typography>
                <RoundButton size={32} onClick={onClose}>
                  <AiOutlineClose size={24} />
                </RoundButton>
              </Flexbox>
            </Box>
            <div className="edit-board-popup__list">
              <Input
                value={titleValue}
                onInput={(event: any) => {
                  setTitleValue(event.currentTarget.value);
                }}
                label="Title"
              />
              <Box margin="10px 0px 0px 0px">
                <Button onClick={handleDeleteBoard}>Delete board</Button>
              </Box>
            </div>
            <div className="edit-board-popup__bottom">
              <Flexbox fluid justifyContent="flex-end">
                <Button onClick={handleUpdateBoard}>Done</Button>
              </Flexbox>
            </div>
          </Flexbox>
        </Card>
      </Box>
    </div>
  );
}
