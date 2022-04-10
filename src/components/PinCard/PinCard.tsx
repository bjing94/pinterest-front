import React, { useEffect, useState } from "react";
import { FiMoreHorizontal, FiShare } from "react-icons/fi";
import { Link } from "react-router-dom";
import { getPin, getStaticImage } from "../../services/PinterestService";
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
      <ProfileInfo username={user} />
    </Flexbox>
  );
}
