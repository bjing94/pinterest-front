import React, { useEffect, useState } from "react";
import { FiMoreHorizontal, FiShare } from "react-icons/fi";
import { Link } from "react-router-dom";
import Button from "../../../../components/Button/Button";
import Flexbox from "../../../../components/Flexbox/Flexbox";
import ResponsiveImage from "../../../../components/ResponsiveImage/ResponsiveImage";
import RoundButton from "../../../../components/RoundButton/RoundButton";
import Typography from "../../../../components/Typgoraphy/Typography";
import { getStaticImage } from "../../../../services/FileService";
import { getPin } from "../../../../services/PinService";
import { red } from "../../../../styles/colors";

import "./UserPinCard.scss";

interface UserPinCardProps {
  pinId: string;
}

export default function UserPinCard({ pinId }: UserPinCardProps) {
  const [user, setUser] = useState("");
  const [descrition, setDescrition] = useState("");
  const [title, setTitle] = useState("");
  const [imgSrc, setImgSrc] = useState("");

  const getPinInfo = async () => {
    if (pinId) {
      const pinInfo = await getPin(pinId);
      if (pinInfo) {
        setDescrition(pinInfo.content);
        setTitle(pinInfo.title);
        setUser(pinInfo.username);

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
      className="user-pin-card__overlay"
      justifyContent="center"
      alignItems="center"
    >
      <Typography fontSize={2} className="user-pin-card__text">
        Open
      </Typography>
    </Flexbox>
  );
  return (
    <div className="user-pin-card__container">
      <Link to={`/pin/${pinId}`}>
        <ResponsiveImage src={imgSrc} overlayContent={overlayContent} />
      </Link>
    </div>
  );
}
