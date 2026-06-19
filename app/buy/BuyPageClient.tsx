"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { FiGrid, FiHeart, FiHome, FiList, FiSearch } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyInquiryButton from "@/components/PropertyInquiryButton";
import { areasByCity, cities } from "@/components/Hero";
import { contactPhoneDisplay } from "@/lib/contact";
import {
  normalizePropertyType,
  propertyTypes as allPropertyTypes,
} from "@/lib/propertyTypes";
import {
  isPropertySaved,
  toggleSavedProperty,
  type SavedProperty,
} from "@/components/savedProperties";
import PropertyImageGallery from "@/components/PropertyImageGallery";
import { propertyGalleryImages } from "@/lib/propertyImage";

type BuyProperty = {
  id: string;
  inquiryId?: string;
  title: string;
  city: string;
  area: string;
  propertyType: string;
  bedrooms: number;
  price: number;
  size: string;
  image: string;
  images: string[];
  contactPhone?: string;
  isPaidListing?: boolean;
  paymentStatus?: string;
};

type BuyPageFilters = {
  city: string;
  area: string;
  propertyType: string;
  bedrooms: string;
  minPrice: string;
  maxPrice: string;
  keyword: string;
};

type AppliedBuyFilters = BuyPageFilters & {
  sortBy: string;
};

type ViewMode = "grid" | "list";

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
  contactPhone?: string;
  isPaidListing?: boolean;
  paymentStatus?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

const properties: BuyProperty[] = [
  {
    id: "b1",
    title: "5 Marla Corner House in F-10",
    city: "Islamabad",
    area: "F-10",
    propertyType: "Houses",
    bedrooms: 4,
    price: 45000000,
    size: "5 Marla",
    image: "/images/one.jpg",
    images: ["/images/one.jpg"],
    contactPhone: contactPhoneDisplay,
  },
  {
    id: "b2",
    title: "10 Marla Residential Plot in G-13",
    city: "Islamabad",
    area: "G-13",
    propertyType: "Plots (Residential)",
    bedrooms: 0,
    price: 34000000,
    size: "10 Marla",
    image: "/images/two.jpg",
    images: ["/images/two.jpg"],
    contactPhone: contactPhoneDisplay,
  },
  {
    id: "b3",
    title: "Luxury Apartment in Saddar",
    city: "Rawalpindi",
    area: "Saddar",
    propertyType: "Apartments & Flats",
    bedrooms: 3,
    price: 25000000,
    size: "1700 sqft",
    image: "/images/three.jpg",
    images: ["/images/three.jpg"],
    contactPhone: contactPhoneDisplay,
  },
  {
    id: "b4",
    title: "Main Road Commercial Space",
    city: "Rawalpindi",
    area: "Satellite Town (All Blocks)",
    propertyType: "Commercial Spaces (Plaza / Building)",
    bedrooms: 0,
    price: 62000000,
    size: "2100 sqft",
    image: "/images/rwalpindi.jpg",
    images: ["/images/rwalpindi.jpg"],
    contactPhone: contactPhoneDisplay,
  },
];

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function BuyPage({
  initialFilters,
}: {
  initialFilters: BuyPageFilters;
}) {
  const [city, setCity] = useState(initialFilters.city);
  const [area, setArea] = useState(initialFilters.area);
  const [propertyType, setPropertyType] = useState(
    initialFilters.propertyType === "all"
      ? "all"
      : normalizePropertyType(initialFilters.propertyType)
  );
  const [bedrooms, setBedrooms] = useState(initialFilters.bedrooms);
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice);
  const [keyword, setKeyword] = useState(initialFilters.keyword);
  const [sortBy, setSortBy] = useState("latest");
  const [appliedFilters, setAppliedFilters] = useState<AppliedBuyFilters>({
    ...initialFilters,
    propertyType:
      initialFilters.propertyType === "all"
        ? "all"
        : normalizePropertyType(initialFilters.propertyType),
    sortBy: "latest",
  });
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [apiProperties, setApiProperties] = useState<BuyProperty[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>(() =>
    properties
      .filter((property) => isPropertySaved(`buy-${property.id}`))
      .map((property) => `buy-${property.id}`)
  );

  useEffect(() => {
    async function loadProperties() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/properties?purpose=sell`);
        if (!response.ok) return;

        const data = (await response.json()) as { properties?: ApiProperty[] };
        const normalized = (data.properties ?? []).map((property, index) => ({
          id: property._id ?? `api-buy-${index}`,
          inquiryId: property._id ?? "",
          title: property.title ?? "Untitled property",
          city: property.city ?? "Unknown city",
          area: property.area ?? "Area not provided",
          propertyType: normalizePropertyType(property.propertyType),
          bedrooms: Number(property.bedrooms ?? 0),
          price: Number(property.price ?? 0),
          size: property.areaSize || property.plotSize || "Size not specified",
          image: propertyGalleryImages(property.images)[0],
          images: propertyGalleryImages(property.images),
          contactPhone: property.contactPhone,
          isPaidListing:
            Boolean(property.isPaidListing) || property.paymentStatus === "verified",
        }));

        setApiProperties(normalized);
      } catch {}
    }

    loadProperties();
  }, []);

  const listingSource = useMemo(() => [...apiProperties, ...properties], [apiProperties]);
  const viewedPropertyIds = useMemo(
    () => apiProperties.map((property) => property.inquiryId).filter(Boolean),
    [apiProperties]
  );

  useEffect(() => {
    viewedPropertyIds.forEach((id) => {
      fetch(`${API_BASE_URL}/api/properties/${id}/view`, { method: "POST" }).catch(
        () => {}
      );
    });
  }, [viewedPropertyIds]);

  const cityOptions = useMemo(
    () => ["all", ...new Set([...cities, ...listingSource.map((item) => item.city)])],
    [listingSource]
  );
  const areaOptions = useMemo(() => {
    if (city !== "all") {
      const listingAreas = listingSource
        .filter((property) => property.city === city)
        .map((item) => item.area);
      return ["all", ...new Set([...(areasByCity[city] ?? []), ...listingAreas])];
    }

    return ["all", ...new Set(listingSource.map((item) => item.area))];
  }, [city, listingSource]);
  const propertyTypeOptions = useMemo(
    () => [
      "all",
      ...new Set([...allPropertyTypes, ...listingSource.map((item) => item.propertyType)]),
    ],
    [listingSource]
  );
  const bedroomOptions = useMemo(
    () => ["all", ...new Set(listingSource.map((item) => String(item.bedrooms)).filter((item) => item !== "0"))],
    [listingSource]
  );

  const filtered = useMemo(() => {
    const results = listingSource.filter((property) => {
      if (appliedFilters.city !== "all" && property.city !== appliedFilters.city)
        return false;
      if (appliedFilters.area !== "all" && property.area !== appliedFilters.area)
        return false;
      if (
        appliedFilters.propertyType !== "all" &&
        property.propertyType !== appliedFilters.propertyType
      )
        return false;
      if (
        appliedFilters.bedrooms !== "all" &&
        String(property.bedrooms) !== appliedFilters.bedrooms
      )
        return false;
      if (appliedFilters.minPrice && property.price < Number(appliedFilters.minPrice))
        return false;
      if (appliedFilters.maxPrice && property.price > Number(appliedFilters.maxPrice))
        return false;
      if (appliedFilters.keyword.trim()) {
        const searchText = [
          property.title,
          property.city,
          property.area,
          property.propertyType,
          property.size,
        ]
          .join(" ")
          .toLowerCase();
        if (!searchText.includes(appliedFilters.keyword.trim().toLowerCase())) {
          return false;
        }
      }
      return true;
    });

    if (appliedFilters.sortBy === "price_low")
      return [...results].sort((a, b) => Number(b.isPaidListing) - Number(a.isPaidListing) || a.price - b.price);
    if (appliedFilters.sortBy === "price_high")
      return [...results].sort((a, b) => Number(b.isPaidListing) - Number(a.isPaidListing) || b.price - a.price);
    if (appliedFilters.sortBy === "beds_high")
      return [...results].sort((a, b) => Number(b.isPaidListing) - Number(a.isPaidListing) || b.bedrooms - a.bedrooms);
    return [...results].sort((a, b) => Number(b.isPaidListing) - Number(a.isPaidListing));
  }, [appliedFilters, listingSource]);

  function resetFilters() {
    setCity("all");
    setArea("all");
    setPropertyType("all");
    setBedrooms("all");
    setMinPrice("");
    setMaxPrice("");
    setKeyword("");
    setSortBy("latest");
    setAppliedFilters({
      city: "all",
      area: "all",
      propertyType: "all",
      bedrooms: "all",
      minPrice: "",
      maxPrice: "",
      keyword: "",
      sortBy: "latest",
    });
  }

  function handleSearch() {
    setAppliedFilters({
      city,
      area,
      propertyType,
      bedrooms,
      minPrice,
      maxPrice,
      keyword,
      sortBy,
    });
  }

  function handleToggleSave(property: BuyProperty) {
    const savedProperty: SavedProperty = {
      ...property,
      id: `buy-${property.id}`,
      purpose: "buy",
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
              Buy Properties
            </h1>
            <p className="mt-2 text-gray-600 dark:text-slate-300">
              Verified listings with clear pricing and location details.
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
                  <input
                    type="search"
                    value={city === "all" ? "" : city}
                    onChange={(event) => {
                      setCity(event.target.value || "all");
                      setArea("all");
                    }}
                    list="buy-city-options"
                    placeholder="Search city"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-emerald-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                  />
                  <datalist id="buy-city-options">
                    {cityOptions.filter((option) => option !== "all").map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                  <SelectField
                    label="Neighborhood / Area"
                    value={area}
                    options={areaOptions}
                    onChange={setArea}
                  />
                  <input
                    type="search"
                    value={area === "all" ? "" : area}
                    onChange={(event) => setArea(event.target.value || "all")}
                    list="buy-area-options"
                    placeholder="Search neighborhood / area"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-emerald-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                  />
                  <datalist id="buy-area-options">
                    {areaOptions.filter((option) => option !== "all").map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
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
                    options={["latest", "price_low", "price_high", "beds_high"]}
                    onChange={setSortBy}
                    labelMap={{
                      latest: "Latest",
                      price_low: "Price: Low to High",
                      price_high: "Price: High to Low",
                      beds_high: "Bedrooms: High to Low",
                    }}
                  />

                  <button
                    type="button"
                    onClick={handleSearch}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <FiSearch size={16} />
                    Search
                  </button>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-8">
              <div className="mb-4 flex flex-col gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-slate-700 dark:bg-slate-800 sm:flex-row">
                <input
                  type="search"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleSearch();
                  }}
                  placeholder="Search by keyword, city, area, or property type"
                  className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-emerald-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <FiSearch size={16} />
                  Search
                </button>
              </div>
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">
                  Showing {filtered.length} properties
                </p>
                <div className="inline-flex w-fit rounded-lg border border-gray-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
                  <ViewButton
                    active={viewMode === "grid"}
                    icon={<FiGrid size={15} />}
                    label="Grid"
                    onClick={() => setViewMode("grid")}
                  />
                  <ViewButton
                    active={viewMode === "list"}
                    icon={<FiList size={15} />}
                    label="Rows"
                    onClick={() => setViewMode("list")}
                  />
                </div>
              </div>
              {filtered.length === 0 ? (
                <section className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300">
                  No properties found for selected filters.
                </section>
              ) : (
                <section
                  className={
                    viewMode === "grid" ? "grid gap-5 md:grid-cols-2" : "space-y-5"
                  }
                >
                  {filtered.map((property) => (
                    <article
                      key={property.id}
                      className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 ${
                        viewMode === "list"
                          ? "md:grid md:grid-cols-[280px_minmax(0,1fr)]"
                          : ""
                      }`}
                    >
                      <div className="relative">
                        <PropertyImageGallery
                          images={property.images}
                          title={property.title}
                          className={
                            viewMode === "list"
                              ? "h-64 w-full object-cover md:h-full"
                              : "h-52 w-full object-cover"
                          }
                        />
                        {property.isPaidListing ? (
                          <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-amber-950 shadow">
                            Premium
                          </span>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => handleToggleSave(property)}
                          className={`absolute right-3 top-3 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold shadow-sm transition ${
                            savedIds.includes(`buy-${property.id}`)
                              ? "bg-emerald-600 text-white"
                              : "bg-white/95 text-gray-700 hover:bg-emerald-50"
                          }`}
                        >
                          <FiHeart size={14} />
                          {savedIds.includes(`buy-${property.id}`) ? "Saved" : "Save"}
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
                          {formatPrice(property.price)}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-gray-700 dark:text-slate-200">
                          <span className="rounded bg-gray-100 px-2.5 py-1 dark:bg-slate-800">
                            <FiHome className="mr-1 inline" size={13} />
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
                          propertyTitle={property.title}
                          contactPhone={property.contactPhone}
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

function ViewButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-emerald-600 text-white"
          : "text-gray-600 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-700"
      }`}
    >
      {icon}
      {label}
    </button>
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
