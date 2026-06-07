"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogPosts } from "@/lib/blogPosts";

type BlogCard = {
  _id?: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
  publishedAt?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

function formatBlogDate(value?: string) {
  if (!value) return "April 28, 2026";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function BlogPage() {
  const [uploadedBlogs, setUploadedBlogs] = useState<BlogCard[]>([]);

  useEffect(() => {
    async function loadUploadedBlogs() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/blogs`);
        if (!response.ok) return;

        const data = (await response.json()) as { blogs?: BlogCard[] };
        setUploadedBlogs(
          (data.blogs ?? []).map((blog) => ({
            ...blog,
            date: formatBlogDate(blog.publishedAt),
          }))
        );
      } catch {}
    }

    loadUploadedBlogs();
  }, []);

  const posts = useMemo(() => {
    const uploadedSlugs = new Set(uploadedBlogs.map((post) => post.slug));
    return [
      ...uploadedBlogs,
      ...blogPosts.filter((post) => !uploadedSlugs.has(post.slug)),
    ];
  }, [uploadedBlogs]);

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10 dark:bg-slate-950 sm:py-14">
        <section className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">
              Easy Raabta Blog
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-slate-100 sm:text-4xl">
              Property Guides, Market Tips, and Listing Advice
            </h1>
            <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-slate-300 sm:text-base">
              Practical articles for buyers, tenants, owners, and dealers using
              Easy Raabta.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.title}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <article className="p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                      {post.category}
                    </span>
                    <span className="text-gray-400 dark:text-slate-500">
                      {post.date}
                    </span>
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-gray-900 transition group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-300">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-slate-300">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    Read details
                  </span>
                </article>
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-emerald-100 bg-emerald-50 p-6 dark:border-emerald-500/20 dark:bg-emerald-500/10">
            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">
              Need help with a listing?
            </h2>
            <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-slate-300">
              Contact the Easy Raabta team or post your property directly from
              your account.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex justify-center rounded-lg border border-emerald-600 px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:text-emerald-300"
              >
                Contact Us
              </Link>
              <Link
                href="/post-property"
                className="inline-flex justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                + Post Free Property
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
