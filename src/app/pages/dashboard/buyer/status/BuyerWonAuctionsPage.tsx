import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Search,
  Star,
  Tag,
  Trophy,
  Truck,
  User,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  MOCK_BUYER_AUCTIONS,
  type BuyerAuction,
  type DeliveryStatus,
  type PaymentStatus,
} from "../../../../../data/Buyerauctiondata";
import { MOCK_USER } from "../../../../../data/MOCK_USER";
import { useTheme } from "../../../../../hooks/useTheme";

const spring = { type: "spring" as const, stiffness: 120, damping: 20 };
const formatCurrency = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0 });
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const PAYMENT_COLOR: Record<PaymentStatus, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  processing: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  failed: "bg-rose-500/15 text-rose-400 border-rose-500/20",
};

const DELIVERY_LABEL: Record<DeliveryStatus, string> = {
  awaiting: "Awaiting shipment",
  preparing: "Preparing",
  shipped: "Shipped",
  in_transit: "In transit",
  delivered: "Delivered",
};

const DELIVERY_ORDER: DeliveryStatus[] = ["awaiting", "preparing", "shipped", "in_transit", "delivered"];

type TabKey = "all" | "pay" | "ship" | "done";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pay", label: "Pay now" },
  { key: "ship", label: "In delivery" },
  { key: "done", label: "Delivered" },
];

function matchesTab(a: BuyerAuction, tab: TabKey) {
  if (tab === "all") return true;
  if (tab === "pay") return a.paymentStatus !== "paid";
  if (tab === "done") return a.deliveryStatus === "delivered";
  return a.paymentStatus === "paid" && a.deliveryStatus !== "delivered";
}

function WonCard({ auction, isDarkMode }: { auction: BuyerAuction; isDarkMode: boolean }) {
  const payment = auction.paymentStatus ?? "pending";
  const delivery = auction.deliveryStatus ?? "awaiting";
  const delivIdx = DELIVERY_ORDER.indexOf(delivery);
  const progress = ((delivIdx + 1) / DELIVERY_ORDER.length) * 100;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className={`group rounded-2xl border overflow-hidden shadow-sm ${
        isDarkMode ? "bg-slate-800 border-slate-700 hover:border-slate-600" : "bg-white border-slate-100 hover:border-slate-300"
      }`}
    >
      <div className="relative h-44 overflow-hidden">
        <img src={auction.image} alt={auction.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-sm bg-amber-500/15 text-amber-400 border-amber-500/20">
          <Trophy className="w-3.5 h-3.5" /> Won
        </span>
        <span className="absolute bottom-3 left-3 text-xs font-bold px-2.5 py-1 rounded-lg bg-black/50 text-white backdrop-blur-sm">
          {formatCurrency(auction.myBid)}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-sm leading-tight line-clamp-2 mb-1">{auction.name}</h3>
        <div className="flex items-center gap-1.5 mb-3">
          <Tag className={`w-3 h-3 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`} />
          <span className={`text-xs ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>{auction.category}</span>
          <span className={`text-xs ml-auto ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>{formatDate(auction.endTime)}</span>
        </div>

        <div className={`rounded-xl p-3 mb-3 ${isDarkMode ? "bg-slate-700/50" : "bg-slate-50"}`}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className={`text-[10px] font-medium uppercase tracking-wide mb-0.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Winning bid</p>
              <p className="text-sm font-bold text-amber-400">{formatCurrency(auction.myBid)}</p>
            </div>
            <div>
              <p className={`text-[10px] font-medium uppercase tracking-wide mb-0.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Total due</p>
              <p className="text-sm font-bold">{formatCurrency(auction.totalPaid ?? auction.myBid + Math.round(auction.myBid * 0.05))}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-3">
          <User className={`w-3 h-3 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`} />
          <span className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{auction.seller}</span>
          <Star className="w-3 h-3 text-amber-400 fill-amber-400 ml-auto" />
          <span className="text-xs font-medium text-amber-400">{auction.sellerRating}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${PAYMENT_COLOR[payment]}`}>
            {payment === "paid" ? <CheckCircle2 className="w-3 h-3" /> : payment === "failed" ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            {payment === "paid" ? "Paid" : payment === "failed" ? "Failed" : "Payment pending"}
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
            delivery === "delivered" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" : "bg-sky-500/15 text-sky-400 border-sky-500/20"
          }`}>
            <Truck className="w-3 h-3" /> {DELIVERY_LABEL[delivery]}
          </span>
        </div>

        <div className={`h-1.5 rounded-full overflow-hidden mb-3 ${isDarkMode ? "bg-slate-700" : "bg-slate-100"}`}>
          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${progress}%` }} />
        </div>

        <Link
          to={`/${MOCK_USER.role}/won-auctions/${auction._id}`}
          className="flex items-center justify-center gap-1 w-full py-2 px-3 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-black transition-colors"
        >
          {payment === "paid" ? "Track delivery" : "Pay now"} <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function BuyerWonAuctionsPage() {
  const { isDarkMode } = useTheme();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const won = MOCK_BUYER_AUCTIONS.filter((a) => a.status === "won");
  const pendingPay = won.filter((a) => a.paymentStatus !== "paid").length;
  const inDelivery = won.filter((a) => a.paymentStatus === "paid" && a.deliveryStatus !== "delivered").length;
  const spent = won.reduce((s, a) => s + (a.totalPaid ?? a.myBid), 0);

  const filtered = useMemo(() => {
    return won.filter((a) => {
      const matchTab = matchesTab(a, activeTab);
      const q = search.trim().toLowerCase();
      const matchSearch = !q || a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.seller.toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [won, activeTab, search]);

  const tabCount = (key: TabKey) => won.filter((a) => matchesTab(a, key)).length;
  const surface = isDarkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-slate-100 shadow-sm";
  const subtext = isDarkMode ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className={`sticky top-0 z-20 border-b backdrop-blur-xl ${isDarkMode ? "bg-slate-900/80 border-slate-700/50" : "bg-white/80 border-slate-100"}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDarkMode ? "bg-violet-500/10" : "bg-violet-50"}`}>
                <Trophy className="w-4 h-4 text-violet-500" />
              </div>
              <div>
                <h1 className="text-sm font-semibold">Won Auctions</h1>
                <p className={`text-xs ${subtext}`}>Pay for wins and track deliveries</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} w-full sm:w-64`}>
              <Search className={`w-3.5 h-3.5 flex-shrink-0 ${subtext}`} />
              <input
                type="text"
                placeholder="Search wins…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none placeholder-slate-500"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")}>
                  <X className={`w-3.5 h-3.5 ${subtext}`} />
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === t.key
                    ? "bg-violet-600 text-white"
                    : isDarkMode
                      ? "text-slate-400 hover:text-white hover:bg-slate-800"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                {t.label}
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === t.key ? "bg-white/20 text-white" : isDarkMode ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-500"
                }`}>
                  {tabCount(t.key)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Wins", value: String(won.length), color: "text-amber-400" },
            { label: "Awaiting payment", value: String(pendingPay), color: "text-amber-400" },
            { label: "In delivery", value: String(inDelivery), color: "text-sky-400" },
            { label: "Total spent", value: formatCurrency(spent), color: "text-violet-400" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, ...spring }}
              className={`rounded-2xl border p-4 ${surface}`}
            >
              <p className={`text-xs font-medium mb-1 ${subtext}`}>{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}>
              <Trophy className={`w-7 h-7 ${subtext}`} />
            </div>
            <p className="font-semibold text-sm">No won auctions found</p>
            <p className={`text-xs ${subtext}`}>Try a different filter or search term</p>
            <Link to="/auction" className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-700">
              Browse auctions
            </Link>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((a) => (
                <WonCard key={a._id} auction={a} isDarkMode={isDarkMode} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { scrollbar-width: none; }`}</style>
    </div>
  );
}
