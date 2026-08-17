import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }) {
  return (
    <button
      className={clsx(
        "w-full rounded-2xl px-6 py-3.5 text-base font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100",
        variant === "primary"
          ? "bg-brod-primary text-brod-background hover:bg-brod-primary-dark"
          : "bg-transparent text-brod-secondary underline underline-offset-4",
        className
      )}
      {...props}
    />
  );
}
