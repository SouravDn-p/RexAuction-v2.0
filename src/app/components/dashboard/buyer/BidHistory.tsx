import { AnimatePresence, motion } from "framer-motion";
import {
  Clock,
  Gavel,
  Search,
  Star,
  Tag,
  Trophy,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MOCK_BUYER_AUCTIONS, type AuctionStatus, type BuyerAuction } from "../../../../data/Buyerauctiondata";
import { MOCK_USER } from "../../../../data/MOCK_USER";
import { useTheme } from "../../../../hooks/useTheme";

const spring = { type: "spring" as const, stiffness: 120, damping: 20 };
const formatCurrency = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0 });
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const STATUS_CONFIG: Record<AuctionStatus, { label: string; color: string; icon: React.ReactNode }> = {
  ongoing: { label: "Ongoing", color: "bg-sky-500/15 text-sky-400 border-sky-500/20", icon: <Clock className="w-3.5 h-3.5" /> },
  ended: { label: "Ended", color: "bg-slate-500/15 text-slate-400 border-slate-500/20", icon: <Clock className="w-3.5 h-3.5" /> },
  won: { label: "Won", color: "bg-amber-500/15 text-amber-400 border-amber-500/20", icon: <Trophy className="w-3.5 h-3.5" /> },
  lost: { label: "Lost", color: "bg-rose-500/15 text-rose-400 border-rose-500/20", icon: <XCircle className="w-3.5 h-3.5" /> },
};

type TabKey = "all" | AuctionStatus;
const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "ongoing", label: "Ongoing" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
  { key: "ended", label: "Ended" },
];

function BidCard({ auction, isDarkMode }: { auction: BuyerAuction; isDarkMode: boolean }) {
  const statusCfg = STATUS_CONFIG[auction.status];
  const leading = auction.status === "ongoing" && auction.myBid >= auction.currentBid;
  const lastBid = auction.bidHistory[auction.bidHistory.length - 1];

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
        <span className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-sm ${statusCfg.color}`}>
          {statusCfg.icon} {statusCfg.label}
        </span>
        {auction.status === "ongoing" && (
          <span className={`absolute bottom-3 left-3 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold text-white ${leading ? "bg-emerald-500/90" : "bg-rose-500/90"}`}>
            {leading ? "Leading" : "Outbid"}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-sm leading-tight line-clamp-2 mb-1">{auction.name}</h3>
        <div className="flex items-center gap-1.5 mb-3">
          <Tag className={`w-3 h-3 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`} />
          <span className={`text-xs ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>{auction.category}</span>
        </div>

        <div className={`rounded-xl p-3 mb-3 ${isDarkMode ? "bg-slate-700/50" : "bg-slate-50"}`}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className={`text-[10px] font-medium uppercase tracking-wide mb-0.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>My bid</p>
              <p className={`text-sm font-bold ${leading ? "text-emerald-400" : auction.status === "won" ? "text-amber-400" : ""}`}>
                {formatCurrency(auction.myBid)}
              </p>
            </div>
            <div>
              <p className={`text-[10px] font-medium uppercase tracking-wide mb-0.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                {auction.status === "ongoing" ? "Current" : "Final"}
              </p>
              <p className="text-sm font-bold">{formatCurrency(auction.currentBid)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-3">
          <User className={`w-3 h-3 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`} />
          <span className={`text-xs ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{auction.seller}</span>
          <Star className="w-3 h-3 text-amber-400 fill-amber-400 ml-auto" />
          <span className="text-xs font-medium text-amber-400">{auction.sellerRating}</span>
        </div>

        <p className={`text-[11px] mb-3 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
          {auction.bidHistory.length} bid{auction.bidHistory.length === 1 ? "" : "s"} · last {lastBid ? formatDate(lastBid.time) : formatDate(auction.endTime)}
        </p>

        {auction.status === "won" ? (
          <Link
            to={`/${MOCK_USER.role}/won-auctions/${auction._id}`}
            className="flex items-center justify-center w-full py-2 px-3 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-black transition-colors"
          >
            Manage win
          </Link>
        ) : auction.status === "ongoing" ? (
          <Link
            to="/buyer/status"
            className="flex items-center justify-center w-full py-2 px-3 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-colors"
          >
            View auction
          </Link>
        ) : (
          <Link
            to="/auction"
            className={`flex items-center justify-center w-full py-2 px-3 rounded-xl text-xs font-semibold border transition-colors ${
              isDarkMode ? "border-slate-600 hover:bg-slate-700 text-slate-300" : "border-slate-200 hover:bg-slate-50 text-slate-600"
            }`}
          >
            Find similar
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export default function BidHistory() {
  const { isDarkMode } = useTheme();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const auctions = MOCK_BUYER_AUCTIONS;
  const won = auctions.filter((a) => a.status === "won");
  const lost = auctions.filter((a) => a.status === "lost");
  const highest = Math.max(0, ...auctions.map((a) => a.myBid));
  const totalBids = auctions.reduce((s, a) => s + a.bidHistory.length, 0);

  const filtered = useMemo(() => {
    return auctions.filter((a) => {
      const matchTab = activeTab === "all" || a.status === activeTab;
      const q = search.trim().toLowerCase();
      const matchSearch = !q || a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [auctions, activeTab, search]);

  const tabCount = (key: TabKey) => (key === "all" ? auctions.length : auctions.filter((a) => a.status === key).length);
  const surface = isDarkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-slate-100 shadow-sm";
  const subtext = isDarkMode ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className={`sticky top-0 z-20 border-b backdrop-blur-xl ${isDarkMode ? "bg-slate-900/80 border-slate-700/50" : "bg-white/80 border-slate-100"}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDarkMode ? "bg-violet-500/10" : "bg-violet-50"}`}>
                <Gavel className="w-4 h-4 text-violet-500" />
              </div>
              <div>
                <h1 className="text-sm font-semibold">Bid History</h1>
                <p className={`text-xs ${subtext}`}>Every auction you have bid on</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} w-full sm:w-64`}>
              <Search className={`w-3.5 h-3.5 flex-shrink-0 ${subtext}`} />
              <input
                type="text"
                placeholder="Search bids…"
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
            { label: "Bids placed", value: String(totalBids), color: "text-sky-400" },
            { label: "Won", value: String(won.length), color: "text-amber-400" },
            { label: "Lost", value: String(lost.length), color: "text-rose-400" },
            { label: "Highest bid", value: formatCurrency(highest), color: "text-violet-400" },
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
              <Gavel className={`w-7 h-7 ${subtext}`} />
            </div>
            <p className="font-semibold text-sm">No bids found</p>
            <p className={`text-xs ${subtext}`}>Try a different filter or search term</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((a) => (
                <BidCard key={a._id} auction={a} isDarkMode={isDarkMode} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { scrollbar-width: none; }`}</style>
    </div>
  );
}
