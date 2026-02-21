export default function VideoP() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
              How EasyRabta Works
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg mb-1 text-gray-800">
                    Create Your Account
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Sign up as a dealer or property owner in minutes
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg mb-1 text-gray-800">
                    List Your Property
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Add photos, details, and submit for approval
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-base sm:text-lg mb-1 text-gray-800">
                    Connect with Buyers
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Receive inquiries and close deals quickly
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="overflow-hidden bg-white rounded-lg shadow-md border border-gray-100">
              <video
                className="w-full h-48 sm:h-56 object-cover"
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
              <div className="p-4 sm:p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Property Tour Reel
                </h3>
                <p className="text-sm text-gray-600">
                  Modern interiors and premium neighborhood highlights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
