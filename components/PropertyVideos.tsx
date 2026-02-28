"use client";

import { useMemo } from "react";
import { FiMapPin } from "react-icons/fi";

type VideoItem = {
  id: string;
  title: string;
  location: string;
  tag: string;
  poster: string;
  videoSrc: string;
};

const allVideos: VideoItem[] = [
  {
    id: "v1",
    title: "Modern Front Elevation Tour",
    location: "Islamabad",
    tag: "Trending",
    poster: "/images/one.jpg",
    videoSrc: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
  },
  {
    id: "v2",
    title: "Luxury Interior Walkthrough",
    location: "Rawalpindi",
    tag: "Premium",
    poster: "/images/two.jpg",
    videoSrc: "https://samplelib.com/lib/preview/mp4/sample-10s.mp4",
  },
  {
    id: "v3",
    title: "Family Home Quick Reel",
    location: "Haripur",
    tag: "New",
    poster: "/images/three.jpg",
    videoSrc: "/images/12692911_1920_1080_60fps.mp4",
  },
  {
    id: "v4",
    title: "Commercial Space Spotlight",
    location: "Abbottabad",
    tag: "Hot",
    poster: "/images/rwalpindi.jpg",
    videoSrc: "https://samplelib.com/lib/preview/mp4/sample-15s.mp4",
  },
  {
    id: "v5",
    title: "Neighborhood Drive-through",
    location: "Hawlian",
    tag: "Popular",
    poster: "/images/Islamabadd.jpg",
    videoSrc: "https://samplelib.com/lib/preview/mp4/sample-20s.mp4",
  },
];

function pickRandomVideos(count: number) {
  const shuffled = [...allVideos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function PropertyVideos() {
  const videos = useMemo(() => pickRandomVideos(3), []);

  return (
    <section className="bg-white py-12 dark:bg-slate-900 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              Video Gallery
            </p>
            <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-slate-100 sm:text-3xl">
              Featured Property Videos
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-slate-300 sm:text-base">
              Fresh real estate reels to explore layouts and location vibes.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {videos.map((video) => (
            <article
              key={video.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="relative">
                <video
                  src={video.videoSrc}
                  poster={video.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  preload="metadata"
                  className="h-56 w-full object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 sm:text-lg">
                  {video.title}
                </h3>
                <p className="mt-1 inline-flex items-center gap-1 text-sm text-gray-600 dark:text-slate-300">
                  <FiMapPin size={14} />
                  {video.location}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
