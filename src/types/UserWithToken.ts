import { User } from "./User";

export type UserWithToken = {
  token: string;

  user: User;
};
