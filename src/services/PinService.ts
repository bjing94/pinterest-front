import { AxiosError, AxiosResponse } from "axios";
import { axiosInstance } from "./axiosInstance";
import { CreatePinDto } from "./dto/create-pin.dto";
import { ErrorData, PinData } from "./responses/responses";

export async function getRandomPins(): Promise<PinData[] | null> {
  return axiosInstance
    .get(`search/pins?random=true`)
    .then((response: AxiosResponse<PinData[]>) => {
      return response.data;
    })
    .catch((err: AxiosError) => {
      console.log(err.response?.data.message);
      return null;
    });
}

export async function getPin(pinId: string): Promise<PinData | null> {
  return axiosInstance
    .get(`pin/${pinId}`)
    .then((response: AxiosResponse<PinData>) => {
      return response.data;
    })
    .catch((err: AxiosError) => {
      console.log(err.response?.data.message);
      return null;
    });
}

export async function createPin(
  dto: CreatePinDto
): Promise<AxiosResponse<PinData | ErrorData> | undefined> {
  return axiosInstance
    .post("pin/create", dto)
    .then((response: AxiosResponse<PinData>) => {
      return response;
    })
    .catch((err: AxiosError) => {
      return err.response;
    });
}

export async function updatePin(
  pinId: string,
  dto: CreatePinDto
): Promise<AxiosResponse<PinData | ErrorData> | undefined> {
  return axiosInstance
    .patch(`pin/${pinId}`, dto)
    .then((response: AxiosResponse<PinData>) => {
      return response;
    })
    .catch((err: AxiosError) => {
      return err.response;
    });
}
