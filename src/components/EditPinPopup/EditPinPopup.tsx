import React, {
  HTMLAttributes,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Box from "../Box/Box";
import Button from "../Button/Button";
import Flexbox from "../Flexbox/Flexbox";
import Input from "../Input";
import Typography from "../Typgoraphy/Typography";
import { getPin } from "../../services/PinService";
import { UpdatePinDto } from "../../services/dto/update-pin.dto";
import {
  BoardData,
  ErrorData,
  PinData,
} from "../../services/responses/responses";
import UserContext from "../../store/userContext";
import ResponsiveImage from "../ResponsiveImage/ResponsiveImage";
import { getStaticImage } from "../../services/FileService";
import { FiArrowDown } from "react-icons/fi";
import Dropdown from "../Dropdown";
import InputSearch from "../InputSearch/InputSearch";

import "./EditPinPopup.scss";
import EditPopup from "../EditPopup/EditPopup";
import { getBoards } from "../../services/BoardService";
import { AxiosError } from "axios";

export interface EditPinPopupProps {
  pinId: string;
  title: string;
  onClose: () => void;
  onDelete: () => void;
  onUpdate: (
    dto: UpdatePinDto,
    oldBoardId: string,
    newBoardId: string,
    newImgFile?: File,
    createBoardTitle?: string
  ) => void;
  isSaver?: boolean;
}

interface BoardsSelectionPropertyProps {
  label: string;
  value: string;
  onSelectBoard: (boardId: string) => void;
  boards?: BoardData[];
  onCreate: (boardTitle: string) => void;
}

function BoardsSelectionProperty({
  label,
  value,
  onSelectBoard,
  onCreate,
  boards,
  ...rest
}: BoardsSelectionPropertyProps & HTMLAttributes<HTMLDivElement>) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [createButtonActive, setCreateButtonActive] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  let dropdownItems = [
    <Box padding="10px">
      <Typography fontSize={14} textAlign="start" fontWeight="bold">
        {"No boards! Create one!"}
      </Typography>
    </Box>,
  ];

  if (boards && boards.length > 0) {
    dropdownItems = boards.map((board, id) => {
      return (
        <Box
          padding="10px"
          onClick={() => {
            onSelectBoard(board._id);
            setShowDropdown(false);
          }}
          key={`board-dropdown-item-${id}`}
        >
          <Typography fontSize={14} textAlign="start" fontWeight="bold">
            {board.title}
          </Typography>
        </Box>
      );
    });
  }
  const searchPanel = (
    <Box padding="5px" className="search-panel" key={`board-dropdown-search`}>
      <Flexbox fluid justifyContent="space-between">
        <Box margin="0px 5px 0px 5px">
          <InputSearch
            placeholder="Search"
            ref={inputRef}
            onChange={() => {
              setCreateButtonActive(
                !!inputRef.current && inputRef.current.value.length > 5
              );
            }}
          />
        </Box>
        <Button
          active={createButtonActive}
          onClick={() => {
            if (inputRef.current) {
              onCreate(inputRef.current.value);
              setShowDropdown(false);
            }
          }}
        >
          Create
        </Button>
      </Flexbox>
    </Box>
  );

  return (
    <Box width="100%" margin="0px 0px 20px 0px" {...rest}>
      <Flexbox fluid justifyContent="space-between" alignItems="center">
        <Box margin="0px 50px 0px 0px">
          <label>{label}</label>
        </Box>
        <Box
          padding="16px 12px 16px 12px"
          width="100%"
          className="edit-pin-popup__selection"
        >
          <Flexbox fluid justifyContent="space-between">
            <Typography fontSize={16} fontWeight="bold">
              {value}
            </Typography>

            <FiArrowDown
              size={18}
              onClick={() => {
                setShowDropdown(!showDropdown);
              }}
              style={{
                transform: `${showDropdown ? "rotate(-90deg)" : ""}`,
                transition: "ease 0.25s",
              }}
            />
          </Flexbox>
          {showDropdown && (
            <Dropdown
              left="0"
              top="55px"
              className="edit-pin-popup__dropdown"
              onClickItem={() => {}}
              children={[searchPanel, ...dropdownItems]}
            />
          )}
        </Box>
      </Flexbox>
    </Box>
  );
}

interface TextPropertyProps {
  label: string;
  value: string;
  onInput: any;
}

function TextProperty({
  label,
  value,
  onInput,
  ...rest
}: TextPropertyProps & HTMLAttributes<HTMLDivElement>) {
  return (
    <Box width="100%" margin="0px 0px 20px 0px">
      <Flexbox fluid justifyContent="space-between" alignItems="center">
        <Box margin="0px 50px 0px 0px">
          <label>{label}</label>
        </Box>
        <Input
          placeholder="test"
          value={value}
          onInput={onInput}
          className="edit-pin-popup__input"
          {...rest}
        />
      </Flexbox>
    </Box>
  );
}

export default function EditPinPopup({
  pinId,
  title,
  onClose,
  onDelete,
  onUpdate,
  isSaver = false,
  ...rest
}: EditPinPopupProps & HTMLAttributes<HTMLDivElement>) {
  const { authUserData, setErrorPopup } = useContext(UserContext);
  const [pinData, setPinData] = useState<PinData | null>(null);
  const [imgSrc, setImgSrc] = useState<string>("");

  const [selectedBoardId, setSelectedBoardId] = useState<string>("");
  const [temporaryBoardTitle, setTemporaryBoardTitle] = useState<string>("");
  const [titleValue, setTitleValue] = useState("");
  const [contentValue, setContentValue] = useState("");
  const [oldBoardId, setOldBoardId] = useState("");
  const [userBoards, setUserBoards] = useState<BoardData[]>();

  const newImgInputRef = useRef<HTMLInputElement>(null);

  const handleUploadImg = () => {
    if (
      newImgInputRef &&
      newImgInputRef.current &&
      newImgInputRef.current.files
    ) {
      const selectedFile = newImgInputRef.current.files[0];

      const fr = new FileReader();

      fr.onload = function () {
        if (fr.result) {
          setImgSrc(`${fr.result?.toString()}`);
        }
      };

      fr.readAsDataURL(selectedFile);
    }
  };

  const getAuthUserBoards = async () => {
    if (!authUserData) return;
    const boardsData = await getBoards(authUserData.boards);
    setUserBoards(boardsData);
  };

  const getPinInfo = async () => {
    const pinResponse = await getPin(pinId).catch(
      (err: AxiosError<ErrorData>) => {
        if (!err.response) return;
        setErrorPopup(err.response.data.message);
      }
    );
    if (pinResponse?.status !== 200 || !pinResponse || !userBoards) return;

    const pinData = pinResponse.data as PinData;
    setPinData(pinData);
    setTitleValue(pinData.title);
    setContentValue(pinData.content);

    const oldBoard = userBoards.find((board) => {
      return board.pins.includes(pinId);
    })?._id;
    if (oldBoard) {
      setOldBoardId(oldBoard);
      setSelectedBoardId(oldBoard);
    }

    const imgResponse = await getStaticImage(pinData.imgId);
    if (!imgResponse) return;
    setImgSrc(imgResponse);
  };

  const handleCreateTemporaryBoard = async (title: string) => {
    setTemporaryBoardTitle(title);
  };

  useEffect(() => {
    getAuthUserBoards();
  }, [authUserData]);

  useEffect(() => {
    getPinInfo();
  }, [pinId, userBoards]);

  const savedOnBoardName =
    temporaryBoardTitle !== ""
      ? temporaryBoardTitle
      : userBoards
      ? userBoards.find((board) => {
          return board._id === selectedBoardId;
        })?.title || ""
      : "";

  if (!pinData) return null;
  const editImgOverlay = (
    <Flexbox
      justifyContent="center"
      fluid
      className="edit-pin-popup__img-overlay"
    >
      <label htmlFor="input-img">
        <Typography fontSize={16} color="secondary">
          Change image?
        </Typography>
      </label>
      <input
        onInput={handleUploadImg}
        ref={newImgInputRef}
        type="file"
        id="input-img"
      />
    </Flexbox>
  );
  const mainContent = (
    <>
      <Flexbox alignItems="flex-start">
        <Box width="583px" margin="0px 16px 0px 16px">
          <Flexbox flexDirection="column" alignItems="flex-start">
            <BoardsSelectionProperty
              label="Board"
              value={savedOnBoardName}
              onSelectBoard={(boardId: string) => {
                setSelectedBoardId(boardId);
              }}
              boards={userBoards}
              onCreate={handleCreateTemporaryBoard}
              data-testid="edit-pin-boards"
            />
            {!isSaver && (
              <>
                {" "}
                <TextProperty
                  label="Title"
                  value={titleValue}
                  onInput={(event: any) => {
                    setTitleValue(event.target.value);
                  }}
                  data-testid="edit-pin-title"
                />
                <TextProperty
                  label="Description"
                  value={contentValue}
                  onInput={(event: any) => {
                    setContentValue(event.target.value);
                  }}
                  data-testid="edit-pin-description"
                />
              </>
            )}
          </Flexbox>
        </Box>
        <Box width="200px" margin="0px 16px 0px 16px">
          <ResponsiveImage
            src={imgSrc}
            maxHeight="500px"
            overlayContent={editImgOverlay}
          />
        </Box>
      </Flexbox>
    </>
  );

  const bottomContent = (
    <>
      <Flexbox fluid justifyContent="space-between">
        <Button
          onClick={() => {
            onDelete();
            onClose();
          }}
          data-testid="edit-pin-delete-btn"
        >
          Delete
        </Button>
        <Flexbox>
          <Box margin="0px 10px 0px 0px">
            <Button onClick={onClose} data-testid="edit-pin-cancel-btn">
              Cancel
            </Button>
          </Box>
          <Button
            onClick={() => {
              let imgFile: File | undefined = undefined;
              if (newImgInputRef.current && newImgInputRef.current.files) {
                imgFile = newImgInputRef.current.files[0];
              }
              onUpdate(
                { title: titleValue, content: contentValue },
                oldBoardId,
                selectedBoardId,
                imgFile,
                temporaryBoardTitle
              );
              onClose();
            }}
            data-testid="edit-pin-update-btn"
          >
            Done
          </Button>
        </Flexbox>
      </Flexbox>
    </>
  );
  return (
    <EditPopup
      title={title}
      onClose={onClose}
      mainContent={mainContent}
      bottomContent={bottomContent}
      {...rest}
    />
  );
}
