import { Suspense } from "react";
import RentPageClient from "./RentPageClient";

type SearchParams = {
  [key: string]: string | string[] | undefined;
};

function getParam(
  searchParams: SearchParams,
  key: string,
  fallback: string
) {
  const value = searchParams[key];
  if (typeof value === "string") return value;
  if (Array.isArray(value) && typeof value[0] === "string") return value[0];
  return fallback;
}

function RentPageFallback() {
  return (
    <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10 dark:bg-slate-950">
      <section className="mx-auto max-w-7xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
        <div className="h-8 w-52 animate-pulse rounded bg-gray-200 dark:bg-slate-700" />
      </section>
    </main>
  );
}

export default async function RentPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const initialFilters = {
    city: getParam(params, "city", "all"),
    area: getParam(params, "area", "all"),
    propertyType: getParam(params, "propertyType", "all"),
    bedrooms: getParam(params, "bedrooms", "all"),
    minPrice: getParam(params, "priceMin", ""),
    maxPrice: getParam(params, "priceMax", ""),
  };

  return (
    <Suspense fallback={<RentPageFallback />}>
      <RentPageClient initialFilters={initialFilters} />
    </Suspense>
  );
}
