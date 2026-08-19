import Link from "next/link";
import { db } from "@/lib/db";
import { CustomersExportButton, type CustomerExportRow } from "@/components/admin/CustomersExportButton";

function formatDateTime(d: Date) {
  return d.toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" });
}

function parseDate(value: string | undefined, endOfDay = false): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return undefined;
  if (endOfDay) d.setHours(23, 59, 59, 999);
  return d;
}

export default async function AdminCustomers(props: PageProps<"/admin/customers">) {
  const params = await props.searchParams;
  const fromRaw = typeof params.from === "string" ? params.from : undefined;
  const toRaw = typeof params.to === "string" ? params.to : undefined;

  const from = parseDate(fromRaw);
  const to = parseDate(toRaw, true);

  const program = await db.program.findFirst({ where: { active: true } });

  const customers = await db.customer.findMany({
    where: from || to ? { createdAt: { gte: from, lte: to } } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { checkIns: true } },
      checkIns: { orderBy: { createdAt: "desc" }, take: 1 },
      rewards: { orderBy: { unlockedAt: "desc" }, take: 1 },
    },
  });

  const rangeLabel = from || to ? `Joined ${fromRaw ?? "…"} to ${toRaw ?? "…"}` : "All customers";

  const exportRows: CustomerExportRow[] = customers.map((c) => ({
    name: c.name,
    phone: c.phone,
    joinedAt: formatDateTime(c.createdAt),
    lastActivityAt: c.checkIns[0] ? formatDateTime(c.checkIns[0].createdAt) : null,
    stamps: c._count.checkIns,
    requiredStamps: program?.requiredStamps ?? 0,
    rewardStatus: c.rewards[0] ? c.rewards[0].status : null,
  }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-brod-secondary">Customers</h1>
        <CustomersExportButton rows={exportRows} rangeLabel={rangeLabel} />
      </div>

      <form className="mt-5 flex flex-wrap items-end gap-3 rounded-2xl border border-brod-border bg-brod-surface p-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-brod-muted">Joined from</label>
          <input
            type="date"
            name="from"
            defaultValue={fromRaw}
            className="rounded-lg border border-brod-border bg-white px-3 py-2 text-sm text-brod-text outline-none focus:border-brod-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brod-muted">Joined to</label>
          <input
            type="date"
            name="to"
            defaultValue={toRaw}
            className="rounded-lg border border-brod-border bg-white px-3 py-2 text-sm text-brod-text outline-none focus:border-brod-primary"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-brod-primary px-4 py-2 text-sm font-semibold text-brod-background hover:bg-brod-primary-dark"
        >
          Apply
        </button>
        {(fromRaw || toRaw) && (
          <Link href="/admin/customers" className="text-sm text-brod-muted underline underline-offset-4">
            Clear
          </Link>
        )}
        <span className="ml-auto text-xs text-brod-muted">{customers.length} customer(s)</span>
      </form>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-brod-border bg-brod-surface">
        {customers.length === 0 ? (
          <p className="p-6 text-sm text-brod-muted">
            No customers found for this range. Once customers start joining Brod Rewards, they&apos;ll appear here.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brod-border text-brod-muted">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Stamps</th>
                <th className="px-4 py-3 font-medium">Reward</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => {
                const lastCheckIn = c.checkIns[0] ?? null;
                const latestReward = c.rewards[0] ?? null;
                return (
                  <tr key={c.id} className="border-b border-brod-border last:border-0">
                    <td className="px-4 py-3 font-medium text-brod-text">{c.name}</td>
                    <td className="px-4 py-3 text-brod-muted">{c.phone}</td>
                    <td className="px-4 py-3 text-brod-muted">
                      {c._count.checkIns} / {program?.requiredStamps ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      {latestReward ? (
                        <span
                          className={
                            latestReward.status === "UNLOCKED"
                              ? "rounded-full bg-brod-success/10 px-2 py-1 text-xs font-medium text-brod-success"
                              : latestReward.status === "REDEEMED"
                              ? "rounded-full bg-brod-muted/10 px-2 py-1 text-xs font-medium text-brod-muted"
                              : "rounded-full bg-brod-danger/10 px-2 py-1 text-xs font-medium text-brod-danger"
                          }
                        >
                          {latestReward.status}
                        </span>
                      ) : (
                        <span className="text-brod-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-brod-muted">{formatDateTime(c.createdAt)}</td>
                    <td className="px-4 py-3 text-brod-muted">
                      {lastCheckIn ? formatDateTime(lastCheckIn.createdAt) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
