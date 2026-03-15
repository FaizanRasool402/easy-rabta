"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiHeart } from "react-icons/fi";
import DashboardShell from "@/components/DashboardShell";
import {
  getSavedProperties,
  removeSavedProperty,
  type SavedProperty,
} from "@/components/savedProperties";

function formatPrice(value: number, purpose: "buy" | "rent") {
  const amount = new Intl.NumberFormat("en-PK").format(value);
  return purpose === "rent" ? `PKR ${amount} / month` : `PKR ${amount}`;
}

export default function DashboardSavedPage() {
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>(() =>
    getSavedProperties()
  );

  function handleRemove(id: string) {
    removeSavedProperty(id);
    setSavedProperties((prev) => prev.filter((property) => property.id !== id));
  }

  return (
    <DashboardShell
      title="Saved Properties"
      description="Your saved listings are shown here so you can revisit them anytime."
      action={
        <Link
          href="/buy"
          className="inline-flex rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Explore Properties
        </Link>
      }
    >
      {savedProperties.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">No saved properties yet</h2>
          <p className="mt-2 text-sm text-gray-600">
            Save listings from the Buy or Rent pages and they will appear here.
          </p>
        </div>
      ) : (
        <section className="grid gap-5 xl:grid-cols-2">
          {savedProperties.map((property) => (
            <article
              key={property.id}
              className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="grid md:grid-cols-[240px_minmax(0,1fr)]">
                <div className="relative">
                  <Image
                    src={property.image}
                    alt={property.title}
                    width={720}
                    height={480}
                    className="h-full min-h-[220px] w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                    {property.purpose}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {property.title}
                      </h2>
                      <p className="mt-2 text-base text-gray-600">
                        {property.city}, {property.area}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(property.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                    >
                      <FiHeart size={14} />
                      Remove
                    </button>
                  </div>

                  <p className="mt-5 text-3xl font-bold text-gray-900">
                    {formatPrice(property.price, property.purpose)}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-gray-700">
                    <span className="rounded-full bg-gray-100 px-3 py-1.5">
                      {property.propertyType}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1.5">
                      {property.size}
                    </span>
                    {property.bedrooms > 0 ? (
                      <span className="rounded-full bg-gray-100 px-3 py-1.5">
                        {property.bedrooms} Beds
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={property.purpose === "buy" ? "/buy" : "/rent"}
                      className="inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      View in {property.purpose === "buy" ? "Buy" : "Rent"}
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleRemove(property.id)}
                      className="inline-flex rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </DashboardShell>
  );
}
