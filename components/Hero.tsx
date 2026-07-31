"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { areasByCity, cities } from "@/lib/locations";
import {
  isBedroomPropertyType,
  isCoveredAreaPropertyType,
  isPlotPropertyType,
  propertyTypes,
} from "@/lib/propertyTypes";

interface SearchData {
  purpose: string;
  city: string;
  area: string;
  propertyType: string;
  bedrooms: string;
  coveredArea: string;
  plotSize: string;
  priceMin: string;
  priceMax: string;
}

export default function Hero() {
  const router = useRouter();
  const [searchData, setSearchData] = useState<SearchData>({
    purpose: "rent",
    city: "",
    area: "",
    propertyType: "",
    bedrooms: "",
    coveredArea: "",
    plotSize: "",
    priceMin: "",
    priceMax: "",
  });
  const isResidentialType = isBedroomPropertyType(searchData.propertyType);

  function handleSearch() {
    const params = new URLSearchParams();
    if (searchData.purpose) params.set("purpose", searchData.purpose);
    if (searchData.city) params.set("city", searchData.city);
    if (searchData.area) params.set("area", searchData.area);
    if (searchData.propertyType)
      params.set("propertyType", searchData.propertyType);
    if (searchData.bedrooms) params.set("bedrooms", searchData.bedrooms);
    if (searchData.coveredArea) params.set("coveredArea", searchData.coveredArea);
    if (searchData.plotSize) params.set("plotSize", searchData.plotSize);
    if (searchData.priceMin) params.set("priceMin", searchData.priceMin);
    if (searchData.priceMax) params.set("priceMax", searchData.priceMax);
    router.push(`/buy?${params.toString()}`);
  }

  return (
    <section className="relative bg-gradient-to-br from-emerald-50 to-teal-50 py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 px-1">
            Find Your Dream Property Across{" "}
            <span className="text-emerald-600">Multiple Cities</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 px-2">
            Search verified listings across multiple cities and growing locations.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <input
                type="search"
                value={searchData.city}
                onChange={(e) =>
                  setSearchData({
                    ...searchData,
                    city: e.target.value,
                    area: "",
                  })
                }
                list="hero-city-options"
                placeholder="Any city"
                className="px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
              />
              <datalist id="hero-city-options">
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
                <option value="Other" />
              </datalist>

              <input
                type="search"
                value={searchData.area}
                onChange={(e) =>
                  setSearchData({ ...searchData, area: e.target.value })
                }
                list="hero-area-options"
                placeholder="Any neighborhood / area"
                className="px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
              />
              <datalist id="hero-area-options">
                {(areasByCity[searchData.city] ?? []).map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
                <option value="Other" />
              </datalist>

              <select
                value={searchData.propertyType}
                onChange={(e) =>
                  setSearchData({
                    ...searchData,
                    propertyType: e.target.value,
                    bedrooms: isBedroomPropertyType(e.target.value)
                      ? searchData.bedrooms
                      : "",
                    coveredArea: isCoveredAreaPropertyType(e.target.value)
                      ? searchData.coveredArea
                      : "",
                    plotSize: isPlotPropertyType(e.target.value)
                      ? searchData.plotSize
                      : "",
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

              {isResidentialType ? (
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
              ) : isCoveredAreaPropertyType(searchData.propertyType) ? (
                <input
                  type="text"
                  placeholder="Covered Area (sqft)"
                  value={searchData.coveredArea}
                  onChange={(e) =>
                    setSearchData({ ...searchData, coveredArea: e.target.value })
                  }
                  className="px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                />
              ) : isPlotPropertyType(searchData.propertyType) ? (
                <input
                  type="text"
                  placeholder="Plot Size (Marla/Kanal)"
                  value={searchData.plotSize}
                  onChange={(e) =>
                    setSearchData({ ...searchData, plotSize: e.target.value })
                  }
                  className="px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                />
              ) : (
                <div className="px-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 text-sm sm:text-base">
                  Bedrooms
                </div>
              )}

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">
                  PKR
                </span>
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={searchData.priceMin}
                  placeholder="Min Price"
                  onChange={(e) =>
                    setSearchData((prev) => {
                      const nextMin = e.target.value;
                      const minAsNumber = Number(nextMin);
                      const maxAsNumber = Number(prev.priceMax);
                      const shouldAdjustMax =
                        nextMin &&
                        prev.priceMax &&
                        !Number.isNaN(minAsNumber) &&
                        !Number.isNaN(maxAsNumber) &&
                        maxAsNumber < minAsNumber;
                      return {
                        ...prev,
                        priceMin: nextMin,
                        priceMax: shouldAdjustMax ? nextMin : prev.priceMax,
                      };
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-14 pr-3 text-gray-700 outline-none transition focus:border-transparent focus:ring-2 focus:ring-emerald-500 sm:py-3 text-sm sm:text-base"
                />
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">
                  PKR
                </span>
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={searchData.priceMax}
                  placeholder="Max Price"
                  onChange={(e) =>
                    setSearchData((prev) => {
                      const nextMax = e.target.value;
                      const minAsNumber = Number(prev.priceMin);
                      const maxAsNumber = Number(nextMax);
                      const shouldAdjustMin =
                        nextMax &&
                        prev.priceMin &&
                        !Number.isNaN(minAsNumber) &&
                        !Number.isNaN(maxAsNumber) &&
                        minAsNumber > maxAsNumber;
                      return {
                        ...prev,
                        priceMax: nextMax,
                        priceMin: shouldAdjustMin ? nextMax : prev.priceMin,
                      };
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-14 pr-3 text-gray-700 outline-none transition focus:border-transparent focus:ring-2 focus:ring-emerald-500 sm:py-3 text-sm sm:text-base"
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              className="w-full bg-emerald-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-md text-sm sm:text-base"
            >
              <FiSearch size={20} />
              <span>Search Properties</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
