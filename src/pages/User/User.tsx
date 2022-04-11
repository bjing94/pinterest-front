import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CreateUserDto } from "../../services/dto/create-pin.dto";
import { getUser } from "../../services/PinterestService";
import { ErrorData } from "../../services/responses/responses";

import "./User.scss";

export default function User() {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState<string>("");

  useEffect(() => {
    const handleUser = async () => {
      if (id) {
        const response = await getUser(id);
        if (response) {
          console.log(response.status);
          if (response.status == 200) {
            const user = response.data as CreateUserDto;
            setUserInfo(JSON.stringify(user));
          } else {
            const error = response.data as ErrorData;
            setUserInfo(error.message);
          }
        }
      }
    };
    handleUser();
  }, []);
  return <div>{userInfo}</div>;
}
