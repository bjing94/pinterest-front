import { CreatePinDto } from "../dto/create-pin.dto";

export interface PinData extends CreatePinDto {
  _id: string;
  _v: string;
}

export interface FildeData {
  _id: string;
  _v: string;
  fileName: string;
  url: string;
}

export interface ErrorData {
  statusCode: number;
  message: string;
  error: string;
}
