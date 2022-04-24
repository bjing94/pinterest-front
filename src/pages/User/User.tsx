import React, { useEffect, useState } from "react";
import { AiFillAmazonCircle } from "react-icons/ai";
import { FiShare } from "react-icons/fi";
import Masonry from "react-masonry-css";
import { useParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import ButtonSection from "../../components/ButtonSection";
import Flexbox from "../../components/Flexbox/Flexbox";
import PinCard from "../../components/PinCard/PinCard";
import RoundButton from "../../components/RoundButton/RoundButton";
import Typography from "../../components/Typgoraphy/Typography";
import { CreateUserDto } from "../../services/dto/create-pin.dto";
import { getUser, subscribe } from "../../services/UserService";
import { ErrorData, UserData } from "../../services/responses/responses";
import UserBoardCard from "./components/UserBoardCard/UserBoardCard";
import UserPinCard from "./components/UserPinCard/UserPinCard";

import "./User.scss";
import { checkLogin, getCurrentUser } from "../../services/AuthService";
import { getStaticImage } from "../../services/FileService";

const breakpointColumnsObj = {
  default: 7,
  1820: 6, // 1800 or less
  1600: 5,
  1400: 4,
  1100: 3,
  900: 2,
  600: 1,
};

export default function User() {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState<UserData | undefined>();
  const [showCreated, setShowCreated] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [avatar, setAvatar] = useState("");

  const checkSubscribed = async () => {
    if (!userInfo) {
      return;
    }
    const res = await getCurrentUser();
    if (res) {
      if (res.status == 200) {
        const { _id } = res.data as UserData;
        if (userInfo.subscribers.find((a) => a === _id) === undefined) {
          setIsSubscribed(true);
        }
      }
    }
  };

  const handleSubscribe = async () => {
    if (!userInfo) {
      return;
    }
    const isAuth = await checkLogin();
    if (isAuth) {
      await subscribe(userInfo.displayId);
    } else {
      console.log("Not authenticated!");
    }
  };

  useEffect(() => {
    const getUserInfo = async () => {
      if (id) {
        const response = await getUser(id);
        if (response) {
          if (response.status == 200) {
            const user = response.data as UserData;
            setUserInfo(user);
            await checkSubscribed();

            const staticSrc = await getStaticImage(user.avatarSrc);
            setAvatar(staticSrc ?? "");
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      }
    };
    getUserInfo();
  }, []);

  if (isLoading) {
    return (
      <Flexbox style={{ width: "100%" }} justifyContent="center">
        <Typography>Loading!</Typography>
      </Flexbox>
    );
  }

  if (!userInfo) {
    return (
      <Flexbox style={{ width: "100%" }} justifyContent="center">
        <Typography>User not found!</Typography>
      </Flexbox>
    );
  }

  const pinElements = userInfo.createdPins.map((id) => {
    return <UserPinCard pinId={id} />;
  });

  const boardElements = userInfo.boards.map((boardId) => {
    return <UserBoardCard id={boardId} />;
  });

  return (
    <div>
      <Flexbox flexDirection="column" alignItems="center">
        <RoundButton
          size={128}
          style={{ background: `url(${avatar}) center center` }}
        ></RoundButton>
        <Typography fontWeight="bold">{userInfo.username}</Typography>
        <Typography fontSize={1}>
          {`@${userInfo.displayId} ${userInfo.description}`}
        </Typography>
        <div style={{ marginTop: "1rem" }}>
          <Flexbox>
            <Typography fontSize={1} fontWeight="bold">
              {userInfo.subscribers.length} subscribers
            </Typography>
            <Typography
              fontSize={1}
              fontWeight="bold"
              className="user__subscriptions"
            >
              {userInfo.subscriptions.length} subscriptions
            </Typography>
          </Flexbox>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <Flexbox>
            <RoundButton size={48}>
              <FiShare size={24} />
            </RoundButton>
            {!isSubscribed && (
              <Button onClick={handleSubscribe}>Subscribe</Button>
            )}
            {isSubscribed && (
              <Button className="user__subscribed-btn">Subscribed</Button>
            )}
          </Flexbox>
        </div>
        <Flexbox>
          <ButtonSection
            isActive={showCreated}
            onClick={() => {
              setShowCreated(true);
            }}
          >
            <Typography fontSize={1.2} fontWeight="bold">
              Created
            </Typography>
          </ButtonSection>
          <ButtonSection
            isActive={!showCreated}
            onClick={() => {
              setShowCreated(false);
            }}
          >
            <Typography fontSize={1.2} fontWeight="bold">
              Saved
            </Typography>
          </ButtonSection>
        </Flexbox>
        <Flexbox style={{ width: "100%" }}>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {showCreated ? pinElements : boardElements}
          </Masonry>
        </Flexbox>
      </Flexbox>
    </div>
  );
}
