import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import Flexbox from "../../../../components/Flexbox/Flexbox";
import Typography from "../../../../components/Typgoraphy/Typography";
import { getStaticImage } from "../../../../services/FileService";
import { getPin } from "../../../../services/PinService";
import { PinData } from "../../../../services/responses/responses";

interface SavedPinsCardProps {
  savedPins: string[];
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

export default function SavedPinsCard({ savedPins }: SavedPinsCardProps) {
  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    const handleGetSavedPins = async () => {
      const imgSrcs = await getSrcFromPins(savedPins);
      setCoverImages(imgSrcs);
      setAmount(savedPins.length);
    };
    handleGetSavedPins();
  }, [savedPins]);

  return (
    <Flexbox
      flexDirection="column"
      className="user-board__container"
      alignItems="flex-start"
    >
      <Flexbox className="user-board__images">
        <div className="user-board__overlay"></div>
        <div className="user-board__main-img">
          <img
            alt="main-img"
            src={coverImages[0] ?? "https://via.placeholder.com/250"}
            style={{ background: `${coverImages[0] ? "none" : "gray"}` }}
          />
        </div>
        <Flexbox
          style={{ width: "100%", height: "100%" }}
          flexDirection="column"
        >
          <div className="user-board__top-img">
            <img
              alt="top-img"
              src={coverImages[1] ?? "https://via.placeholder.com/250"}
              style={{ background: `${coverImages[1] ? "none" : "gray"}` }}
            />
          </div>
          <div className="user-board__bottom-img">
            <img
              alt="bottom-img"
              className="user-board__bottom-img"
              src={coverImages[2] ?? "https://via.placeholder.com/250"}
              style={{ background: `${coverImages[2] ? "none" : "gray"}` }}
            />
          </div>
        </Flexbox>
      </Flexbox>
      <div style={{ marginLeft: "10px" }}>
        <Typography fontSize={16} fontWeight="bold" textAlign="start">
          {"Profile"}
        </Typography>
        <Flexbox>
          <Typography fontSize={12} textAlign="start">
            {amount} pins
          </Typography>
        </Flexbox>
      </div>
    </Flexbox>
  );
}
