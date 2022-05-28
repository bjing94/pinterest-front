import { AxiosError, AxiosResponse } from "axios";
import { axiosInstance } from "./axiosInstance";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";
import { BoardData, ErrorData, UserData } from "./responses/responses";
import { updateUser } from "./UserService";

export async function getBoard(
  id: string
): Promise<AxiosResponse<BoardData | ErrorData> | undefined> {
  return axiosInstance
    .get(`board/${id}`)
    .then((response: AxiosResponse<BoardData>) => {
      return response;
    })
    .catch((err: AxiosError<ErrorData>) => {
      console.log(err.response);
      return err.response;
    });
}

export async function getBoards(ids: string[]): Promise<BoardData[]> {
  const boardResponses = await Promise.all(
    ids.map((boardId) => {
      return getBoard(boardId);
    })
  );

  const boardsData: BoardData[] = boardResponses
    .map((response) => {
      if (response !== undefined && response.status === 200) {
        return response.data as BoardData;
      }
      return undefined;
    })
    .filter((data): data is BoardData => {
      return data !== undefined;
    });

  return boardsData;
}

export async function createBoard(dto: CreateBoardDto) {
  return axiosInstance
    .post(`board/create`, dto)
    .then((response: AxiosResponse<BoardData>) => {
      return response;
    })
    .catch((err: AxiosError<ErrorData>) => {
      console.log(err.response);
      return err.response;
    });
}

export async function updateBoard(id: string, dto: UpdateBoardDto) {
  return axiosInstance
    .patch(`board/${id}`, dto)
    .then((response: AxiosResponse<BoardData>) => {
      return response;
    })
    .catch((err: AxiosError<ErrorData>) => {
      console.log(err.response);
      return err.response;
    });
}

export async function deleteBoard(id: string) {
  return axiosInstance
    .delete(`board/${id}`)
    .then((response: AxiosResponse<BoardData>) => {
      return response;
    })
    .catch((err: AxiosError<ErrorData>) => {
      console.log(err.response);
      return err.response;
    });
}

export async function savePinToBoard(pinId: string, boardId: string) {
  if (!pinId) {
    return;
  }

  const boardResponse = await getBoard(boardId);
  if (!boardResponse || boardResponse.status !== 200) {
    throw new Error("Error finding board!");
  }
  const newBoard = boardResponse.data as BoardData;
  newBoard.pins.push(pinId);

  const updatedBoardResponse = await updateBoard(boardId, {
    pins: newBoard.pins,
    title: newBoard.title,
  });
  if (!updatedBoardResponse || updatedBoardResponse.status !== 200) {
    throw new Error("Error updating board!");
  }
}

export async function savePinToProfile(pinId: string, user: UserData) {
  user.savedPins.push(pinId);
  const updateResponse = await updateUser(user._id, user);
  if (!updateResponse || updateResponse.status !== 200) {
    throw new Error("Error saving pin!");
  }
  return;
}
