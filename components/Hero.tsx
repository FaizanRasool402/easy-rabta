"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

export const cities = [
  "Islamabad",
  "Rawalpindi",
  "Haripur",
  "Abbottabad",
  "Hawlian",
  "Khanpur",
];
export const propertyTypes = ["House", "Apartment", "Plot", "Commercial"];
export const areasByCity: Record<string, string[]> = {
  Islamabad: [
    "F-5",
    "F-6",
    "F-7",
    "F-8",
    "F-10",
    "F-11",
    "F-12",
    "F-13",
    "F-14",
    "F-15",
    "F-16",
    "F-17",
    "G-5",
    "G-6",
    "G-7",
    "G-8",
    "G-9",
    "G-10",
    "G-11",
    "G-12",
    "G-13",
    "G-14",
    "G-15",
    "G-16",
    "I-8",
    "I-9",
    "I-10",
    "I-11",
    "I-12",
    "I-14",
    "I-15",
    "I-16",
    "H-8",
    "H-9",
    "H-10",
    "H-11",
    "H-12",
    "H-13",
    "H-14",
    "H-15",
    "H-16",
    "E-7",
    "E-8",
    "E-9",
    "E-10",
    "E-11",
    "E-12",
    "E-13",
    "E-14",
    "E-15",
    "E-16",
    "E-17",
    "D-12",
    "D-13",
    "D-14",
    "D-15",
    "D-16",
    "D-17",
    "C-13",
    "C-14",
    "C-15",
    "C-16",
    "DHA Phase 1",
    "DHA Phase 2",
    "DHA Phase 3",
    "DHA Phase 4",
    "DHA Phase 5",
    "Bahria Town Phase 1",
    "Bahria Town Phase 2",
    "Bahria Town Phase 3",
    "Bahria Town Phase 4",
    "Bahria Town Phase 5",
    "Bahria Town Phase 6",
    "Bahria Town Phase 7",
    "Bahria Town Phase 8",
    "Safari Valley",
    "Gulberg Greens",
    "Gulberg Residencia",
    "B-17 (Multi Gardens)",
    "Top City-1",
    "Park View City",
    "Capital Smart City",
    "Faisal Town",
    "Faisal Hills",
    "PECHS",
    "Naval Anchorage",
    "PWD Housing Society",
    "Soan Garden",
    "Media Town",
    "Pakistan Town",
    "Korang Town",
    "River Garden",
    "Engineers Cooperative Housing",
    "Police Foundation",
    "FGEHA Sectors",
    "Khanna Pul",
    "Burma Town",
    "Tarnol",
    "Alipur Farash",
    "Tramari",
    "Tarlai",
    "Sihala",
    "Nilore",
    "Lehtrar Road",
    "Bhara Kahu",
    "Bani Gala",
    "Shah Allah Ditta",
    "Golra",
    "Sangjani",
    "Model Town Humak",
    "Rawat",
    "Kahuta Road Belt",
    "Blue Area",
    "Aabpara",
    "Melody Market",
    "G-9 Markaz",
    "F-10 Markaz",
    "F-7 Jinnah Super",
    "I-8 Markaz",
    "G-11 Markaz",
  ],
  Rawalpindi: [
    "Afandi Colony",
    "AFOHS Falcon Complex",
    "Amarpura",
    "Arya Mohallah",
    "Asghar Mall",
    "Badar Colony",
    "Banni",
    "Chah Sultan",
    "Chamanzaar Colony",
    "Chaudhry Waris Khan",
    "Chhachhi",
    "Choudhry Feroz",
    "Dhok Elahi Bakhsh",
    "Dhok Kala Khan",
    "Dhok Khabba",
    "Dhoke Ali Akbar",
    "Dhoke Babu Irfan",
    "Dhoke Bajalian",
    "Dhoke Hassu",
    "Dhoke Hukamdad",
    "Dhoke Jattan",
    "Faizabad",
    "Fazaia Colony",
    "Gawalmandi",
    "Gulshanabad",
    "Khayaban-e-Sir Syed",
    "Khurram Colony",
    "Mall Road",
    "Millat Colony",
    "Mohanpura",
    "Muslim Town",
    "New Katarian",
    "Noshahi",
    "Nussah Town",
    "Old City",
    "Peshawar Road",
    "Pindora",
    "Pirwadhai",
    "Qayyum Abad",
    "Raja Bazaar",
    "Rasul Nagar",
    "Ratta Amral",
    "Roshan Din",
    "Sadiqabad",
    "Saddar",
    "Sangar Town",
    "Satellite Town (All Blocks)",
    "Shaheen Town (Phase I & II)",
    "Shakrial",
    "Shamsabad",
    "Sharifpura",
    "Shifa Society",
    "Syed Pur",
    "Tajuddin",
    "Westridge 1",
    "Westridge 2",
    "Westridge 3",
  ],
  Haripur: [
    "Abdullah Pur",
    "Adalat Colony",
    "Akhori",
    "Akhtdrabad",
    "Akhoon Bandi",
    "Ali Khan",
    "Alam",
    "Alloli / Alluli",
    "Amb",
    "Amgah",
    "Anora",
    "Anga",
    "Ashra",
    "Azam Chowk",
    "Aziz Colony",
    "Babu Chowk",
    "Badgiran",
    "Badhora",
    "Bagh",
    "Baghdara",
    "Bail",
    "Bakka",
    "Bandi Sher Khan",
    "Barkot",
    "Beer",
    "Behki",
    "Bhand",
    "Bhuttri",
    "Biralian",
    "Breela",
    "Buraj Khanpur",
    "Chakar Mirpur",
    "Chor / Chhori",
    "Darwesh",
    "Dheri",
    "Dingi",
    "Doyan Abi",
    "Essa",
    "Gadwallian",
    "Ghara / Gharian",
    "Ghazi",
    "Goharabad",
    "Hassanpur",
    "Hattar",
    "Haripur City",
    "Hussaini Chowk",
    "Jabbar",
    "Jatti Pind",
    "Jogi Mohra",
    "Kag",
    "Kalinjar",
    "Kamalpur",
    "Kanera",
    "Khairbara",
    "Khalabat Township",
    "Kholian Bala",
    "Kotla",
    "Kundi",
    "Lalogali",
    "Maira Dheri",
    "Makhniyal",
    "Mankrai",
    "Mirpur",
    "Najafpur",
    "Nara Amaz",
    "Neelan Bhotu",
    "Panian",
    "Pandak",
    "Pind Hasham Khan",
    "Pind Jamal",
    "Pharhari",
    "Qazipur",
    "Rehana",
    "Sarai Saleh",
    "Sangra",
    "Sirikot",
    "Sobra",
    "Tarbela",
    "Tofkian",
    "Umer Khana",
    "Khala Bala",
    "Khomal Paien",
  ],
  Abbottabad: [
    "Abbottabad City",
    "Kehal",
    "Jhangi",
    "Malikpura",
    "Nawansher",
    "Supply",
    "Mandian",
    "Sheikh-ul-Bandi",
    "Bagnotar",
    "Bakot",
    "Bandi Qazi",
    "Bandi Dhundan",
    "Beerangali",
    "Berot Khurd",
    "Boi",
    "Chamhad",
    "Chatri",
    "Dhamtour",
    "Jarral",
    "Kakul",
    "Kuthiala",
    "Kuthwal",
    "Lora",
    "Namli Maira",
    "Nathia Gali",
    "Pawa",
    "Phalkot",
    "Pind Kargu Khan",
    "Salhad",
    "Sarbhana",
    "Sherwan",
    "Tarnawai",
    "Tajwal",
    "Thathi Faqir Sahib",
    "Nagri Bala",
    "Mirpur",
    "Bagh",
    "Baldheri",
    "Havelian City",
    "Bandi Attai Khan",
    "Dewal Manal",
    "Garhi Phulgran",
    "Goreeni",
    "Jhangra",
    "Langra",
    "Langrial",
    "Majuhan",
    "Nara",
  ],
  Hawlian: ["City Area", "College Road", "Main Bazaar"],
  Khanpur: ["Khanpur City", "Bhamala", "Dam Side"],
};

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
  const isResidentialType =
    searchData.propertyType === "House" || searchData.propertyType === "Apartment";

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
              <select
                value={searchData.city}
                onChange={(e) =>
                  setSearchData({
                    ...searchData,
                    city: e.target.value,
                    area: "",
                  })
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
                value={searchData.area}
                onChange={(e) =>
                  setSearchData({ ...searchData, area: e.target.value })
                }
                disabled={!searchData.city}
                className="px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="">Select Area</option>
                {(areasByCity[searchData.city] ?? []).map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>

              <select
                value={searchData.propertyType}
                onChange={(e) =>
                  setSearchData({
                    ...searchData,
                    propertyType: e.target.value,
                    bedrooms:
                      e.target.value === "House" || e.target.value === "Apartment"
                        ? searchData.bedrooms
                        : "",
                    coveredArea: e.target.value === "Commercial" ? searchData.coveredArea : "",
                    plotSize: e.target.value === "Plot" ? searchData.plotSize : "",
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
              ) : searchData.propertyType === "Commercial" ? (
                <input
                  type="text"
                  placeholder="Covered Area (sqft)"
                  value={searchData.coveredArea}
                  onChange={(e) =>
                    setSearchData({ ...searchData, coveredArea: e.target.value })
                  }
                  className="px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm sm:text-base"
                />
              ) : searchData.propertyType === "Plot" ? (
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
