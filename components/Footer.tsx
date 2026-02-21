import Link from "next/link";
import { FiHome, FiPhone, FiMail, FiMapPin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <FiHome className="text-emerald-500" size={32} />
              <span className="ml-2 text-xl font-bold text-white">
                EasyRabta
              </span>
            </Link>
            <p className="text-gray-400 text-sm sm:text-base">
              Your trusted property rental and listing platform in Pakistan.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-2 text-sm sm:text-base">
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
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Properties</h4>
            <ul className="space-y-2 text-sm sm:text-base">
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
            <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center">
                <FiPhone className="text-emerald-500 flex-shrink-0" size={20} />
                <span className="ml-2">+92 300 1234567</span>
              </li>
              <li className="flex items-center">
                <FiMail className="text-emerald-500 flex-shrink-0" size={20} />
                <span className="ml-2">info@easyrabta.pk</span>
              </li>
              <li className="flex items-center">
                <FiMapPin className="text-emerald-500 flex-shrink-0" size={20} />
                <span className="ml-2">Islamabad & Rawalpindi</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm sm:text-base">
          <p>&copy; 2026 EasyRabta. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
