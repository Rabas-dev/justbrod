"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Logo } from "@/components/shared/Logo";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/scan", label: "Scan" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/redeem", label: "Redeem" },
  { href: "/admin/program", label: "Program" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-brod-border bg-white p-5 sm:flex sm:flex-col">
      <Logo variant="orange" height={18} />

      <nav className="mt-8 flex-1 space-y-0.5">
        {nav.map((item) => {
          const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-brod-primary/10 text-brod-primary"
                  : "text-brod-secondary/70 hover:bg-brod-surface hover:text-brod-secondary"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action="/api/admin/logout" method="post">
        <button className="text-sm text-brod-muted hover:text-brod-secondary">Log out</button>
      </form>
    </aside>
  );
}
