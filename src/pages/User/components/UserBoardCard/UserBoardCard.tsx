import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import Flexbox from "../../../../components/Flexbox/Flexbox";
import RoundButton from "../../../../components/RoundButton/RoundButton";
import Typography from "../../../../components/Typgoraphy/Typography";
import { getBoard } from "../../../../services/BoardService";
import { getStaticImage } from "../../../../services/FileService";
import { getPin } from "../../../../services/PinService";
import {
  BoardData,
  ErrorData,
  PinData,
} from "../../../../services/responses/responses";

import "./UserBoardCard.scss";

interface UserBoardCardProps {
  id: string;
  onEdit: () => void;
}

const getSrcFromPins = async (pinIds: string[]) => {
  const pins = pinIds.map((pinId) => {
    return getPin(pinId);
  });

  const pinResponses = await Promise.all(pins);
  const pinDatas = pinResponses
    .filter((response): response is AxiosResponse<PinData> => {
      return response !== undefined && response.status === 200;
    })
    .map((response) => {
      return response.data as PinData;
    });

  const imgPromises = pinDatas.map((pinData) => {
    if (pinData) {
      return getStaticImage(pinData.imgId);
    } else {
      return new Promise<string>((res, rej) => {
        res("");
      });
    }
  });

  const imgDatas = await Promise.all(imgPromises);
  const correctSrcs: string[] = imgDatas.filter(
    (imgData): imgData is string => {
      return imgData !== null;
    }
  );

  return correctSrcs;
};

const getTimeSpent = (milliseconds: number) => {
  const toMinutes = 1 / (1000 * 60);
  const toHours = 1 / (1000 * 60 * 60);
  const toDays = 1 / (1000 * 60 * 60 * 24);
  const toMonths = 1 / (1000 * 60 * 60 * 24 * 7);
  const toYears = 1 / (1000 * 60 * 60 * 24 * 7 * 365);
  if (Math.floor(milliseconds * toMinutes) < 60) {
    return `${Math.floor(milliseconds * toMinutes)} minutes`;
  }
  if (Math.floor(milliseconds * toHours) < 24) {
    return `${Math.floor(milliseconds * toHours)} hours`;
  }

  if (Math.floor(milliseconds * toDays) < 7) {
    return `${Math.floor(milliseconds * toDays)} days`;
  }

  if (Math.floor(milliseconds * toMonths) < 12) {
    return `${Math.floor(milliseconds * toMonths)} months`;
  }

  return `${Math.floor(milliseconds * toYears)} years`;
};

export default function UserBoardCard({ id, onEdit }: UserBoardCardProps) {
  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [age, setAge] = useState<string>("");

  useEffect(() => {
    const handleGetBoard = async () => {
      const board = await getBoard(id);
      if (board) {
        if (board.status == 200) {
          const boardData = board.data as BoardData;
          const imgSrcs = await getSrcFromPins(boardData.pins);
          setCoverImages(imgSrcs);
          setAmount(boardData.pins.length);
          setTitle(boardData.title);
          setAge(getTimeSpent(Date.now() - Date.parse(boardData.createdAt)));
        } else {
          const errorData = board.data as ErrorData;
          console.log(errorData.message);
        }
      } else {
        console.log("ERROR!");
      }
    };

    handleGetBoard();
  }, []);

  if (!title) {
    return <div> Something went wrong!</div>;
  }
  return (
    <Flexbox
      flexDirection="column"
      className="user-board__container"
      alignItems="flex-start"
    >
      <Flexbox className="user-board__images">
        <div className="user-board__overlay">
          <RoundButton type="action" size={32} onClick={onEdit}>
            <FaEdit size={24} />
          </RoundButton>
        </div>
        <img
          className="user-board__main-img"
          src={coverImages[0] ?? ""}
          style={{ background: `${coverImages[0] ? "none" : "gray"}` }}
        />
        <Flexbox
          style={{ width: "100%", height: "100%" }}
          flexDirection="column"
        >
          <img
            className="user-board__top-img"
            src={coverImages[1] ?? ""}
            style={{ background: `${coverImages[1] ? "none" : "gray"}` }}
          />
          <img
            className="user-board__bottom-img"
            src={coverImages[2] ?? ""}
            style={{ background: `${coverImages[2] ? "none" : "gray"}` }}
          />
        </Flexbox>
      </Flexbox>
      <div style={{ marginLeft: "10px" }}>
        <Typography fontSize={1} fontWeight="bold" textAlign="start">
          {title}
        </Typography>
        <Flexbox>
          <Typography fontSize={0.75} textAlign="start">
            {amount} pins
          </Typography>
        </Flexbox>
        <Typography
          fontSize={0.75}
          textAlign="start"
          className="user-board__age"
        >
          {age}
        </Typography>
      </div>
    </Flexbox>
  );
}
