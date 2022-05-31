import { AxiosResponse } from "axios";
import { axiosInstance, frontURL } from "./axiosInstance";
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
    });
}

export async function getStaticImage(imgId: string): Promise<string | null> {
  if (imgId.length === 0) {
    return null;
  }
  const imgInfo = await axiosInstance
    .get(`files/${imgId}`)
    .then((response: AxiosResponse<FileData>) => {
      return response.data;
    });

  if (!imgInfo) {
    return null;
  }

  return frontURL + "/images" + `/${imgInfo.url}`; // 12-05-2022/img5.jpg
}

export function downloadStaticImage(imgId: string) {
  const link = axiosInstance.defaults.baseURL + "/files/download/" + imgId;
  return link;
}
