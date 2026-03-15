"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

type UserProfile = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  profileImage?: string;
};

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Image read failed."));
    reader.readAsDataURL(file);
  });
}

export default function DashboardProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: "include",
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = (await response.json()) as { user?: UserProfile };
        const currentUser = data.user ?? null;
        setUser(currentUser);
        setName(currentUser?.name ?? "");
        setPhone(currentUser?.phone ?? "");
        setProfileImage(currentUser?.profileImage ?? "");
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, profileImage }),
      });

      const data = (await response.json()) as {
        message?: string;
        user?: UserProfile;
      };

      if (!response.ok) {
        setError(data.message ?? "Profile update failed.");
        return;
      }

      setUser(data.user ?? null);
      setMessage(data.message ?? "Profile updated successfully.");
    } catch {
      setError("Profile update failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <DashboardShell
        title="Profile"
        description="Please wait while your profile loads."
      >
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-600">Loading profile...</p>
        </div>
      </DashboardShell>
    );
  }

  if (!user) {
    return (
      <DashboardShell
        title="Profile"
        description="Please log in to manage your profile."
      >
        <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
          <Link
            href="/login?redirect=/dashboard/profile"
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
      title="Profile"
      description="Manage your profile here. You can update your name, phone number, and profile image, but your email will remain read-only."
    >
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Phone</label>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
            <input
              value={user.email ?? ""}
              disabled
              className="w-full cursor-not-allowed rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
            />
            <p className="mt-2 text-xs text-gray-500">Email cannot be changed.</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  return;
                }

                try {
                  setError("");
                  const imageDataUrl = await fileToDataUrl(file);
                  setProfileImage(imageDataUrl);
                } catch (uploadError) {
                  setError(
                    uploadError instanceof Error
                      ? uploadError.message
                      : "Image read failed."
                  );
                }
              }}
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 file:mr-3 file:rounded-xl file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:font-medium file:text-emerald-700"
            />
            <p className="mt-2 text-xs text-gray-500">
              Choose an image directly from your device.
            </p>
            {profileImage ? (
              <div className="mt-4 flex items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profileImage}
                  alt="Profile preview"
                  className="h-16 w-16 rounded-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setProfileImage("")}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Remove Image
                </button>
              </div>
            ) : null}
          </div>
        </div>

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
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </DashboardShell>
  );
}
