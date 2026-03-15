"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  FiGrid,
  FiHeart,
  FiLogOut,
  FiMessageSquare,
  FiPlusSquare,
  FiUser,
} from "react-icons/fi";

type DashboardShellProps = {
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

type AuthUser = {
  name?: string;
  email?: string;
  profileImage?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

const navItems = [
  { href: "/dashboard", label: "My Properties", icon: FiGrid },
  { href: "/dashboard/add-property", label: "Add Property", icon: FiPlusSquare },
  { href: "/dashboard/profile", label: "Profile", icon: FiUser },
  { href: "/dashboard/saved", label: "Saved Properties", icon: FiHeart },
  { href: "/dashboard/inquiries", label: "Property Inquiries", icon: FiMessageSquare },
];

function isActive(pathname: string, href: string) {
  if (
    href === "/dashboard" &&
    (pathname === "/dashboard" || pathname.startsWith("/dashboard/properties/"))
  ) {
    return true;
  }

  if (href === "/dashboard/add-property" && pathname === "/post-property") {
    return false;
  }

  return pathname === href;
}

export default function DashboardShell({
  title,
  description,
  action,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

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

        const data = (await response.json()) as { user?: AuthUser };
        setUser(data.user ?? null);
      } catch {
        setUser(null);
      }
    }

    loadUser();
  }, []);

  async function handleLogout() {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-56px)] bg-gray-50 py-8 sm:min-h-[calc(100vh-64px)] sm:py-12">
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:h-fit">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
                My Account
              </p>
              <div className="mt-5 rounded-3xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  {user?.profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.profileImage}
                      alt={user.name ?? "Profile"}
                      className="h-12 w-12 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-bold text-emerald-700">
                      {user?.name?.charAt(0).toUpperCase() ?? "U"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {user?.name ?? "User"}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user?.email ?? "No email"}
                    </p>
                  </div>
                </div>
              </div>

              <nav className="mt-5 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={`${item.href}-${item.label}`}
                    href={item.href}
                    className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive(pathname, item.href)
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon size={17} />
                      <span>{item.label}</span>
                    </span>
                  </Link>
                ))}
              </nav>

              <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-gray-900">Need help?</p>
                <p className="mt-2 text-xs leading-6 text-gray-600">
                  If you need help with your property listing or profile, contact
                  support.
                </p>
                <Link
                  href="/contact"
                  className="mt-3 inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Contact Support
                </Link>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 hover:text-red-600"
              >
                <FiLogOut size={16} />
                Logout
              </button>
            </aside>

            <div className="space-y-6">
              <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-600">
                    User Account
                  </p>
                  <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                    {title}
                  </h1>
                  <p className="mt-2 text-sm text-gray-600 sm:text-base">
                    {description}
                  </p>
                </div>
                {action}
              </div>

              {children}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
