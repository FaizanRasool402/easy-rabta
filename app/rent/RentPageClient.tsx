"use client";

import { useEffect, useMemo, useState } from "react";
import { FiHeart } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyInquiryButton from "@/components/PropertyInquiryButton";
import {
  isPropertySaved,
  toggleSavedProperty,
  type SavedProperty,
} from "@/components/savedProperties";

type RentProperty = {
  id: string;
  inquiryId?: string;
  title: string;
  city: string;
  area: string;
  propertyType: string;
  bedrooms: number;
  monthlyRent: number;
  size: string;
  image: string;
};

type RentPageFilters = {
  city: string;
  area: string;
  propertyType: string;
  bedrooms: string;
  minPrice: string;
  maxPrice: string;
};

type ApiProperty = {
  _id?: string;
  title?: string;
  city?: string;
  area?: string;
  propertyType?: string;
  bedrooms?: number;
  price?: number | string;
  areaSize?: string;
  plotSize?: string;
  images?: string[];
  purpose?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

const properties: RentProperty[] = [
  {
    id: "r1",
    title: "Family Portion Near Markaz",
    city: "Islamabad",
    area: "G-11 Markaz",
    propertyType: "House",
    bedrooms: 3,
    monthlyRent: 95000,
    size: "10 Marla",
    image: "/images/one.jpg",
  },
  {
    id: "r2",
    title: "Apartment in Bahria Town",
    city: "Rawalpindi",
    area: "Satellite Town (All Blocks)",
    propertyType: "Apartment",
    bedrooms: 2,
    monthlyRent: 60000,
    size: "1200 sqft",
    image: "/images/two.jpg",
  },
  {
    id: "r3",
    title: "Office Floor at Main Boulevard",
    city: "Rawalpindi",
    area: "Saddar",
    propertyType: "Commercial",
    bedrooms: 0,
    monthlyRent: 180000,
    size: "2300 sqft",
    image: "/images/three.jpg",
  },
  {
    id: "r4",
    title: "Studio Apartment for Working Professionals",
    city: "Islamabad",
    area: "F-10 Markaz",
    propertyType: "Apartment",
    bedrooms: 1,
    monthlyRent: 50000,
    size: "650 sqft",
    image: "/images/Islamabadd.jpg",
  },
];

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function RentPage({
  initialFilters,
}: {
  initialFilters: RentPageFilters;
}) {
  const [city, setCity] = useState(initialFilters.city);
  const [area, setArea] = useState(initialFilters.area);
  const [propertyType, setPropertyType] = useState(initialFilters.propertyType);
  const [bedrooms, setBedrooms] = useState(initialFilters.bedrooms);
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice);
  const [sortBy, setSortBy] = useState("latest");
  const [apiProperties, setApiProperties] = useState<RentProperty[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>(() =>
    properties
      .filter((property) => isPropertySaved(`rent-${property.id}`))
      .map((property) => `rent-${property.id}`)
  );

  useEffect(() => {
    async function loadProperties() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/properties?purpose=rent`);
        if (!response.ok) return;

        const data = (await response.json()) as { properties?: ApiProperty[] };
        const normalized = (data.properties ?? []).map((property, index) => ({
          id: property._id ?? `api-rent-${index}`,
          inquiryId: property._id ?? "",
          title: property.title ?? "Untitled property",
          city: property.city ?? "Unknown city",
          area: property.area ?? "Area not provided",
          propertyType: property.propertyType ?? "Property",
          bedrooms: Number(property.bedrooms ?? 0),
          monthlyRent: Number(property.price ?? 0),
          size: property.areaSize || property.plotSize || "Size not specified",
          image: property.images?.[0]
            ? property.images[0].startsWith("http") || property.images[0].startsWith("data:")
              ? property.images[0]
              : `${API_BASE_URL}${property.images[0]}`
            : "/images/one.jpg",
        }));

        setApiProperties(normalized);
      } catch {}
    }

    loadProperties();
  }, []);

  const listingSource = useMemo(() => [...apiProperties, ...properties], [apiProperties]);

  const cityOptions = useMemo(
    () => ["all", ...new Set(listingSource.map((item) => item.city))],
    [listingSource]
  );
  const areaOptions = useMemo(() => {
    const source =
      city === "all"
        ? listingSource
        : listingSource.filter((property) => property.city === city);
    return ["all", ...new Set(source.map((item) => item.area))];
  }, [city, listingSource]);
  const propertyTypeOptions = useMemo(
    () => ["all", ...new Set(listingSource.map((item) => item.propertyType))],
    [listingSource]
  );
  const bedroomOptions = useMemo(
    () => ["all", ...new Set(listingSource.map((item) => String(item.bedrooms)).filter((item) => item !== "0"))],
    [listingSource]
  );

  const filtered = useMemo(() => {
    const results = listingSource.filter((property) => {
      if (city !== "all" && property.city !== city) return false;
      if (area !== "all" && property.area !== area) return false;
      if (propertyType !== "all" && property.propertyType !== propertyType)
        return false;
      if (bedrooms !== "all" && String(property.bedrooms) !== bedrooms) return false;
      if (minPrice && property.monthlyRent < Number(minPrice)) return false;
      if (maxPrice && property.monthlyRent > Number(maxPrice)) return false;
      return true;
    });

    if (sortBy === "price_low")
      return [...results].sort((a, b) => a.monthlyRent - b.monthlyRent);
    if (sortBy === "price_high")
      return [...results].sort((a, b) => b.monthlyRent - a.monthlyRent);
    if (sortBy === "beds_high")
      return [...results].sort((a, b) => b.bedrooms - a.bedrooms);
    return results;
  }, [area, bedrooms, city, listingSource, maxPrice, minPrice, propertyType, sortBy]);

  function resetFilters() {
    setCity("all");
    setArea("all");
    setPropertyType("all");
    setBedrooms("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("latest");
  }

  function handleToggleSave(property: RentProperty) {
    const savedProperty: SavedProperty = {
      id: `rent-${property.id}`,
      title: property.title,
      city: property.city,
      area: property.area,
      propertyType: property.propertyType,
      bedrooms: property.bedrooms,
      price: property.monthlyRent,
      size: property.size,
      image: property.image,
      purpose: "rent",
    };
    const saved = toggleSavedProperty(savedProperty);
    setSavedIds((prev) =>
      saved
        ? [...prev, savedProperty.id]
        : prev.filter((item) => item !== savedProperty.id)
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10 dark:bg-slate-950">
        <section className="mx-auto max-w-7xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
              Rent Properties
            </h1>
            <p className="mt-2 text-gray-600 dark:text-slate-300">
              Flexible rental options for families, professionals, and businesses.
            </p>
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
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
                  >
                    Reset
                  </button>
                </div>

                <div className="space-y-4">
                  <SelectField
                    label="City"
                    value={city}
                    options={cityOptions}
                    onChange={(value) => {
                      setCity(value);
                      setArea("all");
                    }}
                  />
                  <SelectField
                    label="Area"
                    value={area}
                    options={areaOptions}
                    onChange={setArea}
                  />
                  <SelectField
                    label="Property Type"
                    value={propertyType}
                    options={propertyTypeOptions}
                    onChange={setPropertyType}
                  />
                  <SelectField
                    label="Bedrooms"
                    value={bedrooms}
                    options={bedroomOptions}
                    onChange={setBedrooms}
                  />

                  <FieldLabel label="Monthly Rent Range" />
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
                    options={["latest", "price_low", "price_high", "beds_high"]}
                    onChange={setSortBy}
                    labelMap={{
                      latest: "Latest",
                      price_low: "Rent: Low to High",
                      price_high: "Rent: High to Low",
                      beds_high: "Bedrooms: High to Low",
                    }}
                  />
                </div>
              </div>
            </aside>

            <div className="lg:col-span-8">
              <p className="mb-4 text-sm font-semibold text-gray-700 dark:text-slate-200">
                Showing {filtered.length} properties
              </p>
              {filtered.length === 0 ? (
                <section className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  No properties found for selected filters.
                </section>
              ) : (
                <section className="grid gap-5 md:grid-cols-2">
                  {filtered.map((property) => (
                    <article
                      key={property.id}
                      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900"
                    >
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={property.image}
                          alt={property.title}
                          className="h-52 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleToggleSave(property)}
                          className={`absolute right-3 top-3 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold shadow-sm transition ${
                            savedIds.includes(`rent-${property.id}`)
                              ? "bg-emerald-600 text-white"
                              : "bg-white/95 text-gray-700 hover:bg-emerald-50"
                          }`}
                        >
                          <FiHeart size={14} />
                          {savedIds.includes(`rent-${property.id}`) ? "Saved" : "Save"}
                        </button>
                      </div>
                      <div className="p-4">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                          {property.title}
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                          {property.city}, {property.area}
                        </p>
                        <p className="mt-3 text-xl font-extrabold text-emerald-700 dark:text-emerald-400">
                          {formatPrice(property.monthlyRent)} / month
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-gray-700 dark:text-slate-200">
                          <span className="rounded bg-gray-100 px-2.5 py-1 dark:bg-slate-800">
                            {property.propertyType}
                          </span>
                          <span className="rounded bg-gray-100 px-2.5 py-1 dark:bg-slate-800">
                            {property.size}
                          </span>
                          {property.bedrooms > 0 ? (
                            <span className="rounded bg-gray-100 px-2.5 py-1 dark:bg-slate-800">
                              {property.bedrooms} Beds
                            </span>
                          ) : null}
                        </div>
                        <PropertyInquiryButton
                          propertyId={property.inquiryId}
                          propertyTitle={property.title}
                        />
                      </div>
                    </article>
                  ))}
                </section>
              )}
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
