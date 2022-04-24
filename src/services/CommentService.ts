import { CreateCommentDto } from "./dto/create-comment.dto";
import { axiosInstance } from "./axiosInstance";
import { AxiosError, AxiosResponse } from "axios";
import { CommentData, ErrorData } from "./responses/responses";

export async function createComment(
  dto: CreateCommentDto
): Promise<AxiosResponse<CommentData | ErrorData> | undefined> {
  return axiosInstance
    .post(`/comment/create`, dto)
    .then((response: AxiosResponse<CommentData>) => {
      return response;
    })
    .catch((error: AxiosError<ErrorData>) => {
      return error.response;
    });
}

export async function updateComment(
  id: string,
  dto: CreateCommentDto
): Promise<AxiosResponse<CommentData | ErrorData> | undefined> {
  return axiosInstance
    .patch(`/comment/${id}`, dto)
    .then((response: AxiosResponse<CommentData>) => {
      return response;
    })
    .catch((error: AxiosError<ErrorData>) => {
      return error.response;
    });
}

export async function getComment(
  id: string
): Promise<AxiosResponse<CommentData | ErrorData> | undefined> {
  return axiosInstance
    .get(`/comment/${id}`)
    .then((response: AxiosResponse<CommentData>) => {
      return response;
    })
    .catch((error: AxiosError<ErrorData>) => {
      return error.response;
    });
}
