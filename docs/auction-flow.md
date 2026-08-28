# RexAuction — auction flow

How a lot is supposed to move from **seller listing** through **admin review**, **public bidding**, **buyer payment**, and **fulfillment**. The app is a **mock-data UI prototype**: each screen has its own arrays. Approving, bidding, or paying does **not** update another role’s page.

**Preview a role:** set `role` in [`src/data/MOCK_USER.ts`](../src/data/MOCK_USER.ts) to `"buyer"`, `"seller"`, or `"admin"`. Login/register do not switch this.

Related: [user-flow.md](./user-flow.md) (all roles) · [MISSING_FLOWS.md](./MISSING_FLOWS.md) (gaps).

---

## Intended path

```
Buyer applies to sell
        │
        ▼
Admin approves seller          /admin/sellerRequest
        │
        ▼
Seller creates listing         /seller/create-auction
        │
        ▼
Admin approves listing         /admin/manageAuctions
        │
        ▼
Lot goes live                  /auction  →  /liveAuction/:id
        │
        ▼
Buyer bids                     /buyer/status  →  live room
        │
        ▼
Auction ends — highest bid wins
        │
        ├── Buyer pays + tracks     /buyer/won-auctions/:id
        │                           /buyer/payments
        │
        ├── Seller ships            /seller/sold-auctions
        │                           /seller/monitor-auctions (while live)
        │
        └── Admin can see money     /admin/endedAuctions
                                    /admin/finance  /admin/payment
```

Become-seller is a **one-time account step**. Listing approval happens **per auction**.

---

## 1. Become a seller (account)

| Who | Route | What happens |
|-----|--------|----------------|
| Buyer | `/buyer/becomeSeller` | NID photos, phone OTP **`1234`**, categories, agree to `/terms` + ToS |
| Admin | `/admin/sellerRequest` | Approve / reject KYC queue |
| Seller | `/seller` | Dashboard after approval |

**Today:** buyer form and admin queue are separate mocks. Approving a seller request does not change `MOCK_USER.role`. To see the seller UI, set `role: "seller"` in `MOCK_USER.ts`.

---

## 2. Create and approve a listing

| Who | Route | What happens |
|-----|--------|----------------|
| Seller | `/seller/create-auction` | Title, category, prices, ≥4 images, start/end. Submit shows upload progress, then goes to Manage. |
| Seller | `/seller/manageAuctions` | Draft / pending approval / scheduled / live / ended. Edit, submit, cancel. |
| Admin | `/admin/manageAuctions` | Approve, reject, pause, feature, flag listings. |
| Admin | `/admin` | Overview also has a pending-lots widget (local copy, not the same array). |

**Today:** create is **not in the seller sidebar** (open `/seller/create-auction` directly, or the button on `/seller/payments`). Submit does **not** add a row on Manage. Admin approve does **not** change seller Manage or the public catalog.

Public catalog is [`MOCK_AUCTIONS`](../src/data/MOCK_AUCTIONS.ts) (`_id` `"1"`…`"10"`). Seller/admin lists are different objects.

---

## 3. Live bidding (public + buyer)

| Who | Route | What happens |
|-----|--------|----------------|
| Anyone | `/` · `/auction` | Browse lots. Card links to `/liveAuction/:id`. |
| Anyone | `/liveAuction/:id` | Gallery, countdown, place bid, auto-bid. Id is resolved from `MOCK_AUCTIONS`, then buyer lots. |
| Buyer | `/buyer` | Watchlist / active bids; links into live or won detail. |
| Buyer | `/buyer/status` | Lots the buyer is in. **Ongoing:** image, title, and **Live bid** open the live room. **Won:** opens `/buyer/won-auctions/:id`. Bid history on a card is per-lot only. |
| Seller | `/seller/monitor-auctions` | Seller-side live monitor (soft close, flags). Not the public live room. |

### Demo click-through (buyer)

`MOCK_USER.role` must be `"buyer"`.

| Status card | Goes to |
|-------------|---------|
| 1967 Ford Mustang Fastback (`a1`) | `/liveAuction/2` — catalog Mustang |
| Rolex Submariner (`a2`) | `/liveAuction/a2` |
| Banksy print (`a3`) | `/liveAuction/a3` |
| Gibson Les Paul (`a4`, won) | `/buyer/won-auctions/a4` |

Placing a bid only updates the live page. It does not write `/buyer/status` or seller monitor.

---

## 4. Win, pay, deliver

When the clock hits zero, the highest bidder should win.

| Who | Route | What happens |
|-----|--------|----------------|
| Buyer | `/buyer/won-auctions` | Wins list: pay now / in delivery / delivered. |
| Buyer | `/buyer/won-auctions/a4` | Invoice, pay (mock), delivery timeline, tracking. **a4** Gibson is **paid** and **in transit**. |
| Buyer | `/buyer/won-auctions/a5` | Mac Pro — **payment pending**. |
| Buyer | `/buyer/won-auctions/a6` | Harry Potter — **paid** and **delivered**. |
| Buyer | `/buyer/payments` | Wallet balance, methods, **Transactions** / **Orders**. Completed auction payments **View** → won detail (`a4`, `a6`). Pending auction payment **Pay** → `a5`. |
| Seller | `/seller/sold-auctions` | Accept order, ship, tracking, wait for buyer confirm. |
| Seller | `/seller/payments` · `/seller/wallet` | Payout / balance (mock). |
| Admin | `/admin/endedAuctions` | Closed lots history. |
| Admin | `/admin/finance` · `/admin/payment` | Commission, payouts, payment ops. |
| Admin | `/admin/dispute` | Tickets if something goes wrong. |

**Today:** win is pre-seeded in [`Buyerauctiondata.ts`](../src/data/Buyerauctiondata.ts). Ending a live auction does not create `a4`. Paying on won-detail does not update seller sold-auctions or admin finance. Payments **View** on a completed Gibson row opens `/buyer/won-auctions/a4`.

---

## 5. Money (who sees what)

```
Buyer wallet  ── pays hammer + 5% premium ──►  held (escrow, UI only)
Seller sold   ── ships ──►  buyer confirms receipt
Admin finance ── commission + seller payout
```

No shared ledger. Each page has its own numbers.

---

## 6. Support around a lot

| Action | Screen | Lands on |
|--------|--------|----------|
| Report a listing | Buyer status card | Toast only |
| Seller “Reports” | `/seller/reports` | Complaint form — **not** `/admin/dispute` |
| Chat | `/buyer/chat` · `/seller/chat` · `/admin/chat` | Same chat UI; role is hardcoded **seller** |
| Dispute on a win | Won-auction detail | Local modal, not admin queue |

---

## 7. What is connected vs preview-only

| Step | UI exists | Shares data with the next step |
|------|-----------|--------------------------------|
| Become seller → admin KYC | Yes | No |
| Create listing → admin approve | Yes | No |
| Approve → `/auction` catalog | Yes | No |
| Catalog → live room by id | **Yes** (`MOCK_AUCTIONS` + buyer ids) | Live bid stays on that page |
| Status → live / won detail | **Yes** | — |
| Payments View (done) → `/buyer/won-auctions/a4` | **Yes** | — |
| Pay → seller ship → admin payout | Separate mocks | No |

---

## 8. Walk the UI today (no backend)

1. **Seller** — `role: "seller"` → `/seller/create-auction` → `/seller/manageAuctions` → `/seller/monitor-auctions` → `/seller/sold-auctions`.
2. **Admin** — `role: "admin"` → `/admin/sellerRequest` → `/admin/manageAuctions` → `/admin/endedAuctions`.
3. **Buyer** — `role: "buyer"` → `/auction` → `/liveAuction/2` → `/buyer/status` (Live bid) → `/buyer/won-auctions/a4` → `/buyer/payments` (Transactions **View** on Gibson).

Until one mock session owns listings, bids, and payments, this is a **guided tour of screens**, not a single auction record moving through the product.
