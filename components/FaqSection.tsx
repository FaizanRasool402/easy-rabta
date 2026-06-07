import Link from "next/link";
import { FiArrowRight, FiCheckCircle, FiHelpCircle } from "react-icons/fi";

const faqs = [
  {
    question: "What is EasyRaabta.com?",
    answer:
      "EasyRaabta.com is a platform where users can buy, sell, rent, and advertise properties, vehicles, jobs, services, and other classified listings across Pakistan.",
  },
  {
    question: "Is posting an ad on EasyRaabta.com free?",
    answer:
      "Yes. You can post your ad for free and connect directly with interested buyers, tenants, or customers.",
  },
  {
    question: "How do I post an ad?",
    answer:
      'Simply click the "Post Property for Free" or "Post Free Ad" button, create your listing, upload images, add details, and submit it for review.',
  },
  {
    question: "Do I need an account to post an ad?",
    answer:
      "Yes. Creating an account helps you manage your listings, respond to inquiries, and update your ads anytime.",
  },
  {
    question: "How long does it take for my ad to become visible?",
    answer:
      "Most ads are reviewed and published within a short time after submission, provided they comply with our posting guidelines.",
  },
  {
    question: "Can I edit or delete my ad after posting?",
    answer:
      'Yes. Log in to your account, go to "My Listings," and edit, renew, or delete your ad whenever needed.',
  },
  {
    question: "Are there any charges for selling property on EasyRaabta.com?",
    answer:
      "Basic property listings are free. Premium promotional options may be available for users who want additional visibility.",
  },
  {
    question: "How can buyers contact me?",
    answer:
      "Interested buyers can contact you using the phone number, WhatsApp, email, or contact options provided in your listing.",
  },
];

export default function FaqSection() {
  return (
    <section id="faqs" className="scroll-mt-24 bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
              <FiHelpCircle className="h-4 w-4" />
              FAQs
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-base leading-7 text-gray-600 sm:text-lg">
              Quick answers about posting, managing, and promoting ads on
              EasyRaabta.com.
            </p>
            <div className="mt-6 rounded-lg border border-emerald-100 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <FiCheckCircle className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Need more help?
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Contact our team for listing, account, or ad approval
                    questions.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    Contact support
                    <FiArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {faqs.map((item, index) => (
              <article
                key={item.question}
                className="group rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700 ring-1 ring-emerald-100">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <FiHelpCircle className="h-5 w-5 shrink-0 text-gray-300 transition group-hover:text-emerald-500" />
                </div>
                <h3 className="text-base font-semibold leading-6 text-gray-900 sm:text-lg">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
