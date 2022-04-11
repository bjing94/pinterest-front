interface CommentDto {
  username: string;

  content: string;

  likes: number;
}

export interface CreatePinDto {
  title: string;

  username: string;

  userId: string;

  imgId: string;

  content: string;

  comments?: CommentDto[];
}

export interface CreateUserDto {
  userId: string;
  email: string;
  password: string;
}
