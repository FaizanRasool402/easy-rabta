"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PropertyImageGallery from "@/components/PropertyImageGallery";
import PropertyInquiryButton from "@/components/PropertyInquiryButton";
import { propertyGalleryImages } from "@/lib/propertyImage";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

type PublicProperty = {
  _id?: string;
  title?: string;
  city?: string;
  area?: string;
  price?: number | string;
  purpose?: "sell" | "rent";
  propertyType?: string;
  bedrooms?: number;
  areaSize?: string;
  plotSize?: string;
  images?: string[];
  contactPhone?: string;
  isPaidListing?: boolean;
  paymentStatus?: string;
};

type ListingCard = {
  id: string;
  shareUrl?: string;
  title: string;
  city: string;
  area: string;
  price: number;
  purpose: "sell" | "rent";
  propertyType: string;
  bedrooms: number;
  size: string;
  image: string;
  images: string[];
  contactPhone?: string;
  isPaidListing?: boolean;
};

function formatPrice(value: number, purpose: "sell" | "rent") {
  const amount = new Intl.NumberFormat("en-PK").format(value);
  return purpose === "rent" ? `PKR ${amount} / month` : `PKR ${amount}`;
}

export default function LatestListings() {
  const [listings, setListings] = useState<ListingCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadListings() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/properties`);
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { properties?: PublicProperty[] };
        const normalized: ListingCard[] = (data.properties ?? []).slice(0, 6).map((property, index) => ({
          id: property._id ?? `listing-${index}`,
          shareUrl: property._id ? `/properties/${property._id}` : undefined,
          title: property.title ?? "Untitled property",
          city: property.city ?? "Unknown city",
          area: property.area ?? "Area not provided",
          price: Number(property.price ?? 0),
          purpose: (property.purpose === "rent" ? "rent" : "sell") as "rent" | "sell",
          propertyType: property.propertyType ?? "Property",
          bedrooms: Number(property.bedrooms ?? 0),
          size: property.areaSize || property.plotSize || "Size not specified",
          image: propertyGalleryImages(property.images)[0],
          images: propertyGalleryImages(property.images),
          contactPhone: property.contactPhone,
          isPaidListing:
            Boolean(property.isPaidListing) || property.paymentStatus === "verified",
        }));

        setListings(normalized);
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, []);

  if (loading) {
    return (
      <section className="bg-white px-4 py-14">
        <div className="mx-auto max-w-7xl rounded-3xl border border-gray-200 p-6 shadow-sm sm:p-8">
          <div className="h-8 w-56 animate-pulse rounded bg-gray-200" />
        </div>
      </section>
    );
  }

  if (listings.length === 0) {
    return null;
  }

  return (
    <section className="bg-white px-4 py-14">
      <div className="mx-auto max-w-7xl rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">
              Latest Listings
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Recently Added Properties
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
              New properties posted by users appear here so visitors can explore the
              latest listings right from the homepage.
            </p>
          </div>
          <Link
            href="/featured"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            View All Listings
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <article
              key={listing.id}
              className="overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative">
                <PropertyImageGallery
                  images={listing.images}
                  title={listing.title}
                  className="h-56 w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  {listing.purpose === "rent" ? "For Rent" : "For Sale"}
                </span>
                {listing.isPaidListing ? (
                  <span className="absolute right-4 top-4 rounded-full bg-amber-400 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-amber-950">
                    Premium
                  </span>
                ) : null}
              </div>

              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                  {listing.propertyType}
                </p>
                <h3 className="mt-3 text-2xl font-bold leading-tight text-gray-900">
                  {listing.title}
                </h3>
                <p className="mt-3 text-base text-gray-600">
                  {listing.city}, {listing.area}
                </p>
                <p className="mt-5 text-3xl font-bold text-gray-900">
                  {formatPrice(listing.price, listing.purpose)}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-700">
                    {listing.size}
                  </span>
                  {listing.bedrooms > 0 ? (
                    <span className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-gray-700">
                      {listing.bedrooms} Beds
                    </span>
                  ) : null}
                </div>

                <PropertyInquiryButton
                  propertyTitle={listing.title}
                  contactPhone={listing.contactPhone}
                  shareUrl={listing.shareUrl}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
