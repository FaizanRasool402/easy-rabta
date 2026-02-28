import { FiHome, FiMapPin, FiShield, FiUsers } from "react-icons/fi";

const stats = [
  { number: "3000+", label: "Properties Listed", icon: FiHome },
  { number: "1500+", label: "Happy Customers", icon: FiUsers },
  { number: "300+", label: "Verified Dealers", icon: FiShield },
  { number: "2", label: "Cities Covered", icon: FiMapPin },
];

interface StatCardProps {
  number: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

function StatCard({ number, label, icon: Icon }: StatCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-white p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 sm:p-6">
      <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-emerald-100/60 blur-xl dark:bg-emerald-900/30" />
      <span className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-900/40 sm:mb-4 sm:h-12 sm:w-12">
        <Icon size={22} />
      </span>
      <div className="mb-1 text-3xl font-bold text-emerald-600 dark:text-emerald-400 sm:mb-2 sm:text-4xl">
        {number}
      </div>
      <div className="text-sm font-medium text-gray-600 dark:text-slate-300 sm:text-base">
        {label}
      </div>
    </article>
  );
}

export default function StateCards() {
  return (
    <section className="bg-white py-8 dark:bg-slate-900 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 sm:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} number={stat.number} label={stat.label} icon={stat.icon} />
          ))}
        </div>
      </div>
    </section>
  );
}
