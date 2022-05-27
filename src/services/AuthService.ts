import { AxiosError, AxiosResponse } from "axios";
import { axiosInstance } from "./axiosInstance";
import { CreateUserDto } from "./dto/create-pin.dto";
import { ErrorData, UserData } from "./responses/responses";

export async function login(dto: {
  email: string;
  password: string;
}): Promise<AxiosResponse<{ message: string } | ErrorData> | undefined> {
  return axiosInstance
    .post(`auth/login`, dto)
    .then((response: AxiosResponse<{ message: string }>) => {
      return response;
    })
    .catch((err: AxiosError<ErrorData>) => {
      console.log(err.response);
      return err.response;
    });
}

export async function register(
  dto: CreateUserDto
): Promise<AxiosResponse<{ message: string } | ErrorData> | undefined> {
  return axiosInstance
    .post(`auth/register`, dto)
    .then((response: AxiosResponse<{ message: string }>) => {
      return response;
    })
    .catch(
      (
        err: AxiosError<{ statusCode: number; message: string; error: string }>
      ) => {
        console.log(err.response);
        return err.response;
      }
    );
}

export async function logout() {
  return axiosInstance
    .post(`auth/logout`)
    .then((response: AxiosResponse<UserData>) => {
      return response;
    })
    .catch((error: AxiosError<ErrorData>) => {
      console.log(error.response);
      return error.response;
    });
}

export async function getCurrentUser(): Promise<
  AxiosResponse<UserData | ErrorData> | undefined
> {
  return axiosInstance
    .get(`auth/session-info`)
    .then((response: AxiosResponse<UserData>) => {
      return response;
    })
    .catch((error: AxiosError<ErrorData>) => {
      console.log(error.response);
      return error.response;
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
      console.log("Not authorized!");
      return false;
    });
}
