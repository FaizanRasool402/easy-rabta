const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

const FALLBACK_IMAGE = "/images/three.jpg";

function extractUploadsPath(value: string) {
  const match = value.match(/\/uploads\/[^\s"']+/);
  return match?.[0] ?? null;
}

/** First uploaded image URL for listing cards, or null if none saved. */
export function resolvePropertyImageUrl(
  images?: string[] | null,
  apiBase: string = API_BASE_URL
): string | null {
  const path = images?.[0]?.trim();
  if (!path) {
    return null;
  }

  if (path.startsWith("data:")) {
    return path;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    if (path.includes("localhost")) {
      const uploadsPath = extractUploadsPath(path);
      if (uploadsPath) {
        const base = apiBase.replace(/\/$/, "");
        return `${base}${uploadsPath}`;
      }
    }
    return path;
  }

  if (path.startsWith("/uploads/")) {
    const base = apiBase.replace(/\/$/, "");
    return `${base}${path}`;
  }

  const base = apiBase.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/** Card image: user's upload when available, otherwise placeholder. */
export function propertyCardImage(
  images?: string[] | null,
  apiBase: string = API_BASE_URL
): string {
  return resolvePropertyImageUrl(images, apiBase) ?? FALLBACK_IMAGE;
}

export { FALLBACK_IMAGE };
