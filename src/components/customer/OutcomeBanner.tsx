"use client";

import { motion } from "framer-motion";
import { PartyIcon, CheckIcon } from "@/components/icons/AnimatedIcons";
import type { LoyaltyState } from "@/lib/loyalty/types";

export function OutcomeBanner({ state }: { state: LoyaltyState }) {
  const remaining = Math.max(state.program.requiredStamps - state.stamps, 0);

  if (state.activeReward && state.justCheckedIn) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-brod-primary/10 px-5 py-4 text-center"
      >
        <div className="flex justify-center text-brod-primary">
          <PartyIcon />
        </div>
        <div className="mt-1 text-lg font-bold text-brod-secondary">REWARD UNLOCKED!</div>
        <p className="mt-1 text-sm text-brod-muted">
          You&apos;ve completed your Brod card. Enjoy your {state.program.rewardName.toLowerCase()} on your next visit.
        </p>
      </motion.div>
    );
  }

  if (state.alreadyCheckedInToday) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-brod-warning/10 px-5 py-4 text-center">
        <p className="font-medium text-brod-secondary">You&apos;re already checked in today</p>
        <p className="mt-1 text-sm text-brod-muted">Your stamp is safe. Come back tomorrow for your next one.</p>
      </motion.div>
    );
  }

  if (state.justCheckedIn) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-brod-success/10 px-5 py-4 text-center"
      >
        <div className="flex justify-center text-brod-success">
          <CheckIcon size={30} />
        </div>
        <div className="mt-1 font-bold text-brod-secondary">STAMP ADDED!</div>
        <p className="mt-1 text-sm text-brod-muted">
          {remaining > 0 ? `${remaining} more visit${remaining === 1 ? "" : "s"} to go` : "Reward unlocked!"}
        </p>
      </motion.div>
    );
  }

  return null;
}
