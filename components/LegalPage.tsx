import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

type LegalSection = {
  title: string;
  body: string[];
};

type LegalPageProps = {
  title: string;
  description: string;
  sections: LegalSection[];
};

export default function LegalPage({
  title,
  description,
  sections,
}: LegalPageProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10 dark:bg-slate-950 sm:py-14">
        <article className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">
            Easy Raabta
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-slate-100">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-slate-300 sm:text-base">
            {description}
          </p>

          <div className="mt-8 space-y-7">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-7 text-gray-600 dark:text-slate-300 sm:text-base">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
