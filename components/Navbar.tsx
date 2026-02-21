"use client";

import Link from "next/link";
import { useState } from "react";
import { FiHome, FiMenu, FiX } from "react-icons/fi";

const navLinks = [
  { href: "/buy", label: "Buy" },
  { href: "/rent", label: "Rent" },
  { href: "/featured", label: "Featured" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link href="/" className="flex items-center flex-shrink-0">
            <FiHome className="text-emerald-600" size={32} />
            <span className="ml-2 text-lg sm:text-xl font-bold text-gray-800">
              EasyRabta
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-emerald-600 font-medium transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-gray-700 hover:text-emerald-600 font-medium transition text-sm"
            >
              Login
            </Link>
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
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-gray-700 hover:text-emerald-600 font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-gray-700 hover:text-emerald-600 font-medium"
                >
                  Login
                </Link>
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
