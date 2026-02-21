import Image from "next/image";
import { FaStar } from "react-icons/fa";

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
    <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-100">
      <div className="flex gap-2 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <FaStar key={i} className="w-5 h-5 text-amber-400" />
        ))}
      </div>
      <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">&quot;{testimonial.text}&quot;</p>
      <div className="flex items-center gap-3 sm:gap-4">
        <Image
          src={testimonial.image}
          alt={testimonial.name}
          width={48}
          height={48}
          className="rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-800">{testimonial.name}</p>
          <p className="text-sm text-gray-600">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 px-2">
            What Our Clients Say
          </h2>
          <p className="text-base sm:text-lg text-gray-600 px-2">
            Real stories from real people
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
