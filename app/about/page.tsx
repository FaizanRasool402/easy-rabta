import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900">About EasyRabta</h1>
          <p className="mt-2 text-gray-600">
            EasyRabta is a property listing platform for buying and renting in Pakistan.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
