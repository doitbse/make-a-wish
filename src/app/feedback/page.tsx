"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import type { StoredFeedback } from "@/lib/feedback-store";

const CATEGORY_COLORS: Record<string, string> = {
  Bug: "bg-red-50 text-red-700 border-red-200",
  bug: "bg-red-50 text-red-700 border-red-200",
  Wish: "bg-purple-50 text-purple-700 border-purple-200",
  wish: "bg-purple-50 text-purple-700 border-purple-200",
  Confusing: "bg-amber-50 text-amber-700 border-amber-200",
  confusing: "bg-amber-50 text-amber-700 border-amber-200",
  "Wrong data": "bg-blue-50 text-blue-700 border-blue-200",
  wrong_data: "bg-blue-50 text-blue-700 border-blue-200",
  Praise: "bg-green-50 text-green-700 border-green-200",
  praise: "bg-green-50 text-green-700 border-green-200",
};

const PRIORITY_BADGES: Record<string, string> = {
  P1: "bg-rose-600 text-white font-bold ring-2 ring-rose-200",
  P2: "bg-amber-500 text-white font-semibold",
  P3: "bg-blue-500 text-white",
  P4: "bg-slate-400 text-white",
};

export default function FeedbackBoardPage() {
  const [items, setItems] = useState<StoredFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/feedback");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as StoredFeedback[];
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const stats = useMemo(() => {
    const total = items.length;
    const bugs = items.filter(
      (i) => (i.category?.toLowerCase() === "bug") || (String(i.triage?.confirmed_category).toLowerCase() === "bug")
    ).length;
    const wishes = items.filter(
      (i) => (i.category?.toLowerCase() === "wish") || (String(i.triage?.confirmed_category).toLowerCase() === "wish")
    ).length;
    const critical = items.filter((i) => {
      const p = String(i.triage?.priority || "").toUpperCase();
      return p === "P1" || p === "P2";
    }).length;
    const firestoreCount = items.filter((i) => i.source === "firestore").length;
    return { total, bugs, wishes, critical, firestoreCount };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const cat = (item.triage?.confirmed_category as string) || item.category || "";
      if (selectedCategory !== "all" && cat.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      const prio = (item.triage?.priority as string) || "";
      if (selectedPriority !== "all" && prio.toUpperCase() !== selectedPriority.toUpperCase()) {
        return false;
      }
      const team = (item.triage?.suggested_team as string) || "";
      if (selectedTeam !== "all" && team.toLowerCase() !== selectedTeam.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [items, selectedCategory, selectedPriority, selectedTeam]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              ← Back to App
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  Feedback & Triage Board
                </span>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                  Pre-Jira Test Surface
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Live submissions synced with Google Cloud Firestore (sascha-playground-doit)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchItems}
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "↻ Refresh"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* KPI Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <p className="text-xs font-medium uppercase text-slate-400">Total Reports</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="mt-1 text-[11px] text-slate-500">{stats.firestoreCount} stored in Firestore</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <p className="text-xs font-medium uppercase text-slate-400">Bugs</p>
            <p className="mt-1 text-2xl font-bold text-red-600">{stats.bugs}</p>
            <p className="mt-1 text-[11px] text-slate-500">Identified issues</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <p className="text-xs font-medium uppercase text-slate-400">Wishes</p>
            <p className="mt-1 text-2xl font-bold text-purple-600">{stats.wishes}</p>
            <p className="mt-1 text-[11px] text-slate-500">Feature requests</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <p className="text-xs font-medium uppercase text-slate-400">P1 / P2 Urgent</p>
            <p className="mt-1 text-2xl font-bold text-rose-600">{stats.critical}</p>
            <p className="mt-1 text-[11px] text-slate-500">High priority items</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
            <p className="text-xs font-medium uppercase text-slate-400">Database Status</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-semibold text-slate-800">Connected</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">projects/sascha-playground-doit</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="mr-2 text-xs font-medium text-slate-500">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700"
              >
                <option value="all">All Categories</option>
                <option value="bug">Bugs</option>
                <option value="wish">Wishes</option>
                <option value="confusing">Confusing</option>
                <option value="wrong_data">Wrong Data</option>
                <option value="praise">Praise</option>
              </select>
            </div>

            <div>
              <label className="mr-2 text-xs font-medium text-slate-500">Priority:</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700"
              >
                <option value="all">All Priorities</option>
                <option value="P1">P1 (Blocker)</option>
                <option value="P2">P2 (Major)</option>
                <option value="P3">P3 (Minor)</option>
                <option value="P4">P4 (Trivial)</option>
              </select>
            </div>

            <div>
              <label className="mr-2 text-xs font-medium text-slate-500">Team:</label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700"
              >
                <option value="all">All Teams</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="data">Data</option>
                <option value="design">Design</option>
                <option value="infra">Infra</option>
                <option value="product">Product</option>
              </select>
            </div>
          </div>

          <span className="text-xs text-slate-500">
            Showing <strong className="text-slate-800">{filtered.length}</strong> of {items.length} submissions
          </span>
        </div>

        {/* Feedback List */}
        <div className="mt-6 space-y-4">
          {loading && items.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-500">
              Loading submissions from Firestore...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              Error: {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-500">
              No feedback submissions match your filter.
            </div>
          ) : (
            filtered.map((item) => {
              const triage = item.triage;
              const cat = (triage?.confirmed_category as string) || item.category || "wish";
              const priority = (triage?.priority as string) || "P3";
              const severity = (triage?.severity as string) || "minor";
              const team = (triage?.suggested_team as string) || "unknown";
              const title = (triage?.title as string) || item.text.slice(0, 80);
              const summary = (triage?.summary as string) || "";
              const labels = Array.isArray(triage?.suggested_labels)
                ? (triage.suggested_labels as string[])
                : [];
              const confidence =
                typeof triage?.confidence === "number"
                  ? Math.round(triage.confidence * 100)
                  : null;

              return (
                <div
                  key={item.id || item.timestamp}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-300"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-md border px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[cat] || "bg-slate-100 text-slate-700"}`}>
                        {cat}
                      </span>
                      <span className={`rounded-md px-2 py-0.5 text-xs ${PRIORITY_BADGES[priority] || "bg-slate-500 text-white"}`}>
                        {priority} · {severity}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        team: <strong className="text-slate-800">{team}</strong>
                      </span>
                      {confidence !== null && (
                        <span className="rounded-md bg-slate-50 px-2 py-0.5 text-xs text-slate-500">
                          {confidence}% confidence
                        </span>
                      )}
                      {item.source === "firestore" ? (
                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                          ☁ Firestore
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          📁 Local File
                        </span>
                      )}
                      {item.appId && (
                        <span className="rounded-md bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">
                          app: <strong>{item.appId}</strong>
                        </span>
                      )}
                      {(item.repos && item.repos.length > 0) ? (
                        <div className="flex flex-wrap items-center gap-1">
                          {item.repos.map((r) => {
                            const isTarget = triage?.target_repo === r;
                            return (
                              <span
                                key={r}
                                className={`rounded-md px-2 py-0.5 text-xs font-mono ${
                                  isTarget
                                    ? "bg-green-100 text-green-800 font-semibold border border-green-300"
                                    : "bg-slate-100 text-slate-700 border border-slate-200"
                                }`}
                                title={isTarget ? "Agent-selected target repository for PR" : "Related application repository"}
                              >
                                {isTarget ? "✓ " : ""}{r}
                              </span>
                            );
                          })}
                        </div>
                      ) : item.repo ? (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-700 border border-slate-200">
                          {item.repo}
                        </span>
                      ) : null}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(item.storedAt || item.timestamp).toLocaleString()}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="mt-3.5 grid gap-4 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                        {summary && (
                          <div className="mt-1.5 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-700 border border-slate-100">
                            <span className="font-semibold text-indigo-700">Triage Summary: </span>
                            {summary}
                          </div>
                        )}
                      </div>

                      <div className="text-xs">
                        <span className="font-semibold text-slate-500">User Description: </span>
                        <p className="mt-0.5 text-slate-800 italic bg-amber-50/40 p-2 rounded border border-amber-100">
                          &ldquo;{item.text}&rdquo;
                        </p>
                      </div>

                      {/* Annotations breakdown */}
                      {item.annotations && item.annotations.length > 0 && (
                        <div className="text-xs">
                          <span className="font-semibold text-slate-500">
                            Annotated Elements ({item.annotations.length}):
                          </span>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {item.annotations.map((a, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-700"
                              >
                                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white">
                                  {idx + 1}
                                </span>
                                <code>{a.selector}</code>
                                {a.text && <span className="text-slate-500">(&ldquo;{a.text.slice(0, 20)}&rdquo;)</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Labels */}
                      {labels.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 pt-1">
                          {labels.map((l) => (
                            <span
                              key={l}
                              className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600"
                            >
                              #{l}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Screenshot column */}
                    <div className="flex flex-col justify-start">
                      {item.screenshot ? (
                        <div>
                          <span className="text-xs font-semibold text-slate-500 mb-1.5 block">
                            Annotated Screenshot:
                          </span>
                          <div
                            onClick={() => setPreviewImage(item.screenshot)}
                            className="group relative cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-slate-100 hover:border-indigo-400"
                          >
                            <img
                              src={item.screenshot}
                              alt="Annotated screen capture"
                              className="h-32 w-full object-cover object-top transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium">
                              🔍 Click to enlarge
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
                          No screenshot captured
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Screenshot Modal Preview */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-6 backdrop-blur-xs"
        >
          <div className="relative max-h-[90vh] max-w-5xl overflow-auto rounded-xl bg-white p-2 shadow-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute right-4 top-4 rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-bold text-white shadow-md hover:bg-slate-900"
            >
              ✕ Close
            </button>
            <img
              src={previewImage}
              alt="Enlarged screenshot"
              className="rounded-lg max-h-[85vh] w-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
