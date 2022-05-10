import React, { useContext, useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { Link, useParams } from "react-router-dom";
import Avatar from "../../components/Avatar/Avatar";
import Box from "../../components/Box/Box";
import Button from "../../components/Button/Button";
import Flexbox from "../../components/Flexbox/Flexbox";
import PinCard from "../../components/PinCard/PinCard";
import Toolbar from "../../components/Toolbar/Toolbar";
import Typography from "../../components/Typgoraphy/Typography";
import copyCurrentUrl from "../../helpers/copyCurrentUrl";
import { getCurrentUser } from "../../services/AuthService";
import { getBoard, updateBoard } from "../../services/BoardService";
import { BoardData, UserData } from "../../services/responses/responses";
import { getUser, updateUser } from "../../services/UserService";
import UserContext from "../../store/userContext";
import LoadingPage from "../LoadingPage/LoadingPage";

import "./BoardPage.scss";

const breakpointColumnsObj = {
  default: 7,
  1820: 6, // 1800 or less
  1600: 5,
  1400: 4,
  930: 3,
  710: 2,
  550: 1,
};

export default function BoardPage() {
  const { id } = useParams();

  const { userBoards, currentSavedPins, setTextPopup } =
    useContext(UserContext);

  // Board info
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [authorInfo, setAuthorInfo] = useState<UserData | null>(null);
  const [boardId, setBoardId] = useState<string>();
  const [showCreateBoard, setShowCreateBoard] = useState(false);

  const handleSavePin = async (id: string) => {
    if (!id) {
      return;
    }

    const response = await getCurrentUser();
    if (response && response.status == 200) {
      if (!boardId) {
        // save to profile
        const userInfo = response.data as UserData;
        userInfo.savedPins.push(id);
        const updateResponse = await updateUser(userInfo._id, userInfo);
        if (updateResponse && updateResponse.status == 200) {
          console.log("Saved to profile: ", updateResponse.data);
        }
        return;
      }

      const boardResponse = await getBoard(boardId);
      if (!boardResponse || boardResponse.status !== 200) {
        console.log("Error finding board!");
        return;
      }
      const newBoard = boardResponse.data as BoardData;
      newBoard.pins.push(id);

      const updatedBoardResponse = await updateBoard(boardId, {
        pins: newBoard.pins,
        title: newBoard.title,
      });
      if (!updatedBoardResponse || updatedBoardResponse.status !== 200) {
        console.log("Error updating board!");
        return;
      }
      console.log(updatedBoardResponse);
    }
  };

  const getBoardInfo = async () => {
    if (!id) return;
    const boardResponse = await getBoard(id);
    if (!boardResponse || boardResponse.status !== 200) {
      return;
    }

    const boardData = boardResponse.data as BoardData;
    setBoardData(boardData);
    console.log(boardData);

    const userResponse = await getUser(boardData.userId);
    console.log(userResponse);
    if (!userResponse || userResponse.status !== 200) return;

    const userData = userResponse.data as UserData;
    setAuthorInfo(userData);
  };

  useEffect(() => {
    getBoardInfo();
  }, []);

  if (!boardData || !authorInfo) {
    return <LoadingPage />;
  }

  const pinElements = boardData.pins.map((id) => {
    const isSaved =
      userBoards.findIndex((board) => board.pins.includes(id)) !== -1 ||
      currentSavedPins.includes(id);

    return (
      <Flexbox
        justifyContent="center"
        style={{ width: "100%" }}
        key={`pin-card-${id}`}
      >
        <PinCard
          pinId={id}
          isSaved={isSaved}
          boards={[]}
          onSavePin={(pinId) => {
            handleSavePin(pinId);
          }}
          onSetBoardId={(boardId) => {
            setBoardId(boardId);
          }}
          onShowCreateBoard={() => {
            setShowCreateBoard(!showCreateBoard);
          }}
          showInfo
        />
      </Flexbox>
    );
  });

  return (
    <div className="board-page__container">
      <Toolbar />
      <Flexbox flexDirection="column" fluid>
        <Typography fontSize={32} fontWeight="bold">
          {boardData.title}
        </Typography>
        <Link to={`/user/${authorInfo.displayId}`}>
          <Avatar imgId={authorInfo.avatarSrc} size={48} />
        </Link>
        <Box margin="10px 0px 0px 0px">
          <Typography fontSize={16} fontWeight="bold">
            {authorInfo.username}
          </Typography>
        </Box>
        <Box margin="10px 0px 0px 0px">
          <Typography
            fontSize={14}
            fontWeight="bold"
          >{`${authorInfo.subscribers.length} subscribers`}</Typography>
        </Box>
        <Box margin="10px 0px 0px 0px">
          <Button
            onClick={() => {
              copyCurrentUrl();
              setTextPopup("Copied to clipboard");
            }}
          >
            Share
          </Button>
        </Box>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="user-masonry-grid"
          columnClassName="user-masonry-grid_column"
        >
          {pinElements}
        </Masonry>
      </Flexbox>
    </div>
  );
}
