import { AnimatePresence, motion } from "framer-motion";
import {
  Ban,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Flag,
  Gavel,
  History,
  ImageIcon,
  PauseCircle,
  Pin,
  PlayCircle,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Star,
  Tags,
  TimerReset,
  Trash2,
  X,
  XCircle
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "../../../../../hooks/useTheme";

// ─── Types ─────────────────────────────────────────────────────────────────

type AuctionStatus = "pending" | "live" | "paused" | "rejected" | "cancelled";

interface AuctionAuditEntry {
  id: string;
  type: "approve" | "reject" | "pause" | "resume" | "cancel" | "delete" | "extend" | "feature" | "highlight" | "pin" | "flag" | "unflag" | "edit";
  detail: string;
  admin: string;
  date: string;
}

interface Category {
  id: string;
  name: string;
  attributes: string[];
}

interface Auction {
  _id: string;
  title: string;
  coverImage: string;
  images: string[];
  seller: { name: string; photo: string };
  category: string;
  tags: string[];
  description: string;
  startPrice: number;
  reservePrice: number;
  buyNowPrice?: number;
  currentBid: number;
  bidCount: number;
  startDate: string;
  endDate: string;
  status: AuctionStatus;
  flagged?: { reason: string; date: string };
  featuredUntil?: string;
  highlighted?: boolean;
  pinned?: boolean;
  rejectReason?: string;
  cancelReason?: string;
  auditTrail: AuctionAuditEntry[];
}

// ─── Mock data ─────────────────────────────────────────────────────────────

const INITIAL_CATEGORIES: Category[] = [
  { id: "c1", name: "Electronics", attributes: ["Brand", "Condition", "Model Year"] },
  { id: "c2", name: "Collectibles", attributes: ["Era", "Authenticity Cert.", "Condition"] },
  { id: "c3", name: "Art", attributes: ["Medium", "Artist", "Dimensions"] },
  { id: "c4", name: "Vehicles", attributes: ["Make", "Mileage", "Registration"] },
  { id: "c5", name: "Instruments", attributes: ["Brand", "Type", "Condition"] },
  { id: "c6", name: "Fashion", attributes: ["Brand", "Size", "Material"] },
];

const MOCK_AUCTIONS: Auction[] = [
  {
    _id: "au1",
    title: "Vintage Leica M6 Camera",
    coverImage: "https://images.unsplash.com/photo-1519183071298-a2962be90b8e?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1519183071298-a2962be90b8e?w=600&q=80", "https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=600&q=80"],
    seller: { name: "Noah Kim", photo: "https://ui-avatars.com/api/?name=Noah+Kim&background=0369a1&color=fff" },
    category: "Electronics",
    tags: ["camera", "vintage", "film"],
    description: "Fully functional Leica M6 with original leather case, serviced in 2025. Light wear on body, glass is flawless.",
    startPrice: 850,
    reservePrice: 1200,
    currentBid: 0,
    bidCount: 0,
    startDate: "—",
    endDate: "—",
    status: "pending",
    auditTrail: [],
  },
  {
    _id: "au2",
    title: "1965 Fender Stratocaster",
    coverImage: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&q=80"],
    seller: { name: "Emily Carter", photo: "https://ui-avatars.com/api/?name=Emily+Carter&background=7c3aed&color=fff" },
    category: "Instruments",
    tags: ["guitar", "vintage", "fender"],
    description: "Original 1965 Stratocaster, sunburst finish, includes hardshell case and provenance documents.",
    startPrice: 3200,
    reservePrice: 4500,
    currentBid: 0,
    bidCount: 0,
    startDate: "—",
    endDate: "—",
    status: "pending",
    auditTrail: [],
  },
  {
    _id: "au3",
    title: "Antique Pocket Watch — 18k Gold",
    coverImage: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80"],
    seller: { name: "Sofia Diaz", photo: "https://ui-avatars.com/api/?name=Sofia+Diaz&background=be185d&color=fff" },
    category: "Collectibles",
    tags: ["watch", "gold", "antique"],
    description: "Swiss-made 18k gold pocket watch, circa 1890s, working condition with recent servicing.",
    startPrice: 600,
    reservePrice: 900,
    currentBid: 940,
    bidCount: 22,
    startDate: "2026-07-01",
    endDate: "2026-07-09",
    status: "live",
    highlighted: true,
    auditTrail: [
      { id: "a1", type: "approve", detail: "Listing approved after review", admin: "Admin Sara", date: "2026-07-01" },
      { id: "a2", type: "highlight", detail: "Highlighted on category page", admin: "Admin Sara", date: "2026-07-02" },
    ],
  },
  {
    _id: "au4",
    title: "Hand-carved Rosewood Chess Set",
    coverImage: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=600&q=80"],
    seller: { name: "Zara Nguyen", photo: "https://ui-avatars.com/api/?name=Zara+Nguyen&background=be185d&color=fff" },
    category: "Collectibles",
    tags: ["chess", "handmade", "wood"],
    description: "Hand-carved rosewood and maple chess set, weighted pieces, felted board.",
    startPrice: 120,
    reservePrice: 150,
    currentBid: 95,
    bidCount: 6,
    startDate: "2026-07-03",
    endDate: "2026-07-10",
    status: "live",
    featuredUntil: "2026-07-12",
    auditTrail: [
      { id: "a1", type: "approve", detail: "Listing approved after review", admin: "Admin Rafiq", date: "2026-07-03" },
      { id: "a2", type: "feature", detail: "Featured slot purchased for 9 days", admin: "Admin Rafiq", date: "2026-07-03" },
    ],
  },
  {
    _id: "au5",
    title: "Replica Rolex Submariner",
    coverImage: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80"],
    seller: { name: "Marcus Webb", photo: "https://ui-avatars.com/api/?name=Marcus+Webb&background=1d4ed8&color=fff" },
    category: "Collectibles",
    tags: ["watch", "luxury"],
    description: "Listed as 'Rolex-style' automatic watch — no brand authentication provided.",
    startPrice: 200,
    reservePrice: 300,
    currentBid: 260,
    bidCount: 14,
    startDate: "2026-06-28",
    endDate: "2026-07-08",
    status: "live",
    flagged: { reason: "Buyer report: possible counterfeit branded goods, no authenticity certificate", date: "2026-07-05" },
    auditTrail: [
      { id: "a1", type: "approve", detail: "Listing approved after review", admin: "Admin Rafiq", date: "2026-06-28" },
      { id: "a2", type: "flag", detail: "Flagged — possible counterfeit / prohibited item", admin: "System", date: "2026-07-05" },
    ],
  },
  {
    _id: "au6",
    title: "Restored 1978 Vespa Scooter",
    coverImage: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80"],
    seller: { name: "Ken Watanabe", photo: "https://ui-avatars.com/api/?name=Ken+Watanabe&background=475569&color=fff" },
    category: "Vehicles",
    tags: ["scooter", "vintage", "restored"],
    description: "Full nut-and-bolt restoration, new paint, engine rebuilt 2025 with receipts.",
    startPrice: 1800,
    reservePrice: 2200,
    currentBid: 1800,
    bidCount: 3,
    startDate: "2026-06-25",
    endDate: "2026-07-05",
    status: "paused",
    auditTrail: [
      { id: "a1", type: "approve", detail: "Listing approved after review", admin: "Admin Sara", date: "2026-06-25" },
      { id: "a2", type: "pause", detail: "Paused — seller requested document re-verification", admin: "Admin Sara", date: "2026-07-04" },
    ],
  },
  {
    _id: "au7",
    title: "Unauthenticated 'Banksy' Print",
    coverImage: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80"],
    seller: { name: "Jordan Lee", photo: "https://ui-avatars.com/api/?name=Jordan+Lee&background=0d9488&color=fff" },
    category: "Art",
    tags: ["print", "art"],
    description: "Print attributed to a well-known street artist with no certificate of authenticity.",
    startPrice: 500,
    reservePrice: 800,
    currentBid: 0,
    bidCount: 0,
    startDate: "—",
    endDate: "—",
    status: "rejected",
    rejectReason: "Attribution to a named artist without authenticity documentation — IP / misrepresentation risk.",
    auditTrail: [
      { id: "a1", type: "reject", detail: "Rejected — unverifiable artist attribution", admin: "Admin Sara", date: "2026-07-02" },
    ],
  },
  {
    _id: "au8",
    title: "Gaming PC — RTX 4090 Build",
    coverImage: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80"],
    seller: { name: "Priya Sharma", photo: "https://ui-avatars.com/api/?name=Priya+Sharma&background=9333ea&color=fff" },
    category: "Electronics",
    tags: ["pc", "gaming"],
    description: "Custom-built PC, RTX 4090, 64GB RAM, liquid cooling — buyer cancelled after payment dispute.",
    startPrice: 1500,
    reservePrice: 1800,
    currentBid: 1650,
    bidCount: 9,
    startDate: "2026-06-20",
    endDate: "2026-06-30",
    status: "cancelled",
    cancelReason: "Cancelled after a confirmed chargeback dispute from the leading bidder.",
    auditTrail: [
      { id: "a1", type: "approve", detail: "Listing approved after review", admin: "Admin Rafiq", date: "2026-06-19" },
      { id: "a2", type: "cancel", detail: "Cancelled — chargeback dispute confirmed", admin: "Admin Rafiq", date: "2026-06-30" },
    ],
  },
  {
    _id: "au9",
    title: "Signed First-Edition Novel Set",
    coverImage: "https://images.unsplash.com/photo-1521123845560-14093637aa7d?w=600&q=80",
    images: ["https://images.unsplash.com/photo-1521123845560-14093637aa7d?w=600&q=80"],
    seller: { name: "Aisha Patel", photo: "https://ui-avatars.com/api/?name=Aisha+Patel&background=065f46&color=fff" },
    category: "Collectibles",
    tags: ["books", "signed", "first-edition"],
    description: "Set of three signed first editions, stored in climate-controlled conditions.",
    startPrice: 300,
    reservePrice: 400,
    currentBid: 410,
    bidCount: 17,
    startDate: "2026-07-02",
    endDate: "2026-07-11",
    status: "live",
    pinned: true,
    auditTrail: [
      { id: "a1", type: "approve", detail: "Listing approved after review", admin: "Admin Sara", date: "2026-07-02" },
      { id: "a2", type: "pin", detail: "Pinned to top of Collectibles category", admin: "Admin Sara", date: "2026-07-03" },
    ],
  },
];

// ─── Config ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<AuctionStatus, { label: string; icon: React.JSX.Element; color: string }> = {
  pending: { label: "Pending Review", icon: <Clock className="w-3.5 h-3.5" />, color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  live: { label: "Live", icon: <PlayCircle className="w-3.5 h-3.5" />, color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  paused: { label: "Paused", icon: <PauseCircle className="w-3.5 h-3.5" />, color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
  rejected: { label: "Rejected", icon: <XCircle className="w-3.5 h-3.5" />, color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
  cancelled: { label: "Cancelled", icon: <Ban className="w-3.5 h-3.5" />, color: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
};

const AUDIT_ICON: Record<AuctionAuditEntry["type"], React.JSX.Element> = {
  approve: <CheckCircle className="w-3.5 h-3.5" />,
  reject: <XCircle className="w-3.5 h-3.5" />,
  pause: <PauseCircle className="w-3.5 h-3.5" />,
  resume: <PlayCircle className="w-3.5 h-3.5" />,
  cancel: <Ban className="w-3.5 h-3.5" />,
  delete: <Trash2 className="w-3.5 h-3.5" />,
  extend: <TimerReset className="w-3.5 h-3.5" />,
  feature: <Star className="w-3.5 h-3.5" />,
  highlight: <Sparkles className="w-3.5 h-3.5" />,
  pin: <Pin className="w-3.5 h-3.5" />,
  flag: <Flag className="w-3.5 h-3.5" />,
  unflag: <CheckCircle className="w-3.5 h-3.5" />,
  edit: <Settings2 className="w-3.5 h-3.5" />,
};

const PAGE_SIZE = 5;
const STATUS_TABS = [
  { key: "all", label: "All Auctions" },
  { key: "pending", label: "Pending Review" },
  { key: "live", label: "Live" },
  { key: "paused", label: "Paused" },
  { key: "rejected", label: "Rejected" },
  { key: "cancelled", label: "Cancelled" },
] as const;
type StatusTabKey = (typeof STATUS_TABS)[number]["key"];

// ─── Component ─────────────────────────────────────────────────────────────

export default function AuctionManagementPage() {
  const { isDarkMode } = useTheme();

  const [auctions, setAuctions] = useState<Auction[]>(MOCK_AUCTIONS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<StatusTabKey>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showFlagForm, setShowFlagForm] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [showExtendForm, setShowExtendForm] = useState(false);
  const [extendHours, setExtendHours] = useState(24);
  const [showFeatureForm, setShowFeatureForm] = useState(false);
  const [featureDays, setFeatureDays] = useState(7);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryAttrs, setNewCategoryAttrs] = useState("");

  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const divider = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const panel = isDarkMode ? "bg-slate-700/40" : "bg-slate-50";
  const inputCls = `w-full px-3 py-2 text-sm rounded-xl border outline-none transition-all ${
    isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
  }`;

  const selected = useMemo(() => auctions.find(a => a._id === selectedId) || null, [auctions, selectedId]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, activeTab, categoryFilter]);

  const statusCounts = auctions.reduce((acc: Record<string, number>, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {});

  const filtered = useMemo(() => {
    return auctions.filter(a => {
      const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.seller.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "all" || a.status === activeTab;
      const matchesCategory = categoryFilter === "all" || a.category === categoryFilter;
      return matchesSearch && matchesTab && matchesCategory;
    });
  }, [auctions, searchQuery, activeTab, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const stats = [
    { label: "Total Auctions", value: auctions.length, icon: <Gavel className="w-4 h-4" />, color: "text-violet-400", bg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50", bar: "from-violet-500 to-blue-500" },
    { label: "Pending Review", value: statusCounts.pending || 0, icon: <Clock className="w-4 h-4" />, color: "text-amber-400", bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50", bar: "from-amber-500 to-orange-500" },
    { label: "Live Now", value: statusCounts.live || 0, icon: <PlayCircle className="w-4 h-4" />, color: "text-emerald-400", bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50", bar: "from-emerald-500 to-teal-500" },
    { label: "Flagged Items", value: auctions.filter(a => a.flagged).length, icon: <Flag className="w-4 h-4" />, color: "text-rose-400", bg: isDarkMode ? "bg-rose-500/10" : "bg-rose-50", bar: "from-rose-500 to-pink-500" },
  ];

  // ── helpers ──────────────────────────────────────────────────────────────
  const addAudit = (id: string, entry: Omit<AuctionAuditEntry, "id">) => {
    setAuctions(prev => prev.map(a => a._id === id ? { ...a, auditTrail: [{ ...entry, id: `aud-${Date.now()}` }, ...a.auditTrail] } : a));
  };
  const today = () => new Date().toISOString().slice(0, 10);

  const resetModalForms = () => {
    setShowRejectForm(false); setRejectReason("");
    setShowCancelForm(false); setCancelReason("");
    setShowFlagForm(false); setFlagReason("");
    setShowExtendForm(false); setExtendHours(24);
    setShowFeatureForm(false); setFeatureDays(7);
  };
  const openModal = (a: Auction) => { setSelectedId(a._id); resetModalForms(); };
  const closeModal = () => setSelectedId(null);

  // ── moderation actions ──────────────────────────────────────────────────
  const approveAuction = (a: Auction) => {
    setAuctions(prev => prev.map(x => x._id === a._id ? { ...x, status: "live", startDate: today(), endDate: "TBD" } : x));
    addAudit(a._id, { type: "approve", detail: "Listing approved and published", admin: "You", date: today() });
    toast.success(`"${a.title}" approved and is now live`);
  };

  const rejectAuction = (a: Auction) => {
    if (!rejectReason.trim()) { toast.error("Please provide a rejection reason"); return; }
    setAuctions(prev => prev.map(x => x._id === a._id ? { ...x, status: "rejected", rejectReason: rejectReason.trim() } : x));
    addAudit(a._id, { type: "reject", detail: `Rejected — ${rejectReason.trim()}`, admin: "You", date: today() });
    toast.error(`"${a.title}" rejected`);
    setShowRejectForm(false); setRejectReason("");
  };

  const pauseAuction = (a: Auction) => {
    setAuctions(prev => prev.map(x => x._id === a._id ? { ...x, status: "paused" } : x));
    addAudit(a._id, { type: "pause", detail: "Auction paused by admin", admin: "You", date: today() });
    toast.success(`"${a.title}" paused`);
  };

  const resumeAuction = (a: Auction) => {
    setAuctions(prev => prev.map(x => x._id === a._id ? { ...x, status: "live" } : x));
    addAudit(a._id, { type: "resume", detail: "Auction resumed by admin", admin: "You", date: today() });
    toast.success(`"${a.title}" resumed`);
  };

  const forceCloseAuction = (a: Auction) => {
    setAuctions(prev => prev.map(x => x._id === a._id ? { ...x, status: "cancelled", cancelReason: "Force-closed by admin (abuse review)" } : x));
    addAudit(a._id, { type: "cancel", detail: "Force-closed immediately — abuse case", admin: "You", date: today() });
    toast.error(`"${a.title}" force-closed`);
  };

  const cancelAuction = (a: Auction) => {
    if (!cancelReason.trim()) { toast.error("Please provide a cancellation reason"); return; }
    setAuctions(prev => prev.map(x => x._id === a._id ? { ...x, status: "cancelled", cancelReason: cancelReason.trim() } : x));
    addAudit(a._id, { type: "cancel", detail: `Cancelled — ${cancelReason.trim()}`, admin: "You", date: today() });
    toast.error(`"${a.title}" cancelled`);
    setShowCancelForm(false); setCancelReason("");
  };

  const deleteAuction = (a: Auction) => {
    if (!window.confirm(`Permanently delete "${a.title}"? This cannot be undone.`)) return;
    setAuctions(prev => prev.filter(x => x._id !== a._id));
    toast.success(`"${a.title}" deleted`);
    closeModal();
  };

  const extendAuction = (a: Auction) => {
    addAudit(a._id, { type: "extend", detail: `Extended by ${extendHours} hours`, admin: "You", date: today() });
    toast.success(`"${a.title}" extended by ${extendHours} hours`);
    setShowExtendForm(false); setExtendHours(24);
  };

  const flagAuction = (a: Auction) => {
    if (!flagReason.trim()) { toast.error("Please provide a reason for flagging"); return; }
    setAuctions(prev => prev.map(x => x._id === a._id ? { ...x, flagged: { reason: flagReason.trim(), date: today() } } : x));
    addAudit(a._id, { type: "flag", detail: `Flagged as prohibited/suspicious — ${flagReason.trim()}`, admin: "You", date: today() });
    toast.error(`"${a.title}" flagged for review`);
    setShowFlagForm(false); setFlagReason("");
  };

  const unflagAuction = (a: Auction) => {
    setAuctions(prev => prev.map(x => x._id === a._id ? { ...x, flagged: undefined } : x));
    addAudit(a._id, { type: "unflag", detail: "Flag cleared after review — no action needed", admin: "You", date: today() });
    toast.success(`"${a.title}" flag cleared`);
  };

  const toggleHighlight = (a: Auction) => {
    setAuctions(prev => prev.map(x => x._id === a._id ? { ...x, highlighted: !x.highlighted } : x));
    addAudit(a._id, { type: "highlight", detail: a.highlighted ? "Highlight removed" : "Highlighted for extra visibility", admin: "You", date: today() });
    toast.success(a.highlighted ? `Highlight removed from "${a.title}"` : `"${a.title}" highlighted`);
  };

  const togglePin = (a: Auction) => {
    setAuctions(prev => prev.map(x => x._id === a._id ? { ...x, pinned: !x.pinned } : x));
    addAudit(a._id, { type: "pin", detail: a.pinned ? "Unpinned from category top" : "Pinned to top of category", admin: "You", date: today() });
    toast.success(a.pinned ? `"${a.title}" unpinned` : `"${a.title}" pinned to top`);
  };

  const applyFeature = (a: Auction) => {
    const until = new Date(Date.now() + featureDays * 86400000).toISOString().slice(0, 10);
    setAuctions(prev => prev.map(x => x._id === a._id ? { ...x, featuredUntil: until } : x));
    addAudit(a._id, { type: "feature", detail: `Featured slot purchased for ${featureDays} days (until ${until})`, admin: "You", date: today() });
    toast.success(`"${a.title}" featured until ${until}`);
    setShowFeatureForm(false);
  };

  const removeFeature = (a: Auction) => {
    setAuctions(prev => prev.map(x => x._id === a._id ? { ...x, featuredUntil: undefined } : x));
    addAudit(a._id, { type: "feature", detail: "Featured placement removed", admin: "You", date: today() });
    toast.success(`Featured placement removed from "${a.title}"`);
  };

  // ── category management ──────────────────────────────────────────────────
  const addCategory = () => {
    if (!newCategoryName.trim()) { toast.error("Category name is required"); return; }
    const attrs = newCategoryAttrs.split(",").map(s => s.trim()).filter(Boolean);
    setCategories(prev => [...prev, { id: `c-${Date.now()}`, name: newCategoryName.trim(), attributes: attrs }]);
    toast.success(`Category "${newCategoryName.trim()}" created`);
    setNewCategoryName(""); setNewCategoryAttrs("");
  };
  const deleteCategory = (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    setCategories(prev => prev.filter(c => c.id !== id));
    toast.success(`Category "${name}" deleted`);
  };

  // ── Pagination ───────────────────────────────────────────────────────────
  const Pagination = () => (
    <div className={`flex items-center justify-between px-5 py-4 border-t ${divider}`}>
      <p className={`text-xs ${muted}`}>Showing {filtered.length === 0 ? 0 : (pageSafe - 1) * PAGE_SIZE + 1}–{Math.min(pageSafe * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
      <div className="flex items-center gap-1.5">
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={pageSafe === 1} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium ${p === pageSafe ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"}`}>{p}</button>
        ))}
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={pageSafe === totalPages} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  const reserveMet = selected ? selected.currentBid >= selected.reservePrice : false;

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px", borderRadius: "10px", background: isDarkMode ? "#1e293b" : "#fff", color: isDarkMode ? "#f1f5f9" : "#0f172a", border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0" } }} />

      {/* Header */}
      <div className={`sticky top-0 z-20 border-b backdrop-blur-xl ${isDarkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-slate-200"}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold tracking-tight">Auction Management</h1>
              <p className={`text-xs mt-0.5 ${muted}`}>Moderate listings, manage lifecycle actions and promoted placements</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`relative w-full sm:w-64 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
                <input type="text" placeholder="Search title or seller..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-8 py-2 text-sm rounded-xl border outline-none transition-all ${isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"}`} />
                {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-3.5 h-3.5" /></button>}
              </div>
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className={`text-sm rounded-xl border px-3 py-2 outline-none ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
                <option value="all">All categories</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <button onClick={() => setShowCategoryModal(true)} className={`flex items-center gap-1.5 text-sm font-medium px-3.5 py-2 rounded-xl border transition-colors ${isDarkMode ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
                <Tags className="w-3.5 h-3.5" /> Categories
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
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

        {/* Status Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto no-scrollbar">
          {STATUS_TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"}`}>
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${activeTab === tab.key ? "bg-white/20" : isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>{tab.key === "all" ? auctions.length : statusCounts[tab.key] || 0}</span>
            </button>
          ))}
        </div>

        {/* List */}
        <div className={`rounded-2xl border ${surface}`}>
          {paginated.length > 0 ? (
            <div className="divide-y divide-slate-700/40">
              {paginated.map((a, i) => (
                <motion.div key={a._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className={`flex flex-col md:flex-row md:items-center gap-3 md:gap-4 px-5 py-4 ${isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-slate-50"} transition-colors`}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img src={a.coverImage} alt={a.title} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${strong}`}>{a.title}</p>
                      <p className={`text-xs truncate ${muted}`}>{a.seller.name} · {a.category}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_CONFIG[a.status].color}`}>{STATUS_CONFIG[a.status].icon} {STATUS_CONFIG[a.status].label}</span>
                    {a.featuredUntil && <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${isDarkMode ? "bg-amber-500/15 text-amber-400 border-amber-500/20" : "bg-amber-50 text-amber-600 border-amber-200"}`}><Star className="w-3 h-3" /> Featured</span>}
                    {a.highlighted && <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${isDarkMode ? "bg-sky-500/15 text-sky-400 border-sky-500/20" : "bg-sky-50 text-sky-600 border-sky-200"}`}><Sparkles className="w-3 h-3" /> Highlighted</span>}
                    {a.pinned && <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${isDarkMode ? "bg-violet-500/15 text-violet-400 border-violet-500/20" : "bg-violet-50 text-violet-600 border-violet-200"}`}><Pin className="w-3 h-3" /> Pinned</span>}
                    {a.flagged && <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${isDarkMode ? "bg-rose-500/15 text-rose-400 border-rose-500/20" : "bg-rose-50 text-rose-600 border-rose-200"}`}><Flag className="w-3 h-3" /> Flagged</span>}
                  </div>

                  <div className={`hidden lg:block text-xs ${muted} w-36 shrink-0`}>
                    <p>Bid ${a.currentBid} · {a.bidCount} bids</p>
                    <p>Ends {a.endDate}</p>
                  </div>

                  <button onClick={() => openModal(a)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors shrink-0">
                    <Eye className="w-3.5 h-3.5" /> Manage
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center">
              <Gavel className={`w-12 h-12 mx-auto mb-4 ${muted}`} />
              <p className={`text-lg font-medium ${strong}`}>No auctions found</p>
              <p className={muted}>Try adjusting your search or filters</p>
            </div>
          )}
          {filtered.length > 0 && <Pagination />}
        </div>
      </div>

      {/* ── Auction detail modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={closeModal}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} className={`w-full max-w-3xl rounded-2xl ${surface} max-h-[92vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
              <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-10 ${surface} ${divider}`}>
                <div className="flex items-center gap-4 min-w-0">
                  <img src={selected.coverImage} alt={selected.title} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                  <div className="min-w-0">
                    <h3 className={`text-lg font-semibold truncate ${strong}`}>{selected.title}</h3>
                    <p className={`text-sm ${muted}`}>{selected.seller.name} · {selected.category}</p>
                  </div>
                </div>
                <button onClick={closeModal} className={`p-2 rounded-lg ${muted}`}><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-7">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_CONFIG[selected.status].color}`}>{STATUS_CONFIG[selected.status].icon} {STATUS_CONFIG[selected.status].label}</span>
                  {selected.featuredUntil && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-amber-500/15 text-amber-400 border-amber-500/20"><Star className="w-3.5 h-3.5" /> Featured until {selected.featuredUntil}</span>}
                  {selected.highlighted && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-sky-500/15 text-sky-400 border-sky-500/20"><Sparkles className="w-3.5 h-3.5" /> Highlighted</span>}
                  {selected.pinned && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-violet-500/15 text-violet-400 border-violet-500/20"><Pin className="w-3.5 h-3.5" /> Pinned</span>}
                </div>

                {/* Description & images */}
                <div className="space-y-3">
                  <p className={`text-sm leading-relaxed p-3 rounded-xl ${panel}`}>{selected.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.tags.map(t => <span key={t} className={`px-2.5 py-1 rounded-full text-xs ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>#{t}</span>)}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {selected.images.map((img, idx) => <img key={idx} src={img} className="rounded-xl w-full aspect-square object-cover border" />)}
                    {selected.images.length < 3 && (
                      <div className={`rounded-xl aspect-square flex items-center justify-center border border-dashed ${isDarkMode ? "border-slate-600 text-slate-500" : "border-slate-300 text-slate-400"}`}>
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing checks */}
                <div className={`rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm ${panel}`}>
                  <div><p className={muted}>Start price</p><p className={strong}>${selected.startPrice}</p></div>
                  <div><p className={muted}>Reserve price</p><p className={strong}>${selected.reservePrice}</p></div>
                  <div><p className={muted}>Current bid</p><p className={strong}>${selected.currentBid} <span className={muted}>({selected.bidCount} bids)</span></p></div>
                  <div>
                    <p className={muted}>Reserve status</p>
                    {selected.status === "live" ? (
                      <p className={reserveMet ? "text-emerald-500 font-medium" : "text-amber-500 font-medium"}>{reserveMet ? "Met" : "Not met"}</p>
                    ) : <p className={strong}>—</p>}
                  </div>
                </div>

                {/* Reason banners */}
                {selected.rejectReason && (
                  <div className={`rounded-xl p-3 text-sm flex items-start gap-2 ${isDarkMode ? "bg-rose-500/10" : "bg-rose-50"}`}><XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" /><p className={strong}>{selected.rejectReason}</p></div>
                )}
                {selected.cancelReason && (
                  <div className={`rounded-xl p-3 text-sm flex items-start gap-2 ${isDarkMode ? "bg-slate-700/50" : "bg-slate-100"}`}><Ban className="w-4 h-4 shrink-0 mt-0.5" /><p className={strong}>{selected.cancelReason}</p></div>
                )}
                {selected.flagged && (
                  <div className={`rounded-xl p-3 text-sm space-y-2 ${isDarkMode ? "bg-rose-500/10" : "bg-rose-50"}`}>
                    <p className="flex items-center gap-2 font-medium text-rose-500"><Flag className="w-4 h-4" /> Flagged as prohibited / suspicious</p>
                    <p className={muted}>{selected.flagged.reason} · {selected.flagged.date}</p>
                    <div className="flex gap-2">
                      <button onClick={() => unflagAuction(selected)} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white">Clear flag</button>
                      <button onClick={() => deleteAuction(selected)} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white">Remove listing</button>
                    </div>
                  </div>
                )}

                {/* Moderation actions */}
                <div className={`rounded-2xl p-5 space-y-3 ${panel}`}>
                  <p className={`text-sm font-semibold ${strong}`}>Moderation actions</p>

                  {selected.status === "pending" && !showRejectForm && (
                    <div className="flex gap-3">
                      <button onClick={() => approveAuction(selected)} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> Approve listing</button>
                      <button onClick={() => setShowRejectForm(true)} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"><XCircle className="w-4 h-4" /> Reject</button>
                    </div>
                  )}
                  {selected.status === "pending" && showRejectForm && (
                    <div className="space-y-3">
                      <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={2} placeholder="Reason for rejection (shown to seller)..." className={inputCls} />
                      <div className="flex gap-2">
                        <button onClick={() => rejectAuction(selected)} className="px-4 py-2 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white">Confirm rejection</button>
                        <button onClick={() => setShowRejectForm(false)} className={`px-4 py-2 rounded-lg text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                      </div>
                    </div>
                  )}

                  {selected.status === "live" && (
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => pauseAuction(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-500 hover:bg-sky-600 text-white"><PauseCircle className="w-3.5 h-3.5" /> Pause</button>
                      <button onClick={() => forceCloseAuction(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-600 hover:bg-slate-700 text-white"><Ban className="w-3.5 h-3.5" /> Force-close (abuse)</button>
                      {!showCancelForm ? (
                        <button onClick={() => setShowCancelForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white"><XCircle className="w-3.5 h-3.5" /> Cancel</button>
                      ) : null}
                      {!showExtendForm ? (
                        <button onClick={() => setShowExtendForm(true)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}><TimerReset className="w-3.5 h-3.5" /> Extend</button>
                      ) : null}
                      {!selected.flagged && !showFlagForm ? (
                        <button onClick={() => setShowFlagForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/15 text-rose-500 border border-rose-500/30"><Flag className="w-3.5 h-3.5" /> Flag prohibited item</button>
                      ) : null}
                    </div>
                  )}
                  {selected.status === "live" && showCancelForm && (
                    <div className="space-y-2">
                      <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)} rows={2} placeholder="Reason for cancellation..." className={inputCls} />
                      <div className="flex gap-2">
                        <button onClick={() => cancelAuction(selected)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white">Confirm cancel</button>
                        <button onClick={() => setShowCancelForm(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Back</button>
                      </div>
                    </div>
                  )}
                  {selected.status === "live" && showExtendForm && (
                    <div className="flex items-center gap-2">
                      <label className={`text-xs ${muted}`}>Extend by (hours)</label>
                      <input type="number" min={1} value={extendHours} onChange={e => setExtendHours(Number(e.target.value))} className={`${inputCls} w-24`} />
                      <button onClick={() => extendAuction(selected)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white">Apply</button>
                      <button onClick={() => setShowExtendForm(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                    </div>
                  )}
                  {selected.status === "live" && showFlagForm && (
                    <div className="space-y-2">
                      <textarea value={flagReason} onChange={e => setFlagReason(e.target.value)} rows={2} placeholder="Why is this item being flagged?" className={inputCls} />
                      <div className="flex gap-2">
                        <button onClick={() => flagAuction(selected)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white">Flag item</button>
                        <button onClick={() => setShowFlagForm(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                      </div>
                    </div>
                  )}

                  {selected.status === "paused" && (
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => resumeAuction(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white"><PlayCircle className="w-3.5 h-3.5" /> Resume</button>
                      {!showCancelForm ? (
                        <button onClick={() => setShowCancelForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white"><XCircle className="w-3.5 h-3.5" /> Cancel</button>
                      ) : (
                        <div className="w-full space-y-2">
                          <textarea value={cancelReason} onChange={e => setCancelReason(e.target.value)} rows={2} placeholder="Reason for cancellation..." className={inputCls} />
                          <div className="flex gap-2">
                            <button onClick={() => cancelAuction(selected)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white">Confirm cancel</button>
                            <button onClick={() => setShowCancelForm(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Back</button>
                          </div>
                        </div>
                      )}
                      <button onClick={() => deleteAuction(selected)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                    </div>
                  )}

                  {(selected.status === "rejected" || selected.status === "cancelled") && (
                    <button onClick={() => deleteAuction(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white"><Trash2 className="w-3.5 h-3.5" /> Delete permanently</button>
                  )}
                </div>

                {/* Promotion & placement */}
                {selected.status === "live" && (
                  <div className={`rounded-2xl p-5 space-y-3 ${panel}`}>
                    <p className={`text-sm font-semibold ${strong}`}>Promotion & placement <span className={`font-normal text-xs ${muted}`}>— featured slots are a paid placement revenue stream</span></p>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => toggleHighlight(selected)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${selected.highlighted ? "bg-sky-500/15 text-sky-400 border-sky-500/30" : isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}>
                        <Sparkles className="w-3.5 h-3.5" /> {selected.highlighted ? "Remove highlight" : "Highlight"}
                      </button>
                      <button onClick={() => togglePin(selected)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${selected.pinned ? "bg-violet-500/15 text-violet-400 border-violet-500/30" : isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}>
                        <Pin className="w-3.5 h-3.5" /> {selected.pinned ? "Unpin" : "Pin to top"}
                      </button>
                      {selected.featuredUntil ? (
                        <button onClick={() => removeFeature(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30"><Star className="w-3.5 h-3.5" /> Remove feature</button>
                      ) : !showFeatureForm ? (
                        <button onClick={() => setShowFeatureForm(true)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}><Star className="w-3.5 h-3.5" /> Feature listing</button>
                      ) : null}
                    </div>
                    {showFeatureForm && !selected.featuredUntil && (
                      <div className="flex items-center gap-2">
                        <label className={`text-xs ${muted}`}>Duration (days)</label>
                        <input type="number" min={1} value={featureDays} onChange={e => setFeatureDays(Number(e.target.value))} className={`${inputCls} w-24`} />
                        <button onClick={() => applyFeature(selected)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white">Confirm</button>
                        <button onClick={() => setShowFeatureForm(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                      </div>
                    )}
                  </div>
                )}

                {/* Audit trail */}
                <div className="space-y-3">
                  <p className={`text-sm font-semibold flex items-center gap-2 ${strong}`}><History className="w-4 h-4" /> Audit trail</p>
                  {selected.auditTrail.length === 0 ? (
                    <p className={`text-sm ${muted}`}>No moderation actions recorded yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {selected.auditTrail.map(entry => (
                        <div key={entry.id} className={`flex items-start gap-3 px-3 py-2.5 rounded-xl ${panel}`}>
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>{AUDIT_ICON[entry.type]}</div>
                          <div className="min-w-0"><p className={`text-sm ${strong}`}>{entry.detail}</p><p className={`text-xs ${muted}`}>{entry.admin} · {entry.date}</p></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Category & tag management modal ──────────────────────────── */}
      <AnimatePresence>
        {showCategoryModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowCategoryModal(false)}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} className={`w-full max-w-xl rounded-2xl ${surface} max-h-[88vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
              <div className={`p-6 border-b flex items-center justify-between ${divider}`}>
                <h3 className={`text-lg font-semibold flex items-center gap-2 ${strong}`}><Tags className="w-5 h-5" /> Category & tag management</h3>
                <button onClick={() => setShowCategoryModal(false)} className={`p-2 rounded-lg ${muted}`}><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  {categories.map(c => (
                    <div key={c.id} className={`flex items-start justify-between px-4 py-3 rounded-xl ${panel}`}>
                      <div>
                        <p className={`text-sm font-medium ${strong}`}>{c.name}</p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {c.attributes.map(attr => <span key={attr} className={`px-2 py-0.5 rounded-full text-[11px] ${isDarkMode ? "bg-slate-800 text-slate-300" : "bg-white text-slate-600 border border-slate-200"}`}>{attr}</span>)}
                        </div>
                      </div>
                      <button onClick={() => deleteCategory(c.id, c.name)} className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 shrink-0"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
                <div className={`rounded-xl p-4 space-y-2.5 border border-dashed ${isDarkMode ? "border-slate-600" : "border-slate-300"}`}>
                  <p className={`text-xs font-medium ${strong}`}>Add new category</p>
                  <input value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="Category name" className={inputCls} />
                  <input value={newCategoryAttrs} onChange={e => setNewCategoryAttrs(e.target.value)} placeholder="Attributes, comma separated (e.g. Brand, Condition)" className={inputCls} />
                  <button onClick={addCategory} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white"><Plus className="w-3.5 h-3.5" /> Add category</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}