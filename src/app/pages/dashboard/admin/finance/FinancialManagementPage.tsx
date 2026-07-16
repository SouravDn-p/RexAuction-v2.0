import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  DollarSign,
  Percent,
  TrendingUp,
  Wallet,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  CalendarClock,
  Download,
  Receipt,
  ArrowDownToLine,
  ArrowUpFromLine,
  Landmark,
  ShieldCheck,
  Shield,
  Save,
} from "lucide-react";
import { useTheme } from "../../../../../hooks/useTheme";

// ─── Types ─────────────────────────────────────────────────────────────────

type CommissionMode = "percentage" | "fixed";
type PayoutStatus = "pending" | "scheduled" | "completed" | "failed";
type PayoutMethod = "SSLCommerz" | "Bank Transfer";
type WithdrawalStatus = "pending" | "approved" | "rejected";
type LedgerType = "commission" | "payout" | "refund" | "deposit";

interface CategoryRate { category: string; rate: number }
interface TierRate { tier: "basic" | "verified"; rate: number }

interface Payout {
  id: string;
  seller: { name: string; photo: string };
  amount: number;
  method: PayoutMethod;
  status: PayoutStatus;
  requestDate: string;
  scheduledDate?: string;
}

interface WalletHolder { id: string; name: string; photo: string; balance: number }

interface WithdrawalRequest {
  id: string;
  sellerName: string;
  amount: number;
  requestDate: string;
  status: WithdrawalStatus;
}

interface LedgerEntry {
  id: string;
  date: string;
  type: LedgerType;
  party: string;
  amount: number;
  status: "completed" | "pending" | "reversed";
  auction?: string;
}

// ─── Mock data ─────────────────────────────────────────────────────────────

const INITIAL_CATEGORY_RATES: CategoryRate[] = [
  { category: "Electronics", rate: 8 },
  { category: "Collectibles", rate: 10 },
  { category: "Art", rate: 12 },
  { category: "Vehicles", rate: 6 },
  { category: "Instruments", rate: 9 },
  { category: "Fashion", rate: 10 },
];

const INITIAL_TIER_RATES: TierRate[] = [
  { tier: "basic", rate: 10 },
  { tier: "verified", rate: 7 },
];

const MOCK_PAYOUTS: Payout[] = [
  { id: "po1", seller: { name: "Sofia Diaz", photo: "https://ui-avatars.com/api/?name=Sofia+Diaz&background=be185d&color=fff" }, amount: 846, method: "SSLCommerz", status: "completed", requestDate: "2026-06-25", scheduledDate: "2026-06-26" },
  { id: "po2", seller: { name: "Noah Kim", photo: "https://ui-avatars.com/api/?name=Noah+Kim&background=0369a1&color=fff" }, amount: 369, method: "Bank Transfer", status: "pending", requestDate: "2026-07-04" },
  { id: "po3", seller: { name: "Zara Nguyen", photo: "https://ui-avatars.com/api/?name=Zara+Nguyen&background=be185d&color=fff" }, amount: 135, method: "SSLCommerz", status: "scheduled", requestDate: "2026-07-02", scheduledDate: "2026-07-09" },
  { id: "po4", seller: { name: "Marcus Webb", photo: "https://ui-avatars.com/api/?name=Marcus+Webb&background=1d4ed8&color=fff" }, amount: 1518, method: "Bank Transfer", status: "failed", requestDate: "2026-06-30" },
  { id: "po5", seller: { name: "Emily Carter", photo: "https://ui-avatars.com/api/?name=Emily+Carter&background=7c3aed&color=fff" }, amount: 4186, method: "SSLCommerz", status: "pending", requestDate: "2026-07-06" },
  { id: "po6", seller: { name: "Ken Watanabe", photo: "https://ui-avatars.com/api/?name=Ken+Watanabe&background=475569&color=fff" }, amount: 1978, method: "Bank Transfer", status: "scheduled", requestDate: "2026-07-01", scheduledDate: "2026-07-10" },
];

const MOCK_SELLER_WALLETS: WalletHolder[] = [
  { id: "sw1", name: "Sofia Diaz", photo: "https://ui-avatars.com/api/?name=Sofia+Diaz&background=be185d&color=fff", balance: 1240 },
  { id: "sw2", name: "Noah Kim", photo: "https://ui-avatars.com/api/?name=Noah+Kim&background=0369a1&color=fff", balance: 369 },
  { id: "sw3", name: "Marcus Webb", photo: "https://ui-avatars.com/api/?name=Marcus+Webb&background=1d4ed8&color=fff", balance: 1518 },
  { id: "sw4", name: "Ken Watanabe", photo: "https://ui-avatars.com/api/?name=Ken+Watanabe&background=475569&color=fff", balance: 1978 },
];

const MOCK_BUYER_WALLETS: WalletHolder[] = [
  { id: "bw1", name: "Aisha Patel", photo: "https://ui-avatars.com/api/?name=Aisha+Patel&background=065f46&color=fff", balance: 45 },
  { id: "bw2", name: "Liam Torres", photo: "https://ui-avatars.com/api/?name=Liam+Torres&background=b45309&color=fff", balance: 0 },
  { id: "bw3", name: "Jordan Lee", photo: "https://ui-avatars.com/api/?name=Jordan+Lee&background=0d9488&color=fff", balance: 120 },
];

const INITIAL_WITHDRAWALS: WithdrawalRequest[] = [
  { id: "wd1", sellerName: "Sofia Diaz", amount: 800, requestDate: "2026-07-05", status: "pending" },
  { id: "wd2", sellerName: "Marcus Webb", amount: 1500, requestDate: "2026-07-04", status: "pending" },
  { id: "wd3", sellerName: "Noah Kim", amount: 200, requestDate: "2026-07-01", status: "approved" },
];

const MOCK_LEDGER: LedgerEntry[] = [
  { id: "tx1", date: "2026-07-06", type: "commission", party: "Antique Pocket Watch — Sofia Diaz", amount: 94, status: "completed", auction: "Antique Pocket Watch" },
  { id: "tx2", date: "2026-07-05", type: "payout", party: "Sofia Diaz", amount: -846, status: "completed" },
  { id: "tx3", date: "2026-07-04", type: "refund", party: "Gaming PC — Marcus Webb", amount: -1650, status: "completed", auction: "Gaming PC — RTX 4090 Build" },
  { id: "tx4", date: "2026-07-03", type: "commission", party: "Signed First-Edition Novel Set — Aisha Patel", amount: 41, status: "completed", auction: "Signed First-Edition Novel Set" },
  { id: "tx5", date: "2026-07-02", type: "deposit", party: "Noah Kim (wallet top-up)", amount: 200, status: "completed" },
  { id: "tx6", date: "2026-06-30", type: "commission", party: "1965 Fender Stratocaster — Emily Carter", amount: 364, status: "pending", auction: "1965 Fender Stratocaster" },
  { id: "tx7", date: "2026-06-28", type: "payout", party: "Zara Nguyen", amount: -135, status: "pending" },
  { id: "tx8", date: "2026-06-25", type: "refund", party: "Rare Vinyl Record Collection — Sofia Diaz", amount: -380, status: "reversed", auction: "Rare Vinyl Record Collection" },
];

// ─── Config ────────────────────────────────────────────────────────────────

const PAYOUT_STATUS_CFG: Record<PayoutStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  scheduled: { label: "Scheduled", color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
  completed: { label: "Completed", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  failed: { label: "Failed", color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
};

const LEDGER_TYPE_CFG: Record<LedgerType, { label: string; color: string }> = {
  commission: { label: "Commission", color: "bg-violet-500/15 text-violet-400 border-violet-500/20" },
  payout: { label: "Payout", color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
  refund: { label: "Refund", color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
  deposit: { label: "Deposit", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
};

const SECTIONS = [
  { key: "overview", label: "Overview" },
  { key: "commission", label: "Commission Rules" },
  { key: "payouts", label: "Payouts" },
  { key: "wallets", label: "Wallets" },
  { key: "ledger", label: "Ledger & Invoices" },
] as const;
type SectionKey = (typeof SECTIONS)[number]["key"];

const PAGE_SIZE = 5;
const MOCK_TREND = [
  { label: "Dec", value: 1250 }, { label: "Jan", value: 1520 }, { label: "Feb", value: 1410 }, { label: "Mar", value: 1870 },
  { label: "Apr", value: 2130 }, { label: "May", value: 1980 }, { label: "Jun", value: 2340 }, { label: "Jul", value: 2610 },
];

// ─── Component ─────────────────────────────────────────────────────────────

export default function FinancialManagementPage() {
  const { isDarkMode } = useTheme();

  const [section, setSection] = useState<SectionKey>("overview");

  const [mode, setMode] = useState<CommissionMode>("percentage");
  const [defaultRate, setDefaultRate] = useState(10);
  const [categoryRates, setCategoryRates] = useState<CategoryRate[]>(INITIAL_CATEGORY_RATES);
  const [tierRates, setTierRates] = useState<TierRate[]>(INITIAL_TIER_RATES);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [draftRate, setDraftRate] = useState<number>(0);

  const [payouts, setPayouts] = useState<Payout[]>(MOCK_PAYOUTS);
  const [payoutTab, setPayoutTab] = useState<"all" | PayoutStatus>("all");
  const [payoutSearch, setPayoutSearch] = useState("");
  const [payoutPage, setPayoutPage] = useState(1);
  const [scheduleFor, setScheduleFor] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState("");

  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(INITIAL_WITHDRAWALS);

  const [ledger] = useState<LedgerEntry[]>(MOCK_LEDGER);
  const [ledgerRange, setLedgerRange] = useState<"7d" | "30d" | "all">("30d");
  const [invoiceEntry, setInvoiceEntry] = useState<LedgerEntry | null>(null);

  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const divider = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const panel = isDarkMode ? "bg-slate-700/40" : "bg-slate-50";
  const inputCls = `px-3 py-2 text-sm rounded-xl border outline-none transition-all ${
    isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
  }`;

  useEffect(() => { setPayoutPage(1); }, [payoutTab, payoutSearch]);

  // ── derived numbers ──────────────────────────────────────────────────────
  const totalCommission = ledger.filter(l => l.type === "commission").reduce((s, l) => s + l.amount, 0);
  const totalGMV = 189450;
  const pendingPayoutAmount = payouts.filter(p => p.status === "pending" || p.status === "scheduled").reduce((s, p) => s + p.amount, 0);
  const platformBalance = MOCK_SELLER_WALLETS.reduce((s, w) => s + w.balance, 0) * 0.1 + 12800;

  const overviewStats = [
    { label: "Commission Earned", value: `$${totalCommission.toLocaleString()}`, icon: <Percent className="w-4 h-4" />, color: "text-violet-400", bg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50", bar: "from-violet-500 to-blue-500" },
    { label: "Total GMV", value: `$${totalGMV.toLocaleString()}`, icon: <TrendingUp className="w-4 h-4" />, color: "text-emerald-400", bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50", bar: "from-emerald-500 to-teal-500" },
    { label: "Pending Payouts", value: `$${pendingPayoutAmount.toLocaleString()}`, icon: <Clock className="w-4 h-4" />, color: "text-amber-400", bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50", bar: "from-amber-500 to-orange-500" },
    { label: "Platform Wallet", value: `$${platformBalance.toLocaleString()}`, icon: <Landmark className="w-4 h-4" />, color: "text-sky-400", bg: isDarkMode ? "bg-sky-500/10" : "bg-sky-50", bar: "from-sky-500 to-blue-400" },
  ];

  // ── chart geometry (reused pattern) ─────────────────────────────────────
  const chartW = 640, chartH = 180, padL = 40, padR = 12, padT = 12, padB = 24;
  const innerW = chartW - padL - padR, innerH = chartH - padT - padB;
  const maxVal = Math.max(...MOCK_TREND.map(d => d.value));
  const minVal = Math.min(...MOCK_TREND.map(d => d.value));
  const range = maxVal - minVal || 1;
  const points = MOCK_TREND.map((d, i) => ({ x: padL + (i / (MOCK_TREND.length - 1)) * innerW, y: padT + innerH - ((d.value - minVal) / range) * innerH, ...d }));
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padT + innerH} L ${points[0].x} ${padT + innerH} Z`;
  const gridLine = isDarkMode ? "#334155" : "#e2e8f0";
  const axisText = isDarkMode ? "#64748b" : "#94a3b8";
  const maxCatRate = Math.max(...categoryRates.map(c => c.rate));

  // ── commission rule handlers ────────────────────────────────────────────
  const saveDefaultRate = () => toast.success(`Default commission set to ${mode === "percentage" ? defaultRate + "%" : "$" + defaultRate}`);

  const startEditCategory = (c: CategoryRate) => { setEditingCategory(c.category); setDraftRate(c.rate); };
  const saveCategoryRate = () => {
    setCategoryRates(prev => prev.map(c => c.category === editingCategory ? { ...c, rate: draftRate } : c));
    toast.success(`${editingCategory} commission set to ${draftRate}%`);
    setEditingCategory(null);
  };
  const startEditTier = (t: TierRate) => { setEditingTier(t.tier); setDraftRate(t.rate); };
  const saveTierRate = () => {
    setTierRates(prev => prev.map(t => t.tier === editingTier ? { ...t, rate: draftRate } : t));
    toast.success(`${editingTier === "verified" ? "Verified" : "Basic"} seller commission set to ${draftRate}%`);
    setEditingTier(null);
  };

  // ── payouts handlers ─────────────────────────────────────────────────────
  const filteredPayouts = useMemo(() => payouts.filter(p => {
    const matchesTab = payoutTab === "all" || p.status === payoutTab;
    const matchesSearch = p.seller.name.toLowerCase().includes(payoutSearch.toLowerCase());
    return matchesTab && matchesSearch;
  }), [payouts, payoutTab, payoutSearch]);
  const payoutTotalPages = Math.max(1, Math.ceil(filteredPayouts.length / PAGE_SIZE));
  const payoutPageSafe = Math.min(payoutPage, payoutTotalPages);
  const paginatedPayouts = filteredPayouts.slice((payoutPageSafe - 1) * PAGE_SIZE, payoutPageSafe * PAGE_SIZE);
  const payoutCounts = payouts.reduce((acc: Record<string, number>, p) => { acc[p.status] = (acc[p.status] || 0) + 1; return acc; }, {});

  const approvePayout = (p: Payout) => {
    setPayouts(prev => prev.map(x => x.id === p.id ? { ...x, status: "scheduled", scheduledDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10) } : x));
    toast.success(`Payout to ${p.seller.name} approved and scheduled`);
  };
  const confirmSchedule = (p: Payout) => {
    if (!scheduleDate) { toast.error("Pick a date"); return; }
    setPayouts(prev => prev.map(x => x.id === p.id ? { ...x, status: "scheduled", scheduledDate: scheduleDate } : x));
    toast.success(`Payout to ${p.seller.name} scheduled for ${scheduleDate}`);
    setScheduleFor(null); setScheduleDate("");
  };
  const markCompleted = (p: Payout) => {
    setPayouts(prev => prev.map(x => x.id === p.id ? { ...x, status: "completed" } : x));
    toast.success(`Payout to ${p.seller.name} marked as sent via ${p.method}`);
  };
  const markFailed = (p: Payout) => {
    setPayouts(prev => prev.map(x => x.id === p.id ? { ...x, status: "failed" } : x));
    toast.error(`Payout to ${p.seller.name} marked as failed`);
  };
  const retryPayout = (p: Payout) => {
    setPayouts(prev => prev.map(x => x.id === p.id ? { ...x, status: "pending" } : x));
    toast.success(`Payout to ${p.seller.name} queued for retry`);
  };

  // ── withdrawal handlers ──────────────────────────────────────────────────
  const approveWithdrawal = (id: string, name: string) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: "approved" } : w));
    toast.success(`Withdrawal approved for ${name}`);
  };
  const rejectWithdrawal = (id: string, name: string) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: "rejected" } : w));
    toast.error(`Withdrawal rejected for ${name}`);
  };

  // ── ledger / export ──────────────────────────────────────────────────────
  const filteredLedger = useMemo(() => {
    if (ledgerRange === "all") return ledger;
    const days = ledgerRange === "7d" ? 7 : 30;
    const cutoff = Date.now() - days * 86400000;
    return ledger.filter(l => new Date(l.date).getTime() >= cutoff);
  }, [ledger, ledgerRange]);

  const exportLedgerCSV = () => {
    const header = "Date,Type,Party,Amount,Status\n";
    const rows = filteredLedger.map(l => `${l.date},${l.type},"${l.party}",${l.amount},${l.status}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rex-auction-ledger-${ledgerRange}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Ledger exported as CSV");
  };

  // ── pagination component ─────────────────────────────────────────────────
  const Pagination = ({ page, totalPages, onPage, count }: { page: number; totalPages: number; onPage: (p: number) => void; count: number }) => (
    <div className={`flex items-center justify-between px-5 py-4 border-t ${divider}`}>
      <p className={`text-xs ${muted}`}>Showing {count === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, count)} of {count}</p>
      <div className="flex items-center gap-1.5">
        <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}><ChevronLeft className="w-4 h-4" /></button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium ${p === page ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"}`}>{p}</button>
        ))}
        <button onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}><ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px", borderRadius: "10px", background: isDarkMode ? "#1e293b" : "#fff", color: isDarkMode ? "#f1f5f9" : "#0f172a", border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0" } }} />

      {/* Header */}
      <div className={`sticky top-0 z-20 border-b backdrop-blur-xl ${isDarkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-slate-200"}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-xl font-bold tracking-tight">Financial & Commission Management</h1>
          <p className={`text-xs mt-0.5 ${muted}`}>Commission rules, seller payouts, wallets and the platform ledger</p>
        </div>
        <div className="px-4 sm:px-6 lg:px-8 pb-3 flex gap-1 overflow-x-auto no-scrollbar">
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => setSection(s.key)} className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${section === s.key ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ── Overview ─────────────────────────────────────────────────── */}
        {section === "overview" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {overviewStats.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`rounded-2xl border overflow-hidden ${surface}`}>
                  <div className="p-4 flex items-start justify-between">
                    <div><p className={`text-xs font-medium mb-2 ${muted}`}>{s.label}</p><p className={`font-semibold text-2xl ${strong}`}>{s.value}</p></div>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.bg}`}><span className={s.color}>{s.icon}</span></div>
                  </div>
                  <div className={`h-0.5 bg-gradient-to-r ${s.bar}`} />
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className={`rounded-2xl border lg:col-span-2 ${surface}`}>
                <div className={`flex items-center justify-between px-5 py-4 border-b ${divider}`}>
                  <span className={`text-sm font-semibold flex items-center gap-2 ${strong}`}><TrendingUp className="w-4 h-4 text-emerald-500" /> Commission trend</span>
                  <span className={`text-xs ${muted}`}>Last 8 months</span>
                </div>
                <div className="p-5">
                  <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-auto">
                    {[0, 1, 2, 3].map(i => { const y = padT + (i / 3) * innerH; return <line key={i} x1={padL} y1={y} x2={chartW - padR} y2={y} stroke={gridLine} strokeWidth={1} />; })}
                    <defs><linearGradient id="commFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.28" /><stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" /></linearGradient></defs>
                    <path d={areaPath} fill="url(#commFill)" />
                    <path d={linePath} fill="none" stroke="#8b5cf6" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                    {points.map((p, i) => (<g key={i}><circle cx={p.x} cy={p.y} r={3.5} fill={isDarkMode ? "#1e293b" : "#fff"} stroke="#8b5cf6" strokeWidth={2} /><text x={p.x} y={chartH - 4} textAnchor="middle" fontSize="10" fill={axisText}>{p.label}</text></g>))}
                    <text x={4} y={padT + 4} fontSize="10" fill={axisText}>${(maxVal / 1000).toFixed(1)}k</text>
                    <text x={4} y={padT + innerH} fontSize="10" fill={axisText}>${(minVal / 1000).toFixed(1)}k</text>
                  </svg>
                </div>
              </div>

              <div className={`rounded-2xl border ${surface}`}>
                <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${divider}`}>
                  <span className={`text-sm font-semibold ${strong}`}>Commission by category</span>
                </div>
                <div className="p-4 space-y-3">
                  {categoryRates.map(c => (
                    <div key={c.category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-medium ${strong}`}>{c.category}</span>
                        <span className={`text-xs ${muted}`}>{c.rate}%</span>
                      </div>
                      <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? "bg-slate-700/60" : "bg-slate-100"}`}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(c.rate / maxCatRate) * 100}%` }} transition={{ duration: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ── Commission rules ─────────────────────────────────────────── */}
        {section === "commission" && (
          <div className="space-y-5">
            <div className={`rounded-2xl border p-5 space-y-4 ${surface}`}>
              <p className={`text-sm font-semibold ${strong}`}>Platform default commission</p>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex gap-2">
                  <button onClick={() => setMode("percentage")} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${mode === "percentage" ? "bg-violet-500/15 text-violet-400 border-violet-500/30" : isDarkMode ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"}`}>Percentage</button>
                  <button onClick={() => setMode("fixed")} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${mode === "fixed" ? "bg-violet-500/15 text-violet-400 border-violet-500/30" : isDarkMode ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"}`}>Fixed fee</button>
                </div>
                <div className="flex items-center gap-2">
                  {mode === "percentage" ? <Percent className="w-4 h-4 opacity-60" /> : <DollarSign className="w-4 h-4 opacity-60" />}
                  <input type="number" value={defaultRate} onChange={e => setDefaultRate(Number(e.target.value))} className={`${inputCls} w-24`} />
                </div>
                <button onClick={saveDefaultRate} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white"><Save className="w-3.5 h-3.5" /> Save default</button>
              </div>
              <p className={`text-xs ${muted}`}>Applies to any category or seller tier without a specific override below.</p>
            </div>

            <div className={`rounded-2xl border ${surface}`}>
              <div className={`px-5 py-4 border-b ${divider}`}><p className={`text-sm font-semibold ${strong}`}>Category-wise commission</p></div>
              <div className="divide-y divide-slate-700/40">
                {categoryRates.map(c => (
                  <div key={c.category} className="flex items-center justify-between px-5 py-3">
                    <span className={`text-sm ${strong}`}>{c.category}</span>
                    {editingCategory === c.category ? (
                      <div className="flex items-center gap-2">
                        <input type="number" value={draftRate} onChange={e => setDraftRate(Number(e.target.value))} className={`${inputCls} w-20`} />
                        <button onClick={saveCategoryRate} className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white">Save</button>
                        <button onClick={() => setEditingCategory(null)} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => startEditCategory(c)} className={`text-sm font-medium px-3 py-1 rounded-lg ${isDarkMode ? "bg-slate-700 text-slate-200 hover:bg-slate-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{c.rate}%</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl border ${surface}`}>
              <div className={`px-5 py-4 border-b ${divider}`}><p className={`text-sm font-semibold ${strong}`}>Seller tier-based commission</p></div>
              <div className="divide-y divide-slate-700/40">
                {tierRates.map(t => (
                  <div key={t.tier} className="flex items-center justify-between px-5 py-3">
                    <span className={`text-sm flex items-center gap-2 ${strong}`}>
                      {t.tier === "verified" ? <ShieldCheck className="w-4 h-4 text-sky-500" /> : <Shield className="w-4 h-4 text-slate-400" />}
                      {t.tier === "verified" ? "Verified Seller" : "Basic Seller"}
                    </span>
                    {editingTier === t.tier ? (
                      <div className="flex items-center gap-2">
                        <input type="number" value={draftRate} onChange={e => setDraftRate(Number(e.target.value))} className={`${inputCls} w-20`} />
                        <button onClick={saveTierRate} className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white">Save</button>
                        <button onClick={() => setEditingTier(null)} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => startEditTier(t)} className={`text-sm font-medium px-3 py-1 rounded-lg ${isDarkMode ? "bg-slate-700 text-slate-200 hover:bg-slate-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{t.rate}%</button>
                    )}
                  </div>
                ))}
              </div>
              <p className={`text-xs px-5 py-3 ${muted}`}>Verified sellers get a lower commission rate as a loyalty incentive; tier rates take priority over category rates when both apply.</p>
            </div>
          </div>
        )}

        {/* ── Payouts ──────────────────────────────────────────────────── */}
        {section === "payouts" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {(["all", "pending", "scheduled", "completed", "failed"] as const).map(t => (
                  <button key={t} onClick={() => setPayoutTab(t)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${payoutTab === t ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}>
                    {t === "all" ? "All" : PAYOUT_STATUS_CFG[t].label}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${payoutTab === t ? "bg-white/20" : isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>{t === "all" ? payouts.length : payoutCounts[t] || 0}</span>
                  </button>
                ))}
              </div>
              <div className={`relative w-full sm:w-64 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
                <input value={payoutSearch} onChange={e => setPayoutSearch(e.target.value)} placeholder="Search seller..." className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border outline-none ${isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500" : "bg-slate-50 border-slate-200 placeholder-slate-400"}`} />
              </div>
            </div>

            <div className={`rounded-2xl border ${surface}`}>
              {paginatedPayouts.length > 0 ? (
                <div className="divide-y divide-slate-700/40">
                  {paginatedPayouts.map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 px-5 py-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img src={p.seller.photo} alt={p.seller.name} className="w-10 h-10 rounded-2xl object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold truncate ${strong}`}>{p.seller.name}</p>
                          <p className={`text-xs truncate ${muted}`}>${p.amount} · {p.method}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${PAYOUT_STATUS_CFG[p.status].color}`}>{PAYOUT_STATUS_CFG[p.status].label}</span>
                      <div className={`hidden lg:block text-xs ${muted} w-40 shrink-0`}>
                        <p>Requested {p.requestDate}</p>
                        {p.scheduledDate && <p>Scheduled {p.scheduledDate}</p>}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {p.status === "pending" && scheduleFor !== p.id && (
                          <>
                            <button onClick={() => approvePayout(p)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white"><CheckCircle className="w-3.5 h-3.5" /> Approve</button>
                            <button onClick={() => setScheduleFor(p.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}><CalendarClock className="w-3.5 h-3.5" /> Schedule</button>
                          </>
                        )}
                        {p.status === "pending" && scheduleFor === p.id && (
                          <>
                            <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className={`${inputCls} py-1.5`} />
                            <button onClick={() => confirmSchedule(p)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white">Confirm</button>
                            <button onClick={() => setScheduleFor(null)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                          </>
                        )}
                        {p.status === "scheduled" && (
                          <button onClick={() => markCompleted(p)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white"><CheckCircle className="w-3.5 h-3.5" /> Mark sent</button>
                        )}
                        {(p.status === "scheduled" || p.status === "pending") && (
                          <button onClick={() => markFailed(p)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white"><XCircle className="w-3.5 h-3.5" /> Fail</button>
                        )}
                        {p.status === "failed" && (
                          <button onClick={() => retryPayout(p)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white">Retry</button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-16 text-center"><Wallet className={`w-12 h-12 mx-auto mb-4 ${muted}`} /><p className={`text-lg font-medium ${strong}`}>No payouts found</p></div>
              )}
              {filteredPayouts.length > 0 && <Pagination page={payoutPageSafe} totalPages={payoutTotalPages} onPage={setPayoutPage} count={filteredPayouts.length} />}
            </div>
          </div>
        )}

        {/* ── Wallets ──────────────────────────────────────────────────── */}
        {section === "wallets" && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`rounded-2xl border p-5 ${surface}`}>
                <p className={`text-xs font-medium mb-2 ${muted}`}>Platform wallet</p>
                <p className={`text-2xl font-semibold ${strong}`}>${platformBalance.toLocaleString()}</p>
                <div className="flex items-center gap-4 mt-3 text-xs">
                  <span className="flex items-center gap-1 text-emerald-500"><ArrowDownToLine className="w-3.5 h-3.5" /> +$4,120 in</span>
                  <span className="flex items-center gap-1 text-rose-500"><ArrowUpFromLine className="w-3.5 h-3.5" /> -$2,860 out</span>
                </div>
              </div>
              <div className={`rounded-2xl border p-5 ${surface}`}>
                <p className={`text-xs font-medium mb-2 ${muted}`}>Total seller wallet balance</p>
                <p className={`text-2xl font-semibold ${strong}`}>${MOCK_SELLER_WALLETS.reduce((s, w) => s + w.balance, 0).toLocaleString()}</p>
                <p className={`text-xs mt-3 ${muted}`}>Across {MOCK_SELLER_WALLETS.length} active sellers</p>
              </div>
              <div className={`rounded-2xl border p-5 ${surface}`}>
                <p className={`text-xs font-medium mb-2 ${muted}`}>Total buyer wallet balance</p>
                <p className={`text-2xl font-semibold ${strong}`}>${MOCK_BUYER_WALLETS.reduce((s, w) => s + w.balance, 0).toLocaleString()}</p>
                <p className={`text-xs mt-3 ${muted}`}>Store credit & refund balances</p>
              </div>
            </div>

            <div className={`rounded-2xl border ${surface}`}>
              <div className={`px-5 py-4 border-b ${divider}`}><p className={`text-sm font-semibold ${strong}`}>Withdrawal approvals</p></div>
              <div className="divide-y divide-slate-700/40">
                {withdrawals.map(w => (
                  <div key={w.id} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className={`text-sm font-medium ${strong}`}>{w.sellerName}</p>
                      <p className={`text-xs ${muted}`}>${w.amount} · requested {w.requestDate}</p>
                    </div>
                    {w.status === "pending" ? (
                      <div className="flex gap-2">
                        <button onClick={() => approveWithdrawal(w.id, w.sellerName)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white">Approve</button>
                        <button onClick={() => rejectWithdrawal(w.id, w.sellerName)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white">Reject</button>
                      </div>
                    ) : (
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${w.status === "approved" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" : "bg-rose-500/15 text-rose-400 border-rose-500/20"}`}>{w.status}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className={`rounded-2xl border ${surface}`}>
                <div className={`px-5 py-4 border-b ${divider}`}><p className={`text-sm font-semibold ${strong}`}>Seller wallets</p></div>
                <div className="divide-y divide-slate-700/40">
                  {MOCK_SELLER_WALLETS.map(w => (
                    <div key={w.id} className="flex items-center justify-between px-5 py-3">
                      <div className="flex items-center gap-3"><img src={w.photo} className="w-8 h-8 rounded-xl object-cover" /><span className={`text-sm ${strong}`}>{w.name}</span></div>
                      <span className={`text-sm font-medium ${strong}`}>${w.balance}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`rounded-2xl border ${surface}`}>
                <div className={`px-5 py-4 border-b ${divider}`}><p className={`text-sm font-semibold ${strong}`}>Buyer wallets</p></div>
                <div className="divide-y divide-slate-700/40">
                  {MOCK_BUYER_WALLETS.map(w => (
                    <div key={w.id} className="flex items-center justify-between px-5 py-3">
                      <div className="flex items-center gap-3"><img src={w.photo} className="w-8 h-8 rounded-xl object-cover" /><span className={`text-sm ${strong}`}>{w.name}</span></div>
                      <span className={`text-sm font-medium ${strong}`}>${w.balance}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Ledger & invoices ────────────────────────────────────────── */}
        {section === "ledger" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="flex gap-1">
                {(["7d", "30d", "all"] as const).map(r => (
                  <button key={r} onClick={() => setLedgerRange(r)} className={`px-4 py-2 rounded-xl text-sm font-medium ${ledgerRange === r ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}>
                    {r === "7d" ? "Last 7 days" : r === "30d" ? "Last 30 days" : "All time"}
                  </button>
                ))}
              </div>
              <button onClick={exportLedgerCSV} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white"><Download className="w-4 h-4" /> Export CSV</button>
            </div>

            <div className={`rounded-2xl border ${surface}`}>
              <div className="divide-y divide-slate-700/40">
                {filteredLedger.map(l => (
                  <div key={l.id} className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 ${LEDGER_TYPE_CFG[l.type].color}`}>{LEDGER_TYPE_CFG[l.type].label}</span>
                    <div className="flex-1 min-w-0"><p className={`text-sm truncate ${strong}`}>{l.party}</p><p className={`text-xs ${muted}`}>{l.date} · {l.status}</p></div>
                    <span className={`text-sm font-semibold ${l.amount < 0 ? "text-rose-500" : "text-emerald-500"}`}>{l.amount < 0 ? "-" : "+"}${Math.abs(l.amount)}</span>
                    <button onClick={() => setInvoiceEntry(l)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border shrink-0 ${isDarkMode ? "border-slate-600 text-slate-300 hover:bg-slate-700" : "border-slate-200 text-slate-600 hover:bg-slate-100"}`}><Receipt className="w-3.5 h-3.5" /> Invoice</button>
                  </div>
                ))}
                {filteredLedger.length === 0 && <div className="p-10 text-center text-sm"><span className={muted}>No transactions in this range.</span></div>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Invoice preview modal ───────────────────────────────────────── */}
      <AnimatePresence>
        {invoiceEntry && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setInvoiceEntry(null)}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} className={`w-full max-w-md rounded-2xl ${surface}`} onClick={e => e.stopPropagation()}>
              <div className={`p-6 border-b flex items-center justify-between ${divider}`}>
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${strong}`}><Receipt className="w-5 h-5" /> Invoice preview</h3>
                <button onClick={() => setInvoiceEntry(null)} className={`p-2 rounded-lg ${muted}`}><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div><p className={`text-xs ${muted}`}>Invoice for</p><p className={`text-sm font-medium ${strong}`}>{invoiceEntry.party}</p></div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className={muted}>Date</p><p className={strong}>{invoiceEntry.date}</p></div>
                  <div><p className={muted}>Type</p><p className={strong}>{LEDGER_TYPE_CFG[invoiceEntry.type].label}</p></div>
                </div>
                <div className={`rounded-xl p-4 space-y-2 text-sm ${panel}`}>
                  <div className="flex justify-between"><span className={muted}>Subtotal</span><span className={strong}>${Math.abs(invoiceEntry.amount)}</span></div>
                  <div className="flex justify-between"><span className={muted}>VAT (5%)</span><span className={strong}>${(Math.abs(invoiceEntry.amount) * 0.05).toFixed(2)}</span></div>
                  <div className={`flex justify-between font-semibold pt-2 border-t ${divider}`}><span className={strong}>Total</span><span className={strong}>${(Math.abs(invoiceEntry.amount) * 1.05).toFixed(2)}</span></div>
                </div>
                <button
                  onClick={() => {
                    const content = `Invoice\nParty: ${invoiceEntry.party}\nDate: ${invoiceEntry.date}\nType: ${invoiceEntry.type}\nSubtotal: $${Math.abs(invoiceEntry.amount)}\nVAT (5%): $${(Math.abs(invoiceEntry.amount) * 0.05).toFixed(2)}\nTotal: $${(Math.abs(invoiceEntry.amount) * 1.05).toFixed(2)}`;
                    const blob = new Blob([content], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url; a.download = `invoice-${invoiceEntry.id}.txt`; a.click();
                    URL.revokeObjectURL(url);
                    toast.success("Invoice downloaded");
                  }}
                  className="w-full py-2.5 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download invoice
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}