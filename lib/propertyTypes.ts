export const propertyTypes = [
  "Houses",
  "Apartments & Flats",
  "Portions & Floors",
  "Plots (Residential)",
  "Plots (Commercial)",
  "Shops",
  "Offices",
  "Commercial Spaces (Plaza / Building)",
  "Agricultural Land / Farms",
  "Farmhouses",
] as const;

export type PropertyType = (typeof propertyTypes)[number];

export const legacyPropertyTypeMap: Record<string, PropertyType> = {
  House: "Houses",
  house: "Houses",
  Apartment: "Apartments & Flats",
  apartment: "Apartments & Flats",
  Plot: "Plots (Residential)",
  plot: "Plots (Residential)",
  Commercial: "Commercial Spaces (Plaza / Building)",
  commercial: "Commercial Spaces (Plaza / Building)",
};

export function normalizePropertyType(value?: string) {
  if (!value) return "Houses";
  return legacyPropertyTypeMap[value] ?? value;
}

export function isBedroomPropertyType(value: string) {
  return [
    "Houses",
    "Apartments & Flats",
    "Portions & Floors",
    "Farmhouses",
  ].includes(value);
}

export function isCoveredAreaPropertyType(value: string) {
  return [
    "Shops",
    "Offices",
    "Commercial Spaces (Plaza / Building)",
  ].includes(value);
}

export function isPlotPropertyType(value: string) {
  return [
    "Plots (Residential)",
    "Plots (Commercial)",
    "Agricultural Land / Farms",
  ].includes(value);
}
