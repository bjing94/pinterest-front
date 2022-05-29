import React, { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../store/userContext";
import { BaseStyle } from "../../types/types";
import Avatar from "../Avatar/Avatar";
import Button from "../Button/Button";
import Flexbox from "../Flexbox/Flexbox";
import Typography from "../Typgoraphy/Typography";

import "./CommunityInfo.scss";

interface CommunityInfoProps extends BaseStyle {
  username: string;
  avatarId: string;
  displayId: string;
  isSubscribed: boolean;
  subscribersCount: number;
  onClickSubscribe?: any;
}

export default function CommunityInfo({
  username,
  avatarId,
  displayId,
  isSubscribed,
  subscribersCount,
  onClickSubscribe,
  className = "",
}: CommunityInfoProps) {
  const { isAuth, authUserData } = useContext(UserContext);

  return (
    <Flexbox
      className={`profile-info ${className}`}
      justifyContent="space-between"
    >
      <Link to={`/user/${displayId}`}>
        <Flexbox>
          <Avatar imgId={avatarId} size={32} />
          <Flexbox
            flexDirection="column"
            alignItems="flex-start"
            style={{ marginLeft: "0.5rem" }}
          >
            <Typography fontSize={14} fontWeight="bold">
              {" "}
              {username}
            </Typography>
            <Typography fontSize={14}>
              {subscribersCount} subscribers
            </Typography>
          </Flexbox>
        </Flexbox>
      </Link>

      {isAuth && authUserData?.displayId !== displayId && (
        <Button
          onClick={onClickSubscribe}
          color={`${isSubscribed ? "secondary" : "primary"}`}
        >
          {`${isSubscribed ? "Unsubscribe" : "Subscribe"}`}
        </Button>
      )}
    </Flexbox>
  );
}
