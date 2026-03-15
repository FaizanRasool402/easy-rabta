"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardShell from "@/components/DashboardShell";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

type Inquiry = {
  _id: string;
  propertyTitle: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
  createdAt?: string;
};

export default function DashboardInquiriesPage() {
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    async function loadInquiries() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/inquiries/mine`, {
          credentials: "include",
        });
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { inquiries?: Inquiry[] };
        setInquiries(data.inquiries ?? []);
      } finally {
        setLoading(false);
      }
    }

    loadInquiries();
  }, []);

  return (
    <DashboardShell
      title="Property Inquiries"
      description="Inquiries from people interested in your properties will be managed here."
      action={
        <Link
          href="/contact"
          className="inline-flex rounded-lg border border-emerald-200 px-5 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
        >
          Contact Support
        </Link>
      }
    >
      {loading ? (
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-gray-600">Loading inquiries...</p>
        </div>
      ) : null}

      {!loading && inquiries.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">No inquiries yet</h2>
          <p className="mt-2 text-sm text-gray-600">
            Once someone sends an inquiry from a public listing, it will appear here.
          </p>
        </div>
      ) : null}

      {!loading && inquiries.length > 0 ? (
        <section className="grid gap-4">
          {inquiries.map((inquiry) => (
            <article
              key={inquiry._id}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                    Property Inquiry
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {inquiry.propertyTitle}
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    {inquiry.createdAt
                      ? `Received on ${new Date(inquiry.createdAt).toLocaleString()}`
                      : "Recently received"}
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
                  <p className="font-semibold text-gray-900">{inquiry.senderName}</p>
                  <p className="mt-1">{inquiry.senderEmail}</p>
                  {inquiry.senderPhone ? <p className="mt-1">{inquiry.senderPhone}</p> : null}
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                <p className="text-sm leading-7 text-gray-700">{inquiry.message}</p>
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </DashboardShell>
  );
}
