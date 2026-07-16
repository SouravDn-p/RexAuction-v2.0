import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Flame,
    Gavel,
    Search,
    TrendingUp,
    X,
    Zap
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../../hooks/useTheme";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AuctionItem {
  _id: string;
  name: string;
  category: string;
  description: string;
  startingPrice: number;
  currentBid: number;
  images: string[];
  endTime: string;
  seller?: { name: string; photo: string };
  bidCount: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_AUCTIONS: AuctionItem[] = [
  {
    _id: "1",
    name: "Vintage Rolex Submariner",
    category: "Watches",
    description: "Rare 1960s Rolex Submariner in excellent condition with original box and papers.",
    startingPrice: 12500,
    currentBid: 18750,
    images: ["https://images.unsplash.com/photo-1524592094714-0f4574771d1c?w=600"],
    endTime: new Date(Date.now() + 1000 * 60 * 47).toISOString(),
    seller: { name: "LuxuryVault", photo: "https://i.pravatar.cc/150?u=1" },
    bidCount: 47,
  },
  {
    _id: "2",
    name: "Original Basquiat Sketch",
    category: "Art",
    description: "Authenticated mixed-media work on paper. Certificate of authenticity from Christie's.",
    startingPrice: 45000,
    currentBid: 67200,
    images: ["https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600"],
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
    seller: { name: "ArtLegacy", photo: "https://i.pravatar.cc/150?u=2" },
    bidCount: 32,
  },
  {
    _id: "3",
    name: "MacBook Pro M3 Max — Sealed",
    category: "Electronics",
    description: "16-inch, M3 Max, 48 GB RAM, 1 TB SSD. Factory sealed with AppleCare+ 3 years.",
    startingPrice: 3200,
    currentBid: 3850,
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600"],
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    seller: { name: "TechHub", photo: "https://i.pravatar.cc/150?u=3" },
    bidCount: 19,
  },
  {
    _id: "4",
    name: "1965 Ford Mustang Fastback",
    category: "Vehicles",
    description: "Fully restored with matching numbers. Highland Green, 289 V8, 4-speed manual.",
    startingPrice: 68000,
    currentBid: 89500,
    images: ["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600"],
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
    seller: { name: "ClassicMotors", photo: "https://i.pravatar.cc/150?u=4" },
    bidCount: 28,
  },
  {
    _id: "5",
    name: "Gibson Les Paul '59 Reissue",
    category: "Collectibles",
    description: "VOS finish, hand-selected top. The closest to a real '59 you'll find outside a museum.",
    startingPrice: 14000,
    currentBid: 17600,
    images: ["https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600"],
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 20).toISOString(),
    seller: { name: "VintageInstruments", photo: "https://i.pravatar.cc/150?u=5" },
    bidCount: 23,
  },
  {
    _id: "6",
    name: "Patek Philippe Nautilus 5711",
    category: "Watches",
    description: "Full set, mint condition. Last piece at MSRP was $35k — current grey market triple.",
    startingPrice: 90000,
    currentBid: 118000,
    images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600"],
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
    seller: { name: "GenevaAuctions", photo: "https://i.pravatar.cc/150?u=6" },
    bidCount: 61,
  },
  {
    _id: "7",
    name: "Diamond Riviera Necklace",
    category: "Jewelry",
    description: "18k white gold, 5.2 carat total weight. GIA certified. Comes in Cartier box.",
    startingPrice: 22000,
    currentBid: 29800,
    images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600"],
    endTime: new Date(Date.now() + 1000 * 60 * 25).toISOString(),
    seller: { name: "PrecisionJewels", photo: "https://i.pravatar.cc/150?u=7" },
    bidCount: 38,
  },
  {
    _id: "8",
    name: "Leica M11 Monochrom",
    category: "Electronics",
    description: "60MP BSI CMOS, black paint. Like-new condition, 200 actuations. Includes 35mm Summicron.",
    startingPrice: 9800,
    currentBid: 11400,
    images: ["https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600"],
    endTime: new Date(Date.now() + 1000 * 60 * 60 * 14).toISOString(),
    seller: { name: "CameraCollectors", photo: "https://i.pravatar.cc/150?u=8" },
    bidCount: 15,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatTime = (seconds: number) => {
  if (seconds <= 0) return "Ended";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

const getTimeStatus = (s: number) => (s <= 0 ? "ended" : s < 3600 ? "ending-soon" : "active");

const fmt = (n: number) => "$" + n.toLocaleString("en-US");

// ─── Auction Card ─────────────────────────────────────────────────────────────
function AuctionCard({
  item,
  index,
  isDarkMode,
  timeLeft,
  prefersReducedMotion,
}: {
  item: AuctionItem;
  index: number;
  isDarkMode: boolean;
  timeLeft: number;
  prefersReducedMotion: boolean | null;
}) {
  const [hovered, setHovered] = useState(false);
  const timeStatus = getTimeStatus(timeLeft);

  // Fan-in entry: cards arrive from slight rotation + Y offset, staggered
  const entryVariants = {
    hidden: { opacity: 0, y: 40, rotate: prefersReducedMotion ? 0 : 3 - index * 1.5 },
    visible: {
      opacity: 1, y: 0, rotate: 0,
      transition: { type: "spring", stiffness: 260, damping: 22, delay: index * 0.07 },
    },
    exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl overflow-hidden shadow-lg cursor-pointer select-none"
      style={{ aspectRatio: "3/4" }}
      whileHover={{ y: -6, scale: 1.015, transition: { type: "spring", stiffness: 320, damping: 24 } }}
    >
      {/* Full-bleed image */}
      <img
        src={item.images[0]}
        alt={item.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
        style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600"; }}
      />

      {/* Permanent bottom scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

      {/* Category + ending-soon badge */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/50 text-white backdrop-blur-sm border border-white/10">
          {item.category}
        </span>
        {timeStatus === "ending-soon" && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500 text-white animate-pulse">
            <Zap className="w-3 h-3" /> Ending
          </span>
        )}
      </div>

      {/* Permanent info: name + bid + timer */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4 transition-transform duration-300"
        style={{ transform: hovered ? "translateY(-60px)" : "translateY(0)" }}
      >
        <p className="text-white text-base font-bold leading-snug line-clamp-2 mb-2">{item.name}</p>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/50 text-[11px] font-medium">Current bid</p>
            <p className="text-white text-xl font-black leading-none">{fmt(item.currentBid)}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
            timeStatus === "ending-soon" ? "bg-rose-500 text-white" : "bg-purple-600 text-white"
          }`}>
            <Clock className="w-3.5 h-3.5" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Slide-up bid CTA */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ y: 56, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 56, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="absolute bottom-0 left-0 right-0 px-4 pb-4"
          >
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="flex items-center gap-1 text-[11px] text-white/60">
                <TrendingUp className="w-3 h-3" /> {item.bidCount} bids
              </span>
              <span className="text-[11px] text-white/60">Starting {fmt(item.startingPrice)}</span>
            </div>
            <Link
              to={`/liveAuction/${item._id}`}
              className="block w-full text-center bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-purple-900/40"
            >
              Place Bid Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const HotAuction: React.FC = () => {
  const { isDarkMode } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const [countdowns, setCountdowns] = useState<Record<string, number>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const ITEMS_PER_PAGE = 4;

  // Countdown ticker
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const updated: Record<string, number> = {};
      MOCK_AUCTIONS.forEach((item) => {
        updated[item._id] = Math.max(0, Math.floor((new Date(item.endTime).getTime() - now) / 1000));
      });
      setCountdowns(updated);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return MOCK_AUCTIONS;
    const t = searchTerm.toLowerCase();
    return MOCK_AUCTIONS.filter(
      (a) => a.name.toLowerCase().includes(t) || a.category.toLowerCase().includes(t) || a.description.toLowerCase().includes(t)
    );
  }, [searchTerm]);

  // Reset page when filter changes
  useEffect(() => { setCurrentPage(0); }, [searchTerm]);

  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const displayed = filtered.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  const surface = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const subtext = isDarkMode ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`w-full transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <section className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 py-14">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Flame className="w-7 h-7 text-orange-500 flex-shrink-0" />
              <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Hot Auctions
              </h2>
            </div>
            <p className={`text-sm pl-10 ${subtext}`}>
              {filtered.length} live auction{filtered.length !== 1 ? "s" : ""} · ending soon
            </p>
          </div>

          {/* Search */}
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${surface} w-full sm:w-72`}>
            <Search className={`w-4 h-4 flex-shrink-0 ${subtext}`} />
            <input
              type="text"
              placeholder="Search by name or category…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")}>
                <X className={`w-3.5 h-3.5 ${subtext} hover:text-rose-400 transition-colors`} />
              </button>
            )}
          </div>
        </div>

        {/* ── Empty state ── */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 ${isDarkMode ? "bg-yellow-900/30 text-yellow-400" : "bg-yellow-100 text-yellow-600"}`}>
              <Gavel className="w-7 h-7" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              No matching auctions
            </h3>
            <p className={`text-sm mb-6 ${subtext}`}>Try a different search term</p>
            <button
              onClick={() => setSearchTerm("")}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition"
            >
              Clear search
            </button>
          </motion.div>
        )}

        {/* ── Cards grid ── */}
        {filtered.length > 0 && (
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage + searchTerm}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              >
                {displayed.map((item, i) => (
                  <AuctionCard
                    key={item._id}
                    item={item}
                    index={i}
                    isDarkMode={isDarkMode}
                    timeLeft={countdowns[item._id] ?? 0}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* ── Pagination ── */}
            {pageCount > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all disabled:opacity-40 ${surface} hover:border-purple-500`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex gap-1.5">
                  {Array.from({ length: pageCount }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        i === currentPage
                          ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                          : isDarkMode ? "bg-gray-800 text-gray-400 hover:bg-gray-700" : "bg-white text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(pageCount - 1, p + 1))}
                  disabled={currentPage === pageCount - 1}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all disabled:opacity-40 ${surface} hover:border-purple-500`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default HotAuction;