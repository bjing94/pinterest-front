import { AiFillAmazonCircle } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { BaseStyle } from "../../types/types";
import Flexbox from "../Flexbox/Flexbox";
import RoundButton from "../RoundButton/RoundButton";
import Typography from "../Typgoraphy/Typography";

import "./ProfileInfo.scss";

interface ProfileInfoProps extends BaseStyle {
  username: string;
  avatar?: string;
}

export default function ProfileInfo({
  username,
  avatar,
  className = "",
}: ProfileInfoProps) {
  return (
    <Flexbox className={`profile-info ${className}`}>
      <RoundButton>{!avatar && <AiFillAmazonCircle size={32} />}</RoundButton>
      <Typography fontSize={1}>{username}</Typography>
    </Flexbox>
  );
}
