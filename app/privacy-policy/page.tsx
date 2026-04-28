import LegalPage from "@/components/LegalPage";
import { contactPhoneDisplay } from "@/lib/contact";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This Privacy Policy explains how Easy Raabta collects, uses, and protects information when you use our property listing platform."
      sections={[
        {
          title: "Information We Collect",
          body: [
            "We may collect your name, email address, phone number, account details, property listing details, inquiry messages, uploaded images or videos, and basic usage information needed to operate the platform.",
            "If you contact us through forms, WhatsApp, phone, or email, we may keep the information you provide so we can respond to your request.",
          ],
        },
        {
          title: "How We Use Information",
          body: [
            "We use information to create accounts, publish property listings, handle inquiries, moderate listings, improve the website, prevent abuse, and contact users about their account or property activity.",
            "Contact details attached to a property may be shown or used so buyers, tenants, owners, agents, and our team can communicate about listings.",
          ],
        },
        {
          title: "Sharing Information",
          body: [
            "We do not sell personal information. We may share necessary listing or contact information with users who interact with a property, with service providers who help run the platform, or when required by law.",
            "Public listing information, including property details, images, city, area, price, and selected contact details, may be visible to website visitors.",
          ],
        },
        {
          title: "Data Security",
          body: [
            "We use reasonable technical and organizational measures to protect stored information. No online system is completely secure, so users should avoid sharing sensitive financial or identity information in public listing text.",
          ],
        },
        {
          title: "Your Choices",
          body: [
            "You may update your profile and property details from your dashboard. You may also contact us to request correction or removal of information where applicable.",
          ],
        },
        {
          title: "Contact",
          body: [
            `For privacy questions, contact Easy Raabta at EasyRaabta@gmail.com or ${contactPhoneDisplay}.`,
          ],
        },
      ]}
    />
  );
}
