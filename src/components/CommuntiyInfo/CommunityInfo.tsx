import React from "react";
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
  avatar?: string;
}

export default function CommunityInfo({
  username,
  avatar,
  className = "",
}: CommunityInfoProps) {
  return (
    <Flexbox
      className={`profile-info ${className}`}
      justifyContent="space-between"
    >
      <Flexbox>
        <RoundButton>{!avatar && <FaUser size={24} />}</RoundButton>
        <Flexbox flexDirection="column" alignItems="flex-start">
          <Typography fontSize={1}> {username}</Typography>
          <Typography fontSize={1}>0 subscribers</Typography>
        </Flexbox>
      </Flexbox>
      <Button className="community-info__subscribe-btn">Subscribe</Button>
    </Flexbox>
  );
}
