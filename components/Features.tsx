import Image from "next/image";
import Link from "next/link";

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  purpose: string;
}

const featuredProperties: Property[] = [
  {
    id: "1",
    title: "Luxury Villa in F-7",
    price: "85 Lakh",
    location: "Islamabad, F-7",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    bedrooms: 4,
    bathrooms: 3,
    area: "2,500 sqft",
    purpose: "sale",
  },
  {
    id: "2",
    title: "Modern Apartment in G-10",
    price: "45,000/mo",
    location: "Islamabad, G-10",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
    bedrooms: 3,
    bathrooms: 2,
    area: "1,800 sqft",
    purpose: "rent",
  },
  {
    id: "3",
    title: "Plot in Bahria Town",
    price: "1.2 Crore",
    location: "Rawalpindi, Bahria Town",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
    bedrooms: 0,
    bathrooms: 0,
    area: "1 Kanal",
    purpose: "sale",
  },
];

function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/property/${property.id}`}
      className="block overflow-hidden bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition"
    >
      <div className="relative h-40 sm:h-48">
        <Image
          src={property.image}
          alt={property.title}
          width={600}
          height={400}
          className="w-full h-full object-cover"
        />
        <span
          className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium ${
            property.purpose === "rent"
              ? "bg-emerald-600 text-white"
              : "bg-teal-600 text-white"
          }`}
        >
          {property.purpose === "rent" ? "For Rent" : "For Sale"}
        </span>
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-1">
          {property.title}
        </h3>
        <p className="text-emerald-600 font-bold text-lg sm:text-xl mb-2">
          Rs. {property.price}
        </p>
        <p className="text-gray-600 text-sm mb-3">{property.location}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500">
          {property.bedrooms > 0 && <span>{property.bedrooms} Beds</span>}
          {property.bathrooms > 0 && <span>{property.bathrooms} Baths</span>}
          <span>{property.area}</span>
        </div>
      </div>
    </Link>
  );
}

export default function Features() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Featured Properties
          </h2>
          <p className="text-base sm:text-lg text-gray-600 px-2">
            Handpicked properties just for you
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
}
