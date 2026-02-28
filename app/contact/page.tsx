"use client";

import { FormEvent, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type ContactForm = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function updateField<K extends keyof ContactForm>(key: K, value: ContactForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess("");
    setError("");

    if (!form.name || !form.email || !form.subject || !form.message) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(data.message ?? "Contact request failed.");
        return;
      }

      setSuccess(
        data.message ?? "Message sent successfully. Our team will contact you shortly."
      );
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10 sm:py-14">
        <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
            <p className="mt-3 text-sm text-gray-600 sm:text-base">
              For any questions related to buying, renting, or listing properties,
              send us a message.
            </p>

            <div className="mt-6 space-y-4 text-sm sm:text-base">
              <InfoRow label="Email" value="info@easyrabta.pk" />
              <InfoRow label="Phone" value="+92 300 1234567" />
              <InfoRow
                label="Location"
                value="Multiple Cities Across Pakistan"
              />
              <InfoRow label="Support Hours" value="Mon - Sat, 10:00 AM - 7:00 PM" />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 lg:col-span-3">
            <h2 className="text-xl font-bold text-gray-900">Send Message</h2>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name"
                  required
                  value={form.name}
                  placeholder="Syed Farhan Ali"
                  onChange={(value) => updateField("name", value)}
                />
                <Input
                  label="Email"
                  required
                  type="email"
                  value={form.email}
                  placeholder="you@example.com"
                  onChange={(value) => updateField("email", value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Phone (Optional)"
                  value={form.phone}
                  placeholder="+92 3XX XXXXXXX"
                  onChange={(value) => updateField("phone", value)}
                />
                <Input
                  label="Subject"
                  required
                  value={form.subject}
                  placeholder="Need help posting a property"
                  onChange={(value) => updateField("subject", value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  rows={6}
                  placeholder="Write your message..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-emerald-500"
                />
              </div>

              {error && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}
              {success && (
                <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

type InputProps = {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  onChange: (value: string) => void;
};

function Input({
  label,
  value,
  placeholder,
  required,
  type = "text",
  onChange,
}: InputProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none transition focus:border-emerald-500"
      />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 font-medium text-gray-800">{value}</p>
    </div>
  );
}
