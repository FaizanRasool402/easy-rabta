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
    question: "What is Easy Raabta?",
    answer:
      "Easy Raabta is a trusted Pakistani property platform where you can buy, rent, or sell properties across Islamabad, Rawalpindi, Haripur, Abbottabad, Hawlian, and Khanpur. We provide verified listings so buyers and renters can make safe and reliable deals.",
  },
  {
    question: "Can I list my property for free on Easy Raabta?",
    answer:
      "Yes, absolutely. You can create a free account and list your property right away. Each listing supports up to 5 images and 2 videos. Once your listing is verified by our admin team, it will appear on the homepage for everyone to see.",
  },
  {
    question: "What types of properties are available?",
    answer:
      "Easy Raabta covers a wide range of property types including Houses, Apartments & Flats, Portions & Floors, Plots (Residential & Commercial), Shops, Offices, Commercial Spaces (Plaza / Building), Agricultural Land / Farms, and Farmhouses.",
  },
  {
    question: "Are both rent and sale options available?",
    answer:
      "Yes. You can select the 'For Rent' or 'For Sale' tab in the homepage search to filter properties based on your need. Every listing clearly indicates whether it is available for rent or for sale.",
  },
  {
    question: "How can I contact a property owner directly?",
    answer:
      "Each property card has a 'Send Inquiry' button. You can enter your name, email, and message to send an inquiry directly to the owner, who will then get back to you. You can also reach us via WhatsApp at +92 315 5759711.",
  },
  {
    question: "Which cities are currently covered?",
    answer:
      "We currently cover Islamabad, Rawalpindi, Haripur, Abbottabad, Hawlian, and Khanpur. We are regularly adding new areas. Islamabad has 1,800+ listings and Rawalpindi has 1,200+ listings available.",
  },
  {
    question: "Are the listings verified?",
    answer:
      "Yes. Our admin team reviews every property before it goes live. Only approved listings are visible to visitors. This is why we have 300+ verified dealers and 1,500+ satisfied customers on our platform.",
  },
  {
    question: "How do I register as a dealer?",
    answer:
      "You can click 'Register as Dealer' on the homepage or the login page. Registration is completely free. Once registered, you can access your dashboard to post, manage, and track all your property listings.",
  },
  {
    question: "How many images and videos can I upload per property?",
    answer:
      "You can upload a maximum of 5 images (up to 8 MB each) and 2 videos (up to 50 MB each) per property listing. Adding more images helps buyers get a better understanding of the property.",
  },
  {
    question: "How can I get in touch if I have an issue?",
    answer:
      "You can fill out the form on our Contact page, send us an email at EasyRaabta@gmail.com, or reach us directly via phone or WhatsApp at +92 315 5759711. We will get back to you as soon as possible.",
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
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-300 sm:text-base">
              Answers to common questions about Easy Raabta
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
