"use client";

import { useEffect, useMemo, useState } from "react";
import SuperAdminShell from "@/components/SuperAdminShell";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

type RawProperty = {
  _id?: string;
  title?: string;
  purpose?: string;
  propertyType?: string;
  city?: string;
  area?: string;
  price?: number | string;
  status?: string;
  createdAt?: string;
  images?: string[];
};

type ModerationItem = {
  id: string;
  title: string;
  purpose: string;
  propertyType: string;
  city: string;
  area: string;
  price: number;
  status: string;
  createdAt: string;
  images: string[];
};

function normalizeProperty(property: RawProperty, index: number): ModerationItem {
  return {
    id: property._id ?? `moderation-${index}`,
    title: property.title ?? "Untitled property",
    purpose: property.purpose ?? "sell",
    propertyType: property.propertyType ?? "Property",
    city: property.city ?? "Unknown city",
    area: property.area ?? "Area not provided",
    price: Number(property.price ?? 0),
    status: property.status ?? "active",
    createdAt: property.createdAt ?? "",
    images: property.images ?? [],
  };
}

function buildFlags(item: ModerationItem) {
  const flags: string[] = [];

  if (item.images.length === 0) flags.push("No image");
  if (!item.price) flags.push("Missing price");
  if (item.title === "Untitled property") flags.push("Weak title");
  if (!item.city || item.city === "Unknown city") flags.push("Missing city");
  if (flags.length === 0) flags.push("Manual review");

  return flags;
}

export default function SuperAdminModerationPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ModerationItem[]>([]);

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
        .map((item) => ({ ...item, flags: buildFlags(item) }))
        .sort((a, b) => b.flags.length - a.flags.length),
    [items]
  );

  return (
    <SuperAdminShell
      title="Listing Moderation"
      description="Operational review queue for property quality checks. Actions are frontend placeholders for now, but the queue is built from live listing records."
    >
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
                    {buildFlags(item).map((flag) => (
                      <span
                        key={flag}
                        className="rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-200"
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
                      PKR {new Intl.NumberFormat("en-PK").format(item.price)}
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
                    Approve UI
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-rose-400/30 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/10"
                  >
                    Reject UI
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                  >
                    Request Changes UI
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
