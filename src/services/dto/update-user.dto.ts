export interface UpdateUserDto {
  username?: string;

  description?: string;

  displayId?: string;

  avatarSrc?: string;

  email?: string;

  newPassword?: string;

  createdPins?: string[];

  savedPins?: string[];

  boards?: string[];

  subscribers?: string[];

  subscriptions?: string[];
}
