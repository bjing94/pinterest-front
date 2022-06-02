import React, { useContext, useEffect, useState } from "react";
import { FiLink } from "react-icons/fi";
import Masonry from "react-masonry-css";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import ButtonSection from "../../components/ButtonSection";
import Flexbox from "../../components/Flexbox/Flexbox";
import PinCard from "../../components/PinCard/PinCard";
import RoundButton from "../../components/RoundButton/RoundButton";
import Typography from "../../components/Typgoraphy/Typography";
import {
  findUser,
  subscribe,
  unsubscribe,
  updateUser,
} from "../../services/UserService";
import {
  BoardData,
  ErrorData,
  FileData,
  UserData,
} from "../../services/responses/responses";
import UserBoardCard from "./components/UserBoardCard/UserBoardCard";
import { checkLogin } from "../../services/AuthService";
import { getStaticImage, uploadFile } from "../../services/FileService";
import Toolbar from "../../components/Toolbar/Toolbar";
import {
  createBoard,
  getBoard,
  getBoards,
  savePinToBoard,
  savePinToProfile,
  updateBoard,
} from "../../services/BoardService";
import BoardCreatePopup from "../../components/BoardCreatePopup";
import Box from "../../components/Box/Box";
import UsersPopup from "../../components/UsersPopup/UsersPopup";
import UserContext from "../../store/userContext";
import EditBoardPopup from "../../components/EditBoardPopup/EditBoardPopup";
import { deletePin, updatePin } from "../../services/PinService";
import EditPinPopup from "../../components/EditPinPopup/EditPinPopup";
import { UpdatePinDto } from "../../services/dto/update-pin.dto";
import EditUserPopup from "./components/EditUserPopup/EditUserPopup";
import copyCurrentUrl from "../../helpers/copyCurrentUrl";

import "./User.scss";
import { UpdateUserDto } from "../../services/dto/update-user.dto";
import { AxiosError } from "axios";
import SavedPinsCard from "./components/SavedPinsCard/SavedPinsCard";

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

  const { setTextPopup, setErrorPopup, updateUserInfo, authUserData } =
    useContext(UserContext);
  const navigate = useNavigate();

  const [profileInfo, setProfileInfo] = useState<UserData | undefined>();
  const [showCreated, setShowCreated] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [avatar, setAvatar] = useState("");
  const [profilePins, setProfilePins] = useState<string[]>([]);

  // Pin info
  const [boardId, setBoardId] = useState<string | undefined>(undefined);

  //Current user info
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

  const handleSubscribe = async (subscribeToId: string) => {
    if (!profileInfo) {
      return;
    }
    const isAuth = await checkLogin();
    if (isAuth) {
      await subscribe(subscribeToId);
      setTextPopup("Subscribed");
    } else {
      setErrorPopup("Not authenticated!");
    }
    refetchProfileInfo();
  };

  const handleUnSubscribe = async (subscribeToId: string) => {
    if (!profileInfo) {
      return;
    }
    const isAuth = await checkLogin();
    if (isAuth) {
      await unsubscribe(subscribeToId);
      setTextPopup("Unsubscribed");
    } else {
      setErrorPopup("Not authenticated!");
    }
    refetchProfileInfo();
  };

  const handleCopyUserLink = async () => {
    copyCurrentUrl()
      .then(() => {
        setTextPopup("Copied to clipboard.");
      })
      .catch(() => {
        setErrorPopup("Didn't copy!");
      });
  };

  const handleDeletePin = async (pinId: string) => {
    const response = await deletePin(pinId);

    if (!response || response.status !== 200) {
      return;
    }

    setTextPopup("Pin deleted.");
    refetchProfileInfo();
  };

  const handleUpdatePin = async (
    dto: UpdatePinDto,
    oldId: string,
    newId: string,
    newImgFile?: File,
    createBoardTitle?: string
  ) => {
    if (!authUserData) return;
    let newBoardId = newId;
    let oldBoardId = oldId;

    if (createBoardTitle) {
      // create new board
      const createBoardResponse = await createBoard({
        title: createBoardTitle,
        pins: [editedPinId],
        userId: authUserData._id,
      }).catch((err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      });
      if (!createBoardResponse || createBoardResponse.status !== 201) {
        return;
      }

      newBoardId = (createBoardResponse.data as BoardData)._id;
      updateUserInfo();
    }

    if (oldBoardId !== "" && oldBoardId !== newBoardId) {
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
    }

    if (!createBoardTitle && newBoardId !== "" && oldBoardId !== newBoardId) {
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
    }

    if (newImgFile) {
      const uploadedImg = await uploadFile(newImgFile);
      if (!uploadedImg || uploadedImg.status !== 200) return;

      const imgData = uploadedImg.data as FileData;
      dto.imgId = imgData._id;
    }
    updatePin(editedPinId, { ...dto }); // update pin info
    setTextPopup("Pin updated.");
    refetchProfileInfo();
    reloadPins();
  };

  const reloadPins = () => {
    if (!profileInfo) return;
    setProfilePins([]);
    setProfilePins(profileInfo.createdPins);
  };

  const handleUpdateUser = async (dto: UpdateUserDto, newAvatar?: File) => {
    if (!profileInfo) return;
    if (newAvatar) {
      const uploadedImg = await uploadFile(newAvatar);
      if (!uploadedImg || uploadedImg.status !== 200) return;

      const imgData = uploadedImg.data as FileData;
      dto.avatarSrc = imgData._id;
    }
    const response = await updateUser(profileInfo._id, dto).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      }
    );
    if (response?.status !== 200) return;
    setTextPopup("User updated");
    await refetchProfileInfo();
    await updateUserInfo();
    if (dto.displayId !== displayId) {
      navigate(`/user/${dto.displayId}`, {});
    }
  };

  const handleSavePin = async (pindId: string) => {
    if (!pindId || !boardId || !authUserData) {
      return;
    }

    if (!boardId) {
      savePinToProfile(pindId, authUserData)
        .then(() => {
          setTextPopup("Pin saved to profile!");
        })
        .catch((err: AxiosError<ErrorData>) => {
          if (!err.response) return;
          setErrorPopup(err.response.data.message);
        });
      return;
    }

    savePinToBoard(pindId, boardId)
      .then(() => {
        setTextPopup("Pin saved to board!");
      })
      .catch((err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      });

    return;
  };

  const refetchProfileInfo = async () => {
    if (displayId) {
      const response = await findUser({ displayId: displayId }).catch(
        (err: AxiosError<ErrorData>) => {
          if (!err.response) return;
          setErrorPopup(err.response.data.message);
        }
      );

      if (response) {
        if (response.status === 200) {
          const user = response.data as UserData;
          setProfileInfo(user);

          const staticSrc = await getStaticImage(user.avatarSrc).catch(
            (err: AxiosError<ErrorData>) => {
              if (!err.response) return;
              setErrorPopup(err.response.data.message);
            }
          );
          setAvatar(staticSrc ?? "https://via.placeholder.com/128.jpg");
          setProfilePins(user.createdPins);
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
    const getCurrentUserInfo = async () => {
      if (!authUserData) return;

      const currentBoardsData: BoardData[] = await getBoards(
        authUserData.boards
      );

      const newBoardsToPins: { boardId: string; pins: string[] }[] = [];
      currentBoardsData.forEach((board) => {
        newBoardsToPins.push({ boardId: board._id, pins: board.pins });
      });

      setBoardToPins(newBoardsToPins);
    };

    const getProfileInfo = async () => {
      if (displayId) {
        const response = await findUser({ displayId: displayId }).catch(
          (err: AxiosError<ErrorData>) => {
            if (!err.response) return;
            setErrorPopup(err.response.data.message);
          }
        );

        if (response) {
          if (response.status === 200) {
            const user = response.data as UserData;
            setProfileInfo(user);

            const staticSrc = await getStaticImage(user.avatarSrc).catch(
              (err: AxiosError<ErrorData>) => {
                if (!err.response) return;
                setErrorPopup(err.response.data.message);
              }
            );
            setProfilePins(user.createdPins);
            setAvatar(staticSrc ?? "https://via.placeholder.com/128.jpg");
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      }
    };
    getProfileInfo();
    getCurrentUserInfo();
  }, [displayId]);

  if (isLoading) {
    return (
      <Flexbox style={{ width: "100%" }} justifyContent="center">
        <Typography>Loading!</Typography>
      </Flexbox>
    );
  }

  if (!profileInfo) {
    return <div></div>;
  }

  const isOwner = authUserData?._id === profileInfo._id;

  const pinElements = profilePins.map((id) => {
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
          boards={authUserData?.boards || [""]}
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
          isOwner={authUserData?._id === profileInfo._id}
        />
      </Flexbox>
    );
  });
  boardElements.push(
    <Flexbox
      justifyContent="center"
      style={{ width: "100%" }}
      key={`board-card-${boardId}`}
    >
      <SavedPinsCard
        savedPins={profileInfo.savedPins}
        onEdit={() => {
          // setShowEditBoard(true);
          // setEditedBoardId(boardId);
        }}
        isOwner={authUserData?._id === profileInfo._id}
      />
    </Flexbox>
  );

  const isSubscribed =
    profileInfo.subscribers.find((a) => a === authUserData?._id) !== undefined;

  return (
    <>
      {isOwner && showEditUser && (
        <EditUserPopup
          userData={profileInfo}
          title={"Edit profile"}
          onClose={() => {
            setShowEditUser(false);
          }}
          onUpdate={handleUpdateUser}
          avatarSrc={avatar}
        />
      )}
      {isOwner && showEditBoard && (
        <EditBoardPopup
          boardId={editedBoardId}
          title={"Edit board"}
          onClose={() => {
            setShowEditBoard(false);
          }}
          onSubmit={() => {
            updateUserInfo();
            refetchProfileInfo();
          }}
        />
      )}
      {isOwner && showEditPin && (
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
          onUnSubscribe={handleUnSubscribe}
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
          onUnSubscribe={handleUnSubscribe}
        />
      )}
      {showCreateBoard && (
        <BoardCreatePopup
          onClose={() => {
            setShowCreateBoard(false);
          }}
          onSubmit={() => {
            updateUserInfo();
          }}
        />
      )}
      <Toolbar />
      <Flexbox flexDirection="column" alignItems="center" className="user-page">
        <RoundButton
          size={128}
          style={{
            background: `url(${avatar}) center center`,
            backgroundSize: "cover",
          }}
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
            <RoundButton
              size={48}
              onClick={() => {
                handleCopyUserLink();
              }}
            >
              <FiLink size={24} />
            </RoundButton>
            {isOwner && (
              <Button
                onClick={() => {
                  setShowEditUser(true);
                }}
              >
                Edit profile
              </Button>
            )}
            {!isSubscribed && !isOwner && authUserData && (
              <Button
                onClick={() => {
                  handleSubscribe(profileInfo._id);
                }}
              >
                Subscribe
              </Button>
            )}
            {isSubscribed && !isOwner && authUserData && (
              <Button
                className="user__subscribed-btn"
                color="secondary"
                onClick={() => {
                  handleUnSubscribe(profileInfo._id);
                }}
              >
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
    </>
  );
}
