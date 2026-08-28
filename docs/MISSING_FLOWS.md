# RexAuction — Missing flows and UI gaps

This document lists marketplace flows that look complete on screen but are disconnected, placeholder, or inconsistent. The app is a **mock-data UI prototype**. Nothing here requires a backend to fix as a flow *in the interface* — it is about whether a user can complete a story without dead ends.

---

## 1. Auth does not change the product

| Intended | What happens |
|----------|----------------|
| Register → buyer dashboard | Register creates a buyer in the Redux `auth` slice, then goes home. Dashboards ignore that slice. |
| Login → role dashboard | Login with `demo@example.com` / `Demo123` also writes `auth`, then goes `/`. |
| Role-based access | `ProtectedRoute` and the sidebar read `src/data/MOCK_USER.ts`. Role is currently `admin`. |

**Improve:** After mock login/register, navigate to `/${role}` and have Sidebar / Navbar / ProtectedRoute read the same mock session (or keep documenting “edit `MOCK_USER.role` to preview”). Until that is one source of truth, buyer and seller UIs are unreachable without a code change.

---

## 2. Public bidding loop

```
Home / Auction browse → Live room → Place bid → Status / Bid history → Won → Pay → Wallet
```

Gaps:

- `/liveAuction/:id` does not use `:id`. Every link opens the same inlined listing, not the card you clicked.
- Home “hot” and “upcoming” auctions are a different mock set than `/auction`.
- Placing a bid only updates local state on that page. Bid history, auction status, and won auctions never change.
- Buyer payments page (`BuyerPayment.tsx`) is not routed. Navbar “Wallet” for an admin user points at `/admin/wallet`, which has no route.

**Improve (UI-only):** Pass the selected auction into the live page (or key mock data by id). After a mock bid, append a row on Bid History and bump status. Add `/buyer/payments` or drop the unused page. Make navbar wallet/won links role-aware.

---

## 3. Become seller → admin approval → seller dashboard

```
Buyer: Become Seller (KYC + OTP 1234) → Admin: Seller Requests → Seller dashboard
```

These screens do not share state. Submitting an application sets local “pending” on the buyer form. Admin approvals mutate a separate in-page array. Nothing promotes the user to seller or reveals seller nav.

**Improve (UI-only):** One mock store for seller applications. Admin approve/reject updates that list and a flag on the mock user so Become Seller shows “approved” and seller routes become visitable.

---

## 4. Seller listing loop

```
Create auction → Manage → Monitor live bids → Sold / fulfillment → Payments / wallet
```

Gaps:

- Create auction is routed (`/seller/create-auction`) but **missing from the seller sidebar**. Only a button on payments deep-links there.
- Submit fakes upload progress and navigates to manage; the new lot does not appear in manage.
- `/seller/my-auctions` and `/seller/bids` are placeholder `<div>`s.
- Auction detail (`SellerManageAuctionDetailPage`) exists; the `:id` route is commented out.
- “Reports” is a complaint form, not seller analytics.

**Improve:** Add Create to seller nav. After mock create, push into the manage list. Either build or remove placeholder routes. Enable the detail route or delete the unused page. Rename Reports or add a real reports view.

---

## 5. Admin operations

Most admin screens are dense CRUD UIs on in-memory arrays. Approving a user, auction, or dispute does not affect buyer/seller pages.

Collapsed admin “Updates” nav links to `/admin/CreateAnnouncement`, which does not exist (expanded nav correctly uses `/admin/cms`).

Wallet history is commented out of admin routes.

---

## 6. Chat and support

- Dashboard chat (`CURRENT_ROLE = "seller"`) always behaves as a seller, including on `/admin/chat` and `/buyer/chat`.
- Public Gemini assistant is independent of auction context (no “this listing” awareness).
- Chat is not tied to an auction thread from a listing or won-item page.

---

## 7. Cross-cutting UI issues

| Issue | Where |
|-------|--------|
| Sidebar “General → Settings” always goes to `/admin/settings` | All roles |
| Duplicate mock datasets | Home carousels vs `MOCK_AUCTIONS` vs live page |
| Unused / orphaned screens | `BuyerPayment`, `BidHistoryPage` wrapper, `PrivateRoute`, `WalletHistoryPage` |
| Login/register ignore dark mode | Auth pages (addressed in the auth UI pass) |
| Rate-us used `alert()` | About page (replaced with toast-style form on About) |

---

## 8. Suggested UI-only improvement order

1. Single mock session for role + navigation (so all three dashboards are demoable without editing source).
2. Auction id on the live page + bid written into mock bid history.
3. Seller create in the sidebar + new listing visible in manage.
4. Shared mock seller-application list between buyer and admin.
5. Role-aware chat copy and settings links.
6. Remove or finish placeholder routes.

Backend, sockets, and RTK Query wiring are intentionally out of scope while the product is a UI prototype.
