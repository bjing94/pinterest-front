import { AxiosError, AxiosResponse } from "axios";
import { axiosInstance } from "./axiosInstance";
import { CreateBoardDto, UpdateBoardDto } from "./dto/create-board.dto";
import { BoardData, ErrorData } from "./responses/responses";

export async function getBoard(
  id: string
): Promise<AxiosResponse<BoardData | ErrorData> | undefined> {
  return axiosInstance
    .get(`board/${id}`)
    .then((response: AxiosResponse<BoardData>) => {
      return response;
    })
    .catch((err: AxiosError<ErrorData>) => {
      return err.response;
    });
}

export async function createBoard(dto: CreateBoardDto) {
  return axiosInstance
    .post(`board/create`, dto)
    .then((response: AxiosResponse<BoardData>) => {
      return response;
    })
    .catch((err: AxiosError<ErrorData>) => {
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
      return err.response;
    });
}
