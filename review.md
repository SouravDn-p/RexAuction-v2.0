# RexAuction — Project Review & Status

> Snapshot date: **2026-07-09** · Branch: `rex-2.0`
> This document describes the **actual current state** of the codebase (not the aspirational feature list). It maps the app flow across the three roles, records what is done, and lists what still needs to be built or wired up.

---

## 1. Executive Summary

RexAuction is a **React 19 + TypeScript + Vite** single-page frontend for a real-time auction marketplace with three roles: **Buyer**, **Seller**, and **Admin**. The UI is well advanced — most screens are built with polished, theme-aware (dark/light) Tailwind styling and role-specific dashboards.

**The critical caveat: the app is currently a UI/UX prototype running entirely on mock data.** There is no live backend integration in the render path:

- Auth is **mocked** (`ProtectedRoute` reads a hardcoded `MOCK_USER`; login uses `mockLogin`).
- The RTK Query API layer (`baseApi`, `authApi`, `auctionApi`) exists but is **not registered in the Redux store** and **not consumed by any component**.
- Every dashboard/landing screen imports from `src/data/MOCK_*.ts`.
- Real-time bidding / chat run on static data — `socket.io-client` is a dependency but is **not used** anywhere except a stray import in a landing component.

So: **front-end presentation ≈ 70–80% done; back-end integration ≈ 0–5% done.**

---

## 2. Tech Stack (as actually installed)

| Area | Library |
|------|---------|
| Framework | React 19, TypeScript ~6.0, Vite 8 |
| Routing | react-router-dom 7 (`createBrowserRouter`) |
| State | Redux Toolkit + React-Redux (`ui`, `auth` slices) |
| Data layer (defined, unused) | RTK Query (`@reduxjs/toolkit/query`) |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Forms | react-hook-form |
| Animation | framer-motion, AOS, lottie-react, tsparticles |
| Charts | recharts |
| Notifications | react-hot-toast, react-toastify |
| Icons | react-icons, lucide-react |
| Realtime (dep only) | socket.io-client |
| Docs/export | jspdf, docx, file-saver |
| AI bot | Google Gemini via `fetch` (`VITE_GOOGLE_GEMENI_API`) |

> Note: README lists Axios + Zod, but neither is installed. Data fetching is intended via RTK Query `fetchBaseQuery`.

---

## 3. Application Flow

### 3.1 Entry & Providers
```
main.tsx
 └─ AppProvider
     ├─ ReduxProvider        (store: ui + auth reducers)
     └─ ThemeProvider        (dark/light via useTheme)
         └─ RouterProvider (createBrowserRouter)
```

### 3.2 Route Map (`src/app/routes/Routes.tsx`)

**Public — `MainLayout`** (Navbar + Agent bot + Footer; hidden on auth pages)
```
/                     Home
/auction              AuctionPage (browse listings)
/liveAuction/:id      LiveAuctionPage (live bidding view)
/aboutUs              AboutUsPage
/contactUs            ContactUsPage
/blogs                BlogPage
/blogDetails/:id      BlogDetails
/terms                Terms
/login                LoginPage
/register             RegisterPage
```

**Protected — `ProtectedRoute allowedRoles={[...]}` → `DashboardLayout`** (Sidebar + MainContent)

`/admin/*` (role: admin)
```
/admin                 Overview dashboard
/admin/chat            Chat
/admin/blog            Blog list      /admin/create-blog   Create blog
/admin/walletHistory   Wallet history
/admin/feedback        Feedback       /admin/review        Reviews
/admin/dispute         Disputes & support
/admin/userManagement  User management
/admin/sellerRequest   Seller approval requests
/admin/finance         Financial management
/admin/payment         Payment management
/admin/endedAuctions   Ended auctions history
/admin/manageAuctions  Auction management
/admin/announcement    Announcements   /admin/cms   CMS
/admin/settings/*      profile · password · billings · notifications · plan
```

`/seller/*` (role: seller)
```
/seller                Overview dashboard
/seller/blog · create-blog
/seller/announcement · payments · chat · reports · walletHistory
/seller/manageAuctions   Manage auctions
/seller/monitor-auctions Live/bid monitoring
/seller/sold-auctions    Post-auction fulfillment
/seller/create-auction   Create auction form
/seller/my-auctions      ⚠ placeholder <div>My Auctions</div>
/seller/bids             ⚠ placeholder <div>Incoming Bids</div>
/seller/settings/*       profile · password · billings · notifications · plan
```

`/buyer/*` (role: buyer)
```
/buyer                 Overview dashboard
/buyer/blog · create-blog · payments
/buyer/announcement
/buyer/status          Auction status
/buyer/won-auctions    Won auctions   /buyer/won-auctions/:id  detail
/buyer/becomeSeller    Become-seller application
/buyer/bidHistory      Bid history
/buyer/chat · walletHistory
/buyer/bids            ⚠ placeholder <div>Active Bids</div>
/buyer/won-auctions    ⚠ duplicate path (also mapped to placeholder <div>)
/buyer/history         ⚠ placeholder <div>Bid History</div>
/buyer/settings/*      profile · password · billings · notifications · plan
```

`*` → `NotFound`

### 3.3 Intended End-to-End Business Flow
```
Register/Login ──► Buyer dashboard
   │
   ├─ Browse auctions ──► Live auction ──► Place bid ──► Won auctions ──► Payment
   │
   └─ "Become Seller" application ──► Admin reviews (Seller Requests) ──► approved
                                                                          │
Seller dashboard ◄────────────────────────────────────────────────────────┘
   ├─ Create auction ──► Manage auctions ──► Monitor live bids ──► Sold/fulfillment
   └─ Payments / wallet / reports

Admin oversees: users, seller requests, auctions, finance/payments,
                disputes, announcements/CMS, feedback/reviews, blog.
```
Today every arrow above is driven by **mock data and local component state**, not a server.

---

## 4. Role-by-Role Completion Status

Legend: ✅ built (UI complete) · 🟡 partial/placeholder · ❌ missing · 🔌 needs backend wiring

### 4.1 Admin — *"initially done"*
| Screen | UI | Notes |
|--------|----|-------|
| Dashboard overview | ✅ | 731 lines, charts via recharts (mock) |
| User management | ✅ 🔌 | 1020 lines |
| Seller requests | ✅ 🔌 | approval flow is local state only |
| Auction management | ✅ 🔌 | |
| Ended auctions | ✅ | |
| Finance / Payment mgmt | ✅ 🔌 | |
| Disputes & support | ✅ 🔌 | |
| Announcements / CMS | ✅ 🔌 | |
| Feedback / Reviews | ✅ 🔌 | |
| Blog / Create blog | ✅ / 🟡 | create-blog page is a thin wrapper |
| Settings (5 tabs) | ✅ 🔌 | shared with all roles |

### 4.2 Buyer — *"some pages done" (auctions pages) + dashboard*
| Screen | UI | Notes |
|--------|----|-------|
| Dashboard overview | ✅ | `BuyerDashboard.tsx` 397 lines (mock) |
| Auction status | ✅ | |
| Won auctions + detail | ✅ 🔌 | |
| Bid history | ✅ | mock |
| Payments | ✅ 🔌 | |
| Become Seller | ✅ 🔌 | multi-step form, OTP is simulated |
| Blog / Create blog | ✅ / 🟡 | |
| Wallet history / Chat / Announcements | ✅ 🔌 | |
| `/buyer/bids`, `/buyer/history` | 🟡 | placeholder `<div>`s |
| Duplicate `won-auctions` route | ⚠ | second mapping shadowed by placeholder |

### 4.3 Seller — *"completed"*
| Screen | UI | Notes |
|--------|----|-------|
| Dashboard overview | ✅ | 329 lines |
| Create auction | ✅ 🔌 | form validates + fake upload progress; submit is `setTimeout`, no POST |
| Manage auctions | ✅ 🔌 | 577 lines |
| Bid/live monitoring | ✅ 🔌 | 415 lines, no socket |
| Sold / post-auction fulfillment | ✅ 🔌 | 511 lines |
| Payments / Wallet / Reports | ✅ 🔌 | |
| Blog / Announcements / Chat | ✅ 🔌 | |
| `/seller/my-auctions`, `/seller/bids` | 🟡 | placeholder `<div>`s |
| Detail route (`manageAuctions/:id`) | ❌ | component exists but route is commented out |

### 4.4 Shared / Cross-cutting
| Feature | Status |
|---------|--------|
| Settings (profile/password/billing/notifications/plan) | ✅ UI, 🔌 no persistence |
| Chat | ✅ UI, ❌ no socket — static `MOCK_CHAT_DATA` |
| AI Agent bot | ✅ wired to Gemini `fetch` (needs env key) |
| Theme (dark/light) | ✅ working |
| Landing (Home, Auction, About, Contact, Blog, Terms) | ✅ mostly |

---

## 5. Key Findings / Things That Need Updating

### 5.1 Blockers for a real product (high priority)
1. **Wire the API layer into the store.** `baseApi` is created but the store only registers `ui` + `auth`. Add `[baseApi.reducerPath]: baseApi.reducer` and the middleware in `src/app/redux/store.ts`.
2. **Replace mock auth with real auth.**
   - `ProtectedRoute` uses a hardcoded `MOCK_USER` — role is effectively a constant. Swap to reading auth state from the `auth` slice / `getMe` query.
   - `LoginPage`/`RegisterPage` call `mockLogin`/`mockRegister`; switch to `useLoginMutation`/`useRegisterMutation`.
   - Two guards exist (`ProtectedRoute` mock-based, `PrivateRoute` token-based) and are inconsistent — consolidate into one.
3. **Role source of truth.** `Sidebar` also reads `MOCK_USER.role` directly. Drive role from the auth store so a logged-in user sees the correct nav.
4. **Replace `MOCK_*` data with RTK Query hooks** page-by-page (auctions, bids, payments, users, disputes, etc.). ~40 files import mock data.
5. **Real-time bidding & chat.** `socket.io-client` is installed but unused. Implement a socket provider/hook for live bids (`/liveAuction/:id`, seller monitor) and chat.
6. **CreateAuction submit** is a fake `setTimeout` with simulated upload progress and no image hosting — wire to `useCreateAuctionMutation` + real image upload (Cloudinary/S3).

### 5.2 Correctness / cleanup (medium priority)
7. **Placeholder routes** returning `<div>…</div>`: `/seller/my-auctions`, `/seller/bids`, `/buyer/bids`, `/buyer/history`. Either build or remove from the router + nav.
8. **Duplicate `/buyer/won-auctions` route** — declared twice; the second (`<div>Won Auctions</div>`) is dead. Remove it.
9. **Commented-out seller detail route** (`manageAuctions/:id` → `SellerManageAuctionDetailPage`) — decide to enable or delete.
10. **Sidebar "General" links hardcode `/admin/settings`** for every role (buyer/seller Settings link points to admin). Make it role-aware.
11. **Env var naming**: `.env.example` documents `VITE_API_URL`; README shows `VITE_API_BASE_URL`/`VITE_SOCKET_URL`/`VITE_APP_NAME`. `.env.local` has `VITE_SOCKET_URL=ws://…`. Reconcile names. `VITE_GOOGLE_GEMENI_API` is misspelled ("GEMENI") — keep consistent or fix everywhere.
12. **`getMe`/refresh flow** in `baseApi` has `// optional: dispatch logout` left as a TODO — logout-on-refresh-failure is not implemented.
13. **README is aspirational**, listing features not present (Axios, Zod, wishlist, PWA, i18n, `npm run format` with no Prettier config). Now corrected to reflect reality (see README status section).

### 5.3 Nice-to-have / polish (low priority)
14. Two toast libraries (`react-hot-toast` + `react-toastify`) — standardize on one.
15. Type unification: `MockUser` (data) vs `UserData` (authSlice) describe the same entity with different field names/casing (`auctionsWon` vs `AuctionsWon`). Define one canonical `User` type in `src/types`.
16. `tsc --noEmit` exits non-zero under the installed TypeScript 6.0.3 prerelease with no diagnostics — verify the toolchain/`build` on a stable TS version before CI relies on it.
17. Blog "create" pages for all three roles are 11-line wrappers — confirm they render the shared editor fully.
18. Accessibility/SEO items claimed in README (SEO-friendly, loading skeletons) are largely not implemented yet.

---

## 6. Suggested Next-Step Roadmap

**Phase 1 — Make it real (backend integration)**
- [ ] Register `baseApi` reducer + middleware in the store
- [ ] Implement real login/register/logout/getMe; remove mock auth functions
- [ ] Consolidate route guards; derive role from auth store
- [ ] Add an `authSlice` bootstrap (hydrate user from `getMe` on load)

**Phase 2 — Data wiring**
- [ ] Replace `MOCK_AUCTIONS`, `MOCK_USER`, payments, users, disputes with RTK Query endpoints
- [ ] Real CreateAuction (POST + image upload)
- [ ] Seller-request approval → real admin action

**Phase 3 — Realtime**
- [ ] Socket provider + `useAuctionSocket` hook for live bids
- [ ] Live chat over sockets

**Phase 4 — Cleanup & hardening**
- [ ] Remove placeholder/duplicate/commented routes
- [ ] Role-aware sidebar "Settings" link
- [ ] Unify user types + toast lib
- [ ] Reconcile env var names; document them
- [ ] Fix TS toolchain / green CI build

---

## 7. File-Level Reference (where to look)

| Concern | Path |
|---------|------|
| Router (all routes) | `src/app/routes/Routes.tsx` |
| Auth guards | `src/app/routes/{ProtectedRoute,PrivateRoute}.tsx` |
| Store | `src/app/redux/store.ts` |
| API layer (unused) | `src/app/redux/features/api/{baseApi,auth/authApi,auction/auctionApi}.ts` |
| Auth slice + mock auth | `src/app/redux/features/slices/authSlice.ts` |
| Mock data | `src/data/MOCK_*.ts`, `src/data/Buyerauctiondata.ts` |
| Dashboard shell | `src/app/layouts/dashboard/{DashboardLayout,Sidebar,MainContent}.tsx` |
| Role navs | `src/app/layouts/dashboard/navigations/{Admin,Seller,Buyer}Navigations.tsx` |
| Admin pages | `src/app/pages/dashboard/admin/**` |
| Buyer pages/components | `src/app/pages/dashboard/buyer/**`, `src/app/components/dashboard/buyer/**` |
| Seller pages | `src/app/pages/dashboard/seller/**` |
| Landing | `src/app/pages/landing/**`, `src/app/components/landing/**` |
| AI bot | `src/app/components/bot/Agent.tsx` |
</content>
</invoke>
