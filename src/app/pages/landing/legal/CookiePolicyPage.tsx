import LegalPage from "./LegalPage";

const CookiePolicyPage = () => (
  <LegalPage
    kicker="Legal"
    title="Cookie Policy"
    updated="28 August 2026"
    intro="This page describes cookies and similar storage Rex Auction uses in your browser. We keep this list short because the current site is a frontend prototype."
    sections={[
      {
        heading: "1. What we store",
        body: [
          "Theme preference (light or dark) in localStorage under the key used by the UI store.",
          "Remembered login email, if you tick “Remember me” on the sign-in form.",
          "Auction favorites on the browse page (auctionFavorites in localStorage).",
        ],
      },
      {
        heading: "2. What we do not use (in this build)",
        body: [
          "We do not set advertising cookies or third-party tracking pixels.",
          "Session tokens for a real API are not issued; dashboards currently follow a mock user in source, not a cookie session.",
        ],
      },
      {
        heading: "3. Why we use them",
        body: [
          "Essential: keep your theme and remembered email so the site feels consistent when you return.",
          "Preference: saved favorite lots so you do not lose them on refresh of the auction list.",
        ],
      },
      {
        heading: "4. Your control",
        body: [
          "You can clear cookies and site data in your browser settings. That will reset theme, remembered email, and favorites.",
          "Blocking all storage may break sign-in “remember me” and dark mode persistence. Core pages still load.",
        ],
      },
      {
        heading: "5. More information",
        body: [
          "See the Privacy Policy for how account data is treated. For questions, use Contact Us or email support@rex-auction.com.",
        ],
      },
    ]}
  />
);

export default CookiePolicyPage;
