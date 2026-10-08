"use client";

import { useMemo, useState } from "react";

export type AccountRow = {
  plan: string;
  users: string;
  mrr: string;
  status: string;
};

const ALL = "all";

function statusClasses(status: string) {
  if (status === "Active") return "bg-green-100 text-green-700";
  if (status === "Trial") return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export default function AccountsTable({ rows }: { rows: AccountRow[] }) {
  const [status, setStatus] = useState(ALL);

  // Options come from the data, so the filter can never offer a status that
  // matches nothing.
  const statuses = useMemo(
    () => Array.from(new Set(rows.map((r) => r.status))),
    [rows],
  );

  const visible = status === ALL ? rows : rows.filter((r) => r.status === status);

  return (
    <section
      id="accounts"
      className="mt-6 rounded-xl border border-slate-200 bg-white"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <h2 className="text-sm font-semibold text-slate-900">Accounts</h2>
        <div className="flex items-center gap-2">
          <select
            aria-label="Filter by status"
            className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs text-slate-700"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value={ALL}>All statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300"
          >
            Refresh
          </button>
        </div>
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
            <th className="px-5 py-2 font-medium">Plan</th>
            <th className="px-5 py-2 font-medium">Users</th>
            <th className="px-5 py-2 font-medium">MRR</th>
            <th className="px-5 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((r, i) => (
            <tr
              key={i}
              className="border-b border-slate-50 last:border-0 hover:bg-slate-50"
            >
              <td className="px-5 py-2.5 font-medium text-slate-900">
                {r.plan}
              </td>
              <td className="px-5 py-2.5 text-slate-600">{r.users}</td>
              <td className="px-5 py-2.5 text-slate-600">{r.mrr}</td>
              <td className="px-5 py-2.5">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClasses(
                    r.status,
                  )}`}
                >
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
          {visible.length === 0 && (
            <tr>
              <td className="px-5 py-6 text-center text-slate-400" colSpan={4}>
                No accounts match this filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
