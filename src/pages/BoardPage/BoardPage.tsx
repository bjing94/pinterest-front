import { AxiosError } from "axios";
import React, { useContext, useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import { Link, useParams } from "react-router-dom";
import Avatar from "../../components/Avatar/Avatar";
import Box from "../../components/Box/Box";
import Button from "../../components/Button/Button";
import EditPinPopup from "../../components/EditPinPopup/EditPinPopup";
import Flexbox from "../../components/Flexbox/Flexbox";
import PinCard from "../../components/PinCard/PinCard";
import Toolbar from "../../components/Toolbar/Toolbar";
import Typography from "../../components/Typgoraphy/Typography";
import UsersPopup from "../../components/UsersPopup/UsersPopup";
import copyCurrentUrl from "../../helpers/copyCurrentUrl";
import { checkLogin } from "../../services/AuthService";
import {
  getBoard,
  getBoards,
  savePinToBoard,
  savePinToProfile,
  updateBoard,
} from "../../services/BoardService";
import { UpdatePinDto } from "../../services/dto/update-pin.dto";
import {
  BoardData,
  ErrorData,
  UserData,
} from "../../services/responses/responses";
import { getUser, subscribe, unsubscribe } from "../../services/UserService";
import ErrorPageContext from "../../store/errorPageContext";
import UserContext from "../../store/userContext";
import LoadingPage from "../LoadingPage/LoadingPage";

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

  const { setTextPopup, setErrorPopup, authUserData } = useContext(UserContext);
  const { setErrorPageData } = useContext(ErrorPageContext);
  // Board info
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [authorInfo, setAuthorInfo] = useState<UserData | null>(null);
  const [boardId, setBoardId] = useState<string>();
  const [showCreateBoard, setShowCreateBoard] = useState(false);

  const [showSubscribersPopup, setShowSubscribersPopup] = useState(false);
  const [showEditPin, setShowEditPin] = useState(false);
  const [editedPinId, setEditedPinId] = useState("");
  const [boardsData, setBoardsData] = useState<BoardData[]>();
  const handleDeletePinFromBoard = async () => {
    if (!id || !editedPinId) {
      return;
    }

    const oldBoardResponse = await getBoard(id).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      }
    );

    if (!oldBoardResponse || oldBoardResponse.status !== 200) {
      return;
    }
    const oldBoard = oldBoardResponse.data as BoardData;

    oldBoard.pins = oldBoard.pins.filter((pinId) => pinId !== editedPinId);

    const updateOldResponse = await updateBoard(id, oldBoard).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      }
    );
    if (!updateOldResponse) {
      return;
    }
    setTextPopup("Pin deleted from board");
  };

  const handleChangeBoard = async (
    dto: UpdatePinDto,
    oldBoardId: string,
    newBoardId: string,
    newImgFile?: File,
    createBoardTitle?: string
  ) => {
    if (oldBoardId === "" || newBoardId === "" || oldBoardId === newBoardId)
      return;

    // change old board
    const oldBoardResponse = await getBoard(oldBoardId).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      }
    );

    if (!oldBoardResponse || oldBoardResponse.status !== 200) {
      return;
    }
    const oldBoard = oldBoardResponse.data as BoardData;

    oldBoard.pins = oldBoard.pins.filter((pinId) => pinId !== editedPinId);

    const updateOldResponse = await updateBoard(oldBoardId, oldBoard).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      }
    );
    if (!updateOldResponse) {
      return;
    }

    // update new board if it's not fresh
    const newBoardResponse = await getBoard(newBoardId).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      }
    );

    if (!newBoardResponse || newBoardResponse.status !== 200) {
      return;
    }
    const newBoard = newBoardResponse.data as BoardData;

    newBoard.pins.push(editedPinId);

    const updateNewResponse = await updateBoard(newBoardId, newBoard).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      }
    );
    if (!updateNewResponse) {
      return;
    }

    setTextPopup("Board updated.");
  };

  const handleSubscribe = async (subscribeToId: string) => {
    if (!authorInfo) {
      return;
    }
    const isAuth = await checkLogin();
    if (isAuth) {
      await subscribe(subscribeToId).catch((err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      });
    } else {
      setErrorPopup("Not authenticated!");
    }
  };

  const handleUnSubscribe = async (subscribeToId: string) => {
    if (!authorInfo) {
      return;
    }
    const isAuth = await checkLogin();
    if (isAuth) {
      await unsubscribe(subscribeToId).catch((err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      });
    } else {
      setErrorPopup("Not authenticated!");
    }
  };

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

  const getBoardInfo = async () => {
    if (!id) return;
    const boardResponse = await getBoard(id).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPageData({
          code: err.response.data.statusCode,
          message: err.response.data.message,
        });
      }
    );
    if (!boardResponse || boardResponse.status !== 200) {
      return;
    }

    const boardData = boardResponse.data as BoardData;
    setBoardData(boardData);

    const userResponse = await getUser(boardData.userId).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      }
    );
    if (!userResponse || userResponse.status !== 200) return;

    const userData = userResponse.data as UserData;
    setAuthorInfo(userData);
  };
  const getAuthUserBoards = async () => {
    if (!authUserData) return;
    const boardsData = await getBoards(authUserData.boards);
    setBoardsData(boardsData);
  };

  useEffect(() => {
    getBoardInfo();
    getAuthUserBoards();
  }, []);

  if (!boardData || !authorInfo) {
    return <LoadingPage />;
  }

  const pinElements = boardData.pins.map((id) => {
    const isOwner = boardData.userId === authUserData?._id;
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
          pinId={id}
          isSaved={isSaved}
          isOwner={isOwner}
          boards={[]}
          onSavePin={(pinId) => {
            handleSavePin(pinId);
          }}
          onEdit={() => {
            setShowEditPin(true);
            setEditedPinId(id);
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
      {showEditPin && (
        <EditPinPopup
          pinId={editedPinId}
          title={"Edit pin"}
          onClose={() => {
            setShowEditPin(false);
          }}
          onDelete={() => {
            handleDeletePinFromBoard();
          }}
          onUpdate={handleChangeBoard}
          isSaver={true}
        />
      )}
      {showSubscribersPopup && (
        <UsersPopup
          userIds={authorInfo.subscribers}
          title={`${authorInfo.subscribers.length} subscribers`}
          onClose={() => {
            setShowSubscribersPopup(false);
          }}
          onSubscribe={handleSubscribe}
          onUnSubscribe={handleUnSubscribe}
        />
      )}
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
          <Button
            variant="text"
            onClick={() => {
              setShowSubscribersPopup(true);
            }}
          >
            <Typography fontSize={16} fontWeight="bold">
              {authorInfo.subscribers.length} subscribers
            </Typography>
          </Button>
        </Box>
        <Box margin="10px 0px 0px 0px">
          <Button
            onClick={() => {
              copyCurrentUrl()
                .then(() => {
                  setTextPopup("Copied to clipboard.");
                })
                .catch(() => {
                  setErrorPopup("Didn't copy!");
                });
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
