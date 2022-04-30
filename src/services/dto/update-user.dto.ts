export interface UpdateUserDto {
  username?: string;

  description?: string;

  displayId?: string;

  email?: string;

  passwordHash?: string;

  createdPins?: string[];

  savedPins?: string[];

  boards?: string[];

  subscribers?: string[];

  subscriptions?: string[];
}
