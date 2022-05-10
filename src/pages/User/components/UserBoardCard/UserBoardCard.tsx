import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FiLink } from "react-icons/fi";
import { Link } from "react-router-dom";
import Box from "../../../../components/Box/Box";
import Flexbox from "../../../../components/Flexbox/Flexbox";
import RoundButton from "../../../../components/RoundButton/RoundButton";
import Typography from "../../../../components/Typgoraphy/Typography";
import convertAgeToString from "../../../../helpers/AgeToString";
import copyCurrentUrl from "../../../../helpers/copyCurrentUrl";
import copyToClipboard from "../../../../helpers/copyCurrentUrl";
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
  isOwner: boolean;
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

export default function UserBoardCard({
  id,
  onEdit,
  isOwner,
}: UserBoardCardProps) {
  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [age, setAge] = useState<string>("");

  const handleGetBoard = async () => {
    const board = await getBoard(id);
    if (board) {
      if (board.status == 200) {
        const boardData = board.data as BoardData;
        const imgSrcs = await getSrcFromPins(boardData.pins);
        setCoverImages(imgSrcs);
        setAmount(boardData.pins.length);
        setTitle(boardData.title);
        setAge(
          convertAgeToString(
            new Date(Date.parse(boardData.createdAt)),
            new Date()
          )
        );
      } else {
        const errorData = board.data as ErrorData;
        console.log(errorData.message);
      }
    } else {
      console.log("ERROR!");
    }
  };

  useEffect(() => {
    handleGetBoard();
  }, []);

  if (!title) {
    return null;
  }
  return (
    <Flexbox
      flexDirection="column"
      className="user-board__container"
      alignItems="flex-start"
    >
      <Flexbox className="user-board__images">
        <Link to={`/board/${id}`}>
          <div className="user-board__overlay">
            {isOwner && (
              <Box margin="0px 10px 0px 0px">
                <RoundButton
                  type="action"
                  size={32}
                  onClick={(event: any) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onEdit();
                  }}
                >
                  <FaEdit size={24} />
                </RoundButton>
              </Box>
            )}

            <RoundButton
              type="action"
              size={32}
              onClick={(e: Event) => {
                e.preventDefault();
                copyCurrentUrl();
              }}
            >
              <FiLink size={24} />
            </RoundButton>
          </div>
        </Link>
        <div className="user-board__main-img">
          <img
            src={coverImages[0] ?? ""}
            style={{ background: `${coverImages[0] ? "none" : "gray"}` }}
          />
        </div>
        <Flexbox
          style={{ width: "100%", height: "100%" }}
          flexDirection="column"
        >
          <div className="user-board__top-img">
            <img
              src={coverImages[1] ?? ""}
              style={{ background: `${coverImages[1] ? "none" : "gray"}` }}
            />
          </div>
          <div className="user-board__bottom-img">
            <img
              className="user-board__bottom-img"
              src={coverImages[2] ?? ""}
              style={{ background: `${coverImages[2] ? "none" : "gray"}` }}
            />
          </div>
        </Flexbox>
      </Flexbox>
      <div style={{ marginLeft: "10px" }}>
        <Typography fontSize={16} fontWeight="bold" textAlign="start">
          {title}
        </Typography>
        <Flexbox>
          <Typography fontSize={12} textAlign="start">
            {amount} pins
          </Typography>
        </Flexbox>
        <Typography fontSize={12} textAlign="start" className="user-board__age">
          {age}
        </Typography>
      </div>
    </Flexbox>
  );
}
