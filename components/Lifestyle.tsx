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
          <video
            className="w-full h-48 sm:h-64 md:h-80 object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source
              src="/images/12692911_1920_1080_60fps.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </div>
    </section>
  );
}
