import axios, { AxiosError, AxiosResponse } from "axios";
import { CreatePinDto } from "./dto/create-pin.dto";
import { ErrorResponse, FileResponse } from "./responses/responses";

const axiosInstance = axios.create({
  baseURL: `http://localhost:3000/`,
});

export async function getPin(pinId: string): Promise<string> {
  return axiosInstance
    .get(`pin/${pinId}`)
    .then((data: AxiosResponse<CreatePinDto>) => {
      return JSON.stringify(data);
    })
    .catch((err: AxiosError) => {
      return err.response?.data.message;
    });
}

export async function createPin(dto: CreatePinDto): Promise<string | null> {
  return axiosInstance
    .post("pin/create", dto)
    .then((response: AxiosResponse) => {
      return JSON.stringify(response.data);
    })
    .catch((err: AxiosError) => {
      console.log(err.response?.data.message);
      return null;
    });
}

export async function uploadFile(file: File): Promise<FileResponse | null> {
  const bodyFormData = new FormData();
  bodyFormData.append("files", file);
  return axiosInstance
    .post("files/upload", bodyFormData, {
      headers: {
        "Content-type": "multipart/form-data",
      },
    })
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((err: AxiosError) => {
      console.log(err.response?.data.message);
      return null;
    });
}
