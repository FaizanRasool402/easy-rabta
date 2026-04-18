import Link from "next/link";
import type { IconType } from "react-icons";
import {
  FiBriefcase,
  FiFileText,
  FiGrid,
  FiHome,
  FiLayers,
  FiMap,
  FiMapPin,
  FiPackage,
  FiShoppingBag,
  FiTool,
} from "react-icons/fi";

type PropertyTypeCard = {
  title: string;
  subtitle: string;
  href: string;
  icon: IconType;
  accent: string;
  iconBg: string;
};

const propertyTypes: PropertyTypeCard[] = [
  {
    title: "Houses",
    subtitle: "Family homes",
    href: "/buy?propertyType=House",
    icon: FiHome,
    accent: "from-emerald-500/20 to-teal-500/10",
    iconBg: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Apartments",
    subtitle: "Flats and units",
    href: "/buy?propertyType=Apartment",
    icon: FiGrid,
    accent: "from-sky-500/20 to-cyan-500/10",
    iconBg: "bg-sky-100 text-sky-700",
  },
  {
    title: "Portions",
    subtitle: "Upper and lower",
    href: "/buy?propertyType=Portion",
    icon: FiLayers,
    accent: "from-amber-500/20 to-orange-500/10",
    iconBg: "bg-amber-100 text-amber-700",
  },
  {
    title: "Shops",
    subtitle: "Retail spaces",
    href: "/commercial",
    icon: FiShoppingBag,
    accent: "from-rose-500/20 to-pink-500/10",
    iconBg: "bg-rose-100 text-rose-700",
  },
  {
    title: "Commercial",
    subtitle: "Business property",
    href: "/commercial",
    icon: FiBriefcase,
    accent: "from-violet-500/20 to-fuchsia-500/10",
    iconBg: "bg-violet-100 text-violet-700",
  },
  {
    title: "Residential Plots",
    subtitle: "Build your home",
    href: "/plots",
    icon: FiMapPin,
    accent: "from-teal-500/20 to-emerald-500/10",
    iconBg: "bg-teal-100 text-teal-700",
  },
  {
    title: "Industrial",
    subtitle: "Factory land",
    href: "/commercial",
    icon: FiTool,
    accent: "from-slate-500/20 to-gray-500/10",
    iconBg: "bg-slate-100 text-slate-700",
  },
  {
    title: "Agricultural Land",
    subtitle: "Farm and fields",
    href: "/plots",
    icon: FiMap,
    accent: "from-lime-500/20 to-green-500/10",
    iconBg: "bg-lime-100 text-lime-700",
  },
  {
    title: "Files",
    subtitle: "Documentation",
    href: "/contact",
    icon: FiFileText,
    accent: "from-yellow-500/20 to-amber-500/10",
    iconBg: "bg-yellow-100 text-yellow-700",
  },
  {
    title: "Offices",
    subtitle: "Work-ready spaces",
    href: "/commercial",
    icon: FiPackage,
    accent: "from-indigo-500/20 to-blue-500/10",
    iconBg: "bg-indigo-100 text-indigo-700",
  },
];

export default function PropertyTypeSection() {
  return (
    <section className="bg-white px-4 py-14 sm:py-16">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">
              Browse Categories
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Search by Property Type
            </h2>
          </div>
          <p className="max-w-xl text-sm text-gray-600 sm:text-base">
            Popular property categories arranged in a quick-access grid so users can
            jump straight to the kind of listing they need.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {propertyTypes.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`group relative overflow-hidden rounded-[1.75rem] border border-gray-200 bg-gradient-to-br ${item.accent} p-4 transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg sm:p-5`}
              >
                <div className="absolute inset-x-0 top-0 h-24 bg-white/65 backdrop-blur-[1px]" />
                <div className="relative">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.iconBg} shadow-sm`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="mt-5">
                    <h3 className="text-lg font-bold leading-snug text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">{item.subtitle}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
