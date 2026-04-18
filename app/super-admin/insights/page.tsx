"use client";

import { useEffect, useMemo, useState } from "react";
import SuperAdminShell from "@/components/SuperAdminShell";
import {
  formatPrice,
  normalizeProperty,
  type PropertyRecord,
  type RawProperty,
} from "@/lib/superAdmin";
import { FiBarChart2, FiMapPin, FiPieChart, FiTrendingUp } from "react-icons/fi";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

export default function SuperAdminInsightsPage() {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<PropertyRecord[]>([]);

  useEffect(() => {
    async function loadInsights() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/properties`, {
          credentials: "include",
        });
        if (!response.ok) return;

        const data = (await response.json()) as { properties?: RawProperty[] };
        setProperties((data.properties ?? []).map(normalizeProperty));
      } finally {
        setLoading(false);
      }
    }

    loadInsights();
  }, []);

  const byType = useMemo(
    () =>
      [...properties.reduce<Map<string, number>>((acc, property) => {
        acc.set(property.propertyType, (acc.get(property.propertyType) ?? 0) + 1);
        return acc;
      }, new Map())].sort((a, b) => b[1] - a[1]),
    [properties]
  );

  const byCity = useMemo(
    () =>
      [...properties.reduce<Map<string, number>>((acc, property) => {
        acc.set(property.city, (acc.get(property.city) ?? 0) + 1);
        return acc;
      }, new Map())]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6),
    [properties]
  );

  const highValueListings = useMemo(
    () => [...properties].sort((a, b) => b.price - a.price).slice(0, 5),
    [properties]
  );

  const saleVolume = properties
    .filter((property) => property.purpose !== "rent")
    .reduce((sum, property) => sum + property.price, 0);

  const rentVolume = properties
    .filter((property) => property.purpose === "rent")
    .reduce((sum, property) => sum + property.price, 0);

  return (
    <SuperAdminShell
      title="Platform Insights"
      description="High-level inventory intelligence for the marketplace. Use this area to understand listing concentration, price distribution, and where admin attention is needed."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
            <FiTrendingUp size={15} />
            Sale Volume
          </p>
          <p className="mt-3 text-3xl font-bold text-white">PKR {formatPrice(saleVolume)}</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
            <FiBarChart2 size={15} />
            Rent Volume
          </p>
          <p className="mt-3 text-3xl font-bold text-white">PKR {formatPrice(rentVolume)}</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
            <FiPieChart size={15} />
            Property Types
          </p>
          <p className="mt-3 text-3xl font-bold text-white">{byType.length}</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
            <FiMapPin size={15} />
            Active Cities
          </p>
          <p className="mt-3 text-3xl font-bold text-white">{byCity.length}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold text-white">Inventory by Property Type</h2>
          <div className="mt-6 space-y-3">
            {loading ? (
              <p className="text-sm text-slate-400">Loading insights...</p>
            ) : byType.length > 0 ? (
              byType.map(([type, count]) => (
                <div
                  key={type}
                  className="flex items-center justify-between rounded-2xl bg-slate-950/60 px-4 py-3"
                >
                  <span className="text-sm font-medium text-slate-200">{type}</span>
                  <span className="text-sm font-semibold text-white">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No property type data available.</p>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-bold text-white">Top Cities</h2>
          <div className="mt-6 space-y-3">
            {loading ? (
              <p className="text-sm text-slate-400">Loading city breakdown...</p>
            ) : byCity.length > 0 ? (
              byCity.map(([city, count]) => (
                <div
                  key={city}
                  className="flex items-center justify-between rounded-2xl bg-slate-950/60 px-4 py-3"
                >
                  <span className="text-sm font-medium text-slate-200">{city}</span>
                  <span className="text-sm font-semibold text-white">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No city data available.</p>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-2xl font-bold text-white">Highest Value Listings</h2>
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {loading ? (
            <p className="text-sm text-slate-400">Loading premium inventory...</p>
          ) : highValueListings.length > 0 ? (
            highValueListings.map((property) => (
              <article
                key={property.id}
                className="rounded-[1.5rem] border border-slate-800 bg-slate-950/60 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  {property.purpose} • {property.propertyType}
                </p>
                <h3 className="mt-2 text-xl font-bold text-white">{property.title}</h3>
                <p className="mt-2 text-sm text-slate-400">
                  {property.area}, {property.city}
                </p>
                <p className="mt-4 text-2xl font-bold text-white">
                  PKR {formatPrice(property.price)}
                </p>
              </article>
            ))
          ) : (
            <p className="text-sm text-slate-400">No premium inventory available.</p>
          )}
        </div>
      </section>
    </SuperAdminShell>
  );
}
