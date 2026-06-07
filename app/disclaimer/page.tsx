import LegalPage from "@/components/LegalPage";

export default function DisclaimerPage() {
  return (
    <LegalPage
      title="Disclaimer"
      description="This Disclaimer explains EasyRaabta.com's platform role and limits of responsibility."
      sections={[
        {
          title: "Platform Role Only",
          body: [
            "EasyRaabta.com is only a platform that connects buyers and sellers. We do not own, sell, or verify any listed property.",
          ],
        },
        {
          title: "No Responsibility for Listings",
          body: [
            "We are not responsible for the accuracy of property information, fraud, scams, fake listings, or any loss, damage, or disputes between users.",
          ],
        },
        {
          title: "User Responsibility (Important)",
          body: [
            "Users must verify all details before any payment or transaction.",
            "We strongly advise checking property ownership, documents, and seller/buyer identity before proceeding.",
          ],
        },
        {
          title: "No Liability",
          body: [
            "We are not responsible for any financial loss, fraud, or misunderstanding occurring between users.",
          ],
        },
      ]}
    />
  );
}
