"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SuperAdminShell from "@/components/SuperAdminShell";
import { isSuperAdminUser } from "@/lib/auth";
import {
  buildPropertyFlags,
  formatPrice,
  normalizeProperty,
  reviewReason,
  type PropertyRecord,
  type RawProperty,
} from "@/lib/superAdmin";
import {
  FiArrowRight,
  FiBarChart2,
  FiClock,
  FiHome,
  FiMapPin,
  FiMessageCircle,
  FiShield,
  FiUsers,
} from "react-icons/fi";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

type AuthUser = {
  name?: string;
  email?: string;
  role?: "user" | "owner" | "dealer" | "super_admin";
};

export default function SuperAdminPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [properties, setProperties] = useState<PropertyRecord[]>([]);

  useEffect(() => {
    async function loadPortal() {
      try {
        const authResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: "include",
        });

        if (!authResponse.ok) {
          return;
        }

        const authData = (await authResponse.json()) as { user?: AuthUser };
        if (!isSuperAdminUser(authData.user)) {
          return;
        }

        setUser(authData.user ?? null);
        const propertyResponse = await fetch(`${API_BASE_URL}/api/properties`, {
          credentials: "include",
        });

        if (propertyResponse.ok) {
          const propertyData = (await propertyResponse.json()) as {
            properties?: RawProperty[];
          };
          setProperties((propertyData.properties ?? []).map(normalizeProperty));
        }
      } finally {
        setLoading(false);
      }
    }

    loadPortal();
  }, []);

  const firstName = useMemo(() => user?.name?.split(" ")[0] ?? "Admin", [user?.name]);

  const totalListings = properties.length;
  const rentCount = properties.filter((property) => property.purpose === "rent").length;
  const saleCount = properties.filter((property) => property.purpose !== "rent").length;
  const flaggedCount = properties.filter(
    (property) => buildPropertyFlags(property).length > 1
  ).length;
  const avgPrice =
    totalListings > 0
      ? Math.round(properties.reduce((sum, property) => sum + property.price, 0) / totalListings)
      : 0;
  const categoryMix = [...properties.reduce<Map<string, number>>((acc, property) => {
    acc.set(property.propertyType, (acc.get(property.propertyType) ?? 0) + 1);
    return acc;
  }, new Map())]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const topCities = [...properties.reduce<Map<string, number>>((acc, property) => {
    acc.set(property.city, (acc.get(property.city) ?? 0) + 1);
    return acc;
  }, new Map())]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const latestListings = [...properties]
    .sort((a, b) => {
      const first = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const second = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return second - first;
    })
    .slice(0, 6);

  return (
    <SuperAdminShell
      title={`Welcome back, ${firstName}`}
      description="Platform level overview for listings, moderation flow, and operational health. This portal is wired to current auth and listings data so you can extend it into a full admin control panel."
      action={
        <Link
          href="/super-admin/moderation"
          className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Open Moderation Queue
        </Link>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Total Listings</p>
          <p className="mt-3 text-4xl font-bold text-white">{totalListings}</p>
          <p className="mt-2 text-xs text-slate-400">Public listings fetched from API</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">For Sale</p>
          <p className="mt-3 text-4xl font-bold text-white">{saleCount}</p>
          <p className="mt-2 text-xs text-slate-400">Sell inventory currently visible</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">For Rent</p>
          <p className="mt-3 text-4xl font-bold text-white">{rentCount}</p>
          <p className="mt-2 text-xs text-slate-400">Rental supply across the marketplace</p>
        </div>
        <div className="rounded-[1.75rem] border border-amber-400/20 bg-amber-500/10 p-5">
          <p className="text-sm text-amber-100">Needs Review</p>
          <p className="mt-3 text-4xl font-bold text-white">{flaggedCount}</p>
          <p className="mt-2 text-xs text-amber-100/80">
            Derived from missing key listing data
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
            Average Ticket
          </p>
          <p className="mt-3 text-3xl font-bold text-white">PKR {formatPrice(avgPrice)}</p>
          <p className="mt-2 text-sm text-slate-400">
            Average asking price across all live inventory.
          </p>
        </section>
        <section className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
            <FiBarChart2 size={15} />
            Category Mix
          </p>
          <div className="mt-4 space-y-3">
            {categoryMix.length > 0 ? (
              categoryMix.map(([category, count]) => (
                <div key={category} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{category}</span>
                  <span className="font-semibold text-white">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No category data available.</p>
            )}
          </div>
        </section>
        <section className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
            <FiMessageCircle size={15} />
            Admin Snapshot
          </p>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-2xl bg-slate-950/60 px-4 py-3 text-slate-300">
              Moderation pressure is{" "}
              <span className="font-semibold text-white">
                {flaggedCount > 5 ? "high" : flaggedCount > 0 ? "moderate" : "stable"}
              </span>
              .
            </div>
            <div className="rounded-2xl bg-slate-950/60 px-4 py-3 text-slate-300">
              Highest inventory concentration remains in{" "}
              <span className="font-semibold text-white">
                {topCities[0]?.[0] ?? "unavailable"}
              </span>
              .
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_minmax(320px,0.7fr)]">
        <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
                Latest Listings
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                New inventory entering the platform
              </h2>
            </div>
            <Link
              href="/super-admin/moderation"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200"
            >
              Review all
              <FiArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <p className="mt-6 text-sm text-slate-400">Loading listings...</p>
          ) : null}

          {!loading && latestListings.length === 0 ? (
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-slate-700 bg-slate-950/60 p-6 text-center">
              <p className="text-sm text-slate-300">No listing data available yet.</p>
            </div>
          ) : null}

          {!loading && latestListings.length > 0 ? (
            <div className="mt-6 grid gap-4">
              {latestListings.map((property) => (
                <article
                  key={property.id}
                  className="rounded-[1.5rem] border border-slate-800 bg-slate-950/60 p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                        {property.purpose} • {property.propertyType}
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-white">{property.title}</h3>
                      <p className="mt-2 text-sm text-slate-400">
                        {property.area}, {property.city}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-900 px-4 py-3 text-right">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                        Price
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        PKR {formatPrice(property.price)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300">
                      {reviewReason(property)}
                    </span>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                      {property.status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </section>

        <div className="space-y-6">
          <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
              Coverage
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">Top cities by inventory</h2>

            <div className="mt-6 space-y-3">
              {topCities.length > 0 ? (
                topCities.map(([city, count]) => (
                  <div
                    key={city}
                    className="flex items-center justify-between rounded-2xl bg-slate-950/60 px-4 py-3"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-200">
                      <FiMapPin size={15} className="text-emerald-400" />
                      {city}
                    </span>
                    <span className="text-sm font-semibold text-white">{count}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400">No city breakdown available.</p>
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
              Admin Actions
            </p>
            <div className="mt-6 space-y-3">
              <Link
                href="/super-admin/moderation"
                className="flex items-center justify-between rounded-2xl bg-slate-950/60 px-4 py-4 transition hover:bg-slate-800"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-white">
                  <FiShield size={16} className="text-emerald-400" />
                  Listing moderation queue
                </span>
                <FiArrowRight size={16} className="text-slate-400" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center justify-between rounded-2xl bg-slate-950/60 px-4 py-4 transition hover:bg-slate-800"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-white">
                  <FiUsers size={16} className="text-emerald-400" />
                  Seller-facing dashboard
                </span>
                <FiArrowRight size={16} className="text-slate-400" />
              </Link>
              <Link
                href="/featured"
                className="flex items-center justify-between rounded-2xl bg-slate-950/60 px-4 py-4 transition hover:bg-slate-800"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-white">
                  <FiHome size={16} className="text-emerald-400" />
                  Review public inventory
                </span>
                <FiArrowRight size={16} className="text-slate-400" />
              </Link>
              <Link
                href="/super-admin/insights"
                className="flex items-center justify-between rounded-2xl bg-slate-950/60 px-4 py-4 transition hover:bg-slate-800"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-white">
                  <FiBarChart2 size={16} className="text-emerald-400" />
                  Platform insights
                </span>
                <FiArrowRight size={16} className="text-slate-400" />
              </Link>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
              Deployment Note
            </p>
            <div className="mt-4 rounded-[1.5rem] border border-sky-400/20 bg-sky-500/10 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-sky-200">
                <FiClock size={15} />
                Production hardening pending
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                This portal currently uses live auth and listing data, but role-based
                access, approvals, user management, and audit logs still need dedicated
                admin API endpoints.
              </p>
            </div>
          </section>
        </div>
      </div>
    </SuperAdminShell>
  );
}
