import React, { useContext, useEffect, useState } from "react";
import { FiLink, FiMoreHorizontal, FiShare } from "react-icons/fi";
import { Link } from "react-router-dom";
import Box from "../Box/Box";
import Button from "../Button/Button";
import DropdownBoards from "../DropdownBoards/DropdownBoards";
import Flexbox from "../Flexbox/Flexbox";
import ResponsiveImage from "../ResponsiveImage/ResponsiveImage";
import RoundButton from "../RoundButton/RoundButton";
import Typography from "../Typgoraphy/Typography";
import { getStaticImage } from "../../services/FileService";
import { getPin } from "../../services/PinService";
import { red } from "../../styles/colors";

import "./PinCard.scss";
import UserContext from "../../store/userContext";
import { getUser } from "../../services/UserService";
import { UserData } from "../../services/responses/responses";
import ProfileInfo from "../ProfileInfo/ProfileInfo";

interface PinCardProps {
  pinId: string;
  boards: string[];
  isSaved: boolean;
  onSetBoardId: (boardId: string) => void;
  onSavePin: (pinId: string) => void;
  onShowCreateBoard: any;
  showInfo?: boolean;
}

export default function PinCard({
  pinId,
  boards,
  isSaved,
  onSetBoardId,
  onSavePin,
  onShowCreateBoard,
  showInfo = false,
}: PinCardProps) {
  const [user, setUser] = useState("");
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [showBoards, setShowBoards] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [userDisplayId, setUserDisplayId] = useState("");
  const [avatarId, setAvatarId] = useState("");
  const [title, setTitle] = useState("");

  const { isAuth } = useContext(UserContext);

  const getPinInfo = async () => {
    if (pinId) {
      const pinInfo = await getPin(pinId);
      if (pinInfo) {
        setUser(pinInfo.username);
        setTitle(pinInfo.title);

        const link = await getStaticImage(pinInfo.imgId);
        if (link) {
          setImgSrc(link);
        }

        const authorResponse = await getUser(pinInfo.userId);
        if (authorResponse && authorResponse.status === 200) {
          const userData = authorResponse.data as UserData;
          setAvatarId(userData.avatarSrc);
          setUserDisplayId(userData.displayId);
        }
      }
    }
  };

  const handleCopyPinLink = async () => {
    const url = window.location.origin + "/pin/" + pinId;
    navigator.clipboard
      .writeText(url)
      .then(() => {})
      .catch(() => {
        console.log("Didn't copy!");
      });
  };

  useEffect(() => {
    getPinInfo();
  }, []);

  const overlayContent = (
    <Flexbox
      className="user-pin-card__overlay"
      justifyContent={`${isAuth ? "space-between" : "flex-end"}`}
      alignItems="center"
      flexDirection="column"
      style={{ height: "100%" }}
    >
      {isAuth && (
        <Flexbox fluid justifyContent="space-between">
          <DropdownBoards
            boardIds={boards}
            onClickCreateBoard={() => {
              setShowCreateBoard(true);
              onShowCreateBoard();
            }}
            onSelect={(boardId: string) => {
              onSetBoardId(boardId);
              setShowBoards(!showBoards);
            }}
            showDropdown={showBoards}
            onClickArrow={(event: Event) => {
              event.preventDefault();
              setShowBoards(!showBoards);
            }}
            style={{ background: "none", color: "white" }}
            textColor="secondary"
            arrowStyle={{ color: "white" }}
          />

          <Button
            className={`pin__save-btn ${isSaved ? "saved" : ""}`}
            onClick={(e: Event) => {
              e.preventDefault();
              onSavePin(pinId);
            }}
          >
            {isSaved ? "Saved" : "Save"}
          </Button>
        </Flexbox>
      )}
      <Flexbox fluid justifyContent="flex-end">
        <Box margin="0px 10px 0px 0px">
          <RoundButton
            type="action"
            size={32}
            onClick={(e: Event) => {
              e.preventDefault();
              handleCopyPinLink();
            }}
          >
            <FiLink size={24} />
          </RoundButton>
        </Box>
        <RoundButton
          type="action"
          size={32}
          onClick={(e: Event) => {
            e.preventDefault();
          }}
        >
          <FiMoreHorizontal size={24} />
        </RoundButton>
      </Flexbox>
    </Flexbox>
  );
  return (
    <div
      className="user-pin-card__container"
      onMouseLeave={() => {
        setShowBoards(false);
      }}
    >
      <Link to={`/pin/${pinId}`}>
        <ResponsiveImage src={imgSrc} overlayContent={overlayContent} />
      </Link>
      <Typography fontSize={1} fontWeight="bold" textAlign="start">
        {title}
      </Typography>
      <Link to={`/user/${userDisplayId}`}>
        <ProfileInfo username={user} avatarId={avatarId} />
      </Link>
    </div>
  );
}
