import React, { useEffect, useState } from "react";
import { FiLink, FiMoreHorizontal, FiShare } from "react-icons/fi";
import { useParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import Flexbox from "../../components/Flexbox/Flexbox";
import RoundButton from "../../components/RoundButton/RoundButton";
import Typography from "../../components/Typgoraphy/Typography";
import { getPin, getStaticImage } from "../../services/PinterestService";

import "./Pin.scss";
import CommunityInfo from "../../components/CommuntiyInfo/CommunityInfo";
import ResponsiveImage from "../../components/ResponsiveImage/ResponsiveImage";
import CommentSection from "../../components/CommentSection/CommentSection";

// interface PinProps {
//   match?: any;
// }

export default function Pin() {
  const { id } = useParams();

  const [user, setUser] = useState("");
  const [descrition, setDescrition] = useState("");
  const [title, setTitle] = useState("");
  const [imgSrc, setImgSrc] = useState("");

  const getPinInfo = async () => {
    if (id) {
      const pinInfo = await getPin(id);
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

  return (
    <Flexbox
      justifyContent="center"
      alignItems="flex-start"
      className="pin__page-container"
    >
      <Card style={{ width: "1016px", padding: "2rem" }}>
        <Flexbox alignItems="flex-start">
          <div className="pin__image-container">
            <ResponsiveImage src={imgSrc} />
          </div>
          <Flexbox
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            style={{
              flexBasis: "50%",
              marginLeft: "3rem",
              width: "100%",
              marginTop: "2rem",
            }}
          >
            <Flexbox justifyContent="space-between" style={{ width: "100%" }}>
              <Flexbox>
                <RoundButton size={32}>
                  <FiMoreHorizontal size={24} />
                </RoundButton>
                <RoundButton size={32}>
                  <FiShare size={24} />
                </RoundButton>
                <RoundButton size={32}>
                  <FiLink size={24} />
                </RoundButton>
              </Flexbox>
              <Button className="pin__save-btn">Save</Button>
            </Flexbox>
            <div style={{ marginTop: "1rem" }}>
              <Typography fontSize={2.2} fontWeight="bold">
                {title}
              </Typography>
              <Typography fontSize={1}>{descrition}</Typography>
            </div>
            <div style={{ marginTop: "1rem" }} className="pin__profile-info">
              <CommunityInfo username={user} className="pin__profile-info" />
            </div>
            <CommentSection />
          </Flexbox>
        </Flexbox>
      </Card>
    </Flexbox>
  );
}
