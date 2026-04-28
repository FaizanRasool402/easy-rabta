import LegalPage from "@/components/LegalPage";
import { contactPhoneDisplay } from "@/lib/contact";

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      description="This policy explains how refunds and cancellations are handled for any paid Easy Raabta services, featured listings, promotions, or advertising packages."
      sections={[
        {
          title: "Free Listings",
          body: [
            "If a listing is posted for free, no refund applies. Users may edit, pause, or request removal of their listing according to the available platform features.",
          ],
        },
        {
          title: "Paid Promotions",
          body: [
            "For paid featured listings, advertisements, or promotional services, refunds are reviewed case by case. Once a promotion has started or a listing has received visibility, the fee may be non-refundable.",
          ],
        },
        {
          title: "Cancellations",
          body: [
            "Cancellation requests should be sent as soon as possible through our contact page, email, phone, or WhatsApp. If work has not started, we may cancel the service and process a refund where applicable.",
          ],
        },
        {
          title: "Incorrect or Rejected Listings",
          body: [
            "Easy Raabta may reject or remove listings that are misleading, duplicate, incomplete, illegal, abusive, or against our platform rules. Refund eligibility for rejected paid listings depends on the reason for rejection and whether promotion work had begun.",
          ],
        },
        {
          title: "Contact",
          body: [
            `For refund or cancellation requests, contact Easy Raabta at EasyRaabta@gmail.com or ${contactPhoneDisplay} with your name, phone number, listing details, and payment reference if applicable.`,
          ],
        },
      ]}
    />
  );
}
