import { db } from "@/lib/db";

export type RedeemResult =
  | { ok: true; customerName: string; rewardName: string }
  | { ok: false; reason: "NOT_FOUND" | "ALREADY_REDEEMED" | "EXPIRED" };

export async function redeemRewardCode(code: string): Promise<RedeemResult> {
  const reward = await db.reward.findUnique({
    where: { code: code.trim().toUpperCase() },
    include: { customer: true },
  });

  if (!reward) return { ok: false, reason: "NOT_FOUND" };
  if (reward.status === "REDEEMED") return { ok: false, reason: "ALREADY_REDEEMED" };
  if (reward.status === "EXPIRED" || reward.expiresAt < new Date()) {
    if (reward.status !== "EXPIRED") {
      await db.reward.update({ where: { id: reward.id }, data: { status: "EXPIRED" } });
    }
    return { ok: false, reason: "EXPIRED" };
  }

  await db.reward.update({
    where: { id: reward.id },
    data: { status: "REDEEMED", redeemedAt: new Date() },
  });

  return { ok: true, customerName: reward.customer.name, rewardName: reward.rewardName };
}
