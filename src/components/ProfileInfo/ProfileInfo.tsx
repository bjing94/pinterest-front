import { FaUser } from "react-icons/fa";
import { BaseStyle } from "../../types/types";
import Flexbox from "../Flexbox/Flexbox";
import RoundButton from "../RoundButton/RoundButton";

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
      <RoundButton>{!avatar && <FaUser size={24} />}</RoundButton>
      <div>{username}</div>
    </Flexbox>
  );
}
