"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import SuperAdminShell from "@/components/SuperAdminShell";
import { FiEdit3, FiExternalLink, FiPlus, FiTrash2, FiX } from "react-icons/fi";

type BlogSection = {
  heading: string;
  body: string;
};

type BlogRecord = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  image: string;
  content: BlogSection[];
  publishedAt?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000";

function emptySection(): BlogSection {
  return { heading: "", body: "" };
}

async function toDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

export default function SuperAdminBlogsPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Property Guide");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("");
  const [sections, setSections] = useState<BlogSection[]>([emptySection()]);
  const [blogs, setBlogs] = useState<BlogRecord[]>([]);
  const [editingBlogId, setEditingBlogId] = useState("");
  const [deletingBlogId, setDeletingBlogId] = useState("");
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBlogs() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/blogs`);
        if (!response.ok) return;
        const data = (await response.json()) as { blogs?: BlogRecord[] };
        setBlogs(data.blogs ?? []);
      } finally {
        setLoading(false);
      }
    }

    loadBlogs();
  }, []);

  function updateSection(index: number, field: keyof BlogSection, value: string) {
    setSections((prev) =>
      prev.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, [field]: value } : section
      )
    );
  }

  function removeSection(index: number) {
    setSections((prev) =>
      prev.length === 1 ? prev : prev.filter((_, sectionIndex) => sectionIndex !== index)
    );
  }

  function resetForm() {
    setTitle("");
    setCategory("Property Guide");
    setExcerpt("");
    setImage("");
    setSections([emptySection()]);
    setEditingBlogId("");
  }

  function startEdit(blog: BlogRecord) {
    setEditingBlogId(blog._id);
    setTitle(blog.title);
    setCategory(blog.category);
    setExcerpt(blog.excerpt);
    setImage(blog.image);
    setSections(blog.content?.length ? blog.content : [emptySection()]);
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setImage("");
      return;
    }

    setImage(await toDataUrl(file));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPublishing(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        editingBlogId
          ? `${API_BASE_URL}/api/blogs/${editingBlogId}`
          : `${API_BASE_URL}/api/blogs`,
        {
          method: editingBlogId ? "PUT" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, category, excerpt, image, content: sections }),
        }
      );

      const data = (await response.json()) as {
        message?: string;
        blog?: BlogRecord;
      };

      if (!response.ok) {
        setError(data.message ?? "Blog save failed.");
        return;
      }

      setMessage(data.message ?? "Blog post saved successfully.");
      if (data.blog) {
        setBlogs((prev) => {
          const exists = prev.some((blog) => blog._id === data.blog!._id);
          if (exists) {
            return prev.map((blog) =>
              blog._id === data.blog!._id ? data.blog! : blog
            );
          }
          return [data.blog!, ...prev];
        });
      }
      resetForm();
    } catch {
      setError("Network error. Please check if the backend server is running.");
    } finally {
      setPublishing(false);
    }
  }

  async function handleDelete(blog: BlogRecord) {
    const confirmed = window.confirm(
      `Delete "${blog.title}"? This will remove it from the public blog.`
    );
    if (!confirmed) return;

    setDeletingBlogId(blog._id);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/blogs/${blog._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(data.message ?? "Blog delete failed.");
        return;
      }

      setBlogs((prev) => prev.filter((item) => item._id !== blog._id));
      if (editingBlogId === blog._id) resetForm();
      setMessage(data.message ?? "Blog post deleted successfully.");
    } catch {
      setError("Network error. Please check if the backend server is running.");
    } finally {
      setDeletingBlogId("");
    }
  }

  return (
    <SuperAdminShell
      title="Blog Publisher"
      description="Only the super admin account can publish and edit blog posts. Use SEO-friendly titles, summaries, and clear article sections."
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5"
        >
          {editingBlogId ? (
            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-emerald-200">
                  Editing published blog
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  Saving will update the public blog page.
                </p>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
              >
                <FiX size={16} />
                Cancel Edit
              </button>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="SEO Title">
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                placeholder="Property Buying Checklist in Pakistan"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
              />
            </Field>
            <Field label="Category">
              <input
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                required
                placeholder="Buying Guide"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
              />
            </Field>
          </div>

          <Field label="Meta Description / Short Excerpt">
            <textarea
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              required
              rows={3}
              placeholder="Write a 140-160 character SEO summary for this blog."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-emerald-400"
            />
          </Field>

          <Field label="Blog Image">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required={!image}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-500 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-950"
            />
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt="Blog preview"
                className="mt-3 h-44 w-full rounded-xl object-cover"
              />
            ) : null}
          </Field>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-white">Article Sections</h2>
              <button
                type="button"
                onClick={() => setSections((prev) => [...prev, emptySection()])}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950"
              >
                <FiPlus size={16} />
                Add Section
              </button>
            </div>

            {sections.map((section, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-emerald-300">
                    Section {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    disabled={sections.length === 1}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Remove section"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
                <input
                  value={section.heading}
                  onChange={(event) =>
                    updateSection(index, "heading", event.target.value)
                  }
                  required
                  placeholder="SEO section heading"
                  className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
                />
                <textarea
                  value={section.body}
                  onChange={(event) =>
                    updateSection(index, "body", event.target.value)
                  }
                  required
                  rows={5}
                  placeholder="Write professional article content..."
                  className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none focus:border-emerald-400"
                />
              </div>
            ))}
          </div>

          {error ? (
            <p className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={publishing}
            className="mt-5 w-full rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {publishing
              ? editingBlogId
                ? "Updating..."
                : "Publishing..."
              : editingBlogId
                ? "Update Blog"
                : "Publish Blog"}
          </button>
        </form>

        <aside className="rounded-[1.75rem] border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-bold text-white">Published Blogs</h2>
          <div className="mt-4 space-y-3">
            {loading ? (
              <p className="text-sm text-slate-400">Loading blogs...</p>
            ) : blogs.length === 0 ? (
              <p className="text-sm text-slate-400">No uploaded blogs yet.</p>
            ) : (
              blogs.map((blog) => (
                <article
                  key={blog._id}
                  className={`rounded-2xl border bg-slate-950/70 p-4 transition ${
                    editingBlogId === blog._id
                      ? "border-emerald-400/60"
                      : "border-slate-800"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                    {blog.category}
                  </p>
                  <h3 className="mt-2 line-clamp-2 text-sm font-bold text-white">
                    {blog.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">
                    {blog.excerpt}
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <Link
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-800"
                    >
                      <FiExternalLink size={14} />
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => startEdit(blog)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-400"
                    >
                      <FiEdit3 size={14} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(blog)}
                      disabled={deletingBlogId === blog._id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/30 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiTrash2 size={14} />
                      {deletingBlogId === blog._id ? "..." : "Delete"}
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </aside>
      </div>
    </SuperAdminShell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mt-5 block">
      <span className="mb-2 block text-sm font-semibold text-slate-200">
        {label}
      </span>
      {children}
    </label>
  );
}
