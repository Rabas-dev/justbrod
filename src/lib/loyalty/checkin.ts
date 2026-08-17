import { customAlphabet } from "nanoid";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import type { LoyaltyState } from "./types";

const UNDO_WINDOW_MS = 2 * 60 * 1000; // cashier can undo a mis-tap within 2 minutes

// Generated directly from an uppercase alphanumeric alphabet (36 symbols) so every character
// carries full entropy — nanoid() + .toUpperCase() would fold cases together and lose bits.
const generateRewardSuffix = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

function todayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function rewardCode() {
  return `BRD-${generateRewardSuffix()}`;
}

export class CheckinError extends Error {
  code: "PROGRAM_INACTIVE" | "ALREADY_STAMPED";
  constructor(code: "PROGRAM_INACTIVE" | "ALREADY_STAMPED", message: string) {
    super(message);
    this.code = code;
  }
}

/**
 * Creates the reward the moment a customer qualifies, and resets their progress for the
 * next cycle. Runs on every read (not just right after a stamp) so it also catches
 * customers who already had enough check-ins before an admin lowered requiredStamps.
 */
async function unlockRewardIfEligible(
  tx: Prisma.TransactionClient,
  customerId: string,
  program: { id: string; requiredStamps: number; rewardName: string; rewardValidDays: number }
) {
  const hasActiveReward = await tx.reward.findFirst({
    where: { customerId, programId: program.id, status: "UNLOCKED" },
  });
  if (hasActiveReward) return;

  const stampCount = await tx.checkIn.count({ where: { customerId, programId: program.id } });
  if (stampCount < program.requiredStamps) return;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + program.rewardValidDays);
  await tx.reward.create({
    data: {
      customerId,
      programId: program.id,
      code: rewardCode(),
      rewardName: program.rewardName,
      status: "UNLOCKED",
      expiresAt,
    },
  });
  await tx.checkIn.deleteMany({ where: { customerId, programId: program.id } });
}

/**
 * The only place stamps get added. Called by a cashier after they've verified a
 * qualifying purchase — never triggered by the customer scanning anything themselves.
 * Atomic: a check-in, its stamp count, and any reward unlock happen together or not at all.
 */
export async function addStamp(customerId: string): Promise<LoyaltyState> {
  const program = await db.program.findFirst({ where: { active: true } });
  if (!program) throw new CheckinError("PROGRAM_INACTIVE", "Brod Rewards is currently unavailable.");

  const customer = await db.customer.findUniqueOrThrow({ where: { id: customerId } });
  const checkinDate = todayKey();

  const result = await db.$transaction(async (tx) => {
    const existing = await tx.checkIn.findUnique({
      where: {
        customerId_programId_checkinDate: {
          customerId,
          programId: program.id,
          checkinDate,
        },
      },
    });

    if (existing) {
      return { justCheckedIn: false, alreadyCheckedInToday: true };
    }

    await tx.checkIn.create({
      data: { customerId, programId: program.id, checkinDate },
    });

    await unlockRewardIfEligible(tx, customerId, program);

    return { justCheckedIn: true, alreadyCheckedInToday: false };
  });

  return buildLoyaltyState(customer, program, result.justCheckedIn, result.alreadyCheckedInToday);
}

/** Lets a cashier reverse the stamp they just gave (e.g. wrong customer scanned). */
export async function undoLastStamp(customerId: string): Promise<LoyaltyState> {
  const program = await db.program.findFirst({ where: { active: true } });
  if (!program) throw new CheckinError("PROGRAM_INACTIVE", "Brod Rewards is currently unavailable.");

  const customer = await db.customer.findUniqueOrThrow({ where: { id: customerId } });

  const last = await db.checkIn.findFirst({
    where: { customerId, programId: program.id },
    orderBy: { createdAt: "desc" },
  });

  if (last && Date.now() - last.createdAt.getTime() <= UNDO_WINDOW_MS) {
    await db.checkIn.delete({ where: { id: last.id } });
  }

  return buildLoyaltyState(customer, program, false, false);
}

export async function getLoyaltyState(customerId: string): Promise<LoyaltyState> {
  const customer = await db.customer.findUniqueOrThrow({ where: { id: customerId } });
  const program = await db.program.findFirstOrThrow({ where: { active: true } });

  await db.$transaction((tx) => unlockRewardIfEligible(tx, customerId, program));

  return buildLoyaltyState(customer, program, false, false);
}

async function buildLoyaltyState(
  customer: { id: string; name: string; phone: string; qrToken: string },
  program: { id: string; name: string; requiredStamps: number; rewardName: string },
  justCheckedIn: boolean,
  alreadyCheckedInToday: boolean
): Promise<LoyaltyState> {
  const stamps = await db.checkIn.count({ where: { customerId: customer.id, programId: program.id } });
  const reward = await db.reward.findFirst({
    where: { customerId: customer.id, programId: program.id, status: "UNLOCKED" },
    orderBy: { unlockedAt: "desc" },
  });

  return {
    customer: { id: customer.id, name: customer.name, phone: customer.phone, qrToken: customer.qrToken },
    program: { name: program.name, requiredStamps: program.requiredStamps, rewardName: program.rewardName },
    stamps,
    justCheckedIn,
    alreadyCheckedInToday,
    activeReward: reward
      ? {
          id: reward.id,
          code: reward.code,
          rewardName: reward.rewardName,
          status: reward.status,
          expiresAt: reward.expiresAt.toISOString(),
        }
      : null,
  };
}
