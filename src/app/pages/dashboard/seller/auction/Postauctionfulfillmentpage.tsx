import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowDownToLine,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Download,
    Eye,
    History,
    Lock,
    MapPinned,
    PackageCheck,
    Search,
    Send,
    ShieldCheck,
    Truck,
    Wallet,
    X,
    XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "../../../../../hooks/useTheme";

// ─── Types ─────────────────────────────────────────────────────────────────

type OrderStatus = "awaiting_acceptance" | "preparing" | "shipped" | "completed" | "rejected";

interface Order {
  _id: string;
  auctionTitle: string;
  coverImage: string;
  finalPrice: number;
  commissionRate: number;
  paymentConfirmed: boolean;
  winner: { name: string; photo: string; email: string; phone: string; address: string };
  status: OrderStatus;
  rejectReason?: string;
  carrier?: string;
  trackingNumber?: string;
  shippedDate?: string;
  buyerConfirmedDelivery?: boolean;
  orderDate: string;
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  method: string;
  date: string;
  status: "pending" | "completed" | "failed";
}

// ─── Mock data ─────────────────────────────────────────────────────────────

const MOCK_ORDERS: Order[] = [
  {
    _id: "o1", auctionTitle: "Antique Pocket Watch — 18k Gold", coverImage: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=200&q=80",
    finalPrice: 940, commissionRate: 10, paymentConfirmed: true,
    winner: { name: "Liam Torres", photo: "https://ui-avatars.com/api/?name=Liam+Torres&background=b45309&color=fff", email: "liam.torres@email.com", phone: "+880 1712-345678", address: "House 12, Road 4, Gulshan, Dhaka" },
    status: "awaiting_acceptance", orderDate: "2026-07-08",
  },
  {
    _id: "o2", auctionTitle: "Signed First-Edition Novel Set", coverImage: "https://images.unsplash.com/photo-1521123845560-14093637aa7d?w=200&q=80",
    finalPrice: 410, commissionRate: 10, paymentConfirmed: true,
    winner: { name: "Noah Kim", photo: "https://ui-avatars.com/api/?name=Noah+Kim&background=0369a1&color=fff", email: "noah.kim@email.com", phone: "+880 1812-345678", address: "Flat 3B, Banani, Dhaka" },
    status: "preparing", orderDate: "2026-07-05",
  },
  {
    _id: "o3", auctionTitle: "Rare Vinyl Record Collection", coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80",
    finalPrice: 380, commissionRate: 10, paymentConfirmed: true,
    winner: { name: "Sofia Diaz", photo: "https://ui-avatars.com/api/?name=Sofia+Diaz&background=be185d&color=fff", email: "sofia.diaz@email.com", phone: "+880 1912-345678", address: "House 7, Road 11, Dhanmondi, Dhaka" },
    status: "shipped", carrier: "Pathao Courier", trackingNumber: "PT-2201938", shippedDate: "2026-07-02", buyerConfirmedDelivery: false, orderDate: "2026-06-30",
  },
  {
    _id: "o4", auctionTitle: "1965 Fender Stratocaster", coverImage: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=200&q=80",
    finalPrice: 4550, commissionRate: 8, paymentConfirmed: true,
    winner: { name: "Jordan Lee", photo: "https://ui-avatars.com/api/?name=Jordan+Lee&background=0d9488&color=fff", email: "jordan.lee@email.com", phone: "+880 1612-345678", address: "House 21, Uttara Sector 4, Dhaka" },
    status: "completed", carrier: "FedEx International", trackingNumber: "FX-88012738", shippedDate: "2026-06-12", buyerConfirmedDelivery: true, orderDate: "2026-06-10",
  },
  {
    _id: "o5", auctionTitle: "Hand-carved Rosewood Chess Set", coverImage: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=200&q=80",
    finalPrice: 150, commissionRate: 10, paymentConfirmed: false,
    winner: { name: "Zara Nguyen", photo: "https://ui-avatars.com/api/?name=Zara+Nguyen&background=be185d&color=fff", email: "zara.nguyen@email.com", phone: "+880 1512-345678", address: "House 9, Khulna" },
    status: "awaiting_acceptance", orderDate: "2026-07-07",
  },
  {
    _id: "o6", auctionTitle: "Vintage Polaroid SX-70 Camera", coverImage: "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=200&q=80",
    finalPrice: 130, commissionRate: 10, paymentConfirmed: true,
    winner: { name: "Aisha Patel", photo: "https://ui-avatars.com/api/?name=Aisha+Patel&background=065f46&color=fff", email: "aisha.patel@email.com", phone: "+880 1312-345678", address: "House 5, Sylhet" },
    status: "rejected", rejectReason: "Item sold in a separate local sale before shipment could be arranged.", orderDate: "2026-06-28",
  },
];

const MOCK_WITHDRAWALS: WithdrawalRequest[] = [
  { id: "w1", amount: 800, method: "bKash", date: "2026-06-20", status: "completed" },
  { id: "w2", amount: 1200, method: "Bank Transfer", date: "2026-06-30", status: "completed" },
  { id: "w3", amount: 500, method: "bKash", date: "2026-07-06", status: "pending" },
];

// ─── Config ────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<OrderStatus, { label: string; icon: React.JSX.Element; color: string }> = {
  awaiting_acceptance: { label: "Awaiting Acceptance", icon: <Clock className="w-3.5 h-3.5" />, color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  preparing: { label: "Preparing", icon: <PackageCheck className="w-3.5 h-3.5" />, color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
  shipped: { label: "Shipped", icon: <Truck className="w-3.5 h-3.5" />, color: "bg-violet-500/15 text-violet-400 border-violet-500/20" },
  completed: { label: "Completed", icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  rejected: { label: "Rejected", icon: <XCircle className="w-3.5 h-3.5" />, color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
};

const PAGE_SIZE = 5;
const SECTIONS = [
  { key: "orders", label: "Orders" },
  { key: "shipping", label: "Shipping" },
  { key: "earnings", label: "Earnings" },
] as const;
type SectionKey = (typeof SECTIONS)[number]["key"];

// ─── Component ─────────────────────────────────────────────────────────────

export default function PostAuctionFulfillmentPage() {
  const { isDarkMode } = useTheme();

  const [section, setSection] = useState<SectionKey>("orders");
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const [orderTab, setOrderTab] = useState<"all" | OrderStatus>("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderPage, setOrderPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [shipCarrier, setShipCarrier] = useState("");
  const [shipTracking, setShipTracking] = useState("");
  const [showShipForm, setShowShipForm] = useState(false);

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(MOCK_WITHDRAWALS);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("bKash");

  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const divider = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const panel = isDarkMode ? "bg-slate-700/40" : "bg-slate-50";
  const inputCls = `w-full px-3 py-2 text-sm rounded-xl border outline-none transition-all ${
    isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
  }`;

  const selected = useMemo(() => orders.find(o => o._id === selectedId) || null, [orders, selectedId]);

  useEffect(() => { setOrderPage(1); }, [orderTab, orderSearch]);

  const orderCounts = orders.reduce((acc: Record<string, number>, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});

  const filteredOrders = useMemo(() => orders.filter(o => {
    const matchesSearch = o.auctionTitle.toLowerCase().includes(orderSearch.toLowerCase()) || o.winner.name.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesTab = orderTab === "all" || o.status === orderTab;
    return matchesSearch && matchesTab;
  }), [orders, orderSearch, orderTab]);
  const orderTotalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const orderPageSafe = Math.min(orderPage, orderTotalPages);
  const paginatedOrders = filteredOrders.slice((orderPageSafe - 1) * PAGE_SIZE, orderPageSafe * PAGE_SIZE);

  const shippingQueue = orders.filter(o => o.status === "preparing" || o.status === "shipped");

  // ── earnings math ───────────────────────────────────────────────────────
  const completedNet = orders.filter(o => o.status === "completed").reduce((s, o) => s + o.finalPrice * (1 - o.commissionRate / 100), 0);
  const shippedNet = orders.filter(o => o.status === "shipped").reduce((s, o) => s + o.finalPrice * (1 - o.commissionRate / 100), 0);
  const withdrawnTotal = withdrawals.filter(w => w.status === "completed").reduce((s, w) => s + w.amount, 0);
  const pendingWithdrawTotal = withdrawals.filter(w => w.status === "pending").reduce((s, w) => s + w.amount, 0);
  const availableBalance = Math.max(0, Math.round(completedNet - withdrawnTotal - pendingWithdrawTotal));
  const pendingBalance = Math.round(shippedNet);

  const stats = [
    { label: "Won Orders", value: orders.length, icon: <PackageCheck className="w-4 h-4" />, color: "text-violet-400", bg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50", bar: "from-violet-500 to-blue-500" },
    { label: "Awaiting Action", value: (orderCounts.awaiting_acceptance || 0) + (orderCounts.preparing || 0), icon: <Clock className="w-4 h-4" />, color: "text-amber-400", bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50", bar: "from-amber-500 to-orange-500" },
    { label: "Available Balance", value: `$${availableBalance}`, icon: <Wallet className="w-4 h-4" />, color: "text-emerald-400", bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50", bar: "from-emerald-500 to-teal-500" },
    { label: "Pending Balance", value: `$${pendingBalance}`, icon: <History className="w-4 h-4" />, color: "text-sky-400", bg: isDarkMode ? "bg-sky-500/10" : "bg-sky-50", bar: "from-sky-500 to-blue-400" },
  ];

  // ── order handlers ──────────────────────────────────────────────────────
  const openOrder = (o: Order) => { setSelectedId(o._id); setShowRejectForm(false); setRejectReason(""); setShowShipForm(false); setShipCarrier(""); setShipTracking(""); };
  const closeOrder = () => setSelectedId(null);
  const today = () => new Date().toISOString().slice(0, 10);

  const acceptOrder = (o: Order) => {
    setOrders(prev => prev.map(x => x._id === o._id ? { ...x, status: "preparing" } : x));
    toast.success(`Order for "${o.auctionTitle}" accepted`);
  };
  const rejectOrder = (o: Order) => {
    if (!rejectReason.trim()) { toast.error("Please provide a reason"); return; }
    setOrders(prev => prev.map(x => x._id === o._id ? { ...x, status: "rejected", rejectReason: rejectReason.trim() } : x));
    toast.error(`Order for "${o.auctionTitle}" rejected`);
    setShowRejectForm(false); setRejectReason("");
  };
  const markShipped = (o: Order) => {
    if (!shipCarrier.trim() || !shipTracking.trim()) { toast.error("Carrier and tracking number are required"); return; }
    setOrders(prev => prev.map(x => x._id === o._id ? { ...x, status: "shipped", carrier: shipCarrier.trim(), trackingNumber: shipTracking.trim(), shippedDate: today(), buyerConfirmedDelivery: false } : x));
    toast.success(`"${o.auctionTitle}" marked shipped`);
    setShowShipForm(false); setShipCarrier(""); setShipTracking("");
  };
  const simulateBuyerConfirm = (o: Order) => {
    setOrders(prev => prev.map(x => x._id === o._id ? { ...x, buyerConfirmedDelivery: true } : x));
    toast.success("Buyer confirmed delivery");
  };
  const completeOrder = (o: Order) => {
    setOrders(prev => prev.map(x => x._id === o._id ? { ...x, status: "completed" } : x));
    toast.success(`Order for "${o.auctionTitle}" completed — payout added to pending balance`);
  };
  const downloadLabel = (o: Order) => {
    const content = `Shipping Label\nOrder: ${o.auctionTitle}\nTo: ${o.winner.name}\n${o.winner.address}\nPhone: ${o.winner.phone}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `label-${o._id}.txt`; a.click(); URL.revokeObjectURL(url);
    toast.success("Shipping label downloaded");
  };

  // ── withdrawal handlers ──────────────────────────────────────────────────
  const requestWithdrawal = () => {
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    if (amt > availableBalance) { toast.error("Amount exceeds available balance"); return; }
    setWithdrawals(prev => [{ id: `w-${Date.now()}`, amount: amt, method: withdrawMethod, date: today(), status: "pending" }, ...prev]);
    toast.success(`Withdrawal of $${amt} requested via ${withdrawMethod}`);
    setWithdrawAmount("");
  };

  // ── pagination ───────────────────────────────────────────────────────────
  const Pagination = () => (
    <div className={`flex items-center justify-between px-5 py-4 border-t ${divider}`}>
      <p className={`text-xs ${muted}`}>Showing {filteredOrders.length === 0 ? 0 : (orderPageSafe - 1) * PAGE_SIZE + 1}–{Math.min(orderPageSafe * PAGE_SIZE, filteredOrders.length)} of {filteredOrders.length}</p>
      <div className="flex items-center gap-1.5">
        <button onClick={() => setOrderPage(p => Math.max(1, p - 1))} disabled={orderPageSafe === 1} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}><ChevronLeft className="w-4 h-4" /></button>
        {Array.from({ length: orderTotalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => setOrderPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium ${p === orderPageSafe ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"}`}>{p}</button>
        ))}
        <button onClick={() => setOrderPage(p => Math.min(orderTotalPages, p + 1))} disabled={orderPageSafe === orderTotalPages} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}><ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );

  const commissionAmount = selected ? Math.round(selected.finalPrice * (selected.commissionRate / 100)) : 0;
  const netPayout = selected ? selected.finalPrice - commissionAmount : 0;

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px", borderRadius: "10px", background: isDarkMode ? "#1e293b" : "#fff", color: isDarkMode ? "#f1f5f9" : "#0f172a", border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0" } }} />

      {/* Header */}
      <div className={`sticky top-0 z-20 border-b backdrop-blur-xl ${isDarkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-slate-200"}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-xl font-bold tracking-tight">Post-Auction & Fulfillment</h1>
          <p className={`text-xs mt-0.5 ${muted}`}>Manage won orders, shipping and your earnings</p>
        </div>
        <div className="px-4 sm:px-6 lg:px-8 pb-3 flex gap-1">
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => setSection(s.key)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${section === s.key ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}>{s.label}</button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats always visible */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`rounded-2xl border overflow-hidden ${surface}`}>
              <div className="p-4 flex items-start justify-between">
                <div><p className={`text-xs font-medium mb-2 ${muted}`}>{s.label}</p><p className={`font-semibold text-2xl ${strong}`}>{s.value}</p></div>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.bg}`}><span className={s.color}>{s.icon}</span></div>
              </div>
              <div className={`h-0.5 bg-gradient-to-r ${s.bar}`} />
            </motion.div>
          ))}
        </div>

        {/* ── Orders section ───────────────────────────────────────────── */}
        {section === "orders" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {(["all", "awaiting_acceptance", "preparing", "shipped", "completed", "rejected"] as const).map(t => (
                  <button key={t} onClick={() => setOrderTab(t)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${orderTab === t ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}>
                    {t === "all" ? "All" : STATUS_CFG[t].label}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${orderTab === t ? "bg-white/20" : isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>{t === "all" ? orders.length : orderCounts[t] || 0}</span>
                  </button>
                ))}
              </div>
              <div className={`relative w-full sm:w-64 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
                <input value={orderSearch} onChange={e => setOrderSearch(e.target.value)} placeholder="Search auction or buyer..." className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border outline-none ${isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500" : "bg-slate-50 border-slate-200 placeholder-slate-400"}`} />
              </div>
            </div>

            <div className={`rounded-2xl border ${surface}`}>
              {paginatedOrders.length > 0 ? (
                <div className="divide-y divide-slate-700/40">
                  {paginatedOrders.map((o, i) => (
                    <motion.div key={o._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={`flex flex-col md:flex-row md:items-center gap-3 md:gap-4 px-5 py-4 ${isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-slate-50"} transition-colors`}>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img src={o.coverImage} alt={o.auctionTitle} className="w-12 h-12 rounded-2xl object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold truncate ${strong}`}>{o.auctionTitle}</p>
                          <p className={`text-xs truncate flex items-center gap-1 ${muted}`}>
                            {o.paymentConfirmed ? o.winner.name : <><Lock className="w-3 h-3" /> Winner hidden until payment confirmed</>} · ${o.finalPrice}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 ${STATUS_CFG[o.status].color}`}>{STATUS_CFG[o.status].icon} {STATUS_CFG[o.status].label}</span>
                      <div className={`hidden lg:block text-xs ${muted} w-28 shrink-0`}>{o.orderDate}</div>
                      <button onClick={() => openOrder(o)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white shrink-0">
                        <Eye className="w-3.5 h-3.5" /> Manage
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-16 text-center"><PackageCheck className={`w-12 h-12 mx-auto mb-4 ${muted}`} /><p className={`text-lg font-medium ${strong}`}>No orders found</p></div>
              )}
              {filteredOrders.length > 0 && <Pagination />}
            </div>
          </div>
        )}

        {/* ── Shipping section ─────────────────────────────────────────── */}
        {section === "shipping" && (
          <div className={`rounded-2xl border ${surface}`}>
            <div className={`px-5 py-4 border-b ${divider}`}><p className={`text-sm font-semibold flex items-center gap-2 ${strong}`}><Truck className="w-4 h-4" /> Orders needing shipping action</p></div>
            {shippingQueue.length > 0 ? (
              <div className="divide-y divide-slate-700/40">
                {shippingQueue.map(o => (
                  <div key={o._id} className="flex flex-col md:flex-row md:items-center gap-3 px-5 py-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img src={o.coverImage} className="w-12 h-12 rounded-2xl object-cover shrink-0" />
                      <div className="min-w-0"><p className={`text-sm font-semibold truncate ${strong}`}>{o.auctionTitle}</p><p className={`text-xs truncate ${muted}`}>{o.winner.name} · {o.winner.address}</p></div>
                    </div>
                    {o.status === "preparing" ? (
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <input placeholder="Carrier" onChange={e => setShipCarrier(e.target.value)} className={`${inputCls} w-32 py-1.5`} />
                        <input placeholder="Tracking #" onChange={e => setShipTracking(e.target.value)} className={`${inputCls} w-32 py-1.5`} />
                        <button onClick={() => markShipped(o)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white">Mark shipped</button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2 shrink-0 text-xs">
                        <span className={`px-2.5 py-1 rounded-full border ${isDarkMode ? "bg-violet-500/15 text-violet-400 border-violet-500/20" : "bg-violet-50 text-violet-600 border-violet-200"}`}>{o.carrier} · {o.trackingNumber}</span>
                        <button onClick={() => downloadLabel(o)} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}><Download className="w-3.5 h-3.5" /> Label</button>
                        {!o.buyerConfirmedDelivery ? (
                          <button onClick={() => simulateBuyerConfirm(o)} className="px-2.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-white">Simulate buyer confirm</button>
                        ) : (
                          <button onClick={() => completeOrder(o)} className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white">Complete order</button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-16 text-center"><MapPinned className={`w-12 h-12 mx-auto mb-4 ${muted}`} /><p className={`text-lg font-medium ${strong}`}>Nothing to ship right now</p></div>
            )}
          </div>
        )}

        {/* ── Earnings section ─────────────────────────────────────────── */}
        {section === "earnings" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className={`rounded-2xl border p-6 ${surface}`}>
                <p className={`text-sm font-semibold mb-4 flex items-center gap-2 ${strong}`}><Wallet className="w-4 h-4" /> Request withdrawal</p>
                <div className="space-y-3">
                  <div>
                    <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Amount ($) — available ${availableBalance}</label>
                    <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="0" className={inputCls} />
                  </div>
                  <div>
                    <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Method</label>
                    <select value={withdrawMethod} onChange={e => setWithdrawMethod(e.target.value)} className={inputCls}>
                      <option>bKash</option><option>Nagad</option><option>Bank Transfer</option><option>SSLCommerz</option>
                    </select>
                  </div>
                  <button onClick={requestWithdrawal} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white"><Send className="w-4 h-4" /> Request withdrawal</button>
                </div>
              </div>

              <div className={`rounded-2xl border p-6 space-y-3 ${surface}`}>
                <p className={`text-sm font-semibold ${strong}`}>Balance summary</p>
                <div className={`rounded-xl p-4 flex items-center justify-between ${panel}`}><span className={`text-sm ${muted}`}>Available balance</span><span className={`text-lg font-semibold ${strong}`}>${availableBalance}</span></div>
                <div className={`rounded-xl p-4 flex items-center justify-between ${panel}`}><span className={`text-sm ${muted}`}>Pending balance (in transit)</span><span className={`text-lg font-semibold ${strong}`}>${pendingBalance}</span></div>
                <p className={`text-xs flex items-center gap-1.5 ${muted}`}><ShieldCheck className="w-3.5 h-3.5" /> Funds move from pending to available once orders are marked completed.</p>
              </div>
            </div>

            <div className={`rounded-2xl border ${surface}`}>
              <div className={`px-5 py-4 border-b ${divider}`}><p className={`text-sm font-semibold flex items-center gap-2 ${strong}`}><ArrowDownToLine className="w-4 h-4" /> Withdrawal history</p></div>
              <div className="divide-y divide-slate-700/40">
                {withdrawals.map(w => (
                  <div key={w.id} className="flex items-center justify-between px-5 py-3.5">
                    <div><p className={`text-sm font-medium ${strong}`}>${w.amount} via {w.method}</p><p className={`text-xs ${muted}`}>{w.date}</p></div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${w.status === "completed" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" : w.status === "pending" ? "bg-amber-500/15 text-amber-400 border-amber-500/20" : "bg-rose-500/15 text-rose-400 border-rose-500/20"}`}>{w.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Order detail modal ───────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={closeOrder}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} className={`w-full max-w-2xl rounded-2xl ${surface} max-h-[92vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
              <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-10 ${surface} ${divider}`}>
                <div className="flex items-center gap-4 min-w-0">
                  <img src={selected.coverImage} alt={selected.auctionTitle} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                  <div className="min-w-0"><h3 className={`text-lg font-semibold truncate ${strong}`}>{selected.auctionTitle}</h3><p className={`text-sm ${muted}`}>Order placed {selected.orderDate}</p></div>
                </div>
                <button onClick={closeOrder} className={`p-2 rounded-lg ${muted}`}><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-6">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_CFG[selected.status].color}`}>{STATUS_CFG[selected.status].icon} {STATUS_CFG[selected.status].label}</span>

                {/* Winning bidder — only after payment confirmed */}
                <div className={`rounded-2xl p-5 ${panel}`}>
                  <p className={`text-sm font-semibold mb-3 ${strong}`}>Winning bidder</p>
                  {selected.paymentConfirmed ? (
                    <div className="flex items-center gap-3">
                      <img src={selected.winner.photo} className="w-12 h-12 rounded-2xl object-cover" />
                      <div className="text-sm">
                        <p className={`font-medium ${strong}`}>{selected.winner.name}</p>
                        <p className={muted}>{selected.winner.email} · {selected.winner.phone}</p>
                        <p className={muted}>{selected.winner.address}</p>
                      </div>
                    </div>
                  ) : (
                    <p className={`text-sm flex items-center gap-2 ${muted}`}><Lock className="w-4 h-4" /> Buyer details will be revealed once payment is confirmed by the platform.</p>
                  )}
                </div>

                {/* Commission breakdown */}
                <div className={`rounded-2xl p-5 grid grid-cols-3 gap-4 text-sm ${panel}`}>
                  <div><p className={muted}>Gross sale</p><p className={`font-semibold ${strong}`}>${selected.finalPrice}</p></div>
                  <div><p className={muted}>Platform fee ({selected.commissionRate}%)</p><p className={`font-semibold ${strong}`}>-${commissionAmount}</p></div>
                  <div><p className={muted}>Net payout</p><p className="font-semibold text-emerald-500">${netPayout}</p></div>
                </div>

                {selected.rejectReason && (
                  <div className={`rounded-xl p-3 text-sm ${isDarkMode ? "bg-rose-500/10" : "bg-rose-50"}`}>{selected.rejectReason}</div>
                )}

                {(selected.carrier || selected.trackingNumber) && (
                  <div className={`rounded-2xl p-5 space-y-2 text-sm ${panel}`}>
                    <p className={`font-semibold ${strong}`}>Shipping</p>
                    <div className="flex items-center gap-2"><MapPinned className="w-3.5 h-3.5 opacity-60" /><span className={strong}>{selected.carrier}</span></div>
                    <p className={muted}>Tracking: {selected.trackingNumber} · Shipped {selected.shippedDate}</p>
                    <p className={muted}>Buyer confirmed delivery: {selected.buyerConfirmedDelivery ? "Yes" : "Not yet"}</p>
                  </div>
                )}

                {/* Actions */}
                <div className={`rounded-2xl p-5 space-y-3 ${panel}`}>
                  <p className={`text-sm font-semibold ${strong}`}>Actions</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.status === "awaiting_acceptance" && !showRejectForm && (
                      <>
                        <button onClick={() => acceptOrder(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white"><CheckCircle2 className="w-3.5 h-3.5" /> Accept order</button>
                        <button onClick={() => setShowRejectForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white"><XCircle className="w-3.5 h-3.5" /> Reject order</button>
                      </>
                    )}
                    {selected.status === "preparing" && !showShipForm && (
                      <button onClick={() => setShowShipForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white"><Truck className="w-3.5 h-3.5" /> Mark shipped</button>
                    )}
                    {selected.status === "shipped" && !selected.buyerConfirmedDelivery && (
                      <button onClick={() => simulateBuyerConfirm(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-500 hover:bg-sky-600 text-white">Simulate buyer confirmation</button>
                    )}
                    {selected.status === "shipped" && selected.buyerConfirmedDelivery && (
                      <button onClick={() => completeOrder(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white"><CheckCircle2 className="w-3.5 h-3.5" /> Complete order</button>
                    )}
                    {selected.status === "shipped" && (
                      <button onClick={() => downloadLabel(selected)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}><Download className="w-3.5 h-3.5" /> Shipping label</button>
                    )}
                  </div>

                  {showRejectForm && (
                    <div className="space-y-2">
                      <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={2} placeholder="Reason for rejecting this order..." className={inputCls} />
                      <div className="flex gap-2">
                        <button onClick={() => rejectOrder(selected)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white">Confirm rejection</button>
                        <button onClick={() => setShowRejectForm(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                      </div>
                    </div>
                  )}
                  {showShipForm && (
                    <div className="space-y-2">
                      <input value={shipCarrier} onChange={e => setShipCarrier(e.target.value)} placeholder="Carrier (e.g. Pathao Courier)" className={inputCls} />
                      <input value={shipTracking} onChange={e => setShipTracking(e.target.value)} placeholder="Tracking number" className={inputCls} />
                      <div className="flex gap-2">
                        <button onClick={() => markShipped(selected)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white">Confirm shipped</button>
                        <button onClick={() => setShowShipForm(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}