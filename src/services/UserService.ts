import { AxiosResponse } from "axios";
import { axiosInstance } from "./axiosInstance";
import { FindUserDto } from "./dto/find-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ErrorData, UserData } from "./responses/responses";

export async function subscribe(
  userId: string
): Promise<AxiosResponse<UserData | ErrorData> | undefined> {
  return axiosInstance
    .post(`user/subscribe/${userId}`)
    .then((response: AxiosResponse<UserData>) => {
      return response;
    });
}

export async function unsubscribe(
  userId: string
): Promise<AxiosResponse<UserData | ErrorData> | undefined> {
  return axiosInstance
    .post(`user/unsubscribe/${userId}`)
    .then((response: AxiosResponse<UserData>) => {
      return response;
    });
}

export async function getUser(
  userId: string
): Promise<AxiosResponse<UserData | ErrorData> | undefined> {
  return axiosInstance
    .get(`user/${userId}`)
    .then((response: AxiosResponse<UserData>) => {
      return response;
    });
}

export async function findUser(
  dto: FindUserDto
): Promise<AxiosResponse<UserData | ErrorData> | undefined> {
  return axiosInstance
    .post(`search/users`, dto)
    .then((response: AxiosResponse<UserData>) => {
      return response;
    });
}

export async function updateUser(
  userId: string,
  dto: UpdateUserDto
): Promise<AxiosResponse<UserData | ErrorData> | undefined> {
  return axiosInstance
    .patch(`user/${userId}`, dto)
    .then((response: AxiosResponse<UserData>) => {
      return response;
    });
}
