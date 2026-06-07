export type RawProperty = {
  _id?: string;
  title?: string;
  purpose?: string;
  propertyType?: string;
  city?: string;
  area?: string;
  price?: number | string;
  status?: string;
  createdAt?: string;
  totalViews?: number;
  dailyViews?: Array<{ date?: string; count?: number }>;
  images?: string[];
};

export type PropertyRecord = {
  id: string;
  title: string;
  purpose: string;
  propertyType: string;
  city: string;
  area: string;
  price: number;
  status: string;
  createdAt: string;
  totalViews: number;
  todayViews: number;
  images: string[];
};

export function normalizeProperty(property: RawProperty, index: number): PropertyRecord {
  const today = new Date().toISOString().slice(0, 10);

  return {
    id: property._id ?? `property-${index}`,
    title: property.title ?? "Untitled property",
    purpose: property.purpose ?? "sell",
    propertyType: property.propertyType ?? "Property",
    city: property.city ?? "Unknown city",
    area: property.area ?? "Area not provided",
    price: Number(property.price ?? 0),
    status: property.status ?? "active",
    createdAt: property.createdAt ?? "",
    totalViews: Number(property.totalViews ?? 0),
    todayViews: property.dailyViews?.find((item) => item.date === today)?.count ?? 0,
    images: property.images ?? [],
  };
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-PK").format(value);
}

export function buildPropertyFlags(property: PropertyRecord) {
  const flags: string[] = [];

  if (property.images.length === 0) flags.push("No image");
  if (!property.price) flags.push("Missing price");
  if (property.title === "Untitled property") flags.push("Weak title");
  if (!property.city || property.city === "Unknown city") flags.push("Missing city");
  if (!property.area || property.area === "Area not provided") flags.push("Missing area");
  if (flags.length === 0) flags.push("Manual review");

  return flags;
}

export function reviewReason(property: PropertyRecord) {
  const flags = buildPropertyFlags(property);
  return flags[0] ?? "Manual review";
}
