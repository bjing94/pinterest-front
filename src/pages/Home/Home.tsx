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
import {
  getBoard,
  savePinToBoard,
  savePinToProfile,
  updateBoard,
} from "../../services/BoardService";
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
  930: 3,
  710: 2,
  550: 1,
};

export default function Home() {
  const {
    isAuth,
    setTextPopup,
    setErrorPopup,
    userBoards,
    currentSavedPins,
    updateUserInfo,
  } = useContext(UserContext);

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
        const userInfo = response.data as UserData;
        savePinToProfile(id, userInfo)
          .then(() => {
            setTextPopup("Pin saved to profile!");
          })
          .catch((err: string) => {
            setErrorPopup(err);
          });

        return;
      }

      savePinToBoard(id, boardId)
        .then(() => {
          setTextPopup("Pin saved to board!");
        })
        .catch((err) => {
          setErrorPopup(err);
        });
    }

    return;
  };

  const getPins = async () => {
    const data = await getRandomPins();

    if (!data) {
      throw "No pins on the server!";
    }

    console.log("Got pins: ", data);
    setPinIds(
      data.map((pin) => {
        return pin._id;
      })
    );
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
    return (
      <Flexbox
        justifyContent="center"
        style={{ width: "100%" }}
        key={`pin-card-${id}`}
      >
        <PinCard
          isSaved={isSaved}
          boards={userBoards.map((board) => board._id)}
          onSetBoardId={(boardId) => {
            setBoardId(boardId);
          }}
          onSavePin={(pinId) => {
            handleSavePin(pinId).then(() => {
              updateUserInfo();
            });
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
