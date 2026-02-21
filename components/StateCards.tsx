const stats = [
  { number: "3000+", label: "Properties Listed" },
  { number: "1500+", label: "Happy Customers" },
  { number: "300+", label: "Verified Dealers" },
  { number: "2", label: "Cities Covered" },
];

interface StatCardProps {
  number: string;
  label: string;
}

function StatCard({ number, label }: StatCardProps) {
  return (
    <div className="text-center p-4 sm:p-6">
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-600 mb-1 sm:mb-2">{number}</div>
      <div className="text-gray-600 text-sm sm:text-base">{label}</div>
    </div>
  );
}

export default function StateCards() {
  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} number={stat.number} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
