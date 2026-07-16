import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers, FaGavel, FaDollarSign, FaChartLine, FaTicketAlt,
  FaShieldAlt, FaCog, FaEdit, FaCheckCircle, FaTimesCircle, FaHourglassHalf,
  FaUserPlus, FaPercentage, FaLayerGroup, FaHistory, FaBoxOpen, FaClipboardList,
} from "react-icons/fa";
import { RiUserStarFill } from "react-icons/ri";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "../../../../hooks/useTheme";
import Counter from "../../../../hooks/Counter";
import { MOCK_USER } from "../../../../data/MOCK_USER";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_COVER_DEFAULT = "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200&q=80";

const MOCK_COVER_OPTIONS = [
  { id: 1, image: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=80" },
  { id: 2, image: "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80" },
  { id: 3, image: "https://images.unsplash.com/photo-1557683311-eac922347aa1?w=800&q=80" },
  { id: 4, image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80" },
  { id: 5, image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80" },
  { id: 6, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" },
];

// Core platform stats (admin-level)
const INITIAL_STATS = {
  totalRevenue: 189450,
  commissionEarned: 18945,
  totalAuctions: 1087,
  liveAuctions: 96,
  completedAuctions: 748,
  pendingApprovals: 11, // seller requests + auction approvals combined
  activeUsers: 4821,
  totalBuyers: 4509,
  totalSellers: 312,
  newRegistrations: 47, // last 7 days
};

const INITIAL_SELLER_REQUESTS = [
  { _id: "sr1", name: "Jordan Lee", email: "jordan.lee@email.com", photo: "https://ui-avatars.com/api/?name=Jordan+Lee&background=7c3aed&color=fff" },
  { _id: "sr2", name: "Priya Sharma", email: "priya.sharma@email.com", photo: "https://ui-avatars.com/api/?name=Priya+Sharma&background=0369a1&color=fff" },
  { _id: "sr3", name: "Marcus Webb", email: "marcus.webb@email.com", photo: "https://ui-avatars.com/api/?name=Marcus+Webb&background=065f46&color=fff" },
  { _id: "sr4", name: "Sofia Diaz", email: "sofia.diaz@email.com", photo: "https://ui-avatars.com/api/?name=Sofia+Diaz&background=be185d&color=fff" },
];

// Pending auctions waiting on admin approval before going live
const INITIAL_AUCTION_APPROVALS = [
  { _id: "ap1", title: "Vintage Leica M6 Camera", seller: "Noah Kim", category: "Electronics", startPrice: 850, photo: "https://images.unsplash.com/photo-1519183071298-a2962be90b8e?w=200&q=80" },
  { _id: "ap2", title: "1965 Fender Stratocaster", seller: "Emily Carter", category: "Instruments", startPrice: 3200, photo: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=200&q=80" },
  { _id: "ap3", title: "Hand-carved Chess Set", seller: "Zara Nguyen", category: "Collectibles", startPrice: 120, photo: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=200&q=80" },
];

const MOCK_RECENT_USERS = [
  { _id: "u1", name: "Emily Carter", email: "emily.carter@email.com", role: "buyer", status: "active", photo: "https://ui-avatars.com/api/?name=Emily+Carter&background=7c3aed&color=fff" },
  { _id: "u2", name: "Noah Kim", email: "noah.kim@email.com", role: "seller", status: "active", photo: "https://ui-avatars.com/api/?name=Noah+Kim&background=0369a1&color=fff" },
  { _id: "u3", name: "Aisha Patel", email: "aisha.patel@email.com", role: "buyer", status: "active", photo: "https://ui-avatars.com/api/?name=Aisha+Patel&background=065f46&color=fff" },
  { _id: "u4", name: "Liam Torres", email: "liam.torres@email.com", role: "seller", status: "suspended", photo: "https://ui-avatars.com/api/?name=Liam+Torres&background=b45309&color=fff" },
  { _id: "u5", name: "Zara Nguyen", email: "zara.nguyen@email.com", role: "buyer", status: "active", photo: "https://ui-avatars.com/api/?name=Zara+Nguyen&background=be185d&color=fff" },
];

const MOCK_SYSTEM = {
  performance: "Excellent · 99.9% uptime",
  supportTickets: 4,
  pendingTasks: 7,
};

// Last 8 months of platform revenue, for the Sales Analytics chart
const MOCK_SALES_TREND = [
  { label: "Dec", value: 12500 },
  { label: "Jan", value: 15200 },
  { label: "Feb", value: 14100 },
  { label: "Mar", value: 18700 },
  { label: "Apr", value: 21300 },
  { label: "May", value: 19800 },
  { label: "Jun", value: 23400 },
  { label: "Jul", value: 26100 },
];

// Category performance breakdown, for the horizontal bar chart
const MOCK_CATEGORY_PERFORMANCE = [
  { name: "Electronics", auctions: 342, share: 31 },
  { name: "Collectibles", auctions: 278, share: 25 },
  { name: "Art", auctions: 198, share: 18 },
  { name: "Vehicles", auctions: 156, share: 14 },
  { name: "Fashion", auctions: 113, share: 12 },
];

const MOCK_RECENT_ACTIVITY = [
  { id: "a1", type: "registration", text: "Aisha Patel registered as a new buyer", time: "6m ago" },
  { id: "a2", type: "approval", text: "Auction \"Vintage Leica M6 Camera\" submitted for approval", time: "22m ago" },
  { id: "a3", type: "payout", text: "Payout of $860 processed for Noah Kim", time: "1h ago" },
  { id: "a4", type: "seller", text: "Jordan Lee requested seller verification", time: "2h ago" },
  { id: "a5", type: "dispute", text: "Buyer Liam Torres reported a delivery dispute", time: "4h ago" },
  { id: "a6", type: "sale", text: "Auction \"Antique Pocket Watch\" closed at $410", time: "6h ago" },
];

// ─── Component ────────────────────────────────────────────────────────────────

const spring = { type: "spring" as const, stiffness: 120, damping: 20 };

const AdminDashboardPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [currentCover, setCurrentCover] = useState(MOCK_COVER_DEFAULT);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCover, setSelectedCover] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [stats, setStats] = useState(INITIAL_STATS);
  const [sellerRequests, setSellerRequests] = useState(INITIAL_SELLER_REQUESTS);
  const [auctionApprovals, setAuctionApprovals] = useState(INITIAL_AUCTION_APPROVALS);

  // ── Design tokens ────────────────────────────────────────────────────────
  const card = `rounded-2xl border ${isDarkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-slate-100 shadow-sm"}`;
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const div = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const hover = isDarkMode ? "hover:bg-slate-700/40" : "hover:bg-slate-50";
  const gridLine = isDarkMode ? "#334155" : "#e2e8f0";
  const axisText = isDarkMode ? "#64748b" : "#94a3b8";

  // ── Handlers ─────────────────────────────────────────────────────────────
  const saveCover = () => {
    if (!selectedCover) { toast.error("Please select a cover image"); return; }
    setIsSaving(true);
    setTimeout(() => {
      setCurrentCover(selectedCover);
      setIsModalOpen(false);
      setSelectedCover(null);
      setIsSaving(false);
      toast.success("Cover updated successfully");
    }, 800);
  };

  const handleApproveSeller = (id: string, name: string) => {
    setSellerRequests(prev => prev.filter(r => r._id !== id));
    setStats(prev => ({
      ...prev,
      pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
      totalSellers: prev.totalSellers + 1,
      totalBuyers: Math.max(0, prev.totalBuyers - 1),
    }));
    toast.success(`${name} approved as seller`);
  };

  const handleRejectSeller = (id: string, name: string) => {
    setSellerRequests(prev => prev.filter(r => r._id !== id));
    setStats(prev => ({ ...prev, pendingApprovals: Math.max(0, prev.pendingApprovals - 1) }));
    toast.error(`${name}'s request rejected`);
  };

  const handleApproveAuction = (id: string, title: string) => {
    setAuctionApprovals(prev => prev.filter(a => a._id !== id));
    setStats(prev => ({
      ...prev,
      pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
      liveAuctions: prev.liveAuctions + 1,
      totalAuctions: prev.totalAuctions + 1,
    }));
    toast.success(`"${title}" approved and is now live`);
  };

  const handleRejectAuction = (id: string, title: string) => {
    setAuctionApprovals(prev => prev.filter(a => a._id !== id));
    setStats(prev => ({ ...prev, pendingApprovals: Math.max(0, prev.pendingApprovals - 1) }));
    toast.error(`"${title}" was rejected`);
  };

  // ── Derived config ────────────────────────────────────────────────────────
  const statsConfig = [
    { label: "Total Revenue", value: stats.totalRevenue, sub: "Lifetime gross volume", prefix: "$", icon: <FaDollarSign className="w-4 h-4" />, iconColor: isDarkMode ? "text-emerald-400" : "text-emerald-600", iconBg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50", bar: "from-emerald-500 to-teal-500" },
    { label: "Commission Earned", value: stats.commissionEarned, sub: "Platform fees collected", prefix: "$", icon: <FaPercentage className="w-4 h-4" />, iconColor: isDarkMode ? "text-teal-400" : "text-teal-600", iconBg: isDarkMode ? "bg-teal-500/10" : "bg-teal-50", bar: "from-teal-500 to-cyan-500" },
    { label: "Total Auctions", value: stats.totalAuctions, sub: `${stats.completedAuctions} completed all-time`, prefix: "", icon: <FaGavel className="w-4 h-4" />, iconColor: isDarkMode ? "text-violet-400" : "text-violet-600", iconBg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50", bar: "from-violet-500 to-blue-500" },
    { label: "Live Auctions", value: stats.liveAuctions, sub: "Currently accepting bids", prefix: "", icon: <FaChartLine className="w-4 h-4" />, iconColor: isDarkMode ? "text-sky-400" : "text-sky-600", iconBg: isDarkMode ? "bg-sky-500/10" : "bg-sky-50", bar: "from-sky-500 to-blue-400" },
    { label: "Completed Auctions", value: stats.completedAuctions, sub: "Successfully closed", prefix: "", icon: <FaCheckCircle className="w-4 h-4" />, iconColor: isDarkMode ? "text-blue-400" : "text-blue-600", iconBg: isDarkMode ? "bg-blue-500/10" : "bg-blue-50", bar: "from-blue-500 to-indigo-500" },
    { label: "Pending Approvals", value: stats.pendingApprovals, sub: "Sellers + auctions to review", prefix: "", icon: <FaHourglassHalf className="w-4 h-4" />, iconColor: isDarkMode ? "text-amber-400" : "text-amber-600", iconBg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50", bar: "from-amber-500 to-orange-500" },
    { label: "Active Users", value: stats.activeUsers, sub: `${stats.totalSellers} sellers · ${stats.totalBuyers} buyers`, prefix: "", icon: <FaUsers className="w-4 h-4" />, iconColor: isDarkMode ? "text-indigo-400" : "text-indigo-600", iconBg: isDarkMode ? "bg-indigo-500/10" : "bg-indigo-50", bar: "from-indigo-500 to-violet-500" },
    { label: "New Registrations", value: stats.newRegistrations, sub: "Last 7 days", prefix: "", icon: <FaUserPlus className="w-4 h-4" />, iconColor: isDarkMode ? "text-rose-400" : "text-rose-600", iconBg: isDarkMode ? "bg-rose-500/10" : "bg-rose-50", bar: "from-rose-500 to-pink-500" },
  ];

  const quickActions = [
    { id: 1, icon: <FaUsers />, label: "Manage Users", path: "/admin/userManagement", color: isDarkMode ? "text-violet-400" : "text-violet-600", bg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50" },
    { id: 2, icon: <FaGavel />, label: "Manage Auctions", path: "/admin/manageAuctions", color: isDarkMode ? "text-sky-400" : "text-sky-600", bg: isDarkMode ? "bg-sky-500/10" : "bg-sky-50" },
    { id: 3, icon: <RiUserStarFill />, label: "Seller Requests", path: "/admin/sellerRequest", color: isDarkMode ? "text-emerald-400" : "text-emerald-600", bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50" },
    { id: 4, icon: <FaShieldAlt />, label: "Security", path: "/dashboard/security", color: isDarkMode ? "text-amber-400" : "text-amber-600", bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50" },
  ];

  const systemItems = [
    { icon: <FaChartLine className="w-3.5 h-3.5" />, label: "Performance", value: MOCK_SYSTEM.performance, color: isDarkMode ? "text-sky-400" : "text-sky-600", bg: isDarkMode ? "bg-sky-500/10" : "bg-sky-50" },
    { icon: <FaTicketAlt className="w-3.5 h-3.5" />, label: "Support tickets", value: `${MOCK_SYSTEM.supportTickets} open`, color: isDarkMode ? "text-amber-400" : "text-amber-600", bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50" },
    { icon: <FaHourglassHalf className="w-3.5 h-3.5" />, label: "Pending tasks", value: `${MOCK_SYSTEM.pendingTasks} to review`, color: isDarkMode ? "text-rose-400" : "text-rose-600", bg: isDarkMode ? "bg-rose-500/10" : "bg-rose-50" },
  ];

  const activityMeta: Record<string, { icon: React.JSX.Element; color: string; bg: string }> = {
    registration: { icon: <FaUserPlus className="w-3.5 h-3.5" />, color: isDarkMode ? "text-rose-400" : "text-rose-600", bg: isDarkMode ? "bg-rose-500/10" : "bg-rose-50" },
    approval: { icon: <FaClipboardList className="w-3.5 h-3.5" />, color: isDarkMode ? "text-amber-400" : "text-amber-600", bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50" },
    payout: { icon: <FaDollarSign className="w-3.5 h-3.5" />, color: isDarkMode ? "text-emerald-400" : "text-emerald-600", bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50" },
    seller: { icon: <RiUserStarFill className="w-3.5 h-3.5" />, color: isDarkMode ? "text-violet-400" : "text-violet-600", bg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50" },
    dispute: { icon: <FaShieldAlt className="w-3.5 h-3.5" />, color: isDarkMode ? "text-red-400" : "text-red-600", bg: isDarkMode ? "bg-red-500/10" : "bg-red-50" },
    sale: { icon: <FaGavel className="w-3.5 h-3.5" />, color: isDarkMode ? "text-sky-400" : "text-sky-600", bg: isDarkMode ? "bg-sky-500/10" : "bg-sky-50" },
  };

  // ── Sales Analytics chart geometry (native SVG, no chart libs) ───────────
  const chartW = 560, chartH = 180, padL = 36, padR = 12, padT = 12, padB = 24;
  const innerW = chartW - padL - padR, innerH = chartH - padT - padB;
  const maxVal = Math.max(...MOCK_SALES_TREND.map(d => d.value));
  const minVal = Math.min(...MOCK_SALES_TREND.map(d => d.value));
  const range = maxVal - minVal || 1;
  const points = MOCK_SALES_TREND.map((d, i) => {
    const x = padL + (i / (MOCK_SALES_TREND.length - 1)) * innerW;
    const y = padT + innerH - ((d.value - minVal) / range) * innerH;
    return { x, y, ...d };
  });
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padT + innerH} L ${points[0].x} ${padT + innerH} Z`;

  // ── Category performance bar geometry ─────────────────────────────────────
  const maxCategory = Math.max(...MOCK_CATEGORY_PERFORMANCE.map(c => c.auctions));

  // ── Render ────────────────────────────────────────────────────────────────
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
          style={{ backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.45), rgba(15,23,42,0.82)), url(${currentCover})` }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-4">
          <img
            src={MOCK_USER.photoURL ? MOCK_USER.photoURL : `https://ui-avatars.com/api/?name=${MOCK_USER.name}&background=7c3aed&color=fff`}
            alt={MOCK_USER.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
          />
          <div>
            <h1 className="text-xl font-semibold text-white">Welcome back, {MOCK_USER.name.split(" ")[0]}</h1>
            <p className="text-sm text-white/55 mt-0.5">Here's what's happening today</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-colors"
        >
          <FaEdit className="w-3 h-3" /> Edit cover
        </button>
      </div>

      {/* ── Cover Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: isDarkMode ? "rgba(2,6,23,0.88)" : "rgba(15,23,42,0.62)",
              backdropFilter: "blur(7px)",
              WebkitBackdropFilter: "blur(7px)",
            }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={spring}
              className={`w-full max-w-2xl rounded-2xl overflow-hidden ${isDarkMode ? "bg-slate-800 border border-slate-700/60" : "bg-white border border-slate-100 shadow-2xl shadow-slate-900/20"}`}
              onClick={e => e.stopPropagation()}
            >
              {/* header */}
              <div className={`flex items-center justify-between px-5 py-4 border-b ${div}`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-violet-500/10" : "bg-violet-50"}`}>
                    <FaEdit className="text-violet-500 w-3 h-3" />
                  </div>
                  <span className={`text-sm font-semibold ${strong}`}>Choose cover image</span>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xl transition-colors ${isDarkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
                >X</button>
              </div>

              {/* grid */}
              <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-3">
                {MOCK_COVER_OPTIONS.map(cover => (
                  <motion.button
                    key={cover.id}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCover(cover.image)}
                    className={`relative rounded-xl overflow-hidden h-28 transition-all ${selectedCover === cover.image
                      ? "ring-2 ring-violet-500 ring-offset-2 " + (isDarkMode ? "ring-offset-slate-800" : "ring-offset-white")
                      : `ring-1 ${isDarkMode ? "ring-slate-700" : "ring-slate-200"}`
                      }`}
                  >
                    <img src={cover.image} alt={`Cover ${cover.id}`} className="w-full h-full object-cover" loading="lazy" />
                    {selectedCover === cover.image && (
                      <div className="absolute inset-0 bg-violet-500/25 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center shadow-lg">
                          <FaCheckCircle className="text-white w-3.5 h-3.5" />
                        </div>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* footer */}
              <div className={`flex items-center justify-end gap-2.5 px-5 py-4 border-t ${div}`}>
                <button
                  onClick={() => { setIsModalOpen(false); setSelectedCover(null); }}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors ${isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
                >Cancel</button>
                <button
                  onClick={saveCover}
                  disabled={!selectedCover || isSaving}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <><svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving…</>
                  ) : "Save changes"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className=" mx-auto px-4 md:px-6 py-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statsConfig.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
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

        {/* Analytics row: Sales trend + Category performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Sales Analytics */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, ...spring }} className={`${card} lg:col-span-2`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${div}`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50"}`}>
                  <FaChartLine className="text-emerald-500 w-3.5 h-3.5" />
                </div>
                <span className={`text-sm font-semibold ${strong}`}>Sales analytics</span>
              </div>
              <span className={`text-xs ${muted}`}>Last 8 months</span>
            </div>
            <div className="p-5">
              <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto">
                {/* horizontal gridlines */}
                {[0, 1, 2, 3].map(i => {
                  const y = padT + (i / 3) * innerH;
                  return <line key={i} x1={padL} y1={y} x2={chartW - padR} y2={y} stroke={gridLine} strokeWidth={1} />;
                })}
                {/* area fill */}
                <defs>
                  <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={areaPath} fill="url(#salesFill)" />
                {/* line */}
                <path d={linePath} fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                {/* points + labels */}
                {points.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r={3.5} fill={isDarkMode ? "#1e293b" : "#fff"} stroke="#10b981" strokeWidth={2} />
                    <text x={p.x} y={chartH - 4} textAnchor="middle" fontSize="10" fill={axisText}>{p.label}</text>
                  </g>
                ))}
                {/* y-axis min/max labels */}
                <text x={4} y={padT + 4} fontSize="10" fill={axisText}>${(maxVal / 1000).toFixed(0)}k</text>
                <text x={4} y={padT + innerH} fontSize="10" fill={axisText}>${(minVal / 1000).toFixed(0)}k</text>
              </svg>
            </div>
          </motion.div>

          {/* Category Performance */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, ...spring }} className={card}>
            <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${div}`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-violet-500/10" : "bg-violet-50"}`}>
                <FaLayerGroup className="text-violet-500 w-3.5 h-3.5" />
              </div>
              <span className={`text-sm font-semibold ${strong}`}>Category performance</span>
            </div>
            <div className="p-4 space-y-3">
              {MOCK_CATEGORY_PERFORMANCE.map((c, i) => (
                <div key={c.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${strong}`}>{c.name}</span>
                    <span className={`text-xs ${muted}`}>{c.auctions} · {c.share}%</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? "bg-slate-700/60" : "bg-slate-100"}`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(c.auctions / maxCategory) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Left col ──────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20, ...spring }} className={card}>
              <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${div}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-slate-700" : "bg-slate-100"}`}>
                  <FaCog className={`w-3.5 h-3.5 ${muted}`} />
                </div>
                <span className={`text-sm font-semibold ${strong}`}>Quick actions</span>
              </div>
              <div className="p-4 grid grid-cols-2 gap-2.5">
                {quickActions.map(a => (
                  <motion.button
                    key={a.id}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(a.path)}
                    className={`flex flex-col items-center gap-2.5 p-4 rounded-xl transition-all ${a.bg}`}
                  >
                    <span className={`text-lg ${a.color}`}>{a.icon}</span>
                    <span className={`text-xs font-medium text-center ${strong}`}>{a.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* System Status */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, ...spring }} className={card}>
              <div className={`flex items-center justify-between px-5 py-4 border-b ${div}`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50"}`}>
                    <FaShieldAlt className="text-emerald-500 w-3.5 h-3.5" />
                  </div>
                  <span className={`text-sm font-semibold ${strong}`}>System status</span>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Live
                </span>
              </div>
              <div className="p-4 space-y-2.5">
                {systemItems.map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${isDarkMode ? "bg-slate-700/40" : "bg-slate-50"}`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.bg}`}>
                      <span className={item.color}>{item.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${strong}`}>{item.label}</p>
                      <p className={`text-xs truncate ${muted}`}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34, ...spring }} className={card}>
              <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${div}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-sky-500/10" : "bg-sky-50"}`}>
                  <FaHistory className="text-sky-500 w-3.5 h-3.5" />
                </div>
                <span className={`text-sm font-semibold ${strong}`}>Recent activity</span>
              </div>
              <div className="p-4 space-y-1">
                {MOCK_RECENT_ACTIVITY.map(item => {
                  const meta = activityMeta[item.type];
                  return (
                    <div key={item.id} className={`flex items-start gap-3 px-2 py-2.5 rounded-xl transition-colors ${hover}`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${meta.bg}`}>
                        <span className={meta.color}>{meta.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs leading-snug ${strong}`}>{item.text}</p>
                        <p className={`text-[11px] mt-0.5 ${muted}`}>{item.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

          </div>

          {/* ── Right col ─────────────────────────────────────────── */}
          <div className="space-y-5 lg:col-span-2">

            {/* Seller Requests */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22, ...spring }} className={card}>
              <div className={`flex items-center justify-between px-5 py-4 border-b ${div}`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-violet-500/10" : "bg-violet-50"}`}>
                    <RiUserStarFill className="text-violet-500 w-3.5 h-3.5" />
                  </div>
                  <span className={`text-sm font-semibold ${strong}`}>Pending seller requests</span>
                  {sellerRequests.length > 0 && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isDarkMode ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-600"}`}>
                      {sellerRequests.length}
                    </span>
                  )}
                </div>
                <button onClick={() => navigate("/admin/sellerRequest")} className={`text-xs font-medium transition-colors ${isDarkMode ? "text-violet-400 hover:text-violet-300" : "text-violet-600 hover:text-violet-700"}`}>
                  View all
                </button>
              </div>

              <div className="p-4">
                <AnimatePresence>
                  {sellerRequests.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className={`rounded-xl p-10 text-center ${isDarkMode ? "bg-slate-700/30" : "bg-slate-50"}`}
                    >
                      <RiUserStarFill className={`mx-auto text-3xl mb-2 ${muted}`} />
                      <p className={`text-sm font-medium ${strong}`}>All caught up</p>
                      <p className={`text-xs mt-1 ${muted}`}>No pending requests at the moment</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-2">
                      {sellerRequests.map(req => (
                        <motion.div
                          key={req._id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={spring}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${hover} ${isDarkMode ? "bg-slate-700/30" : "bg-slate-50"}`}
                        >
                          <div className="flex items-center gap-3">
                            <img src={req.photo} alt={req.name} className="w-9 h-9 rounded-xl object-cover" onError={e => { (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${req.name}&background=5b21b6&color=fff`; }} />
                            <div>
                              <p className={`text-sm font-medium ${strong}`}>{req.name}</p>
                              <p className={`text-xs ${muted}`}>{req.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <motion.button
                              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => handleApproveSeller(req._id, req.name)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                            >
                              <FaCheckCircle className="w-3 h-3" /> Approve
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => handleRejectSeller(req._id, req.name)}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isDarkMode ? "text-rose-400 hover:bg-rose-500/10" : "text-rose-500 hover:bg-rose-50"}`}
                            >
                              <FaTimesCircle className="w-3 h-3" /> Reject
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Auction Approvals */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.27, ...spring }} className={card}>
              <div className={`flex items-center justify-between px-5 py-4 border-b ${div}`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-amber-500/10" : "bg-amber-50"}`}>
                    <FaBoxOpen className="text-amber-500 w-3.5 h-3.5" />
                  </div>
                  <span className={`text-sm font-semibold ${strong}`}>Auctions awaiting approval</span>
                  {auctionApprovals.length > 0 && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isDarkMode ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-600"}`}>
                      {auctionApprovals.length}
                    </span>
                  )}
                </div>
                <button onClick={() => navigate("/admin/manageAuctions")} className={`text-xs font-medium transition-colors ${isDarkMode ? "text-violet-400 hover:text-violet-300" : "text-violet-600 hover:text-violet-700"}`}>
                  View all
                </button>
              </div>

              <div className="p-4">
                <AnimatePresence>
                  {auctionApprovals.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className={`rounded-xl p-10 text-center ${isDarkMode ? "bg-slate-700/30" : "bg-slate-50"}`}
                    >
                      <FaBoxOpen className={`mx-auto text-3xl mb-2 ${muted}`} />
                      <p className={`text-sm font-medium ${strong}`}>Nothing waiting</p>
                      <p className={`text-xs mt-1 ${muted}`}>All submitted auctions have been reviewed</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-2">
                      {auctionApprovals.map(item => (
                        <motion.div
                          key={item._id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={spring}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${hover} ${isDarkMode ? "bg-slate-700/30" : "bg-slate-50"}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img src={item.photo} alt={item.title} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                            <div className="min-w-0">
                              <p className={`text-sm font-medium truncate ${strong}`}>{item.title}</p>
                              <p className={`text-xs truncate ${muted}`}>{item.seller} · {item.category} · ${item.startPrice}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <motion.button
                              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => handleApproveAuction(item._id, item.title)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                            >
                              <FaCheckCircle className="w-3 h-3" /> Approve
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => handleRejectAuction(item._id, item.title)}
                              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${isDarkMode ? "text-rose-400 hover:bg-rose-500/10" : "text-rose-500 hover:bg-rose-50"}`}
                            >
                              <FaTimesCircle className="w-3 h-3" /> Reject
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Recent Users */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, ...spring }} className={card}>
              <div className={`flex items-center justify-between px-5 py-4 border-b ${div}`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-sky-500/10" : "bg-sky-50"}`}>
                    <FaUsers className="text-sky-500 w-3.5 h-3.5" />
                  </div>
                  <span className={`text-sm font-semibold ${strong}`}>Recent users</span>
                </div>
                <button onClick={() => navigate("/admin/userManagement")} className={`text-xs font-medium transition-colors ${isDarkMode ? "text-violet-400 hover:text-violet-300" : "text-violet-600 hover:text-violet-700"}`}>
                  View all
                </button>
              </div>
              <div className="p-4 space-y-1">
                {MOCK_RECENT_USERS.map(u => (
                  <div key={u._id} className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${hover}`}>
                    <div className="flex items-center gap-3">
                      <img src={u.photo} alt={u.name} className="w-8 h-8 rounded-xl object-cover" onError={e => { (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${u.name}&background=5b21b6&color=fff`; }} />
                      <div>
                        <p className={`text-sm font-medium ${strong}`}>{u.name}</p>
                        <p className={`text-xs ${muted}`}>{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs capitalize px-2.5 py-1 rounded-lg font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                        {u.role}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${u.status === "active"
                        ? isDarkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700"
                        : isDarkMode ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-600"
                        }`}>
                        {u.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;