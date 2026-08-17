"use client";

import { motion } from "framer-motion";

type IconProps = { size?: number; className?: string };

export function WaveIcon({ size = 28, className }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ transformOrigin: "70% 90%" }}
      initial={{ rotate: 0 }}
      animate={{ rotate: [0, 18, -8, 14, 0] }}
      transition={{ duration: 1.2, delay: 0.2, ease: "easeInOut" }}
    >
      <path
        d="M8 13.5V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11.2V6a1.5 1.5 0 0 1 3 0v7.5M17 9.5a1.5 1.5 0 0 1 3 0V15c0 3.87-3.13 7-7 7h-1c-3 0-4-1-5.5-3.5L4 14c-.6-.9-.3-1.9.5-2.3.8-.4 1.7-.1 2.3.6L8 14"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

export function SandwichIcon({ size = 28, className }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <path
        d="M3 11.5C3 7.4 7 4 12 4s9 3.4 9 7.5"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <path
        d="M2.5 11.5h19a1 1 0 0 1 1 1v1a2.5 2.5 0 0 1-2.5 2.5H4a2.5 2.5 0 0 1-2.5-2.5v-1a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <path
        d="M4 16.5 5 20h14l1-3.5"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 11.5v-1M12 11.5v-2M16 11.5v-1" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
    </motion.svg>
  );
}

export function GiftIcon({ size = 28, className }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{ transformOrigin: "50% 100%" }}
      animate={{ rotate: [0, -6, 6, -3, 0], scale: [1, 1.04, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
    >
      <rect x="4" y="9.5" width="16" height="10" rx="1.2" stroke="currentColor" strokeWidth={1.6} />
      <path d="M4 13h16" stroke="currentColor" strokeWidth={1.6} />
      <path d="M12 9.5v10" stroke="currentColor" strokeWidth={1.6} />
      <path
        d="M12 9.5c0-2.5-2-4-3.5-4S6 6.6 6 7.9C6 9 7 9.5 8 9.5h4Z"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <path
        d="M12 9.5c0-2.5 2-4 3.5-4S18 6.6 18 7.9c0 1.1-1 1.6-2 1.6h-4Z"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </motion.svg>
  );
}

export function StarIcon({ size = 20, className }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      animate={{ scale: [1, 1.25, 1], rotate: [0, 8, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" }}
    >
      <path d="M12 2.5 14.6 9l6.9.6-5.2 4.5L18 21l-6-3.7L6 21l1.7-6.9L2.5 9.6 9.4 9 12 2.5Z" />
    </motion.svg>
  );
}

export function CheckIcon({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth={1.6}
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
      <motion.path
        d="M7.5 12.5 10.3 15.3 16.5 9"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      />
    </svg>
  );
}

export function TargetIcon({ size = 18, className }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={1.6} />
      <circle cx="12" cy="12" r="5.2" stroke="currentColor" strokeWidth={1.6} />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
    </motion.svg>
  );
}

export function HeartIcon({ size = 20, className }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      animate={{ scale: [1, 1.18, 1] }}
      transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }}
    >
      <path d="M12 20.5s-7.5-4.6-10-9.4C.4 7.7 2 4.5 5.4 4c2-.3 3.8.7 6.6 3.4C14.8 4.7 16.6 3.7 18.6 4c3.4.5 5 3.7 3.4 7.1-2.5 4.8-10 9.4-10 9.4Z" />
    </motion.svg>
  );
}

export function PartyIcon({ size = 32, className }: IconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      initial={{ rotate: -15, scale: 0.6, opacity: 0 }}
      animate={{ rotate: 0, scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 12 }}
    >
      <path d="M4 20 8.5 8l7.5 7.5L4 20Z" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
      <path d="M14 4.5v2M18 6l-1.4 1.4M20 10h-2" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
      <circle cx="10.5" cy="12.5" r="1" fill="currentColor" />
      <circle cx="13" cy="15" r="1" fill="currentColor" />
    </motion.svg>
  );
}
