import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  Bookmark,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  Flame,
  Gavel,
  Heart,
  MapPin,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Store,
  TrendingDown,
  TrendingUp,
  Trophy,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MOCK_BUYER_AUCTIONS, type BuyerAuction } from "../../../../data/Buyerauctiondata";
import { MOCK_USER } from "../../../../data/MOCK_USER";
import Counter from "../../../../hooks/Counter";
import { useTheme } from "../../../../hooks/useTheme";
import ToggleSwitch from "../../ui/ToggleSwitch";

// ─── Helpers ────────────────────────────────────────────────────────────────

const spring = { type: "spring" as const, stiffness: 120, damping: 20 };

const formatCurrency = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0 });

const formatCountdown = (endTime: string): string => {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

const MOCK_COVER = "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1200&q=80";

// Application Status: 'pending' | 'approved' | 'rejected'
const SELLER_APPLICATION = {
  status: "pending" as "pending" | "approved" | "rejected",
  message: "Your application is currently under review by our moderation team.",
  submittedAt: "July 05, 2026",
};

// Spending across the last 7 months (used by the summary chart)
const SPENDING_TREND = [
  { label: "Jan", value: 620 },
  { label: "Feb", value: 1400 },
  { label: "Mar", value: 900 },
  { label: "Apr", value: 2100 },
  { label: "May", value: 1600 },
  { label: "Jun", value: 2400 },
  { label: "Jul", value: 3100 },
];

const FOLLOWED_SELLERS = [
  { id: "s1", name: "ClassicMotors_US", avatar: "https://ui-avatars.com/api/?name=Classic+Motors&background=7c3aed&color=fff", rating: 4.9, newListings: 3 },
  { id: "s2", name: "LuxuryWatches_HK", avatar: "https://ui-avatars.com/api/?name=Luxury+Watches&background=0369a1&color=fff", rating: 4.7, newListings: 1 },
  { id: "s3", name: "RareBooksLondon", avatar: "https://ui-avatars.com/api/?name=Rare+Books&background=065f46&color=fff", rating: 4.9, newListings: 0 },
];

const SAVED_SEARCHES = [
  { id: "q1", query: "Rolex Submariner", filters: "Jewelry · $8k–15k", newMatches: 4 },
  { id: "q2", query: "Vintage Mustang", filters: "Vehicles · Restored", newMatches: 1 },
  { id: "q3", query: "First edition books", filters: "Collectibles · Under $10k", newMatches: 0 },
];

// Rows for the notification-preferences matrix
const NOTIFICATION_EVENTS = [
  { key: "outbid", label: "You've been outbid", desc: "When another buyer overtakes your bid" },
  { key: "ending", label: "Auction ending soon", desc: "Reminders for auctions in your watchlist" },
  { key: "won", label: "You won an auction", desc: "Payment & delivery next-steps" },
  { key: "followed", label: "New listing from a followed seller", desc: "When sellers you follow list items" },
] as const;

type NotifKey = (typeof NOTIFICATION_EVENTS)[number]["key"];
type NotifPrefs = Record<NotifKey, { email: boolean; push: boolean }>;

export default function BuyerDashboard() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAuction, setSelectedAuction] = useState<BuyerAuction | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [appStatus] = useState(SELLER_APPLICATION);

  // Watchlist — a set of auction ids saved for later
  const [watchlist, setWatchlist] = useState<Set<string>>(
    () => new Set(["a1", "a2", "a3", "a7"])
  );
  const [following, setFollowing] = useState<Set<string>>(
    () => new Set(FOLLOWED_SELLERS.map((s) => s.id))
  );
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>({
    outbid: { email: true, push: true },
    ending: { email: true, push: false },
    won: { email: true, push: true },
    followed: { email: false, push: true },
  });

  const auctions = MOCK_BUYER_AUCTIONS;

  // ── Design tokens ────────────────────────────────────────────────────────
  const card = `rounded-2xl border ${isDarkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-slate-100 shadow-sm"}`;
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const div = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const hover = isDarkMode ? "hover:bg-slate-700/40" : "hover:bg-slate-50";
  const gridLine = isDarkMode ? "#334155" : "#e2e8f0";
  const axisText = isDarkMode ? "#64748b" : "#94a3b8";

  // ── Derived collections ──────────────────────────────────────────────────
  const activeBids = auctions.filter((a) => a.status === "ongoing");
  const wonAuctions = auctions.filter((a) => a.status === "won");
  const lostAuctions = auctions.filter((a) => a.status === "lost");
  const outbidAuctions = activeBids.filter((a) => a.currentBid > a.myBid);
  const leadingAuctions = activeBids.filter((a) => a.currentBid <= a.myBid);
  const watchedAuctions = auctions.filter((a) => watchlist.has(a._id));

  const totalSpent = wonAuctions.reduce((sum, a) => sum + (a.totalPaid ?? a.myBid), 0);

  // ── Stats config (Counter + gradient bar, matches seller/admin) ──────────
  const statsConfig = [
    { label: "Active Bids", value: activeBids.length, sub: `${outbidAuctions.length} need attention`, icon: <Flame className="w-4 h-4" />, iconColor: "text-emerald-500", iconBg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50", bar: "from-emerald-500 to-teal-500" },
    { label: "Won Auctions", value: wonAuctions.length, sub: "Successfully secured", icon: <Trophy className="w-4 h-4" />, iconColor: "text-amber-500", iconBg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50", bar: "from-amber-500 to-orange-500" },
    { label: "Lost Auctions", value: lostAuctions.length, sub: "Outbid at close", icon: <TrendingDown className="w-4 h-4" />, iconColor: "text-rose-500", iconBg: isDarkMode ? "bg-rose-500/10" : "bg-rose-50", bar: "from-rose-500 to-pink-500" },
    { label: "Watchlist", value: watchedAuctions.length, sub: "Saved for later", icon: <Heart className="w-4 h-4" />, iconColor: "text-pink-500", iconBg: isDarkMode ? "bg-pink-500/10" : "bg-pink-50", bar: "from-pink-500 to-rose-500" },
    { label: "Purchases", value: wonAuctions.length, sub: "In purchase history", icon: <ShoppingBag className="w-4 h-4" />, iconColor: "text-blue-500", iconBg: isDarkMode ? "bg-blue-500/10" : "bg-blue-50", bar: "from-blue-500 to-cyan-500" },
    { label: "Wallet Balance", value: MOCK_USER.accountBalance, sub: "Available to bid", prefix: "$", icon: <Wallet className="w-4 h-4" />, iconColor: "text-violet-500", iconBg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50", bar: "from-violet-500 to-blue-500" },
    { label: "Total Spent", value: totalSpent, sub: "Lifetime on wins", prefix: "$", icon: <DollarSign className="w-4 h-4" />, iconColor: "text-teal-500", iconBg: isDarkMode ? "bg-teal-500/10" : "bg-teal-50", bar: "from-teal-500 to-emerald-500" },
    { label: "Following", value: following.size, sub: "Favorite sellers", icon: <Store className="w-4 h-4" />, iconColor: "text-indigo-500", iconBg: isDarkMode ? "bg-indigo-500/10" : "bg-indigo-50", bar: "from-indigo-500 to-violet-500" },
  ];

  const bidActivity = [
    { name: "Leading", count: leadingAuctions.length, color: "from-emerald-500 to-teal-400" },
    { name: "Outbid", count: outbidAuctions.length, color: "from-amber-500 to-orange-400" },
    { name: "Won", count: wonAuctions.length, color: "from-violet-500 to-blue-400" },
  ];
  const bidActivityMax = Math.max(1, ...bidActivity.map((b) => b.count));

  // ── Spending chart geometry (native SVG, no chart libs) ──────────────────
  const chartW = 560, chartH = 180, padL = 36, padR = 12, padT = 12, padB = 24;
  const innerW = chartW - padL - padR, innerH = chartH - padT - padB;
  const maxVal = Math.max(...SPENDING_TREND.map((d) => d.value));
  const minVal = Math.min(...SPENDING_TREND.map((d) => d.value));
  const range = maxVal - minVal || 1;
  const points = SPENDING_TREND.map((d, i) => ({
    x: padL + (i / (SPENDING_TREND.length - 1)) * innerW,
    y: padT + innerH - ((d.value - minVal) / range) * innerH,
    ...d,
  }));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padT + innerH} L ${points[0].x} ${padT + innerH} Z`;

  // ── Handlers ─────────────────────────────────────────────────────────────
  const toggleWatch = (auction: BuyerAuction) => {
    setWatchlist((prev) => {
      const next = new Set(prev);
      if (next.has(auction._id)) {
        next.delete(auction._id);
        toast.error(`Removed "${auction.name}" from watchlist`);
      } else {
        next.add(auction._id);
        toast.success(`Saved "${auction.name}" to watchlist`);
      }
      return next;
    });
  };

  const toggleFollow = (id: string, name: string) => {
    setFollowing((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.error(`Unfollowed ${name}`);
      } else {
        next.add(id);
        toast.success(`Following ${name} — you'll be notified of new listings`);
      }
      return next;
    });
  };

  const toggleNotif = (event: NotifKey, channel: "email" | "push") => {
    setNotifPrefs((prev) => ({
      ...prev,
      [event]: { ...prev[event], [channel]: !prev[event][channel] },
    }));
  };

  const watchQuery = searchTerm.toLowerCase();
  const filteredWatchlist = watchQuery
    ? watchedAuctions.filter(
        (a) => a.name.toLowerCase().includes(watchQuery) || a.category.toLowerCase().includes(watchQuery)
      )
    : watchedAuctions;

  const openPreviewModal = (auction: BuyerAuction) => {
    setSelectedAuction(auction);
    setShowPreviewModal(true);
  };
  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setSelectedAuction(null);
  };

  const quickActions = [
    { label: "Browse Auctions", icon: <Gavel />, bg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50", color: "text-violet-500", path: "/auction" },
    { label: "Add Funds", icon: <Wallet />, bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50", color: "text-emerald-500", path: "/buyer/payments" },
    { label: "Payment Methods", icon: <CreditCard />, bg: isDarkMode ? "bg-sky-500/10" : "bg-sky-50", color: "text-sky-500", path: "/buyer/payments" },
    { label: "Become Seller", icon: <Store />, bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50", color: "text-amber-500", path: "/buyer/becomeSeller" },
  ];

  const paymentStatusStyle = (s?: string) =>
    s === "paid"
      ? isDarkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"
      : isDarkMode ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            borderRadius: "10px",
            background: isDarkMode ? "#1e293b" : "#fff",
            color: isDarkMode ? "#f1f5f9" : "#0f172a",
            border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0",
          },
        }}
      />

      {/* ── Banner ─────────────────────────────────────────────────────── */}
      <div className="relative">
        <div
          className="h-52 md:h-64 bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.45), rgba(15,23,42,0.82)), url(${MOCK_COVER})` }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-4">
          <img
            src={MOCK_USER.photoURL ?? `https://ui-avatars.com/api/?name=${MOCK_USER.name}&background=7c3aed&color=fff`}
            alt={MOCK_USER.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
          />
          <div>
            <h1 className="text-xl font-semibold text-white">Welcome back, {MOCK_USER.name.split(" ")[0]}</h1>
            <p className="text-sm text-white/55 mt-0.5">Track your bids, wins and watchlist</p>
          </div>
        </div>

        {/* Wallet chip + browse CTA */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/10 text-white border border-white/20 backdrop-blur-sm">
            <Wallet className="w-3.5 h-3.5" /> {formatCurrency(MOCK_USER.accountBalance)}
          </span>
          <Link
            to="/auction"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Browse
          </Link>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="mx-auto px-4 md:px-6 py-6 space-y-6">

        {/* ── Seller Application Status ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          className={`${card} overflow-hidden border-l-4 ${
            appStatus.status === "approved" ? "border-l-emerald-500" :
            appStatus.status === "rejected" ? "border-l-rose-500" : "border-l-amber-500"
          }`}
        >
          <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                appStatus.status === "approved" ? "bg-emerald-500/10 text-emerald-500" :
                appStatus.status === "rejected" ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
              }`}>
                {appStatus.status === "approved" ? <FaCheckCircle /> : appStatus.status === "rejected" ? <FaTimesCircle /> : <FaHourglassHalf className="animate-pulse" />}
              </div>
              <div>
                <h3 className={`text-sm font-bold ${strong}`}>Seller Application: <span className="capitalize">{appStatus.status}</span></h3>
                <p className={`text-xs mt-1 ${muted}`}>{appStatus.message}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[11px] font-medium px-2.5 py-1 rounded-lg ${isDarkMode ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                Submitted: {appStatus.submittedAt}
              </span>
              {appStatus.status === "rejected" ? (
                <button onClick={() => navigate("/buyer/becomeSeller")} className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-lg transition-colors">
                  Resubmit
                </button>
              ) : (
                <button onClick={() => navigate("/buyer/becomeSeller")} className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-lg transition-colors">
                  View Request
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Stats Grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statsConfig.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, ...spring }}
              className={`${card} overflow-hidden`}
            >
              <div className="p-4 flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-2">
                  <p className={`text-xs font-medium mb-2 ${muted}`}>{s.label}</p>
                  <p className={`text-2xl font-semibold tracking-tight ${strong}`}>
                    {s.prefix && <span className="text-base mr-0.5">{s.prefix}</span>}
                    <Counter end={s.value} />
                  </p>
                  <p className={`text-xs mt-1 truncate ${muted}`}>{s.sub}</p>
                </div>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}>
                  <span className={s.iconColor}>{s.icon}</span>
                </div>
              </div>
              <div className={`h-0.5 bg-gradient-to-r ${s.bar}`} />
            </motion.div>
          ))}
        </div>

        {/* ── Analytics row: Spending summary + Actions/Bid activity ─────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Spending summary */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, ...spring }} className={`${card} lg:col-span-2`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${div}`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-violet-500/10" : "bg-violet-50"}`}>
                  <DollarSign className="text-violet-500 w-3.5 h-3.5" />
                </div>
                <span className={`text-sm font-semibold ${strong}`}>Spending summary</span>
              </div>
              <span className={`text-xs ${muted}`}>Last 7 months</span>
            </div>
            <div className="p-5">
              <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto">
                {[0, 1, 2, 3].map((i) => {
                  const y = padT + (i / 3) * innerH;
                  return <line key={i} x1={padL} y1={y} x2={chartW - padR} y2={y} stroke={gridLine} strokeWidth={1} />;
                })}
                <defs>
                  <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={areaPath} fill="url(#spendFill)" />
                <path d={linePath} fill="none" stroke="#8b5cf6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                {points.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r={3.5} fill={isDarkMode ? "#1e293b" : "#fff"} stroke="#8b5cf6" strokeWidth={2} />
                    <text x={p.x} y={chartH - 4} textAnchor="middle" fontSize="10" fill={axisText}>{p.label}</text>
                  </g>
                ))}
                <text x={4} y={padT + 4} fontSize="10" fill={axisText}>${(maxVal / 1000).toFixed(1)}k</text>
                <text x={4} y={padT + innerH} fontSize="10" fill={axisText}>${(minVal / 1000).toFixed(1)}k</text>
              </svg>
            </div>
          </motion.div>

          {/* Quick actions + bid activity */}
          <div className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, ...spring }} className={card}>
              <div className={`px-5 py-4 border-b ${div}`}>
                <span className={`text-sm font-semibold ${strong}`}>Quick actions</span>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2.5">
                {quickActions.map((a, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(a.path)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${a.bg}`}
                  >
                    <span className={`text-lg ${a.color}`}>{a.icon}</span>
                    <span className={`text-[11px] font-medium text-center ${strong}`}>{a.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26, ...spring }} className={card}>
              <div className={`px-5 py-4 border-b ${div}`}>
                <span className={`text-sm font-semibold ${strong}`}>Bid activity</span>
              </div>
              <div className="p-5 space-y-4">
                {bidActivity.map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className={muted}>{stat.name}</span>
                      <span className={`font-bold ${strong}`}>{stat.count}</span>
                    </div>
                    <div className={`h-1.5 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-slate-100"}`}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(stat.count / bidActivityMax) * 100}%` }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                        className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Active Bids ────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-emerald-500" />
              <h2 className={`text-base font-bold ${strong}`}>Active bids</h2>
              {outbidAuctions.length > 0 && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isDarkMode ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600"}`}>
                  {outbidAuctions.length} outbid
                </span>
              )}
            </div>
            <Link to="/buyer/status" className={`flex items-center gap-1 text-sm ${muted} hover:text-violet-500 transition-colors`}>
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {activeBids.length === 0 ? (
            <div className={`${card} p-8 text-center`}>
              <p className={muted}>No active bids right now.</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {activeBids.map((auction, i) => {
                const isOutbid = auction.currentBid > auction.myBid;
                const watched = watchlist.has(auction._id);
                return (
                  <motion.div
                    key={auction._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, ...spring }}
                    className={`${card} overflow-hidden group transition-all duration-200 hover:-translate-y-0.5`}
                  >
                    <div className="relative h-40 overflow-hidden cursor-pointer" onClick={() => openPreviewModal(auction)}>
                      <img src={auction.image} alt={auction.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold ${isOutbid ? "bg-amber-500/90 text-white" : "bg-emerald-500/90 text-white"}`}>
                          {isOutbid ? <><TrendingDown className="w-3 h-3" /> OUTBID</> : <><TrendingUp className="w-3 h-3" /> LEADING</>}
                        </span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleWatch(auction); }}
                        className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-colors"
                        title={watched ? "Remove from watchlist" : "Save to watchlist"}
                      >
                        <Heart className={`w-3.5 h-3.5 ${watched ? "fill-rose-500 text-rose-500" : "text-white"}`} />
                      </button>
                      <div className="absolute bottom-3 right-3 text-xs font-bold px-2.5 py-1 rounded-lg bg-black/70 text-white flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatCountdown(auction.endTime)}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className={`font-semibold text-sm line-clamp-1 mb-2 ${strong}`}>{auction.name}</h3>
                      <div className="flex justify-between text-xs mb-3">
                        <div>
                          <p className={muted}>Your bid</p>
                          <p className={`font-semibold ${isOutbid ? "text-rose-500" : "text-emerald-500"}`}>{formatCurrency(auction.myBid)}</p>
                        </div>
                        <div className="text-right">
                          <p className={muted}>Current</p>
                          <p className={`font-semibold ${strong}`}>{formatCurrency(auction.currentBid)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openPreviewModal(auction)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${isDarkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-100 hover:bg-slate-200"}`}
                        >
                          <Eye className="w-3 h-3" /> View
                        </button>
                        <Link
                          to={`/liveAuction/${auction._id}`}
                          className={`flex-1 text-center px-3 py-1.5 rounded-lg text-xs font-medium text-white ${isOutbid ? "bg-amber-500 hover:bg-amber-600" : "bg-violet-600 hover:bg-violet-700"}`}
                        >
                          {isOutbid ? "Raise bid" : "View live"}
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Two-column: Watchlist + Followed sellers/Saved searches ───── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Watchlist */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, ...spring }} className={`${card} lg:col-span-2`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${div}`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-pink-500/10" : "bg-pink-50"}`}>
                  <Heart className="text-pink-500 w-3.5 h-3.5" />
                </div>
                <span className={`text-sm font-semibold ${strong}`}>Watchlist</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                  {watchedAuctions.length}
                </span>
              </div>
              <div className={`relative w-40 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 opacity-50" />
                <input
                  type="text"
                  placeholder="Filter saved…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-7 pr-2 py-1.5 text-xs rounded-lg border outline-none transition-all ${isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"}`}
                />
              </div>
            </div>
            <div className="p-3">
              {filteredWatchlist.length === 0 ? (
                <div className={`rounded-xl p-8 text-center ${isDarkMode ? "bg-slate-700/30" : "bg-slate-50"}`}>
                  <Heart className={`mx-auto w-7 h-7 mb-2 ${muted}`} />
                  <p className={`text-sm font-medium ${strong}`}>Nothing saved yet</p>
                  <p className={`text-xs mt-1 ${muted}`}>Tap the heart on any auction to save it for later</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredWatchlist.map((a) => {
                    const ended = a.status !== "ongoing";
                    return (
                      <div key={a._id} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${hover}`}>
                        <img src={a.image} alt={a.name} className="w-12 h-12 rounded-lg object-cover cursor-pointer" onClick={() => openPreviewModal(a)} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${strong}`}>{a.name}</p>
                          <p className={`text-xs ${muted}`}>
                            {a.category} · <span className="text-emerald-500 font-medium">{formatCurrency(a.currentBid)}</span>
                          </p>
                        </div>
                        <span className={`hidden sm:flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg ${ended ? (isDarkMode ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-500") : (isDarkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600")}`}>
                          <Clock className="w-3 h-3" /> {formatCountdown(a.endTime)}
                        </span>
                        {!ended && (
                          <Link to={`/liveAuction/${a._id}`} className="text-xs px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium">
                            Bid
                          </Link>
                        )}
                        <button
                          onClick={() => toggleWatch(a)}
                          className={`p-2 rounded-lg ${muted} ${isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}
                          title="Remove from watchlist"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Followed sellers + Saved searches */}
          <div className="space-y-5">

            {/* Followed sellers */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, ...spring }} className={card}>
              <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${div}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-indigo-500/10" : "bg-indigo-50"}`}>
                  <Store className="text-indigo-500 w-3.5 h-3.5" />
                </div>
                <span className={`text-sm font-semibold ${strong}`}>Favorite sellers</span>
              </div>
              <div className="p-3 space-y-1">
                {FOLLOWED_SELLERS.map((s) => {
                  const isFollowing = following.has(s.id);
                  return (
                    <div key={s.id} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${hover}`}>
                      <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${strong}`}>{s.name}</p>
                        <p className={`text-xs ${muted}`}>
                          ★ {s.rating}
                          {s.newListings > 0 && <span className="text-violet-500 font-medium"> · {s.newListings} new</span>}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleFollow(s.id, s.name)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${isFollowing ? (isDarkMode ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200") : "bg-violet-600 text-white hover:bg-violet-700"}`}
                      >
                        {isFollowing ? "Following" : "Follow"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Saved searches */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, ...spring }} className={card}>
              <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${div}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-sky-500/10" : "bg-sky-50"}`}>
                  <Bookmark className="text-sky-500 w-3.5 h-3.5" />
                </div>
                <span className={`text-sm font-semibold ${strong}`}>Saved searches</span>
              </div>
              <div className="p-3 space-y-1">
                {SAVED_SEARCHES.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => navigate("/auction")}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors ${hover}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? "bg-slate-700" : "bg-slate-100"}`}>
                      <Search className={`w-3.5 h-3.5 ${muted}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${strong}`}>{q.query}</p>
                      <p className={`text-xs truncate ${muted}`}>{q.filters}</p>
                    </div>
                    {q.newMatches > 0 && (
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${isDarkMode ? "bg-violet-500/10 text-violet-400" : "bg-violet-50 text-violet-600"}`}>
                        {q.newMatches} new
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Purchase history ───────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-500" />
              <h2 className={`text-base font-bold ${strong}`}>Purchase history</h2>
            </div>
            <Link to="/buyer/won-auctions" className={`flex items-center gap-1 text-sm ${muted} hover:text-violet-500 transition-colors`}>
              View all wins <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className={card}>
            <div className="p-3 space-y-1">
              {wonAuctions.map((a) => (
                <div key={a._id} className={`flex items-center gap-4 p-2.5 rounded-xl transition-colors ${hover}`}>
                  <img src={a.image} alt={a.name} className="w-12 h-12 rounded-lg object-cover cursor-pointer" onClick={() => openPreviewModal(a)} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${strong}`}>{a.name}</p>
                    <p className={`text-xs ${muted}`}>{a.category} · {a.seller} · {a.invoiceId}</p>
                  </div>
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] text-emerald-500 font-medium uppercase">Paid</p>
                    <p className={`text-sm font-semibold ${strong}`}>{formatCurrency(a.totalPaid ?? a.myBid)}</p>
                  </div>
                  <span className={`hidden sm:inline-block text-[11px] font-semibold capitalize px-2.5 py-1 rounded-lg ${paymentStatusStyle(a.paymentStatus)}`}>
                    {a.paymentStatus ?? "pending"}
                  </span>
                  <Link
                    to={`/buyer/won-auctions/${a._id}`}
                    className="text-xs px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-medium"
                  >
                    Manage
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Payments & Notification preferences ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Payment methods & addresses */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, ...spring }} className={card}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${div}`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50"}`}>
                  <CreditCard className="text-emerald-500 w-3.5 h-3.5" />
                </div>
                <span className={`text-sm font-semibold ${strong}`}>Payments & addresses</span>
              </div>
              <button onClick={() => navigate("/buyer/payments")} className="text-xs font-medium text-violet-500 hover:text-violet-600">
                Manage
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className={`flex items-center gap-3 p-3 rounded-xl ${isDarkMode ? "bg-slate-700/40" : "bg-slate-50"}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? "bg-violet-500/10" : "bg-violet-50"}`}>
                  <Wallet className="text-violet-500 w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${strong}`}>Wallet balance</p>
                  <p className={`text-xs ${muted}`}>Available to bid instantly</p>
                </div>
                <span className={`text-sm font-bold ${strong}`}>{formatCurrency(MOCK_USER.accountBalance)}</span>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-xl ${isDarkMode ? "bg-slate-700/40" : "bg-slate-50"}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? "bg-sky-500/10" : "bg-sky-50"}`}>
                  <CreditCard className="text-sky-500 w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${strong}`}>Saved cards</p>
                  <p className={`text-xs ${muted}`}>Visa •••• 4242 · Mastercard •••• 8813</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>2</span>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-xl ${isDarkMode ? "bg-slate-700/40" : "bg-slate-50"}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? "bg-amber-500/10" : "bg-amber-50"}`}>
                  <MapPin className="text-amber-500 w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium ${strong}`}>Saved addresses</p>
                  <p className={`text-xs truncate ${muted}`}>42 Maple Street, Dhaka 1207 · +1 more</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>2</span>
              </div>
            </div>
          </motion.div>

          {/* Notification preferences */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, ...spring }} className={card}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${div}`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-rose-500/10" : "bg-rose-50"}`}>
                  <Bell className="text-rose-500 w-3.5 h-3.5" />
                </div>
                <span className={`text-sm font-semibold ${strong}`}>Notification preferences</span>
              </div>
              <div className="flex items-center gap-4 pr-1">
                <span className={`text-[10px] font-semibold uppercase tracking-wide ${muted}`}>Email</span>
                <span className={`text-[10px] font-semibold uppercase tracking-wide ${muted}`}>Push</span>
              </div>
            </div>
            <div className="p-3 space-y-1">
              {NOTIFICATION_EVENTS.map((ev) => (
                <div key={ev.key} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${hover}`}>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${strong}`}>{ev.label}</p>
                    <p className={`text-xs truncate ${muted}`}>{ev.desc}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <ToggleSwitch checked={notifPrefs[ev.key].email} onChange={() => toggleNotif(ev.key, "email")} isDarkMode={isDarkMode} />
                    <ToggleSwitch checked={notifPrefs[ev.key].push} onChange={() => toggleNotif(ev.key, "push")} isDarkMode={isDarkMode} />
                  </div>
                </div>
              ))}
            </div>
            <div className={`px-4 py-3 border-t ${div} flex justify-end`}>
              <button
                onClick={() => toast.success("Notification preferences saved")}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors"
              >
                Save preferences
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Quick Preview Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {showPreviewModal && selectedAuction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={closePreviewModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={spring}
              className={`relative w-full max-w-lg rounded-2xl ${card}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5">
                <img src={selectedAuction.image} alt={selectedAuction.name} className="w-full h-64 object-cover rounded-xl mb-5" />
                <h2 className={`text-lg font-semibold mb-1 ${strong}`}>{selectedAuction.name}</h2>
                <p className={`text-sm ${muted} mb-4`}>{selectedAuction.category} · {selectedAuction.seller} · ★ {selectedAuction.sellerRating}</p>

                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <p className={muted}>Current bid</p>
                    <p className={`font-semibold ${strong}`}>{formatCurrency(selectedAuction.currentBid)}</p>
                  </div>
                  <div>
                    <p className={muted}>Your bid</p>
                    <p className="font-semibold text-emerald-500">{formatCurrency(selectedAuction.myBid)}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { toggleWatch(selectedAuction); }}
                    className={`flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-sm font-medium ${isDarkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-100 hover:bg-slate-200"}`}
                  >
                    <Heart className={`w-4 h-4 ${watchlist.has(selectedAuction._id) ? "fill-rose-500 text-rose-500" : ""}`} />
                  </button>
                  <button
                    onClick={closePreviewModal}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium ${isDarkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-100 hover:bg-slate-200"}`}
                  >
                    Close
                  </button>
                  <Link
                    to={selectedAuction.status === "ongoing" ? `/liveAuction/${selectedAuction._id}` : `/buyer/won-auctions/${selectedAuction._id}`}
                    className="flex-1 py-3 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white text-center"
                    onClick={closePreviewModal}
                  >
                    {selectedAuction.status === "ongoing" ? "Place bid" : "View details"}
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
