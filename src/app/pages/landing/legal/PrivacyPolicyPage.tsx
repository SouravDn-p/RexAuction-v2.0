import LegalPage from "./LegalPage";

const PrivacyPolicyPage = () => (
  <LegalPage
    kicker="Legal"
    title="Privacy Policy"
    updated="28 August 2026"
    intro="This policy explains how Rex Auction collects, uses, and stores information when you browse, register, bid, or sell on the platform. This is a product prototype: most data you enter stays in your browser and is not sent to a live production server."
    sections={[
      {
        heading: "1. Who we are",
        body: [
          "Rex Auction is an online auction marketplace operated for demonstration and product development. Contact: support@rex-auction.com · Dhaka, Bangladesh.",
        ],
      },
      {
        heading: "2. Information we collect",
        body: [
          "Account details you provide at sign-up: name, email, password, and optional profile photo.",
          "Bidding and listing activity shown in dashboards (currently mock records for preview).",
          "Device preferences such as theme (light/dark) and remembered email, stored in localStorage.",
          "Messages you send to the in-app assistant, if a Gemini endpoint is configured.",
        ],
      },
      {
        heading: "3. How we use information",
        body: [
          "To create and display your account, verify email via a one-time code, and show role dashboards.",
          "To operate auctions, wallets, and seller applications in the UI.",
          "We do not sell personal information. This prototype does not run production analytics or ad networks.",
        ],
      },
      {
        heading: "4. Sharing",
        body: [
          "We do not share account data with third parties in this prototype, except what you choose to display publicly on listings (seller display name, photos of lots).",
          "If you use Google sign-in in the demo, only a mock profile is created — no Google account is contacted.",
        ],
      },
      {
        heading: "5. Retention and security",
        body: [
          "Mock sessions live in Redux until you refresh. Remembered email is stored locally on your device.",
          "Do not use real production passwords or government IDs; seller KYC uploads are preview-only.",
        ],
      },
      {
        heading: "6. Your choices",
        body: [
          "You can clear site data in your browser to remove local preferences.",
          "To ask about this policy, use the Contact page or email support@rex-auction.com.",
        ],
      },
    ]}
  />
);

export default PrivacyPolicyPage;
