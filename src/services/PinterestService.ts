import axios, { AxiosError, AxiosResponse } from "axios";
import { CreatePinDto } from "./dto/create-pin.dto";
import { ErrorData, FildeData, PinData } from "./responses/responses";

const baseURL = `http://localhost:3000/`;

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

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

export async function createPin(dto: CreatePinDto): Promise<PinData | null> {
  return axiosInstance
    .post("pin/create", dto)
    .then((response: AxiosResponse<PinData>) => {
      return response.data;
    })
    .catch((err: AxiosError) => {
      console.log(err.response?.data.message);
      return null;
    });
}

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

export async function login(dto: {
  email: string;
  password: string;
}): Promise<any | null> {
  return axiosInstance
    .post(`auth/login`, dto)
    .then((response: AxiosResponse<any>) => {
      console.log("Set cookie:", response.headers["Set-cookie"]);
      console.log("Response:", response);
      return response.data;
    })
    .catch((err: AxiosError) => {
      console.log(err);
      console.log(err.response?.data);
      return null;
    });
}

export async function checkLogin(): Promise<boolean> {
  return axiosInstance
    .get(`auth/check`)
    .then((response: AxiosResponse<{ loggedIn: boolean }>) => {
      console.log("Authorized!");
      return true;
    })
    .catch((err: AxiosError) => {
      console.log(err.response?.data);
      console.log("Not authorized!");
      return false;
    });
}
