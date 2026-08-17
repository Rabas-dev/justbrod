import { db } from "@/lib/db";

export default async function AdminCustomers() {
  const customers = await db.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { checkIns: true } },
      rewards: { where: { status: "UNLOCKED" }, take: 1 },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-brod-secondary">Customers</h1>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-brod-border bg-brod-surface">
        {customers.length === 0 ? (
          <p className="p-6 text-sm text-brod-muted">
            No customers yet. Once customers start joining Brod Rewards, they&apos;ll appear here.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brod-border text-brod-muted">
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Check-ins</th>
                <th className="px-4 py-3 font-medium">Reward</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-brod-border last:border-0">
                  <td className="px-4 py-3 font-medium text-brod-text">{c.name}</td>
                  <td className="px-4 py-3 text-brod-muted">{c.phone}</td>
                  <td className="px-4 py-3 text-brod-muted">{c._count.checkIns}</td>
                  <td className="px-4 py-3">
                    {c.rewards.length > 0 ? (
                      <span className="rounded-full bg-brod-success/10 px-2 py-1 text-xs font-medium text-brod-success">
                        Available
                      </span>
                    ) : (
                      <span className="text-brod-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-brod-muted">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
