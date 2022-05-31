import { CreateCommentDto } from "./dto/create-comment.dto";
import { axiosInstance } from "./axiosInstance";
import { AxiosResponse } from "axios";
import { CommentData, ErrorData } from "./responses/responses";
import { UpdateCommentDto } from "./dto/update-comment.dto";

export async function createComment(
  dto: CreateCommentDto
): Promise<AxiosResponse<CommentData | ErrorData> | undefined> {
  return axiosInstance
    .post(`/comment/create`, dto)
    .then((response: AxiosResponse<CommentData>) => {
      return response;
    });
}

export async function updateComment(
  id: string,
  dto: UpdateCommentDto
): Promise<AxiosResponse<CommentData | ErrorData> | undefined> {
  return axiosInstance
    .patch(`/comment/${id}`, dto)
    .then((response: AxiosResponse<CommentData>) => {
      return response;
    });
}

export async function getComment(
  id: string
): Promise<AxiosResponse<CommentData | ErrorData> | undefined> {
  return axiosInstance
    .get(`/comment/${id}`)
    .then((response: AxiosResponse<CommentData>) => {
      return response;
    });
}

export async function deleteComment(
  id: string
): Promise<AxiosResponse<CommentData | ErrorData> | undefined> {
  return axiosInstance
    .delete(`/comment/${id}`)
    .then((response: AxiosResponse<CommentData>) => {
      return response;
    });
}
