export interface CreatePinDto {
  title: string;

  userId: string;

  boardId: string;

  imgId: string;

  content: string;

  comments?: string[];
}

export interface CreateUserDto {
  username: string;
  displayId: string;
  email: string;
  password: string;
}
