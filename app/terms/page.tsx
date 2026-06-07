import LegalPage from "@/components/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      description="These Terms of Use explain the rules for using EasyRaabta.com."
      sections={[
        {
          title: "Acceptance",
          body: [
            "By using this platform, you agree to all terms and policies.",
          ],
        },
        {
          title: "User Content",
          body: [
            "Users are fully responsible for the content they post.",
          ],
        },
        {
          title: "Content Removal Rights",
          body: [
            "We reserve the right to remove fake listings, fraudulent or misleading content, and any misuse of the platform.",
          ],
        },
        {
          title: "No Guarantee",
          body: [
            "We do not guarantee the accuracy of listings or successful transactions.",
          ],
        },
        {
          title: "All Rights Reserved",
          body: [
            "All rights are reserved by EasyRaabta.com. We may update or change these policies at any time without prior notice.",
          ],
        },
      ]}
    />
  );
}
