"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/shared/Logo";

export function LoyaltyCard({
  stamps,
  required,
  rewardName,
  programName,
}: {
  stamps: number;
  required: number;
  rewardName: string;
  programName: string;
}) {
  const dots = Array.from({ length: required }, (_, i) => i < stamps);

  return (
    <div className="rounded-3xl bg-brod-secondary p-6 text-brod-background shadow-xl">
      <div className="flex justify-center">
        <Logo variant="cream" height={18} />
      </div>
      <div className="mt-2 text-center text-xs font-semibold tracking-[0.2em] text-brod-primary uppercase">
        {programName}
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-3">
        {dots.map((earned, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{ scale: earned ? [0.8, 1.15, 1] : 1 }}
            transition={{ duration: 0.5 }}
            className={
              "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm " +
              (earned
                ? "border-brod-primary bg-brod-primary text-brod-background"
                : "border-brod-background/25 bg-transparent text-brod-background/30")
            }
          >
            {earned ? "●" : "○"}
          </motion.div>
        ))}
      </div>

      <div className="mt-5 text-center text-2xl font-bold">
        {stamps} / {required}
      </div>

      <div className="mt-1 text-center text-sm uppercase tracking-wide text-brod-background/70">
        {rewardName}
      </div>
    </div>
  );
}
