import LegalPage from "@/components/LegalPage";
import { contactPhoneDisplay } from "@/lib/contact";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      description="These Terms & Conditions explain the rules for using Easy Raabta to browse, post, manage, and inquire about property listings."
      sections={[
        {
          title: "Use of the Platform",
          body: [
            "By using Easy Raabta, you agree to use the platform for lawful property-related activity only. You must not submit false, misleading, abusive, illegal, or unauthorized content.",
            "You are responsible for keeping your account details secure and for all activity performed through your account.",
          ],
        },
        {
          title: "Property Listings",
          body: [
            "Users who post listings are responsible for the accuracy of property details, images, price, location, ownership claims, contact information, and availability.",
            "Easy Raabta may edit, reject, hide, or remove listings that appear incomplete, misleading, duplicate, inappropriate, or against platform standards.",
          ],
        },
        {
          title: "Inquiries and Communication",
          body: [
            "Easy Raabta helps users connect through property inquiries, phone, WhatsApp, and contact forms. Any agreement, visit, token payment, rent, sale, commission, or transaction is handled directly between the relevant parties.",
            "Users should verify all parties and property documents before making payments or signing agreements.",
          ],
        },
        {
          title: "Availability and Changes",
          body: [
            "We may update, pause, or remove features at any time. We may also update these terms when needed. Continued use of the website means you accept the latest version.",
          ],
        },
        {
          title: "Contact",
          body: [
            `For questions about these terms, contact Easy Raabta at EasyRaabta@gmail.com or ${contactPhoneDisplay}.`,
          ],
        },
      ]}
    />
  );
}
