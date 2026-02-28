"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type BuyProperty = {
  id: string;
  title: string;
  city: string;
  area: string;
  propertyType: string;
  bedrooms: number;
  price: number;
  size: string;
  image: string;
};

const properties: BuyProperty[] = [
  {
    id: "b1",
    title: "5 Marla Corner House in F-10",
    city: "Islamabad",
    area: "F-10",
    propertyType: "House",
    bedrooms: 4,
    price: 45000000,
    size: "5 Marla",
    image: "/images/one.jpg",
  },
  {
    id: "b2",
    title: "10 Marla Residential Plot in G-13",
    city: "Islamabad",
    area: "G-13",
    propertyType: "Plot",
    bedrooms: 0,
    price: 34000000,
    size: "10 Marla",
    image: "/images/two.jpg",
  },
  {
    id: "b3",
    title: "Luxury Apartment in Saddar",
    city: "Rawalpindi",
    area: "Saddar",
    propertyType: "Apartment",
    bedrooms: 3,
    price: 25000000,
    size: "1700 sqft",
    image: "/images/three.jpg",
  },
  {
    id: "b4",
    title: "Main Road Commercial Space",
    city: "Rawalpindi",
    area: "Satellite Town (All Blocks)",
    propertyType: "Commercial",
    bedrooms: 0,
    price: 62000000,
    size: "2100 sqft",
    image: "/images/rwalpindi.jpg",
  },
];

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function BuyPage() {
  const searchParams = useSearchParams();

  const filters = {
    city: searchParams.get("city") ?? "",
    area: searchParams.get("area") ?? "",
    propertyType: searchParams.get("propertyType") ?? "",
    bedrooms: searchParams.get("bedrooms") ?? "",
    minPrice: Number(searchParams.get("priceMin") ?? 0),
    maxPrice: Number(searchParams.get("priceMax") ?? 0),
  };

  const filtered = useMemo(() => {
    return properties.filter((property) => {
      if (filters.city && property.city !== filters.city) return false;
      if (filters.area && property.area !== filters.area) return false;
      if (filters.propertyType && property.propertyType !== filters.propertyType)
        return false;
      if (filters.bedrooms && String(property.bedrooms) !== filters.bedrooms)
        return false;
      if (filters.minPrice && property.price < filters.minPrice) return false;
      if (filters.maxPrice && property.price > filters.maxPrice) return false;
      return true;
    });
  }, [filters.area, filters.bedrooms, filters.city, filters.maxPrice, filters.minPrice, filters.propertyType]);

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-7xl space-y-5">
          <section className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-900">Buy Properties</h1>
            <p className="mt-2 text-gray-600">
              Verified listings with clear pricing and location details.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(filters)
                .filter(([, value]) => Boolean(value))
                .map(([key, value]) => (
                  <span
                    key={key}
                    className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                  >
                    {key}: {String(value)}
                  </span>
                ))}
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((property) => (
              <article
                key={property.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <Image
                  src={property.image}
                  alt={property.title}
                  width={700}
                  height={450}
                  className="h-52 w-full object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-900">{property.title}</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {property.city}, {property.area}
                  </p>
                  <p className="mt-3 text-xl font-extrabold text-emerald-700">
                    {formatPrice(property.price)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-gray-700">
                    <span className="rounded bg-gray-100 px-2.5 py-1">
                      {property.propertyType}
                    </span>
                    <span className="rounded bg-gray-100 px-2.5 py-1">{property.size}</span>
                    {property.bedrooms > 0 ? (
                      <span className="rounded bg-gray-100 px-2.5 py-1">
                        {property.bedrooms} Beds
                      </span>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </section>

          {filtered.length === 0 ? (
            <section className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
              No properties found for selected filters.
            </section>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
