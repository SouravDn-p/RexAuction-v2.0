# RexAuction — Frontend

A modern, responsive, role-based **online auction platform** built with **React 19**, **TypeScript**, **Vite**, **Redux Toolkit**, and **Tailwind CSS 4**.

The app models a full auction marketplace with three roles — **Buyer**, **Seller**, and **Admin** — each with its own dashboard, navigation, and workflows.

> **Project status:** UI/UX prototype. Most screens are built and polished, but the app currently runs on **mock data** (`src/data/MOCK_*.ts`). Backend/API integration and real-time bidding are not yet wired up. See [`review.md`](./review.md) for a detailed status and roadmap.

---

## Live Demo

> http://72.60.96.242:8246

---

## Tech Stack

- **React 19** + **TypeScript** + **Vite 8**
- **React Router DOM 7** (`createBrowserRouter`)
- **Redux Toolkit** + React-Redux — global state (`ui`, `auth`)
- **RTK Query** — API/data layer *(defined in `redux/features/api`, not yet wired into the store)*
- **Tailwind CSS 4** (`@tailwindcss/vite`) — theming with dark/light mode
- **react-hook-form** — forms
- **framer-motion**, **AOS**, **lottie-react**, **tsparticles** — animation
- **recharts** — dashboard charts
- **react-hot-toast** / **react-toastify** — notifications
- **react-icons**, **lucide-react** — icons
- **socket.io-client** — realtime *(dependency present, not yet used)*
- **jspdf**, **docx**, **file-saver** — document export
- Google **Gemini** — in-app AI assistant bot

---

## Roles & Feature Overview

| Role | Entry | Key areas |
|------|-------|-----------|
| **Buyer** | `/buyer` | Dashboard, browse & bid on auctions, auction status, won auctions, bid history, payments, wallet, chat, "Become Seller" application |
| **Seller** | `/seller` | Dashboard, create auction, manage auctions, monitor live bids, sold/fulfillment, payments, reports, wallet, chat |
| **Admin** | `/admin` | Dashboard, user management, seller-request approvals, auction management, ended auctions, finance & payments, disputes, announcements/CMS, feedback & reviews, blog |

Public (unauthenticated) pages: Home, Auctions, Live Auction, About, Contact, Blog, Terms, Login, Register.

> **Current completion (high level):** Admin — screens built (initial pass). Buyer — dashboard + auction pages built. Seller — screens built. All are UI-complete but not yet connected to a live backend. A few routes are still placeholders. See [`review.md`](./review.md).

---

## Application Flow

```
Register / Login
   └─► Buyer dashboard
         ├─ Browse auctions → Live auction → Place bid → Won auctions → Payment
         └─ "Become Seller" → Admin approves (Seller Requests) → Seller dashboard
                                                                     │
Seller dashboard ◄───────────────────────────────────────────────────┘
   ├─ Create auction → Manage auctions → Monitor live bids → Sold / fulfillment
   └─ Payments · Wallet · Reports

Admin oversees: users · seller requests · auctions · finance/payments ·
                disputes · announcements/CMS · feedback/reviews · blog
```

Routing lives in [`src/app/routes/Routes.tsx`](./src/app/routes/Routes.tsx). Role access is enforced by `ProtectedRoute` (see note under *Authentication*).

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── auth/                     # login helpers, social login, forgot password
│   │   ├── bot/                      # Gemini AI assistant
│   │   ├── chat/                     # chat UI (mock data)
│   │   ├── dashboard/
│   │   │   ├── buyer/                # buyer dashboard + auction widgets
│   │   │   ├── seller/               # seller widgets
│   │   │   └── shared/               # announcements, blog editor
│   │   ├── landing/                  # home, about, auction, live-auction sections
│   │   ├── shared/                   # header, wallet history
│   │   └── ui/                       # button, input, select, calendar… (design system)
│   ├── layouts/
│   │   ├── MainLayout.tsx            # public shell (Navbar + Agent + Footer)
│   │   └── dashboard/                # DashboardLayout, Sidebar, role navigations
│   ├── pages/
│   │   ├── auth/                     # Login, Register
│   │   ├── landing/                  # Home, Auction, About, Contact, Blog, Terms
│   │   └── dashboard/
│   │       ├── admin/               # admin feature pages
│   │       ├── buyer/               # buyer feature pages
│   │       ├── seller/              # seller feature pages
│   │       └── shared/settings/     # profile, password, billing, notifications, plan
│   ├── redux/
│   │   ├── features/api/            # baseApi + authApi + auctionApi (RTK Query)
│   │   ├── features/slices/         # authSlice, uiSlice
│   │   └── store.ts
│   └── routes/                      # Routes.tsx, ProtectedRoute, PrivateRoute
├── data/                            # MOCK_* datasets driving the UI today
├── hooks/                           # useTheme, Counter
├── providers/                       # app / redux / theme providers
├── types/                           # shared TypeScript types
└── main.tsx
```

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Install

```bash
git clone https://github.com/SouravDn-p/rexauction-frontend.git
cd rexauction-frontend
npm install
```

### Environment Variables

Create a `.env.local` in the project root (see [`.env.example`](./.env.example)):

```env
# Backend & realtime
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=ws://localhost:3000

# AI assistant (Google Gemini)
VITE_GEMINI_API_URL=your_gemini_api_url
VITE_GOOGLE_GEMENI_API=your_google_gemini_api_key
```

> The API/socket variables are consumed by the RTK Query base and the AI bot. The main UI currently renders from mock data, so the app runs without a backend.

### Run

```bash
npm run dev      # start dev server (http://localhost:5173)
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---

## Authentication (current state)

Auth is **mocked** for now:

- `ProtectedRoute` reads a hardcoded `MOCK_USER` (in `src/data/MOCK_USER.ts`) to determine the role. Change `MOCK_USER.role` to `"admin" | "seller" | "buyer"` to preview each dashboard.
- `LoginPage` / `RegisterPage` use `mockLogin` / `mockRegister` in `authSlice`.
- A real JWT flow (`login`, `register`, `logout`, `getMe`, refresh) is scaffolded in `redux/features/api/*` but not yet connected.

Wiring real auth is the top item in the roadmap — see [`review.md`](./review.md).

---

## State Management

- **Redux Toolkit** — `ui` and `auth` slices are active in the store.
- **RTK Query** — `baseApi` (with auto token-refresh), `authApi`, and `auctionApi` are defined but **not yet registered** in `store.ts` or consumed by components.

---

## Realtime (planned)

`socket.io-client` is installed for live bidding and chat. The live-auction, seller monitoring, and chat screens are built but currently display mock data; sockets are not yet connected.

---

## Build for Production

```bash
npm run build      # output in dist/
```

### Docker

```bash
docker build -t rexauction-frontend .
docker run -d -p 3000:80 rexauction-frontend
```

An [`nginx.conf`](./nginx.conf), [`docker-compose.yml`](./docker-compose.yml), and GitHub Actions workflow (`.github/`) are included for deployment.

---

## Roadmap (summary)

1. **Backend integration** — register `baseApi` in the store, replace mock auth with real JWT auth, derive role from the auth store.
2. **Data wiring** — swap `MOCK_*` datasets for RTK Query endpoints (auctions, bids, users, payments, disputes…).
3. **Realtime** — socket-based live bidding and chat.
4. **Cleanup** — remove placeholder/duplicate routes, make the sidebar "Settings" link role-aware, unify user types, reconcile env var names.

Full details, per-screen status, and file references are in [`review.md`](./review.md).

---

## Author

**Sourav Debnath** — Junior Full Stack Developer

- Portfolio: https://sourav-debnath-sd246.vercel.app
- GitHub: https://github.com/SouravDn-p

---

## License

MIT
</content>
