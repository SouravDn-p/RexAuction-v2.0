import { motion } from "framer-motion";
import {
    ArrowDownRight,
    ArrowDownToLine,
    ArrowUpRight,
    ChevronLeft,
    ChevronRight,
    Clock,
    CreditCard,
    Download,
    Gift,
    History,
    Percent,
    Plus,
    RotateCcw,
    Search,
    Send,
    Star,
    Trash2,
    TrendingUp,
    Wallet
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "../../../../../hooks/useTheme";

// ─── Types ─────────────────────────────────────────────────────────────────

type TxType = "sale_credit" | "commission_fee" | "withdrawal" | "refund_reversal" | "bonus";
type TxStatus = "completed" | "pending";
type WithdrawalStatus = "pending" | "processing" | "completed" | "failed";
type MethodType = "bKash" | "Nagad" | "Bank Transfer";

interface WalletTx {
  id: string;
  date: string;
  type: TxType;
  description: string;
  amount: number; // signed
  balanceAfter: number;
  status: TxStatus;
}

interface PayoutMethod {
  id: string;
  type: MethodType;
  label: string;
  details: string;
  isDefault: boolean;
}

interface Withdrawal {
  id: string;
  amount: number;
  method: string;
  requestDate: string;
  processedDate?: string;
  status: WithdrawalStatus;
}

// ─── Mock data ─────────────────────────────────────────────────────────────

const MOCK_TRANSACTIONS: WalletTx[] = [
  { id: "tx1", date: "2026-07-08", type: "sale_credit", description: "Sale: Antique Pocket Watch — 18k Gold", amount: 846, balanceAfter: 3126, status: "pending" },
  { id: "tx2", date: "2026-07-08", type: "commission_fee", description: "Platform commission (10%) — Antique Pocket Watch", amount: -94, balanceAfter: 2280, status: "pending" },
  { id: "tx3", date: "2026-07-06", type: "withdrawal", description: "Withdrawal to bKash ····4821", amount: -500, balanceAfter: 2374, status: "completed" },
  { id: "tx4", date: "2026-06-25", type: "sale_credit", description: "Sale: Signed First-Edition Novel Set", amount: 369, balanceAfter: 2874, status: "completed" },
  { id: "tx5", date: "2026-06-25", type: "commission_fee", description: "Platform commission (10%) — Signed First-Edition Novel Set", amount: -41, balanceAfter: 2505, status: "completed" },
  { id: "tx6", date: "2026-06-22", type: "bonus", description: "Verified Seller milestone bonus", amount: 50, balanceAfter: 2546, status: "completed" },
  { id: "tx7", date: "2026-06-18", type: "sale_credit", description: "Sale: 1965 Fender Stratocaster", amount: 4186, balanceAfter: 2496, status: "completed" },
  { id: "tx8", date: "2026-06-18", type: "commission_fee", description: "Platform commission (8%) — 1965 Fender Stratocaster", amount: -364, balanceAfter: -1690, status: "completed" },
  { id: "tx9", date: "2026-06-10", type: "refund_reversal", description: "Refund reversal — Rare Vinyl Record Collection (buyer refunded)", amount: -380, balanceAfter: -1326, status: "completed" },
  { id: "tx10", date: "2026-06-05", type: "sale_credit", description: "Sale: Rare Vinyl Record Collection", amount: 342, balanceAfter: -946, status: "completed" },
  { id: "tx11", date: "2026-05-30", type: "withdrawal", description: "Withdrawal to Bank Transfer ····2290", amount: -1200, balanceAfter: -1288, status: "completed" },
  { id: "tx12", date: "2026-05-20", type: "sale_credit", description: "Sale: Vintage Polaroid SX-70 Camera", amount: 117, balanceAfter: -88, status: "completed" },
];

const MOCK_METHODS: PayoutMethod[] = [
  { id: "m1", type: "bKash", label: "Personal bKash", details: "01712-····821", isDefault: true },
  { id: "m2", type: "Bank Transfer", label: "Dutch Bangla Bank", details: "····2290 · Sofia Diaz", isDefault: false },
];

const MOCK_WITHDRAWALS: Withdrawal[] = [
  { id: "w1", amount: 500, method: "bKash ····4821", requestDate: "2026-07-06", processedDate: "2026-07-06", status: "completed" },
  { id: "w2", amount: 1200, method: "Bank Transfer ····2290", requestDate: "2026-05-30", processedDate: "2026-05-31", status: "completed" },
  { id: "w3", amount: 300, method: "bKash ····4821", requestDate: "2026-07-08", status: "pending" },
];

const REVENUE_TREND = [
  { label: "Dec", value: 980 }, { label: "Jan", value: 1240 }, { label: "Feb", value: 1120 }, { label: "Mar", value: 1560 },
  { label: "Apr", value: 1890 }, { label: "May", value: 1740 }, { label: "Jun", value: 2680 }, { label: "Jul", value: 846 },
];

const CATEGORY_EARNINGS = [
  { name: "Collectibles", amount: 1738 }, { name: "Instruments", amount: 4186 }, { name: "Electronics", amount: 117 },
];

// ─── Config ────────────────────────────────────────────────────────────────

const TX_TYPE_CFG: Record<TxType, { label: string; icon: React.JSX.Element; color: string }> = {
  sale_credit: { label: "Sale Credit", icon: <ArrowUpRight className="w-3.5 h-3.5" />, color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  commission_fee: { label: "Commission Fee", icon: <Percent className="w-3.5 h-3.5" />, color: "bg-violet-500/15 text-violet-400 border-violet-500/20" },
  withdrawal: { label: "Withdrawal", icon: <ArrowDownRight className="w-3.5 h-3.5" />, color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
  refund_reversal: { label: "Refund Reversal", icon: <RotateCcw className="w-3.5 h-3.5" />, color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
  bonus: { label: "Bonus", icon: <Gift className="w-3.5 h-3.5" />, color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
};

const WITHDRAWAL_STATUS_CFG: Record<WithdrawalStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  processing: { label: "Processing", color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
  completed: { label: "Completed", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  failed: { label: "Failed", color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
};

const PAGE_SIZE = 6;
const SECTIONS = [
  { key: "overview", label: "Overview" },
  { key: "transactions", label: "Transactions" },
  { key: "withdrawals", label: "Withdrawals" },
  { key: "methods", label: "Payout Methods" },
] as const;
type SectionKey = (typeof SECTIONS)[number]["key"];

// ─── Component ─────────────────────────────────────────────────────────────

export default function SellerWalletPage() {
  const { isDarkMode } = useTheme();

  const [section, setSection] = useState<SectionKey>("overview");
  const [transactions] = useState<WalletTx[]>(MOCK_TRANSACTIONS);
  const [methods, setMethods] = useState<PayoutMethod[]>(MOCK_METHODS);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(MOCK_WITHDRAWALS);

  const [txType, setTxType] = useState<"all" | TxType>("all");
  const [txRange, setTxRange] = useState<"7d" | "30d" | "all">("30d");
  const [txSearch, setTxSearch] = useState("");
  const [txPage, setTxPage] = useState(1);

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethodId, setWithdrawMethodId] = useState(methods.find(m => m.isDefault)?.id || methods[0]?.id || "");

  const [newMethodType, setNewMethodType] = useState<MethodType>("bKash");
  const [newMethodLabel, setNewMethodLabel] = useState("");
  const [newMethodDetails, setNewMethodDetails] = useState("");

  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const divider = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const panel = isDarkMode ? "bg-slate-700/40" : "bg-slate-50";
  const inputCls = `w-full px-3 py-2 text-sm rounded-xl border outline-none transition-all ${
    isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
  }`;

  useEffect(() => { setTxPage(1); }, [txType, txRange, txSearch]);

  // ── derived balances ─────────────────────────────────────────────────────
  const completedTx = transactions.filter(t => t.status === "completed");
  const pendingTx = transactions.filter(t => t.status === "pending");
  const availableBalance = completedTx.reduce((s, t) => s + t.amount, 0);
  const pendingBalance = pendingTx.reduce((s, t) => s + t.amount, 0);
  const totalEarned = transactions.filter(t => t.type === "sale_credit" || t.type === "bonus").reduce((s, t) => s + t.amount, 0);
  const totalWithdrawn = withdrawals.filter(w => w.status === "completed").reduce((s, w) => s + w.amount, 0);
  const totalCommission = Math.abs(transactions.filter(t => t.type === "commission_fee").reduce((s, t) => s + t.amount, 0));
  const grossSales = transactions.filter(t => t.type === "sale_credit").reduce((s, t) => s + t.amount, 0) + totalCommission;

  const stats = [
    { label: "Available Balance", value: `$${availableBalance.toLocaleString()}`, icon: <Wallet className="w-4 h-4" />, color: "text-emerald-400", bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50", bar: "from-emerald-500 to-teal-500" },
    { label: "Pending Balance", value: `$${pendingBalance.toLocaleString()}`, icon: <Clock className="w-4 h-4" />, color: "text-amber-400", bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50", bar: "from-amber-500 to-orange-500" },
    { label: "Total Earned (lifetime)", value: `$${totalEarned.toLocaleString()}`, icon: <TrendingUp className="w-4 h-4" />, color: "text-violet-400", bg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50", bar: "from-violet-500 to-blue-500" },
    { label: "Total Withdrawn", value: `$${totalWithdrawn.toLocaleString()}`, icon: <ArrowDownToLine className="w-4 h-4" />, color: "text-sky-400", bg: isDarkMode ? "bg-sky-500/10" : "bg-sky-50", bar: "from-sky-500 to-blue-400" },
  ];

  // ── chart geometry ────────────────────────────────────────────────────
  const chartW = 640, chartH = 180, padL = 40, padR = 12, padT = 12, padB = 24;
  const innerW = chartW - padL - padR, innerH = chartH - padT - padB;
  const maxVal = Math.max(...REVENUE_TREND.map(d => d.value));
  const minVal = Math.min(...REVENUE_TREND.map(d => d.value));
  const range = maxVal - minVal || 1;
  const points = REVENUE_TREND.map((d, i) => ({ x: padL + (i / (REVENUE_TREND.length - 1)) * innerW, y: padT + innerH - ((d.value - minVal) / range) * innerH, ...d }));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padT + innerH} L ${points[0].x} ${padT + innerH} Z`;
  const gridLine = isDarkMode ? "#334155" : "#e2e8f0";
  const axisText = isDarkMode ? "#64748b" : "#94a3b8";
  const maxCategory = Math.max(...CATEGORY_EARNINGS.map(c => c.amount));

  // ── transaction filtering ────────────────────────────────────────────────
  const filteredTx = useMemo(() => {
    let list = transactions;
    if (txType !== "all") list = list.filter(t => t.type === txType);
    if (txSearch) list = list.filter(t => t.description.toLowerCase().includes(txSearch.toLowerCase()));
    if (txRange !== "all") {
      const days = txRange === "7d" ? 7 : 30;
      const cutoff = Date.now() - days * 86400000;
      list = list.filter(t => new Date(t.date).getTime() >= cutoff);
    }
    return list;
  }, [transactions, txType, txSearch, txRange]);
  const txTotalPages = Math.max(1, Math.ceil(filteredTx.length / PAGE_SIZE));
  const txPageSafe = Math.min(txPage, txTotalPages);
  const paginatedTx = filteredTx.slice((txPageSafe - 1) * PAGE_SIZE, txPageSafe * PAGE_SIZE);

  const exportCSV = () => {
    const header = "Date,Type,Description,Amount,Balance After,Status\n";
    const rows = filteredTx.map(t => `${t.date},${t.type},"${t.description}",${t.amount},${t.balanceAfter},${t.status}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `wallet-history-${txRange}.csv`; a.click(); URL.revokeObjectURL(url);
    toast.success("Transaction history exported");
  };

  // ── withdrawal handlers ──────────────────────────────────────────────────
  const requestWithdrawal = () => {
    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0) { toast.error("Enter a valid amount"); return; }
    if (amt > availableBalance) { toast.error("Amount exceeds available balance"); return; }
    const method = methods.find(m => m.id === withdrawMethodId);
    if (!method) { toast.error("Select a payout method"); return; }
    setWithdrawals(prev => [{ id: `w-${Date.now()}`, amount: amt, method: `${method.type} ${method.details}`, requestDate: new Date().toISOString().slice(0, 10), status: "pending" }, ...prev]);
    toast.success(`Withdrawal of $${amt} requested via ${method.type}`);
    setWithdrawAmount("");
  };

  // ── payout method handlers ───────────────────────────────────────────────
  const addMethod = () => {
    if (!newMethodLabel.trim() || !newMethodDetails.trim()) { toast.error("Fill in label and details"); return; }
    setMethods(prev => [...prev, { id: `m-${Date.now()}`, type: newMethodType, label: newMethodLabel.trim(), details: newMethodDetails.trim(), isDefault: prev.length === 0 }]);
    toast.success("Payout method added");
    setNewMethodLabel(""); setNewMethodDetails("");
  };
  const setDefaultMethod = (id: string) => {
    setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
    toast.success("Default payout method updated");
  };
  const removeMethod = (id: string, label: string) => {
    setMethods(prev => prev.filter(m => m.id !== id));
    toast.success(`${label} removed`);
  };

  const Pagination = () => (
    <div className={`flex items-center justify-between px-5 py-4 border-t ${divider}`}>
      <p className={`text-xs ${muted}`}>Showing {filteredTx.length === 0 ? 0 : (txPageSafe - 1) * PAGE_SIZE + 1}–{Math.min(txPageSafe * PAGE_SIZE, filteredTx.length)} of {filteredTx.length}</p>
      <div className="flex items-center gap-1.5">
        <button onClick={() => setTxPage(p => Math.max(1, p - 1))} disabled={txPageSafe === 1} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}><ChevronLeft className="w-4 h-4" /></button>
        {Array.from({ length: txTotalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => setTxPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium ${p === txPageSafe ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"}`}>{p}</button>
        ))}
        <button onClick={() => setTxPage(p => Math.min(txTotalPages, p + 1))} disabled={txPageSafe === txTotalPages} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}><ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px", borderRadius: "10px", background: isDarkMode ? "#1e293b" : "#fff", color: isDarkMode ? "#f1f5f9" : "#0f172a", border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0" } }} />

      {/* Header */}
      <div className={`sticky top-0 z-20 border-b backdrop-blur-xl ${isDarkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-slate-200"}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2"><Wallet className="w-5 h-5 text-violet-500" /> Wallet & Payment History</h1>
          <p className={`text-xs mt-0.5 ${muted}`}>Your earnings, transaction history and payout settings</p>
        </div>
        <div className="px-4 sm:px-6 lg:px-8 pb-3 flex gap-1 overflow-x-auto no-scrollbar">
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => setSection(s.key)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${section === s.key ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}>{s.label}</button>
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

        {/* ── Overview ─────────────────────────────────────────────────── */}
        {section === "overview" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className={`rounded-2xl border lg:col-span-2 ${surface}`}>
                <div className={`flex items-center justify-between px-5 py-4 border-b ${divider}`}>
                  <span className={`text-sm font-semibold flex items-center gap-2 ${strong}`}><TrendingUp className="w-4 h-4 text-emerald-500" /> Earnings trend</span>
                  <span className={`text-xs ${muted}`}>Last 8 months</span>
                </div>
                <div className="p-5">
                  <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto">
                    {[0, 1, 2, 3].map(i => { const y = padT + (i / 3) * innerH; return <line key={i} x1={padL} y1={y} x2={chartW - padR} y2={y} stroke={gridLine} strokeWidth={1} />; })}
                    <defs><linearGradient id="walletFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.28" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" /></linearGradient></defs>
                    <path d={areaPath} fill="url(#walletFill)" />
                    <path d={linePath} fill="none" stroke="#8b5cf6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    {points.map((p, i) => (<g key={i}><circle cx={p.x} cy={p.y} r={3.5} fill={isDarkMode ? "#1e293b" : "#fff"} stroke="#8b5cf6" strokeWidth={2} /><text x={p.x} y={chartH - 4} textAnchor="middle" fontSize="10" fill={axisText}>{p.label}</text></g>))}
                    <text x={4} y={padT + 4} fontSize="10" fill={axisText}>${(maxVal / 1000).toFixed(1)}k</text>
                    <text x={4} y={padT + innerH} fontSize="10" fill={axisText}>${(minVal / 1000).toFixed(1)}k</text>
                  </svg>
                </div>
              </div>

              <div className={`rounded-2xl border ${surface}`}>
                <div className={`px-5 py-4 border-b ${divider}`}><span className={`text-sm font-semibold ${strong}`}>Earnings by category</span></div>
                <div className="p-4 space-y-3">
                  {CATEGORY_EARNINGS.map(c => (
                    <div key={c.name}>
                      <div className="flex items-center justify-between mb-1"><span className={`text-xs font-medium ${strong}`}>{c.name}</span><span className={`text-xs ${muted}`}>${c.amount}</span></div>
                      <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? "bg-slate-700/60" : "bg-slate-100"}`}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(c.amount / maxCategory) * 100}%` }} transition={{ duration: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`rounded-2xl border p-5 ${surface}`}>
              <p className={`text-sm font-semibold mb-4 ${strong}`}>Gross sales → commission → net earnings</p>
              <div className="flex items-center gap-1 h-3 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${(totalEarned / grossSales) * 100}%` }} />
                <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500" style={{ width: `${(totalCommission / grossSales) * 100}%` }} />
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><p className={muted}>Gross sales</p><p className={`font-semibold ${strong}`}>${grossSales.toLocaleString()}</p></div>
                <div><p className={muted}>Commission paid</p><p className="font-semibold text-rose-500">-${totalCommission.toLocaleString()}</p></div>
                <div><p className={muted}>Net earnings</p><p className="font-semibold text-emerald-500">${totalEarned.toLocaleString()}</p></div>
              </div>
            </div>
          </div>
        )}

        {/* ── Transactions ─────────────────────────────────────────────── */}
        {section === "transactions" && (
          <div className="space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
              <div className="flex flex-wrap gap-1">
                {(["all", "sale_credit", "commission_fee", "withdrawal", "refund_reversal", "bonus"] as const).map(t => (
                  <button key={t} onClick={() => setTxType(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${txType === t ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}>
                    {t === "all" ? "All types" : TX_TYPE_CFG[t].label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {(["7d", "30d", "all"] as const).map(r => (
                    <button key={r} onClick={() => setTxRange(r)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${txRange === r ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}>{r === "7d" ? "7d" : r === "30d" ? "30d" : "All"}</button>
                  ))}
                </div>
                <div className={`relative w-44 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
                  <input value={txSearch} onChange={e => setTxSearch(e.target.value)} placeholder="Search..." className={`w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border outline-none ${isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500" : "bg-slate-50 border-slate-200 placeholder-slate-400"}`} />
                </div>
                <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white shrink-0"><Download className="w-3.5 h-3.5" /> Export</button>
              </div>
            </div>

            <div className={`rounded-2xl border ${surface}`}>
              <div className="divide-y divide-slate-700/40">
                {paginatedTx.map(t => (
                  <div key={t.id} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 ${TX_TYPE_CFG[t.type].color}`}>{TX_TYPE_CFG[t.type].icon} {TX_TYPE_CFG[t.type].label}</span>
                    <div className="flex-1 min-w-0"><p className={`text-sm truncate ${strong}`}>{t.description}</p><p className={`text-xs ${muted}`}>{t.date} · {t.status === "pending" ? "Pending" : "Completed"} · Balance ${t.balanceAfter}</p></div>
                    <span className={`text-sm font-semibold shrink-0 ${t.amount < 0 ? "text-rose-500" : "text-emerald-500"}`}>{t.amount < 0 ? "-" : "+"}${Math.abs(t.amount)}</span>
                  </div>
                ))}
                {paginatedTx.length === 0 && <div className="p-10 text-center text-sm"><span className={muted}>No transactions match your filters.</span></div>}
              </div>
              {filteredTx.length > 0 && <Pagination />}
            </div>
          </div>
        )}

        {/* ── Withdrawals ──────────────────────────────────────────────── */}
        {section === "withdrawals" && (
          <div className="space-y-5">
            <div className={`rounded-2xl border p-6 ${surface}`}>
              <p className={`text-sm font-semibold mb-4 flex items-center gap-2 ${strong}`}><Send className="w-4 h-4" /> Request withdrawal</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Amount ($) — available ${availableBalance}</label>
                  <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="0" className={inputCls} />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Payout method</label>
                  <select value={withdrawMethodId} onChange={e => setWithdrawMethodId(e.target.value)} className={inputCls}>
                    {methods.map(m => <option key={m.id} value={m.id}>{m.type} · {m.details}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <button onClick={requestWithdrawal} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white"><Send className="w-4 h-4" /> Request</button>
                </div>
              </div>
            </div>

            <div className={`rounded-2xl border ${surface}`}>
              <div className={`px-5 py-4 border-b ${divider}`}><p className={`text-sm font-semibold flex items-center gap-2 ${strong}`}><History className="w-4 h-4" /> Withdrawal history</p></div>
              <div className="divide-y divide-slate-700/40">
                {withdrawals.map(w => (
                  <div key={w.id} className="flex items-center justify-between px-5 py-3.5">
                    <div><p className={`text-sm font-medium ${strong}`}>${w.amount} via {w.method}</p><p className={`text-xs ${muted}`}>Requested {w.requestDate}{w.processedDate ? ` · Processed ${w.processedDate}` : ""}</p></div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${WITHDRAWAL_STATUS_CFG[w.status].color}`}>{WITHDRAWAL_STATUS_CFG[w.status].label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Payout methods ───────────────────────────────────────────── */}
        {section === "methods" && (
          <div className="space-y-5">
            <div className={`rounded-2xl border ${surface}`}>
              <div className={`px-5 py-4 border-b ${divider}`}><p className={`text-sm font-semibold flex items-center gap-2 ${strong}`}><CreditCard className="w-4 h-4" /> Saved payout methods</p></div>
              <div className="divide-y divide-slate-700/40">
                {methods.map(m => (
                  <div key={m.id} className="flex items-center justify-between px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDarkMode ? "bg-violet-500/10" : "bg-violet-50"}`}><Wallet className="w-4 h-4 text-violet-500" /></div>
                      <div>
                        <p className={`text-sm font-medium flex items-center gap-1.5 ${strong}`}>{m.label} {m.isDefault && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-500/15 text-violet-400 flex items-center gap-0.5"><Star className="w-2.5 h-2.5" /> Default</span>}</p>
                        <p className={`text-xs ${muted}`}>{m.type} · {m.details}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!m.isDefault && <button onClick={() => setDefaultMethod(m.id)} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}>Set default</button>}
                      <button onClick={() => removeMethod(m.id, m.label)} className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
                {methods.length === 0 && <div className="p-10 text-center text-sm"><span className={muted}>No payout methods saved yet.</span></div>}
              </div>
            </div>

            <div className={`rounded-2xl p-5 space-y-3 border border-dashed ${isDarkMode ? "border-slate-600" : "border-slate-300"} ${surface}`}>
              <p className={`text-sm font-semibold ${strong}`}>Add new payout method</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select value={newMethodType} onChange={e => setNewMethodType(e.target.value as MethodType)} className={inputCls}>
                  <option>bKash</option><option>Nagad</option><option>Bank Transfer</option>
                </select>
                <input value={newMethodLabel} onChange={e => setNewMethodLabel(e.target.value)} placeholder="Label (e.g. Personal bKash)" className={inputCls} />
                <input value={newMethodDetails} onChange={e => setNewMethodDetails(e.target.value)} placeholder="Account / phone number" className={inputCls} />
              </div>
              <button onClick={addMethod} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white"><Plus className="w-3.5 h-3.5" /> Add method</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}