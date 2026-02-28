"use client";

import { useEffect, useState } from "react";

const lifestyleImages = [
  "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=2000",
  "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=2000",
  "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=2000",
  "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=2000",
  "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=2000",
];

export default function Lifestyle() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => {
        let next = prev;
        while (next === prev) {
          next = Math.floor(Math.random() * lifestyleImages.length);
        }
        return next;
      });
    }, 3500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-12 dark:from-slate-950 dark:to-slate-900 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:mb-12">
          <h2 className="mb-2 text-2xl font-bold text-gray-800 dark:text-slate-100 sm:text-3xl md:text-4xl">
            Neighborhood Lifestyle
          </h2>
          <p className="px-2 text-base text-gray-600 dark:text-slate-300 sm:text-lg">
            Experience local vibe and amenities around top listings
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
          <div className="relative aspect-[21/9] min-h-[220px] w-full sm:min-h-[300px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={lifestyleImages[currentIndex]}
              src={lifestyleImages[currentIndex]}
              alt="Luxury neighborhood view"
              loading="lazy"
              className="h-full w-full object-cover object-center transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 sm:bottom-6 sm:left-6 sm:right-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200 sm:text-sm">
                  Community Living
                </p>
                <h3 className="mt-1 text-lg font-bold text-white sm:text-2xl">
                  Prime Areas with Better Lifestyle
                </h3>
              </div>
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 sm:px-4 sm:text-sm">
                Verified Zones
              </span>
            </div>
            <div className="absolute right-4 top-4 rounded-full bg-black/45 px-3 py-1 text-xs font-semibold text-white sm:right-6 sm:top-6">
              {currentIndex + 1}/{lifestyleImages.length}
            </div>
          </div>

          <div className="grid gap-3 border-t border-gray-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-3 sm:p-5">
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-center font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              Parks & Family Spaces
            </div>
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-center font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              Schools & Essentials Nearby
            </div>
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-center font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              Easy Access Roads
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
