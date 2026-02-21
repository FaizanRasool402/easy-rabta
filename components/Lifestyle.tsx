import Image from "next/image";

export default function Lifestyle() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Neighborhood Lifestyle
          </h2>
          <p className="text-base sm:text-lg text-gray-600 px-2">
            Experience local vibe and amenities around top listings
          </p>
        </div>
        <div className="overflow-hidden bg-white rounded-lg shadow-md border border-gray-100">
          <Image
            src="/images/Islamabadd.jpg"
            alt="Islamabad Neighborhood"
            width={1920}
            height={1080}
            className="w-full h-48 sm:h-64 md:h-80 object-cover"
          />
        </div>
      </div>
    </section>
  );
}
