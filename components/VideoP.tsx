import { FiCheckCircle, FiEdit3, FiUserCheck } from "react-icons/fi";

export default function VideoP() {
  const steps = [
    {
      text: "Create account and verify your profile",
      icon: <FiUserCheck className="text-emerald-600 dark:text-emerald-400" size={20} />,
    },
    {
      text: "Add property details with media in minutes",
      icon: <FiEdit3 className="text-emerald-600 dark:text-emerald-400" size={20} />,
    },
    {
      text: "Get direct leads from serious buyers",
      icon: <FiCheckCircle className="text-emerald-600 dark:text-emerald-400" size={20} />,
    },
  ];

  return (
    <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-12 dark:from-slate-950 dark:to-slate-900 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/85 sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <div className="order-2 md:order-1">
              <p className="mb-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                Property Tour
              </p>
              <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-slate-100 sm:text-3xl md:text-4xl">
                How EasyRabta Works
              </h2>
              <p className="mb-6 text-sm text-gray-600 dark:text-slate-300 sm:text-base">
                Short walkthrough video dekhein aur listing process ko quickly samjhein.
              </p>
              <div className="space-y-3">
                {steps.map((step) => (
                  <div
                    key={step.text}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/30">
                      {step.icon}
                    </span>
                    <span>{step.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative mx-auto w-full max-w-[360px]">
                <div className="pointer-events-none absolute -inset-2 rounded-[2rem] bg-gradient-to-b from-emerald-400/25 to-transparent blur-xl" />
                <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-black p-2 shadow-2xl dark:border-slate-700">
                  <div className="aspect-[9/16] w-full overflow-hidden rounded-[1.5rem]">
                    <iframe
                      src="https://customer-leo8lubv91ct4vwd.cloudflarestream.com/1787ff53c6da29ad2d0b1629ba28a0f0/iframe?autoplay=true&muted=true&loop=true&preload=true&controls=false"
                      title="EasyRabta Property Video"
                      className="h-full w-full"
                      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                      allowFullScreen
                    />
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
                    Property Walkthrough
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-slate-300">
                    Auto-loop short reel for better first impression.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
