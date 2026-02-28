"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { areasByCity, cities } from "@/components/Hero";

type FormState = {
  title: string;
  purpose: "sell" | "rent";
  propertyType: "house" | "apartment" | "plot" | "commercial";
  tag: string;
  city: string;
  area: string;
  address: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  areaSize: string;
  coveredArea: string;
  plotSize: string;
  description: string;
  contactName: string;
  contactPhone: string;
};

const MAX_IMAGES = 5;
const MAX_VIDEOS = 2;
const TAG_OPTIONS = [
  "featured",
  "verified",
  "premium",
  "hot-deal",
  "investor-pick",
  "new",
  "budget",
];
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

export default function PostPropertyPage() {
  const [form, setForm] = useState<FormState>({
    title: "",
    purpose: "sell",
    propertyType: "house",
    tag: "featured",
    city: "",
    area: "",
    address: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    areaSize: "",
    coveredArea: "",
    plotSize: "",
    description: "",
    contactName: "",
    contactPhone: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const imagePreviewUrls = useMemo(
    () => images.map((file) => URL.createObjectURL(file)),
    [images]
  );
  const videoPreviewUrls = useMemo(
    () => videos.map((file) => URL.createObjectURL(file)),
    [videos]
  );
  const isResidential =
    form.propertyType === "house" || form.propertyType === "apartment";
  const isCommercial = form.propertyType === "commercial";
  const isPlot = form.propertyType === "plot";

  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      videoPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviewUrls, videoPreviewUrls]);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: "include",
        });
        if (!response.ok) {
          setIsLoggedIn(false);
          return;
        }

        const data = (await response.json()) as {
          user?: { name?: string; phone?: string };
        };

        setIsLoggedIn(true);
        setForm((prev) => ({
          ...prev,
          contactName: data.user?.name ?? prev.contactName,
          contactPhone: data.user?.phone ?? prev.contactPhone,
        }));
      } catch {
        setIsLoggedIn(false);
      } finally {
        setAuthLoading(false);
      }
    }

    loadUser();
  }, []);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    if (selected.length === 0) return;

    const total = images.length + selected.length;
    if (total > MAX_IMAGES) {
      setError(`You can upload up to ${MAX_IMAGES} images.`);
      event.target.value = "";
      return;
    }

    setError("");
    setImages((prev) => [...prev, ...selected]);
    event.target.value = "";
  }

  function handleVideoChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    if (selected.length === 0) return;

    const total = videos.length + selected.length;
    if (total > MAX_VIDEOS) {
      setError(`You can upload up to ${MAX_VIDEOS} videos.`);
      event.target.value = "";
      return;
    }

    setError("");
    setVideos((prev) => [...prev, ...selected]);
    event.target.value = "";
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function removeVideo(index: number) {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess("");
    setError("");

    if (!form.title || !form.city || !form.price || !form.contactPhone) {
      setError("Title, city, price, and contact phone are required.");
      return;
    }
    if (isCommercial && !form.coveredArea) {
      setError("Covered area is required for commercial properties.");
      return;
    }
    if (isPlot && !form.plotSize) {
      setError("Plot size is required for plot properties.");
      return;
    }

    setSubmitting(true);
    try {
      const [imagePayload, videoPayload] = await Promise.all([
        Promise.all(
          images.map(async (file) => ({
            name: file.name,
            type: file.type,
            dataUrl: await fileToDataUrl(file),
          }))
        ),
        Promise.all(
          videos.map(async (file) => ({
            name: file.name,
            type: file.type,
            dataUrl: await fileToDataUrl(file),
          }))
        ),
      ]);

      const response = await fetch(`${API_BASE_URL}/api/properties`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          images: imagePayload,
          videos: videoPayload,
        }),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(data.message ?? "Property submit failed.");
        return;
      }

      setSuccess(data.message ?? "Property submitted successfully.");
      setForm({
        title: "",
        purpose: "sell",
        propertyType: "house",
        tag: "featured",
        city: "",
        area: "",
        address: "",
        price: "",
        bedrooms: "",
        bathrooms: "",
        areaSize: "",
        coveredArea: "",
        plotSize: "",
        description: "",
        contactName: "",
        contactPhone: "",
      });
      setImages([]);
      setVideos([]);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] bg-gray-50 py-8 sm:py-12">
        <section className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          {authLoading && (
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
              <p className="text-sm text-gray-600">Checking login...</p>
            </div>
          )}

          {!authLoading && !isLoggedIn && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-white p-5 sm:p-7">
              <h1 className="text-xl font-bold text-gray-900">Login Required</h1>
              <p className="mt-2 text-sm text-gray-600">
                Please log in first to post a property.
              </p>
              <Link
                href="/login"
                className="mt-4 inline-block rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
              >
                Go to Login
              </Link>
            </div>
          )}

          {!authLoading && isLoggedIn && (
            <>
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Post Property
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Add your property details. You can upload up to 5 images and 2 videos.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Title"
                value={form.title}
                onChange={(value) => updateField("title", value)}
                placeholder="3 bed luxury house in DHA"
                required
              />
              <Select
                label="Purpose"
                value={form.purpose}
                onChange={(value) =>
                  updateField("purpose", value as FormState["purpose"])
                }
                options={[
                  { label: "Sell", value: "sell" },
                  { label: "Rent", value: "rent" },
                ]}
              />
              <Select
                label="Property Type"
                value={form.propertyType}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    propertyType: value as FormState["propertyType"],
                    bedrooms:
                      value === "house" || value === "apartment"
                        ? prev.bedrooms
                        : "",
                    coveredArea: value === "commercial" ? prev.coveredArea : "",
                    plotSize: value === "plot" ? prev.plotSize : "",
                  }))
                }
                options={[
                  { label: "House", value: "house" },
                  { label: "Apartment", value: "apartment" },
                  { label: "Plot", value: "plot" },
                  { label: "Commercial", value: "commercial" },
                ]}
              />
              <Select
                label="Tag"
                value={form.tag}
                onChange={(value) => updateField("tag", value)}
                options={TAG_OPTIONS.map((item) => ({
                  label: item.replace("-", " "),
                  value: item,
                }))}
              />
              <Select
                label="City"
                value={form.city}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, city: value, area: "" }))
                }
                options={[
                  { label: "Select City", value: "" },
                  ...cities.map((cityName) => ({ label: cityName, value: cityName })),
                ]}
              />
              <Select
                label="Area"
                value={form.area}
                onChange={(value) => updateField("area", value)}
                disabled={!form.city}
                options={[
                  { label: "Select Area", value: "" },
                  ...((areasByCity[form.city] ?? []).map((areaName) => ({
                    label: areaName,
                    value: areaName,
                  })) as Array<{ label: string; value: string }>),
                ]}
              />
              <Input
                label="Address"
                value={form.address}
                onChange={(value) => updateField("address", value)}
                placeholder="Street 21, Sector B"
              />
              <Input
                label="Price (PKR)"
                value={form.price}
                onChange={(value) => updateField("price", value)}
                placeholder="25000000"
                required
              />
              <Input
                label="Area Size (Marla/Sqft)"
                value={form.areaSize}
                onChange={(value) => updateField("areaSize", value)}
                placeholder="10 Marla"
              />
              {isResidential ? (
                <Select
                  label="Bedrooms"
                  value={form.bedrooms}
                  onChange={(value) => updateField("bedrooms", value)}
                  options={[
                    { label: "Select Bedrooms", value: "" },
                    { label: "1", value: "1" },
                    { label: "2", value: "2" },
                    { label: "3", value: "3" },
                    { label: "4", value: "4" },
                    { label: "5+", value: "5" },
                  ]}
                />
              ) : null}
              {isResidential || isCommercial ? (
                <Input
                  label="Bathrooms"
                  value={form.bathrooms}
                  onChange={(value) => updateField("bathrooms", value)}
                  placeholder="2"
                />
              ) : null}
              {isCommercial ? (
                <Input
                  label="Covered Area (sqft)"
                  value={form.coveredArea}
                  onChange={(value) => updateField("coveredArea", value)}
                  placeholder="2800"
                  required
                />
              ) : null}
              {isPlot ? (
                <Input
                  label="Plot Size (Marla/Kanal)"
                  value={form.plotSize}
                  onChange={(value) => updateField("plotSize", value)}
                  placeholder="10 Marla"
                  required
                />
              ) : null}
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Write complete property details..."
                rows={5}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-emerald-500"
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input
                label="Contact Name"
                value={form.contactName}
                onChange={(value) => updateField("contactName", value)}
                placeholder="Farhan Ali"
              />
              <Input
                label="Contact Phone"
                value={form.contactPhone}
                onChange={(value) => updateField("contactPhone", value)}
                placeholder="03XX-XXXXXXX"
                required
              />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Images ({images.length}/{MAX_IMAGES})
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-emerald-700"
                />
                {imagePreviewUrls.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {imagePreviewUrls.map((url, index) => (
                      <div
                        key={url}
                        className="relative overflow-hidden rounded-lg border border-gray-200"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`Image ${index + 1}`}
                          className="h-24 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-1 top-1 rounded bg-black/70 px-2 py-0.5 text-xs text-white"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Videos ({videos.length}/{MAX_VIDEOS})
                </label>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleVideoChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-emerald-700"
                />
                {videoPreviewUrls.length > 0 && (
                  <div className="mt-3 space-y-3">
                    {videoPreviewUrls.map((url, index) => (
                      <div
                        key={url}
                        className="overflow-hidden rounded-lg border border-gray-200 p-2"
                      >
                        <video
                          controls
                          src={url}
                          className="h-32 w-full rounded object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeVideo(index)}
                          className="mt-2 rounded bg-black px-3 py-1 text-xs text-white"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            {success && (
              <p className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              {submitting ? "Submitting..." : "Submit Property"}
            </button>
          </form>
            </>
          )}
        </section>
      </main>
    </>
  );
}

type InputProps = {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
};

function Input({ label, value, placeholder, required, onChange }: InputProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-emerald-500"
      />
    </div>
  );
}

type SelectProps = {
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  disabled?: boolean;
  onChange: (value: string) => void;
};

function Select({ label, value, options, disabled, onChange }: SelectProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none transition focus:border-emerald-500 disabled:bg-gray-100 disabled:text-gray-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
