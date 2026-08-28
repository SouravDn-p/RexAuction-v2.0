import LegalPage from "./LegalPage";

const TermsOfServicePage = () => (
  <LegalPage
    kicker="Legal"
    title="Terms of Service"
    updated="28 August 2026"
    intro="These terms govern use of Rex Auction — browsing, registering, bidding, listing, and using dashboards. By creating an account you agree to this document. Seller-specific listing rules also appear on /terms."
    sections={[
      {
        heading: "1. The service",
        body: [
          "Rex Auction is a role-based auction marketplace (buyer, seller, admin). The current build is a UI prototype running on mock data. Features that look live (bids, payments, approvals) may not persist after refresh.",
        ],
      },
      {
        heading: "2. Accounts",
        body: [
          "You must be 18 or older to register. Provide a working email. Signup uses a verification code (demo code is shown on screen).",
          "You are responsible for activity under your account. Do not share passwords. We may suspend accounts that abuse bidding, listings, or other users.",
        ],
      },
      {
        heading: "3. Bidding",
        body: [
          "Bids you place in a live room are treated as offers. In a production system they would be binding; in this prototype they only update the page you are on.",
          "Shill bidding, fake accounts, or interfering with another user’s bids is not allowed.",
        ],
      },
      {
        heading: "4. Selling",
        body: [
          "Sellers must apply (identity and category review). Listings must be accurate, lawful, and owned by you or offered with permission.",
          "Once a lot has bids, withdrawing it without cause may be restricted. Commission and payout rules will be shown at listing time.",
        ],
      },
      {
        heading: "5. Payments and lots",
        body: [
          "Winning bidders are expected to pay within the window shown on the won-auction screen. Items are sold as described unless a listing states otherwise.",
          "Rex Auction is not a bank. Wallet balances in this build are illustrative.",
        ],
      },
      {
        heading: "6. Content and IP",
        body: [
          "You keep rights to photos and text you upload, and grant Rex Auction a license to display them on the site.",
          "Do not post content that infringes others’ rights or violates the law.",
        ],
      },
      {
        heading: "7. Limitation of liability",
        body: [
          "The prototype is provided as-is. We are not liable for lost bids, mock payments, or decisions you make from demo data.",
        ],
      },
      {
        heading: "8. Changes",
        body: [
          "We may update these terms. The date at the top is the latest version. Continued use after a change means you accept the new terms.",
        ],
      },
    ]}
  />
);

export default TermsOfServicePage;
