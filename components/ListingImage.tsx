"use client";

import { useEffect, useState } from "react";

const FALLBACK_IMAGE = "/images/three.jpg";

type ListingImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function ListingImage({ src, alt, className }: ListingImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || FALLBACK_IMAGE);

  useEffect(() => {
    setCurrentSrc(src || FALLBACK_IMAGE);
  }, [src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      width={600}
      height={400}
      loading="lazy"
      decoding="async"
      className={className}
      onError={() => {
        if (currentSrc !== FALLBACK_IMAGE) {
          setCurrentSrc(FALLBACK_IMAGE);
        }
      }}
    />
  );
}
