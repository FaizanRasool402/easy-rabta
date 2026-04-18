"use client";

import SuperAdminShell from "@/components/SuperAdminShell";

const setupItems = [
  {
    title: "Role-based access control",
    text: "Add backend checks so only super admins can access admin routes and actions.",
  },
  {
    title: "Approval endpoints",
    text: "Create approve, reject, and request-changes APIs for property moderation.",
  },
  {
    title: "User management",
    text: "Expose admin APIs for viewing users, blocking accounts, and reviewing seller history.",
  },
  {
    title: "Audit log",
    text: "Record every admin action with actor, timestamp, entity, and reason.",
  },
];

const connectedSources = [
  "Auth session via /api/auth/me",
  "Marketplace listings via /api/properties",
  "Shared navigation and current site design system",
];

export default function SuperAdminSettingsPage() {
  return (
    <SuperAdminShell
      title="Portal Settings"
      description="Implementation notes and the remaining backend tasks needed to turn this admin interface into a production-grade control panel."
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
            Build Checklist
          </p>
          <div className="mt-6 grid gap-4">
            {setupItems.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.5rem] border border-slate-800 bg-slate-950/60 p-5"
              >
                <h2 className="text-lg font-bold text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-300">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
              Connected Now
            </p>
            <div className="mt-6 space-y-3">
              {connectedSources.map((source) => (
                <div
                  key={source}
                  className="rounded-2xl bg-slate-950/60 px-4 py-3 text-sm font-medium text-slate-200"
                >
                  {source}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-400">
              Recommended Next Step
            </p>
            <div className="mt-4 rounded-[1.5rem] border border-emerald-400/20 bg-emerald-500/10 p-5">
              <p className="text-lg font-bold text-white">Wire backend admin APIs next.</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Frontend portal is in place. The biggest missing piece is secure server
                enforcement for admin roles and real moderation actions.
              </p>
            </div>
          </section>
        </div>
      </div>
    </SuperAdminShell>
  );
}
