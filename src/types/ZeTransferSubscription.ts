import { ZeTransferSubscriptionPlan } from "./ZeTransferSubscriptionPlan";

export type ZeTransferSubscription = {
  id: number;
  isActive: boolean;
  isYearly: boolean;
  createdAt: string;
  updatedAt: string;
  zeTransferSubscriptionPlan: ZeTransferSubscriptionPlan;
};
