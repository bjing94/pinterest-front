import React, { useContext, useEffect, useState } from "react";
import { FaPlus, FaQuestion } from "react-icons/fa";
import Masonry from "react-masonry-css";
import { Link } from "react-router-dom";
import BoardCreatePopup from "../../components/BoardCreatePopup";
import Flexbox from "../../components/Flexbox/Flexbox";
import PinCard from "../../components/PinCard/PinCard";
import RoundButton from "../../components/RoundButton/RoundButton";
import Toolbar from "../../components/Toolbar/Toolbar";
import { getCurrentUser } from "../../services/AuthService";
import { getBoard, updateBoard } from "../../services/BoardService";
import { getRandomPins } from "../../services/PinService";
import { BoardData, UserData } from "../../services/responses/responses";
import { updateUser } from "../../services/UserService";
import UserContext from "../../store/userContext";

import "./Home.scss";

const breakpointColumnsObj = {
  default: 7,
  1820: 6, // 1800 or less
  1600: 5,
  1400: 4,
  1100: 3,
  900: 2,
  600: 1,
};

export default function Home() {
  const { isAuth, userBoards, currentSavedPins } = useContext(UserContext);

  const [pinsIds, setPinIds] = useState<string[]>([]);
  const [boardId, setBoardId] = useState<string>();
  const [boards, setBoards] = useState<string[]>([]);
  const [showCreateBoard, setShowCreateBoard] = useState(false);

  const handleSavePin = async (id: string) => {
    if (!id) {
      return;
    }

    const response = await getCurrentUser();
    if (response && response.status == 200) {
      if (!boardId) {
        console.log("Saving to profile: ");
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

  const getPins = async () => {
    const data = await getRandomPins();
    if (data) {
      setPinIds(
        data.map((pin) => {
          return pin._id;
        })
      );
    }
  };

  useEffect(() => {
    getPins();
    getCurrentUser().then((response) => {
      if (!response || response.status !== 200) return;

      const userData = response.data as UserData;
      setBoards(userData.boards);
    });
  }, []);

  const pinCards = pinsIds.map((id) => {
    const isSaved =
      userBoards.findIndex((board) => board.pins.includes(id)) !== -1 ||
      currentSavedPins.includes(id);
    if (!isSaved) {
      console.log("ID:", id);
      console.log(userBoards);
      console.log(currentSavedPins);
    }
    return (
      <Flexbox
        justifyContent="center"
        style={{ width: "100%" }}
        key={`pin-card-${id}`}
      >
        <PinCard
          isSaved={isSaved}
          boards={boards}
          onSetBoardId={(boardId) => {
            setBoardId(boardId);
          }}
          onSavePin={(pinId) => {
            handleSavePin(pinId);
          }}
          onShowCreateBoard={() => {
            setShowCreateBoard(true);
          }}
          pinId={id}
          showInfo={true}
        />
      </Flexbox>
    );
  });

  return (
    <div className="home-container">
      {showCreateBoard && (
        <BoardCreatePopup
          onClose={() => {
            setShowCreateBoard(false);
          }}
          onSubmit={(value: string) => {}}
        />
      )}
      <Toolbar />
      {isAuth && (
        <Link to="/pin-builder">
          <RoundButton
            type="action"
            style={{ position: "fixed", right: "1rem", bottom: "40px" }}
            size={48}
          >
            <FaPlus size={24} />
          </RoundButton>
        </Link>
      )}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {pinCards}
      </Masonry>
    </div>
  );
}
