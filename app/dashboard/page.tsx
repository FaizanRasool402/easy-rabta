"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";
import { propertyCardImage } from "@/lib/propertyImage";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

type AuthUser = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
};

type PropertyRecord = {
  id: string;
  title: string;
  purpose: string;
  propertyType: string;
  city: string;
  area: string;
  price: number;
  status: string;
  createdAt: string;
  image?: string;
  expiresAt?: string;
  totalViews: number;
  todayViews: number;
};

type RawProperty = {
  _id?: string | { $oid?: string; toString?: () => string };
  title?: string;
  purpose?: string;
  propertyType?: string;
  city?: string;
  area?: string;
  price?: string | number;
  status?: string;
  createdAt?: string;
  expiresAt?: string;
  images?: string[];
  totalViews?: number;
  dailyViews?: Array<{ date?: string; count?: number }>;
};

function extractId(id: RawProperty["_id"]) {
  if (!id) return "";
  if (typeof id === "string") return id;
  if (typeof id === "object" && "$oid" in id && typeof id.$oid === "string") {
    return id.$oid;
  }
  if (typeof id === "object" && typeof id.toString === "function") {
    const value = id.toString();
    return value === "[object Object]" ? "" : value;
  }
  return "";
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-PK").format(value);
}

function normalizeProperty(property: RawProperty): PropertyRecord {
  const today = new Date().toISOString().slice(0, 10);
  const todayViews =
    property.dailyViews?.find((item) => item.date === today)?.count ?? 0;

  return {
    id: extractId(property._id),
    title: property.title ?? "Untitled property",
    purpose: property.purpose ?? "sell",
    propertyType: property.propertyType ?? "house",
    city: property.city ?? "Unknown city",
    area: property.area ?? "Area not provided",
    price: Number(property.price ?? 0),
    status: property.status ?? "Active",
    createdAt: property.createdAt ?? "",
    image: propertyCardImage(property.images),
    expiresAt: property.expiresAt ?? "",
    totalViews: Number(property.totalViews ?? 0),
    todayViews,
  };
}

export default function DashboardPage() {
  const [authLoading, setAuthLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [authResponse, propertiesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/auth/me`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/api/properties/mine`, { credentials: "include" }),
        ]);

        if (!authResponse.ok) {
          setUser(null);
          return;
        }

        const authData = (await authResponse.json()) as { user?: AuthUser };
        setUser(authData.user ?? null);

        if (propertiesResponse.ok) {
          const data = (await propertiesResponse.json()) as {
            properties?: RawProperty[];
          };
          setProperties((data.properties ?? []).map(normalizeProperty));
        }
      } catch {
        setUser(null);
      } finally {
        setAuthLoading(false);
        setPropertiesLoading(false);
      }
    }

    loadDashboard();
  }, []);

  async function deleteProperty(propertyId: string) {
    const confirmed = window.confirm("Delete this property listing?");
    if (!confirmed) return;

    setDeletingId(propertyId);
    try {
      const response = await fetch(`${API_BASE_URL}/api/properties/${propertyId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setProperties((prev) => prev.filter((item) => item.id !== propertyId));
      }
    } finally {
      setDeletingId("");
    }
  }

  const greetingName = useMemo(() => {
    if (!user?.name) return "User";
    return user.name.split(" ")[0];
  }, [user?.name]);

  if (authLoading) {
    return (
      <DashboardShell
        title="Loading account"
        description="Please wait while your account data loads."
      >
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Loading dashboard...</p>
        </div>
      </DashboardShell>
    );
  }

  if (!user) {
    return (
      <DashboardShell
        title="Login Required"
        description="Please log in first to access your account."
      >
        <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
          <Link
            href="/login?redirect=/dashboard"
            className="inline-flex rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
          >
            Go to Login
          </Link>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title={`Welcome, ${greetingName}`}
      description="This is your personal account. Here you can view your posted properties and open any listing to see details or edit it."
      action={
        <Link
          href="/dashboard/add-property"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Add New Property
        </Link>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Properties</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{properties.length}</p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Views</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {properties.reduce((sum, property) => sum + property.totalViews, 0)}
          </p>
        </div>
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Today Views</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {properties.reduce((sum, property) => sum + property.todayViews, 0)}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Your Property Listings</h2>
            <p className="mt-1 text-sm text-gray-600">
              Select any property from the list to open its detail page.
            </p>
          </div>
          <Link
            href="/dashboard/add-property"
            className="hidden rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 sm:inline-flex"
          >
            Post Another
          </Link>
        </div>

        {propertiesLoading ? (
          <p className="mt-6 text-sm text-gray-600">Loading properties...</p>
        ) : null}

        {!propertiesLoading && properties.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900">No properties found</h3>
            <p className="mt-2 text-sm text-gray-600">
              You have not posted any property yet.
            </p>
          </div>
        ) : null}

        {!propertiesLoading && properties.length > 0 ? (
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {properties.map((property) => (
              <div
                key={property.id}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 transition hover:border-emerald-300 hover:shadow-sm"
              >
                <div className="grid min-h-[220px] md:grid-cols-[220px_minmax(0,1fr)]">
                  <div className="bg-gray-100">
                    {property.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={property.image}
                        alt={property.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full min-h-[220px] items-center justify-center text-sm font-medium text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between p-5">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
                          {property.purpose} • {property.propertyType}
                        </p>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          property.status === "expired"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {property.status}
                        </span>
                      </div>
                      <h3 className="mt-3 text-2xl font-bold text-gray-900">
                        {property.title}
                      </h3>
                      <p className="mt-3 text-base text-gray-600">
                        {property.area}, {property.city}
                      </p>
                      <p className="mt-5 text-3xl font-bold text-gray-900">
                        PKR {formatPrice(property.price)}
                      </p>
                    </div>
                    <p className="mt-4 text-sm text-gray-500">
                      {property.createdAt
                        ? `Posted on ${new Date(property.createdAt).toLocaleDateString()}`
                        : "Posting date not available"}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Views: {property.totalViews} total, {property.todayViews} today
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/dashboard/properties/${encodeURIComponent(property.id)}`}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteProperty(property.id)}
                        disabled={deletingId === property.id}
                        className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
                      >
                        {deletingId === property.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </DashboardShell>
  );
}
