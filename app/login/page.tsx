"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Mode = "login" | "register";
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function toDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("File read failed"));
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const endpoint =
      mode === "login"
        ? `${API_BASE_URL}/api/auth/login`
        : `${API_BASE_URL}/api/auth/register`;
    const payload =
      mode === "login"
        ? { email, password }
        : { name, phone, email, password, profileImage };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message ?? "Request failed.");
        return;
      }

      setMessage(data.message ?? "Success");
      if (mode === "register") {
        setMode("login");
      } else {
        window.location.href = "/";
      }
    } catch {
      setError("Network error. Please check if the server is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-56px)] sm:min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-8 sm:py-14">
        <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === "login" ? "Login" : "Create account"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your details to access your EasyRabta account.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "register" && (
              <>
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="profileImage"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Profile Picture (Optional)
                  </label>
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) {
                        setProfileImage("");
                        return;
                      }
                      const data = await toDataUrl(file);
                      setProfileImage(data);
                    }}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-emerald-700"
                  />
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-emerald-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-emerald-500"
              />
            </div>

            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            {message && (
              <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 py-2.5 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Login"
                  : "Register"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            {mode === "login" ? "Need a new account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
                setMessage("");
              }}
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              {mode === "login" ? "Register" : "Login"}
            </button>
          </div>

          <div className="mt-5 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
