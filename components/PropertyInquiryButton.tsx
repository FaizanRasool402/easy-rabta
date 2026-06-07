"use client";

import { FaWhatsapp } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";

type PropertyInquiryButtonProps = {
  propertyTitle: string;
  contactPhone?: string;
};

export default function PropertyInquiryButton({
  propertyTitle,
  contactPhone,
}: PropertyInquiryButtonProps) {
  if (!contactPhone) {
    return null;
  }

  const phoneHref = contactPhone.replace(/[^\d+]/g, "");
  const whatsappNumber = contactPhone.replace(/\D/g, "").replace(/^0/, "92");
  const whatsappText = encodeURIComponent(
    `Assalam o Alaikum, I want details for ${propertyTitle}.`
  );

  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      <a
        href={`tel:${phoneHref}`}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        <FiPhone size={15} />
        Call
      </a>
      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
      >
        <FaWhatsapp size={15} />
        WhatsApp
      </a>
    </div>
  );
}
