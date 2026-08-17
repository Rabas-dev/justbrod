"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Logo } from "@/components/shared/Logo";
import type { AdminRole } from "@/lib/admin/session";

const NAV = [
  { href: "/admin", label: "Dashboard", roles: ["admin"] },
  { href: "/admin/scan", label: "Scan", roles: ["admin", "cashier"] },
  { href: "/admin/customers", label: "Customers", roles: ["admin"] },
  { href: "/admin/redeem", label: "Redeem", roles: ["admin"] },
  { href: "/admin/program", label: "Program", roles: ["admin"] },
] satisfies { href: string; label: string; roles: AdminRole[] }[];

function NavLinks({ role, onNavigate }: { role: AdminRole; onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = NAV.filter((item) => item.roles.includes(role));

  return (
    <nav className="mt-8 flex-1 space-y-0.5">
      {items.map((item) => {
        const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
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
  );
}

function LogoutButton() {
  return (
    <form action="/api/admin/logout" method="post">
      <button className="text-sm text-brod-muted hover:text-brod-secondary">Log out</button>
    </form>
  );
}

export function Sidebar({ role }: { role: AdminRole }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-brod-border bg-white px-4 py-3 sm:hidden">
        <Logo variant="orange" height={16} />
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-brod-secondary hover:bg-brod-surface"
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="flex flex-col border-b border-brod-border bg-white px-5 pb-5 sm:hidden">
          <NavLinks role={role} onNavigate={() => setOpen(false)} />
          <div className="mt-2 border-t border-brod-border pt-4">
            <LogoutButton />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-brod-border bg-white p-5 sm:flex sm:flex-col">
        <Logo variant="orange" height={18} />
        <NavLinks role={role} />
        <LogoutButton />
      </aside>
    </>
  );
}
