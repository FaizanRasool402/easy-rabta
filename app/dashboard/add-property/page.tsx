"use client";

import DashboardShell from "@/components/DashboardShell";
import PostPropertyForm from "@/components/PostPropertyForm";

export default function DashboardAddPropertyPage() {
  return (
    <DashboardShell
      title="Add Property"
      description="Create a new property listing from your account. The sidebar will stay visible while you complete the form."
    >
      <PostPropertyForm withinDashboard />
    </DashboardShell>
  );
}
