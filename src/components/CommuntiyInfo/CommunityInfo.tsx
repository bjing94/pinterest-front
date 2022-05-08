import React, { useContext } from "react";
import { AiFillAmazonCircle } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import UserContext from "../../store/userContext";
import { lightGray } from "../../styles/colors";
import { BaseStyle } from "../../types/types";
import Avatar from "../Avatar/Avatar";
import Button from "../Button/Button";
import Flexbox from "../Flexbox/Flexbox";
import RoundButton from "../RoundButton/RoundButton";
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
  const { isAuth } = useContext(UserContext);

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
            <Typography fontSize={12} fontWeight="bold">
              {" "}
              {username}
            </Typography>
            <Typography fontSize={12}>
              {subscribersCount} subscribers
            </Typography>
          </Flexbox>
        </Flexbox>
      </Link>

      {isAuth && (
        <Button
          onClick={onClickSubscribe}
          color={`${isSubscribed ? "secondary" : "primary"}`}
        >
          {`${isSubscribed ? "Subscribed" : "Subscribe"}`}
        </Button>
      )}
    </Flexbox>
  );
}
