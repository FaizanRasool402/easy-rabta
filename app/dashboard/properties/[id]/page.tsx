"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
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
};

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
    tag: property.tag ?? "featured",
    bedrooms: property.bedrooms ? String(property.bedrooms) : "",
    bathrooms: property.bathrooms ? String(property.bathrooms) : "",
    areaSize: property.areaSize ?? "",
    coveredArea: property.coveredArea ?? "",
    plotSize: property.plotSize ?? "",
    description: property.description ?? "",
    contactName: property.contactName ?? "",
    contactPhone: property.contactPhone ?? "",
  };
}

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const propertyId = params?.id;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [property, setProperty] = useState<PropertyDetail | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [activeImage, setActiveImage] = useState(0);

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
  const galleryImages = property?.images ?? [];
  const heroImage = galleryImages[activeImage] ?? galleryImages[0] ?? "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/properties/${propertyId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
      }

      setMessage(data.message ?? "Property updated successfully.");
    } catch {
      setError("Property update failed.");
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
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mediaUrl(heroImage)}
                      alt={property.title}
                      className="h-[260px] w-full object-cover sm:h-[380px] xl:h-[460px]"
                    />
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
                    <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                      Active
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
                  Update the required details and save your changes.
                </p>
              </div>
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
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                    required
                  />
                </Field>
                <Field label="Area">
                  <input
                    value={form.area}
                    onChange={(event) =>
                      setForm((prev) => (prev ? { ...prev, area: event.target.value } : prev))
                    }
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                  />
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
                  <input
                    value={form.tag}
                    onChange={(event) =>
                      setForm((prev) => (prev ? { ...prev, tag: event.target.value } : prev))
                    }
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
                  />
                </Field>
              </section>

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
