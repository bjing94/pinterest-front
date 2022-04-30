import React from "react";
import { AiFillAmazonCircle } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { lightGray } from "../../styles/colors";
import { BaseStyle } from "../../types/types";
import Button from "../Button/Button";
import Flexbox from "../Flexbox/Flexbox";
import RoundButton from "../RoundButton/RoundButton";
import Typography from "../Typgoraphy/Typography";

import "./CommunityInfo.scss";

interface CommunityInfoProps extends BaseStyle {
  username: string;
  avatar: string;
  isSubscribed: boolean;
  subscribersCount: number;
  onClickSubscribe?: any;
}

export default function CommunityInfo({
  username,
  avatar,
  isSubscribed,
  subscribersCount,
  onClickSubscribe,
  className = "",
}: CommunityInfoProps) {
  return (
    <Flexbox
      className={`profile-info ${className}`}
      justifyContent="space-between"
    >
      <Flexbox>
        <RoundButton
          size={32}
          style={{ backgroundImage: `url(${avatar})` }}
        ></RoundButton>
        <Flexbox
          flexDirection="column"
          alignItems="flex-start"
          style={{ marginLeft: "0.5rem" }}
        >
          <Typography fontSize={1} fontWeight="bold">
            {" "}
            {username}
          </Typography>
          <Typography fontSize={1}>{subscribersCount} subscribers</Typography>
        </Flexbox>
      </Flexbox>

      <Button
        onClick={onClickSubscribe}
        color={`${isSubscribed ? "secondary" : "primary"}`}
      >
        {`${isSubscribed ? "Subscribed" : "Subscribe"}`}
      </Button>
    </Flexbox>
  );
}
