import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Ban,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Edit3,
  Eye,
  Gavel,
  Lock,
  PlayCircle,
  Plus,
  Search,
  Send,
  Trash2,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "../../../../../hooks/useTheme";

// ─── Types ─────────────────────────────────────────────────────────────────

type AuctionStatus = "draft" | "pending_approval" | "scheduled" | "live" | "ended_sold" | "ended_unsold" | "rejected" | "cancelled";
type Condition = "New" | "Like New" | "Used" | "For Parts";
type IncrementType = "fixed" | "percentage";

interface SellerAuction {
  _id: string;
  title: string;
  coverImage: string;
  category: string;
  condition: Condition;
  description: string;
  startPrice: number;
  reservePrice: number;
  buyNowPrice?: number;
  bidIncrement: number;
  incrementType: IncrementType;
  durationDays: number;
  scheduledStart?: string;
  endDate?: string;
  currentBid: number;
  bidCount: number;
  views: number;
  status: AuctionStatus;
  rejectReason?: string;
}

interface AuctionForm {
  title: string;
  description: string;
  images: string[];
  category: string;
  condition: Condition;
  startPrice: number;
  reservePrice: number;
  buyNowPrice: number | "";
  bidIncrement: number;
  incrementType: IncrementType;
  durationDays: number;
  startMode: "now" | "scheduled";
  scheduledStart: string;
}

const CATEGORIES = ["Electronics", "Collectibles", "Art", "Vehicles", "Instruments", "Fashion"];
const CONDITIONS: Condition[] = ["New", "Like New", "Used", "For Parts"];

const EMPTY_FORM: AuctionForm = {
  title: "", description: "", images: [], category: CATEGORIES[0], condition: "Used",
  startPrice: 0, reservePrice: 0, buyNowPrice: "", bidIncrement: 5, incrementType: "fixed",
  durationDays: 7, startMode: "now", scheduledStart: "",
};

// ─── Mock data ─────────────────────────────────────────────────────────────

const MOCK_AUCTIONS: SellerAuction[] = [
  {
    _id: "sa1", title: "Antique Pocket Watch — 18k Gold", coverImage: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&q=80",
    category: "Collectibles", condition: "Used", description: "Swiss-made 18k gold pocket watch, circa 1890s, working condition with recent servicing.",
    startPrice: 600, reservePrice: 900, bidIncrement: 20, incrementType: "fixed", durationDays: 7, endDate: "2026-07-09",
    currentBid: 940, bidCount: 22, views: 1204, status: "live",
  },
  {
    _id: "sa2", title: "Hand-carved Rosewood Chess Set", coverImage: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=400&q=80",
    category: "Collectibles", condition: "New", description: "Hand-carved rosewood and maple chess set, weighted pieces, felted board.",
    startPrice: 120, reservePrice: 150, bidIncrement: 5, incrementType: "fixed", durationDays: 7, endDate: "2026-07-10",
    currentBid: 95, bidCount: 6, views: 340, status: "live",
  },
  {
    _id: "sa3", title: "Restored Turntable — Technics SL-1200", coverImage: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&q=80",
    category: "Electronics", condition: "Like New", description: "Fully serviced Technics SL-1200 with new belt and stylus, sounds incredible.",
    startPrice: 350, reservePrice: 500, bidIncrement: 10, incrementType: "fixed", durationDays: 5,
    currentBid: 0, bidCount: 0, views: 0, status: "pending_approval",
  },
  {
    _id: "sa4", title: "Leather Messenger Bag — Handmade", coverImage: "https://images.unsplash.com/photo-1547949003-9792a18a2645?w=400&q=80",
    category: "Fashion", condition: "New", description: "Full-grain leather messenger bag, hand-stitched, brass hardware.",
    startPrice: 80, reservePrice: 120, bidIncrement: 5, incrementType: "fixed", durationDays: 6,
    scheduledStart: "2026-07-12 09:00", currentBid: 0, bidCount: 0, views: 0, status: "scheduled",
  },
  {
    _id: "sa5", title: "Vintage Polaroid SX-70 Camera", coverImage: "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=400&q=80",
    category: "Electronics", condition: "Used", description: "Working SX-70 with folding mechanism intact, light wear on the leatherette.",
    startPrice: 90, reservePrice: 130, bidIncrement: 5, incrementType: "fixed", durationDays: 5,
    currentBid: 0, bidCount: 0, views: 12, status: "draft",
  },
  {
    _id: "sa6", title: "Set of Bone China Teacups", coverImage: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=80",
    category: "Collectibles", condition: "Used", description: "Set of six bone china teacups with saucers, floral pattern, no chips.",
    startPrice: 40, reservePrice: 60, bidIncrement: 5, incrementType: "fixed", durationDays: 7, endDate: "2026-06-20",
    currentBid: 0, bidCount: 0, views: 210, status: "ended_unsold",
  },
  {
    _id: "sa7", title: "Signed First-Edition Novel Set", coverImage: "https://images.unsplash.com/photo-1521123845560-14093637aa7d?w=400&q=80",
    category: "Collectibles", condition: "Like New", description: "Set of three signed first editions, stored in climate-controlled conditions.",
    startPrice: 300, reservePrice: 400, bidIncrement: 10, incrementType: "fixed", durationDays: 9, endDate: "2026-06-24",
    currentBid: 410, bidCount: 17, views: 890, status: "ended_sold",
  },
  {
    _id: "sa8", title: "Unmarked 'Rolex-style' Watch", coverImage: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&q=80",
    category: "Collectibles", condition: "Used", description: "Automatic watch, Rolex-style design, no brand markings.",
    startPrice: 200, reservePrice: 300, bidIncrement: 10, incrementType: "fixed", durationDays: 5,
    currentBid: 0, bidCount: 0, views: 0, status: "rejected",
    rejectReason: "Listing implies a branded item without authorization — please clarify it is an unbranded replica in the title and description.",
  },
];

// ─── Config ────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<AuctionStatus, { label: string; icon: React.JSX.Element; color: string }> = {
  draft: { label: "Draft", icon: <Edit3 className="w-3.5 h-3.5" />, color: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
  pending_approval: { label: "Pending Approval", icon: <Clock className="w-3.5 h-3.5" />, color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  scheduled: { label: "Scheduled", icon: <CalendarClock className="w-3.5 h-3.5" />, color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
  live: { label: "Live", icon: <PlayCircle className="w-3.5 h-3.5" />, color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  ended_sold: { label: "Sold", icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  ended_unsold: { label: "Ended — Unsold", icon: <XCircle className="w-3.5 h-3.5" />, color: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
  rejected: { label: "Rejected", icon: <XCircle className="w-3.5 h-3.5" />, color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
  cancelled: { label: "Cancelled", icon: <Ban className="w-3.5 h-3.5" />, color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
};

const PAGE_SIZE = 5;
const TABS = [
  { key: "all", label: "All" },
  { key: "draft", label: "Drafts" },
  { key: "pending_approval", label: "Pending Approval" },
  { key: "scheduled", label: "Scheduled" },
  { key: "live", label: "Live" },
  { key: "ended", label: "Ended" },
  { key: "rejected", label: "Rejected" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const editableStatuses: AuctionStatus[] = ["draft", "pending_approval", "scheduled"];

// ─── Component ─────────────────────────────────────────────────────────────

export default function SellerAuctionManagementPage() {
  const { isDarkMode } = useTheme();

  const [auctions, setAuctions] = useState<SellerAuction[]>(MOCK_AUCTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AuctionForm>(EMPTY_FORM);

  const [detailId, setDetailId] = useState<string | null>(null);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelConfirmText, setCancelConfirmText] = useState("");

  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const divider = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const panel = isDarkMode ? "bg-slate-700/40" : "bg-slate-50";
  const inputCls = `w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none transition-all ${
    isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
  }`;

  const detail = useMemo(() => auctions.find(a => a._id === detailId) || null, [auctions, detailId]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, activeTab]);

  const tabCounts = {
    draft: auctions.filter(a => a.status === "draft").length,
    pending_approval: auctions.filter(a => a.status === "pending_approval").length,
    scheduled: auctions.filter(a => a.status === "scheduled").length,
    live: auctions.filter(a => a.status === "live").length,
    ended: auctions.filter(a => a.status === "ended_sold" || a.status === "ended_unsold").length,
    rejected: auctions.filter(a => a.status === "rejected").length,
  };

  const filtered = useMemo(() => auctions.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ? true :
      activeTab === "ended" ? (a.status === "ended_sold" || a.status === "ended_unsold") :
      a.status === activeTab;
    return matchesSearch && matchesTab;
  }), [auctions, searchQuery, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  // ── form helpers ────────────────────────────────────────────────────────
  const openCreate = () => { setEditingId(null); setForm(EMPTY_FORM); setShowForm(true); };
  const openEdit = (a: SellerAuction) => {
    setEditingId(a._id);
    setForm({
      title: a.title, description: a.description, images: [a.coverImage], category: a.category, condition: a.condition,
      startPrice: a.startPrice, reservePrice: a.reservePrice, buyNowPrice: a.buyNowPrice ?? "", bidIncrement: a.bidIncrement,
      incrementType: a.incrementType, durationDays: a.durationDays,
      startMode: a.scheduledStart ? "scheduled" : "now", scheduledStart: a.scheduledStart ?? "",
    });
    setShowForm(true);
    setDetailId(null);
  };
  const addImage = (file: File | undefined) => {
    if (!file) return;
    setForm(prev => ({ ...prev, images: [...prev.images, URL.createObjectURL(file)] }));
  };
  const removeImage = (idx: number) => setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  const saveDraft = () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (editingId) {
      setAuctions(prev => prev.map(a => a._id === editingId ? { ...a, ...toAuctionPatch(form), status: a.status === "draft" ? "draft" : a.status } : a));
      toast.success("Draft updated");
    } else {
      const newAuction: SellerAuction = { _id: `sa-${Date.now()}`, ...toAuctionPatch(form), currentBid: 0, bidCount: 0, views: 0, status: "draft" } as SellerAuction;
      setAuctions(prev => [newAuction, ...prev]);
      toast.success("Saved as draft");
    }
    setShowForm(false);
  };

  const submitForApproval = () => {
    if (!form.title.trim() || !form.category || form.startPrice <= 0) { toast.error("Fill in title, category and a valid starting bid"); return; }
    if (editingId) {
      setAuctions(prev => prev.map(a => a._id === editingId ? { ...a, ...toAuctionPatch(form), status: form.startMode === "scheduled" ? "scheduled" : "pending_approval" } : a));
      toast.success(form.startMode === "scheduled" ? "Scheduled — submitted for approval" : "Submitted for admin approval");
    } else {
      const newAuction: SellerAuction = { _id: `sa-${Date.now()}`, ...toAuctionPatch(form), currentBid: 0, bidCount: 0, views: 0, status: form.startMode === "scheduled" ? "scheduled" : "pending_approval" } as SellerAuction;
      setAuctions(prev => [newAuction, ...prev]);
      toast.success(form.startMode === "scheduled" ? "Scheduled — submitted for approval" : "Submitted for admin approval");
    }
    setShowForm(false);
  };

  function toAuctionPatch(f: AuctionForm) {
    return {
      title: f.title, description: f.description, coverImage: f.images[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
      category: f.category, condition: f.condition, startPrice: f.startPrice, reservePrice: f.reservePrice,
      buyNowPrice: f.buyNowPrice === "" ? undefined : Number(f.buyNowPrice), bidIncrement: f.bidIncrement, incrementType: f.incrementType,
      durationDays: f.durationDays, scheduledStart: f.startMode === "scheduled" ? f.scheduledStart : undefined,
    };
  }

  // ── lifecycle actions ───────────────────────────────────────────────────
  const withdrawSubmission = (a: SellerAuction) => {
    setAuctions(prev => prev.map(x => x._id === a._id ? { ...x, status: "draft" } : x));
    toast.success(`"${a.title}" moved back to drafts`);
  };

  const deleteDraft = (a: SellerAuction) => {
    if (!window.confirm(`Delete "${a.title}"? This cannot be undone.`)) return;
    setAuctions(prev => prev.filter(x => x._id !== a._id));
    toast.success(`"${a.title}" deleted`);
    setDetailId(null);
  };

  const relistAuction = (a: SellerAuction) => {
    setEditingId(null);
    setForm({
      title: `${a.title} (Relist)`, description: a.description, images: [a.coverImage], category: a.category, condition: a.condition,
      startPrice: a.startPrice, reservePrice: a.reservePrice, buyNowPrice: a.buyNowPrice ?? "", bidIncrement: a.bidIncrement,
      incrementType: a.incrementType, durationDays: a.durationDays, startMode: "now", scheduledStart: "",
    });
    setShowForm(true);
    setDetailId(null);
    toast.success("Prefilled from previous listing — review and resubmit");
  };

  const cancelAuction = (a: SellerAuction) => {
    const hasBids = a.bidCount > 0;
    if (hasBids && cancelConfirmText !== "CANCEL") { toast.error('Type "CANCEL" to confirm — this listing has active bids'); return; }
    setAuctions(prev => prev.map(x => x._id === a._id ? { ...x, status: "cancelled" } : x));
    toast.error(hasBids ? `"${a.title}" cancelled — cancellation penalty applies` : `"${a.title}" cancelled`);
    setShowCancelForm(false); setCancelConfirmText("");
    setDetailId(null);
  };

  // ── Pagination ───────────────────────────────────────────────────────────
  const Pagination = () => (
    <div className={`flex items-center justify-between px-5 py-4 border-t ${divider}`}>
      <p className={`text-xs ${muted}`}>Showing {filtered.length === 0 ? 0 : (pageSafe - 1) * PAGE_SIZE + 1}–{Math.min(pageSafe * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
      <div className="flex items-center gap-1.5">
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={pageSafe === 1} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}><ChevronLeft className="w-4 h-4" /></button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium ${p === pageSafe ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"}`}>{p}</button>
        ))}
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={pageSafe === totalPages} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}><ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px", borderRadius: "10px", background: isDarkMode ? "#1e293b" : "#fff", color: isDarkMode ? "#f1f5f9" : "#0f172a", border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0" } }} />

      {/* Header */}
      <div className={`sticky top-0 z-20 border-b backdrop-blur-xl ${isDarkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-slate-200"}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight">My Auctions</h1>
              <p className={`text-xs mt-0.5 ${muted}`}>Create, schedule and manage your listings</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`relative w-full sm:w-64 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search your listings..." className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border outline-none ${isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500" : "bg-slate-50 border-slate-200 placeholder-slate-400"}`} />
              </div>
              <button onClick={openCreate} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white shrink-0"><Plus className="w-4 h-4" /> Create Auction</button>
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-6 lg:px-8 pb-3 flex gap-1 overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${activeTab === tab.key ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}>
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${activeTab === tab.key ? "bg-white/20" : isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>{tab.key === "all" ? auctions.length : (tabCounts as any)[tab.key] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className={`rounded-2xl border ${surface}`}>
          {paginated.length > 0 ? (
            <div className="divide-y divide-slate-700/40">
              {paginated.map((a, i) => {
                const canEdit = editableStatuses.includes(a.status) || (a.status === "live" && a.bidCount === 0);
                return (
                  <motion.div key={a._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={`flex flex-col md:flex-row md:items-center gap-3 md:gap-4 px-5 py-4 ${isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-slate-50"} transition-colors`}>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img src={a.coverImage} alt={a.title} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${strong}`}>{a.title}</p>
                        <p className={`text-xs truncate ${muted}`}>{a.category} · {a.condition}{a.status === "live" || a.status === "ended_sold" ? ` · $${a.currentBid} · ${a.bidCount} bids` : ""}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shrink-0 ${STATUS_CFG[a.status].color}`}>{STATUS_CFG[a.status].icon} {STATUS_CFG[a.status].label}</span>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {a.status === "draft" && (
                        <>
                          <button onClick={() => openEdit(a)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}><Edit3 className="w-3.5 h-3.5" /> Edit</button>
                          <button onClick={() => { openEdit(a); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white"><Send className="w-3.5 h-3.5" /> Submit</button>
                        </>
                      )}
                      {a.status === "pending_approval" && (
                        <>
                          <button onClick={() => openEdit(a)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}><Edit3 className="w-3.5 h-3.5" /> Edit</button>
                          <button onClick={() => withdrawSubmission(a)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white">Withdraw</button>
                        </>
                      )}
                      {a.status === "scheduled" && (
                        <button onClick={() => openEdit(a)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}><Edit3 className="w-3.5 h-3.5" /> Edit</button>
                      )}
                      {(a.status === "ended_unsold" || a.status === "cancelled") && (
                        <button onClick={() => relistAuction(a)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white"><Copy className="w-3.5 h-3.5" /> Relist</button>
                      )}
                      {a.status === "rejected" && (
                        <button onClick={() => openEdit(a)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white"><Edit3 className="w-3.5 h-3.5" /> Edit & Resubmit</button>
                      )}
                      <button onClick={() => setDetailId(a._id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}><Eye className="w-3.5 h-3.5" /> Details</button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="p-16 text-center"><Gavel className={`w-12 h-12 mx-auto mb-4 ${muted}`} /><p className={`text-lg font-medium ${strong}`}>No auctions found</p><p className={muted}>Try a different filter or create a new listing</p></div>
          )}
          {filtered.length > 0 && <Pagination />}
        </div>
      </div>

      {/* ── Create / Edit form modal ────────────────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowForm(false)}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} className={`w-full max-w-2xl rounded-2xl ${surface} max-h-[92vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
              <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-10 ${surface} ${divider}`}>
                <h3 className={`text-lg font-semibold ${strong}`}>{editingId ? "Edit Auction" : "Create Auction"}</h3>
                <button onClick={() => setShowForm(false)} className={`p-2 rounded-lg ${muted}`}><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Title</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Vintage Leica M6 Camera" className={inputCls} />
                </div>
                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Condition details, provenance, included accessories..." className={inputCls} />
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Images</label>
                  <div className="flex flex-wrap gap-2">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                        <img src={img} className="w-full h-full object-cover" />
                        <button onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><X className="w-4 h-4 text-white" /></button>
                      </div>
                    ))}
                    <label className={`w-20 h-20 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer ${isDarkMode ? "border-slate-600 hover:border-violet-500" : "border-slate-300 hover:border-violet-400"}`}>
                      <Upload className="w-4 h-4 opacity-50" />
                      <input type="file" accept="image/*" className="hidden" onChange={e => addImage(e.target.files?.[0])} />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Category</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Condition</label>
                    <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value as Condition })} className={inputCls}>
                      {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Starting bid ($)</label>
                    <input type="number" value={form.startPrice} onChange={e => setForm({ ...form, startPrice: Number(e.target.value) })} className={inputCls} />
                  </div>
                  <div>
                    <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Reserve price ($)</label>
                    <input type="number" value={form.reservePrice} onChange={e => setForm({ ...form, reservePrice: Number(e.target.value) })} className={inputCls} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Buy-now price ($, optional)</label>
                    <input type="number" value={form.buyNowPrice} onChange={e => setForm({ ...form, buyNowPrice: e.target.value === "" ? "" : Number(e.target.value) })} className={inputCls} />
                  </div>
                  <div>
                    <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Duration (days)</label>
                    <input type="number" min={1} value={form.durationDays} onChange={e => setForm({ ...form, durationDays: Number(e.target.value) })} className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Bid increment rule</label>
                  <div className="flex gap-2">
                    <div className="flex gap-1">
                      <button onClick={() => setForm({ ...form, incrementType: "fixed" })} className={`px-3 py-2 rounded-lg text-xs font-medium border ${form.incrementType === "fixed" ? "bg-violet-500/15 text-violet-400 border-violet-500/30" : isDarkMode ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"}`}>Fixed $</button>
                      <button onClick={() => setForm({ ...form, incrementType: "percentage" })} className={`px-3 py-2 rounded-lg text-xs font-medium border ${form.incrementType === "percentage" ? "bg-violet-500/15 text-violet-400 border-violet-500/30" : isDarkMode ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"}`}>Percentage %</button>
                    </div>
                    <input type="number" value={form.bidIncrement} onChange={e => setForm({ ...form, bidIncrement: Number(e.target.value) })} className={`${inputCls} flex-1`} />
                  </div>
                </div>

                <div>
                  <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Start time</label>
                  <div className="flex gap-2 mb-2">
                    <button onClick={() => setForm({ ...form, startMode: "now" })} className={`flex-1 py-2 rounded-lg text-xs font-medium border ${form.startMode === "now" ? "bg-violet-500/15 text-violet-400 border-violet-500/30" : isDarkMode ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"}`}>Start immediately (after approval)</button>
                    <button onClick={() => setForm({ ...form, startMode: "scheduled" })} className={`flex-1 py-2 rounded-lg text-xs font-medium border ${form.startMode === "scheduled" ? "bg-violet-500/15 text-violet-400 border-violet-500/30" : isDarkMode ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"}`}>Schedule start</button>
                  </div>
                  {form.startMode === "scheduled" && (
                    <input type="datetime-local" value={form.scheduledStart} onChange={e => setForm({ ...form, scheduledStart: e.target.value })} className={inputCls} />
                  )}
                </div>
              </div>

              <div className={`flex items-center justify-end gap-2.5 px-6 py-4 border-t sticky bottom-0 ${surface} ${divider}`}>
                <button onClick={saveDraft} className={`px-4 py-2 rounded-xl text-sm font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Save as draft</button>
                <button onClick={submitForApproval} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white"><Send className="w-4 h-4" /> Submit for approval</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Detail modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {detail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => { setDetailId(null); setShowCancelForm(false); setCancelConfirmText(""); }}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} className={`w-full max-w-xl rounded-2xl ${surface} max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
              <div className={`p-6 border-b flex items-center justify-between ${divider}`}>
                <div className="flex items-center gap-4 min-w-0">
                  <img src={detail.coverImage} alt={detail.title} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                  <div className="min-w-0"><h3 className={`text-lg font-semibold truncate ${strong}`}>{detail.title}</h3><p className={`text-sm ${muted}`}>{detail.category} · {detail.condition}</p></div>
                </div>
                <button onClick={() => setDetailId(null)} className={`p-2 rounded-lg ${muted}`}><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-6">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_CFG[detail.status].color}`}>{STATUS_CFG[detail.status].icon} {STATUS_CFG[detail.status].label}</span>

                <p className={`text-sm leading-relaxed p-3 rounded-xl ${panel}`}>{detail.description}</p>

                <div className={`rounded-2xl p-5 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm ${panel}`}>
                  <div><p className={muted}>Start price</p><p className={strong}>${detail.startPrice}</p></div>
                  <div><p className={muted}>Reserve price</p><p className={strong}>${detail.reservePrice}</p></div>
                  <div><p className={muted}>Buy-now</p><p className={strong}>{detail.buyNowPrice ? `$${detail.buyNowPrice}` : "—"}</p></div>
                  <div><p className={muted}>Current bid</p><p className={strong}>${detail.currentBid} ({detail.bidCount})</p></div>
                  <div><p className={muted}>Views</p><p className={strong}>{detail.views}</p></div>
                  <div><p className={muted}>{detail.scheduledStart ? "Scheduled start" : "Ends"}</p><p className={strong}>{detail.scheduledStart || detail.endDate || "—"}</p></div>
                </div>

                {detail.rejectReason && (
                  <div className={`rounded-xl p-3 text-sm flex items-start gap-2 ${isDarkMode ? "bg-rose-500/10" : "bg-rose-50"}`}><AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" /><p className={strong}>{detail.rejectReason}</p></div>
                )}

                <div className="flex flex-wrap gap-2">
                  {editableStatuses.includes(detail.status) || (detail.status === "live" && detail.bidCount === 0) ? (
                    <button onClick={() => openEdit(detail)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}><Edit3 className="w-3.5 h-3.5" /> Edit</button>
                  ) : detail.status === "live" ? (
                    <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg ${muted}`}><Lock className="w-3.5 h-3.5" /> Editing locked — bids already placed</span>
                  ) : null}

                  {(detail.status === "ended_unsold" || detail.status === "cancelled") && (
                    <button onClick={() => relistAuction(detail)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white"><Copy className="w-3.5 h-3.5" /> Relist</button>
                  )}
                  {detail.status === "draft" && (
                    <button onClick={() => deleteDraft(detail)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white"><Trash2 className="w-3.5 h-3.5" /> Delete draft</button>
                  )}
                  {(detail.status === "live" || detail.status === "scheduled" || detail.status === "pending_approval") && !showCancelForm && (
                    <button onClick={() => setShowCancelForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white"><Ban className="w-3.5 h-3.5" /> Cancel auction</button>
                  )}
                </div>

                {showCancelForm && (
                  <div className={`rounded-xl p-4 space-y-3 ${isDarkMode ? "bg-rose-500/10" : "bg-rose-50"}`}>
                    {detail.bidCount > 0 ? (
                      <>
                        <p className="text-sm font-medium text-rose-500 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> This auction has {detail.bidCount} active bids</p>
                        <p className={`text-xs ${muted}`}>Cancelling now will incur a cancellation penalty and may affect your seller rating. Type CANCEL below to confirm.</p>
                        <input value={cancelConfirmText} onChange={e => setCancelConfirmText(e.target.value)} placeholder="Type CANCEL to confirm" className={inputCls} />
                      </>
                    ) : (
                      <p className={`text-xs ${muted}`}>No bids have been placed yet — this auction can be cancelled without penalty.</p>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => cancelAuction(detail)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white">Confirm cancellation</button>
                      <button onClick={() => { setShowCancelForm(false); setCancelConfirmText(""); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Back</button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}