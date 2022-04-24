export interface CreateBoardDto {
  pins: string[];

  title: string;

  userId: string;
}

export interface UpdateBoardDto {
  pins: string[];

  title: string;
}
