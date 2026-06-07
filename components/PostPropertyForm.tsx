"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { areasByCity, cities } from "@/components/Hero";
import { isSuperAdminUser } from "@/lib/auth";
import {
  isBedroomPropertyType,
  isCoveredAreaPropertyType,
  isPlotPropertyType,
  normalizePropertyType,
  propertyTypes,
  type PropertyType,
} from "@/lib/propertyTypes";

type FormState = {
  title: string;
  purpose: "sell" | "rent";
  propertyType: PropertyType;
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
const MAX_IMAGE_SIZE_MB = 3;
const MAX_VIDEO_SIZE_MB = 50;
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

function bytesToMb(bytes: number) {
  return bytes / (1024 * 1024);
}

function parseResponseMessage(rawText: string) {
  if (!rawText) return {};

  try {
    return JSON.parse(rawText) as { message?: string };
  } catch {
    return { message: rawText };
  }
}

type PostPropertyFormProps = {
  withinDashboard?: boolean;
};

export default function PostPropertyForm({
  withinDashboard = false,
}: PostPropertyFormProps) {
  const [form, setForm] = useState<FormState>({
    title: "",
    purpose: "sell",
    propertyType: "Houses",
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
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const imagePreviewUrls = useMemo(
    () => images.map((file) => URL.createObjectURL(file)),
    [images]
  );
  const videoPreviewUrls = useMemo(
    () => videos.map((file) => URL.createObjectURL(file)),
    [videos]
  );
  const isResidential = isBedroomPropertyType(form.propertyType);
  const isCommercial = isCoveredAreaPropertyType(form.propertyType);
  const isPlot = isPlotPropertyType(form.propertyType);
  const loginHref = withinDashboard
    ? "/login?redirect=/dashboard/add-property"
    : "/login?redirect=/post-property";

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
          user?: {
            name?: string;
            phone?: string;
            role?: "user" | "super_admin";
          };
        };

        setIsLoggedIn(true);
        setIsSuperAdmin(isSuperAdminUser(data.user));
        setForm((prev) => ({
          ...prev,
          contactName: data.user?.name ?? prev.contactName,
          contactPhone: data.user?.phone ?? prev.contactPhone,
        }));
      } catch {
        setIsLoggedIn(false);
        setIsSuperAdmin(false);
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

    const oversizedImage = selected.find(
      (file) => bytesToMb(file.size) > MAX_IMAGE_SIZE_MB
    );
    if (oversizedImage) {
      setError(
        `Each image must be ${MAX_IMAGE_SIZE_MB}MB or less. "${oversizedImage.name}" is too large.`
      );
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

    const oversizedVideo = selected.find(
      (file) => bytesToMb(file.size) > MAX_VIDEO_SIZE_MB
    );
    if (oversizedVideo) {
      setError(
        `Each video must be ${MAX_VIDEO_SIZE_MB}MB or less. "${oversizedVideo.name}" is too large.`
      );
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
    if (!acceptedPrivacy) {
      setError("Please accept the Privacy Policy before uploading your property.");
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
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("purpose", form.purpose);
      formData.append("propertyType", form.propertyType);
      formData.append("tag", form.tag);
      formData.append("city", form.city);
      formData.append("area", form.area);
      formData.append("address", form.address);
      formData.append("price", form.price);
      formData.append("bedrooms", form.bedrooms);
      formData.append("bathrooms", form.bathrooms);
      formData.append("areaSize", form.areaSize);
      formData.append("coveredArea", form.coveredArea);
      formData.append("plotSize", form.plotSize);
      formData.append("description", form.description);
      formData.append("contactName", form.contactName);
      formData.append("contactPhone", form.contactPhone);

      images.forEach((file) => formData.append("images", file));
      videos.forEach((file) => formData.append("videos", file));

      const response = await fetch(`${API_BASE_URL}/api/properties`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const rawText = await response.text();
      const data = parseResponseMessage(rawText);
      if (!response.ok) {
        setError(
          data.message ??
            `Property submit failed with status ${response.status}. Please try again.`
        );
        return;
      }

      setSuccess(data.message ?? "Property submitted successfully.");
      setForm({
        title: "",
        purpose: "sell",
        propertyType: "Houses",
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
      setAcceptedPrivacy(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Network error. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {authLoading ? (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
          <p className="text-sm text-gray-600">Checking login...</p>
        </div>
      ) : null}

      {!authLoading && !isLoggedIn ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-white p-5 sm:p-7">
          <h1 className="text-xl font-bold text-gray-900">Login Required</h1>
          <p className="mt-2 text-sm text-gray-600">
            Please log in first to post a property.
          </p>
          <Link
            href={loginHref}
            className="mt-4 inline-block rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
          >
            Go to Login
          </Link>
        </div>
      ) : null}

      {!authLoading && isLoggedIn && isSuperAdmin ? (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-white p-5 sm:p-7">
          <h1 className="text-xl font-bold text-gray-900">Super Admin Access</h1>
          <p className="mt-2 text-sm leading-7 text-gray-600">
            Super admin account ko sirf platform overview dashboard dikhaya jata hai.
            Property posting regular user accounts ke liye available hai.
          </p>
          <Link
            href="/super-admin"
            className="mt-4 inline-block rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
          >
            Open Super Admin Dashboard
          </Link>
        </div>
      ) : null}

      {!authLoading && isLoggedIn && !isSuperAdmin ? (
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
                    propertyType: normalizePropertyType(
                      value
                    ) as FormState["propertyType"],
                    bedrooms: isBedroomPropertyType(value) ? prev.bedrooms : "",
                    coveredArea: isCoveredAreaPropertyType(value)
                      ? prev.coveredArea
                      : "",
                    plotSize: isPlotPropertyType(value) ? prev.plotSize : "",
                  }))
                }
                options={propertyTypes.map((type) => ({ label: type, value: type }))}
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
                <p className="mb-2 text-xs text-gray-500">
                  Up to {MAX_IMAGES} images, {MAX_IMAGE_SIZE_MB}MB each.
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-emerald-700"
                />
                {imagePreviewUrls.length > 0 ? (
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
                ) : null}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Videos ({videos.length}/{MAX_VIDEOS})
                </label>
                <p className="mb-2 text-xs text-gray-500">
                  Up to {MAX_VIDEOS} videos, {MAX_VIDEO_SIZE_MB}MB each.
                </p>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={handleVideoChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-emerald-700"
                />
                {videoPreviewUrls.length > 0 ? (
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
                ) : null}
              </div>
            </div>

            {error ? (
              <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}
            {success ? (
              <p className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {success}
              </p>
            ) : null}

            <label className="mt-5 flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={acceptedPrivacy}
                onChange={(event) => setAcceptedPrivacy(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>
                I agree to the{" "}
                <Link
                  href="/privacy-policy"
                  target="_blank"
                  className="font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Privacy Policy
                </Link>{" "}
                before uploading this property.
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting || !acceptedPrivacy}
              className="mt-6 w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Submitting..." : "Submit Property"}
            </button>
          </form>
        </>
      ) : null}
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
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
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
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
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
