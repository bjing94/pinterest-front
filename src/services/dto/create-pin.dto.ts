export interface CreatePinDto {
  title: string;

  username: string;

  userId: string;

  imgId: string;

  content: string;

  comments?: string[];

  boardId: string;
}

export interface CreateUserDto {
  username: string;
  displayId: string;
  email: string;
  password: string;
}
