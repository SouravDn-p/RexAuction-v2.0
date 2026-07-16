import React, { useState, useRef } from "react";
import {
  Flame,
  Search,
  Clock,
  Calendar,
  X,
  Tag,
  User,
  ArrowRight,
  Bell,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../../hooks/useTheme";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────
interface UpcomingAuctionItem {
  _id: string;
  name: string;
  category: string;
  startingPrice: number;
  startTime: string;
  sellerDisplayName: string;
  sellerPhotoUrl?: string;
  sellerEmail?: string;
  history?: string;
  images: string[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_UPCOMING: UpcomingAuctionItem[] = [
  {
    _id: "u1",
    name: "Limited Edition Rolex Daytona",
    category: "Watches",
    startingPrice: 28500,
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
    sellerDisplayName: "LuxuryTimepieces",
    sellerPhotoUrl: "https://i.pravatar.cc/150?u=u1",
    sellerEmail: "contact@luxurytime.com",
    history: "Rare 2023 Daytona in white gold. Full set with original box, papers, and service receipt.",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f4574771d1c?w=600",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600",
    ],
  },
  {
    _id: "u2",
    name: "Signed Messi 2024 Jersey",
    category: "Sports",
    startingPrice: 4500,
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 36).toISOString(),
    sellerDisplayName: "SportsVault",
    sellerPhotoUrl: "https://i.pravatar.cc/150?u=u2",
    sellerEmail: "sports@sportsvault.com",
    history: "Match-worn and hand-signed after the Copa América final. PSA/DNA authenticated.",
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600",
    ],
  },
  {
    _id: "u3",
    name: "Antique Persian Rug — 18th C.",
    category: "Antiques",
    startingPrice: 12500,
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
    sellerDisplayName: "HeritageCollectibles",
    sellerPhotoUrl: "https://i.pravatar.cc/150?u=u3",
    sellerEmail: "heritage@auction.com",
    history: "Museum-quality piece with documented provenance tracing to a Tabriz workshop circa 1780.",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
    ],
  },
  {
    _id: "u4",
    name: "First Ed. Dune — Frank Herbert",
    category: "Books",
    startingPrice: 8200,
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 96).toISOString(),
    sellerDisplayName: "RareBooksLondon",
    sellerPhotoUrl: "https://i.pravatar.cc/150?u=u4",
    sellerEmail: "rare@booksldn.com",
    history: "1965 Chilton Books first edition, first printing. Near-fine condition in very good dust jacket.",
    images: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600",
    ],
  },
  {
    _id: "u5",
    name: "Ferrari 250 GTO Scale Model",
    category: "Collectibles",
    startingPrice: 3100,
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 120).toISOString(),
    sellerDisplayName: "ScaleModelsPlus",
    sellerPhotoUrl: "https://i.pravatar.cc/150?u=u5",
    sellerEmail: "models@scaleplus.com",
    history: "CMC 1:18 diecast. One of 3,000 units worldwide. Original box with display case.",
    images: [
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600",
    ],
  },
  {
    _id: "u6",
    name: "1920s Art Deco Brooch",
    category: "Jewelry",
    startingPrice: 6800,
    startTime: new Date(Date.now() + 1000 * 60 * 60 * 144).toISOString(),
    sellerDisplayName: "PrecisionJewels",
    sellerPhotoUrl: "https://i.pravatar.cc/150?u=u6",
    sellerEmail: "jewelry@precisionjewels.com",
    history: "Platinum and diamond geometric brooch from a Parisian estate. GIA documented stones.",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600",
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatCountdown = (startTime: string): string => {
  const diff = new Date(startTime).getTime() - Date.now();
  if (diff <= 0) return "Starting now";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

const fmt = (n: number) => "$" + n.toLocaleString("en-US");

// ─── Upcoming Card (used in belt) ─────────────────────────────────────────────
function UpcomingCard({
  item,
  isDarkMode,
  onOpen,
}: {
  item: UpcomingAuctionItem;
  isDarkMode: boolean;
  onOpen: (item: UpcomingAuctionItem) => void;
}) {
  return (
    <div
      onClick={() => onOpen(item)}
      className={`flex-shrink-0 w-64 rounded-2xl overflow-hidden border cursor-pointer group transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${
        isDarkMode
          ? "bg-gray-800 border-gray-700 hover:border-purple-500/60"
          : "bg-white border-gray-200 hover:border-purple-400/60"
      }`}
      style={{ userSelect: "none" }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={item.images[0]}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Countdown pill */}
        <div className="absolute bottom-3 left-3">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-600 text-white">
            <Clock className="w-3 h-3" />
            {formatCountdown(item.startTime)}
          </span>
        </div>

        {/* Category pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/50 text-white backdrop-blur-sm border border-white/10">
            {item.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className={`font-bold text-sm leading-snug line-clamp-2 mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          {item.name}
        </h3>

        <div className="flex items-center justify-between">
          <div>
            <p className={`text-[10px] font-medium uppercase tracking-wide mb-0.5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
              Starting bid
            </p>
            <p className="text-base font-black text-purple-500">{fmt(item.startingPrice)}</p>
          </div>
          <div className="text-right">
            <p className={`text-[10px] font-medium uppercase tracking-wide mb-0.5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
              Opens
            </p>
            <p className={`text-xs font-semibold ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              {fmtDate(item.startTime)}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-2 mt-3 pt-3 border-t ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}>
          {item.sellerPhotoUrl && (
            <img src={item.sellerPhotoUrl} alt={item.sellerDisplayName} className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
          )}
          <p className={`text-xs truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{item.sellerDisplayName}</p>
          <ArrowRight className={`w-3 h-3 ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? "text-gray-400" : "text-gray-400"}`} />
        </div>
      </div>
    </div>
  );
}

// ─── Infinite Belt ────────────────────────────────────────────────────────────
function InfiniteBelt({
  items,
  isDarkMode,
  onOpen,
  paused,
}: {
  items: UpcomingAuctionItem[];
  isDarkMode: boolean;
  onOpen: (item: UpcomingAuctionItem) => void;
  paused: boolean;
}) {
  // Duplicate for seamless loop
  const doubled = [...items, ...items];
  // Card width + gap in px  (256 + 20 = 276 per card)
  const totalW = items.length * 276;

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{
          background: isDarkMode
            ? "linear-gradient(to right, #111827, transparent)"
            : "linear-gradient(to right, #f9fafb, transparent)",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{
          background: isDarkMode
            ? "linear-gradient(to left, #111827, transparent)"
            : "linear-gradient(to left, #f9fafb, transparent)",
        }}
      />

      <div
        className="flex gap-5 py-3"
        style={{
          width: `${totalW * 2}px`,
          animation: `beltScroll ${items.length * 6}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {doubled.map((item, i) => (
          <UpcomingCard
            key={`${item._id}-${i}`}
            item={item}
            isDarkMode={isDarkMode}
            onOpen={onOpen}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({
  item,
  onClose,
  isDarkMode,
}: {
  item: UpcomingAuctionItem;
  onClose: () => void;
  isDarkMode: boolean;
}) {
  const surface = isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const subtext = isDarkMode ? "text-gray-400" : "text-gray-500";
  const divider = isDarkMode ? "border-gray-800" : "border-gray-100";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 340, damping: 30 }}
        className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden ${surface}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Category */}
          <div className="absolute bottom-4 left-4">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white">
              <Tag className="w-3 h-3" /> {item.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h2 className={`text-xl font-black mb-1 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {item.name}
          </h2>
          <p className={`text-sm mb-4 leading-relaxed ${subtext}`}>{item.history}</p>

          {/* Key details */}
          <div className={`grid grid-cols-2 gap-3 p-4 rounded-2xl mb-4 ${isDarkMode ? "bg-gray-800" : "bg-slate-50"}`}>
            {[
              { label: "Starting bid",  value: fmt(item.startingPrice), strong: true },
              { label: "Opens",         value: fmtDate(item.startTime)  },
              { label: "Time until open", value: formatCountdown(item.startTime), highlight: true },
              { label: "Seller",        value: item.sellerDisplayName   },
            ].map(({ label, value, strong, highlight }) => (
              <div key={label}>
                <p className={`text-[10px] font-semibold uppercase tracking-wide mb-0.5 ${subtext}`}>{label}</p>
                <p className={`text-sm font-${strong ? "black" : "semibold"} ${highlight ? "text-purple-500" : strong ? "text-purple-500" : ""}`}>
                  {strong || highlight ? value : <span className={isDarkMode ? "text-gray-200" : "text-gray-800"}>{value}</span>}
                </p>
              </div>
            ))}
          </div>

          {/* Seller */}
          <div className={`flex items-center gap-3 p-3 rounded-xl border mb-4 ${isDarkMode ? "border-gray-800 bg-gray-800/50" : "border-gray-100 bg-gray-50"}`}>
            {item.sellerPhotoUrl && (
              <img src={item.sellerPhotoUrl} alt={item.sellerDisplayName} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{item.sellerDisplayName}</p>
              <p className={`text-xs truncate ${subtext}`}>{item.sellerEmail}</p>
            </div>
            <User className={`w-4 h-4 flex-shrink-0 ${subtext}`} />
          </div>

          {/* Additional images */}
          {item.images.length > 1 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {item.images.slice(1, 4).map((src, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden">
                  <img
                    src={src}
                    alt={`${item.name} ${i + 2}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600";
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => {
              toast.success(`Reminder set for "${item.name}"!`);
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white transition shadow-lg shadow-purple-900/30"
          >
            <Bell className="w-4 h-4" /> Remind Me When It Opens
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const UpcomingAuction: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<UpcomingAuctionItem | null>(null);
  const [beltPaused, setBeltPaused] = useState(false);

  const filtered = MOCK_UPCOMING.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subtext = isDarkMode ? "text-gray-400" : "text-gray-500";
  const surface = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";

  return (
    <div className={`w-full transition-colors duration-300 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <section className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 py-14">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Calendar className="w-6 h-6 text-purple-500 flex-shrink-0" />
              <h2 className={`text-3xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Upcoming Auctions
              </h2>
            </div>
            <p className={`text-sm pl-9 ${subtext}`}>
              {filtered.length} auction{filtered.length !== 1 ? "s" : ""} opening soon · hover to pause
            </p>
          </div>

          {/* Search */}
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${surface} w-full sm:w-72`}>
            <Search className={`w-4 h-4 flex-shrink-0 ${subtext}`} />
            <input
              type="text"
              placeholder="Search upcoming…"
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
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {searchTerm ? "No matching auctions" : "No upcoming auctions"}
            </h3>
            <p className={`text-sm mb-6 ${subtext}`}>
              {searchTerm ? "Try a different search term" : "Check back soon for new listings"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition"
              >
                Clear search
              </button>
            )}
          </motion.div>
        )}

        {/* ── Infinite belt ── */}
        {filtered.length > 0 && (
          <div
            onMouseEnter={() => setBeltPaused(true)}
            onMouseLeave={() => setBeltPaused(false)}
          >
            <InfiniteBelt
              items={filtered}
              isDarkMode={isDarkMode}
              onOpen={setSelectedItem}
              paused={beltPaused}
            />
          </div>
        )}

        {/* Hint */}
        {filtered.length > 0 && (
          <p className={`text-center text-xs mt-6 ${subtext}`}>
            Click any card to see details and set a reminder
          </p>
        )}
      </section>

      {/* ── Detail modal ── */}
      <AnimatePresence>
        {selectedItem && (
          <DetailModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes beltScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default UpcomingAuction;