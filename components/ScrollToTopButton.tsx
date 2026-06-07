"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowUp, FiMessageCircle } from "react-icons/fi";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 280);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      <Link
        href="/contact"
        aria-label="Contact Us"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg ring-1 ring-slate-700/30 transition hover:bg-slate-800 dark:bg-white dark:text-slate-950"
      >
        <FiMessageCircle size={20} />
      </Link>

      {isVisible ? (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg ring-1 ring-emerald-500/30 transition hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          <FiArrowUp size={20} />
        </button>
      ) : null}
    </div>
  );
}
