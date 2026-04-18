"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { isSuperAdminUser, type AppAuthUser } from "@/lib/auth";
import {
  FiActivity,
  FiGrid,
  FiBarChart2,
  FiLogOut,
  FiSettings,
  FiShield,
} from "react-icons/fi";

type SuperAdminShellProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

const navItems = [
  { href: "/super-admin", label: "Overview", icon: FiShield },
  { href: "/super-admin/moderation", label: "Moderation", icon: FiGrid },
  { href: "/super-admin/insights", label: "Insights", icon: FiBarChart2 },
  { href: "/super-admin/settings", label: "Settings", icon: FiSettings },
];

function isActive(pathname: string, href: string) {
  return pathname === href;
}

export default function SuperAdminShell({
  title,
  description,
  action,
  children,
}: SuperAdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AppAuthUser | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: "include",
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = (await response.json()) as { user?: AppAuthUser };
        if (data.user && !isSuperAdminUser(data.user)) {
          router.replace("/dashboard");
          return;
        }
        setUser(data.user ?? null);
      } catch {
        setUser(null);
      }
    }

    loadUser();
  }, [router]);

  async function handleLogout() {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.push("/login?redirect=/super-admin");
      router.refresh();
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-56px)] bg-slate-950 py-8 text-slate-100 sm:min-h-[calc(100vh-64px)] sm:py-12">
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="rounded-[2rem] border border-slate-800 bg-slate-900 p-5 shadow-xl lg:sticky lg:top-24 lg:h-fit">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400">
                Super Admin
              </p>

              <div className="mt-5 rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-4">
                <div className="flex items-center gap-3">
                  {user?.profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.profileImage}
                      alt={user.name ?? "Profile"}
                      className="h-12 w-12 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-lg font-bold text-emerald-300">
                      {user?.name?.charAt(0).toUpperCase() ?? "A"}
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {user?.name ?? "Admin Preview"}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {user?.email ?? "No active session"}
                    </p>
                  </div>
                </div>
              </div>

              <nav className="mt-5 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive(pathname, item.href)
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-950/60 text-slate-200 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon size={17} />
                      <span>{item.label}</span>
                    </span>
                  </Link>
                ))}
              </nav>

              <div className="mt-5 rounded-[1.5rem] border border-amber-400/20 bg-amber-500/10 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-amber-200">
                  <FiActivity size={15} />
                  Frontend portal ready
                </p>
                <p className="mt-2 text-xs leading-6 text-slate-300">
                  Backend role checks, approval actions, and full audit APIs still need
                  to be wired for production-grade control.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 hover:text-white"
              >
                <FiLogOut size={16} />
                Logout
              </button>
            </aside>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6 shadow-xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-400">
                      Control Room
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                      {title}
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">
                      {description}
                    </p>
                  </div>
                  {action}
                </div>
              </div>

              {children}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
