import Image from "next/image";
import { FaQuoteLeft, FaStar } from "react-icons/fa";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Ahmed Khan",
    role: "Property Owner",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    text: "Found the perfect tenant within 2 weeks! Excellent platform.",
    rating: 5,
  },
  {
    id: 2,
    name: "Fatima Ali",
    role: "Home Buyer",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    text: "Very easy to use. Got my dream house in Bahria Town!",
    rating: 5,
  },
  {
    id: 3,
    name: "Hassan Raza",
    role: "Real Estate Dealer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    text: "Best platform for dealers. Managing listings is so simple.",
    rating: 5,
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="w-[320px] shrink-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:w-[380px] sm:p-6 lg:w-[420px]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <FaStar key={i} className="h-5 w-5 text-amber-400" />
          ))}
        </div>
        <FaQuoteLeft className="h-4 w-4 text-emerald-500/70" />
      </div>

      <p className="mb-6 min-h-[96px] text-lg leading-8 text-gray-700 dark:text-slate-200">
        &quot;{testimonial.text}&quot;
      </p>

      <div className="flex items-center gap-4 border-t border-gray-100 pt-4 dark:border-slate-700">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          width={56}
          height={56}
          className="rounded-full object-cover ring-2 ring-emerald-100 dark:ring-emerald-900/40"
        />
        <div>
          <p className="text-xl font-semibold text-gray-800 dark:text-slate-100 sm:text-2xl">
            {testimonial.name}
          </p>
          <p className="text-sm text-gray-600 dark:text-slate-300">{testimonial.role}</p>
        </div>
      </div>
    </article>
  );
}

export default function Testimonials() {
  const movingTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="bg-white py-14 dark:bg-slate-900 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 text-center sm:mb-12">
          <h2 className="mb-2 px-2 text-3xl font-bold text-gray-800 dark:text-slate-100 sm:text-4xl">
            What Our Clients Say
          </h2>
          <p className="px-2 text-base text-gray-600 dark:text-slate-300 sm:text-lg">
            Real stories from real people
          </p>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white via-white/90 to-transparent dark:from-slate-900 dark:via-slate-900/90" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white via-white/90 to-transparent dark:from-slate-900 dark:via-slate-900/90" />

          <div className="overflow-hidden px-2">
            <div className="testimonials-marquee flex w-max items-stretch gap-5 py-1 sm:gap-6">
              {movingTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`${testimonial.id}-${index}`}
                  testimonial={testimonial}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
