export type SavedProperty = {
  id: string,
  title: string,
  city: string,
  area: string,
  propertyType: string,
  bedrooms: number,
  price: number,
  size: string,
  image: string,
  purpose: "buy" | "rent",
};

const STORAGE_KEY = "easy-raabta-saved-properties";

export function getSavedProperties(): SavedProperty[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as SavedProperty[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isPropertySaved(id: string) {
  return getSavedProperties().some((property) => property.id === id);
}

export function toggleSavedProperty(property: SavedProperty) {
  const existing = getSavedProperties();
  const alreadySaved = existing.some((item) => item.id === property.id);
  const next = alreadySaved
    ? existing.filter((item) => item.id !== property.id)
    : [property, ...existing];

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return !alreadySaved;
}

export function removeSavedProperty(id: string) {
  const next = getSavedProperties().filter((property) => property.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
