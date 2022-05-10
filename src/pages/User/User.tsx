import React, { useContext, useEffect, useRef, useState } from "react";
import { AiFillAmazonCircle } from "react-icons/ai";
import { FiLink, FiShare } from "react-icons/fi";
import Masonry from "react-masonry-css";
import { Link, useParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import ButtonSection from "../../components/ButtonSection";
import Flexbox from "../../components/Flexbox/Flexbox";
import PinCard from "../../components/PinCard/PinCard";
import RoundButton from "../../components/RoundButton/RoundButton";
import Typography from "../../components/Typgoraphy/Typography";
import { CreateUserDto } from "../../services/dto/create-pin.dto";
import {
  findUser,
  getUser,
  subscribe,
  updateUser,
} from "../../services/UserService";
import {
  BoardData,
  ErrorData,
  UserData,
} from "../../services/responses/responses";
import UserBoardCard from "./components/UserBoardCard/UserBoardCard";
import { checkLogin, getCurrentUser } from "../../services/AuthService";
import { getStaticImage } from "../../services/FileService";
import Toolbar from "../../components/Toolbar/Toolbar";
import TextPopup from "../../components/TextPopup";
import {
  createBoard,
  getBoard,
  getBoards,
  updateBoard,
} from "../../services/BoardService";
import BoardCreatePopup from "../../components/BoardCreatePopup";
import Box from "../../components/Box/Box";

import "./User.scss";
import UsersPopup from "./components/UsersPopup/UsersPopup";
import UserContext from "../../store/userContext";
import EditBoardPopup from "./components/EditBoardPopup/EditBoardPopup";
import { deletePin, updatePin } from "../../services/PinService";
import EditPinPopup from "./components/EditPinPopup/EditPinPopup";
import { UpdatePinDto } from "../../services/dto/update-pin.dto";
import ErrorPage from "../ErrorPages/ErrorPage";
import EditUserPopup from "./components/EditUserPopup/EditUserPopup";

const breakpointColumnsObj = {
  default: 7,
  1820: 6, // 1800 or less
  1600: 5,
  1400: 4,
  1100: 3,
  900: 2,
  600: 1,
};

export default function User() {
  const { id: displayId } = useParams();
  const {
    setTextPopup,
    userBoards,
    _id: currentUserId,
    isAuth,
  } = useContext(UserContext);

  const [profileInfo, setProfileInfo] = useState<UserData | undefined>();
  const [showCreated, setShowCreated] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [avatar, setAvatar] = useState("");

  // Pin info
  const [boardId, setBoardId] = useState<string | undefined>(undefined);

  //Current user info
  const [currentUserInfo, setCurrentUserInfo] = useState<UserData | null>();
  const [boardsToPins, setBoardToPins] = useState<
    { boardId: string; pins: string[] }[]
  >([]);

  // Other information
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [showSubscribersPopup, setShowSubscribersPopup] = useState(false);
  const [showSubscribtionsPopup, setShowSubscribtionsPopup] = useState(false);
  const [showEditBoard, setShowEditBoard] = useState(false);
  const [editedBoardId, setEditedBoardId] = useState("");

  const [showEditPin, setShowEditPin] = useState(false);
  const [editedPinId, setEditedPinId] = useState("");
  const [showEditUser, setShowEditUser] = useState(false);

  const checkSubscribed = async () => {
    if (!profileInfo) {
      return;
    }
    const res = await getCurrentUser();
    if (res) {
      if (res.status == 200) {
        const { _id } = res.data as UserData;
        if (profileInfo.subscribers.find((a) => a === _id) !== undefined) {
          setIsSubscribed(true);
        }
      }
    }
  };

  const handleSubscribe = async (subscribeToId: string) => {
    if (!profileInfo) {
      return;
    }
    const isAuth = await checkLogin();
    if (isAuth) {
      await subscribe(subscribeToId);
    } else {
      console.log("Not authenticated!");
    }
  };

  const handleCopyUserLink = async () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setTextPopup("Copied to clipboard.");
      })
      .catch(() => {
        console.log("Didn't copy!");
      });
  };

  const handleDeletePin = async (pinId: string) => {
    const response = await deletePin(pinId);

    if (!response || response.status !== 200) {
      return;
    }

    setTextPopup("Pin deleted.");
    getProfileInfo();
  };

  const handleUpdatePin = async (
    dto: UpdatePinDto,
    oldId: string,
    newId: string,
    createBoardTitle?: string
  ) => {
    let newBoardId = newId;
    let oldBoardId = oldId;

    if (createBoardTitle) {
      // create new board
      const createBoardResponse = await createBoard({
        title: createBoardTitle,
        pins: [editedPinId],
        userId: currentUserId,
      });
      if (!createBoardResponse || createBoardResponse.status !== 201) {
        console.log("Error creating board.");
        return;
      }

      newBoardId = (createBoardResponse.data as BoardData)._id;
    }

    if (oldBoardId !== "" && oldBoardId !== newBoardId) {
      // change old board
      const oldBoardResponse = await getBoard(oldBoardId);

      if (!oldBoardResponse || oldBoardResponse.status !== 200) {
        console.log("Error getting old board.");
        return;
      }
      const oldBoard = oldBoardResponse.data as BoardData;

      oldBoard.pins = oldBoard.pins.filter((pinId) => pinId !== editedPinId);

      const updateOldResponse = await updateBoard(oldBoardId, oldBoard);
      if (!updateOldResponse) {
        console.log("Error updating old board.");
        return;
      }
    }

    if (!createBoardTitle && newBoardId !== "" && oldBoardId !== newBoardId) {
      // update new board if it's not fresh
      const newBoardResponse = await getBoard(newBoardId);

      if (!newBoardResponse || newBoardResponse.status !== 200) {
        console.log("Error getting new board.");
        return;
      }
      const newBoard = newBoardResponse.data as BoardData;

      newBoard.pins.push(editedPinId);

      const updateNewResponse = await updateBoard(newBoardId, newBoard);
      if (!updateNewResponse) {
        console.log("Error updating new board");
        return;
      }
    }

    updatePin(editedPinId, dto); // update pin info
    setTextPopup("Pin updated.");
    getProfileInfo();
  };

  const handleSavePin = async (pindId: string) => {
    if (!pindId || !boardId) {
      return;
    }

    const response = await getCurrentUser();
    if (response && response.status == 200) {
      const boardResponse = await getBoard(boardId);
      if (!boardResponse || boardResponse.status !== 200) {
        console.log("Error finding board!");
        return;
      }
      const newBoard = boardResponse.data as BoardData;
      newBoard.pins.push(pindId);

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

  const getCurrentUserInfo = async () => {
    const response = await getCurrentUser();
    if (!response || response.status !== 200) return;

    const userData = response.data as UserData;
    setCurrentUserInfo(userData);

    const currentBoardsData: BoardData[] = await getBoards(userData.boards);

    const newBoardsToPins: { boardId: string; pins: string[] }[] = [];
    currentBoardsData.forEach((board) => {
      newBoardsToPins.push({ boardId: board._id, pins: board.pins });
    });

    setBoardToPins(newBoardsToPins);
  };

  const getProfileInfo = async () => {
    if (displayId) {
      const response = await findUser({ displayId: displayId });

      if (response) {
        if (response.status == 200) {
          const user = response.data as UserData;
          setProfileInfo(user);
          await checkSubscribed();

          const staticSrc = await getStaticImage(user.avatarSrc);
          setAvatar(staticSrc ?? "");
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    getProfileInfo();
    getCurrentUserInfo();
    console.log(currentUserId);
    console.log(isAuth);
  }, []);

  useEffect(() => {}, [profileInfo, currentUserInfo]);

  if (isLoading) {
    return (
      <Flexbox style={{ width: "100%" }} justifyContent="center">
        <Typography>Loading!</Typography>
      </Flexbox>
    );
  }

  if (!profileInfo) {
    return <ErrorPage errorCode={404} />;
  }

  const isOwner = currentUserId === profileInfo._id;

  const pinElements = profileInfo.createdPins.map((id) => {
    const isSaved = !!boardsToPins.find((data) => {
      return data.pins.includes(id);
    });

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
          boards={userBoards.map((board) => board._id)}
          onSavePin={(pinId) => {
            handleSavePin(pinId);
          }}
          onSetBoardId={(boardId) => {
            setBoardId(boardId);
          }}
          onShowCreateBoard={() => {
            setShowCreateBoard(!showCreateBoard);
          }}
          onEdit={() => {
            setShowEditPin(true);
            setEditedPinId(id);
          }}
        />
      </Flexbox>
    );
  });

  const boardElements = profileInfo.boards.map((boardId) => {
    return (
      <Flexbox
        justifyContent="center"
        style={{ width: "100%" }}
        key={`board-card-${boardId}`}
      >
        <UserBoardCard
          id={boardId}
          onEdit={() => {
            setShowEditBoard(true);
            setEditedBoardId(boardId);
          }}
          isOwner={currentUserId === profileInfo._id}
        />
      </Flexbox>
    );
  });

  if (!isOwner) {
    return (
      <div>
        {showEditBoard && (
          <EditBoardPopup
            boardId={editedBoardId}
            title={"Edit board"}
            onClose={() => {
              setShowEditBoard(false);
            }}
          />
        )}
        {showSubscribersPopup && (
          <UsersPopup
            userIds={profileInfo.subscribers}
            title={`${profileInfo.subscribers.length} subscribers`}
            onClose={() => {
              setShowSubscribersPopup(false);
            }}
            onSubscribe={handleSubscribe}
          />
        )}
        {showSubscribtionsPopup && (
          <UsersPopup
            userIds={profileInfo.subscriptions}
            title={`${profileInfo.subscriptions.length} subscribtions`}
            onClose={() => {
              setShowSubscribtionsPopup(false);
            }}
            onSubscribe={handleSubscribe}
          />
        )}
        {showCreateBoard && (
          <BoardCreatePopup
            onClose={() => {
              setShowCreateBoard(false);
            }}
            onSubmit={() => {}}
          />
        )}
        <Toolbar />
        <Flexbox flexDirection="column" alignItems="center">
          <RoundButton
            size={128}
            style={{ background: `url(${avatar}) center center` }}
          ></RoundButton>
          <Typography fontWeight="bold">{profileInfo.username}</Typography>
          <Typography fontSize={14}>
            {`@${profileInfo.displayId} ${profileInfo.description ?? ""}`}
          </Typography>
          <div style={{ marginTop: "1rem" }}>
            <Flexbox>
              <Button
                variant="text"
                onClick={() => {
                  setShowSubscribersPopup(true);
                }}
              >
                <Typography fontSize={16} fontWeight="bold">
                  {profileInfo.subscribers.length} subscribers
                </Typography>
              </Button>

              <Button
                variant="text"
                onClick={() => {
                  setShowSubscribtionsPopup(true);
                }}
              >
                <Typography
                  fontSize={16}
                  fontWeight="bold"
                  className="user__subscriptions"
                >
                  {profileInfo.subscriptions.length} subscriptions
                </Typography>
              </Button>
            </Flexbox>
          </div>
          <Box margin="20px 0 0 0">
            <Flexbox>
              <RoundButton size={48} onClick={handleCopyUserLink}>
                <FiLink size={24} />
              </RoundButton>
              {!isSubscribed && currentUserInfo && (
                <Button
                  onClick={() => {
                    handleSubscribe(profileInfo._id);
                  }}
                >
                  Subscribe
                </Button>
              )}
              {isSubscribed && currentUserInfo && (
                <Button className="user__subscribed-btn" color="secondary">
                  Subscribed
                </Button>
              )}
            </Flexbox>
          </Box>
          <Box margin="40px 0 0 0">
            <Flexbox>
              <ButtonSection
                isActive={showCreated}
                onClick={() => {
                  setShowCreated(true);
                }}
              >
                <Typography fontSize={16} fontWeight="bold">
                  Created
                </Typography>
              </ButtonSection>
              <ButtonSection
                isActive={!showCreated}
                onClick={() => {
                  setShowCreated(false);
                }}
              >
                <Typography fontSize={16} fontWeight="bold">
                  Saved
                </Typography>
              </ButtonSection>
            </Flexbox>
          </Box>
          <Flexbox style={{ width: "100%" }}>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="user-masonry-grid"
              columnClassName="user-masonry-grid_column"
            >
              {showCreated ? pinElements : boardElements}
            </Masonry>
          </Flexbox>
        </Flexbox>
      </div>
    );
  } else {
    return (
      <div>
        {showEditUser && (
          <EditUserPopup
            userData={profileInfo}
            title={"Edit profile"}
            onClose={() => {
              setShowEditUser(false);
            }}
            onUpdate={(dto) => {
              updateUser(profileInfo._id, dto);
            }}
          />
        )}
        {showEditBoard && (
          <EditBoardPopup
            boardId={editedBoardId}
            title={"Edit board"}
            onClose={() => {
              setShowEditBoard(false);
            }}
          />
        )}
        {showEditPin && (
          <EditPinPopup
            pinId={editedPinId}
            title={"Edit pin"}
            onClose={() => {
              setShowEditPin(false);
            }}
            onDelete={() => {
              handleDeletePin(editedPinId);
            }}
            onUpdate={handleUpdatePin}
          />
        )}
        {showSubscribersPopup && (
          <UsersPopup
            userIds={profileInfo.subscribers}
            title={`${profileInfo.subscribers.length} subscribers`}
            onClose={() => {
              setShowSubscribersPopup(false);
            }}
            onSubscribe={handleSubscribe}
          />
        )}
        {showSubscribtionsPopup && (
          <UsersPopup
            userIds={profileInfo.subscriptions}
            title={`${profileInfo.subscriptions.length} subscribtions`}
            onClose={() => {
              setShowSubscribtionsPopup(false);
            }}
            onSubscribe={handleSubscribe}
          />
        )}
        {showCreateBoard && (
          <BoardCreatePopup
            onClose={() => {
              setShowCreateBoard(false);
            }}
            onSubmit={() => {}}
          />
        )}
        <Toolbar />
        <Flexbox flexDirection="column" alignItems="center">
          <RoundButton
            size={128}
            style={{ background: `url(${avatar}) center center` }}
          ></RoundButton>
          <Typography fontWeight="bold">{profileInfo.username}</Typography>
          <Typography fontSize={14}>
            {`@${profileInfo.displayId} ${profileInfo.description ?? ""}`}
          </Typography>
          <div style={{ marginTop: "1rem" }}>
            <Flexbox>
              <Button
                variant="text"
                onClick={() => {
                  setShowSubscribersPopup(true);
                }}
              >
                <Typography fontSize={16} fontWeight="bold">
                  {profileInfo.subscribers.length} subscribers
                </Typography>
              </Button>

              <Button
                variant="text"
                onClick={() => {
                  setShowSubscribtionsPopup(true);
                }}
              >
                <Typography
                  fontSize={16}
                  fontWeight="bold"
                  className="user__subscriptions"
                >
                  {profileInfo.subscriptions.length} subscriptions
                </Typography>
              </Button>
            </Flexbox>
          </div>
          <Box margin="20px 0 0 0">
            <Flexbox>
              <RoundButton size={48} onClick={handleCopyUserLink}>
                <FiLink size={24} />
              </RoundButton>
              <Button
                onClick={() => {
                  setShowEditUser(true);
                }}
              >
                Edit profile
              </Button>
            </Flexbox>
          </Box>
          <Box margin="40px 0 0 0">
            <Flexbox>
              <ButtonSection
                isActive={showCreated}
                onClick={() => {
                  setShowCreated(true);
                }}
              >
                <Typography fontSize={16} fontWeight="bold">
                  Created
                </Typography>
              </ButtonSection>
              <ButtonSection
                isActive={!showCreated}
                onClick={() => {
                  setShowCreated(false);
                }}
              >
                <Typography fontSize={16} fontWeight="bold">
                  Saved
                </Typography>
              </ButtonSection>
            </Flexbox>
          </Box>
          <Flexbox style={{ width: "100%" }}>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="user-masonry-grid"
              columnClassName="user-masonry-grid_column"
            >
              {showCreated ? pinElements : boardElements}
            </Masonry>
          </Flexbox>
        </Flexbox>
      </div>
    );
  }
}
