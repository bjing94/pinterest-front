import React, { useContext, useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { useParams } from "react-router-dom";
import Avatar from "../../components/Avatar/Avatar";
import Box from "../../components/Box/Box";
import Button from "../../components/Button/Button";
import Flexbox from "../../components/Flexbox/Flexbox";
import PinCard from "../../components/PinCard/PinCard";
import Toolbar from "../../components/Toolbar/Toolbar";
import Typography from "../../components/Typgoraphy/Typography";
import { getBoard } from "../../services/BoardService";
import { BoardData, UserData } from "../../services/responses/responses";
import { getUser } from "../../services/UserService";
import UserContext from "../../store/userContext";
import LoadingPage from "../LoadingPage/LoadingPage";

import "./BoardPage.scss";

interface BoardPageProps {}

const breakpointColumnsObj = {
  default: 7,
  1820: 6, // 1800 or less
  1600: 5,
  1400: 4,
  1100: 3,
  900: 2,
  600: 1,
};

export default function BoardPage() {
  const { id } = useParams();

  const { userBoards, currentSavedPins, setTextPopup } =
    useContext(UserContext);

  // Board info
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [avatarId, setAvatarId] = useState<string>("");
  const [authorInfo, setAuthorInfo] = useState<UserData | null>(null);

  const hadleCopyBoardLink = async () => {
    const url = window.location.origin + "/board/" + id;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setTextPopup("Copied to clipboard.");
      })
      .catch(() => {
        console.log("Didn't copy!");
      });
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
            //    handleSavePin(pinId);
          }}
          onSetBoardId={(boardId) => {
            //    setBoardId(boardId);
          }}
          onShowCreateBoard={() => {
            //    setShowCreateBoard(!showCreateBoard);
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
        <Typography fontSize={3} fontWeight="bold">
          {boardData.title}
        </Typography>
        <Avatar imgId={authorInfo.avatarSrc} size={48} />
        <Box margin="10px 0px 0px 0px">
          <Typography fontSize={12} fontWeight="bold">
            {authorInfo.username}
          </Typography>
        </Box>
        <Box margin="10px 0px 0px 0px">
          <Typography
            fontSize={12}
            fontWeight="bold"
          >{`${authorInfo.subscribers.length} subscribers`}</Typography>
        </Box>
        <Box margin="10px 0px 0px 0px">
          <Button onClick={hadleCopyBoardLink}>Share</Button>
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
