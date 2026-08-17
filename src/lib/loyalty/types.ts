export type LoyaltyState = {
  customer: { id: string; name: string; phone: string; qrToken: string };
  program: { name: string; requiredStamps: number; rewardName: string };
  stamps: number;
  justCheckedIn: boolean;
  alreadyCheckedInToday: boolean;
  activeReward: {
    id: string;
    code: string;
    rewardName: string;
    status: string;
    expiresAt: string;
  } | null;
};
