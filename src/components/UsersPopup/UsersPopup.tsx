import { AxiosResponse } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Avatar from "../Avatar/Avatar";
import Box from "../Box/Box";
import Button from "../Button/Button";
import Flexbox from "../Flexbox/Flexbox";
import RoundButton from "../RoundButton/RoundButton";
import Typography from "../Typgoraphy/Typography";
import { UserData } from "../../services/responses/responses";
import { getUser } from "../../services/UserService";
import UserContext from "../../store/userContext";

import "./UsersPopup.scss";
import Popup from "../Popup";

interface UsersPopupProps {
  userIds: string[];
  title: string;
  onClose: () => void;
  onSubscribe: (userId: string) => void;
  onUnSubscribe: (userId: string) => void;
}

export default function UsersPopup({
  userIds,
  title,
  onClose,
  onSubscribe,
  onUnSubscribe,
  ...rest
}: UsersPopupProps) {
  const { authUserData, isAuth } = useContext(UserContext);

  const [amountLoaded, setAmountLoaded] = useState(20);
  const [users, setUsers] = useState<UserData[]>([]);

  const loadUsers = async () => {
    const userResponses = await Promise.all(
      userIds.slice(0, amountLoaded).map((id) => {
        return getUser(id);
      })
    );

    const users: UserData[] = userResponses
      .filter((response): response is AxiosResponse<UserData> => {
        return response !== undefined && response.status === 200;
      })
      .map((response) => {
        return response.data;
      });

    setUsers(users);
  };

  const userElements = users.map((user) => {
    const isSubscribed = authUserData
      ? user.subscribers.includes(authUserData._id)
      : false;
    const isYou = user._id === authUserData?._id;
    return (
      <Flexbox fluid key={`user-${user._id}`}>
        <Box margin="0px 10px 0px 0px">
          <Avatar size={50} imgId={user.avatarSrc} />
        </Box>
        <Box margin="0px 10px 0px 0px" className="users-popup__username">
          <Typography
            fontSize={14}
            fontWeight="bold"
            textAlign="start"
            data-testid={`users-popup-username-${user._id}`}
          >
            {user.username}
          </Typography>
        </Box>
        {isYou && (
          <Button color="secondary" active={false}>
            This is you
          </Button>
        )}
        {!isSubscribed && !isYou && isAuth && (
          <Button
            onClick={() => {
              onSubscribe(user._id);
            }}
            data-testid={`users-popup-subscribe-${user._id}`}
          >
            Subscribe
          </Button>
        )}
        {isSubscribed && !isYou && isAuth && (
          <Button
            color="secondary"
            onClick={() => {
              onUnSubscribe(user._id);
            }}
            data-testid={`users-popup-unsubscribe-${user._id}`}
          >
            Unsubscribe
          </Button>
        )}
      </Flexbox>
    );
  });

  useEffect(() => {
    loadUsers();
  }, [userIds, amountLoaded]);

  return (
    <Popup containerClass="users-popup__container" {...rest}>
      <Flexbox flexDirection="column" style={{ height: "100%" }}>
        <Box margin="0px 0px 20px 0px" width="400px">
          <Flexbox fluid justifyContent="center" alignItems="center">
            <Typography
              fontSize={16}
              fontWeight="bold"
              data-testid="users-popup__title"
            >
              {title}
            </Typography>
            <RoundButton size={32} onClick={onClose}>
              <AiOutlineClose size={24} />
            </RoundButton>
          </Flexbox>
        </Box>
        <div className="users-popup__list">
          {userElements}
          {amountLoaded > 10 && userIds.length > amountLoaded && (
            <Flexbox fluid justifyContent="center">
              <Button>Show more</Button>
            </Flexbox>
          )}
        </div>
      </Flexbox>
    </Popup>
  );
}
