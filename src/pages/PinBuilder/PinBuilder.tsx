import React, { useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import Flexbox from "../../components/Flexbox/Flexbox";
import { Input } from "../../components/Input/Input";
import { InputPin } from "../../components/InputPin/InputPin";
import RoundButton from "../../components/RoundButton/RoundButton";
import { createPin, uploadFile } from "../../services/PinterestService";
import { darkGray } from "../../styles/colors";
import { CreatePinDto } from "../../services/dto/create-pin.dto";

import "./PinBuilder.scss";
import { FileResponse } from "../../services/responses/responses";
import { AiFillDelete } from "react-icons/ai";

function ProfileInfo() {
  return (
    <Flexbox className="pin-builder-container__user-info">
      <RoundButton>
        <FaUser size={24} />
      </RoundButton>
      <div>ОЛЕГ</div>
    </Flexbox>
  );
}

export default function PinBuilder() {
  const [uploadedImg, setUploadedImg] = useState<string | undefined>(undefined);
  const [imgHeight, setImgHeight] = useState(0);

  const titleRef: React.RefObject<HTMLTextAreaElement> =
    useRef<HTMLTextAreaElement>(null);
  const descriptionRef: React.RefObject<HTMLTextAreaElement> = useRef(null);
  const fileRef: React.RefObject<HTMLInputElement> = useRef(null);

  const handleCreatePin = async () => {
    if (
      !titleRef.current ||
      !descriptionRef.current ||
      !(
        fileRef &&
        fileRef.current &&
        fileRef.current.files &&
        fileRef.current.files.length > 0
      )
    ) {
      console.log("Ref error!");
      return;
    }

    const title = titleRef.current?.value;
    const description = descriptionRef.current?.value;
    const imgFile = fileRef.current?.files[0];
    if (!(title.length > 0 && description.length > 0 && imgFile)) {
      console.log("Input error!");
      return;
    }
    console.log("Data: ", title, description, imgFile);
    const uploadRes = await uploadFile(imgFile);
    if (!uploadRes) {
      return;
    }
    console.log(uploadRes);
    const dto: CreatePinDto = {
      title: title,
      imgId: uploadRes._id,
      content: description,
      userId: "fdgfdgg",
      username: "oleg",
    };

    const createRes = await createPin(dto);

    if (!createRes) {
      console.log("Error occured! Check console!");
    }
    console.log(createRes);
  };

  const handleDeleteImg = () => {
    setUploadedImg(undefined);
  };

  const handleUploadImg = () => {
    if (fileRef && fileRef.current && fileRef.current.files) {
      console.log(fileRef.current);
      const selectedFile = fileRef.current.files[0];

      const fr = new FileReader();
      const img = new Image();

      fr.onload = function () {
        if (fr.result) {
          setUploadedImg(`${fr.result?.toString()}`);
          console.log(fr.result.toString());
          img.src = fr.result.toString();
        }
      };
      img.onload = function () {
        console.log("Image dimensions: ", img.width, img.height);
        const multiplier = 340 / img.width;
        console.log("Suggested dimensions:", 340, img.height * multiplier);
        setImgHeight(img.height * multiplier);
      };
      fr.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="pin-builder-container">
      <Card>
        <Flexbox justifyContent="space-between">
          <RoundButton>
            <FiMoreHorizontal size={24} color={darkGray} />
          </RoundButton>
          <Button onClick={handleCreatePin}>Сохранить</Button>
        </Flexbox>
        <Flexbox alignItems="flex-start" style={{ marginTop: "2rem" }}>
          <InputPin
            ref={fileRef}
            onInputChange={handleUploadImg}
            style={{ display: uploadedImg ? "none" : "block" }}
          />
          {uploadedImg && (
            <div
              style={{
                backgroundImage: `url(${uploadedImg})`,
                height: imgHeight,
              }}
              className="input-pin-container__image"
            >
              <Flexbox alignItems="center" style={{ height: "100%" }}>
                <RoundButton type="action" onClick={handleDeleteImg}>
                  <AiFillDelete size={32} />
                </RoundButton>
              </Flexbox>
            </div>
          )}
          <Flexbox
            style={{
              marginLeft: "3.25rem",
              paddingTop: "32px",
              width: "350px",
            }}
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Input
              placeholder="Добавьте название"
              tip="В лентах видны только первые 40 символов"
              symbolsLimit={100}
              fontSize="2rem"
              ref={titleRef}
            />
            <ProfileInfo />
            <Input
              placeholder="Добавьте описание пина"
              tip="Когда люди обычно нажимают на ваш пин, они видят первые 50 символов."
              symbolsLimit={500}
              ref={descriptionRef}
            />
          </Flexbox>
        </Flexbox>
      </Card>
    </div>
  );
}
