# RexAuction user flows

How each role is supposed to move through the product, which screens exist, and what is still missing. The app is a **mock-data UI prototype**. Screens work as pages; most actions do not persist or talk to another role.

**Preview a dashboard:** set `role` in `[src/data/MOCK_USER.ts](../src/data/MOCK_USER.ts)` to `"buyer"`, `"seller"`, or `"admin"`. Login/register write Redux `auth` but **do not** change that file, so they do not switch dashboards today.

**Mock credentials:** login `demo@example.com` / `Demo123`. Signup email OTP `123456`. Become-seller phone OTP `1234`.

Related: [MISSING_FLOWS.md](./MISSING_FLOWS.md) (implementation gaps) · [auction-flow.md](./auction-flow.md) (listing → bid → pay).

---



## Roles at a glance

```
Visitor (public site)
   │
   ├─ Register (OTP) / Login  ──►  intended: Buyer
   │
   Buyer
   │  browse → live bid → win → pay → wallet
   │  become seller ──► Admin reviews ──► Seller
   │
   Seller
   │  create listing → manage → live monitor → sold / ship → payout
   │
   Admin
      users, seller requests, auctions, money, disputes, CMS
```

---



## 1. Visitor (not logged in)

**Job:** Discover lots, read the brand, create an account.


| Step                           | Route                                     | Status                                                    |
| ------------------------------ | ----------------------------------------- | --------------------------------------------------------- |
| Land on home                   | `/`                                       | Built (hot/upcoming use their own mocks)                  |
| Browse catalog                 | `/auction`                                | Built (`MOCK_AUCTIONS`, favorites in localStorage)        |
| Open a live lot                | `/liveAuction/:id`                        | Built, but `:id` **is ignored** — always the same listing |
| About / blog / contact / terms | `/aboutUs` `/blogs` `/contactUs` `/terms` | Built                                                     |
| Register                       | `/register`                               | Built — photo, OTP `123456`, then home                    |
| Login                          | `/login`                                  | Built — then home                                         |


**Missing**

- Login/register never open `/buyer` (or the user’s real role).
- Home carousels and `/auction` are different datasets.
- Live page does not show the lot you clicked.
- Guest bid vs “must sign in” is not enforced (there is no real session).

---



## 2. Buyer

**Job:** Bid, track lots, pay for wins, optionally apply to sell.

Entry: `/buyer` (only if `MOCK_USER.role === "buyer"`).

### Happy path (intended)

```
Dashboard
  → /auction or live room → place bid
  → /buyer/status          (active lots)
  → /buyer/bidHistory      (past bids)
  → /buyer/won-auctions    (wins)
  → /buyer/won-auctions/:id (pay / delivery)
  → /buyer/wallet
```



### Screens


| Area                 | Route                               | What they do here                | Missing                                                                 |
| -------------------- | ----------------------------------- | -------------------------------- | ----------------------------------------------------------------------- |
| Overview             | `/buyer`                            | Stats, saved lots, shortcuts     | Data is mock; not tied to bids                                          |
| Auction status       | `/buyer/status`                     | See lots they are in             | Not updated after a live bid                                            |
| Bid history          | `/buyer/bidHistory`                 | List of past bids                | Same — static mock                                                      |
| Won auctions         | `/buyer/won-auctions`               | Wins list                        | Static                                                                  |
| Won detail           | `/buyer/won-auctions/:id`           | Payment + delivery UI            | No checkout; no link from live win                                      |
| Wallet               | `/buyer/wallet`                     | Balance, history                 | Mock only                                                               |
| Payments page        | —                                   | `BuyerPayment.tsx` exists        | **Not routed**                                                          |
| Chat                 | `/buyer/chat`                       | Message sellers                  | UI always acts as **seller** (`CURRENT_ROLE`)                           |
| Become seller        | `/buyer/becomeSeller`               | KYC + phone OTP                  | Does not reach admin queue                                              |
| Blog / announcements | `/buyer/blog` `/buyer/announcement` | Read content                     | Mock                                                                    |
| Settings             | `/buyer/settings/*`                 | Profile, password, billing, plan | Not saved; sidebar “General → Settings” still goes to `/admin/settings` |


**Missing for the buyer loop**

1. Bid on live lot does not appear in status or history.
2. Winning does not create a won-auction row or a payment due.
3. No `/buyer/payments` route.
4. Navbar wallet/won links use `/${MOCK_USER.role}/…`, so an admin preview points at `/admin/wallet` (no such page).
5. Chat is not a buyer–seller thread on a lot.

---



## 3. Seller

Job: List lots, watch live bidding, fulfill sold items, get paid.

Entry: `/seller` (only if `MOCK_USER.role === "seller"`).

Sellers are meant to **start as buyers**. Admin approval on Seller Requests should flip the role. That promotion is not implemented.

### Happy path (intended)

```
Create auction
  → Manage listings
  → Monitor live bids
  → Sold / fulfillment (ship, confirm)
  → Payments + wallet
```



### Screens


| Area           | Route                                | What they do here            | Missing                                                                                            |
| -------------- | ------------------------------------ | ---------------------------- | -------------------------------------------------------------------------------------------------- |
| Overview       | `/seller`                            | Stats, recent lots           | Mock; “pending application” banner is local copy                                                   |
| Create listing | `/seller/create-auction`             | Form, ≥4 images, fake upload | **Not in sidebar** — only a payments-page button links here. Submit does not add the lot to Manage |
| Manage         | `/seller/manageAuctions`             | Edit/status of listings      | Detail route commented out                                                                         |
| Live monitor   | `/seller/monitor-auctions`           | Watch bids                   | No sockets; not the live public room                                                               |
| Sold           | `/seller/sold-auctions`              | Fulfillment                  | Mock                                                                                               |
| Payments       | `/seller/payments`                   | Payouts                      | Mock                                                                                               |
| Wallet         | `/seller/wallet`                     | Balance                      | Mock                                                                                               |
| Reports        | `/seller/reports`                    | Named “reports”              | **Complaint form**, not analytics                                                                  |
| Chat           | `/seller/chat`                       | Talk to bidders              | Hardcoded seller UI (ok for this role)                                                             |
| Placeholders   | `/seller/my-auctions` `/seller/bids` | —                            | Empty `<div>`s                                                                                     |
| Settings       | `/seller/settings/*`                 | Same shared tabs             | Settings link in sidebar → `/admin/settings`                                                       |


**Missing for the seller loop**

1. Create is easy to miss (no nav item).
2. New listing never shows under Manage.
3. Live monitor ≠ public `/liveAuction/:id`.
4. Sold fulfillment does not change buyer won-detail.
5. No path from “approved seller request” to this dashboard.

---



## 4. Admin

**Job:** Run the marketplace — people, lots, money, disputes, content.

Entry: `/admin` (current `MOCK_USER.role` default).

### Daily work (intended)

```
Overview
  → Seller Requests     approve / reject KYC
  → User Management     suspend, roles
  → Auction Management  approve listings, take down
  → Ended auctions      history
  → Finance / Payments  commissions, payouts
  → Disputes            tickets
  → Announcements / CMS / Blog / Feedback
```



### Screens


| Area                | Route                              | What they do here                   | Missing                                                                        |
| ------------------- | ---------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------ |
| Overview            | `/admin`                           | KPIs, pending sellers, pending lots | Approvals here are local; not the same arrays as dedicated pages               |
| Users               | `/admin/userManagement`            | Search, status, role                | Does not change `MOCK_USER` or login                                           |
| Seller requests     | `/admin/sellerRequest`             | Approve KYC                         | **Not connected** to Become Seller                                             |
| Manage auctions     | `/admin/manageAuctions`            | Moderate listings                   | Not connected to seller Manage                                                 |
| Ended auctions      | `/admin/endedAuctions`             | History                             | Mock                                                                           |
| Finance             | `/admin/finance`                   | Platform money                      | Mock                                                                           |
| Payments            | `/admin/payment`                   | Payment ops                         | Mock                                                                           |
| Disputes            | `/admin/dispute`                   | Support tickets                     | Mock; not opened from buyer/seller                                             |
| Announcements / CMS | `/admin/announcement` `/admin/cms` | Site copy                           | Collapsed nav “Create announcement” hits `/admin/CreateAnnouncement` **(404)** |
| Feedback / reviews  | `/admin/feedback` `/admin/review`  | Ratings                             | About-page feedback does not land here                                         |
| Blog                | `/admin/blog` `/admin/create-blog` | Posts                               | Mock                                                                           |
| Chat                | `/admin/chat`                      | Monitor threads                     | Still seller-mode UI                                                           |
| Wallet history      | —                                  | —                                   | Route **commented out**                                                        |
| Settings            | `/admin/settings/*`                | Admin’s own profile                 | Fine for this role                                                             |


**Missing for the admin loop**

1. Approve seller ≠ buyer becomes seller.
2. Approve/reject auction ≠ seller listing status.
3. Disputes are not filed from Reports (seller) or won-auction (buyer).
4. About/contact feedback is not the Feedback page.
5. No single queue that matches the overview “pending” counts.

---



## 5. Cross-role stories (the ones that should stitch the product)



### A. Account

```
Register (OTP) → Buyer dashboard → use the product
Login → dashboard for that role
```

**Missing:** Session vs `MOCK_USER`. After auth, user is sent to `/`. Guards ignore Redux.

### B. Bid to payout

```
Buyer bids  →  Seller sees bid  →  auction ends  →  buyer pays  →  seller fulfills  →  admin can see money
```

**Missing:** Every arrow. Each screen has its own mock list.

### C. Become a seller

```
Buyer Become Seller (docs + OTP 1234)
  → Admin Seller Requests
  → Approve
  → User is seller, `/seller` works
```

**Missing:** Shared application record and role change.

### D. Support

```
Buyer/seller opens chat or files a report
  → Admin dispute / chat monitor
```

**Missing:** Seller Reports is a form that does not create a dispute. Chat role is hardcoded.

---



## 6. How to walk the UI today

1. Public: `/` → `/auction` → any live link (same lot).
2. Auth: `/register` (OTP `123456`) or `/login` (`demo@example.com` / `Demo123`) — returns to home.
3. Admin (default): `/admin` and the admin sidebar.
4. Buyer: set `MOCK_USER.role` to `"buyer"`, then `/buyer`.
5. Seller: set role to `"seller"`, then `/seller`. Create listing via `/seller/create-auction`.

Until one mock session drives `ProtectedRoute`, Sidebar, and Navbar, those three dashboards are **preview modes**, not a real user journey.