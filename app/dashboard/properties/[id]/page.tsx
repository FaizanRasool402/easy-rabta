"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import { areasByCity, cities } from "@/components/Hero";
import {
  isBedroomPropertyType,
  isCoveredAreaPropertyType,
  isPlotPropertyType,
  normalizePropertyType,
  propertyTypes,
  type PropertyType,
} from "@/lib/propertyTypes";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

type PropertyDetail = {
  _id: string;
  title: string;
  purpose: "sell" | "rent";
  propertyType: PropertyType | string;
  city: string;
  area: string;
  address: string;
  price: number;
  tag: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSize?: string;
  coveredArea?: string;
  plotSize?: string;
  description?: string;
  contactName: string;
  contactPhone: string;
  images?: string[];
  videos?: string[];
  status?: string;
  expiresAt?: string;
  totalViews?: number;
  dailyViews?: Array<{ date?: string; count?: number }>;
  isPaidListing?: boolean;
  paymentStatus?: string;
  paymentReference?: string;
  paymentProof?: string;
  monthlyEditCount?: number;
  monthlyEditLimit?: number;
  remainingMonthlyEdits?: number;
  createdAt?: string;
  updatedAt?: string;
};

type FormState = {
  title: string;
  purpose: "sell" | "rent";
  propertyType: PropertyType;
  city: string;
  area: string;
  address: string;
  price: string;
  tag: string;
  bedrooms: string;
  bathrooms: string;
  areaSize: string;
  coveredArea: string;
  plotSize: string;
  description: string;
  contactName: string;
  contactPhone: string;
  paymentReference: string;
};

const PAID_TAGS = ["premium", "hot-deal", "investor-pick"];
const TAG_OPTIONS = [
  "featured",
  "premium",
  "hot-deal",
  "investor-pick",
  "new",
  "budget",
];

function mediaUrl(path?: string) {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${API_BASE_URL}${path}`;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-PK").format(value);
}

function toFormState(property: PropertyDetail): FormState {
  return {
    title: property.title ?? "",
    purpose: property.purpose ?? "sell",
    propertyType: normalizePropertyType(property.propertyType),
    city: property.city ?? "",
    area: property.area ?? "",
    address: property.address ?? "",
    price: String(property.price ?? ""),
    tag: TAG_OPTIONS.includes(property.tag) ? property.tag : "featured",
    bedrooms: property.bedrooms ? String(property.bedrooms) : "",
    bathrooms: property.bathrooms ? String(property.bathrooms) : "",
    areaSize: property.areaSize ?? "",
    coveredArea: property.coveredArea ?? "",
    plotSize: property.plotSize ?? "",
    description: property.description ?? "",
    contactName: property.contactName ?? "",
    contactPhone: property.contactPhone ?? "",
    paymentReference: property.paymentReference ?? "",
  };
}

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const propertyId = params?.id;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadProperty() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/properties/${propertyId}`, {
          credentials: "include",
        });

        const data = (await response.json()) as {
          message?: string;
          property?: PropertyDetail;
        };

        if (!response.ok) {
          setError(data.message ?? "Failed to load property.");
          return;
        }

        if (!data.property) {
          setError("Property not found.");
          return;
        }

        setProperty(data.property);
        setForm(toFormState(data.property));
        setActiveImage(0);
      } catch {
        setError("Failed to load property.");
      } finally {
        setLoading(false);
      }
    }

    if (propertyId) {
      loadProperty();
    }
  }, [propertyId]);

  const isResidential = useMemo(() => {
    return isBedroomPropertyType(form?.propertyType ?? "");
  }, [form?.propertyType]);
  const isCommercial = isCoveredAreaPropertyType(form?.propertyType ?? "");
  const isPlot = isPlotPropertyType(form?.propertyType ?? "");
  const isPaidTag = form ? PAID_TAGS.includes(form.tag) : false;
  const galleryImages = property?.images ?? [];
  const heroImage = galleryImages[activeImage] ?? galleryImages[0] ?? "";
  const monthlyEditLimit = property?.monthlyEditLimit ?? 3;
  const remainingMonthlyEdits = property?.remainingMonthlyEdits ?? monthlyEditLimit;
  const today = new Date().toISOString().slice(0, 10);
  const todayViews =
    property?.dailyViews?.find((item) => item.date === today)?.count ?? 0;

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    if (!selected.length || !property) return;

    if ((property.images?.length ?? 0) + newImages.length + selected.length > 5) {
      setError("Max 5 images allowed.");
      event.target.value = "";
      return;
    }

    setError("");
    setNewImages((prev) => [...prev, ...selected]);
    event.target.value = "";
  }

  function removeExistingImage(index: number) {
    setProperty((prev) =>
      prev
        ? {
            ...prev,
            images: (prev.images ?? []).filter((_, itemIndex) => itemIndex !== index),
          }
        : prev
    );
    setActiveImage(0);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("existingImages", JSON.stringify(property?.images ?? []));
      formData.append("existingVideos", JSON.stringify(property?.videos ?? []));
      newImages.forEach((file) => formData.append("images", file));
      if (paymentProof) {
        formData.append("paymentProof", paymentProof);
      }

      const response = await fetch(`${API_BASE_URL}/api/properties/${propertyId}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const data = (await response.json()) as {
        message?: string;
        property?: PropertyDetail;
      };

      if (!response.ok) {
        setError(data.message ?? "Property update failed.");
        return;
      }

      if (data.property) {
        setProperty(data.property);
        setForm(toFormState(data.property));
        setNewImages([]);
        setPaymentProof(null);
      }

      setMessage(data.message ?? "Property updated successfully.");
    } catch {
      setError("Property update failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm("Delete this property listing?");
    if (!confirmed) return;

    setDeleting(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/properties/${propertyId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(data.message ?? "Property delete failed.");
        return;
      }
      router.push("/dashboard");
    } catch {
      setError("Property delete failed.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleMarkSold() {
    const confirmed = window.confirm("Mark this listing as sold?");
    if (!confirmed || !form) return;

    setSaving(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("status", "sold");
      const response = await fetch(`${API_BASE_URL}/api/properties/${propertyId}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });
      const data = (await response.json()) as {
        message?: string;
        property?: PropertyDetail;
      };
      if (!response.ok) {
        setError(data.message ?? "Failed to mark listing sold.");
        return;
      }
      if (data.property) {
        setProperty(data.property);
        setForm(toFormState(data.property));
      }
      setMessage("Listing marked as sold.");
    } catch {
      setError("Failed to mark listing sold.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardShell
      title="Listing Detail"
      description="This page shows the full details of your property listing. You can also edit the listing using the form below."
      action={
        <Link
          href="/dashboard"
          className="inline-flex rounded-lg border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
        >
          Back to Dashboard
        </Link>
      }
    >
      {loading ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Loading property...</p>
        </div>
      ) : null}

      {!loading && error && !property ? (
        <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : null}

      {!loading && property && form ? (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="grid gap-0 xl:grid-cols-[minmax(0,1.3fr)_380px]">
              <div className="border-b border-gray-200 xl:border-b-0 xl:border-r">
                <div className="relative bg-gray-100">
                  {heroImage ? (
                    <a
                      href={mediaUrl(heroImage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block cursor-zoom-in"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={mediaUrl(heroImage)}
                        alt={property.title}
                        className="h-[260px] w-full object-cover sm:h-[380px] xl:h-[460px]"
                      />
                    </a>
                  ) : (
                    <div className="flex h-[260px] items-center justify-center text-sm font-medium text-gray-400 sm:h-[380px] xl:h-[460px]">
                      No image available
                    </div>
                  )}

                  <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 backdrop-blur">
                    {property.purpose} • {property.propertyType}
                  </div>
                </div>

                {galleryImages.length > 1 ? (
                  <div className="grid grid-cols-4 gap-3 p-4 sm:grid-cols-5">
                    {galleryImages.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setActiveImage(index)}
                        className={`overflow-hidden rounded-2xl border-2 transition ${
                          activeImage === index
                            ? "border-emerald-500"
                            : "border-transparent hover:border-emerald-200"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={mediaUrl(image)}
                          alt={`${property.title} ${index + 1}`}
                          className="h-20 w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col justify-between p-6">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
                        Listing Summary
                      </p>
                      <h2 className="mt-3 text-3xl font-bold text-gray-900">
                        {property.title}
                      </h2>
                    </div>
                    <span className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      property.status === "expired"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {property.status ?? "active"}
                    </span>
                  </div>

                  <p className="mt-4 text-base leading-8 text-gray-600">
                    {property.area}, {property.city}
                    {property.address ? `, ${property.address}` : ""}
                  </p>

                  <p className="mt-5 text-4xl font-bold tracking-tight text-gray-900">
                    PKR {formatPrice(Number(property.price ?? 0))}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <InfoCard
                      label="Bedrooms"
                      value={property.bedrooms ? String(property.bedrooms) : "N/A"}
                    />
                    <InfoCard
                      label="Bathrooms"
                      value={property.bathrooms ? String(property.bathrooms) : "N/A"}
                    />
                    <InfoCard
                      label="Area Size"
                      value={property.areaSize || property.plotSize || "Not specified"}
                    />
                    <InfoCard
                      label="Tag"
                      value={property.tag || "Standard"}
                    />
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-gray-50 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <MetaRow
                      label="Created"
                      value={
                        property.createdAt
                          ? new Date(property.createdAt).toLocaleDateString()
                          : "Not available"
                      }
                    />
                    <MetaRow
                      label="Updated"
                      value={
                        property.updatedAt
                          ? new Date(property.updatedAt).toLocaleDateString()
                          : "Not available"
                      }
                    />
                    <MetaRow
                      label="Contact Name"
                      value={property.contactName || "Not available"}
                    />
                    <MetaRow
                      label="Contact Phone"
                      value={property.contactPhone || "Not available"}
                    />
                    <MetaRow label="Total Views" value={String(property.totalViews ?? 0)} />
                    <MetaRow label="Today Views" value={String(todayViews)} />
                    <MetaRow
                      label="Paid Listing"
                      value={
                        property.isPaidListing
                          ? "Verified"
                          : property.paymentStatus ?? "unpaid"
                      }
                    />
                    <MetaRow
                      label="Monthly Edits Left"
                      value={`${remainingMonthlyEdits}/${monthlyEditLimit}`}
                    />
                    <MetaRow
                      label="Expires"
                      value={
                        property.expiresAt
                          ? new Date(property.expiresAt).toLocaleDateString()
                          : "30 days after posting"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {(property.description || property.videos?.length) && (
              <div className="border-t border-gray-200 p-6">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                  <div className="rounded-3xl bg-gray-50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">
                      Description
                    </p>
                    <p className="mt-3 text-base leading-8 text-gray-700">
                      {property.description || "No description added for this listing."}
                    </p>
                  </div>

                  {property.videos?.length ? (
                    <div className="space-y-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600">
                        Property Videos
                      </p>
                      {property.videos.map((video) => (
                        <video
                          key={video}
                          controls
                          src={mediaUrl(video)}
                          className="w-full rounded-2xl border border-gray-200 bg-black"
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Edit Property</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Update the required details and save your changes. You can edit this listing {remainingMonthlyEdits} more time(s) this month.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete Property"}
              </button>
              {property.status !== "sold" ? (
                <button
                  type="button"
                  onClick={handleMarkSold}
                  disabled={saving}
                  className="rounded-lg border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-60"
                >
                  Mark as Sold
                </button>
              ) : null}
            </div>

            <div className="mt-6 grid gap-6">
              <section className="grid gap-4 md:grid-cols-2">
                <Field label="Title">
                  <input
                    value={form.title}
                    onChange={(event) =>
                      setForm((prev) => (prev ? { ...prev, title: event.target.value } : prev))
                    }
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                    required
                  />
                </Field>
                <Field label="Price (PKR)">
                  <input
                    value={form.price}
                    onChange={(event) =>
                      setForm((prev) => (prev ? { ...prev, price: event.target.value } : prev))
                    }
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                    required
                  />
                </Field>
                <Field label="Purpose">
                  <select
                    value={form.purpose}
                    onChange={(event) =>
                      setForm((prev) =>
                        prev ? { ...prev, purpose: event.target.value as FormState["purpose"] } : prev
                      )
                    }
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
                  >
                    <option value="sell">Sell</option>
                    <option value="rent">Rent</option>
                  </select>
                </Field>
                <Field label="Property Type">
                  <select
                    value={form.propertyType}
                    onChange={(event) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              propertyType: normalizePropertyType(
                                event.target.value
                              ),
                            }
                          : prev
                      )
                    }
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
                  >
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </Field>
              </section>

              <section className="grid gap-4 md:grid-cols-2">
                <Field label="City">
                  <input
                    value={form.city}
                    onChange={(event) =>
                      setForm((prev) => (prev ? { ...prev, city: event.target.value } : prev))
                    }
                    list="edit-city-options"
                    placeholder="Any city"
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                    required
                  />
                  <datalist id="edit-city-options">
                    {cities.map((cityName) => (
                      <option key={cityName} value={cityName} />
                    ))}
                    <option value="Other" />
                  </datalist>
                </Field>
                <Field label="Neighborhood / Area">
                  <input
                    value={form.area}
                    onChange={(event) =>
                      setForm((prev) => (prev ? { ...prev, area: event.target.value } : prev))
                    }
                    list="edit-area-options"
                    placeholder="Any neighborhood or area"
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                  />
                  <datalist id="edit-area-options">
                    {(areasByCity[form.city] ?? []).map((areaName) => (
                      <option key={areaName} value={areaName} />
                    ))}
                    <option value="Other" />
                  </datalist>
                </Field>
                <Field label="Address">
                  <input
                    value={form.address}
                    onChange={(event) =>
                      setForm((prev) => (prev ? { ...prev, address: event.target.value } : prev))
                    }
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                  />
                </Field>
                <Field label="Tag">
                  <select
                    value={form.tag}
                    onChange={(event) =>
                      setForm((prev) => (prev ? { ...prev, tag: event.target.value } : prev))
                    }
                    className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-emerald-500"
                  >
                    {TAG_OPTIONS.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag.replace("-", " ")}
                      </option>
                    ))}
                  </select>
                </Field>
              </section>

              {isPaidTag ? (
                <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-900">
                    Paid Listing Payment
                  </p>
                  <p className="mt-1 text-sm leading-6 text-amber-800">
                    Add your bank transfer reference and proof. Admin will verify
                    payment before this listing appears as paid on top.
                  </p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <Field label="Payment Reference / Transaction ID">
                      <input
                        value={form.paymentReference}
                        onChange={(event) =>
                          setForm((prev) =>
                            prev
                              ? { ...prev, paymentReference: event.target.value }
                              : prev
                          )
                        }
                        className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                      />
                    </Field>
                    <Field label="Payment Proof Screenshot">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          setPaymentProof(event.target.files?.[0] ?? null)
                        }
                        className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 file:mr-3 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:font-medium file:text-emerald-700"
                      />
                      {property.paymentProof ? (
                        <a
                          href={mediaUrl(property.paymentProof)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex text-sm font-semibold text-emerald-700 underline"
                        >
                          View current proof
                        </a>
                      ) : null}
                    </Field>
                  </div>
                </section>
              ) : null}

              <section className="grid gap-4 md:grid-cols-2">
                <Field label="Area Size">
                  <input
                    value={form.areaSize}
                    onChange={(event) =>
                      setForm((prev) => (prev ? { ...prev, areaSize: event.target.value } : prev))
                    }
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                  />
                </Field>
                {isResidential ? (
                  <Field label="Bedrooms">
                    <input
                      value={form.bedrooms}
                      onChange={(event) =>
                        setForm((prev) =>
                          prev ? { ...prev, bedrooms: event.target.value } : prev
                        )
                      }
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                    />
                  </Field>
                ) : (
                  <div />
                )}
                {isResidential || isCommercial ? (
                  <Field label="Bathrooms">
                    <input
                      value={form.bathrooms}
                      onChange={(event) =>
                        setForm((prev) =>
                          prev ? { ...prev, bathrooms: event.target.value } : prev
                        )
                      }
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                    />
                  </Field>
                ) : null}
                {isCommercial ? (
                  <Field label="Covered Area">
                    <input
                      value={form.coveredArea}
                      onChange={(event) =>
                        setForm((prev) =>
                          prev ? { ...prev, coveredArea: event.target.value } : prev
                        )
                      }
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                    />
                  </Field>
                ) : null}
                {isPlot ? (
                  <Field label="Plot Size">
                    <input
                      value={form.plotSize}
                      onChange={(event) =>
                        setForm((prev) =>
                          prev ? { ...prev, plotSize: event.target.value } : prev
                        )
                      }
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                    />
                  </Field>
                ) : null}
              </section>

              <section className="grid gap-4 md:grid-cols-2">
                <Field label="Contact Name">
                  <input
                    value={form.contactName}
                    onChange={(event) =>
                      setForm((prev) =>
                        prev ? { ...prev, contactName: event.target.value } : prev
                      )
                    }
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                  />
                </Field>
                <Field label="Contact Phone">
                  <input
                    value={form.contactPhone}
                    onChange={(event) =>
                      setForm((prev) =>
                        prev ? { ...prev, contactPhone: event.target.value } : prev
                      )
                    }
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                    required
                  />
                </Field>
              </section>
            </div>

            <Field label="Description" className="mt-4">
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((prev) =>
                    prev ? { ...prev, description: event.target.value } : prev
                  )
                }
                rows={5}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
              />
            </Field>

            <Field label="Images" className="mt-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {(property.images ?? []).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="overflow-hidden rounded-2xl border border-gray-200"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mediaUrl(image)}
                      alt={`${property.title} ${index + 1}`}
                      className="h-28 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="w-full bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="mt-3 w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 file:mr-3 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:font-medium file:text-emerald-700"
              />
              {newImages.length > 0 ? (
                <p className="mt-2 text-sm text-gray-600">
                  {newImages.length} new image(s) selected.
                </p>
              ) : null}
            </Field>

            {error ? (
              <p className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            {message ? (
              <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={saving}
              className="mt-6 inline-flex rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      ) : null}
    </DashboardShell>
  );
}

type InfoCardProps = {
  label: string;
  value: string;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-gray-900">{value}</p>
    </div>
  );
}

type MetaRowProps = {
  label: string;
  value: string;
};

function MetaRow({ label, value }: MetaRowProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

type FieldProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

function Field({ label, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}
