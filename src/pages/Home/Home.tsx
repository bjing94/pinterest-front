import { AxiosError } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Masonry from "react-masonry-css";
import { Link } from "react-router-dom";
import BoardCreatePopup from "../../components/BoardCreatePopup";
import Flexbox from "../../components/Flexbox/Flexbox";
import PinCard from "../../components/PinCard/PinCard";
import RoundButton from "../../components/RoundButton/RoundButton";
import Toolbar from "../../components/Toolbar/Toolbar";
import {
  getBoards,
  savePinToBoard,
  savePinToProfile,
} from "../../services/BoardService";
import { getRandomPins } from "../../services/PinService";
import { BoardData, ErrorData } from "../../services/responses/responses";
import UserContext from "../../store/userContext";

import "./Home.scss";

const breakpointColumnsObj = {
  default: 7,
  1820: 6,
  1600: 5,
  1400: 4,
  930: 3,
  710: 2,
  550: 1,
};

export default function Home() {
  const { isAuth, setTextPopup, setErrorPopup, updateUserInfo, authUserData } =
    useContext(UserContext);

  const [pinsIds, setPinIds] = useState<string[]>([]);
  const [boardId, setBoardId] = useState<string>();
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [boardsData, setBoardsData] = useState<BoardData[]>();
  const handleSavePin = async (id: string) => {
    if (!id) {
      return;
    }

    if (authUserData) {
      if (!boardId) {
        savePinToProfile(id, authUserData)
          .then(() => {
            setTextPopup("Pin saved to profile!");
          })
          .catch((err: AxiosError<ErrorData>) => {
            if (!err.response) return;
            setErrorPopup(err.response.data.message);
          });

        return;
      }

      savePinToBoard(id, boardId)
        .then(() => {
          setTextPopup("Pin saved to board!");
        })
        .catch((err: AxiosError<ErrorData>) => {
          if (!err.response) return;
          setErrorPopup(err.response.data.message);
        });
    }

    return;
  };

  useEffect(() => {
    const getPins = async () => {
      const data = await getRandomPins().catch((err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      });

      if (!data) {
        return;
      }

      setPinIds(
        data.map((pin) => {
          return pin._id;
        })
      );
    };

    const getAuthUserBoards = async () => {
      if (!authUserData) return;
      const boardsData = await getBoards(authUserData.boards);
      setBoardsData(boardsData);
    };
    getPins();
    getAuthUserBoards();
  }, []);

  const pinCards = pinsIds.map((id) => {
    let isSaved = false;
    if (authUserData && boardsData) {
      isSaved =
        boardsData.findIndex((board) => board.pins.includes(id)) !== -1 ||
        authUserData.savedPins.includes(id);
    }

    return (
      <Flexbox
        justifyContent="center"
        style={{ width: "100%" }}
        key={`pin-card-${id}`}
      >
        <PinCard
          isSaved={isSaved}
          boards={authUserData?.boards || [""]}
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
          onSubmit={(value: string) => {
            updateUserInfo();
          }}
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
