import LegalPage from "@/components/LegalPage";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This Privacy Policy explains how EasyRaabta.com collects and uses information."
      sections={[
        {
          title: "Information We Collect",
          body: [
            "We may collect basic information such as name, phone number, email address, location, property details, and images.",
          ],
        },
        {
          title: "How We Use Information",
          body: [
            "We use the collected information to create and manage user accounts, display property listings, improve user experience, and prevent fraud and misuse.",
          ],
        },
        {
          title: "Data Sharing",
          body: [
            "We do not sell or misuse user data. Information may only be shared with other users as part of listings or when required by law.",
          ],
        },
        {
          title: "Cookies & Tracking",
          body: [
            "We may use cookies and analytics tools to improve website performance.",
          ],
        },
      ]}
    />
  );
}
