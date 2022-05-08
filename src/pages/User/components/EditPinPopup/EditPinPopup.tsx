import React, { useContext, useEffect, useRef, useState } from "react";
import Box from "../../../../components/Box/Box";
import Button from "../../../../components/Button/Button";
import Card from "../../../../components/Card/Card";
import Flexbox from "../../../../components/Flexbox/Flexbox";
import Input from "../../../../components/Input";
import Typography from "../../../../components/Typgoraphy/Typography";
import { getPin } from "../../../../services/PinService";
import { UpdatePinDto } from "../../../../services/dto/update-pin.dto";
import { BoardData, PinData } from "../../../../services/responses/responses";
import UserContext from "../../../../store/userContext";
import ResponsiveImage from "../../../../components/ResponsiveImage/ResponsiveImage";
import { getStaticImage } from "../../../../services/FileService";
import { FiArrowDown } from "react-icons/fi";
import Dropdown from "../../../../components/Dropdown";
import InputSearch from "../../../../components/InputSearch/InputSearch";

import "./EditPinPopup.scss";

interface EditPinPopupProps {
  pinId: string;
  title: string;
  onClose: () => void;
  onDelete: () => void;
  onUpdate: (
    dto: UpdatePinDto,
    oldBoardId: string,
    newBoardId: string,
    createBoardTitle?: string
  ) => void;
}

interface BoardsSelectionPropertyProps {
  label: string;
  value: string;
  onSelect: (boardId: string) => void;
  boards: BoardData[];
  onCreate: (boardTitle: string) => void;
}

function BoardsSelectionProperty({
  label,
  value,
  onSelect,
  onCreate,
  boards,
}: BoardsSelectionPropertyProps) {
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

  if (boards.length > 0) {
    dropdownItems = boards.map((board) => {
      return (
        <Box
          padding="10px"
          onClick={() => {
            onSelect(board._id);
            setShowDropdown(false);
          }}
        >
          <Typography fontSize={14} textAlign="start" fontWeight="bold">
            {board.title}
          </Typography>
        </Box>
      );
    });
  }

  return (
    <Box width="100%" margin="0px 0px 20px 0px">
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
            <Typography fontSize={12} fontWeight="bold">
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
            >
              <Box padding="5px" className="search-panel">
                <Flexbox fluid justifyContent="space-between">
                  <Box margin="0px 5px 0px 5px">
                    <InputSearch
                      placeholder="Search"
                      ref={inputRef}
                      onChange={() => {
                        setCreateButtonActive(
                          !!inputRef.current &&
                            inputRef.current.value.length > 5
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
              {dropdownItems}
            </Dropdown>
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

function TextProperty({ label, value, onInput }: TextPropertyProps) {
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
        />
      </Flexbox>
    </Box>
  );
}

export default function EditPinPopup({
  pinId: pinId,
  title,
  onClose,
  onDelete,
  onUpdate,
}: EditPinPopupProps) {
  const { userBoards } = useContext(UserContext);

  const [pinData, setPinData] = useState<PinData | null>(null);
  const [imgSrc, setImgSrc] = useState<string>("");

  const [selectedBoardId, setSelectedBoardId] = useState<string>("");
  const [temporaryBoardTitle, setTemporaryBoardTitle] = useState<string>("");
  const [titleValue, setTitleValue] = useState("");
  const [contentValue, setContentValue] = useState("");
  const [oldBoardId, setOldBoardId] = useState("");

  const getPinInfo = async () => {
    const pinResponse = await getPin(pinId);
    if (pinResponse?.status !== 200 || !pinResponse) return;

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
    getPinInfo();
  }, []);

  const savedOnBoardName =
    temporaryBoardTitle !== ""
      ? temporaryBoardTitle
      : userBoards.find((board) => {
          return board._id === selectedBoardId;
        })?.title || "";

  if (!pinData) return <div>whoops</div>;

  return (
    <div className="edit-pin-popup__background" onClick={onClose}>
      <Box
        margin="100px 0px 0px 0px"
        onClick={(event: Event) => {
          event.stopPropagation();
        }}
      >
        <Card className="edit-pin-popup__container">
          <Flexbox flexDirection="column" style={{ height: "100%" }}>
            <div className="edit-pin-popup__list">
              <Flexbox>
                <Box width="583px" margin="0px 16px 0px 16px">
                  <Flexbox flexDirection="column">
                    <BoardsSelectionProperty
                      label="Board"
                      value={savedOnBoardName}
                      onSelect={(boardId) => {
                        setSelectedBoardId(boardId);
                      }}
                      boards={userBoards}
                      onCreate={handleCreateTemporaryBoard}
                    />
                    <TextProperty
                      label="Title"
                      value={titleValue}
                      onInput={(event: any) => {
                        setTitleValue(event.target.value);
                      }}
                    />
                    <TextProperty
                      label="Description"
                      value={contentValue}
                      onInput={(event: any) => {
                        setContentValue(event.target.value);
                      }}
                    />
                  </Flexbox>
                </Box>
                <Box width="200px" margin="0px 16px 0px 16px">
                  <ResponsiveImage src={imgSrc} />
                </Box>
              </Flexbox>
            </div>
            <div className="edit-pin-popup__bottom">
              <Flexbox fluid justifyContent="space-between">
                <Button
                  onClick={() => {
                    onDelete();
                    onClose();
                  }}
                >
                  Delete
                </Button>
                <Flexbox>
                  <Box margin="0px 10px 0px 0px">
                    <Button onClick={onClose}>Cancel</Button>
                  </Box>
                  <Button
                    onClick={() => {
                      console.log(
                        oldBoardId,
                        selectedBoardId,
                        temporaryBoardTitle
                      );
                      onUpdate(
                        { title: titleValue, content: contentValue },
                        oldBoardId,
                        selectedBoardId,
                        temporaryBoardTitle
                      );
                      onClose();
                    }}
                  >
                    Done
                  </Button>
                </Flexbox>
              </Flexbox>
            </div>
          </Flexbox>
        </Card>
      </Box>
    </div>
  );
}
