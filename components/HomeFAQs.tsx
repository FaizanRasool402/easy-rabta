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
    question: "Easy Raabta kya hai?",
    answer:
      "Easy Raabta ek trusted Pakistani property platform hai jahan aap Islamabad, Rawalpindi, Haripur, Abbottabad, Hawlian aur Khanpur mein properties buy, rent ya sell kar saktay hain. Hum verified listings provide kartay hain taakay buyers aur renters safe aur reliable deals kar sakain.",
  },
  {
    question: "Kya main Easy Raabta par apni property muft list kar sakta hoon?",
    answer:
      "Jee haan. Aap free account bana kar apni property list kar saktay hain. Har user 5 images aur 2 videos ke saath property post kar sakta hai. Aapki listing verified hone ke baad homepage par nazar aayegi.",
  },
  {
    question: "Kaunsi property types available hain?",
    answer:
      "Easy Raabta par aap Houses, Apartments & Flats, Portions & Floors, Plots (Residential & Commercial), Shops, Offices, Commercial Spaces (Plaza / Building), Agricultural Land / Farms, aur Farmhouses dekh aur list kar saktay hain.",
  },
  {
    question: "Kya yahan rent aur sale dono options hain?",
    answer:
      "Bilkul. Aap homepage search mein 'For Rent' ya 'For Sale' tab select kar ke apni zaroorat ke mutabiq properties filter kar saktay hain. Har listing par clearly mention hota hai ke property rent ke liye hai ya sale ke liye.",
  },
  {
    question: "Main property owner se seedha kaise contact kar sakta hoon?",
    answer:
      "Har property card par 'Send Inquiry' button hota hai. Aap apna naam, email aur message likh kar seedha owner ko inquiry bhej saktay hain. Owner aapse directly contact karega. Aap WhatsApp button se bhi hum tak pahunch saktay hain: +92 315 5759711.",
  },
  {
    question: "Kon konsi cities covered hain?",
    answer:
      "Abhi tak Islamabad, Rawalpindi, Haripur, Abbottabad, Hawlian aur Khanpur cover ho rahi hain. Hum regularly naye areas add kar rahay hain. Islamabad mein 1,800+ aur Rawalpindi mein 1,200+ listings available hain.",
  },
  {
    question: "Kya listings verified hoti hain?",
    answer:
      "Easy Raabta ka admin team sab properties ko review karta hai. Sirf approved listings visitors ko nazar aati hain. Yahi wajah hai ke hamaray 300+ verified dealers aur 1,500+ satisfied customers hain.",
  },
  {
    question: "Dealer account kaise banate hain?",
    answer:
      "Homepage ke CTA section ya login page par 'Register as Dealer' option mauood hai. Account banana bilkul muft hai. Register karne ke baad aap apni properties manage karne ke liye dashboard access kar saktay hain.",
  },
  {
    question: "Ek property mein kitni images ya videos upload ho sakti hain?",
    answer:
      "Aap ek property par maximum 5 images (har image 8 MB tak) aur 2 videos (har video 50 MB tak) upload kar saktay hain. Ziada images se buyers ko property behtar samajhne mein madad milti hai.",
  },
  {
    question: "Agar koi masla ho to kaise rabta karein?",
    answer:
      "Aap hamaray contact page par form fill kar saktay hain, email (EasyRaabta@gmail.com) kar saktay hain, ya phone/WhatsApp par +92 315 5759711 par seedha message kar saktay hain. Hum jald se jald jawab daingy.",
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
              Easy Raabta ke baare mein common sawaalon ke jawab
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
              Aur sawaal hain?
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Contact Karein
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
