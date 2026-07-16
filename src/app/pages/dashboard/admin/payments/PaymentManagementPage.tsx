import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  CreditCard,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Lock,
  Unlock,
  RotateCcw,
  AlertTriangle,
  Eye,
  History,
  Wallet,
  RefreshCcw,
  Ban,
} from "lucide-react";
import { useTheme } from "../../../../../hooks/useTheme";

// ─── Types ─────────────────────────────────────────────────────────────────

type TxStatus = "completed" | "refunded" | "failed" | "pending_payout" | "on_hold";
type EscrowStatus = "held" | "released" | "refunded" | "n/a";

interface TxAuditEntry {
  id: string;
  type: "refund" | "release" | "hold" | "retry" | "escrow";
  detail: string;
  admin: string;
  date: string;
}

interface Transaction {
  _id: string;
  auctionTitle: string;
  coverImage: string;
  buyer: { name: string; photo: string };
  seller: { name: string; photo: string };
  amount: number;
  commission: number;
  method: string;
  transactionId: string;
  date: string;
  status: TxStatus;
  escrowStatus: EscrowStatus;
  failReason?: string;
  auditTrail: TxAuditEntry[];
}

// ─── Mock data ─────────────────────────────────────────────────────────────

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    _id: "tx1",
    auctionTitle: "Antique Pocket Watch — 18k Gold",
    coverImage: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=200&q=80",
    buyer: { name: "Liam Torres", photo: "https://ui-avatars.com/api/?name=Liam+Torres&background=b45309&color=fff" },
    seller: { name: "Sofia Diaz", photo: "https://ui-avatars.com/api/?name=Sofia+Diaz&background=be185d&color=fff" },
    amount: 940,
    commission: 94,
    method: "SSLCommerz (bKash)",
    transactionId: "SSLCZ-88213740",
    date: "2026-06-28",
    status: "pending_payout",
    escrowStatus: "held",
    auditTrail: [{ id: "a1", type: "escrow", detail: "Payment captured, escrow held", admin: "System", date: "2026-06-28" }],
  },
  {
    _id: "tx2",
    auctionTitle: "Signed First-Edition Novel Set",
    coverImage: "https://images.unsplash.com/photo-1521123845560-14093637aa7d?w=200&q=80",
    buyer: { name: "Noah Kim", photo: "https://ui-avatars.com/api/?name=Noah+Kim&background=0369a1&color=fff" },
    seller: { name: "Aisha Patel", photo: "https://ui-avatars.com/api/?name=Aisha+Patel&background=065f46&color=fff" },
    amount: 410,
    commission: 41,
    method: "SSLCommerz (Nagad)",
    transactionId: "SSLCZ-77012984",
    date: "2026-06-24",
    status: "completed",
    escrowStatus: "released",
    auditTrail: [
      { id: "a1", type: "escrow", detail: "Payment captured, escrow held", admin: "System", date: "2026-06-20" },
      { id: "a2", type: "release", detail: "Escrow released to seller after delivery confirmation", admin: "Admin Rafiq", date: "2026-06-25" },
    ],
  },
  {
    _id: "tx3",
    auctionTitle: "Gaming PC — RTX 4090 Build",
    coverImage: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=200&q=80",
    buyer: { name: "Marcus Webb", photo: "https://ui-avatars.com/api/?name=Marcus+Webb&background=1d4ed8&color=fff" },
    seller: { name: "Priya Sharma", photo: "https://ui-avatars.com/api/?name=Priya+Sharma&background=9333ea&color=fff" },
    amount: 1650,
    commission: 132,
    method: "SSLCommerz (Card)",
    transactionId: "SSLCZ-11029384",
    date: "2026-06-30",
    status: "failed",
    escrowStatus: "n/a",
    failReason: "Card declined by issuing bank (insufficient funds)",
    auditTrail: [{ id: "a1", type: "hold", detail: "Card payment declined by issuing bank", admin: "System", date: "2026-06-30" }],
  },
  {
    _id: "tx4",
    auctionTitle: "Rare Vinyl Record Collection",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80",
    buyer: { name: "Sofia Diaz", photo: "https://ui-avatars.com/api/?name=Sofia+Diaz&background=be185d&color=fff" },
    seller: { name: "Noah Kim", photo: "https://ui-avatars.com/api/?name=Noah+Kim&background=0369a1&color=fff" },
    amount: 380,
    commission: 38,
    method: "SSLCommerz (bKash)",
    transactionId: "SSLCZ-33920172",
    date: "2026-06-05",
    status: "refunded",
    escrowStatus: "refunded",
    auditTrail: [
      { id: "a1", type: "escrow", detail: "Payment captured, escrow held", admin: "System", date: "2026-06-05" },
      { id: "a2", type: "refund", detail: "Refunded in full — items damaged in transit", admin: "Admin Rafiq", date: "2026-06-10" },
    ],
  },
  {
    _id: "tx5",
    auctionTitle: "1965 Fender Stratocaster",
    coverImage: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=200&q=80",
    buyer: { name: "Jordan Lee", photo: "https://ui-avatars.com/api/?name=Jordan+Lee&background=0d9488&color=fff" },
    seller: { name: "Emily Carter", photo: "https://ui-avatars.com/api/?name=Emily+Carter&background=7c3aed&color=fff" },
    amount: 4550,
    commission: 364,
    method: "SSLCommerz (Card)",
    transactionId: "SSLCZ-56231190",
    date: "2026-06-10",
    status: "on_hold",
    escrowStatus: "held",
    auditTrail: [
      { id: "a1", type: "escrow", detail: "Payment captured, escrow held", admin: "System", date: "2026-06-10" },
      { id: "a2", type: "hold", detail: "Payout held pending shipment confirmation", admin: "Admin Sara", date: "2026-06-13" },
    ],
  },
  {
    _id: "tx6",
    auctionTitle: "Restored 1978 Vespa Scooter",
    coverImage: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=200&q=80",
    buyer: { name: "Emily Carter", photo: "https://ui-avatars.com/api/?name=Emily+Carter&background=7c3aed&color=fff" },
    seller: { name: "Ken Watanabe", photo: "https://ui-avatars.com/api/?name=Ken+Watanabe&background=475569&color=fff" },
    amount: 2150,
    commission: 172,
    method: "SSLCommerz (Bank transfer)",
    transactionId: "SSLCZ-90218837",
    date: "2026-06-18",
    status: "on_hold",
    escrowStatus: "held",
    auditTrail: [
      { id: "a1", type: "escrow", detail: "Payment captured, escrow held", admin: "System", date: "2026-06-18" },
      { id: "a2", type: "hold", detail: "Held pending odometer dispute investigation", admin: "Admin Sara", date: "2026-06-23" },
    ],
  },
  {
    _id: "tx7",
    auctionTitle: "Hand-carved Rosewood Chess Set",
    coverImage: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=200&q=80",
    buyer: { name: "Zara Nguyen", photo: "https://ui-avatars.com/api/?name=Zara+Nguyen&background=be185d&color=fff" },
    seller: { name: "Priya Sharma", photo: "https://ui-avatars.com/api/?name=Priya+Sharma&background=9333ea&color=fff" },
    amount: 150,
    commission: 15,
    method: "SSLCommerz (Card)",
    transactionId: "—",
    date: "2026-07-05",
    status: "failed",
    escrowStatus: "n/a",
    failReason: "Buyer payment window expired (48 hours) without confirmation",
    auditTrail: [{ id: "a1", type: "hold", detail: "Payment window expired, marked failed", admin: "System", date: "2026-07-05" }],
  },
];

// ─── Config ────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<TxStatus, { label: string; icon: React.JSX.Element; color: string }> = {
  completed: { label: "Completed", icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  refunded: { label: "Refunded", icon: <RotateCcw className="w-3.5 h-3.5" />, color: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
  failed: { label: "Failed", icon: <XCircle className="w-3.5 h-3.5" />, color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
  pending_payout: { label: "Pending Payout", icon: <Clock className="w-3.5 h-3.5" />, color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  on_hold: { label: "On Hold", icon: <Lock className="w-3.5 h-3.5" />, color: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
};

const ESCROW_CFG: Record<EscrowStatus, { label: string; color: string }> = {
  held: { label: "Held", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  released: { label: "Released", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  refunded: { label: "Refunded", color: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
  "n/a": { label: "N/A", color: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
};

const AUDIT_ICON: Record<TxAuditEntry["type"], React.JSX.Element> = {
  refund: <RotateCcw className="w-3.5 h-3.5" />,
  release: <Unlock className="w-3.5 h-3.5" />,
  hold: <Lock className="w-3.5 h-3.5" />,
  retry: <RefreshCcw className="w-3.5 h-3.5" />,
  escrow: <Wallet className="w-3.5 h-3.5" />,
};

const PAGE_SIZE = 5;
const TABS = [
  { key: "all", label: "All Transactions" },
  { key: "pending_payout", label: "Pending Payouts" },
  { key: "on_hold", label: "On Hold" },
  { key: "completed", label: "Completed" },
  { key: "refunded", label: "Refunded" },
  { key: "failed", label: "Failed" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

// ─── Component ─────────────────────────────────────────────────────────────

export default function PaymentManagementPage() {
  const { isDarkMode } = useTheme();

  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [showHoldForm, setShowHoldForm] = useState(false);
  const [holdReason, setHoldReason] = useState("");

  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const divider = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const panel = isDarkMode ? "bg-slate-700/40" : "bg-slate-50";
  const inputCls = `w-full px-3 py-2 text-sm rounded-xl border outline-none transition-all ${
    isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
  }`;

  const selected = useMemo(() => transactions.find(t => t._id === selectedId) || null, [transactions, selectedId]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, activeTab]);

  const tabCounts = transactions.reduce((acc: Record<string, number>, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc; }, {});

  const filtered = useMemo(() => transactions.filter(t => {
    const matchesSearch = t.auctionTitle.toLowerCase().includes(searchQuery.toLowerCase()) || t.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.seller.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || t.status === activeTab;
    return matchesSearch && matchesTab;
  }), [transactions, searchQuery, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const escrowHeldTotal = transactions.filter(t => t.escrowStatus === "held").reduce((s, t) => s + t.amount, 0);

  const stats = [
    { label: "Total Transactions", value: transactions.length, icon: <CreditCard className="w-4 h-4" />, color: "text-violet-400", bg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50", bar: "from-violet-500 to-blue-500" },
    { label: "Pending Payouts", value: tabCounts.pending_payout || 0, icon: <Clock className="w-4 h-4" />, color: "text-amber-400", bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50", bar: "from-amber-500 to-orange-500" },
    { label: "Failed Transactions", value: tabCounts.failed || 0, icon: <XCircle className="w-4 h-4" />, color: "text-rose-400", bg: isDarkMode ? "bg-rose-500/10" : "bg-rose-50", bar: "from-rose-500 to-pink-500" },
    { label: "Escrow Held", value: `$${escrowHeldTotal.toLocaleString()}`, icon: <Lock className="w-4 h-4" />, color: "text-sky-400", bg: isDarkMode ? "bg-sky-500/10" : "bg-sky-50", bar: "from-sky-500 to-blue-400" },
  ];

  // ── helpers ──────────────────────────────────────────────────────────────
  const today = () => new Date().toISOString().slice(0, 10);
  const addAudit = (id: string, entry: Omit<TxAuditEntry, "id">) => {
    setTransactions(prev => prev.map(t => t._id === id ? { ...t, auditTrail: [{ ...entry, id: `ta-${Date.now()}` }, ...t.auditTrail] } : t));
  };
  const openModal = (t: Transaction) => { setSelectedId(t._id); setShowRefundForm(false); setRefundReason(""); setShowHoldForm(false); setHoldReason(""); };
  const closeModal = () => setSelectedId(null);

  // ── actions ──────────────────────────────────────────────────────────────
  const refundTransaction = (t: Transaction) => {
    if (!refundReason.trim()) { toast.error("Please provide a refund reason"); return; }
    setTransactions(prev => prev.map(x => x._id === t._id ? { ...x, status: "refunded", escrowStatus: "refunded" } : x));
    addAudit(t._id, { type: "refund", detail: `Refunded $${t.amount} to buyer — ${refundReason.trim()}`, admin: "You", date: today() });
    toast.success(`$${t.amount} refunded for "${t.auctionTitle}"`);
    setShowRefundForm(false); setRefundReason("");
  };

  const releasePayment = (t: Transaction) => {
    setTransactions(prev => prev.map(x => x._id === t._id ? { ...x, status: "completed", escrowStatus: "released" } : x));
    addAudit(t._id, { type: "release", detail: `Released $${(t.amount - t.commission).toFixed(0)} to seller`, admin: "You", date: today() });
    toast.success(`Payment released to ${t.seller.name}`);
  };

  const holdPayment = (t: Transaction) => {
    if (!holdReason.trim()) { toast.error("Please provide a reason for the hold"); return; }
    setTransactions(prev => prev.map(x => x._id === t._id ? { ...x, status: "on_hold" } : x));
    addAudit(t._id, { type: "hold", detail: `Payment placed on hold — ${holdReason.trim()}`, admin: "You", date: today() });
    toast.error(`Payment held for "${t.auctionTitle}"`);
    setShowHoldForm(false); setHoldReason("");
  };

  const releaseHold = (t: Transaction) => {
    setTransactions(prev => prev.map(x => x._id === t._id ? { ...x, status: "pending_payout" } : x));
    addAudit(t._id, { type: "hold", detail: "Hold lifted, payout queued", admin: "You", date: today() });
    toast.success(`Hold lifted for "${t.auctionTitle}"`);
  };

  const retryTransaction = (t: Transaction) => {
    setTransactions(prev => prev.map(x => x._id === t._id ? { ...x, status: "pending_payout", escrowStatus: "held", failReason: undefined } : x));
    addAudit(t._id, { type: "retry", detail: "Transaction retried and re-queued", admin: "You", date: today() });
    toast.success(`"${t.auctionTitle}" retried`);
  };

  // ── Pagination ───────────────────────────────────────────────────────────
  const Pagination = () => (
    <div className={`flex items-center justify-between px-5 py-4 border-t ${divider}`}>
      <p className={`text-xs ${muted}`}>Showing {filtered.length === 0 ? 0 : (pageSafe - 1) * PAGE_SIZE + 1}–{Math.min(pageSafe * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
      <div className="flex items-center gap-1.5">
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={pageSafe === 1} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}><ChevronLeft className="w-4 h-4" /></button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium ${p === pageSafe ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"}`}>{p}</button>
        ))}
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={pageSafe === totalPages} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}><ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px", borderRadius: "10px", background: isDarkMode ? "#1e293b" : "#fff", color: isDarkMode ? "#f1f5f9" : "#0f172a", border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0" } }} />

      {/* Header */}
      <div className={`sticky top-0 z-20 border-b backdrop-blur-xl ${isDarkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-slate-200"}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold tracking-tight">Payment Management</h1>
              <p className={`text-xs mt-0.5 ${muted}`}>Review transactions, refunds, escrow releases and failed payments</p>
            </div>
            <div className={`relative w-full sm:w-80 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
              <input type="text" placeholder="Search title, buyer, seller or txn ID..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-8 py-2 text-sm rounded-xl border outline-none transition-all ${isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"}`} />
              {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-3.5 h-3.5" /></button>}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
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

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"}`}>
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${activeTab === tab.key ? "bg-white/20" : isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>{tab.key === "all" ? transactions.length : tabCounts[tab.key] || 0}</span>
            </button>
          ))}
        </div>

        {/* List */}
        <div className={`rounded-2xl border ${surface}`}>
          {paginated.length > 0 ? (
            <div className="divide-y divide-slate-700/40">
              {paginated.map((t, i) => (
                <motion.div key={t._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={`flex flex-col md:flex-row md:items-center gap-3 md:gap-4 px-5 py-4 ${isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-slate-50"} transition-colors`}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img src={t.coverImage} alt={t.auctionTitle} className="w-12 h-12 rounded-2xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${strong}`}>{t.auctionTitle}</p>
                      <p className={`text-xs truncate ${muted}`}>{t.buyer.name} → {t.seller.name} · ${t.amount}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_CFG[t.status].color}`}>{STATUS_CFG[t.status].icon} {STATUS_CFG[t.status].label}</span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${ESCROW_CFG[t.escrowStatus].color}`}>Escrow: {ESCROW_CFG[t.escrowStatus].label}</span>
                  </div>
                  <div className={`hidden lg:block text-xs ${muted} w-32 shrink-0`}>
                    <p>{t.date}</p>
                    <p className="truncate">{t.method}</p>
                  </div>
                  <button onClick={() => openModal(t)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors shrink-0">
                    <Eye className="w-3.5 h-3.5" /> Review
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center"><CreditCard className={`w-12 h-12 mx-auto mb-4 ${muted}`} /><p className={`text-lg font-medium ${strong}`}>No transactions found</p><p className={muted}>Try adjusting your search or filters</p></div>
          )}
          {filtered.length > 0 && <Pagination />}
        </div>
      </div>

      {/* ── Transaction detail modal ─────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={closeModal}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} className={`w-full max-w-2xl rounded-2xl ${surface} max-h-[92vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
              <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-10 ${surface} ${divider}`}>
                <div className="flex items-center gap-4 min-w-0">
                  <img src={selected.coverImage} alt={selected.auctionTitle} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                  <div className="min-w-0">
                    <h3 className={`text-lg font-semibold truncate ${strong}`}>{selected.auctionTitle}</h3>
                    <p className={`text-sm ${muted}`}>{selected.buyer.name} → {selected.seller.name}</p>
                  </div>
                </div>
                <button onClick={closeModal} className={`p-2 rounded-lg ${muted}`}><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-7">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_CFG[selected.status].color}`}>{STATUS_CFG[selected.status].icon} {STATUS_CFG[selected.status].label}</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${ESCROW_CFG[selected.escrowStatus].color}`}>Escrow: {ESCROW_CFG[selected.escrowStatus].label}</span>
                </div>

                <div className={`rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm ${panel}`}>
                  <div><p className={muted}>Amount</p><p className={strong}>${selected.amount}</p></div>
                  <div><p className={muted}>Commission</p><p className={strong}>${selected.commission}</p></div>
                  <div><p className={muted}>Method</p><p className={strong}>{selected.method}</p></div>
                  <div><p className={muted}>Transaction ID</p><p className={`${strong} break-all`}>{selected.transactionId}</p></div>
                </div>

                {selected.failReason && (
                  <div className={`rounded-xl p-3 text-sm flex items-start gap-2 ${isDarkMode ? "bg-rose-500/10" : "bg-rose-50"}`}>
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" /><p className={strong}>{selected.failReason}</p>
                  </div>
                )}

                <div className={`rounded-2xl p-5 space-y-3 ${panel}`}>
                  <p className={`text-sm font-semibold ${strong}`}>Payment actions</p>
                  <div className="flex flex-wrap gap-2">
                    {(selected.status === "pending_payout" || selected.status === "on_hold") && selected.escrowStatus === "held" && (
                      <button onClick={() => releasePayment(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white"><Unlock className="w-3.5 h-3.5" /> Release seller payment</button>
                    )}
                    {selected.status === "on_hold" && (
                      <button onClick={() => releaseHold(selected)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}><Unlock className="w-3.5 h-3.5" /> Lift hold</button>
                    )}
                    {selected.status !== "on_hold" && selected.status !== "refunded" && selected.status !== "failed" && !showHoldForm && (
                      <button onClick={() => setShowHoldForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white"><Lock className="w-3.5 h-3.5" /> Hold payment</button>
                    )}
                    {(selected.status === "completed" || selected.status === "pending_payout" || selected.status === "on_hold") && !showRefundForm && (
                      <button onClick={() => setShowRefundForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white"><RotateCcw className="w-3.5 h-3.5" /> Refund buyer</button>
                    )}
                    {selected.status === "failed" && (
                      <button onClick={() => retryTransaction(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white"><RefreshCcw className="w-3.5 h-3.5" /> Retry transaction</button>
                    )}
                  </div>

                  {showHoldForm && (
                    <div className="space-y-2">
                      <textarea value={holdReason} onChange={e => setHoldReason(e.target.value)} rows={2} placeholder="Reason for holding this payment..." className={inputCls} />
                      <div className="flex gap-2">
                        <button onClick={() => holdPayment(selected)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white">Confirm hold</button>
                        <button onClick={() => setShowHoldForm(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                      </div>
                    </div>
                  )}
                  {showRefundForm && (
                    <div className="space-y-2">
                      <textarea value={refundReason} onChange={e => setRefundReason(e.target.value)} rows={2} placeholder="Reason for refund (e.g. buyer didn't receive item, seller didn't ship)..." className={inputCls} />
                      <div className="flex gap-2">
                        <button onClick={() => refundTransaction(selected)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white">Confirm refund</button>
                        <button onClick={() => setShowRefundForm(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <p className={`text-sm font-semibold flex items-center gap-2 ${strong}`}><History className="w-4 h-4" /> Audit trail</p>
                  <div className="space-y-2">
                    {selected.auditTrail.map(entry => (
                      <div key={entry.id} className={`flex items-start gap-3 px-3 py-2.5 rounded-xl ${panel}`}>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>{AUDIT_ICON[entry.type]}</div>
                        <div className="min-w-0"><p className={`text-sm ${strong}`}>{entry.detail}</p><p className={`text-xs ${muted}`}>{entry.admin} · {entry.date}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}