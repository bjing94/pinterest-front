import { AxiosError, AxiosResponse } from "axios";
import { axiosInstance } from "./axiosInstance";
import { ErrorData, UserData } from "./responses/responses";

export async function subscribe(
  displayId: string
): Promise<AxiosResponse<UserData | ErrorData> | undefined> {
  return axiosInstance
    .post(`user/subscribe/${displayId}`)
    .then((response: AxiosResponse<UserData>) => {
      return response;
    })
    .catch((err: AxiosError<ErrorData>) => {
      return err.response;
    });
}

export async function getUser(
  userId: string
): Promise<AxiosResponse<UserData | ErrorData> | undefined> {
  return axiosInstance
    .get(`user/${userId}`)
    .then((response: AxiosResponse<UserData>) => {
      return response;
    })
    .catch((error: AxiosError<ErrorData>) => {
      return error.response;
    });
}
