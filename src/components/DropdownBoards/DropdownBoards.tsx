import { AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { IoIosArrowForward } from "react-icons/io";
import { getBoard } from "../../services/BoardService";
import { getStaticImage } from "../../services/FileService";
import { getPin } from "../../services/PinService";
import { BoardData, PinData } from "../../services/responses/responses";
import { BaseStyle } from "../../types/types";
import Box from "../Box/Box";
import Button from "../Button/Button";
import Card from "../Card/Card";
import Flexbox from "../Flexbox/Flexbox";
import InputSearch from "../InputSearch/InputSearch";
import RoundButton from "../RoundButton/RoundButton";
import Typography from "../Typgoraphy/Typography";

import "./DropdownBoards.scss";

interface FooterProps {
  onClick: any;
}

function DropdownFooter({ onClick }: FooterProps) {
  return (
    <Flexbox
      className="board-dropdown__footer"
      justifyContent="flex-start"
      onClick={(e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
    >
      <RoundButton className="create-board__btn" size={32}>
        <BsPlus size={32} />
      </RoundButton>
      <Typography fontSize={12}>Create board</Typography>
    </Flexbox>
  );
}

interface DropdownItemProps {
  boardData: BoardData;
  onClick?: any;
}

function DropdownItem({ boardData, onClick }: DropdownItemProps) {
  const [coverImg, setCoverImg] = useState("");
  const { title, pins } = boardData;

  const getCoverImg = async () => {
    if (pins.length == 0) {
      return;
    }

    const pinResponse = await getPin(pins[0]);

    if (!pinResponse || pinResponse.status !== 200) {
      return;
    }
    const pin = pinResponse.data as PinData;
    const img = await getStaticImage(pin.imgId);
    if (!img) {
      return;
    }

    setCoverImg(img);
  };

  useEffect(() => {
    getCoverImg();
  }, []);

  return (
    <li className="board-dropdown__item">
      <Flexbox style={{ height: "100%" }} alignItems="center">
        <img className="board-dropdown__item__img" src={coverImg} />
        <Typography
          fontSize={1.2}
          fontWeight="bold"
          className="board-dropdown__item__name"
        >
          {title}
        </Typography>
      </Flexbox>
      <div className="board-dropdown__item__overlay">
        <Flexbox fluid justifyContent="flex-end" style={{ height: "100%" }}>
          <Button className="board-dropdown__item__btn" onClick={onClick}>
            Save
          </Button>
        </Flexbox>
      </div>
    </li>
  );
}

interface DropdownListProps {
  boards: BoardData[];
  onClickFooter?: any;
  onSelect?: any;
}

function DropdownList({ boards, onClickFooter, onSelect }: DropdownListProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchStr, setSearchStr] = useState<string>("");

  const handleSearchChange = () => {
    if (!searchRef || !searchRef.current) {
      return;
    }

    setSearchStr(searchRef.current.value);
  };

  const dropdownItems = boards
    .filter((board) => {
      return board.title.includes(searchStr);
    })
    .map((board) => {
      return (
        <DropdownItem
          boardData={board}
          key={`board-dropdown-item-${board.title}`}
          onClick={() => {
            onSelect(board._id);
          }}
        />
      );
    });

  return (
    <div
      className="board-dropdown__list"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <Card className="board-dropdown__card">
        <Flexbox
          style={{ height: "100%" }}
          flexDirection="column"
          justifyContent="space-between"
        >
          <Flexbox
            style={{
              height: "calc(100% - 40px)",
              padding: "0rem 1rem 0rem 1rem",
            }}
            flexDirection="column"
            alignItems="flex-start"
            fluid={true}
          >
            <InputSearch
              placeholder="Search"
              ref={searchRef}
              onChange={handleSearchChange}
            />
            <Box
              margin="1rem 0rem 0rem 0rem"
              className="board-dropdown__item-container"
            >
              <Typography fontSize={10} textAlign="start">
                All boards
              </Typography>
              <Box margin="0rem 1rem 0rem 0rem">{dropdownItems}</Box>
            </Box>
          </Flexbox>

          <DropdownFooter onClick={onClickFooter} />
        </Flexbox>
      </Card>
    </div>
  );
}

interface DropdownProps extends BaseStyle {
  boardIds: string[];
  onClickCreateBoard?: any;
  onSelect: (boardId: string) => void;
  onClickArrow: (e: Event) => void;
  showDropdown: boolean;
  className?: string;
  arrowStyle?: any;
  textColor?: "primary" | "secondary" | "error";
}

export default function DropdownBoards({
  boardIds,
  onClickCreateBoard,
  onSelect,
  showDropdown,
  onClickArrow,
  style,
  className = "",
  arrowStyle,
  textColor = "primary",
}: DropdownProps) {
  const [selection, setSelection] = useState<string | null>(null);
  const [boards, setBoards] = useState<BoardData[]>([]);

  useEffect(() => {
    const handleGetBoards = async () => {
      const boards = await Promise.all(
        boardIds.map((id) => {
          return getBoard(id);
        })
      );
      const filteredBoards = boards
        .filter((board): board is AxiosResponse<BoardData> => {
          return board !== undefined;
        })
        .map((response) => {
          return response.data;
        });
      setBoards(filteredBoards);
    };

    handleGetBoards();
  }, []);

  let title = "";
  if (boards.length !== 0 && selection) {
    const selectedBoard = boards.filter((b) => {
      return b._id === selection;
    })[0];
    title = selectedBoard.title;
    if (title.length > 10) {
      title = title.slice(0, 10);
      title += "...";
    }
  } else {
    title = "Profile";
  }

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <div className={`board-dropdown ${className}`} style={style}>
        <Flexbox fluid justifyContent="flex-end">
          <Typography
            className="board-dropdown__selection"
            fontSize={1.2}
            color={textColor}
            textAlign="end"
          >
            {title}
          </Typography>
          <RoundButton
            size={32}
            onClick={(e: Event) => {
              onClickArrow(e);
            }}
            style={{ transform: `${showDropdown ? "rotate(90deg)" : ""}` }}
          >
            <IoIosArrowForward size={24} style={arrowStyle} />
          </RoundButton>
        </Flexbox>
      </div>
      {showDropdown && (
        <DropdownList
          boards={boards}
          onClickFooter={onClickCreateBoard}
          onSelect={(boardId: string) => {
            setSelection(boardId);
            onSelect(boardId);
          }}
        />
      )}
    </div>
  );
}
