import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogPosts, getBlogPost } from "@/lib/blogPosts";

type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

type BlogPost = (typeof blogPosts)[number];

type ApiBlogPost = Omit<BlogPost, "date"> & {
  publishedAt?: string;
  authorName?: string;
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

async function getUploadedBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blogs/${slug}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;

    const data = (await response.json()) as { blog?: ApiBlogPost };
    if (!data.blog) return null;

    return {
      ...data.blog,
      date: formatBlogDate(data.blog.publishedAt),
    };
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug) ?? (await getUploadedBlogPost(slug));

  if (!post) {
    return {
      title: "Blog Post Not Found | Easy Raabta",
    };
  }

  return {
    title: `${post.title} | Easy Raabta`,
    description: post.excerpt,
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug) ?? (await getUploadedBlogPost(slug));

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);
  const wordCount = post.content
    .map((section) => section.body)
    .join(" ")
    .split(/\s+/).length;
  const readTime = `${Math.max(2, Math.ceil(wordCount / 180))} min read`;

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-slate-950">
        <article>
          <section className="relative min-h-[560px] overflow-hidden bg-slate-950 px-4 py-10 text-white sm:py-16">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/15" />

            <div className="relative mx-auto flex min-h-[440px] max-w-7xl flex-col justify-end">
              <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/75">
                <Link href="/" className="transition hover:text-white">
                  Home
                </Link>
                <span>/</span>
                <Link href="/blog" className="transition hover:text-white">
                  Blog
                </Link>
                <span>/</span>
                <span className="text-white">Article</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                <span className="rounded-full bg-emerald-500 px-3 py-1 text-white">
                  {post.category}
                </span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-white/90">
                  {post.date}
                </span>
                <span className="rounded-full bg-white/15 px-3 py-1 text-white/90">
                  {readTime}
                </span>
              </div>

              <h1 className="mt-6 max-w-5xl text-4xl font-bold leading-tight sm:text-6xl">
                {post.title}
              </h1>
              <p className="mt-6 max-w-4xl text-lg leading-9 text-white/85 sm:text-xl">
                {post.excerpt}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/15 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sm font-bold text-emerald-700">
                  ER
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    Easy Raabta Editorial
                  </p>
                  <p className="text-sm text-white/70">
                    Property guidance for buyers, tenants, owners, and dealers
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 py-12 sm:py-16">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,900px)_320px] xl:gap-10">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-10">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 dark:border-emerald-500/20 dark:bg-emerald-500/10 sm:p-7">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                    Quick Summary
                  </p>
                  <p className="mt-4 text-base leading-8 text-gray-700 dark:text-slate-300 sm:text-lg">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-10 space-y-10 text-lg leading-9 text-gray-700 dark:text-slate-300">
                  {post.content.map((paragraph, index) => (
                    <section
                      key={paragraph.heading}
                      id={`section-${index + 1}`}
                      className="scroll-mt-28"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                          {index + 1}
                        </span>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                          {paragraph.heading}
                        </h2>
                      </div>
                      <p className="text-gray-700 dark:text-slate-300">
                        {paragraph.body}
                      </p>
                      <div className="mt-7 h-px bg-gray-100 dark:bg-slate-800" />
                    </section>
                  ))}
                </div>

                <div className="mt-10 grid gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                      Next Step
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-slate-100">
                      Need property help?
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-slate-300">
                      Browse verified listings, post your property, or contact
                      Easy Raabta for listing support.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:min-w-48">
                    <Link
                      href="/buy"
                      className="inline-flex justify-center rounded-lg border border-emerald-600 px-5 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:text-emerald-300"
                    >
                      Browse Properties
                    </Link>
                    <Link
                      href="/post-property"
                      className="inline-flex justify-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                      + Post Free Ad
                    </Link>
                  </div>
                </div>
              </div>

              <aside className="h-fit space-y-5 lg:sticky lg:top-24">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400">
                    Article Info
                  </p>
                  <dl className="mt-4 space-y-4 text-sm">
                    <div>
                      <dt className="font-semibold text-gray-900 dark:text-slate-100">
                        Category
                      </dt>
                      <dd className="mt-1 text-gray-600 dark:text-slate-300">
                        {post.category}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-gray-900 dark:text-slate-100">
                        Published
                      </dt>
                      <dd className="mt-1 text-gray-600 dark:text-slate-300">
                        {post.date}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-gray-900 dark:text-slate-100">
                        Reading Time
                      </dt>
                      <dd className="mt-1 text-gray-600 dark:text-slate-300">
                        {readTime}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400">
                    In This Article
                  </p>
                  <nav className="mt-4 space-y-3">
                    {post.content.map((section, index) => (
                      <a
                        key={section.heading}
                        href={`#section-${index + 1}`}
                        className="block rounded-lg border border-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-500/30 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300"
                      >
                        {section.heading}
                      </a>
                    ))}
                  </nav>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 shadow-sm dark:border-emerald-500/20 dark:bg-emerald-500/10">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                    Have a property question?
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-slate-300">
                    Talk to the Easy Raabta team for listing and inquiry
                    support.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-4 block rounded-lg bg-emerald-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Talk to Easy Raabta
                  </Link>
                </div>
              </aside>
            </div>

            <div className="mx-auto mt-14 max-w-7xl">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                    Keep Reading
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-gray-900 dark:text-slate-100">
                    Related Articles
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300"
                >
                  View all articles
                </Link>
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {relatedPosts.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/blog/${item.slug}`}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="relative aspect-[16/11] bg-gray-100">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                        {item.category}
                      </p>
                      <h3 className="mt-3 text-lg font-bold text-gray-900 group-hover:text-emerald-700 dark:text-slate-100 dark:group-hover:text-emerald-300">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600 dark:text-slate-300">
                        {item.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
