import { File } from "./File";
import { User } from "./User";

export type Transfer = {
  id: number;
  name: string;
  description: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  users?: User[];
  files?: File[];
};
