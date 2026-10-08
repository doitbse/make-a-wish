import Link from "next/link";

import AccountsTable from "@/components/AccountsTable";

/**
 * Sample product surface ("Acme Analytics") used to exercise the feedback
 * widget. It's deliberately full of distinct, clickable DOM elements so the
 * annotation feature has something real to target. Some bits are
 * intentionally rough (the inert refresh button) — that's the point of a
 * testing site.
 */

const KPIS = [
  { label: "Revenue", value: "$48,210", delta: "+12.4%", up: true },
  { label: "Active users", value: "3,942", delta: "+3.1%", up: true },
  { label: "Conversion", value: "2.7%", delta: "-0.4%", up: false },
  { label: "Churn", value: "1.2%", delta: "+0.1%", up: false },
];

const BARS = [42, 68, 55, 80, 47, 73, 61, 88, 52, 76, 64, 91];

const ROWS = [
  { plan: "Starter", users: "1,204", mrr: "$4,816", status: "Active" },
  { plan: "Pro", users: "892", mrr: "$17,840", status: "Active" },
  { plan: "Pro", users: "—", mrr: "$0", status: "Past due" },
  { plan: "Enterprise", users: "12", mrr: "$24,000", status: "Active" },
  { plan: "Starter", users: "640", mrr: "$2,560", status: "Trial" },
  { plan: "Pro", users: "377", mrr: "$7,540", status: "Active" },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-sm font-bold text-white">
              A
            </div>
            <span className="text-sm font-semibold text-slate-900">
              Acme Analytics
            </span>
          </div>
          <nav className="hidden items-center gap-5 text-sm text-slate-500 sm:flex">
            <a className="font-medium text-slate-900" href="#overview">
              Overview
            </a>
            <a className="hover:text-slate-900" href="#revenue">
              Revenue
            </a>
            <a className="hover:text-slate-900" href="#accounts">
              Accounts
            </a>
            <a className="hover:text-slate-900" href="#settings">
              Settings
            </a>
            <Link
              className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
              href="/feedback"
            >
              Feedback Board ✨
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <span
              className="hidden text-xs text-slate-400 sm:inline"
              data-user-email="sascha@doit.com"
            >
              sascha@doit.com
            </span>
            <div className="h-7 w-7 rounded-full bg-slate-200" />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Overview</h1>
            <p className="text-sm text-slate-500">
              Last 30 days · updated just now
            </p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-300"
          >
            Export
          </button>
        </div>

        {/* KPI cards */}
        <section
          id="overview"
          className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        >
          {KPIS.map((k) => (
            <div
              key={k.label}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {k.label}
              </p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {k.value}
              </p>
              <p
                className={`mt-1 text-xs font-medium ${
                  k.up ? "text-green-600" : "text-red-600"
                }`}
              >
                {k.delta} vs prev period
              </p>
            </div>
          ))}
        </section>

        {/* Chart */}
        <section
          id="revenue"
          className="mt-6 rounded-xl border border-slate-200 bg-white p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Revenue by month
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-block h-2 w-2 rounded-full bg-indigo-600" />
              2026
            </div>
          </div>
          <div className="flex h-40 items-end gap-2">
            {BARS.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-indigo-500/80"
                style={{ height: `${h}%` }}
                title={`Month ${i + 1}`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-400">
            <span>Jan</span>
            <span>Apr</span>
            <span>Jul</span>
            <span>Dec</span>
          </div>
        </section>

        <AccountsTable rows={ROWS} />

        <p className="mt-8 text-center text-xs text-slate-400">
          This is a dummy product surface for testing the feedback widget. Spot
          something off? Tap the ✨ button in the bottom-right.
        </p>
      </main>
    </div>
  );
}
