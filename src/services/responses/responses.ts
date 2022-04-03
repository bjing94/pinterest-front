export interface FileResponse {
  _id: string;
  _v: string;
  fileName: string;
  url: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}
