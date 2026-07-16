import { motion } from "framer-motion";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import {
  FaBoxOpen,
  FaChartLine,
  FaCheckCircle,
  FaDollarSign,
  FaEdit,
  FaEye,
  FaGavel,
  FaHeadset,
  FaHeart,
  FaPlus,
  FaUserEdit,
  FaWallet
} from "react-icons/fa";
import { RiAuctionFill, RiMoneyDollarBoxFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { MOCK_USER } from "../../../../data/MOCK_USER";
import Counter from "../../../../hooks/Counter";
import { useTheme } from "../../../../hooks/useTheme";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_COVER_DEFAULT = "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=1200&q=80";

const SELLER_STATS = {
  totalAuctions: 24,
  activeAuctions: 7,
  soldItems: 15,
  revenue: 12450.50,
  pendingPayout: 1200.00,
  totalViews: 8432,
  watchlistCount: 412,
  bidCount: 89,
};

// Application Status: 'pending' | 'approved' | 'rejected'
const SELLER_APPLICATION = {
  status: "pending", 
  message: "Your application is currently under review by our moderation team.",
  submittedAt: "July 05, 2026",
};

const MY_RECENT_AUCTIONS = [
  { _id: "a1", title: "Professional DSLR Camera", bids: 12, currentPrice: 1200, status: "active", photo: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&q=80" },
  { _id: "a2", title: "Mechanical Gaming Keyboard", bids: 8, currentPrice: 150, status: "sold", photo: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=200&q=80" },
  { _id: "a3", title: "Minimalist Desk Lamp", bids: 0, currentPrice: 45, status: "pending", photo: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=200&q=80" },
];

const RECENT_BIDS_ON_MY_ITEMS = [
  { id: "b1", user: "Alex M.", item: "DSLR Camera", amount: 1200, time: "4m ago" },
  { id: "b2", user: "Sarah K.", item: "DSLR Camera", amount: 1150, time: "18m ago" },
  { id: "b3", user: "John Doe", item: "Gaming Keyboard", amount: 150, time: "1h ago" },
];

const REVENUE_TREND = [
  { label: "Jan", value: 1200 },
  { label: "Feb", value: 2100 },
  { label: "Mar", value: 800 },
  { label: "Apr", value: 1600 },
  { label: "May", value: 2400 },
  { label: "Jun", value: 1900 },
  { label: "Jul", value: 2800 },
];

const BID_STATISTICS = [
  { name: "Active Bids", count: 42, color: "from-blue-500 to-sky-400" },
  { name: "Buy It Now", count: 12, color: "from-emerald-500 to-teal-400" },
  { name: "Outbid Items", count: 8, color: "from-amber-500 to-orange-400" },
];

// ─── Component ────────────────────────────────────────────────────────────────

const spring = { type: "spring" as const, stiffness: 120, damping: 20 };

const SellerDashboardPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [currentCover] = useState(MOCK_COVER_DEFAULT);
  const [appStatus, setAppStatus] = useState(SELLER_APPLICATION);

  // ── Design tokens ────────────────────────────────────────────────────────
  const card = `rounded-2xl border ${isDarkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-slate-100 shadow-sm"}`;
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const div = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const hover = isDarkMode ? "hover:bg-slate-700/40" : "hover:bg-slate-50";
  const gridLine = isDarkMode ? "#334155" : "#e2e8f0";
  const axisText = isDarkMode ? "#64748b" : "#94a3b8";

  // ── Stats Config ────────────────────────────────────────────────────────
  const statsConfig = [
    { label: "Total Auctions", value: SELLER_STATS.totalAuctions, sub: "Lifetime listings", icon: <FaBoxOpen />, iconColor: "text-violet-500", iconBg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50", bar: "from-violet-500 to-blue-500" },
    { label: "Active Auctions", value: SELLER_STATS.activeAuctions, sub: "Currently live", icon: <FaGavel />, iconColor: "text-sky-500", iconBg: isDarkMode ? "bg-sky-500/10" : "bg-sky-50", bar: "from-sky-500 to-indigo-500" },
    { label: "Sold Items", value: SELLER_STATS.soldItems, sub: "Successfully closed", icon: <FaCheckCircle />, iconColor: "text-emerald-500", iconBg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50", bar: "from-emerald-500 to-teal-500" },
    { label: "Total Revenue", value: SELLER_STATS.revenue, sub: "Gross earnings", prefix: "$", icon: <FaDollarSign />, iconColor: "text-amber-500", iconBg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50", bar: "from-amber-500 to-orange-500" },
    { label: "Pending Payout", value: SELLER_STATS.pendingPayout, sub: "Processing to bank", prefix: "$", icon: <FaWallet />, iconColor: "text-rose-500", iconBg: isDarkMode ? "bg-rose-500/10" : "bg-rose-50", bar: "from-rose-500 to-pink-500" },
    { label: "Total Views", value: SELLER_STATS.totalViews, sub: "Across all listings", icon: <FaEye />, iconColor: "text-blue-500", iconBg: isDarkMode ? "bg-blue-500/10" : "bg-blue-50", bar: "from-blue-500 to-cyan-500" },
    { label: "Watchlist Count", value: SELLER_STATS.watchlistCount, sub: "Potential buyers", icon: <FaHeart />, iconColor: "text-pink-500", iconBg: isDarkMode ? "bg-pink-500/10" : "bg-pink-50", bar: "from-pink-500 to-rose-500" },
    { label: "Bid Statistics", value: SELLER_STATS.bidCount, sub: "Total bids received", icon: <FaChartLine />, iconColor: "text-indigo-500", iconBg: isDarkMode ? "bg-indigo-500/10" : "bg-indigo-50", bar: "from-indigo-500 to-violet-500" },
  ];

  // ── Revenue Chart Logic ──────────────────────────────────────────────────
  const chartW = 560, chartH = 180, padL = 36, padR = 12, padT = 12, padB = 24;
  const innerW = chartW - padL - padR, innerH = chartH - padT - padB;
  const maxVal = Math.max(...REVENUE_TREND.map(d => d.value));
  const minVal = Math.min(...REVENUE_TREND.map(d => d.value));
  const points = REVENUE_TREND.map((d, i) => ({
    x: padL + (i / (REVENUE_TREND.length - 1)) * innerW,
    y: padT + innerH - ((d.value - minVal) / (maxVal - minVal || 1)) * innerH,
    ...d
  }));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-right" />

      {/* ── Banner ─────────────────────────────────────────────────────── */}
      <div className="relative">
        <div className="h-52 md:h-64 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.45), rgba(15,23,42,0.82)), url(${currentCover})` }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-4">
          <img src={`https://ui-avatars.com/api/?name=${MOCK_USER.name}&background=7c3aed&color=fff`} alt={MOCK_USER.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-xl" />
          <div>
            <h1 className="text-xl font-semibold text-white">Seller Dashboard</h1>
            <p className="text-sm text-white/55 mt-0.5">Manage your auctions and track earnings</p>
          </div>
        </div>
      </div>

      <div className=" mx-auto px-4 md:px-6 py-6 space-y-6 relative z-10">
      

        {/* ── Stats Grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statsConfig.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, ...spring }} className={`${card} overflow-hidden`}>
              <div className="p-4 flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium mb-1.5 ${muted}`}>{s.label}</p>
                  <p className={`text-2xl font-semibold tracking-tight ${strong}`}>
                    {s.prefix && <span className="text-base mr-0.5">{s.prefix}</span>}
                    <Counter end={s.value} />
                  </p>
                  <p className={`text-[10px] mt-1 truncate ${muted}`}>{s.sub}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}>
                  <span className={`text-lg ${s.iconColor}`}>{s.icon}</span>
                </div>
              </div>
              <div className={`h-1 bg-gradient-to-r ${s.bar}`} />
            </motion.div>
          ))}
        </div>

        {/* ── Analytics & Actions Row ────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Revenue Flow */}
          <motion.div className={`${card} lg:col-span-2`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${div}`}>
              <div className="flex items-center gap-2.5">
                <RiMoneyDollarBoxFill className="text-emerald-500 text-xl" />
                <span className={`text-sm font-semibold ${strong}`}>Revenue flow</span>
              </div>
              <span className={`text-xs ${muted}`}>Past 7 months</span>
            </div>
            <div className="p-5">
              <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto">
                {[0, 1, 2].map(i => {
                  const y = padT + (i / 2) * innerH;
                  return <line key={i} x1={padL} y1={y} x2={chartW - padR} y2={y} stroke={gridLine} strokeWidth={1} />;
                })}
                <path d={linePath} fill="none" stroke="#10b981" strokeWidth={3} strokeLinecap="round" />
                {points.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r={4} fill={isDarkMode ? "#1e293b" : "#fff"} stroke="#10b981" strokeWidth={2} />
                    <text x={p.x} y={chartH - 2} textAnchor="middle" fontSize="10" fill={axisText}>{p.label}</text>
                  </g>
                ))}
              </svg>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <motion.div className={card}>
              <div className={`px-5 py-4 border-b ${div}`}>
                <span className={`text-sm font-semibold ${strong}`}>Seller Actions</span>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {[
                  { label: "New Auction", icon: <FaPlus />, bg: "bg-violet-500/10", color: "text-violet-500" },
                  { label: "Withdraw", icon: <FaWallet />, bg: "bg-emerald-500/10", color: "text-emerald-500" },
                  { label: "Edit Profile", icon: <FaUserEdit />, bg: "bg-sky-500/10", color: "text-sky-500" },
                  { label: "Help Center", icon: <FaHeadset />, bg: "bg-amber-500/10", color: "text-amber-500" },
                ].map((action, i) => (
                  <button key={i} className={`flex flex-col items-center justify-center p-4 rounded-2xl gap-2 transition-transform hover:scale-105 ${action.bg}`}>
                    <span className={`text-xl ${action.color}`}>{action.icon}</span>
                    <span className={`text-[11px] font-bold ${strong}`}>{action.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Bid Statistics Bars */}
            <motion.div className={card}>
              <div className={`px-5 py-4 border-b ${div}`}>
                <span className={`text-sm font-semibold ${strong}`}>Bid activity</span>
              </div>
              <div className="p-5 space-y-4">
                {BID_STATISTICS.map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className={muted}>{stat.name}</span>
                      <span className={`font-bold ${strong}`}>{stat.count}</span>
                    </div>
                    <div className={`h-1.5 rounded-full ${isDarkMode ? "bg-slate-700" : "bg-slate-100"}`}>
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${(stat.count / 50) * 100}%` }}
                        className={`h-full rounded-full bg-gradient-to-r ${stat.color}`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Secondary Grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* My Auctions List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className={`text-base font-bold ${strong}`}>My listed auctions</h2>
              <button className="text-xs text-violet-500 font-bold">View Gallery</button>
            </div>
            {MY_RECENT_AUCTIONS.map((item, i) => (
              <motion.div key={i} className={`${card} p-3 flex items-center justify-between gap-4 transition-colors ${hover}`}>
                <div className="flex items-center gap-4">
                  <img src={item.photo} alt={item.title} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className={`text-sm font-bold ${strong}`}>{item.title}</h4>
                    <p className={`text-xs ${muted}`}>{item.bids} bids · Current: <span className="text-emerald-500 font-bold">${item.currentPrice}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] uppercase font-black px-2 py-1 rounded-md ${
                    item.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : 
                    item.status === 'sold' ? "bg-blue-500/10 text-blue-500" : "bg-amber-500/10 text-amber-500"
                  }`}>
                    {item.status}
                  </span>
                  <button className={`p-2 rounded-lg ${isDarkMode ? "bg-slate-700" : "bg-slate-100"} ${muted}`}>
                    <FaEdit size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Recent Bid Activity Feed */}
          <div className="space-y-4">
            <h2 className={`text-base font-bold ${strong}`}>Recent bids received</h2>
            <div className={card}>
              <div className="p-2">
                {RECENT_BIDS_ON_MY_ITEMS.map((bid, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${hover}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? "bg-slate-700" : "bg-slate-100"}`}>
                      <RiAuctionFill className="text-violet-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs ${strong}`}>
                        <span className="font-bold">{bid.user}</span> bid <span className="text-emerald-500 font-bold">${bid.amount}</span> on {bid.item}
                      </p>
                      <p className={`text-[10px] mt-0.5 ${muted}`}>{bid.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className={`w-full py-3 text-xs font-bold border-t ${div} ${muted} hover:text-violet-500 transition-colors`}>
                View All Activity
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SellerDashboardPage;