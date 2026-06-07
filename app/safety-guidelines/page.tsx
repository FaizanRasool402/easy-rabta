import LegalPage from "@/components/LegalPage";

export default function SafetyGuidelinesPage() {
  return (
    <LegalPage
      title="Safety Guidelines"
      description="These Safety Guidelines help users meet, communicate, and make payments more carefully when using EasyRaabta.com."
      sections={[
        {
          title: "Safe Meetings",
          body: [
            "Always meet buyers and sellers in public places and safe, open locations.",
            "Avoid unknown or isolated places.",
          ],
        },
        {
          title: "Payment Safety",
          body: [
            "Always verify before any payment or transaction.",
            "Do not transfer money without proper confirmation.",
          ],
        },
        {
          title: "Personal Safety",
          body: [
            "Do not share sensitive personal or banking details.",
            "Take a trusted person when meeting strangers.",
          ],
        },
      ]}
    />
  );
}
