import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  BarChart2,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flag,
  Flame,
  Gauge,
  Gavel,
  Heart,
  Search,
  ShoppingCart,
  Star,
  Tag,
  TrendingUp,
  Trophy,
  User,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { liveAuctionPath, MOCK_BUYER_AUCTIONS, type AuctionStatus, type BuyerAuction } from "../../../../../data/Buyerauctiondata";
import { MOCK_USER } from "../../../../../data/MOCK_USER";
import { useTheme } from "../../../../../hooks/useTheme";
import ToggleSwitch from "../../../ui/ToggleSwitch";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const spring = { type: "spring" as const, stiffness: 120, damping: 20 };

const formatCountdown = (endTime: string): string => {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}h left`;
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
};

const formatCurrency = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0 });
const isLeading = (a: BuyerAuction) => a.status === "ongoing" && a.myBid >= a.currentBid;
const isEndingSoon = (endTime: string) => new Date(endTime).getTime() - Date.now() < 3600000;
const instantPrice = (a: BuyerAuction) => Math.round(a.currentBid * 1.4);

// ─── Config ───────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  ongoing: { label: "Ongoing", icon: <Clock className="w-3.5 h-3.5" />, color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
  ended: { label: "Ended", icon: <XCircle className="w-3.5 h-3.5" />, color: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
  won: { label: "Won", icon: <Trophy className="w-3.5 h-3.5" />, color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  lost: { label: "Lost", icon: <XCircle className="w-3.5 h-3.5" />, color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
};

const PAYMENT_COLOR: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  processing: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  failed: "bg-rose-500/15 text-rose-400 border-rose-500/20",
};

type TabKey = "all" | AuctionStatus;
const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "All", icon: <BarChart2 className="w-3.5 h-3.5" /> },
  { key: "ongoing", label: "Ongoing", icon: <Flame className="w-3.5 h-3.5" /> },
  { key: "won", label: "Won", icon: <Trophy className="w-3.5 h-3.5" /> },
  { key: "lost", label: "Lost", icon: <XCircle className="w-3.5 h-3.5" /> },
  { key: "ended", label: "Ended", icon: <Clock className="w-3.5 h-3.5" /> },
];

const REPORT_REASONS = [
  "Suspicious or fake listing",
  "Counterfeit / not authentic",
  "Prohibited or illegal item",
  "Misleading description",
  "Suspected shill bidding",
];

const MOCK_REVIEWS = [
  { user: "Emily C.", rating: 5, text: "Item exactly as described, shipped fast. Great seller!" },
  { user: "Noah K.", rating: 4, text: "Good communication, minor delay in dispatch." },
  { user: "Aisha P.", rating: 5, text: "Authentic and well packaged. Would buy again." },
];

// ─── Reusable modal shell ─────────────────────────────────────────────────────
function Sheet({ children, onClose, surface }: { children: React.ReactNode; onClose: () => void; surface: string }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }} transition={{ type: "spring", stiffness: 380, damping: 30 }} className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${surface}`} onClick={(e) => e.stopPropagation()}>
        {children}
      </motion.div>
    </motion.div>
  );
}

// ─── Bid History Modal ────────────────────────────────────────────────────────
function BidHistoryModal({ auction, onClose, isDarkMode }: { auction: BuyerAuction; onClose: () => void; isDarkMode: boolean }) {
  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200";
  return (
    <Sheet onClose={onClose} isDarkMode={isDarkMode} surface={surface}>
      <div className={`flex items-center justify-between px-5 py-4 border-b ${isDarkMode ? "border-slate-700" : "border-slate-100"}`}>
        <div>
          <h3 className="font-bold text-sm">{auction.name}</h3>
          <p className={`text-xs mt-0.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Your bid history</p>
        </div>
        <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}><X className="w-4 h-4" /></button>
      </div>
      <div className="px-5 py-4 space-y-3 max-h-80 overflow-y-auto">
        {[...auction.bidHistory].reverse().map((bid, i) => {
          const isLatest = i === 0;
          const isMyBid = bid.amount === auction.myBid && isLatest;
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isLatest ? "bg-amber-400" : isDarkMode ? "bg-slate-600" : "bg-slate-300"}`} />
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <p className={`text-sm font-semibold ${isLatest ? "text-amber-400" : ""}`}>
                    {formatCurrency(bid.amount)}
                    {isMyBid && <span className="ml-2 text-xs font-normal text-amber-400/70">your bid</span>}
                  </p>
                  <p className={`text-xs ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                    {new Date(bid.time).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {isLatest && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 font-medium">Latest</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div className={`grid grid-cols-3 border-t ${isDarkMode ? "border-slate-700 bg-slate-800/50" : "border-slate-100 bg-slate-50"}`}>
        {[
          { label: "My Highest", value: formatCurrency(auction.myBid) },
          { label: "Current", value: formatCurrency(auction.currentBid) },
          { label: "Total Bids", value: String(auction.totalBids) },
        ].map(({ label, value }) => (
          <div key={label} className="px-4 py-3 text-center">
            <p className={`text-[10px] font-medium uppercase tracking-wide ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>{label}</p>
            <p className="text-sm font-bold mt-0.5">{value}</p>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

// ─── Bid Modal (place / auto / instant) ───────────────────────────────────────
function BidModal({ auction, onClose, isDarkMode, watched, alertOn, onToggleAlert }: {
  auction: BuyerAuction; onClose: () => void; isDarkMode: boolean; watched: boolean; alertOn: boolean; onToggleAlert: () => void;
}) {
  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const [mode, setMode] = useState<"place" | "auto" | "instant">(isLeading(auction) ? "place" : "place");
  const [amount, setAmount] = useState("");
  const inputCls = `w-full px-3 py-2.5 text-sm rounded-xl border outline-none transition-all ${isDarkMode ? "bg-slate-900 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"}`;

  const submit = () => {
    const n = Number(amount);
    if (mode === "instant") { toast.success(`Purchased "${auction.name}" for ${formatCurrency(instantPrice(auction))}`); onClose(); return; }
    if (!n || n <= auction.currentBid) { toast.error(`Enter more than the current bid (${formatCurrency(auction.currentBid)})`); return; }
    if (mode === "place") toast.success(`Bid of ${formatCurrency(n)} placed`);
    else toast.success(`Auto-bid set — we'll bid for you up to ${formatCurrency(n)}`);
    onClose();
  };

  const modes = [
    { key: "place" as const, label: "Place bid", icon: <Gavel className="w-3.5 h-3.5" /> },
    { key: "auto" as const, label: "Auto-bid", icon: <Gauge className="w-3.5 h-3.5" /> },
    { key: "instant" as const, label: "Instant buy", icon: <ShoppingCart className="w-3.5 h-3.5" /> },
  ];

  return (
    <Sheet onClose={onClose} isDarkMode={isDarkMode} surface={surface}>
      <div className={`flex items-center justify-between px-5 py-4 border-b ${isDarkMode ? "border-slate-700" : "border-slate-100"}`}>
        <div className="min-w-0">
          <h3 className="font-bold text-sm truncate">{auction.name}</h3>
          <p className={`text-xs mt-0.5 ${muted}`}>Current highest: <span className="font-semibold text-emerald-500">{formatCurrency(auction.currentBid)}</span> · {formatCountdown(auction.endTime)}</p>
        </div>
        <button onClick={onClose} className={`p-1.5 rounded-lg ${muted} ${isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}><X className="w-4 h-4" /></button>
      </div>

      {!isLeading(auction) && (
        <div className={`mx-5 mt-4 flex items-center gap-2 p-2.5 rounded-xl text-xs ${isDarkMode ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-600"}`}>
          <ArrowUpRight className="w-3.5 h-3.5" /> You've been outbid — raise your bid to lead again.
        </div>
      )}

      <div className="px-5 py-4">
        <div className={`grid grid-cols-3 gap-1.5 p-1 rounded-xl mb-4 ${isDarkMode ? "bg-slate-900" : "bg-slate-100"}`}>
          {modes.map((m) => (
            <button key={m.key} onClick={() => setMode(m.key)} className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${mode === m.key ? "bg-violet-600 text-white" : muted}`}>
              {m.icon} {m.label}
            </button>
          ))}
        </div>

        {mode === "instant" ? (
          <div className={`rounded-xl p-4 mb-4 ${isDarkMode ? "bg-slate-900" : "bg-slate-50"}`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${muted}`}>Buy it now</span>
              <span className="text-lg font-bold text-violet-500">{formatCurrency(instantPrice(auction))}</span>
            </div>
            <p className={`text-xs mt-1 ${muted}`}>Skip the auction and secure this item immediately.</p>
          </div>
        ) : (
          <div className="mb-4">
            <label className={`text-xs font-medium ${muted}`}>{mode === "auto" ? "Your maximum bid" : "Your bid amount"}</label>
            <input value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} placeholder={formatCurrency(auction.currentBid + 100)} className={`${inputCls} mt-1`} />
            <p className={`text-xs mt-1.5 ${muted}`}>
              {mode === "auto" ? "We'll automatically bid the minimum needed to keep you in the lead, up to this amount." : `Must be higher than ${formatCurrency(auction.currentBid)}.`}
            </p>
          </div>
        )}

        {watched && (
          <div className={`flex items-center justify-between p-3 rounded-xl mb-4 ${isDarkMode ? "bg-slate-900" : "bg-slate-50"}`}>
            <div className="flex items-center gap-2">
              <Bell className={`w-4 h-4 ${muted}`} />
              <span className="text-xs font-medium">Price alerts for this auction</span>
            </div>
            <ToggleSwitch checked={alertOn} onChange={onToggleAlert} isDarkMode={isDarkMode} />
          </div>
        )}

        <button onClick={submit} className={`w-full py-3 rounded-xl text-sm font-bold text-white transition-colors flex items-center justify-center gap-1.5 ${mode === "instant" ? "bg-violet-600 hover:bg-violet-700" : mode === "auto" ? "bg-sky-500 hover:bg-sky-600" : "bg-emerald-500 hover:bg-emerald-600"}`}>
          {mode === "instant" ? <><Zap className="w-4 h-4" /> Buy now</> : mode === "auto" ? <><Gauge className="w-4 h-4" /> Set auto-bid</> : <><Gavel className="w-4 h-4" /> Place bid</>}
        </button>
      </div>
    </Sheet>
  );
}

// ─── Report Modal ─────────────────────────────────────────────────────────────
function ReportModal({ auction, onClose, isDarkMode }: { auction: BuyerAuction; onClose: () => void; isDarkMode: boolean }) {
  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [notes, setNotes] = useState("");
  return (
    <Sheet onClose={onClose} isDarkMode={isDarkMode} surface={surface}>
      <div className={`flex items-center justify-between px-5 py-4 border-b ${isDarkMode ? "border-slate-700" : "border-slate-100"}`}>
        <div className="flex items-center gap-2"><Flag className="w-4 h-4 text-rose-500" /><h3 className="font-bold text-sm">Report auction</h3></div>
        <button onClick={onClose} className={`p-1.5 rounded-lg ${muted} ${isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}><X className="w-4 h-4" /></button>
      </div>
      <div className="px-5 py-4">
        <p className={`text-xs mb-3 ${muted}`}>Reporting <span className="font-semibold">{auction.name}</span> by {auction.seller}</p>
        <div className="space-y-1.5 mb-4">
          {REPORT_REASONS.map((r) => (
            <button key={r} onClick={() => setReason(r)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-colors border ${reason === r ? "border-violet-500 " + (isDarkMode ? "bg-violet-500/10" : "bg-violet-50") : isDarkMode ? "border-slate-700 hover:bg-slate-700/40" : "border-slate-200 hover:bg-slate-50"}`}>
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${reason === r ? "border-violet-500" : isDarkMode ? "border-slate-600" : "border-slate-300"}`}>{reason === r && <span className="w-2 h-2 rounded-full bg-violet-500" />}</span>
              {r}
            </button>
          ))}
        </div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Add details (optional)…" className={`w-full px-3 py-2.5 text-sm rounded-xl border outline-none resize-none mb-4 ${isDarkMode ? "bg-slate-900 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"}`} />
        <button onClick={() => { toast.success("Report submitted — our team will review it"); onClose(); }} className="w-full py-3 rounded-xl text-sm font-bold bg-rose-500 hover:bg-rose-600 text-white transition-colors">Submit report</button>
      </div>
    </Sheet>
  );
}

// ─── Seller Reviews Modal ─────────────────────────────────────────────────────
function SellerReviewsModal({ auction, onClose, isDarkMode }: { auction: BuyerAuction; onClose: () => void; isDarkMode: boolean }) {
  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  return (
    <Sheet onClose={onClose} isDarkMode={isDarkMode} surface={surface}>
      <div className={`flex items-center justify-between px-5 py-4 border-b ${isDarkMode ? "border-slate-700" : "border-slate-100"}`}>
        <div className="flex items-center gap-2"><User className="w-4 h-4 text-violet-500" /><h3 className="font-bold text-sm">{auction.seller}</h3></div>
        <button onClick={onClose} className={`p-1.5 rounded-lg ${muted} ${isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}><X className="w-4 h-4" /></button>
      </div>
      <div className="px-5 py-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.round(auction.sellerRating) ? "text-amber-400 fill-amber-400" : isDarkMode ? "text-slate-600" : "text-slate-300"}`} />)}</div>
          <span className="text-sm font-bold">{auction.sellerRating}</span>
          <span className={`text-xs ${muted}`}>· {MOCK_REVIEWS.length * 47} reviews</span>
        </div>
        <div className="space-y-3 max-h-72 overflow-y-auto">
          {MOCK_REVIEWS.map((r, i) => (
            <div key={i} className={`p-3 rounded-xl ${isDarkMode ? "bg-slate-900" : "bg-slate-50"}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold">{r.user}</span>
                <div className="flex items-center gap-0.5">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className={`w-3 h-3 ${j < r.rating ? "text-amber-400 fill-amber-400" : isDarkMode ? "text-slate-600" : "text-slate-300"}`} />)}</div>
              </div>
              <p className={`text-xs ${muted}`}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Sheet>
  );
}

// ─── Auction Card ─────────────────────────────────────────────────────────────
function AuctionCard({ auction, isDarkMode, watched, onViewHistory, onWatch, onReport, onSellerReviews }: {
  auction: BuyerAuction; isDarkMode: boolean; watched: boolean;
  onViewHistory: (a: BuyerAuction) => void; onWatch: (a: BuyerAuction) => void; onReport: (a: BuyerAuction) => void; onSellerReviews: (a: BuyerAuction) => void;
}) {
  const statusCfg = STATUS_CONFIG[auction.status];
  const leading = isLeading(auction);
  const endingSoon = auction.status === "ongoing" && isEndingSoon(auction.endTime);
  const cardBg = isDarkMode ? "bg-slate-800 border-slate-700 hover:border-slate-600" : "bg-white border-slate-100 hover:border-slate-300";
  const liveHref = liveAuctionPath(auction);
  const primaryHref =
    auction.status === "ongoing" ? liveHref :
    auction.status === "won" ? `/${MOCK_USER.role}/won-auctions/${auction._id}` :
    undefined;

  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300, damping: 28 }} className={`group rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${cardBg}`}>
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        {primaryHref ? (
          <Link to={primaryHref} className="block h-full">
            <img src={auction.image} alt={auction.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </Link>
        ) : (
          <img src={auction.image} alt={auction.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        <div className="absolute top-3 left-3 pointer-events-none">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-sm ${statusCfg.color}`}>{statusCfg.icon}{statusCfg.label}</span>
        </div>

        {/* Watch + report */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button onClick={() => onReport(auction)} title="Report" className="w-7 h-7 rounded-full flex items-center justify-center bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-colors"><Flag className="w-3.5 h-3.5 text-white" /></button>
          <button onClick={() => onWatch(auction)} title={watched ? "Remove from watchlist" : "Save to watchlist"} className="w-7 h-7 rounded-full flex items-center justify-center bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-colors"><Heart className={`w-3.5 h-3.5 ${watched ? "fill-rose-500 text-rose-500" : "text-white"}`} /></button>
        </div>

        {/* Leading / outbid */}
        {auction.status === "ongoing" && (
          <div className="absolute bottom-3 left-3 pointer-events-none">
            {leading ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/90 text-white backdrop-blur-sm"><TrendingUp className="w-3 h-3" /> Leading</span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold bg-rose-500/90 text-white backdrop-blur-sm"><ArrowUpRight className="w-3 h-3" /> Outbid</span>
            )}
          </div>
        )}
        {auction.status === "won" && (
          <div className="absolute bottom-3 left-3 pointer-events-none"><span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold bg-amber-500/90 text-white backdrop-blur-sm"><Trophy className="w-3 h-3" /> Winner</span></div>
        )}
        {auction.status === "ongoing" && (
          <div className={`pointer-events-none absolute bottom-3 right-3 text-xs font-bold px-2.5 py-1 rounded-lg ${endingSoon ? "bg-rose-500 text-white animate-pulse" : "bg-black/50 text-white backdrop-blur-sm"}`}>{formatCountdown(auction.endTime)}</div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="min-w-0 mb-3">
          {primaryHref ? (
            <Link to={primaryHref}>
              <h3 className="font-bold text-sm leading-tight line-clamp-2 hover:text-violet-500">{auction.name}</h3>
            </Link>
          ) : (
            <h3 className="font-bold text-sm leading-tight line-clamp-2">{auction.name}</h3>
          )}
          <div className="flex items-center gap-1.5 mt-1">
            <Tag className={`w-3 h-3 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`} />
            <span className={`text-xs ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>{auction.category}</span>
          </div>
        </div>

        <div className={`rounded-xl p-3 mb-3 ${isDarkMode ? "bg-slate-700/50" : "bg-slate-50"}`}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className={`text-[10px] font-medium uppercase tracking-wide mb-0.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>My Bid</p>
              <p className={`text-sm font-bold ${leading ? "text-emerald-400" : auction.status === "won" ? "text-amber-400" : ""}`}>{formatCurrency(auction.myBid)}</p>
            </div>
            <div>
              <p className={`text-[10px] font-medium uppercase tracking-wide mb-0.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>{auction.status === "ongoing" ? "Current" : "Final"}</p>
              <p className="text-sm font-bold">{formatCurrency(auction.currentBid)}</p>
            </div>
          </div>
        </div>

        {/* Seller — clickable for reviews */}
        <button onClick={() => onSellerReviews(auction)} className="w-full flex items-center gap-1.5 mb-3 group/seller">
          <User className={`w-3 h-3 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`} />
          <span className={`text-xs group-hover/seller:text-violet-500 transition-colors ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{auction.seller}</span>
          <Star className="w-3 h-3 text-amber-400 fill-amber-400 ml-auto" />
          <span className="text-xs font-medium text-amber-400">{auction.sellerRating}</span>
        </button>

        {auction.status === "won" && auction.paymentStatus && (
          <div className="mb-3">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${PAYMENT_COLOR[auction.paymentStatus]}`}>
              {auction.paymentStatus === "paid" ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
              Payment: {auction.paymentStatus.charAt(0).toUpperCase() + auction.paymentStatus.slice(1)}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={() => onViewHistory(auction)} className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-colors ${isDarkMode ? "border-slate-600 hover:bg-slate-700 text-slate-300" : "border-slate-200 hover:bg-slate-50 text-slate-600"}`}>Bid History</button>

          {auction.status === "won" && (
            <Link to={`/${MOCK_USER.role}/won-auctions/${auction._id}`} className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-black text-center transition-colors flex items-center justify-center gap-1">Manage <ChevronRight className="w-3 h-3" /></Link>
          )}
          {auction.status === "ongoing" && (
            <Link to={liveHref} className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-white text-center transition-colors flex items-center justify-center gap-1 ${leading ? "bg-violet-600 hover:bg-violet-700" : "bg-sky-500 hover:bg-sky-600"}`}>{leading ? "Live bid" : "Bid again"} <Gavel className="w-3 h-3" /></Link>
          )}
          {auction.status === "lost" && (
            <Link to="/auction" className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-600 hover:bg-slate-500 text-white text-center transition-colors">Find Similar</Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BuyerManageAuctions() {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [historyTarget, setHistoryTarget] = useState<BuyerAuction | null>(null);
  const [reportTarget, setReportTarget] = useState<BuyerAuction | null>(null);
  const [reviewsTarget, setReviewsTarget] = useState<BuyerAuction | null>(null);
  const [watchlist, setWatchlist] = useState<Set<string>>(() => new Set(["a1", "a3"]));

  const auctions = MOCK_BUYER_AUCTIONS;

  const stats = {
    total: auctions.length,
    ongoing: auctions.filter((a) => a.status === "ongoing").length,
    won: auctions.filter((a) => a.status === "won").length,
    spent: auctions.filter((a) => a.status === "won").reduce((s, a) => s + (a.totalPaid ?? a.myBid), 0),
  };

  const filtered = useMemo(() => {
    return auctions.filter((a) => {
      const matchTab = activeTab === "all" || a.status === activeTab;
      const matchSearch = !search.trim() || a.name.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [auctions, activeTab, search]);

  const tabCount = (key: TabKey) => (key === "all" ? auctions.length : auctions.filter((a) => a.status === key).length);

  const surface = isDarkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-slate-100 shadow-sm";
  const subtext = isDarkMode ? "text-slate-400" : "text-slate-500";

  const toggleWatch = (a: BuyerAuction) => {
    setWatchlist((prev) => {
      const next = new Set(prev);
      if (next.has(a._id)) { next.delete(a._id); toast.error(`Removed "${a.name}" from watchlist`); }
      else { next.add(a._id); toast.success(`Saved "${a.name}" to watchlist`); }
      return next;
    });
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px", borderRadius: "10px", background: isDarkMode ? "#1e293b" : "#fff", color: isDarkMode ? "#f1f5f9" : "#0f172a", border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0" } }} />
      {/* ── Header ── */}
      <div className={`sticky top-0 z-20 border-b backdrop-blur-xl ${isDarkMode ? "bg-slate-900/80 border-slate-700/50" : "bg-white/80 border-slate-100"}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDarkMode ? "bg-violet-500/10" : "bg-violet-50"}`}><Gavel className="w-4 h-4 text-violet-500" /></div>
              <div>
                <h1 className="text-sm font-semibold">My Auctions</h1>
                <p className={`text-xs ${subtext}`}>Track every auction you've participated in</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"} w-full sm:w-64`}>
              <Search className={`w-3.5 h-3.5 flex-shrink-0 ${subtext}`} />
              <input type="text" placeholder="Search auctions…" value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm outline-none placeholder-slate-500" />
              {search && <button onClick={() => setSearch("")}><X className={`w-3.5 h-3.5 ${subtext}`} /></button>}
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${activeTab === t.key ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`}>
                {t.icon}{t.label}
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === t.key ? "bg-white/20 text-white" : isDarkMode ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-500"}`}>{tabCount(t.key)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Participated", value: String(stats.total), color: "text-sky-400" },
            { label: "Ongoing", value: String(stats.ongoing), color: "text-emerald-400" },
            { label: "Won", value: String(stats.won), color: "text-amber-400" },
            { label: "Total Spent", value: formatCurrency(stats.spent), color: "text-violet-400" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, ...spring }} className={`rounded-2xl border p-4 ${surface}`}>
              <p className={`text-xs font-medium mb-1 ${subtext}`}>{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}><Gavel className={`w-7 h-7 ${subtext}`} /></div>
            <p className="font-semibold text-sm">No auctions found</p>
            <p className={`text-xs ${subtext}`}>Try a different filter or search term</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((a) => (
                <AuctionCard key={a._id} auction={a} isDarkMode={isDarkMode} watched={watchlist.has(a._id)} onViewHistory={setHistoryTarget} onWatch={toggleWatch} onReport={setReportTarget} onSellerReviews={setReviewsTarget} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {historyTarget && <BidHistoryModal auction={historyTarget} onClose={() => setHistoryTarget(null)} isDarkMode={isDarkMode} />}
        {reportTarget && <ReportModal auction={reportTarget} onClose={() => setReportTarget(null)} isDarkMode={isDarkMode} />}
        {reviewsTarget && <SellerReviewsModal auction={reviewsTarget} onClose={() => setReviewsTarget(null)} isDarkMode={isDarkMode} />}
      </AnimatePresence>

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { scrollbar-width: none; }`}</style>
    </div>
  );
}
