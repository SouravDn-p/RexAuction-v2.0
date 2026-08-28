import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { AiFillCrown } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { MOCK_BUYER_AUCTIONS, type BuyerAuction } from "../../../../data/Buyerauctiondata";
import { MOCK_AUCTIONS } from "../../../../data/MOCK_AUCTIONS";
import { MOCK_USER } from "../../../../data/MOCK_USER";
import { useTheme } from "../../../../hooks/useTheme";
import type { AuctionItem } from "../../../../types/shared/auctionTypes";
import LiveAuctionDetails from "../../../components/landing/liveAuction/LiveAuctionDetails";

const FALLBACK_AUCTION: AuctionItem = {
    _id: "1",
    name: "1967 Shelby GT500 Eleanor — Iconic Muscle Car",
    category: "Vehicles",
    description: "A stunning recreation of the iconic Eleanor from the film Gone in 60 Seconds. This 1967 Ford Mustang Shelby GT500 has been meticulously restored with a 428ci Cobra Jet V8, custom silver paint with black racing stripes, and period-correct interior. Every panel has been replaced or restored to better-than-factory condition. This is a one-of-a-kind collector's piece that combines cinematic history with automotive excellence.",
    startingPrice: 85000,
    currentBid: 112500,
    status: "Active",
    startTime: new Date(Date.now() - 7200000).toISOString(),
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000 + 24 * 60 * 1000).toISOString(),
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&q=80",
      "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&q=80",
    ],
    condition: "Restored",
    itemYear: 1967,
    history: "Meticulously restored to better-than-factory condition.",
    reference: "SHB-1967-GT500",
    sellerDisplayName: "Heritage Motors",
    sellerEmail: "heritage@motors.com",
    sellerPhotoUrl: "https://ui-avatars.com/api/?name=Heritage+Motors&background=5b21b6&color=fff",
};

const buyerToLive = (a: BuyerAuction): AuctionItem => ({
  _id: a._id,
  name: a.name,
  category: a.category,
  description: a.description,
  startingPrice: a.startingPrice,
  currentBid: a.currentBid,
  status: a.status === "ongoing" ? "Active" : "Ended",
  startTime: a.startTime,
  endTime: a.endTime,
  images: [a.image, a.image, a.image, a.image],
  condition: a.condition,
  itemYear: 0,
  history: a.description,
  reference: a.invoiceId ?? a._id.toUpperCase(),
  sellerDisplayName: a.seller,
  sellerEmail: `${a.seller.replace(/\s/g, "").toLowerCase()}@rex-auction.com`,
  sellerPhotoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(a.seller)}&background=7c3aed&color=fff`,
});

const resolveLiveAuction = (id: string | undefined): AuctionItem => {
  if (!id) return FALLBACK_AUCTION;
  const catalog = MOCK_AUCTIONS.find((a) => a._id === id);
  if (catalog) return catalog;
  const buyer = MOCK_BUYER_AUCTIONS.find((a) => a._id === id || a.liveAuctionId === id);
  if (buyer) return buyerToLive(buyer);
  return FALLBACK_AUCTION;
};

const INITIAL_TOP_BIDDERS = [
  { _id: "b1", name: "James Whitmore",  email: "james@email.com",  photo: "https://ui-avatars.com/api/?name=James+Whitmore&background=eab308&color=fff", amount: 112500 },
  { _id: "b2", name: "Sofia Marchetti", email: "sofia@email.com",  photo: "https://ui-avatars.com/api/?name=Sofia+Marchetti&background=6b7280&color=fff", amount: 108000 },
  { _id: "b3", name: "Ryo Tanaka",      email: "ryo@email.com",    photo: "https://ui-avatars.com/api/?name=Ryo+Tanaka&background=ea580c&color=fff",       amount: 97500  },
];

const INITIAL_RECENT_ACTIVITY = [
  { name: "James Whitmore",  photo: "https://ui-avatars.com/api/?name=James+Whitmore&background=eab308&color=fff",  amount: 112500, createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()  },
  { name: "Sofia Marchetti", photo: "https://ui-avatars.com/api/?name=Sofia+Marchetti&background=6b7280&color=fff", amount: 108000, createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString()  },
  { name: "Ryo Tanaka",      photo: "https://ui-avatars.com/api/?name=Ryo+Tanaka&background=ea580c&color=fff",      amount: 97500,  createdAt: new Date(Date.now() - 19 * 60 * 1000).toISOString() },
];

interface RecentActivity {
  name: string;
  photo: string | null;
  amount: number;
  createdAt: string;
  email?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatTime = (seconds: number) => {
  if (seconds <= 0) return "Ended";
  const days = Math.floor(seconds / 86400);
  const hrs  = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (days > 0) return `${days}d ${hrs}h`;
  if (hrs  > 0) return `${hrs}h ${mins}m`;
  return `${mins}m ${secs.toString().padStart(2,"0")}s`;
};



const crownColor = (i: number) =>
  i === 0 ? "text-yellow-400" : i === 1 ? "text-slate-400" : "text-orange-400";

// ─── Component ────────────────────────────────────────────────────────────────

export default function LiveAuctionPage() {
  const { id } = useParams<{ id: string }>();
  const { isDarkMode } = useTheme();
  const auction = useMemo(() => resolveLiveAuction(id), [id]);

  const [countdown,        setCountdown]        = useState(0);
  const [bidAmount,        setBidAmount]        = useState("");
  const [autoBidAmount,    setAutoBidAmount]    = useState("");
  const [incrementalAmt,   setIncrementalAmt]   = useState("");
  const [bidAnimation,     setBidAnimation]     = useState(false);
  
  const [myBid,            setMyBid]            = useState<{ amount:number; autoBid:number } | null>(null);
  const [currentHighest,   setCurrentHighest]   = useState(auction.currentBid ?? auction.startingPrice);
  const [topBidders,       setTopBidders]       = useState(INITIAL_TOP_BIDDERS);
  const [recentActivity,   setRecentActivity]   = useState<RecentActivity[]>(INITIAL_RECENT_ACTIVITY);

  useEffect(() => {
    setCurrentHighest(auction.currentBid ?? auction.startingPrice);
    setMyBid(null);
    setBidAmount("");
    setAutoBidAmount("");
    setIncrementalAmt("");
    setTopBidders(INITIAL_TOP_BIDDERS);
    setRecentActivity(INITIAL_RECENT_ACTIVITY);
  }, [auction._id, auction.currentBid, auction.startingPrice]);

  useEffect(() => {
    const endMs = new Date(auction.endTime).getTime();
    const tick = () => setCountdown(Math.max(0, Math.floor((endMs - Date.now()) / 1000)));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [auction.endTime]);


  // Design tokens
  const bg      = isDarkMode ? "bg-slate-900"                       : "bg-slate-50";
  const card    = isDarkMode ? "bg-slate-800 border-slate-700/60"   : "bg-white border-slate-100 shadow-sm";
  const inputCls= isDarkMode ? "bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-500 focus:ring-violet-500/30 focus:border-violet-500"
                             : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-violet-400/20 focus:border-violet-400";
  const muted   = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong  = isDarkMode ? "text-slate-100" : "text-slate-800";

  const isEnded = formatTime(countdown) === "Ended";

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handlePlaceBid = () => {
    const amount = parseFloat(bidAmount);
    if (!amount || amount <= currentHighest) {
      toast.error("Bid must be higher than the current highest bid");
      return;
    }
    const newBidder = { _id: "me", name: MOCK_USER.name, email: MOCK_USER.email, photo: MOCK_USER.photoURL || "", amount };
    setCurrentHighest(amount);
    setMyBid({ amount, autoBid: myBid?.autoBid || 0 });
    setTopBidders(prev =>
      [newBidder, ...prev.filter(b => b.email !== MOCK_USER.email)]
        .sort((a,b) => b.amount - a.amount).slice(0, 3)
    );
    setRecentActivity(prev => [
      { name: MOCK_USER.name, photo: MOCK_USER.photoURL || null, amount, createdAt: new Date().toISOString(), email: MOCK_USER.email },
      ...prev,
    ].slice(0, 5));
    setBidAnimation(true);
    setTimeout(() => setBidAnimation(false), 1500);
    setBidAmount("");
    toast.success(`Bid of $${amount.toLocaleString()} placed successfully!`);
  };

  const handleAutoBid = () => {
    const amount = parseFloat(autoBidAmount);
    if (!amount || amount <= currentHighest) {
      toast.error("Auto bid must be higher than the current highest bid");
      return;
    }
    setMyBid(prev => ({ amount: prev?.amount || currentHighest, autoBid: amount }));
    setAutoBidAmount("");
    setIncrementalAmt("");
    toast.success(`Auto bid set to $${amount.toLocaleString()}!`);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'DM Sans', sans-serif", fontSize:"13px", borderRadius:"10px", background: isDarkMode?"#1e293b":"#fff", color: isDarkMode?"#f1f5f9":"#0f172a", border: isDarkMode?"1px solid #334155":"1px solid #e2e8f0" } }} />

      {/* ── Banner ──────────────────────────────────────────────────────── */}
      <div className="relative h-44 md:h-80 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1400&q=80" alt="banner" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className={`text-xs font-semibold tracking-widest uppercase mb-2 px-3 py-1 rounded-full ${isDarkMode?"bg-violet-500/20 text-violet-300":"bg-violet-500/20 text-violet-200"}`}>
            Live Auction
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {auction.name}
          </h1>
          <p className="text-white/55 text-sm mt-1">Live bidding — place your bid now</p>
        </div>

        {/* Live indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          LIVE
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4  py-7">
        <div className="flex flex-col lg:flex-row gap-7">

          {/* ── Left column ───────────────────────────────────────────── */}
          <LiveAuctionDetails
            auction={auction}
            recentActivity={recentActivity}
            card={card}
            strong={strong}
            muted={muted}
            isDarkMode={isDarkMode}
            isEnded={isEnded}
          />
          

          {/* ── Right column ──────────────────────────────────────────── */}
          <div className="lg:w-[38%] space-y-5">

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Countdown */}
              <div className={`rounded-2xl border p-4 text-center ${
                isEnded
                  ? isDarkMode?"bg-rose-500/10 border-rose-500/30":"bg-rose-50 border-rose-200"
                  : card
              }`}>
                <p className={`text-xs font-medium mb-1.5 ${muted}`}>
                  {isEnded ? "Status" : "Ends in"}
                </p>
                <p className={`text-xl font-bold ${isEnded?"text-rose-500":isDarkMode?"text-rose-400":"text-rose-500"}`}>
                  {formatTime(countdown)}
                </p>
              </div>

              {/* Highest Bid */}
              <motion.div
                animate={bidAnimation ? { scale:[1,1.04,1] } : {}}
                transition={{ duration:0.4 }}
                className={`rounded-2xl border p-4 text-center ${
                  isDarkMode
                    ? "bg-violet-500/10 border-violet-500/30"
                    : "bg-violet-50 border-violet-200"
                }`}
              >
                <p className={`text-xs font-medium mb-1.5 ${muted}`}>Highest bid</p>
                <p className={`text-xl font-bold ${isDarkMode?"text-violet-400":"text-violet-600"}`}>
                  ${currentHighest.toLocaleString()}
                </p>
              </motion.div>

              {/* My Bid */}
              <div className={`col-span-2 rounded-2xl border p-4 text-center ${card}`}>
                <p className={`text-xs font-medium mb-1.5 ${muted}`}>Your highest bid</p>
                <p className={`text-xl font-bold ${isDarkMode?"text-slate-200":"text-slate-800"}`}>
                  {myBid ? `$${myBid.amount.toLocaleString()}` : "—"}
                </p>
              </div>

              {myBid?.autoBid ? (
                <div className={`col-span-2 rounded-2xl border p-4 text-center ${card}`}>
                  <p className={`text-xs font-medium mb-1.5 ${muted}`}>Your auto bid</p>
                  <p className={`text-xl font-bold ${isDarkMode?"text-emerald-400":"text-emerald-600"}`}>
                    ${myBid.autoBid.toLocaleString()}
                  </p>
                </div>
              ) : null}
            </div>

            {/* Top Bidders */}
            <div className={`rounded-2xl border ${card}`}>
              <div className={`px-5 py-4 border-b ${isDarkMode?"border-slate-700/60":"border-slate-100"}`}>
                <h3 className={`text-sm font-semibold ${strong}`}>Top bidders</h3>
              </div>
              <div className="p-4 space-y-2">
                {topBidders.length === 0 ? (
                  <p className={`text-center py-6 text-sm ${muted}`}>No bids yet. Be the first!</p>
                ) : topBidders.map((bidder, i) => (
                  <div key={bidder._id} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    bidder.email === MOCK_USER.email
                      ? isDarkMode?"bg-violet-500/10 border border-violet-500/30":"bg-violet-50 border border-violet-200"
                      : isDarkMode?"bg-slate-700/30":"bg-slate-50"
                  }`}>
                    <AiFillCrown className={`text-lg shrink-0 ${crownColor(i)}`} />
                    <img src={bidder.photo} alt={bidder.name} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${strong}`}>
                        {bidder.name}
                        {bidder.email === MOCK_USER.email && <span className="ml-1.5 text-xs text-violet-500">(You)</span>}
                      </p>
                    </div>
                    <span className={`text-sm font-semibold shrink-0 ${isDarkMode?"text-violet-400":"text-violet-600"}`}>
                      ${bidder.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Place Bid */}
            <div className={`rounded-2xl border p-5 ${card}`}>
              <h3 className={`text-sm font-semibold mb-4 ${strong}`}>Place your bid</h3>

              {/* Quick increments */}
              <div className="flex gap-2 mb-3">
                {[100, 500, Math.round(currentHighest * 0.05)].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setBidAmount(String(currentHighest + amt))}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${isDarkMode?"bg-slate-700 hover:bg-slate-600 text-violet-300":"bg-violet-50 hover:bg-violet-100 text-violet-700"}`}
                  >+{amt}</button>
                ))}
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Your bid amount</label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                    placeholder={`Min $${(currentHighest + 100).toLocaleString()}`}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 ${inputCls}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Increment over current bid</label>
                  <input
                    type="number"
                    readOnly
                    value={bidAmount ? Math.max(0, parseFloat(bidAmount) - currentHighest).toFixed(0) : ""}
                    placeholder="Auto calculated"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none ${inputCls} opacity-70`}
                  />
                </div>
              </div>

              <button
                onClick={handlePlaceBid}
                disabled={isEnded}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                  isEnded
                    ? "bg-slate-300 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-violet-600 hover:bg-violet-700 active:scale-[0.99] text-white shadow-md shadow-violet-500/20"
                }`}
              >
                {isEnded ? "Auction Ended" : "Place Bid"}
              </button>
            </div>

            {/* Auto Bid */}
            <div className={`rounded-2xl border p-5 ${card}`}>
              <h3 className={`text-sm font-semibold mb-1 ${strong}`}>Set auto bid</h3>
              <p className={`text-xs mb-4 ${muted}`}>Automatically bid up to your max — incremented step by step.</p>

              <div className="flex gap-2 mb-3">
                {[200, 1000, Math.round(currentHighest * 0.1)].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setAutoBidAmount(String(currentHighest + amt))}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${isDarkMode?"bg-slate-700 hover:bg-slate-600 text-emerald-300":"bg-emerald-50 hover:bg-emerald-100 text-emerald-700"}`}
                  >+{amt}</button>
                ))}
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Increment by each step</label>
                  <input
                    type="number"
                    value={incrementalAmt}
                    onChange={e => setIncrementalAmt(e.target.value)}
                    placeholder="e.g. 250"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 ${inputCls}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Maximum auto bid</label>
                  <input
                    type="number"
                    value={autoBidAmount}
                    onChange={e => setAutoBidAmount(e.target.value)}
                    placeholder={`Min $${(currentHighest + 100).toLocaleString()}`}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 ${inputCls}`}
                  />
                </div>
              </div>

              <button
                onClick={handleAutoBid}
                disabled={isEnded}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                  isEnded
                    ? "bg-slate-300 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white shadow-md shadow-emerald-500/20"
                }`}
              >
                {isEnded ? "Auction Ended" : "Set Auto Bid"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}