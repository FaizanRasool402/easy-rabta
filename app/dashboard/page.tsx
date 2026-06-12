"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  role?: "user" | "dealer" | "super_admin";
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
  dailyViews: Array<{ date: string; count: number }>;
  isPaidListing?: boolean;
  paymentStatus?: string;
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
  isPaidListing?: boolean;
  paymentStatus?: string;
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

async function responseMessage(response: Response) {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message;
  } catch {
    return undefined;
  }
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
    status: property.status ?? "active",
    createdAt: property.createdAt ?? "",
    image: propertyCardImage(property.images),
    expiresAt: property.expiresAt ?? "",
    totalViews: Number(property.totalViews ?? 0),
    todayViews,
    dailyViews: (property.dailyViews ?? [])
      .filter((item): item is { date: string; count: number } => Boolean(item.date))
      .map((item) => ({ date: item.date, count: Number(item.count ?? 0) })),
    isPaidListing: Boolean(property.isPaidListing),
    paymentStatus: property.paymentStatus ?? "unpaid",
  };
}

function dateKey(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

export default function DashboardPage() {
  const [authLoading, setAuthLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [deletingId, setDeletingId] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [dashboardError, setDashboardError] = useState("");
  const [propertiesError, setPropertiesError] = useState("");

  const loadDashboard = useCallback(async () => {
    setAuthLoading(true);
    setPropertiesLoading(true);
    setDashboardError("");
    setPropertiesError("");

    try {
      const authResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: "include",
      });

      if (!authResponse.ok) {
        const message = await responseMessage(authResponse);
        setUser(null);
        setProperties([]);
        setDashboardError(message ?? "Please log in first to access your dashboard.");
        return;
      }

      const authData = (await authResponse.json()) as { user?: AuthUser };
      if (!authData.user) {
        setUser(null);
        setProperties([]);
        setDashboardError("Login session could not be verified. Please log in again.");
        return;
      }

      setUser(authData.user);
      setAuthLoading(false);

      try {
        const propertiesResponse = await fetch(`${API_BASE_URL}/api/properties/mine`, {
          credentials: "include",
        });

        if (!propertiesResponse.ok) {
          const message = await responseMessage(propertiesResponse);
          setProperties([]);
          setPropertiesError(message ?? "Could not load your property listings.");
          return;
        }

        const data = (await propertiesResponse.json()) as {
          properties?: RawProperty[];
        };
        setProperties(
          (data.properties ?? [])
            .map(normalizeProperty)
            .filter((property) => property.id)
        );
      } catch (error) {
        setProperties([]);
        setPropertiesError(
          error instanceof Error
            ? error.message
            : "Network error while loading your property listings."
        );
      }
    } catch (error) {
      setUser(null);
      setProperties([]);
      setDashboardError(
        error instanceof Error
          ? error.message
          : "Dashboard could not connect to the backend."
      );
    } finally {
      setAuthLoading(false);
      setPropertiesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  async function deleteProperty(propertyId: string) {
    const confirmed = window.confirm("Delete this property listing?");
    if (!confirmed) return;

    setDeletingId(propertyId);
    setPropertiesError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/properties/${propertyId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setProperties((prev) => prev.filter((item) => item.id !== propertyId));
      } else {
        setPropertiesError(
          (await responseMessage(response)) ?? "Property delete failed."
        );
      }
    } catch (error) {
      setPropertiesError(
        error instanceof Error ? error.message : "Property delete failed."
      );
    } finally {
      setDeletingId("");
    }
  }

  async function markAsSold(propertyId: string) {
    const confirmed = window.confirm("Mark this listing as sold?");
    if (!confirmed) return;

    setUpdatingId(propertyId);
    setPropertiesError("");
    try {
      const formData = new FormData();
      formData.append("status", "sold");
      const response = await fetch(`${API_BASE_URL}/api/properties/${propertyId}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        setProperties((prev) =>
          prev.map((item) =>
            item.id === propertyId ? { ...item, status: "sold" } : item
          )
        );
      } else {
        setPropertiesError(
          (await responseMessage(response)) ?? "Failed to mark listing sold."
        );
      }
    } catch (error) {
      setPropertiesError(
        error instanceof Error ? error.message : "Failed to mark listing sold."
      );
    } finally {
      setUpdatingId("");
    }
  }

  const greetingName = useMemo(() => {
    if (!user?.name) return "User";
    return user.name.split(" ")[0];
  }, [user?.name]);
  const dashboardTitle =
    user?.role === "dealer" ? "Property Dealer Dashboard" : "Property Owner Dashboard";
  const activeProperties = properties.filter((property) => property.status !== "expired");
  const expiredProperties = properties.filter((property) => property.status === "expired");
  const dailyVisitorStats = Array.from({ length: 7 }, (_, index) => {
    const date = dateKey(6 - index);
    const views = properties.reduce(
      (sum, property) =>
        sum +
        (property.dailyViews.find((item) => item.date === date)?.count ?? 0),
      0
    );

    return {
      date,
      views,
      label: new Date(`${date}T00:00:00`).toLocaleDateString("en-PK", {
        day: "2-digit",
        month: "short",
      }),
    };
  });

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
        description={dashboardError || "Please log in first to access your account."}
      >
        <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
          {dashboardError ? (
            <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {dashboardError}
            </p>
          ) : null}
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
      title={dashboardTitle}
      description="This is your personal account. Here you can view your posted properties and open any listing to see details or edit it."
      action={
        <Link
          href="/dashboard/add-property"
          className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + Post Free Ad
        </Link>
      }
    >
      <p className="text-sm font-semibold text-gray-700">Welcome, {greetingName}</p>
      <div className="grid gap-4 md:grid-cols-4">
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
        <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Expired Listings</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{expiredProperties.length}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Daily Visitors</h2>
            <p className="mt-1 text-sm text-gray-600">
              Last 7 days visitor count across your listings.
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            {dailyVisitorStats.reduce((sum, item) => sum + item.views, 0)} visits
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-7">
          {dailyVisitorStats.map((item) => (
            <div
              key={item.date}
              className="rounded-2xl border border-gray-200 bg-gray-50 px-3 py-4 text-center"
            >
              <p className="text-xs font-semibold text-gray-500">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{item.views}</p>
            </div>
          ))}
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
            + Post Free Ad
          </Link>
        </div>

        {propertiesLoading ? (
          <p className="mt-6 text-sm text-gray-600">Loading properties...</p>
        ) : null}

        {propertiesError ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm font-medium text-amber-900">{propertiesError}</p>
            <button
              type="button"
              onClick={loadDashboard}
              className="mt-3 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
            >
              Retry Dashboard
            </button>
          </div>
        ) : null}

        {!propertiesLoading && !propertiesError && activeProperties.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900">No properties found</h3>
            <p className="mt-2 text-sm text-gray-600">
              You have no active property listings right now.
            </p>
          </div>
        ) : null}

        {!propertiesLoading && !propertiesError && activeProperties.length > 0 ? (
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {activeProperties.map((property) => (
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
                          property.status === "expired" || property.status === "sold"
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
                    <p className="mt-2 text-sm text-gray-500">
                      Paid: {property.isPaidListing ? "Verified" : property.paymentStatus}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Expires:{" "}
                      {property.expiresAt
                        ? new Date(property.expiresAt).toLocaleDateString()
                        : "30 days after posting"}
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
                      {property.status !== "sold" ? (
                        <button
                          type="button"
                          onClick={() => markAsSold(property.id)}
                          disabled={updatingId === property.id}
                          className="rounded-lg border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-60"
                        >
                          {updatingId === property.id ? "Updating..." : "Mark Sold"}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Expired Listings</h2>
            <p className="mt-1 text-sm text-gray-600">
              Listings older than the active period appear here.
            </p>
          </div>
          <span className="rounded-full bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700">
            {expiredProperties.length} expired
          </span>
        </div>

        {!propertiesLoading && !propertiesError && expiredProperties.length === 0 ? (
          <p className="mt-5 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
            No expired listings yet.
          </p>
        ) : null}

        {!propertiesLoading && !propertiesError && expiredProperties.length > 0 ? (
          <div className="mt-5 grid gap-3">
            {expiredProperties.map((property) => (
              <div
                key={property.id}
                className="flex flex-col gap-3 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{property.title}</p>
                  <p className="mt-1 text-sm text-gray-600">
                    {property.area}, {property.city} • PKR {formatPrice(property.price)}
                  </p>
                  <p className="mt-1 text-xs text-rose-700">
                    Expired:{" "}
                    {property.expiresAt
                      ? new Date(property.expiresAt).toLocaleDateString()
                      : "after listing period"}
                  </p>
                </div>
                <Link
                  href={`/dashboard/properties/${encodeURIComponent(property.id)}`}
                  className="inline-flex justify-center rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-white"
                >
                  View / Edit
                </Link>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </DashboardShell>
  );
}
