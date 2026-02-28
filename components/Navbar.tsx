"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiChevronDown, FiMenu, FiX } from "react-icons/fi";

const navLinks = [
  { href: "/buy", label: "Buy" },
  { href: "/rent", label: "Rent" },
  { href: "/featured", label: "Featured" },
  { href: "/contact", label: "Contact" },
];

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
};

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    async function getCurrentUser() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: "include",
        });

        if (!response.ok) {
          setAuthUser(null);
          return;
        }

        const data = (await response.json()) as { user?: AuthUser };
        setAuthUser(data.user ?? null);
      } catch {
        setAuthUser(null);
      }
    }

    getCurrentUser();
  }, []);

  useEffect(() => {
    function closeMenu() {
      setProfileMenuOpen(false);
    }

    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  async function handleLogout() {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setAuthUser(null);
      setProfileMenuOpen(false);
      setMobileMenuOpen(false);
      router.push("/");
      router.refresh();
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/images/logo.jpeg"
              alt="EasyRabta Logo"
              width={48}
              height={48}
              className="h-10 w-10 rounded-md object-cover sm:h-11 sm:w-11"
              priority
            />
            <span className="ml-3 text-2xl font-bold tracking-tight text-gray-800 dark:text-slate-100">
              EasyRabta
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-gray-700 transition hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-400"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {authUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setProfileMenuOpen((prev) => !prev);
                  }}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 hover:bg-gray-100 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700"
                >
                  {authUser.profileImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={authUser.profileImage}
                      alt="Profile"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                      {authUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="max-w-[140px] truncate text-sm font-semibold text-gray-800 dark:text-slate-100">
                    {authUser.name}
                  </span>
                  <FiChevronDown
                    className={`text-gray-500 transition dark:text-slate-400 ${profileMenuOpen ? "rotate-180" : ""}`}
                    size={14}
                  />
                </button>

                {profileMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-slate-600 dark:bg-slate-800"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-700 dark:text-slate-100 dark:hover:bg-slate-700 dark:hover:text-emerald-400"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 transition hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-400"
              >
                Login
              </Link>
            )}
            <Link
              href="/post-property"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2 rounded-lg transition text-sm whitespace-nowrap"
            >
              Post Property
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 dark:border-slate-700 md:hidden">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 font-medium text-gray-700 hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-400"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 border-t border-gray-100 pt-2 dark:border-slate-700">
                {authUser ? (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-slate-600 dark:bg-slate-800">
                    <div className="mb-2 flex items-center">
                      {authUser.profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={authUser.profileImage}
                          alt="Profile"
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
                          {authUser.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-sm font-medium text-emerald-700 dark:text-emerald-400"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 font-medium text-gray-700 hover:text-emerald-600 dark:text-slate-200 dark:hover:text-emerald-400"
                  >
                    Login
                  </Link>
                )}
                <Link
                  href="/post-property"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg text-center"
                >
                  Post Property
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
