import { Transfer } from "./Transfer";
import { ZeTransferSubscription } from "./ZeTransferSubscription";

export type User = {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  contacts?: User[];
  transfers?: Transfer[];
  zeTransferSubscription?: ZeTransferSubscription;
};
