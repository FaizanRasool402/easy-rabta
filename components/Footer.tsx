import Link from "next/link";
import Image from "next/image";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 sm:gap-8">
          <div>
            <div className="max-w-[280px] rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.18)] backdrop-blur-sm">
              <Link href="/" className="inline-flex items-center">
                <div className="relative h-14 w-[210px] overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5">
                  <Image
                    src="/images/logo.png"
                    alt="Easy Raabta Logo"
                    fill
                    sizes="210px"
                    className="object-cover"
                    style={{ objectPosition: "center 52%" }}
                  />
                </div>
              </Link>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-400">
                Trusted Real Estate
              </p>
              <p className="mt-3 text-sm leading-7 text-gray-300 sm:text-base">
                Your trusted property rental and listing platform in Pakistan.
              </p>
              <p className="mt-3 text-sm text-gray-400">
                Connect today, succeed tomorrow.
              </p>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white sm:mb-4 sm:text-base">Quick Links</h4>
            <ul className="space-y-3 text-sm text-gray-300 sm:text-base">
              <li>
                <Link href="/about" className="hover:text-emerald-500 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-500 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-emerald-500 transition">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-500 transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white sm:mb-4 sm:text-base">Properties</h4>
            <ul className="space-y-3 text-sm text-gray-300 sm:text-base">
              <li>
                <Link href="/buy" className="hover:text-emerald-500 transition">
                  Buy Property
                </Link>
              </li>
              <li>
                <Link href="/rent" className="hover:text-emerald-500 transition">
                  Rent Property
                </Link>
              </li>
              <li>
                <Link href="/commercial" className="hover:text-emerald-500 transition">
                  Commercial
                </Link>
              </li>
              <li>
                <Link href="/plots" className="hover:text-emerald-500 transition">
                  Plots
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white sm:mb-4 sm:text-base">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-gray-300 sm:text-base">
                <FiPhone className="text-emerald-500 flex-shrink-0" size={20} />
                <a
                  href="tel:+923001234567"
                  className="ml-2 transition hover:text-emerald-400"
                >
                  +92 300 1234567
                </a>
              </li>
              <li className="flex items-center text-sm text-gray-300 sm:text-base">
                <FiMail className="text-emerald-500 flex-shrink-0" size={20} />
                <a
                  href="mailto:EasyRaabta@gmail.com"
                  className="ml-2 transition hover:text-emerald-400"
                >
                  EasyRaabta@gmail.com
                </a>
              </li>
              <li className="flex items-center text-sm text-gray-300 sm:text-base">
                <FiMapPin className="text-emerald-500 flex-shrink-0" size={20} />
                <span className="ml-2">Multiple Cities, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm sm:text-base">
          <p>&copy; 2026 Easy Raabta. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
