import LegalPage from "@/components/LegalPage";

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      description="This Disclaimer explains the limits of Easy Raabta's responsibility for property listings, prices, availability, and third-party information."
      sections={[
        {
          title: "Listing Information",
          body: [
            "Property information on Easy Raabta may be submitted by owners, agents, or users. We try to keep listings useful, but we do not guarantee that every price, image, location, size, ownership detail, or availability status is complete, current, or error-free.",
          ],
        },
        {
          title: "No Legal or Financial Advice",
          body: [
            "Content on this website is for general property discovery only. It is not legal, tax, investment, or financial advice. Users should verify property documents, ownership, approvals, taxes, and payment terms through qualified professionals before making any decision.",
          ],
        },
        {
          title: "User Responsibility",
          body: [
            "Users are responsible for checking the identity of buyers, sellers, tenants, landlords, and agents before any meeting, payment, or agreement.",
            "Easy Raabta is not responsible for losses caused by fraudulent users, incorrect listing details, private agreements, or payments made outside the platform.",
          ],
        },
        {
          title: "External Links",
          body: [
            "The website may contain links to third-party websites, maps, WhatsApp, email, or phone services. We are not responsible for the content, policies, or actions of those third-party services.",
          ],
        },
      ]}
    />
  );
}
