import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PropertyImageGallery from "@/components/PropertyImageGallery";
import PropertyInquiryButton from "@/components/PropertyInquiryButton";
import { propertyGalleryImages } from "@/lib/propertyImage";

type PropertyDetailPageProps = {
  params: Promise<{ id: string }>;
};

type PublicProperty = {
  _id?: string;
  title?: string;
  purpose?: "sell" | "rent";
  propertyType?: string;
  city?: string;
  area?: string;
  address?: string;
  price?: number | string;
  tag?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSize?: string;
  coveredArea?: string;
  plotSize?: string;
  description?: string;
  contactName?: string;
  contactPhone?: string;
  images?: string[];
  isPaidListing?: boolean;
  paymentStatus?: string;
  totalViews?: number;
  createdAt?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://easyraabta.com";

function formatPrice(value?: number | string, purpose?: "sell" | "rent") {
  const amount = new Intl.NumberFormat("en-PK").format(Number(value ?? 0));
  return purpose === "rent" ? `PKR ${amount} / month` : `PKR ${amount}`;
}

function mediaUrl(path?: string) {
  if (!path) return "/images/three.jpg";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  if (path.startsWith("/api/") || path.startsWith("/uploads/")) {
    return `${API_BASE_URL}${path}`;
  }
  return path;
}

async function getProperty(id: string): Promise<PublicProperty | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/properties/public/${id}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;

    const data = (await response.json()) as { property?: PublicProperty };
    return data.property ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return {
      title: "Property Not Found | Easy Raabta",
    };
  }

  const title = `${property.title ?? "Property"} | Easy Raabta`;
  const description =
    property.description ||
    `${property.propertyType ?? "Property"} in ${property.city ?? "Pakistan"}`;
  const firstImage = property.images?.[0];

  return {
    title,
    description,
    alternates: {
      canonical: `/properties/${id}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/properties/${id}`,
      type: "article",
      images: [{ url: mediaUrl(firstImage) }],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    notFound();
  }

  const images = propertyGalleryImages(property.images).map(mediaUrl);
  const purposeLabel = property.purpose === "rent" ? "For Rent" : "For Sale";
  const size =
    property.areaSize || property.plotSize || property.coveredArea || "Size not specified";
  const specs = [
    property.propertyType,
    size,
    property.bedrooms ? `${property.bedrooms} Beds` : "",
    property.bathrooms ? `${property.bathrooms} Baths` : "",
  ].filter(Boolean);

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-8 dark:bg-slate-950">
        <article className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-wrap items-center gap-3 text-sm">
            <Link
              href={property.purpose === "rent" ? "/rent" : "/buy"}
              className="font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300"
            >
              {property.purpose === "rent" ? "Rent listings" : "Buy listings"}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 dark:text-slate-300">
              {property.title ?? "Property"}
            </span>
          </div>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_420px]">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <PropertyImageGallery
                images={images}
                title={property.title ?? "Property"}
                className="h-[320px] w-full object-cover sm:h-[460px]"
              />
            </div>

            <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white">
                  {purposeLabel}
                </span>
                {property.isPaidListing || property.paymentStatus === "verified" ? (
                  <span className="rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-amber-950">
                    Premium
                  </span>
                ) : null}
              </div>

              <h1 className="mt-5 text-3xl font-bold leading-tight text-gray-900 dark:text-slate-100">
                {property.title ?? "Untitled property"}
              </h1>
              <p className="mt-3 text-base text-gray-600 dark:text-slate-300">
                {[property.city, property.area].filter(Boolean).join(", ")}
              </p>
              {property.address ? (
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                  {property.address}
                </p>
              ) : null}
              <p className="mt-5 text-3xl font-extrabold text-emerald-700 dark:text-emerald-300">
                {formatPrice(property.price, property.purpose)}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2">
                {specs.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <PropertyInquiryButton
                propertyTitle={property.title ?? "Property"}
                contactPhone={property.contactPhone}
                shareUrl={`/properties/${id}`}
              />
            </aside>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                Description
              </h2>
              <p className="mt-4 whitespace-pre-line text-base leading-7 text-gray-700 dark:text-slate-300">
                {property.description || "No description provided."}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                Contact
              </h2>
              <div className="mt-4 space-y-3 text-sm text-gray-700 dark:text-slate-300">
                <p>
                  <span className="font-semibold text-gray-900 dark:text-slate-100">
                    Name:
                  </span>{" "}
                  {property.contactName || "Property owner"}
                </p>
                <p>
                  <span className="font-semibold text-gray-900 dark:text-slate-100">
                    Phone:
                  </span>{" "}
                  {property.contactPhone || "Not provided"}
                </p>
                {property.totalViews ? (
                  <p>
                    <span className="font-semibold text-gray-900 dark:text-slate-100">
                      Views:
                    </span>{" "}
                    {new Intl.NumberFormat("en-PK").format(property.totalViews)}
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
