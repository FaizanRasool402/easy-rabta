import { ReactNode } from "react";
import { FiSearch, FiShield, FiClock, FiTrendingUp } from "react-icons/fi";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md border border-gray-100 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-600 rounded-full mb-3 sm:mb-4 mx-auto">
        {icon}
      </div>
      <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-xs sm:text-sm">{description}</p>
    </div>
  );
}

const features = [
  {
    icon: <FiSearch className="w-8 h-8" />,
    title: "Easy Search",
    description: "Find your dream property with advanced filters",
  },
  {
    icon: <FiShield className="w-8 h-8" />,
    title: "Verified Listings",
    description: "All properties are verified by our admin team",
  },
  {
    icon: <FiClock className="w-8 h-8" />,
    title: "Quick Response",
    description: "Connect directly with property owners & dealers",
  },
  {
    icon: <FiTrendingUp className="w-8 h-8" />,
    title: "Best Deals",
    description: "Competitive prices from trusted dealers",
  },
];

export default function Feeatures() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 px-2">
            Why Choose EasyRabta?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 px-2">
            Your trusted partner in property search
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
