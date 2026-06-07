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
  const safeImages = images.length > 0 ? images : ["/images/three.jpg"];
  const activeImage = safeImages[activeIndex] ?? safeImages[0];

  return (
    <div>
      <ListingImage src={activeImage} alt={title} className={className} />
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
    </div>
  );
}
