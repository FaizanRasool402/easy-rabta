import Image from "next/image";
import Link from "next/link";

const cities_showcase = [
  {
    name: "Islamabad",
    properties: "1,800+",
    image:
      "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=600&h=400&fit=crop",
    areas: "F-6, F-7, F-8, G-9, G-10, G-11",
  },
  {
    name: "Rawalpindi",
    properties: "1,200+",
    image:
      "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=600&h=400&fit=crop",
    areas: "Bahria Town, DHA, Saddar, Satellite Town",
  },
];

export default function Cities() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Properties in Twin Cities
          </h2>
          <p className="text-base sm:text-lg text-gray-600 px-2">
            Explore properties in Islamabad and Rawalpindi
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {cities_showcase.map((city, index) => (
            <Link
              key={index}
              href={`/buy?city=${encodeURIComponent(city.name)}`}
              className="relative overflow-hidden group cursor-pointer block rounded-lg shadow-md"
            >
              <Image
                src={city.image}
                alt={city.name}
                width={600}
                height={400}
                className="w-full h-56 sm:h-64 md:h-80 object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                <h3 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{city.name}</h3>
                <p className="text-base sm:text-lg text-gray-200 mb-1 sm:mb-2">
                  {city.properties} Properties
                </p>
                <p className="text-xs sm:text-sm text-gray-300">
                  Popular Areas: {city.areas}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
