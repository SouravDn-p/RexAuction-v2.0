import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  CreditCard,
  Download,
  Eye,
  MapPin,
  Package,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Truck,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { MOCK_BUYER_AUCTIONS } from "../../../../../data/Buyerauctiondata";
import { MOCK_USER } from "../../../../../data/MOCK_USER";
import { exportTransactionPdf } from "../../../../lib/exportTransactionPdf";
import Counter from "../../../../../hooks/Counter";
import { useTheme } from "../../../../../hooks/useTheme";

// ─── Helpers ────────────────────────────────────────────────────────────────
const spring = { type: "spring" as const, stiffness: 120, damping: 20 };
const fmt = (n: number) => "$" + n.toLocaleString("en-US");
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

const GATEWAYS = ["SSLCommerz", "bKash", "Nagad", "Card"];

// ─── Seed data (mock, local) ────────────────────────────────────────────────
interface Tx {
  id: string;
  date: string;
  description: string;
  type: "Deposit" | "Withdrawal";
  amount: number;
  status: "completed" | "pending";
  auctionId?: string;
}

const SEED_TX: Tx[] = [
  { id: "t1", date: "2026-07-06", description: "Wallet top-up via SSLCommerz", type: "Deposit", amount: 5000, status: "completed" },
  { id: "t2", date: "2026-07-04", description: "Payment — Gibson Les Paul '59", type: "Withdrawal", amount: 18900, status: "completed", auctionId: "a4" },
  { id: "t3", date: "2026-07-02", description: "Wallet top-up via bKash", type: "Deposit", amount: 20000, status: "completed" },
  { id: "t4", date: "2026-06-28", description: "Payment — Mac Pro M2 Ultra", type: "Withdrawal", amount: 6090, status: "pending", auctionId: "a5" },
  { id: "t5", date: "2026-06-20", description: "Refund — cancelled order", type: "Deposit", amount: 1200, status: "completed" },
  { id: "t6", date: "2026-05-20", description: "Payment — Harry Potter first edition", type: "Withdrawal", amount: 9975, status: "completed", auctionId: "a6" },
];

interface Card {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
}
const SEED_CARDS: Card[] = [
  { id: "c1", brand: "Visa", last4: "4242", expiry: "08/28", isDefault: true },
  { id: "c2", brand: "Mastercard", last4: "8813", expiry: "11/27", isDefault: false },
];

interface Address {
  id: string;
  label: string;
  line: string;
  isDefault: boolean;
}
const SEED_ADDR: Address[] = [
  { id: "ad1", label: "Home", line: "42 Maple Street, Dhaka 1207", isDefault: true },
  { id: "ad2", label: "Office", line: "15 Gulshan Ave, Dhaka 1212", isDefault: false },
];

interface Order {
  id: string;
  item: string;
  image: string;
  seller: string;
  amount: number;
  date: string;
  payment: "completed" | "pending";
  delivery: "pending" | "in transit" | "delivered" | "cancelled";
}
const deliveryFromWon = (d: string | undefined): Order["delivery"] => {
  if (d === "delivered") return "delivered";
  if (d === "in_transit" || d === "shipped") return "in transit";
  return "pending";
};
const SEED_ORDERS: Order[] = MOCK_BUYER_AUCTIONS.filter((a) => a.status === "won").map((a) => ({
  id: a._id,
  item: a.name,
  image: a.image,
  seller: a.seller,
  amount: a.totalPaid ?? a.myBid,
  date: a.endTime,
  payment: a.paymentStatus === "paid" ? "completed" : "pending",
  delivery: deliveryFromWon(a.deliveryStatus),
}));

export default function BuyerWalletPage() {
  const { isDarkMode } = useTheme();

  const [balance, setBalance] = useState(MOCK_USER.accountBalance);
  const [transactions, setTransactions] = useState<Tx[]>(SEED_TX);
  const [cards, setCards] = useState<Card[]>(SEED_CARDS);
  const [addresses, setAddresses] = useState<Address[]>(SEED_ADDR);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);

  const [tab, setTab] = useState<"transactions" | "orders">("transactions");
  const [txFilter, setTxFilter] = useState<"all" | "Deposit" | "Withdrawal">("all");
  const [search, setSearch] = useState("");

  const [fundsOpen, setFundsOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);
  const [addrOpen, setAddrOpen] = useState(false);
  const [orderModal, setOrderModal] = useState<Order | null>(null);

  // Form state
  const [amount, setAmount] = useState("");
  const [gateway, setGateway] = useState(GATEWAYS[0]);
  const [cardForm, setCardForm] = useState({ brand: "Visa", last4: "", expiry: "" });
  const [addrForm, setAddrForm] = useState({ label: "", line: "" });

  // ── Design tokens ──────────────────────────────────────────────────────────
  const card = `rounded-2xl border ${isDarkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-slate-100 shadow-sm"}`;
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const div = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const hover = isDarkMode ? "hover:bg-slate-700/40" : "hover:bg-slate-50";
  const inputCls = `w-full px-3 py-2.5 text-sm rounded-xl border outline-none transition-all ${isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"}`;

  // ── Derived ──────────────────────────────────────────────────────────────
  const deposits = transactions.filter((t) => t.type === "Deposit").reduce((s, t) => s + t.amount, 0);
  const withdrawals = transactions.filter((t) => t.type === "Withdrawal").reduce((s, t) => s + t.amount, 0);
  const pending = transactions.filter((t) => t.status === "pending").length;

  const filteredTx = transactions
    .filter((t) => txFilter === "all" || t.type === txFilter)
    .filter((t) => !search || t.description.toLowerCase().includes(search.toLowerCase()) || String(t.amount).includes(search))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // ── Handlers ─────────────────────────────────────────────────────────────
  const submitFunds = () => {
    const n = Number(amount);
    if (!n || n <= 0) { toast.error("Enter a valid amount"); return; }
    setBalance((b) => b + n);
    setTransactions((prev) => [
      { id: `t${Date.now()}`, date: new Date().toISOString().slice(0, 10), description: `Wallet top-up via ${gateway}`, type: "Deposit", amount: n, status: "completed" },
      ...prev,
    ]);
    toast.success(`${fmt(n)} added via ${gateway}`);
    setAmount(""); setFundsOpen(false);
  };

  const submitWithdraw = () => {
    const n = Number(amount);
    if (!n || n <= 0) { toast.error("Enter a valid amount"); return; }
    if (n > balance) { toast.error("Amount exceeds balance"); return; }
    setBalance((b) => b - n);
    setTransactions((prev) => [
      { id: `t${Date.now()}`, date: new Date().toISOString().slice(0, 10), description: "Withdrawal to bank", type: "Withdrawal", amount: n, status: "pending" },
      ...prev,
    ]);
    toast.success(`Withdrawal of ${fmt(n)} requested`);
    setAmount(""); setWithdrawOpen(false);
  };

  const addCard = () => {
    if (cardForm.last4.length !== 4 || !cardForm.expiry) { toast.error("Enter card last 4 digits & expiry"); return; }
    setCards((prev) => [...prev, { id: `c${Date.now()}`, brand: cardForm.brand, last4: cardForm.last4, expiry: cardForm.expiry, isDefault: prev.length === 0 }]);
    toast.success("Payment method added");
    setCardForm({ brand: "Visa", last4: "", expiry: "" }); setCardOpen(false);
  };
  const removeCard = (id: string) => { setCards((p) => p.filter((c) => c.id !== id)); toast.success("Card removed"); };
  const defaultCard = (id: string) => setCards((p) => p.map((c) => ({ ...c, isDefault: c.id === id })));

  const addAddress = () => {
    if (!addrForm.label || !addrForm.line) { toast.error("Enter a label & address"); return; }
    setAddresses((prev) => [...prev, { id: `ad${Date.now()}`, label: addrForm.label, line: addrForm.line, isDefault: prev.length === 0 }]);
    toast.success("Address saved");
    setAddrForm({ label: "", line: "" }); setAddrOpen(false);
  };
  const removeAddr = (id: string) => { setAddresses((p) => p.filter((a) => a.id !== id)); toast.success("Address removed"); };
  const defaultAddr = (id: string) => setAddresses((p) => p.map((a) => ({ ...a, isDefault: a.id === id })));

  const cancelOrder = (id: string) => {
    setOrders((p) => p.map((o) => (o.id === id ? { ...o, delivery: "cancelled" } : o)));
    setOrderModal(null);
    toast.success("Order cancelled — refund will be issued to your wallet");
  };
  const confirmReceipt = (id: string) => {
    setOrders((p) => p.map((o) => (o.id === id ? { ...o, delivery: "delivered" } : o)));
    setOrderModal(null);
    toast.success("Receipt confirmed — seller payout released");
  };

  const exportPdf = () => {
    exportTransactionPdf({ dbUser: MOCK_USER, filteredTransactions: filteredTx });
    toast.success("Exporting transactions…");
  };

  const deliveryBadge = (d: Order["delivery"]) => {
    const map: Record<Order["delivery"], string> = {
      delivered: isDarkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600",
      "in transit": isDarkMode ? "bg-sky-500/10 text-sky-400" : "bg-sky-50 text-sky-600",
      pending: isDarkMode ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600",
      cancelled: isDarkMode ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-600",
    };
    return map[d];
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Toaster
        position="top-right"
        toastOptions={{ style: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px", borderRadius: "10px", background: isDarkMode ? "#1e293b" : "#fff", color: isDarkMode ? "#f1f5f9" : "#0f172a", border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0" } }}
      />

      {/* ── Header ── */}
      <div className={`border-b px-6 py-4 sticky top-0 z-30 backdrop-blur-sm ${isDarkMode ? "border-slate-700/50 bg-slate-900/80" : "border-slate-100 bg-white/80"}`}>
        <div className="mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDarkMode ? "bg-violet-500/10" : "bg-violet-50"}`}>
              <Wallet className="w-4 h-4 text-violet-500" />
            </div>
            <div>
              <h1 className={`text-sm font-semibold ${strong}`}>Payments</h1>
              <p className={`text-xs ${muted}`}>Balance, methods, auction payments and orders</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button onClick={() => setFundsOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors whitespace-nowrap">
              <Plus className="w-3.5 h-3.5" /> Add Funds
            </button>
            <button onClick={exportPdf} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${isDarkMode ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-100"}`}>
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 py-6 max-w-7xl space-y-6">
        {/* ── Balance hero + stats ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="lg:col-span-1 rounded-2xl p-6 bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20">
            <p className="text-xs font-medium text-white/70">Current Balance</p>
            <p className="text-4xl font-bold tracking-tight mt-1">$<Counter end={balance} /></p>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setFundsOpen(true)} className="flex-1 py-2 rounded-xl text-xs font-semibold bg-white/15 hover:bg-white/25 transition-colors">Add Funds</button>
              <button onClick={() => setWithdrawOpen(true)} className="flex-1 py-2 rounded-xl text-xs font-semibold bg-white/15 hover:bg-white/25 transition-colors">Withdraw</button>
            </div>
          </motion.div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Deposits", value: deposits, prefix: "$", color: "text-emerald-500", icon: <ArrowDown className="w-4 h-4" />, bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50" },
              { label: "Total Withdrawals", value: withdrawals, prefix: "$", color: "text-rose-500", icon: <ArrowUp className="w-4 h-4" />, bg: isDarkMode ? "bg-rose-500/10" : "bg-rose-50" },
              { label: "Pending", value: pending, prefix: "", color: "text-amber-500", icon: <Truck className="w-4 h-4" />, bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, ...spring }} className={`${card} p-4`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-medium ${muted}`}>{s.label}</span>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${s.bg}`}><span className={s.color}>{s.icon}</span></div>
                </div>
                <p className={`text-2xl font-semibold ${strong}`}>{s.prefix}<Counter end={s.value} /></p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Payment methods + Addresses ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Cards */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={spring} className={card}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${div}`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-sky-500/10" : "bg-sky-50"}`}><CreditCard className="text-sky-500 w-3.5 h-3.5" /></div>
                <span className={`text-sm font-semibold ${strong}`}>Payment methods</span>
              </div>
              <button onClick={() => setCardOpen(true)} className="text-xs font-medium text-violet-500 hover:text-violet-600 flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
            </div>
            <div className="p-3 space-y-1">
              {cards.length === 0 && <p className={`text-xs text-center py-6 ${muted}`}>No saved cards</p>}
              {cards.map((c) => (
                <div key={c.id} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${hover}`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? "bg-slate-700" : "bg-slate-100"}`}><CreditCard className={`w-4 h-4 ${muted}`} /></div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${strong}`}>{c.brand} •••• {c.last4}</p>
                    <p className={`text-xs ${muted}`}>Expires {c.expiry}</p>
                  </div>
                  {c.isDefault ? (
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${isDarkMode ? "bg-violet-500/10 text-violet-400" : "bg-violet-50 text-violet-600"}`}>Default</span>
                  ) : (
                    <button onClick={() => defaultCard(c.id)} className={`text-[11px] font-medium px-2 py-1 rounded-lg ${muted} ${hover}`}>Set default</button>
                  )}
                  <button onClick={() => removeCard(c.id)} className={`p-1.5 rounded-lg ${muted} ${isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Addresses */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, ...spring }} className={card}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${div}`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-amber-500/10" : "bg-amber-50"}`}><MapPin className="text-amber-500 w-3.5 h-3.5" /></div>
                <span className={`text-sm font-semibold ${strong}`}>Saved addresses</span>
              </div>
              <button onClick={() => setAddrOpen(true)} className="text-xs font-medium text-violet-500 hover:text-violet-600 flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
            </div>
            <div className="p-3 space-y-1">
              {addresses.length === 0 && <p className={`text-xs text-center py-6 ${muted}`}>No saved addresses</p>}
              {addresses.map((a) => (
                <div key={a.id} className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${hover}`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? "bg-slate-700" : "bg-slate-100"}`}><MapPin className={`w-4 h-4 ${muted}`} /></div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${strong}`}>{a.label}</p>
                    <p className={`text-xs truncate ${muted}`}>{a.line}</p>
                  </div>
                  {a.isDefault ? (
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${isDarkMode ? "bg-violet-500/10 text-violet-400" : "bg-violet-50 text-violet-600"}`}>Default</span>
                  ) : (
                    <button onClick={() => defaultAddr(a.id)} className={`text-[11px] font-medium px-2 py-1 rounded-lg ${muted} ${hover}`}>Set default</button>
                  )}
                  <button onClick={() => removeAddr(a.id)} className={`p-1.5 rounded-lg ${muted} ${isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Tabs: Transactions | Orders ── */}
        <div className={card}>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b ${div}`}>
            <div className="flex gap-2">
              {(["transactions", "orders"] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${tab === t ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"}`}>
                  {t}
                </button>
              ))}
            </div>
            {tab === "transactions" && (
              <div className="flex items-center gap-2">
                <div className={`relative ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" className={`pl-9 pr-3 py-1.5 text-sm rounded-lg border outline-none w-40 ${isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"}`} />
                </div>
                <select value={txFilter} onChange={(e) => setTxFilter(e.target.value as typeof txFilter)} className={`text-sm rounded-lg border px-2 py-1.5 outline-none ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                  <option value="all">All</option>
                  <option value="Deposit">Deposits</option>
                  <option value="Withdrawal">Withdrawals</option>
                </select>
              </div>
            )}
          </div>

          {/* Transactions table */}
          {tab === "transactions" && (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className={`border-b ${div}`}>
                    <th className={`py-4 px-6 text-left text-xs font-medium uppercase tracking-widest ${muted}`}>Date</th>
                    <th className={`py-4 px-6 text-left text-xs font-medium uppercase tracking-widest ${muted}`}>Description</th>
                    <th className={`py-4 px-6 text-left text-xs font-medium uppercase tracking-widest ${muted}`}>Amount</th>
                    <th className={`py-4 px-6 text-left text-xs font-medium uppercase tracking-widest ${muted}`}>Status</th>
                    <th className={`py-4 px-6 text-right text-xs font-medium uppercase tracking-widest ${muted}`}>Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? "divide-slate-700/60" : "divide-slate-100"}`}>
                  {filteredTx.length > 0 ? filteredTx.map((t, i) => (
                    <motion.tr key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={hover}>
                      <td className={`py-4 px-6 text-sm ${strong}`}>{fmtDate(t.date)}</td>
                      <td className={`py-4 px-6 text-sm ${strong}`}>{t.description}</td>
                      <td className="py-4 px-6">
                        <span className={`font-semibold flex items-center gap-1 ${t.type === "Deposit" ? "text-emerald-500" : "text-rose-500"}`}>
                          {t.type === "Deposit" ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}{fmt(t.amount)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${t.status === "completed" ? (isDarkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-100 text-emerald-700") : (isDarkMode ? "bg-amber-500/10 text-amber-400" : "bg-amber-100 text-amber-700")}`}>
                          {t.status === "completed" ? "Completed" : "Pending"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {t.auctionId && t.status === "completed" ? (
                          <Link
                            to={`/buyer/won-auctions/${t.auctionId}`}
                            className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium ${isDarkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-100 hover:bg-slate-200"}`}
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </Link>
                        ) : t.auctionId ? (
                          <Link
                            to={`/buyer/won-auctions/${t.auctionId}`}
                            className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium ${isDarkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-100 hover:bg-slate-200"}`}
                          >
                            Pay
                          </Link>
                        ) : (
                          <span className={`text-xs ${muted}`}>—</span>
                        )}
                      </td>
                    </motion.tr>
                  )) : (
                    <tr><td colSpan={5} className={`py-16 text-center ${muted}`}>No transactions found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Orders */}
          {tab === "orders" && (
            <div className="p-3 space-y-1">
              {orders.map((o) => (
                <div key={o.id} className={`flex items-center gap-4 p-2.5 rounded-xl transition-colors ${hover}`}>
                  <img src={o.image} alt={o.item} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${strong}`}>{o.item}</p>
                    <p className={`text-xs ${muted}`}>{o.seller} · {fmtDate(o.date)}</p>
                  </div>
                  <span className={`hidden md:inline text-sm font-semibold ${strong}`}>{fmt(o.amount)}</span>
                  <span className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-medium capitalize px-2.5 py-1 rounded-lg ${deliveryBadge(o.delivery)}`}>
                    <Truck className="w-3 h-3" /> {o.delivery}
                  </span>
                  {o.payment === "completed" ? (
                    <Link
                      to={`/buyer/won-auctions/${o.id}`}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium ${isDarkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-slate-100 hover:bg-slate-200"}`}
                    >
                      View
                    </Link>
                  ) : (
                    <Link
                      to={`/buyer/won-auctions/${o.id}`}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium bg-amber-500 hover:bg-amber-600 text-black"
                    >
                      Pay
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Add Funds / Withdraw modal ── */}
      <AnimatePresence>
        {(fundsOpen || withdrawOpen) && (
          <Modal onClose={() => { setFundsOpen(false); setWithdrawOpen(false); setAmount(""); }} isDarkMode={isDarkMode} title={fundsOpen ? "Add Funds" : "Withdraw"} card={card} strong={strong} muted={muted}>
            <label className={`text-xs font-medium ${muted}`}>Amount (USD)</label>
            <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0.00" className={`${inputCls} mt-1 mb-4`} />
            {fundsOpen && (
              <>
                <label className={`text-xs font-medium ${muted}`}>Payment gateway</label>
                <div className="grid grid-cols-2 gap-2 mt-1 mb-4">
                  {GATEWAYS.map((g) => (
                    <button key={g} onClick={() => setGateway(g)} className={`py-2 rounded-xl text-sm font-medium border transition-colors ${gateway === g ? "bg-violet-600 text-white border-violet-600" : isDarkMode ? "border-slate-700 hover:bg-slate-700" : "border-slate-200 hover:bg-slate-100"}`}>{g}</button>
                  ))}
                </div>
                <div className={`flex items-center gap-1.5 text-xs mb-4 ${muted}`}><ShieldCheck className="w-3.5 h-3.5" /> Secured by {gateway} payment protection</div>
              </>
            )}
            <button onClick={fundsOpen ? submitFunds : submitWithdraw} className="w-full py-3 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-colors">
              {fundsOpen ? "Add Funds" : "Request Withdrawal"}
            </button>
          </Modal>
        )}
      </AnimatePresence>

      {/* ── Add Card modal ── */}
      <AnimatePresence>
        {cardOpen && (
          <Modal onClose={() => setCardOpen(false)} isDarkMode={isDarkMode} title="Add payment method" card={card} strong={strong} muted={muted}>
            <label className={`text-xs font-medium ${muted}`}>Brand</label>
            <select value={cardForm.brand} onChange={(e) => setCardForm((f) => ({ ...f, brand: e.target.value }))} className={`${inputCls} mt-1 mb-3`}>
              {["Visa", "Mastercard", "Amex"].map((b) => <option key={b}>{b}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className={`text-xs font-medium ${muted}`}>Last 4 digits</label>
                <input maxLength={4} value={cardForm.last4} onChange={(e) => setCardForm((f) => ({ ...f, last4: e.target.value.replace(/\D/g, "") }))} placeholder="4242" className={`${inputCls} mt-1`} />
              </div>
              <div>
                <label className={`text-xs font-medium ${muted}`}>Expiry</label>
                <input value={cardForm.expiry} onChange={(e) => setCardForm((f) => ({ ...f, expiry: e.target.value }))} placeholder="MM/YY" className={`${inputCls} mt-1`} />
              </div>
            </div>
            <button onClick={addCard} className="w-full py-3 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-colors">Save card</button>
          </Modal>
        )}
      </AnimatePresence>

      {/* ── Add Address modal ── */}
      <AnimatePresence>
        {addrOpen && (
          <Modal onClose={() => setAddrOpen(false)} isDarkMode={isDarkMode} title="Add address" card={card} strong={strong} muted={muted}>
            <label className={`text-xs font-medium ${muted}`}>Label</label>
            <input value={addrForm.label} onChange={(e) => setAddrForm((f) => ({ ...f, label: e.target.value }))} placeholder="Home, Office…" className={`${inputCls} mt-1 mb-3`} />
            <label className={`text-xs font-medium ${muted}`}>Address</label>
            <input value={addrForm.line} onChange={(e) => setAddrForm((f) => ({ ...f, line: e.target.value }))} placeholder="Street, city, ZIP" className={`${inputCls} mt-1 mb-4`} />
            <button onClick={addAddress} className="w-full py-3 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-colors">Save address</button>
          </Modal>
        )}
      </AnimatePresence>

      {/* ── Order detail modal ── */}
      <AnimatePresence>
        {orderModal && (
          <Modal onClose={() => setOrderModal(null)} isDarkMode={isDarkMode} title="Order details" card={card} strong={strong} muted={muted}>
            <img src={orderModal.image} alt={orderModal.item} className="w-full h-40 object-cover rounded-xl mb-4" />
            <h4 className={`font-semibold ${strong}`}>{orderModal.item}</h4>
            <p className={`text-xs mb-4 ${muted}`}>{orderModal.seller} · {fmtDate(orderModal.date)}</p>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div><p className={muted}>Amount</p><p className={`font-semibold ${strong}`}>{fmt(orderModal.amount)}</p></div>
              <div><p className={muted}>Delivery</p><p className={`font-semibold capitalize flex items-center gap-1 ${strong}`}><Package className="w-3.5 h-3.5" /> {orderModal.delivery}</p></div>
            </div>
            <div className="flex gap-2">
              {orderModal.delivery === "pending" && (
                <button onClick={() => cancelOrder(orderModal.id)} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-rose-500 hover:bg-rose-600 text-white transition-colors flex items-center justify-center gap-1.5"><X className="w-4 h-4" /> Cancel order</button>
              )}
              {orderModal.delivery === "in transit" && (
                <button onClick={() => confirmReceipt(orderModal.id)} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-colors flex items-center justify-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Confirm receipt</button>
              )}
              {orderModal.delivery === "delivered" && (
                <div className={`flex-1 py-2.5 rounded-xl text-sm font-medium text-center ${isDarkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600"}`}>Delivered ✓</div>
              )}
              {orderModal.delivery === "cancelled" && (
                <div className={`flex-1 py-2.5 rounded-xl text-sm font-medium text-center ${isDarkMode ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-600"}`}>Cancelled</div>
              )}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Reusable modal shell ────────────────────────────────────────────────────
function Modal({ children, onClose, isDarkMode, title, card, strong, muted }: {
  children: React.ReactNode; onClose: () => void; isDarkMode: boolean; title: string; card: string; strong: string; muted: string;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.97 }} transition={spring} className={`w-full max-w-md rounded-2xl ${card}`} onClick={(e) => e.stopPropagation()}>
        <div className={`flex items-center justify-between px-5 py-4 border-b ${isDarkMode ? "border-slate-700/60" : "border-slate-100"}`}>
          <h3 className={`text-sm font-semibold ${strong}`}>{title}</h3>
          <button onClick={onClose} className={`p-1.5 rounded-lg ${muted} ${isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </motion.div>
  );
}
