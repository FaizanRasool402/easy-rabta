"use client";

import { FormEvent, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

type PropertyInquiryButtonProps = {
  propertyId?: string;
  propertyTitle: string;
};

export default function PropertyInquiryButton({
  propertyId,
  propertyTitle,
}: PropertyInquiryButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  if (!propertyId) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setStatus("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          senderName: name,
          senderEmail: email,
          senderPhone: phone,
          message,
        }),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(data.message ?? "Failed to send inquiry.");
        return;
      }

      setStatus(data.message ?? "Inquiry sent successfully.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch {
      setError("Failed to send inquiry.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
      >
        {open ? "Close Inquiry" : "Send Inquiry"}
      </button>

      {open ? (
        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-2xl border border-gray-200 bg-white p-4"
        >
          <p className="text-sm font-semibold text-gray-900">
            Ask about: {propertyTitle}
          </p>
          <div className="mt-3 grid gap-3">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              required
              className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-emerald-500"
            />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email"
              required
              className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-emerald-500"
            />
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Your phone (optional)"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-emerald-500"
            />
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write your inquiry"
              required
              rows={4}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-emerald-500"
            />
          </div>

          {error ? (
            <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
          {status ? (
            <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {status}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-70"
          >
            {loading ? "Sending..." : "Submit Inquiry"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
