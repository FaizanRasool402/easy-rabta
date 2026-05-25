const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

/** First uploaded image URL for listing cards, or null if none saved. */
export function resolvePropertyImageUrl(
  images?: string[] | null,
  apiBase: string = API_BASE_URL
): string | null {
  const path = images?.[0];
  if (!path || !path.trim()) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }

  const base = apiBase.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/** Card image: user's upload when available, otherwise a neutral placeholder. */
export function propertyCardImage(
  images?: string[] | null,
  apiBase: string = API_BASE_URL
): string {
  return resolvePropertyImageUrl(images, apiBase) ?? "/images/three.jpg";
}
