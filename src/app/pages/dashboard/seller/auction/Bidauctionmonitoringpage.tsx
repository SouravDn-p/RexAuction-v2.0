import { AnimatePresence, motion } from "framer-motion";
import {
    Bell,
    Crown,
    Eye,
    Gavel,
    Radio,
    Search,
    Settings2,
    ShieldAlert,
    ShieldCheck,
    TimerReset,
    Users,
    X,
    Zap
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "../../../../../hooks/useTheme";
import ToggleSwitch from "../../../../components/ui/ToggleSwitch";

// ─── Types ─────────────────────────────────────────────────────────────────

interface Bid {
  id: string;
  bidder: { name: string; photo: string };
  amount: number;
  time: string;
  flagged?: boolean;
  rejected?: boolean;
}

interface Notification {
  id: string;
  type: "new_bid" | "ending_soon" | "extended" | "reserve_met";
  text: string;
  time: string;
}

interface LiveAuction {
  _id: string;
  title: string;
  coverImage: string;
  startPrice: number;
  reservePrice: number;
  currentBid: number;
  bidderCount: number;
  endsAt: number; // epoch ms
  softCloseEnabled: boolean;
  softCloseWindowMinutes: number;
  softCloseExtensionMinutes: number;
  autoAcceptWinner: boolean;
  bids: Bid[];
}

const BIDDER_POOL = [
  { name: "Liam Torres", photo: "https://ui-avatars.com/api/?name=Liam+Torres&background=b45309&color=fff" },
  { name: "Noah Kim", photo: "https://ui-avatars.com/api/?name=Noah+Kim&background=0369a1&color=fff" },
  { name: "Zara Nguyen", photo: "https://ui-avatars.com/api/?name=Zara+Nguyen&background=be185d&color=fff" },
  { name: "Aisha Patel", photo: "https://ui-avatars.com/api/?name=Aisha+Patel&background=065f46&color=fff" },
  { name: "Jordan Lee", photo: "https://ui-avatars.com/api/?name=Jordan+Lee&background=0d9488&color=fff" },
];

const now = Date.now();

const MOCK_LIVE: LiveAuction[] = [
  {
    _id: "la1", title: "Antique Pocket Watch — 18k Gold", coverImage: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=200&q=80",
    startPrice: 600, reservePrice: 900, currentBid: 940, bidderCount: 8, endsAt: now + 1000 * 60 * 42,
    softCloseEnabled: true, softCloseWindowMinutes: 5, softCloseExtensionMinutes: 5, autoAcceptWinner: true,
    bids: [
      { id: "b1", bidder: BIDDER_POOL[0], amount: 940, time: "2m ago" },
      { id: "b2", bidder: BIDDER_POOL[3], amount: 900, time: "9m ago" },
      { id: "b3", bidder: BIDDER_POOL[0], amount: 870, time: "14m ago" },
      { id: "b4", bidder: BIDDER_POOL[1], amount: 830, time: "22m ago" },
      { id: "b5", bidder: BIDDER_POOL[3], amount: 780, time: "40m ago" },
      { id: "b6", bidder: BIDDER_POOL[4], amount: 720, time: "1h ago", flagged: true },
    ],
  },
  {
    _id: "la2", title: "Hand-carved Rosewood Chess Set", coverImage: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=200&q=80",
    startPrice: 120, reservePrice: 150, currentBid: 95, bidderCount: 3, endsAt: now + 1000 * 60 * 60 * 26,
    softCloseEnabled: true, softCloseWindowMinutes: 3, softCloseExtensionMinutes: 3, autoAcceptWinner: false,
    bids: [
      { id: "b1", bidder: BIDDER_POOL[2], amount: 95, time: "1h ago" },
      { id: "b2", bidder: BIDDER_POOL[1], amount: 80, time: "3h ago" },
      { id: "b3", bidder: BIDDER_POOL[2], amount: 65, time: "5h ago" },
    ],
  },
  {
    _id: "la3", title: "Signed First-Edition Novel Set", coverImage: "https://images.unsplash.com/photo-1521123845560-14093637aa7d?w=200&q=80",
    startPrice: 300, reservePrice: 400, currentBid: 410, bidderCount: 11, endsAt: now + 1000 * 60 * 8,
    softCloseEnabled: true, softCloseWindowMinutes: 5, softCloseExtensionMinutes: 10, autoAcceptWinner: true,
    bids: [
      { id: "b1", bidder: BIDDER_POOL[1], amount: 410, time: "1m ago" },
      { id: "b2", bidder: BIDDER_POOL[4], amount: 395, time: "4m ago" },
      { id: "b3", bidder: BIDDER_POOL[0], amount: 370, time: "11m ago" },
      { id: "b4", bidder: BIDDER_POOL[1], amount: 350, time: "20m ago" },
    ],
  },
  {
    _id: "la4", title: "Restored Turntable — Technics SL-1200", coverImage: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=200&q=80",
    startPrice: 350, reservePrice: 500, currentBid: 350, bidderCount: 1, endsAt: now + 1000 * 60 * 60 * 4,
    softCloseEnabled: false, softCloseWindowMinutes: 5, softCloseExtensionMinutes: 5, autoAcceptWinner: false,
    bids: [{ id: "b1", bidder: BIDDER_POOL[3], amount: 350, time: "2h ago" }],
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "ending_soon", text: '"Signed First-Edition Novel Set" ends in 8 minutes', time: "1m ago" },
  { id: "n2", type: "new_bid", text: 'New bid of $940 on "Antique Pocket Watch — 18k Gold"', time: "2m ago" },
  { id: "n3", type: "extended", text: '"Signed First-Edition Novel Set" extended by 10 minutes (soft-close)', time: "4m ago" },
  { id: "n4", type: "reserve_met", text: 'Reserve price met on "Antique Pocket Watch — 18k Gold"', time: "9m ago" },
  { id: "n5", type: "new_bid", text: 'New bid of $95 on "Hand-carved Rosewood Chess Set"', time: "1h ago" },
];

const NOTIF_ICON: Record<Notification["type"], React.JSX.Element> = {
  new_bid: <Gavel className="w-3.5 h-3.5 text-violet-500" />,
  ending_soon: <TimerReset className="w-3.5 h-3.5 text-amber-500" />,
  extended: <Zap className="w-3.5 h-3.5 text-sky-500" />,
  reserve_met: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />,
};

function formatCountdown(ms: number) {
  if (ms <= 0) return "Ended";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function BidAuctionMonitoringPage() {
  const { isDarkMode } = useTheme();

  const [auctions, setAuctions] = useState<LiveAuction[]>(MOCK_LIVE);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showNotifs, setShowNotifs] = useState(false);
  const [tick, setTick] = useState(0);

  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const divider = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const panel = isDarkMode ? "bg-slate-700/40" : "bg-slate-50";
  const inputCls = `w-full px-3 py-2 text-sm rounded-xl border outline-none transition-all ${
    isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
  }`;

  const selected = useMemo(() => auctions.find(a => a._id === selectedId) || null, [auctions, selectedId]);

  // tick every second for live countdowns
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // simulate live incoming bids while a monitor modal is open
  const bidTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!selected) { if (bidTimer.current) clearInterval(bidTimer.current); return; }
    bidTimer.current = setInterval(() => {
      setAuctions(prev => prev.map(a => {
        if (a._id !== selected._id) return a;
        if (Math.random() > 0.55) return a; // not every tick
        const bidder = BIDDER_POOL[Math.floor(Math.random() * BIDDER_POOL.length)];
        const newAmount = a.currentBid + Math.max(5, Math.round(a.currentBid * 0.02));
        const newBid: Bid = { id: `b-${Date.now()}`, bidder, amount: newAmount, time: "just now" };
        const remaining = a.endsAt - Date.now();
        let newEndsAt = a.endsAt;
        let extended = false;
        if (a.softCloseEnabled && remaining < a.softCloseWindowMinutes * 60000) {
          newEndsAt = Date.now() + a.softCloseExtensionMinutes * 60000;
          extended = true;
        }
        setNotifications(np => [
          { id: `n-${Date.now()}`, type: "new_bid", text: `New bid of $${newAmount} on "${a.title}"`, time: "just now" },
          ...(extended ? [{ id: `n-${Date.now()}-ext`, type: "extended" as const, text: `"${a.title}" extended by ${a.softCloseExtensionMinutes} minutes (soft-close)`, time: "just now" }] : []),
          ...np,
        ]);
        if (extended) toast.success(`Anti-snipe triggered — "${a.title}" extended`, { icon: "⏱️" });
        return { ...a, currentBid: newAmount, bidderCount: a.bidderCount + (Math.random() > 0.7 ? 1 : 0), endsAt: newEndsAt, bids: [newBid, ...a.bids] };
      }));
    }, 6000);
    return () => { if (bidTimer.current) clearInterval(bidTimer.current); };
  }, [selected?._id]);

  const filtered = useMemo(() => auctions.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())), [auctions, searchQuery]);

  const reserveNotMetCount = auctions.filter(a => a.currentBid < a.reservePrice).length;
  const totalBidders = auctions.reduce((s, a) => s + a.bidderCount, 0);

  const stats = [
    { label: "Live Auctions", value: auctions.length, icon: <Radio className="w-4 h-4" />, color: "text-emerald-400", bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50", bar: "from-emerald-500 to-teal-500" },
    { label: "Total Bidders", value: totalBidders, icon: <Users className="w-4 h-4" />, color: "text-violet-400", bg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50", bar: "from-violet-500 to-blue-500" },
    { label: "Reserve Not Met", value: reserveNotMetCount, icon: <ShieldAlert className="w-4 h-4" />, color: "text-amber-400", bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50", bar: "from-amber-500 to-orange-500" },
    { label: "Notifications", value: notifications.length, icon: <Bell className="w-4 h-4" />, color: "text-sky-400", bg: isDarkMode ? "bg-sky-500/10" : "bg-sky-50", bar: "from-sky-500 to-blue-400" },
  ];

  // ── settings & actions ──────────────────────────────────────────────────
  const toggleSoftClose = (a: LiveAuction) => setAuctions(prev => prev.map(x => x._id === a._id ? { ...x, softCloseEnabled: !x.softCloseEnabled } : x));
  const updateSoftCloseWindow = (a: LiveAuction, v: number) => setAuctions(prev => prev.map(x => x._id === a._id ? { ...x, softCloseWindowMinutes: v } : x));
  const updateSoftCloseExtension = (a: LiveAuction, v: number) => setAuctions(prev => prev.map(x => x._id === a._id ? { ...x, softCloseExtensionMinutes: v } : x));
  const toggleAutoAccept = (a: LiveAuction) => setAuctions(prev => prev.map(x => x._id === a._id ? { ...x, autoAcceptWinner: !x.autoAcceptWinner } : x));

  const extendNow = (a: LiveAuction) => {
    setAuctions(prev => prev.map(x => x._id === a._id ? { ...x, endsAt: x.endsAt + x.softCloseExtensionMinutes * 60000 } : x));
    setNotifications(np => [{ id: `n-${Date.now()}`, type: "extended", text: `"${a.title}" manually extended by ${a.softCloseExtensionMinutes} minutes`, time: "just now" }, ...np]);
    toast.success(`Extended "${a.title}" by ${a.softCloseExtensionMinutes} minutes`);
  };

  const rejectBid = (a: LiveAuction, bid: Bid) => {
    if (!window.confirm(`Reject the $${bid.amount} bid from ${bid.bidder.name}? They'll be notified and the next highest bid becomes current.`)) return;
    setAuctions(prev => prev.map(x => {
      if (x._id !== a._id) return x;
      const remaining = x.bids.map(b => b.id === bid.id ? { ...b, rejected: true } : b);
      const activeBids = remaining.filter(b => !b.rejected);
      const newCurrent = activeBids.length > 0 ? activeBids[0].amount : x.startPrice;
      return { ...x, bids: remaining, currentBid: newCurrent };
    }));
    toast.error(`Bid from ${bid.bidder.name} rejected as suspicious`);
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px", borderRadius: "10px", background: isDarkMode ? "#1e293b" : "#fff", color: isDarkMode ? "#f1f5f9" : "#0f172a", border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0" } }} />

      {/* Header */}
      <div className={`sticky top-0 z-20 border-b backdrop-blur-xl ${isDarkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-slate-200"}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" /></span>
              Bid & Auction Monitoring
            </h1>
            <p className={`text-xs mt-0.5 ${muted}`}>Live bids, bidder activity and anti-sniping controls</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`relative w-full sm:w-64 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search live auctions..." className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border outline-none ${isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500" : "bg-slate-50 border-slate-200 placeholder-slate-400"}`} />
            </div>
            <div className="relative">
              <button onClick={() => setShowNotifs(s => !s)} className={`relative p-2.5 rounded-xl border ${isDarkMode ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center">{notifications.length}</span>}
              </button>
              <AnimatePresence>
                {showNotifs && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className={`absolute right-0 mt-2 w-80 rounded-2xl border shadow-xl z-30 max-h-96 overflow-y-auto ${surface}`}>
                    <div className={`px-4 py-3 border-b ${divider}`}><p className={`text-sm font-semibold ${strong}`}>Notifications</p></div>
                    <div className="divide-y divide-slate-700/40">
                      {notifications.map(n => (
                        <div key={n.id} className="flex items-start gap-2.5 px-4 py-3">
                          {NOTIF_ICON[n.type]}
                          <div className="min-w-0"><p className={`text-xs ${strong}`}>{n.text}</p><p className={`text-[10px] ${muted}`}>{n.time}</p></div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats */}
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

        {/* Live auctions list */}
        <div className={`rounded-2xl border ${surface}`}>
          <div className={`px-5 py-4 border-b ${divider}`}><p className={`text-sm font-semibold ${strong}`}>Live auctions</p></div>
          {filtered.length > 0 ? (
            <div className="divide-y divide-slate-700/40">
              {filtered.map((a, i) => {
                const reserveMet = a.currentBid >= a.reservePrice;
                const remaining = a.endsAt - Date.now();
                const endingSoon = remaining < 15 * 60000;
                return (
                  <motion.div key={a._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={`flex flex-col md:flex-row md:items-center gap-3 md:gap-4 px-5 py-4 ${isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-slate-50"} transition-colors`}>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img src={a.coverImage} alt={a.title} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${strong}`}>{a.title}</p>
                        <p className={`text-xs truncate ${muted}`}>${a.currentBid} · {a.bidderCount} bidders · {a.bids.filter(b => !b.rejected).length} bids</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${reserveMet ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" : "bg-amber-500/15 text-amber-400 border-amber-500/20"}`}>
                        {reserveMet ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />} Reserve {reserveMet ? "Met" : "Not Met"}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${endingSoon ? "bg-rose-500/15 text-rose-400 border-rose-500/20" : isDarkMode ? "bg-slate-700 text-slate-300 border-slate-600" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                        <TimerReset className="w-3.5 h-3.5" /> {formatCountdown(remaining)}
                      </span>
                    </div>
                    <button onClick={() => setSelectedId(a._id)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white shrink-0">
                      <Eye className="w-3.5 h-3.5" /> Monitor Live
                    </button>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="p-16 text-center"><Gavel className={`w-12 h-12 mx-auto mb-4 ${muted}`} /><p className={`text-lg font-medium ${strong}`}>No live auctions found</p></div>
          )}
        </div>
      </div>

      {/* ── Live monitor modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedId(null)}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} className={`w-full max-w-2xl rounded-2xl ${surface} max-h-[92vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
              <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-10 ${surface} ${divider}`}>
                <div className="flex items-center gap-4 min-w-0">
                  <img src={selected.coverImage} alt={selected.title} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                  <div className="min-w-0">
                    <h3 className={`text-lg font-semibold truncate flex items-center gap-2 ${strong}`}>
                      <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
                      {selected.title}
                    </h3>
                    <p className={`text-sm ${muted}`}>Live monitoring — updates automatically</p>
                  </div>
                </div>
                <button onClick={() => setSelectedId(null)} className={`p-2 rounded-lg ${muted}`}><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-6">
                {/* Live stats */}
                <div className={`rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm ${panel}`}>
                  <div><p className={muted}>Current bid</p><p className={`text-lg font-semibold ${strong}`}>${selected.currentBid}</p></div>
                  <div><p className={muted}>Bidders</p><p className={`text-lg font-semibold ${strong}`}>{selected.bidderCount}</p></div>
                  <div><p className={muted}>Reserve</p>
                    <span className={`inline-flex items-center gap-1 mt-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${selected.currentBid >= selected.reservePrice ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
                      {selected.currentBid >= selected.reservePrice ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />} {selected.currentBid >= selected.reservePrice ? "Met" : `$${selected.reservePrice - selected.currentBid} to go`}
                    </span>
                  </div>
                  <div><p className={muted}>Time left</p><p className={`text-lg font-semibold ${strong}`}>{formatCountdown(selected.endsAt - Date.now())}</p></div>
                </div>

                {/* Anti-sniping settings */}
                <div className={`rounded-2xl p-5 space-y-3 ${panel}`}>
                  <p className={`text-sm font-semibold flex items-center gap-2 ${strong}`}><Settings2 className="w-4 h-4" /> Anti-sniping (soft-close)</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${strong}`}>Auto-extend on last-minute bids</span>
                    {/* <button onClick={() => toggleSoftClose(selected)} className={`w-11 h-6 rounded-full relative transition-colors ${selected.softCloseEnabled ? "bg-violet-600" : isDarkMode ? "bg-slate-600" : "bg-slate-300"}`}>
                      <span className={`absolute right-6 top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${selected.softCloseEnabled ? "translate-x-6" : "translate-x-0.5"}`} />
                    </button> */}
                    <ToggleSwitch checked={selected.softCloseEnabled} onChange={() => toggleSoftClose(selected)} />
                  </div>
                  {selected.softCloseEnabled && (
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div className="flex items-center gap-2"><span className={muted}>If a bid lands within</span><input type="number" value={selected.softCloseWindowMinutes} onChange={e => updateSoftCloseWindow(selected, Number(e.target.value))} className={`${inputCls} w-16 py-1`} /><span className={muted}>min of close</span></div>
                      <div className="flex items-center gap-2"><span className={muted}>extend by</span><input type="number" value={selected.softCloseExtensionMinutes} onChange={e => updateSoftCloseExtension(selected, Number(e.target.value))} className={`${inputCls} w-16 py-1`} /><span className={muted}>min</span></div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button onClick={() => extendNow(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-500 hover:bg-sky-600 text-white"><TimerReset className="w-3.5 h-3.5" /> Extend now</button>
                    <div className="flex items-center gap-2 ml-auto">
                      <span className={`text-xs ${strong}`}>Auto-accept winner at close</span>
                      <ToggleSwitch checked={selected.autoAcceptWinner} onChange={() => toggleAutoAccept(selected)} />
                    </div>
                  </div>
                </div>

                {/* Bid history */}
                <div className="space-y-2">
                  <p className={`text-sm font-semibold ${strong}`}>Bid history</p>
                  <div className="space-y-1.5">
                    {selected.bids.map((b, idx) => {
                      const isHighest = idx === selected.bids.findIndex(x => !x.rejected);
                      return (
                        <div key={b.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${b.rejected ? "opacity-40" : isHighest ? (isDarkMode ? "bg-violet-500/10 ring-1 ring-violet-500/30" : "bg-violet-50 ring-1 ring-violet-200") : panel}`}>
                          <img src={b.bidder.photo} alt={b.bidder.name} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                          <div className="flex-1 min-w-0 flex items-center gap-2">
                            <p className={`text-sm font-medium ${strong}`}>{b.bidder.name}</p>
                            {isHighest && !b.rejected && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                            {b.flagged && <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />}
                            {b.rejected && <span className="text-[10px] text-rose-500 font-medium">Rejected</span>}
                          </div>
                          <span className={`text-sm font-semibold ${strong}`}>${b.amount}</span>
                          <span className={`text-xs w-16 text-right ${muted}`}>{b.time}</span>
                          {!b.rejected && (
                            <button onClick={() => rejectBid(selected, b)} className="text-xs font-medium text-rose-500 hover:text-rose-600 shrink-0">Reject</button>
                          )}
                        </div>
                      );
                    })}
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