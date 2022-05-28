import { BaseStyle } from "../../types/types";
import Avatar from "../Avatar/Avatar";
import Box from "../Box/Box";
import Flexbox from "../Flexbox/Flexbox";
import Typography from "../Typgoraphy/Typography";

import "./ProfileInfo.scss";

interface ProfileInfoProps extends BaseStyle {
  username: string;
  avatarId: string;
}

export default function ProfileInfo({
  username,
  avatarId,
  className = "",
}: ProfileInfoProps) {
  return (
    <Flexbox className={`profile-info ${className}`}>
      <Avatar size={36} imgId={avatarId} />
      <Box margin="0 0 0 10px">
        <Typography fontSize={14} fontWeight="bold">
          {username}
        </Typography>
      </Box>
    </Flexbox>
  );
}
