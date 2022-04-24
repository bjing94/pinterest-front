import React, { useEffect, useState } from "react";
import { FiLink, FiMoreHorizontal, FiShare } from "react-icons/fi";
import { useParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import Flexbox from "../../components/Flexbox/Flexbox";
import RoundButton from "../../components/RoundButton/RoundButton";
import Typography from "../../components/Typgoraphy/Typography";

import "./Pin.scss";
import CommunityInfo from "../../components/CommuntiyInfo/CommunityInfo";
import ResponsiveImage from "../../components/ResponsiveImage/ResponsiveImage";
import CommentSection from "../../components/CommentSection/CommentSection";
import { getStaticImage } from "../../services/FileService";
import { getPin, updatePin } from "../../services/PinService";
import { getCurrentUser } from "../../services/AuthService";
import { CommentData, UserData } from "../../services/responses/responses";
import { getUser } from "../../services/UserService";
import Toolbar from "../../components/Toolbar/Toolbar";
import { createComment } from "../../services/CommentService";

// interface PinProps {
//   match?: any;
// }

export default function Pin() {
  const { id } = useParams();

  const [userInfo, setUserInfo] = useState<UserData | undefined>(undefined);
  const [avatarSrc, setAvatarSrc] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const getPinInfo = async () => {
    if (id) {
      const pinInfo = await getPin(id);
      console.log("PinId", id);
      if (pinInfo) {
        setDescription(pinInfo.content);
        setTitle(pinInfo.title);
        setComments(pinInfo.comments ?? []);

        const userResponse = await getUser(pinInfo.userId);
        if (userResponse && userResponse.status == 200) {
          const userData = userResponse.data as UserData;
          setUserInfo(userData);
          const avatarSrc = await getStaticImage(userData.avatarSrc);
          if (avatarSrc) {
            setAvatarSrc(avatarSrc);
          }
        }

        const link = await getStaticImage(pinInfo.imgId);
        if (link) {
          setImgSrc(link);
        }
      }
    }
  };

  const checkSubscribed = async () => {
    const res = await getCurrentUser();
    if (res) {
      if (res.status == 200) {
        const { _id } = res.data as UserData;
        if (userInfo) {
          if (userInfo.subscribers.find((a) => a === _id) === undefined) {
            setIsSubscribed(true);
          }
        }
      }
    }
  };

  const handleCreateComment = async (content: string) => {
    if (!id) {
      return;
    }
    console.log("Creating comment:", currentUserId, content);
    const commentResponse = await createComment({
      userId: currentUserId,
      content: content,
    });
    if (!commentResponse || commentResponse.status !== 201) {
      return;
    }
    const commentData = commentResponse.data as CommentData;

    const pinResponse = await getPin(id);
    if (!pinResponse) {
      return;
    }

    const newPin = { ...pinResponse };
    if (!newPin.comments) {
      return;
    }
    newPin.comments.push(commentData._id);
    const updatedResponse = await updatePin(id, newPin);

    getPinInfo();
  };

  const handleLikeComment = async (content: string) => {
    if (!id) {
      return;
    }
    console.log("Creating comment:", currentUserId, content);
    const commentResponse = await createComment({
      userId: currentUserId,
      content: content,
    });
    if (!commentResponse || commentResponse.status !== 201) {
      return;
    }
    const commentData = commentResponse.data as CommentData;

    const pinResponse = await getPin(id);
    if (!pinResponse) {
      return;
    }

    const newPin = { ...pinResponse };
    if (!newPin.comments) {
      return;
    }
    newPin.comments.push(commentData._id);
    const updatedResponse = await updatePin(id, newPin);
    console.log("PinId", id);
    console.log("Response:", updatedResponse);
  };
  const handleUsefulComment = async (content: string) => {
    if (!id) {
      return;
    }
    console.log("Creating comment:", currentUserId, content);
    const commentResponse = await createComment({
      userId: currentUserId,
      content: content,
    });
    if (!commentResponse || commentResponse.status !== 201) {
      return;
    }
    const commentData = commentResponse.data as CommentData;

    const pinResponse = await getPin(id);
    if (!pinResponse) {
      return;
    }

    const newPin = { ...pinResponse };
    if (!newPin.comments) {
      return;
    }
    newPin.comments.push(commentData._id);
    const updatedResponse = await updatePin(id, newPin);
    getPinInfo();
  };
  useEffect(() => {
    getPinInfo();
    checkSubscribed();
    getCurrentUser().then((response) => {
      if (!response || response.status !== 200) {
        return;
      }

      const userId = (response.data as UserData)._id;
      setCurrentUserId(userId);
    });
  }, []);

  if (!id) {
    return <div>No such pin!</div>;
  }
  return (
    <Flexbox
      justifyContent="flex-start"
      alignItems="center"
      className="pin__page-container"
      flexDirection="column"
    >
      <Toolbar />
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
              <Typography fontSize={1} textAlign="start">
                {description}
              </Typography>
            </div>
            <div style={{ marginTop: "1rem" }} className="pin__profile-info">
              <CommunityInfo
                isSubscribed={isSubscribed}
                username={userInfo?.username ?? ""}
                subscribersCount={userInfo?.subscribers.length ?? 0}
                className="pin__profile-info"
                avatar={avatarSrc}
              />
            </div>
            <CommentSection
              commentIds={comments}
              currentUserId={currentUserId}
              onCreate={handleCreateComment}
              onLike={handleLikeComment}
              onUseful={handleUsefulComment}
            />
          </Flexbox>
        </Flexbox>
      </Card>
    </Flexbox>
  );
}
