import axios, { AxiosError, AxiosResponse } from "axios";
import { axiosInstance, frontURL } from "./axiosInstance";
import { serverErrorResponse } from "./responses/defaultResponses";
import { ErrorData, FileData } from "./responses/responses";

export async function uploadFile(
  file: File
): Promise<AxiosResponse<FileData | ErrorData> | undefined> {
  const bodyFormData = new FormData();
  bodyFormData.append("files", file);
  return axiosInstance
    .post("files/upload", bodyFormData, {
      headers: {
        "Content-type": "multipart/form-data",
      },
    })
    .then((response: AxiosResponse<FileData>) => {
      return response;
    })
    .catch((err: AxiosError<ErrorData>) => {
      console.log(err.response);
      return err.response;
    });
}

export async function getStaticImage(imgId: string): Promise<string | null> {
  const imgInfo = await axiosInstance
    .get(`files/${imgId}`)
    .then((response: AxiosResponse<FileData>) => {
      return response.data;
    })
    .catch((err: AxiosError<ErrorData>) => {
      console.log(err.response);
      return null;
    });

  if (!imgInfo) {
    return null;
  }

  return frontURL + "/images" + `/${imgInfo.url}`; // 12-05-2022/img5.jpg
  // it is rerouted by nginx to /var/www/ivan-dev/images/12-05-2022/img5.jpg
}

export async function downloadStaticImage(imgId: string) {
  const link = axiosInstance.defaults.baseURL + "files/download/" + imgId;
  return link;
}
