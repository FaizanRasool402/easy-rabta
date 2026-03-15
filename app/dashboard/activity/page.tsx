"use client";

import Link from "next/link";
import DashboardShell from "@/components/DashboardShell";

const activityItems = [
  "Property creation and update logs will appear here.",
  "Profile changes and account actions will be tracked here.",
  "Future verification or approval updates can also appear here.",
];

export default function DashboardActivityPage() {
  return (
    <DashboardShell
      title="Account Activity"
      description="An overview of recent actions related to your account and listings."
      action={
        <Link
          href="/dashboard"
          className="inline-flex rounded-lg border border-emerald-200 px-5 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
        >
          View Properties
        </Link>
      }
    >
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="space-y-3">
          {activityItems.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-700"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}
