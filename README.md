# RexAuction

UI prototype of a role-based online auction marketplace. Built with React 19, TypeScript, Vite, Redux Toolkit, and Tailwind CSS 4.

**Current mode: mock data only.** Screens are styled and interactive. Submits, bids, approvals, and chat threads stay in the browser. There is no live API, and that is intentional for this phase.

Live demo: http://72.60.96.242:8246

---

## Findings (as of 28 Aug 2026)

The product *looks* like a finished marketplace. The data path is still a prototype.

- **~32k lines** of TypeScript across **139** modules. Admin screens are the largest (user management, auction management, disputes).
- **Three roles** — buyer, seller, admin — each with a dashboard, sidebar, and settings. Public site: home, auctions, live bid, about, blog, contact, terms, login, register.
- **Auth is mocked.** Login uses `demo@example.com` / `Demo123`. Signup verifies email with mock OTP `123456`. Session is stored in Redux `auth`; **dashboards still read `src/data/MOCK_USER.ts`**. To preview a role, set `MOCK_USER.role` to `"buyer" | "seller" | "admin"`.
- **RTK Query** (`authApi`, `auctionApi`) is drafted and not registered in the store. **socket.io-client** is installed and unused. Do not treat those as working integrations.
- **Gemini assistant** on the public layout can call `VITE_GOOGLE_GEMENI_API` if set; the widget UI works without it (error state in-thread).
- Flows that are visually complete but not connected (live bid ignores `:id`, become-seller vs admin requests, create-auction missing from seller nav, placeholder routes) are listed in [`docs/MISSING_FLOWS.md`](./docs/MISSING_FLOWS.md).

---

## Roles (UI)

| Role | Entry | Areas |
|------|--------|--------|
| Buyer | `/buyer` | Dashboard, status, won auctions, bid history, wallet, chat, become seller |
| Seller | `/seller` | Dashboard, manage / monitor / sold auctions, create auction, payments, wallet, reports, chat |
| Admin | `/admin` | Users, seller requests, auctions, finance, payments, disputes, CMS, feedback, blog |

Public: `/` `/auction` `/liveAuction/:id` `/aboutUs` `/contactUs` `/blogs` `/login` `/register`

---

## Mock credentials

| Action | Value |
|--------|--------|
| Login email | `demo@example.com` |
| Login password | `Demo123` |
| Signup email OTP | `123456` |
| Become-seller phone OTP | `1234` (existing buyer KYC form) |

---

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

Optional `.env.local` (only needed for the Gemini widget):

```env
VITE_GOOGLE_GEMENI_API=your_gemini_endpoint
```

`npm run build` · `npm run preview` · `npm run lint`

---

## Stack

React 19 · Vite 8 · React Router 7 · Redux Toolkit (`ui`, `auth`) · Tailwind 4 · react-hook-form · framer-motion · react-hot-toast

Data today: `src/data/MOCK_*.ts` plus in-page mock arrays. Routing: `src/app/routes/Routes.tsx`.

---

## Docs

- [`docs/user-flow.md`](./docs/user-flow.md) — how buyer, seller, and admin journeys work, and what is missing
- [`docs/MISSING_FLOWS.md`](./docs/MISSING_FLOWS.md) — disconnected user journeys and UI dead ends
- [`review.md`](./review.md) — older full-status snapshot (July 2026); prefer this README + the docs above for current UI-only scope
