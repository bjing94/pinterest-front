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
        <RoundButton>{!avatar && <AiFillAmazonCircle size={48} />}</RoundButton>
        <Flexbox
          flexDirection="column"
          alignItems="flex-start"
          style={{ marginLeft: "0.5rem" }}
        >
          <Typography fontSize={1} fontWeight="bold">
            {" "}
            {username}
          </Typography>
          <Typography fontSize={1}>0 subscribers</Typography>
        </Flexbox>
      </Flexbox>
      <Button className="community-info__subscribe-btn">Subscribe</Button>
    </Flexbox>
  );
}
