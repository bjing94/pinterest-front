import React, { useEffect, useState } from "react";
import { FiMoreHorizontal, FiShare } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getStaticImage } from "../../services/FileService";
import { getPin } from "../../services/PinService";
import { UserData } from "../../services/responses/responses";
import { getUser } from "../../services/UserService";
import { red } from "../../styles/colors";
import Button from "../Button/Button";
import Flexbox from "../Flexbox/Flexbox";
import ProfileInfo from "../ProfileInfo/ProfileInfo";
import ResponsiveImage from "../ResponsiveImage/ResponsiveImage";
import RoundButton from "../RoundButton/RoundButton";
import Typography from "../Typgoraphy/Typography";

import "./PinCard.scss";

interface PinCardProps {
  pinId: string;
}

export default function PinCard({ pinId }: PinCardProps) {
  const [user, setUser] = useState("");
  const [title, setTitle] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [userInfo, setUserInfo] = useState<UserData | undefined>(undefined);

  const getPinInfo = async () => {
    if (pinId) {
      const pinInfo = await getPin(pinId);
      if (pinInfo) {
        setTitle(pinInfo.title);
        setUser(pinInfo.username);

        const userData = await getUser(pinInfo.userId);
        if (userData && userData.status == 200) {
          setUserInfo(userData.data as UserData);
        }

        const link = await getStaticImage(pinInfo.imgId);
        if (link) {
          setImgSrc(link);
        }
      }
    }
  };

  useEffect(() => {
    getPinInfo();
  }, []);

  const overlayContent = (
    <Flexbox
      className="pin-card__overlay"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="flex-end"
    >
      <div>
        <Button className="pin-card__btn">Save</Button>
      </div>
      <Flexbox>
        <RoundButton type="action" size={32} style={{ marginRight: "0.5rem" }}>
          <FiMoreHorizontal size={24} />
        </RoundButton>
        <RoundButton type="action" size={32}>
          <FiShare size={24} />
        </RoundButton>
      </Flexbox>
    </Flexbox>
  );
  if (!userInfo) {
    return <div></div>;
  }
  return (
    <Flexbox
      className="pin-card"
      flexDirection="column"
      alignItems="flex-start"
    >
      <Link to={`/pin/${pinId}`}>
        <ResponsiveImage src={imgSrc} overlayContent={overlayContent} />
      </Link>
      <Typography fontSize={1} fontWeight="bold">
        {title}
      </Typography>
      <Link to={`/user/${userInfo?.displayId ?? ""}`}>
        <ProfileInfo
          username={userInfo?.username ?? ""}
          avatarId={userInfo?.avatarSrc}
        />
      </Link>
    </Flexbox>
  );
}
