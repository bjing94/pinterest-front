import { AxiosResponse } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaCross, FaWindowClose } from "react-icons/fa";
import Avatar from "../Avatar/Avatar";
import Box from "../Box/Box";
import Button from "../Button/Button";
import Card from "../Card/Card";
import Flexbox from "../Flexbox/Flexbox";
import RoundButton from "../RoundButton/RoundButton";
import Toolbar from "../Toolbar/Toolbar";
import Typography from "../Typgoraphy/Typography";
import { UserData } from "../../services/responses/responses";
import { getUser } from "../../services/UserService";
import UserContext from "../../store/userContext";

import "./UsersPopup.scss";

interface UsersPopupProps {
  userIds: string[];
  title: string;
  onClose: () => void;
  onSubscribe: (userId: string) => void;
}

export default function UsersPopup({
  userIds,
  title,
  onClose,
  onSubscribe,
}: UsersPopupProps) {
  const { _id: currentUserId, isAuth } = useContext(UserContext);

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

  const handleShowMore = () => {
    setAmountLoaded(amountLoaded + 20);
  };

  const userElements = users.map((user) => {
    const isSubscribed = user.subscribers.includes(currentUserId);
    const isYou = user._id === currentUserId;
    return (
      <Flexbox fluid>
        <Box margin="0px 10px 0px 0px">
          <Avatar size={50} imgId={user.avatarSrc} />
        </Box>
        <Box margin="0px 10px 0px 0px" className="users-popup__username">
          <Typography fontSize={14} fontWeight="bold" textAlign="start">
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
          >
            Subscribe
          </Button>
        )}
        {isSubscribed && !isYou && isAuth && (
          <Button color="secondary">Subscribed</Button>
        )}
      </Flexbox>
    );
  });

  useEffect(() => {
    loadUsers();
  }, [amountLoaded]);
  return (
    <div className="users-popup__background">
      <Box margin="100px 0px 0px 0px">
        <Card className="users-popup__container">
          <Flexbox flexDirection="column" style={{ height: "100%" }}>
            <Box margin="0px 0px 20px 0px" width="400px">
              <Flexbox fluid justifyContent="center" alignItems="center">
                <Typography fontSize={16} fontWeight="bold">
                  {title}
                </Typography>
                <RoundButton size={32} onClick={onClose}>
                  <AiOutlineClose size={24} />
                </RoundButton>
              </Flexbox>
            </Box>
            <div className="users-popup__list">
              {userElements}
              {/* <div style={{ background: "red", height: "800px" }}></div> */}
              {amountLoaded > 10 && userIds.length > amountLoaded && (
                <Flexbox fluid justifyContent="center">
                  <Button>Show more</Button>
                </Flexbox>
              )}
            </div>
          </Flexbox>
        </Card>
      </Box>
    </div>
  );
}
