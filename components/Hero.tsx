"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

const cities = ["Islamabad", "Rawalpindi", "Both"];
const propertyTypes = ["House", "Apartment", "Plot", "Commercial"];

interface SearchData {
  purpose: string;
  city: string;
  propertyType: string;
  bedrooms: string;
  priceMin: string;
  priceMax: string;
}

export default function Hero() {
  const router = useRouter();
  const [searchData, setSearchData] = useState<SearchData>({
    purpose: "rent",
    city: "",
    propertyType: "",
    bedrooms: "",
    priceMin: "",
    priceMax: "",
  });

  function handleSearch() {
    const params = new URLSearchParams();
    if (searchData.purpose) params.set("purpose", searchData.purpose);
    if (searchData.city) params.set("city", searchData.city);
    if (searchData.propertyType)
      params.set("propertyType", searchData.propertyType);
    if (searchData.bedrooms) params.set("bedrooms", searchData.bedrooms);
    if (searchData.priceMin) params.set("priceMin", searchData.priceMin);
    if (searchData.priceMax) params.set("priceMax", searchData.priceMax);
    router.push(`/buy?${params.toString()}`);
  }

  return (
    <section className="relative bg-gradient-to-br from-emerald-50 to-teal-50 py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 px-1">
            Find Your Dream Property in{" "}
            <span className="text-emerald-600">Twin Cities</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 px-2">
            Search from thousands of verified properties in Islamabad &
            Rawalpindi
          </p>
        </div>

        <div className="bg-white p-4 sm:p-6 max-w-5xl mx-auto rounded-lg shadow-md border border-gray-100">
          <div className="space-y-6">
            {/* Purpose Tabs */}
            <div className="flex gap-2 sm:gap-4">
              <button
                onClick={() =>
                  setSearchData({ ...searchData, purpose: "rent" })
                }
                className={`flex-1 py-2.5 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
                  searchData.purpose === "rent"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                For Rent
              </button>
              <button
                onClick={() =>
                  setSearchData({ ...searchData, purpose: "sale" })
                }
                className={`flex-1 py-2.5 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base ${
                  searchData.purpose === "sale"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                For Sale
              </button>
            </div>

            {/* Search Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              <select
                value={searchData.city}
                onChange={(e) =>
                  setSearchData({ ...searchData, city: e.target.value })
                }
                className="px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <select
                value={searchData.propertyType}
                onChange={(e) =>
                  setSearchData({
                    ...searchData,
                    propertyType: e.target.value,
                  })
                }
                className="px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="">Property Type</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <select
                value={searchData.bedrooms}
                onChange={(e) =>
                  setSearchData({ ...searchData, bedrooms: e.target.value })
                }
                className="px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="">Bedrooms</option>
                <option value="1">1 Bed</option>
                <option value="2">2 Beds</option>
                <option value="3">3 Beds</option>
                <option value="4">4 Beds</option>
                <option value="5">5+ Beds</option>
              </select>

              <input
                type="text"
                placeholder="Min Price"
                value={searchData.priceMin}
                onChange={(e) =>
                  setSearchData({ ...searchData, priceMin: e.target.value })
                }
                className="px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
              />

              <input
                type="text"
                placeholder="Max Price"
                value={searchData.priceMax}
                onChange={(e) =>
                  setSearchData({ ...searchData, priceMax: e.target.value })
                }
                className="px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>

            <button
              onClick={handleSearch}
              className="w-full bg-emerald-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-md text-sm sm:text-base"
            >
              <SearchIcon />
              <span>Search Properties</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
