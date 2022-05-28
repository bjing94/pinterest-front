import React, { useContext, useEffect, useState } from "react";
import { FiLink, FiMoreHorizontal } from "react-icons/fi";
import { useParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import Flexbox from "../../components/Flexbox/Flexbox";
import RoundButton from "../../components/RoundButton/RoundButton";
import Typography from "../../components/Typgoraphy/Typography";

import "./Pin.scss";
import CommunityInfo from "../../components/CommuntiyInfo/CommunityInfo";
import ResponsiveImage from "../../components/ResponsiveImage/ResponsiveImage";
import CommentSection from "../../components/CommentSection/CommentSection";
import {
  downloadStaticImage,
  getStaticImage,
} from "../../services/FileService";
import { deletePin, getPin, updatePin } from "../../services/PinService";
import { checkLogin, getCurrentUser } from "../../services/AuthService";
import {
  BoardData,
  CommentData,
  ErrorData,
  PinData,
  UserData,
} from "../../services/responses/responses";
import {
  getUser,
  subscribe,
  unsubscribe,
  updateUser,
} from "../../services/UserService";
import Toolbar from "../../components/Toolbar/Toolbar";
import {
  createComment,
  deleteComment,
  getComment,
  updateComment,
} from "../../services/CommentService";
import Dropdown from "../../components/Dropdown";
import DropdownBoards from "../../components/DropdownBoards/DropdownBoards";
import {
  getBoard,
  getBoards,
  savePinToBoard,
  savePinToProfile,
  updateBoard,
} from "../../services/BoardService";
import BoardCreatePopup from "../../components/BoardCreatePopup";
import UserContext from "../../store/userContext";
import ErrorPage from "../ErrorPages/ErrorPage";
import LoadingPage from "../LoadingPage/LoadingPage";

export default function Pin() {
  const { id } = useParams();
  const { setTextPopup, setErrorPopup } = useContext(UserContext);

  // Current user information
  const [boardId, setBoardId] = useState<string | undefined>(undefined);
  const [isSaved, setIsSaved] = useState<boolean | undefined>(undefined);
  const [isSubscribed, setIsSubscribed] = useState<boolean | undefined>(
    undefined
  );
  const [currentUserInfo, setCurrentUserInfo] = useState<UserData | null>(null);
  const [isAuth, setIsAuth] = useState<boolean | undefined>(undefined);

  // Author information
  const [authorInfo, setAuthorInfo] = useState<UserData | undefined>(undefined);
  const [authorId, setAuthorId] = useState<string | undefined>(undefined);
  const [avatarId, setAvatarId] = useState("");

  // Pin information
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [downloadLink, setDownloadLink] = useState<string | undefined>(
    undefined
  );
  const [comments, setComments] = useState<string[] | undefined>(undefined);

  // Show/hide
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [showBoards, setShowBoards] = useState(false);

  // Responsive design
  const [isTablet, setIsTablet] = useState(false);

  //Error handling
  const [errorMsg, setErrorMsg] = useState("");
  const [errorCode, setErrorCode] = useState(0);

  const getCurrentUserInfo = async () => {
    const resAuth = await checkLogin();
    setIsAuth(resAuth);
    if (!resAuth) return;

    await getCurrentUser().then((response) => {
      if (!response || response.status !== 200) {
        return;
      }

      const { _id, boards } = response.data as UserData;
      setCurrentUserInfo(response.data as UserData);

      checkSaved();
    });
  };

  const getAuthorInfo = async () => {
    if (!authorInfo?._id) {
      setErrorPopup("Error loading author data!");
      return;
    }
    const userResponse = await getUser(authorInfo._id);
    if (userResponse && userResponse.status == 200) {
      const userData = userResponse.data as UserData;
      setAuthorInfo(userData);

      const avatarSrc = await getStaticImage(userData.avatarSrc);
      if (avatarSrc) {
        setAvatarId(avatarSrc);
      }
    }
  };
  const getPinInfo = async () => {
    if (id) {
      const pinResponse = await getPin(id);
      console.log("PinId", id);
      if (!pinResponse) {
        return;
      }
      if (pinResponse.status === 200) {
        const pinInfo = pinResponse.data as PinData;
        setDescription(pinInfo.content);
        setTitle(pinInfo.title);
        setComments(pinInfo.comments ?? []);
        const userResponse = await getUser(pinInfo.userId);
        if (userResponse && userResponse.status == 200) {
          const userData = userResponse.data as UserData;
          setAuthorInfo(userData);

          const avatarSrc = await getStaticImage(userData.avatarSrc);
          if (avatarSrc) {
            setAvatarId(avatarSrc);
          }
        }
        downloadStaticImage(pinInfo.imgId).then((res: string) => {
          setDownloadLink(res);
        });
        const link = await getStaticImage(pinInfo.imgId);
        if (link) {
          setImgSrc(link);
        }
      } else {
        const error = pinResponse.data as ErrorData;
        setErrorMsg(error.message);
        setErrorCode(error.statusCode);
      }
    }
  };

  const checkSubscribed = async () => {
    const res = await getCurrentUser();
    if (res) {
      if (res.status == 200) {
        const { _id } = res.data as UserData;
        if (authorInfo) {
          const subbed =
            authorInfo.subscribers.find((a) => {
              return a === _id;
            }) !== undefined;
          setIsSubscribed(subbed);
          return;
        }
      }
    }
    setIsSubscribed(false);
  };

  const checkSaved = async () => {
    const userResponse = await getCurrentUser();
    if (!userResponse || userResponse.status !== 200 || !id) {
      return;
    }
    const userData = userResponse.data as UserData;
    const currentBoardsData = await getBoards(userData.boards);

    // check if saved in boards
    for (let i = 0; i < currentBoardsData.length; i++) {
      if (currentBoardsData[i].pins.includes(id)) {
        setIsSaved(true);
        return;
      }
    }

    // check if saved in profile
    for (let i = 0; i < userData.savedPins.length; i++) {
      if (userData.savedPins[i] === id) {
        setIsSaved(true);
        return;
      }
    }
    setIsSaved(false);
  };

  const handleSubscribe = async () => {
    if (!authorInfo) {
      return;
    }

    if (isAuth) {
      if (!isSubscribed) {
        await subscribe(authorInfo._id);
        setTextPopup("Subscribed!");
        await getAuthorInfo();
        return;
      }
      if (isSubscribed) {
        await unsubscribe(authorInfo._id);
        setTextPopup("Unsubscribed!");
        await getAuthorInfo();
        return;
      }
    } else {
      setErrorPopup("Not authenticated!");
    }
  };

  const handleCopyPinLink = async () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setTextPopup("Copied to clipboard.");
      })
      .catch(() => {
        setErrorPopup("Didn't copy!");
      });
  };

  const handleSavePin = async () => {
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

  const handleCreateComment = async (content: string) => {
    if (!currentUserInfo) {
      setTextPopup("Please log in");
      return;
    }

    if (!id) {
      return;
    }
    const { _id: currentUserId } = currentUserInfo;

    console.log("Creating comment:", currentUserId, content);
    const commentResponse = await createComment({
      userId: currentUserId,
      content: content,
    });
    if (!commentResponse || commentResponse.status !== 201) {
      setErrorPopup("Comment wasnt created");
      return;
    }
    const commentData = commentResponse.data as CommentData;

    const pinResponse = await getPin(id);
    if (!pinResponse || pinResponse.status !== 200) {
      setErrorPopup("Pin not  found");
      return;
    }

    const newPin = { ...(pinResponse.data as PinData) };
    if (!newPin.comments) {
      return;
    }
    newPin.comments.push(commentData._id);
    const updatedResponse = await updatePin(id, { comments: newPin.comments });
    getPinInfo();
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!id) {
      return;
    }
    const commentResponse = await deleteComment(commentId);
    if (!commentResponse) {
      return;
    }

    const pinResponse = await getPin(id);
    if (!pinResponse || pinResponse.status !== 200) {
      return;
    }

    const newPin = { ...(pinResponse.data as PinData) };
    if (!newPin.comments) {
      return;
    }
    newPin.comments = newPin.comments.filter((id) => {
      return id != commentId;
    });
    await updatePin(id, { comments: newPin.comments });
    getPinInfo();
  };

  const handleLikeComment = async (commentId: string) => {
    if (!currentUserInfo) {
      setTextPopup("Please log in");
      return;
    }

    if (!id) {
      return;
    }
    const { _id: currentUserId } = currentUserInfo;

    const commentResponse = await getComment(commentId);
    if (!commentResponse || commentResponse.status !== 200) {
      return;
    }
    const newComment = commentResponse.data as CommentData;
    if (newComment.likedBy.includes(currentUserId)) {
      newComment.likedBy = newComment.likedBy.filter(
        (id) => id !== currentUserId
      );
    } else {
      newComment.likedBy.push(currentUserId);
    }
    await updateComment(commentId, newComment);
    getPinInfo();
  };

  const handleUsefulComment = async (commentId: string) => {
    if (!currentUserInfo) {
      setTextPopup("Please log in");
      return;
    }

    if (!id) {
      return;
    }
    const { _id: currentUserId } = currentUserInfo;

    const commentResponse = await getComment(commentId);
    if (!commentResponse || commentResponse.status !== 200) {
      return;
    }
    const newComment = commentResponse.data as CommentData;
    if (newComment.usefulBy.includes(currentUserId)) {
      newComment.usefulBy = newComment.usefulBy.filter(
        (id) => id !== currentUserId
      );
    } else {
      newComment.usefulBy.push(currentUserId);
    }
    await updateComment(commentId, newComment);
    getPinInfo();
  };

  const loadInfo = async () => {
    await getPinInfo();
    await getCurrentUserInfo();
  };

  useEffect(() => {
    loadInfo();
  }, [id]);

  useEffect(() => {
    checkSubscribed();
  }, [authorInfo]);

  if (!id) {
    return <div>No such pin!</div>;
  }

  if (errorMsg) {
    return <ErrorPage errorCode={errorCode} />;
  }

  const userInfoReady =
    isSaved !== undefined &&
    isSubscribed !== undefined &&
    currentUserInfo !== null;

  const pinInfoReady =
    comments !== undefined &&
    downloadLink !== undefined &&
    imgSrc !== undefined &&
    title !== undefined &&
    description !== undefined &&
    authorInfo !== undefined;

  if ((!userInfoReady && isAuth === undefined) || !pinInfoReady) {
    return <LoadingPage />;
  }

  if (!isAuth && pinInfoReady) {
    return (
      <Flexbox
        justifyContent="flex-start"
        alignItems="center"
        className="pin__page-container"
        flexDirection="column"
        onClick={() => {
          setShowOptionsDropdown(false);
          setShowBoards(false);
        }}
      >
        {showCreateBoard && (
          <BoardCreatePopup
            onClose={() => {
              setShowCreateBoard(false);
            }}
            onSubmit={(value: string) => {}}
          />
        )}
        <Toolbar />
        <Card className="pin__card">
          <Flexbox alignItems="flex-start" className="pin__content">
            <div className="pin__image-container">
              <ResponsiveImage src={imgSrc} />
            </div>
            <Flexbox
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              className="pin__info"
            >
              <Flexbox justifyContent="space-between" fluid>
                <Flexbox>
                  {showOptionsDropdown && (
                    <Dropdown
                      onClickItem={(event: Event) => {
                        event.stopPropagation();
                        setShowOptionsDropdown(false);
                      }}
                      className="pin__dropdown-options"
                    >
                      <a href={downloadLink} download={`${title}-img`}>
                        <Typography fontSize={12} fontWeight="bold">
                          Download image
                        </Typography>
                      </a>
                      <Typography fontSize={12} fontWeight="bold">
                        Report
                      </Typography>
                    </Dropdown>
                  )}
                  <RoundButton
                    size={32}
                    onClick={(event: Event) => {
                      event.stopPropagation();
                      setShowOptionsDropdown(!showOptionsDropdown);
                    }}
                  >
                    <FiMoreHorizontal size={24} />
                  </RoundButton>
                  <RoundButton size={32} onClick={handleCopyPinLink}>
                    <FiLink size={24} />
                  </RoundButton>
                </Flexbox>
              </Flexbox>
              <div style={{ marginTop: "1rem" }}>
                <Typography fontSize={24} fontWeight="bold" textAlign="start">
                  {title}
                </Typography>
                <Typography fontSize={14} textAlign="start">
                  {description}
                </Typography>
              </div>
              <div className="pin__profile-info">
                <CommunityInfo
                  isSubscribed={false}
                  username={authorInfo?.username ?? ""}
                  subscribersCount={authorInfo?.subscribers.length ?? 0}
                  className="pin__profile-info"
                  avatarId={authorInfo.avatarSrc}
                  onClickSubscribe={handleSubscribe}
                  displayId={authorInfo.displayId}
                />
              </div>
              <CommentSection
                commentIds={comments}
                currentUserId={null}
                onCreate={handleCreateComment}
                onLike={handleLikeComment}
                onUseful={handleUsefulComment}
                onDelete={handleDeleteComment}
              />
            </Flexbox>
          </Flexbox>
        </Card>
      </Flexbox>
    );
  }

  if (pinInfoReady && userInfoReady) {
    const { boards, _id: currentUserId } = currentUserInfo;

    return (
      <Flexbox
        justifyContent="flex-start"
        alignItems="center"
        className="pin__page-container"
        flexDirection="column"
        onClick={() => {
          setShowOptionsDropdown(false);
          setShowBoards(false);
        }}
      >
        {showCreateBoard && (
          <BoardCreatePopup
            onClose={() => {
              setShowCreateBoard(false);
            }}
            onSubmit={(value: string) => {}}
          />
        )}
        <Toolbar />
        <Card className="pin__card">
          <Flexbox alignItems="flex-start" className="pin__content">
            <div className="pin__image-container">
              <ResponsiveImage src={imgSrc} />
            </div>
            <Flexbox
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              className="pin__info"
            >
              <Flexbox justifyContent="space-between" fluid>
                <Flexbox>
                  {showOptionsDropdown && (
                    <Dropdown
                      onClickItem={(event: Event) => {
                        event.stopPropagation();
                        setShowOptionsDropdown(false);
                      }}
                      className="pin__dropdown-options"
                    >
                      <a href={downloadLink} download={`${title}-img`}>
                        <Typography fontSize={12} fontWeight="bold">
                          Download image
                        </Typography>
                      </a>
                      <Typography fontSize={12} fontWeight="bold">
                        Report
                      </Typography>
                    </Dropdown>
                  )}
                  <RoundButton
                    size={32}
                    onClick={(event: Event) => {
                      event.stopPropagation();
                      setShowOptionsDropdown(!showOptionsDropdown);
                    }}
                  >
                    <FiMoreHorizontal size={24} />
                  </RoundButton>
                  <RoundButton size={32} onClick={handleCopyPinLink}>
                    <FiLink size={24} />
                  </RoundButton>
                </Flexbox>
                <Flexbox>
                  <DropdownBoards
                    boardIds={boards}
                    onClickCreateBoard={() => {
                      setShowCreateBoard(true);
                    }}
                    onSelect={(boardId: string) => {
                      setBoardId(boardId);
                      setShowBoards(!showBoards);
                    }}
                    showDropdown={showBoards}
                    onClickArrow={(event: Event) => {
                      event.stopPropagation();
                      setShowBoards(!showBoards);
                    }}
                    style={{ background: "none" }}
                  />

                  <Button
                    color={`${isSaved ? "secondary" : "primary"}`}
                    onClick={handleSavePin}
                  >
                    {isSaved ? "Saved" : "Save"}
                  </Button>
                </Flexbox>
              </Flexbox>
              <div style={{ marginTop: "1rem" }}>
                <Typography fontSize={24} fontWeight="bold" textAlign="start">
                  {title}
                </Typography>
                <Typography fontSize={12} textAlign="start">
                  {description}
                </Typography>
              </div>
              <div style={{ marginTop: "1rem" }} className="pin__profile-info">
                <CommunityInfo
                  isSubscribed={isSubscribed}
                  username={authorInfo?.username ?? ""}
                  subscribersCount={authorInfo?.subscribers.length ?? 0}
                  className="pin__profile-info"
                  avatarId={authorInfo.avatarSrc}
                  onClickSubscribe={handleSubscribe}
                  displayId={authorInfo.displayId}
                />
              </div>
              <CommentSection
                commentIds={comments}
                currentUserId={currentUserId}
                onCreate={handleCreateComment}
                onLike={handleLikeComment}
                onUseful={handleUsefulComment}
                onDelete={handleDeleteComment}
              />
            </Flexbox>
          </Flexbox>
        </Card>
      </Flexbox>
    );
  }
  return (
    <div>{`pinInfoReady: ${pinInfoReady}\n userInfoReady: ${userInfoReady}`}</div>
  );
}
