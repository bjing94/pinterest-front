import axios, { AxiosError, AxiosResponse } from "axios";
import { response } from "express";
import { axiosInstance, baseURL } from "./axiosInstance";
import { CreatePinDto, CreateUserDto } from "./dto/create-pin.dto";
import {
  BoardData,
  ErrorData,
  FildeData,
  PinData,
  UserData,
} from "./responses/responses";

export async function uploadFile(file: File): Promise<FildeData | null> {
  const bodyFormData = new FormData();
  bodyFormData.append("files", file);
  return axiosInstance
    .post("files/upload", bodyFormData, {
      headers: {
        "Content-type": "multipart/form-data",
      },
    })
    .then((response: AxiosResponse<FildeData>) => {
      return response.data;
    })
    .catch((err: AxiosError) => {
      console.log(err.response?.data.message);
      return null;
    });
}

export async function getStaticImage(imgId: string): Promise<string | null> {
  const imgInfo = await axiosInstance
    .get(`files/${imgId}`)
    .then((response: AxiosResponse<FildeData>) => {
      return response.data;
    })
    .catch((err: AxiosError) => {
      console.log(err.response?.data.message);
      return null;
    });

  if (!imgInfo) {
    return null;
  }
  // console.log(imgInfo.url);

  return baseURL + `/${imgInfo.url}`;
}
