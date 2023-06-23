import { Transfer } from "./Transfer";

export type File = {
  id: number;
  name: string;
  size: number;
  type: string;
  createdAt: string;
  updatedAt: string;
  transfer?: Transfer;
};
