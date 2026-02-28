import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-12 sm:py-16 bg-emerald-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
          Ready to Find Your Dream Property?
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-emerald-100 mb-6 sm:mb-8 px-2">
          Join thousands of property seekers and dealers on our platform
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="inline-flex justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold bg-white text-emerald-600 hover:bg-emerald-50 transition text-sm sm:text-base"
          >
            Register as Dealer
          </Link>
          <Link
            href="/post-property"
            className="inline-flex justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold border-2 border-white text-white hover:bg-white hover:text-emerald-600 transition text-sm sm:text-base"
          >
            List Your Property
          </Link>
        </div>
      </div>
    </section>
  );
}
