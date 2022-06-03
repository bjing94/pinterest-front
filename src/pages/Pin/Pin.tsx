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
import { getPin, updatePin } from "../../services/PinService";
import {
  CommentData,
  ErrorData,
  PinData,
  UserData,
} from "../../services/responses/responses";
import { getUser, subscribe, unsubscribe } from "../../services/UserService";
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
  getBoards,
  savePinToBoard,
  savePinToProfile,
} from "../../services/BoardService";
import BoardCreatePopup from "../../components/BoardCreatePopup";
import UserContext from "../../store/userContext";
import LoadingPage from "../LoadingPage/LoadingPage";
import { AxiosError } from "axios";
import ErrorPageContext from "../../store/errorPageContext";

export default function Pin() {
  const { id } = useParams();
  const { setTextPopup, setErrorPopup, updateUserInfo, authUserData, isAuth } =
    useContext(UserContext);
  const { setErrorPageData } = useContext(ErrorPageContext);

  // Current user information
  const [boardId, setBoardId] = useState<string | undefined>(undefined);
  const [isSaved, setIsSaved] = useState<boolean | undefined>(undefined);
  const [isSubscribed, setIsSubscribed] = useState<boolean | undefined>(
    undefined
  );

  // Author information
  const [authorInfo, setAuthorInfo] = useState<UserData | undefined>(undefined);

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

  const getAuthorInfo = async () => {
    if (!authorInfo?._id) {
      setErrorPopup("Error loading author data!");
      return;
    }
    const userResponse = await getUser(authorInfo._id).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      }
    );
    if (userResponse && userResponse.status === 200) {
      const userData = userResponse.data as UserData;
      setAuthorInfo(userData);
    }
  };
  const getPinInfo = async () => {
    if (!id) return;
    const pinResponse = await getPin(id).catch((err: AxiosError<ErrorData>) => {
      if (!err.response) return;
      setErrorPageData({
        code: err.response.data.statusCode,
        message: err.response.data.message,
      });
    });
    if (!pinResponse) {
      return;
    }
    const pinInfo = pinResponse.data as PinData;
    setDescription(pinInfo.content);
    setTitle(pinInfo.title);
    setComments(pinInfo.comments ?? []);

    const userResponse = await getUser(pinInfo.userId).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      }
    );

    if (!userResponse || userResponse.status !== 200) return;
    const userData = userResponse.data as UserData;
    setAuthorInfo(userData);
    setDownloadLink(downloadStaticImage(pinInfo.imgId));

    const link = await getStaticImage(pinInfo.imgId).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      }
    );

    if (link) {
      setImgSrc(link);
    }
  };

  const checkSubscribed = async () => {
    if (authUserData) {
      const { _id } = authUserData;
      if (authorInfo) {
        const subbed =
          authorInfo.subscribers.find((a) => {
            return a === _id;
          }) !== undefined;
        setIsSubscribed(subbed);
        return;
      }
    }
    setIsSubscribed(false);
  };

  const checkSaved = async () => {
    if (!authUserData || !id) {
      return;
    }
    const currentBoardsData = await getBoards(authUserData.boards);

    // check if saved in boards
    for (let i = 0; i < currentBoardsData.length; i++) {
      if (currentBoardsData[i].pins.includes(id)) {
        setIsSaved(true);
        return;
      }
    }

    // check if saved in profile
    for (let i = 0; i < authUserData.savedPins.length; i++) {
      if (authUserData.savedPins[i] === id) {
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
        await subscribe(authorInfo._id).catch((err: AxiosError<ErrorData>) => {
          if (!err.response) return;
          setErrorPopup(err.response.data.message);
        });
        setTextPopup("Subscribed!");
        await getAuthorInfo().catch((err: AxiosError<ErrorData>) => {
          if (!err.response) return;
          setErrorPopup(err.response.data.message);
        });
        return;
      }
      if (isSubscribed) {
        await unsubscribe(authorInfo._id).catch(
          (err: AxiosError<ErrorData>) => {
            if (!err.response) return;
            setErrorPopup(err.response.data.message);
          }
        );
        setTextPopup("Unsubscribed!");
        await getAuthorInfo().catch((err: AxiosError<ErrorData>) => {
          if (!err.response) return;
          setErrorPopup(err.response.data.message);
        });
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
    if (!id || !authUserData) {
      return;
    }

    if (!boardId) {
      savePinToProfile(id, authUserData)
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

    return;
  };

  const handleCreateComment = async (content: string) => {
    if (!authUserData) {
      setTextPopup("Please log in");
      return;
    }

    if (!id) {
      return;
    }
    const { _id: currentUserId } = authUserData;

    const commentResponse = await createComment({
      userId: currentUserId,
      content: content,
    }).catch((err: AxiosError<ErrorData>) => {
      if (!err.response) return;
      setErrorPopup(err.response.data.message);
    });

    if (!commentResponse || commentResponse.status !== 201) {
      return;
    }
    const commentData = commentResponse.data as CommentData;

    const pinResponse = await getPin(id).catch((err: AxiosError<ErrorData>) => {
      if (!err.response) return;
      setErrorPopup(err.response.data.message);
    });
    if (!pinResponse || pinResponse.status !== 200) {
      setErrorPopup("Pin not found");
      return;
    }

    const newPin = { ...(pinResponse.data as PinData) };
    if (!newPin.comments) {
      return;
    }
    newPin.comments.push(commentData._id);
    await updatePin(id, { comments: newPin.comments }).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      }
    );
    getPinInfo();
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!id) {
      return;
    }
    const commentResponse = await deleteComment(commentId).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      }
    );
    if (!commentResponse) {
      return;
    }

    const pinResponse = await getPin(id).catch((err: AxiosError<ErrorData>) => {
      if (!err.response) return;
      setErrorPopup(err.response.data.message);
    });
    if (!pinResponse || pinResponse.status !== 200) {
      return;
    }

    const newPin = { ...(pinResponse.data as PinData) };
    if (!newPin.comments) {
      return;
    }
    newPin.comments = newPin.comments.filter((id) => {
      return id !== commentId;
    });
    await updatePin(id, { comments: newPin.comments }).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      }
    );
    getPinInfo();
  };

  const handleLikeComment = async (commentId: string) => {
    if (!authUserData) {
      setTextPopup("Please log in");
      return;
    }

    if (!id) {
      return;
    }
    const { _id: currentUserId } = authUserData;

    const commentResponse = await getComment(commentId).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      }
    );
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
    await updateComment(commentId, { likedBy: newComment.likedBy }).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      }
    );
    getPinInfo();
  };

  const handleUsefulComment = async (commentId: string) => {
    if (!authUserData) {
      setTextPopup("Please log in");
      return;
    }

    if (!id) {
      return;
    }
    const { _id: currentUserId } = authUserData;

    const commentResponse = await getComment(commentId).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      }
    );
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
    await updateComment(commentId, { usefulBy: newComment.usefulBy }).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      }
    );
    getPinInfo();
  };

  useEffect(() => {
    const loadInfo = async () => {
      await getPinInfo();
      await checkSaved();
    };
    loadInfo();
  }, [id, authUserData]);

  useEffect(() => {
    checkSubscribed();
  }, [authorInfo, authUserData]);

  if (!id) {
    return <div>No such pin!</div>;
  }

  const userInfoReady =
    isSaved !== undefined &&
    isSubscribed !== undefined &&
    authUserData !== undefined;

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
                    onClick={(event: any) => {
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
    const { _id: currentUserId } = authUserData;
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
            onSubmit={() => {
              updateUserInfo();
            }}
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
                    onClick={(event: any) => {
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
                    boardIds={authUserData?.boards || [""]}
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
  return <div></div>;
}
