"use client";

import { useState } from "react";
import ListingImage from "@/components/ListingImage";

type PropertyImageGalleryProps = {
  images: string[];
  title: string;
  className?: string;
};

export default function PropertyImageGallery({
  images,
  title,
  className = "h-52 w-full object-cover",
}: PropertyImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const safeImages = images.length > 0 ? images : ["/images/three.jpg"];
  const activeImage = safeImages[activeIndex] ?? safeImages[0];

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="block w-full cursor-zoom-in text-left"
        aria-label={`Open ${title} image`}
      >
        <ListingImage src={activeImage} alt={title} className={className} />
      </button>
      {safeImages.length > 1 ? (
        <div className="grid grid-cols-5 gap-1.5 bg-white p-2">
          {safeImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`overflow-hidden rounded-md border-2 transition ${
                activeIndex === index
                  ? "border-emerald-500"
                  : "border-transparent hover:border-emerald-200"
              }`}
              aria-label={`Show image ${index + 1}`}
            >
              <ListingImage
                src={image}
                alt={`${title} image ${index + 1}`}
                className="h-12 w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setIsOpen(false)}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setIsOpen(false);
            }}
            className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow"
          >
            Close
          </button>
          <ListingImage
            src={activeImage}
            alt={title}
            className="max-h-[88vh] max-w-[92vw] rounded-lg object-contain"
          />
        </div>
      ) : null}
    </div>
  );
}
