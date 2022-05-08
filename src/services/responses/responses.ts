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

export interface UserData {
  _id: string;

  username: string;

  description: string;

  avatarSrc: string;

  displayId: string;

  email: string;

  passwordHash: string;

  createdPins: string[];

  savedPins: string[];

  boards: string[];

  subscribers: string[];

  subscriptions: string[];
}

export interface BoardData {
  _id: string;
  title: string;
  userId: string;
  pins: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ErrorData {
  statusCode: number;
  message: string;
  error: string;
}

export interface CommentData {
  _id: string;

  userId: string;

  content: string;

  likedBy: string[];

  usefulBy: string[];

  createdAt: string;

  updatedAt: string;
}
