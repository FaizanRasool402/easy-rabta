"use client";

import { useEffect, useMemo, useState } from "react";
import SuperAdminShell from "@/components/SuperAdminShell";
import {
  buildPropertyFlags,
  formatPrice,
  normalizeProperty,
  type PropertyRecord,
  type RawProperty,
} from "@/lib/superAdmin";
import { FiAlertTriangle, FiCheckCircle, FiClock, FiFilter } from "react-icons/fi";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

type ModerationFilter = "all" | "flagged" | "clean";

export default function SuperAdminModerationPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<PropertyRecord[]>([]);
  const [filter, setFilter] = useState<ModerationFilter>("flagged");

  useEffect(() => {
    async function loadItems() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/properties`, {
          credentials: "include",
        });
        if (!response.ok) return;

        const data = (await response.json()) as { properties?: RawProperty[] };
        setItems((data.properties ?? []).map(normalizeProperty));
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, []);

  const moderationQueue = useMemo(
    () =>
      [...items]
        .map((item) => ({ ...item, flags: buildPropertyFlags(item) }))
        .filter((item) => {
          if (filter === "flagged") return item.flags.length > 1;
          if (filter === "clean") return item.flags.length === 1;
          return true;
        })
        .sort((a, b) => b.flags.length - a.flags.length),
    [filter, items]
  );
  const flaggedCount = items.filter((item) => buildPropertyFlags(item).length > 1).length;
  const cleanCount = items.filter((item) => buildPropertyFlags(item).length === 1).length;

  return (
    <SuperAdminShell
      title="Listing Moderation"
      description="Operational review center for property quality checks, listing trust, and review prioritization across the whole platform."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.75rem] border border-amber-400/20 bg-amber-500/10 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-amber-100">
            <FiAlertTriangle size={15} />
            Flagged Listings
          </p>
          <p className="mt-3 text-4xl font-bold text-white">{flaggedCount}</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
            <FiCheckCircle size={15} />
            Clean Listings
          </p>
          <p className="mt-3 text-4xl font-bold text-white">{cleanCount}</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
            <FiClock size={15} />
            Review Mode
          </p>
          <p className="mt-3 text-2xl font-bold capitalize text-white">{filter}</p>
        </div>
      </div>

      <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
              Review Queue
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Listings ordered by review risk
            </h2>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
            {moderationQueue.length} listings loaded
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {([
            ["flagged", "Flagged First"],
            ["all", "All Listings"],
            ["clean", "Clean Queue"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === value
                  ? "bg-emerald-400 text-slate-950"
                  : "bg-slate-950/60 text-slate-200 hover:bg-slate-800"
              }`}
            >
              <FiFilter size={14} />
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-slate-400">Loading moderation queue...</p>
        ) : null}

        {!loading && moderationQueue.length === 0 ? (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-700 bg-slate-950/60 p-6 text-center">
            <p className="text-sm text-slate-300">No listings available for review.</p>
          </div>
        ) : null}

        {!loading && moderationQueue.length > 0 ? (
          <div className="mt-6 grid gap-4">
            {moderationQueue.map((item) => (
              <article
                key={item.id}
                className="rounded-[1.5rem] border border-slate-800 bg-slate-950/60 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                        {item.purpose} • {item.propertyType}
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">
                      {item.area}, {item.city}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {item.flags.map((flag) => (
                      <span
                        key={flag}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          flag === "Manual review"
                            ? "bg-sky-500/10 text-sky-200"
                            : "bg-amber-500/10 text-amber-200"
                        }`}
                      >
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-4">
                  <div className="rounded-2xl bg-slate-900 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Price
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      PKR {formatPrice(item.price)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-900 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Images
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {item.images.length}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-900 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Status
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{item.status}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-900 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                      Created
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "Unknown"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
                  >
                    Approve Listing
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-rose-400/30 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/10"
                  >
                    Reject Listing
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                  >
                    Request Changes
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </SuperAdminShell>
  );
}
