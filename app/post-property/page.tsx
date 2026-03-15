"use client";

import Navbar from "@/components/Navbar";
import PostPropertyForm from "@/components/PostPropertyForm";

export default function PostPropertyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-56px)] bg-gray-50 py-8 sm:min-h-[calc(100vh-64px)] sm:py-12">
        <section className="mx-auto w-full max-w-5xl px-4 sm:px-6">
          <PostPropertyForm />
        </section>
      </main>
    </>
  );
}
