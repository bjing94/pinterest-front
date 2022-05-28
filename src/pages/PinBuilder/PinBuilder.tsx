import React, { useContext, useEffect, useRef, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import Flexbox from "../../components/Flexbox/Flexbox";
import { ResponsiveInput } from "../../components/ResponsiveInput/ResponsiveInput";
import { InputPin } from "../../components/InputPin/InputPin";
import RoundButton from "../../components/RoundButton/RoundButton";
import { darkGray } from "../../styles/colors";
import { CreatePinDto } from "../../services/dto/create-pin.dto";

import "./PinBuilder.scss";
import { AiFillDelete } from "react-icons/ai";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import {
  ErrorData,
  FileData,
  UserData,
} from "../../services/responses/responses";
import { getCurrentUser } from "../../services/AuthService";
import { uploadFile } from "../../services/FileService";
import { createPin } from "../../services/PinService";
import Typography from "../../components/Typgoraphy/Typography";
import DropdownBoards from "../../components/DropdownBoards/DropdownBoards";
import BoardCreatePopup from "../../components/BoardCreatePopup";
import PinLoader from "./components/PinLoader/PinLoader";
import Toolbar from "../../components/Toolbar/Toolbar";
import Dropdown from "../../components/Dropdown";
import ButtonGroup from "../../components/ButtonGroup/ButtonGroup";
import { Navigate } from "react-router-dom";
import UserContext from "../../store/userContext";
import Box from "../../components/Box/Box";
import ResponsiveImage from "../../components/ResponsiveImage/ResponsiveImage";

interface PinBuilderProps {
  isAuth?: boolean;
}

export default function PinBuilder({ isAuth }: PinBuilderProps) {
  const { setTextPopup } = useContext(UserContext);

  const [uploadedImg, setUploadedImg] = useState<string | undefined>(undefined);
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState<UserData | undefined>();
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [boardId, setBoardId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [showBoardsDropdown, setShowBoardsDropdown] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const titleRef: React.RefObject<HTMLTextAreaElement> =
    useRef<HTMLTextAreaElement>(null);
  const descriptionRef: React.RefObject<HTMLTextAreaElement> = useRef(null);
  const fileRef: React.RefObject<HTMLInputElement> = useRef(null);

  const handleCreatePin = async () => {
    setError("");
    if (!(fileRef && fileRef.current && fileRef.current.files)) {
      setError("Reference error!");
      return;
    }

    const imgFile = fileRef.current?.files[0];
    if (title.length === 0) {
      setError("Title must not be empty!");
      return;
    }
    if (boardId.length === 0) {
      setError("Select a board!");
      return;
    }
    if (!imgFile) {
      setError("Image must not be empty!");
      return;
    }

    setIsLoading(true);

    const uploadRes = await uploadFile(imgFile);
    if (!uploadRes || uploadRes.status !== 200) {
      console.log(uploadRes);
      if (uploadRes?.status === 413) {
        setError("Image is too large! Limit is 5 Mb.");
      } else {
        setError("Image was not uploaded!");
      }
      setIsLoading(false);
      return;
    }

    const userData = (await getCurrentUser())!.data as UserData;

    const dto: CreatePinDto = {
      title: title,
      imgId: (uploadRes.data as FileData)._id,
      content: description,
      userId: userData._id,
      boardId: boardId,
    };

    const pinResponse = await createPin(dto);

    if (!pinResponse) {
      setError("Server error!");
      setIsLoading(false);
      return;
    }

    if (pinResponse.status !== 201) {
      const error = pinResponse.data as ErrorData;
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setTextPopup("Pin created");
  };

  const handleDeleteImg = () => {
    setUploadedImg(undefined);
  };

  const handleDeletePin = () => {
    handleDeleteImg();
    if (!titleRef.current) {
      return;
    }
    if (!descriptionRef.current) {
      return;
    }
    setTitle("");
    setDescription("");
  };

  const closePopups = () => {
    setShowOptionsDropdown(false);
    setShowBoardsDropdown(false);
  };

  const handleUploadImg = () => {
    if (fileRef && fileRef.current && fileRef.current.files) {
      const selectedFile = fileRef.current.files[0];

      const fr = new FileReader();
      const img = new Image();

      fr.onload = function () {
        if (fr.result) {
          setUploadedImg(`${fr.result?.toString()}`);
          img.src = fr.result.toString();
        }
      };

      fr.readAsDataURL(selectedFile);
    }
  };

  useEffect(() => {
    getCurrentUser().then((response) => {
      if (!response?.data) {
        return;
      }
      if (response.status === 200) {
        const user = response.data as UserData;
        setUserInfo(user);
        if (user.boards.length > 0) {
          setBoardId(user.boards[0]);
        }
      }
    });
  }, []);

  if (!isAuth) {
    return <Navigate to="/" />;
  }

  if (!userInfo) {
    return <div>Please log in!</div>;
  }

  const { boards, username, avatarSrc } = userInfo;
  return (
    <div className="pin-builder-container">
      <Toolbar />
      {showCreateBoard && (
        <BoardCreatePopup
          onClose={() => {
            setShowCreateBoard(false);
          }}
          onSubmit={() => {}}
        />
      )}
      <Card
        className="pin-builder__card"
        onClick={closePopups}
        id="builder-card"
      >
        {isLoading && <PinLoader />}
        {error && <Typography fontSize={12}>{`Error: ${error}`}</Typography>}
        <Flexbox justifyContent="space-between">
          <RoundButton
            size={32}
            onClick={(event: Event) => {
              event?.stopPropagation();
              setShowOptionsDropdown(true);
            }}
          >
            <FiMoreHorizontal size={24} color={darkGray} />
          </RoundButton>
          {showOptionsDropdown && (
            <Dropdown
              width="150px"
              padding="10px 0px 10px 0px"
              onClickItem={() => {
                setShowOptionsDropdown(false);
              }}
              left="-60px"
              className="pin-builder__dropdown-options"
            >
              <Box onClick={handleDeletePin}>
                <Typography fontSize={12} fontWeight="bold">
                  Clear
                </Typography>
              </Box>
              <Typography fontSize={12} fontWeight="bold">
                Duplicate
              </Typography>
            </Dropdown>
          )}
          <ButtonGroup style={{ width: "236px" }}>
            <DropdownBoards
              boardIds={boards}
              onClickCreateBoard={() => {
                setShowCreateBoard(true);
              }}
              onSelect={(boardId: string) => {
                setBoardId(boardId);
                setShowBoardsDropdown(!showBoardsDropdown);
              }}
              showDropdown={showBoardsDropdown}
              onClickArrow={(event: Event) => {
                event.stopPropagation();
                setShowBoardsDropdown(!showBoardsDropdown);
              }}
              className="pin-builder__dropdown"
            />
            {!showBoardsDropdown && (
              <Button
                onClick={handleCreatePin}
                style={{ height: "48px", background: "red" }}
              >
                Save
              </Button>
            )}
          </ButtonGroup>
        </Flexbox>
        <Flexbox
          className="pin-builder__content"
          alignItems="flex-start"
          style={{ marginTop: "2rem" }}
        >
          <InputPin
            ref={fileRef}
            onInputChange={handleUploadImg}
            style={{ display: uploadedImg ? "none" : "block" }}
          />
          {uploadedImg && (
            <ResponsiveImage
              className="pin-builder__image"
              src={uploadedImg}
              overlayContent={
                <Flexbox alignItems="center" style={{ height: "100%" }}>
                  <RoundButton
                    type="action"
                    onClick={handleDeleteImg}
                    size={32}
                  >
                    <AiFillDelete size={32} />
                  </RoundButton>
                </Flexbox>
              }
            />
          )}
          <Flexbox
            style={{
              width: "100%",
            }}
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            className="pin-builder__input-container"
          >
            <ResponsiveInput
              placeholder="Добавьте название"
              tip="В лентах видны только первые 40 символов"
              symbolsLimit={100}
              fontSize="20px"
              ref={titleRef}
              onInput={(value: string) => {
                setTitle(value);
              }}
              value={title}
              className="input-title"
            />
            <ProfileInfo
              username={username}
              avatarId={avatarSrc}
              className="pin-builder__profile-info"
            />
            <ResponsiveInput
              placeholder="Добавьте описание пина"
              tip="Когда люди обычно нажимают на ваш пин, они видят первые 50 символов."
              symbolsLimit={500}
              ref={descriptionRef}
              onInput={(value: string) => {
                setDescription(value);
              }}
              value={description}
              className="input-description"
            />
          </Flexbox>
        </Flexbox>
      </Card>
    </div>
  );
}
