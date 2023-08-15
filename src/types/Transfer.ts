import { File } from "./File";
import { Link } from "./Link";
import { User } from "./User";

export type Transfer = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  files?: File[];
} & (
  | {
      isPrivate: true;
      users: User[];
    }
  | {
      isPrivate: false;
      link: Link;
    }
);
