"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type FeaturedProperty = {
  id: string;
  title: string;
  city: string;
  area: string;
  price: number;
  purpose: "rent" | "sale";
  type: "house" | "apartment" | "plot" | "commercial";
  bedrooms: number;
  bathrooms: number;
  size: string;
  image: string;
  tags: string[];
};

const featuredProperties: FeaturedProperty[] = [
  {
    id: "f-1",
    title: "Designer House in F-10",
    city: "Islamabad",
    area: "F-10",
    price: 85000000,
    purpose: "sale",
    type: "house",
    bedrooms: 5,
    bathrooms: 6,
    size: "1 Kanal",
    image: "/images/one.jpg",
    tags: ["Hot Deal", "Verified"],
  },
  {
    id: "f-2",
    title: "Modern Apartment in Bahria Town",
    city: "Rawalpindi",
    area: "Bahria Town",
    price: 85000,
    purpose: "rent",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 3,
    size: "1600 sqft",
    image: "/images/two.jpg",
    tags: ["Premium"],
  },
  {
    id: "f-3",
    title: "Prime Commercial Floor on Main Road",
    city: "Rawalpindi",
    area: "Saddar",
    price: 220000,
    purpose: "rent",
    type: "commercial",
    bedrooms: 0,
    bathrooms: 2,
    size: "2800 sqft",
    image: "/images/three.jpg",
    tags: ["Verified", "New"],
  },
  {
    id: "f-4",
    title: "Corner Plot Near Markaz",
    city: "Islamabad",
    area: "G-13",
    price: 34000000,
    purpose: "sale",
    type: "plot",
    bedrooms: 0,
    bathrooms: 0,
    size: "10 Marla",
    image: "/images/rwalpindi.jpg",
    tags: ["Investor Pick"],
  },
  {
    id: "f-5",
    title: "Rental Portion for Small Family",
    city: "Haripur",
    area: "Khalabat Township",
    price: 45000,
    purpose: "rent",
    type: "house",
    bedrooms: 2,
    bathrooms: 2,
    size: "5 Marla",
    image: "/images/Islamabadd.jpg",
    tags: ["Budget"],
  },
  {
    id: "f-6",
    title: "Shops Block in Abbottabad Center",
    city: "Abbottabad",
    area: "Abbottabad City",
    price: 58000000,
    purpose: "sale",
    type: "commercial",
    bedrooms: 0,
    bathrooms: 2,
    size: "2400 sqft",
    image: "/images/one.jpg",
    tags: ["High Demand"],
  },
];

function formatCurrency(price: number, purpose: "rent" | "sale") {
  const formatted = new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(price);
  return purpose === "rent" ? `${formatted} / month` : formatted;
}

export default function FeaturedPage() {
  const [purpose, setPurpose] = useState<"all" | "rent" | "sale">("all");
  const [city, setCity] = useState("all");
  const [type, setType] = useState("all");
  const [bedrooms, setBedrooms] = useState("all");
  const [tag, setTag] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const cityOptions = useMemo(
    () => ["all", ...new Set(featuredProperties.map((item) => item.city))],
    []
  );
  const typeOptions = useMemo(
    () => ["all", ...new Set(featuredProperties.map((item) => item.type))],
    []
  );
  const tagOptions = useMemo(
    () => ["all", ...new Set(featuredProperties.flatMap((item) => item.tags))],
    []
  );

  const filteredProperties = useMemo(() => {
    const results = featuredProperties.filter((propertyItem) => {
      if (purpose !== "all" && propertyItem.purpose !== purpose) return false;
      if (city !== "all" && propertyItem.city !== city) return false;
      if (type !== "all" && propertyItem.type !== type) return false;
      if (bedrooms !== "all" && String(propertyItem.bedrooms) !== bedrooms) return false;
      if (tag !== "all" && !propertyItem.tags.includes(tag)) return false;

      const min = Number(minPrice);
      const max = Number(maxPrice);
      if (minPrice && !Number.isNaN(min) && propertyItem.price < min) return false;
      if (maxPrice && !Number.isNaN(max) && propertyItem.price > max) return false;

      return true;
    });

    if (sortBy === "price_low") {
      return [...results].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price_high") {
      return [...results].sort((a, b) => b.price - a.price);
    }
    if (sortBy === "beds_high") {
      return [...results].sort((a, b) => b.bedrooms - a.bedrooms);
    }
    return results;
  }, [bedrooms, city, maxPrice, minPrice, purpose, sortBy, tag, type]);

  function resetFilters() {
    setPurpose("all");
    setCity("all");
    setType("all");
    setBedrooms("all");
    setTag("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("latest");
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10 dark:bg-slate-950 sm:py-14">
        <section className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                  Featured Collection
                </p>
                <h1 className="mt-1 text-3xl font-bold text-gray-900 dark:text-slate-100 sm:text-4xl">
                  Discover Featured Properties
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-slate-300 sm:text-base">
                  Use filters on the left and instantly narrow down listings.
                </p>
              </div>
              <Link
                href="/post-property"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Feature Your Property
              </Link>
            </div>

            <div className="mt-7 grid gap-6 lg:grid-cols-12">
              <aside className="lg:col-span-4">
                <div className="sticky top-20 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800 sm:p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-slate-200">
                      Filters
                    </h2>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="space-y-4">
                    <FieldLabel label="Purpose" />
                    <div className="grid grid-cols-3 gap-2">
                      <SmallButton
                        active={purpose === "all"}
                        onClick={() => setPurpose("all")}
                        label="All"
                      />
                      <SmallButton
                        active={purpose === "rent"}
                        onClick={() => setPurpose("rent")}
                        label="Rent"
                      />
                      <SmallButton
                        active={purpose === "sale"}
                        onClick={() => setPurpose("sale")}
                        label="Sale"
                      />
                    </div>

                    <SelectField
                      label="City"
                      value={city}
                      onChange={setCity}
                      options={cityOptions}
                    />
                    <SelectField
                      label="Property Type"
                      value={type}
                      onChange={setType}
                      options={typeOptions}
                    />
                    <SelectField
                      label="Bedrooms"
                      value={bedrooms}
                      onChange={setBedrooms}
                      options={["all", "1", "2", "3", "4", "5"]}
                    />
                    <SelectField
                      label="Tag"
                      value={tag}
                      onChange={setTag}
                      options={tagOptions}
                    />

                    <FieldLabel label="Price Range" />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min="0"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Min"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-emerald-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                      />
                      <input
                        type="number"
                        min="0"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Max"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-emerald-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>

                    <SelectField
                      label="Sort By"
                      value={sortBy}
                      onChange={setSortBy}
                      options={["latest", "price_low", "price_high", "beds_high"]}
                      labelMap={{
                        latest: "Latest",
                        price_low: "Price: Low to High",
                        price_high: "Price: High to Low",
                        beds_high: "Bedrooms: High to Low",
                      }}
                    />
                  </div>
                </div>
              </aside>

              <div className="lg:col-span-8">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">
                    Showing {filteredProperties.length} featured listings
                  </p>
                </div>

                {filteredProperties.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300">
                    No featured listing matched your filters.
                  </div>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2">
                    {filteredProperties.map((propertyItem) => (
                      <article
                        key={propertyItem.id}
                        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                      >
                        <div className="relative">
                          <Image
                            src={propertyItem.image}
                            alt={propertyItem.title}
                            width={600}
                            height={400}
                            className="h-52 w-full object-cover"
                          />
                          <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
                            {propertyItem.purpose === "rent" ? "For Rent" : "For Sale"}
                          </span>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                            {propertyItem.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                            {propertyItem.city}, {propertyItem.area}
                          </p>
                          <p className="mt-3 text-xl font-extrabold text-emerald-700">
                            {formatCurrency(propertyItem.price, propertyItem.purpose)}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-gray-700 dark:text-slate-200">
                            <span className="rounded bg-gray-100 px-2.5 py-1 dark:bg-slate-800">
                              {propertyItem.type}
                            </span>
                            <span className="rounded bg-gray-100 px-2.5 py-1 dark:bg-slate-800">
                              {propertyItem.size}
                            </span>
                            {propertyItem.bedrooms > 0 ? (
                              <span className="rounded bg-gray-100 px-2.5 py-1 dark:bg-slate-800">
                                {propertyItem.bedrooms} Beds
                              </span>
                            ) : null}
                            {propertyItem.tags.map((singleTag) => (
                              <span
                                key={`${propertyItem.id}-${singleTag}`}
                                className="rounded bg-emerald-50 px-2.5 py-1 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                              >
                                {singleTag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function FieldLabel({ label }: { label: string }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
      {label}
    </p>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  labelMap,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  labelMap?: Record<string, string>;
}) {
  return (
    <div>
      <FieldLabel label={label} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-emerald-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {labelMap?.[option] ?? (option === "all" ? "All" : option)}
          </option>
        ))}
      </select>
    </div>
  );
}

function SmallButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
        active
          ? "bg-emerald-600 text-white"
          : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-700"
      }`}
    >
      {label}
    </button>
  );
}
