"use client";

import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiPhone, FiShare2 } from "react-icons/fi";

type PropertyInquiryButtonProps = {
  propertyTitle: string;
  contactPhone?: string;
  shareUrl?: string;
};

export default function PropertyInquiryButton({
  propertyTitle,
  contactPhone,
  shareUrl,
}: PropertyInquiryButtonProps) {
  const [copied, setCopied] = useState(false);

  const phoneHref = contactPhone?.replace(/[^\d+]/g, "") ?? "";
  const whatsappNumber = contactPhone?.replace(/\D/g, "").replace(/^0/, "92") ?? "";
  const whatsappText = encodeURIComponent(
    `Assalam o Alaikum, I want details for ${propertyTitle}.`
  );
  const hasContactPhone = Boolean(contactPhone);

  async function handleShare() {
    const resolvedShareUrl = shareUrl
      ? new URL(shareUrl, window.location.origin).toString()
      : window.location.href;
    const shareData = {
      title: propertyTitle,
      text: `Check this property: ${propertyTitle}`,
      url: resolvedShareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(resolvedShareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  return (
    <div
      className={`mt-4 grid gap-2 ${
        hasContactPhone ? "grid-cols-3" : "grid-cols-1"
      }`}
    >
      {hasContactPhone ? (
        <>
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
        </>
      ) : null}
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        <FiShare2 size={15} />
        {copied ? "Copied" : "Share"}
      </button>
    </div>
  );
}
