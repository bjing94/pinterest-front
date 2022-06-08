import React, { HTMLAttributes, useContext, useEffect, useState } from "react";
import { FiEdit, FiLink } from "react-icons/fi";
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

import "./PinCard.scss";
import UserContext from "../../store/userContext";
import { getUser } from "../../services/UserService";
import { PinData, UserData } from "../../services/responses/responses";
import ProfileInfo from "../ProfileInfo/ProfileInfo";

export interface PinCardProps {
  pinId: string;
  boards: string[];
  isSaved: boolean;
  onSetBoardId: (boardId: string) => void;
  onSavePin: (pinId: string) => void;
  onShowCreateBoard: any;
  showInfo?: boolean;
  isOwner?: boolean;
  onEdit?: any;
}

export default function PinCard({
  pinId,
  boards,
  isSaved,
  onSetBoardId,
  onSavePin,
  onShowCreateBoard,
  showInfo = false,
  isOwner = false,
  onEdit,
  ...rest
}: PinCardProps & HTMLAttributes<HTMLDivElement>) {
  const [user, setUser] = useState<string | undefined>(undefined);
  const [showBoards, setShowBoards] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [userDisplayId, setUserDisplayId] = useState<string | undefined>(
    undefined
  );
  const [avatarId, setAvatarId] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);

  const { isAuth, setTextPopup, setErrorPopup } = useContext(UserContext);

  const getPinInfo = async () => {
    if (pinId) {
      const pinResponse = await getPin(pinId);
      if (!pinResponse || pinResponse.status !== 200) {
        setTextPopup(`error getting pins!`);
        return;
      }

      const pinInfo = pinResponse.data as PinData;
      if (pinInfo) {
        const pinUser = await getUser(pinInfo.userId);

        if (!pinUser || pinUser.status !== 200) {
          return;
        }

        setUser((pinUser.data as UserData).username);

        setTitle(pinInfo.title);

        const link = await getStaticImage(pinInfo.imgId);
        console.log("Link", link);
        if (link) {
          setImgSrc(link);
        }

        const authorResponse = await getUser(pinInfo.userId);
        if (authorResponse && authorResponse.status === 200) {
          const userData = authorResponse.data as UserData;
          setAvatarId(userData.avatarSrc);
          setUserDisplayId(userData.displayId);
        }
      } else {
        setTextPopup(`wrong type of data!`);
      }
    }
  };

  const handleCopyPinLink = async () => {
    const url = window.location.origin + "/pin/" + pinId;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setTextPopup("Copied to clipboard.");
      })
      .catch(() => {
        setErrorPopup("Didn't copy!");
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
              onShowCreateBoard();
            }}
            onSelectBoard={(boardId: string) => {
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
            data-testid="pin-card-boards"
          />

          <Button
            className={`pin__save-btn`}
            onClick={(e: any) => {
              e.stopPropagation();
              e.preventDefault();
              onSavePin(pinId);
            }}
            color={`${isSaved ? "secondary" : "primary"}`}
            data-testid="pin-card-save-btn"
          >
            {isSaved ? "Saved" : "Save"}
          </Button>
        </Flexbox>
      )}
      <Flexbox fluid justifyContent="flex-end">
        {!isOwner && (
          <RoundButton
            type="action"
            size={32}
            onClick={(e: any) => {
              e.preventDefault();
              handleCopyPinLink();
            }}
            data-testid="pin-card-link"
          >
            <FiLink size={24} />
          </RoundButton>
        )}
        {isOwner && (
          <>
            <Box margin="0px 10px 0px 0px">
              <RoundButton
                type="action"
                size={32}
                onClick={(e: any) => {
                  e.preventDefault();
                  handleCopyPinLink();
                }}
                data-testid="pin-card-link"
              >
                <FiLink size={24} />
              </RoundButton>
            </Box>
            <RoundButton
              type="action"
              size={32}
              onClick={(e: any) => {
                e.preventDefault();
                onEdit();
              }}
              data-testid="pin-card-edit"
            >
              <FiEdit size={24} />
            </RoundButton>
          </>
        )}
      </Flexbox>
    </Flexbox>
  );

  const isLoaded =
    imgSrc !== undefined &&
    user !== undefined &&
    avatarId !== undefined &&
    userDisplayId !== undefined;
  console.log({ imgSrc, user, avatarId, userDisplayId });
  if (!isLoaded) {
    return <div></div>;
  }
  console.log("Rendering");
  return (
    <div
      className="user-pin-card__container"
      onMouseLeave={() => {
        setShowBoards(false);
      }}
      {...rest}
    >
      <Link to={`/pin/${pinId}`}>
        <ResponsiveImage
          src={imgSrc}
          overlayContent={overlayContent}
          maxHeight="500px"
          minHeight="120px"
        />
      </Link>
      {showInfo && (
        <>
          <Typography
            data-testid="pin-card-title"
            fontSize={18}
            fontWeight="bold"
            textAlign="start"
          >
            {title}
          </Typography>
          <Link to={`/user/${userDisplayId}`}>
            <ProfileInfo
              data-testid="pin-card-profile"
              username={user}
              avatarId={avatarId}
            />
          </Link>
        </>
      )}
    </div>
  );
}
