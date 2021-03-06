import React, { useContext, useRef, useState } from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import Button from "../../components/Button/Button";
import Card from "../../components/Card/Card";
import Flexbox from "../../components/Flexbox/Flexbox";
import { ResponsiveInput } from "../../components/ResponsiveInput/ResponsiveInput";
import { InputPin } from "../../components/InputPin/InputPin";
import RoundButton from "../../components/RoundButton/RoundButton";
import { darkGray } from "../../styles/colors";
import { CreatePinDto } from "../../services/dto/create-pin.dto";
import { AiFillDelete } from "react-icons/ai";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import { ErrorData, FileData } from "../../services/responses/responses";
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
import { AxiosError } from "axios";

import "./PinBuilder.scss";

export default function PinBuilder() {
  const { setTextPopup, setErrorPopup, updateUserInfo, isAuth, authUserData } =
    useContext(UserContext);

  const [uploadedImg, setUploadedImg] = useState<string | undefined>(undefined);
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
    if (!(fileRef && fileRef.current && fileRef.current.files)) {
      setErrorPopup("Reference error!");
      return;
    }

    const imgFile = fileRef.current?.files[0];
    if (title.length === 0) {
      setErrorPopup("Title must not be empty!");
      return;
    }
    if (!imgFile) {
      setErrorPopup("Image must not be empty!");
      return;
    }
    if (!authUserData) {
      setErrorPopup("Please log in!");
      return;
    }
    setIsLoading(true);

    const uploadRes = await uploadFile(imgFile).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      }
    );
    if (!uploadRes || uploadRes.status !== 200) {
      setIsLoading(false);
      return;
    }

    const dto: CreatePinDto = {
      title: title,
      imgId: (uploadRes.data as FileData)._id,
      content: description,
      userId: authUserData._id,
      boardId: boardId.length === 0 ? undefined : boardId,
    };

    const pinResponse = await createPin(dto).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      }
    );

    if (!pinResponse) {
      setErrorPopup("Server error!");
      setIsLoading(false);
      return;
    }

    if (pinResponse.status !== 201) {
      const error = pinResponse.data as ErrorData;
      setErrorPopup(error.message);
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
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(selectedFile.type)) {
        setErrorPopup("File type must be .jpg or .png!");
        return;
      }
      if (selectedFile.size >= 5 * 1024 * 1024) {
        setErrorPopup("File exceeds 5Mb!");
        return;
      }
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

  if (!isAuth || !authUserData) {
    return <Navigate to="/" />;
  }

  const { boards: boardIds } = authUserData;

  return (
    <div className="pin-builder-container">
      <Toolbar />
      {showCreateBoard && (
        <BoardCreatePopup
          onClose={() => {
            setShowCreateBoard(false);
          }}
          onSubmit={() => {
            updateUserInfo();
          }}
        />
      )}
      <Card
        className="pin-builder__card"
        onClick={closePopups}
        id="builder-card"
      >
        {isLoading && <PinLoader />}
        <Flexbox justifyContent="space-between">
          <RoundButton
            size={32}
            onClick={(event: any) => {
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
              boardIds={boardIds}
              onClickCreateBoard={() => {
                setShowCreateBoard(true);
              }}
              onSelectBoard={(boardId: string) => {
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
              placeholder="???????????????? ????????????????"
              tip="?? ???????????? ?????????? ???????????? ???????????? 40 ????????????????"
              symbolsLimit={100}
              fontSize="20px"
              ref={titleRef}
              onTextInput={(value: string) => {
                setTitle(value);
              }}
              value={title}
              className="input-title"
            />
            <ProfileInfo
              username={authUserData.username}
              avatarId={authUserData.avatarSrc}
              className="pin-builder__profile-info"
            />
            <ResponsiveInput
              placeholder="???????????????? ???????????????? ????????"
              tip="?????????? ???????? ???????????? ???????????????? ???? ?????? ??????, ?????? ?????????? ???????????? 50 ????????????????."
              symbolsLimit={500}
              ref={descriptionRef}
              onTextInput={(value: string) => {
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
