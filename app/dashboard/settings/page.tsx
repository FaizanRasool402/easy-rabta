"use client";

import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";

const settingsItems = [
  {
    title: "Account Information",
    text: "Update your name and phone from Profile. Your email will remain read-only.",
  },
  {
    title: "Property Management",
    text: "Open any property from the dashboard list and edit it on the detail page.",
  },
  {
    title: "Support",
    text: "Use Contact Support if you run into any technical issue.",
  },
];

export default function DashboardSettingsPage() {
  return (
    <DashboardShell
      title="Account Settings"
      description="Basic account and property management information is available here."
      action={
        <Link
          href="/dashboard/profile"
          className="inline-flex rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Open Profile Edit
        </Link>
      }
    >
      <div className="grid gap-4">
        {settingsItems.map((item) => (
          <div
            key={item.title}
            className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-bold text-gray-900">{item.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{item.text}</p>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
