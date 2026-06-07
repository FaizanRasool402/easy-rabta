"use client";

import { useState } from "react";
import Link from "next/link";
import { FiChevronDown, FiHelpCircle } from "react-icons/fi";

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
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

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
        open
          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30"
          : "border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
        aria-expanded={open}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
            {index + 1}
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-slate-100 sm:text-base">
            {faq.question}
          </span>
        </div>
        <FiChevronDown
          size={20}
          className={`mt-0.5 shrink-0 text-emerald-600 transition-transform duration-200 dark:text-emerald-400 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          <div className="ml-9 text-sm leading-7 text-gray-600 dark:text-slate-300 sm:text-base">
            {faq.answer}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomeFAQs() {
  return (
    <section className="bg-white py-12 dark:bg-slate-900 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8 text-center sm:mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
              <FiHelpCircle size={15} />
              FAQ
            </span>
            <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-slate-100 sm:text-3xl">
              Frequently Asked Questions (FAQs)
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-300 sm:text-base">
              Answers to common questions about EasyRaabta.com
            </p>
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} />
            ))}
          </div>

          {/* Bottom link */}
          <div className="mt-10 rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-center dark:border-emerald-900/40 dark:bg-emerald-950/20 sm:p-6">
            <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
              Still have questions?
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
