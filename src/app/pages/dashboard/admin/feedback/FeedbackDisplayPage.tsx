import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Archive,
  Bug,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Lightbulb,
  Loader2,
  MessageSquare,
  Search,
  Send,
  Smile,
  Star,
  StickyNote,
  ThumbsDown,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "../../../../../hooks/useTheme";

// ─── Types ─────────────────────────────────────────────────────────────────

type FeedbackType = "bug" | "feature" | "complaint" | "praise" | "general";
type FeedbackStatus = "new" | "in_review" | "resolved" | "dismissed";

interface FeedbackItem {
  _id: string;
  userName: string;
  userEmail: string;
  userPhoto: string;
  type: FeedbackType;
  rating: number | null;
  subject: string;
  message: string;
  context: string;
  status: FeedbackStatus;
  createdAt: string;
  adminReply?: string;
  internalNote?: string;
}

// ─── Mock data ─────────────────────────────────────────────────────────────

const TYPE_META: Record<FeedbackType, { label: string; icon: React.JSX.Element; color: string }> = {
  bug: { label: "Bug report", icon: <Bug className="w-3.5 h-3.5" />, color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
  feature: { label: "Feature request", icon: <Lightbulb className="w-3.5 h-3.5" />, color: "bg-violet-500/15 text-violet-400 border-violet-500/20" },
  complaint: { label: "Complaint", icon: <ThumbsDown className="w-3.5 h-3.5" />, color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  praise: { label: "Praise", icon: <Smile className="w-3.5 h-3.5" />, color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  general: { label: "General", icon: <MessageSquare className="w-3.5 h-3.5" />, color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
};

const STATUS_META: Record<FeedbackStatus, { label: string; icon: React.JSX.Element; color: string }> = {
  new: { label: "New", icon: <AlertCircle className="w-3.5 h-3.5" />, color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
  in_review: { label: "In review", icon: <Loader2 className="w-3.5 h-3.5" />, color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  resolved: { label: "Resolved", icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  dismissed: { label: "Dismissed", icon: <Archive className="w-3.5 h-3.5" />, color: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
};

const INITIAL_FEEDBACK: FeedbackItem[] = [
  {
    _id: "fb1", userName: "Emily Carter", userEmail: "emily.carter@email.com", userPhoto: "https://ui-avatars.com/api/?name=Emily+Carter&background=7c3aed&color=fff",
    type: "bug", rating: 2, subject: "Bid confirmation modal freezes on mobile Safari",
    message: "When I place a bid in the last minute of an auction, the confirmation modal sometimes freezes and I can't tell if my bid actually went through. Happened twice yesterday on my iPhone.",
    context: "Auction #4821 · iOS Safari", status: "new", createdAt: "2026-07-07 21:14",
  },
  {
    _id: "fb2", userName: "Noah Kim", userEmail: "noah.kim@email.com", userPhoto: "https://ui-avatars.com/api/?name=Noah+Kim&background=0369a1&color=fff",
    type: "feature", rating: 4, subject: "Would love bulk relisting for expired auctions",
    message: "As a seller with a lot of inventory, re-listing items one by one after they expire without bids is tedious. A 'relist all' button would save me a lot of time.",
    context: "Seller dashboard", status: "in_review", createdAt: "2026-07-06 10:02",
    internalNote: "Logged as SELL-142, tentatively scoped for Q4.",
  },
  {
    _id: "fb3", userName: "Aisha Patel", userEmail: "aisha.patel@email.com", userPhoto: "https://ui-avatars.com/api/?name=Aisha+Patel&background=065f46&color=fff",
    type: "praise", rating: 5, subject: "Support resolved my dispute so fast",
    message: "I had an issue with an item that arrived damaged and the support team refunded me within a day. Really impressed with how smooth the whole process was.",
    context: "Order #9931", status: "resolved", createdAt: "2026-07-02 15:40",
    adminReply: "Thank you so much for the kind words, Aisha! We'll pass this along to the support team.",
  },
  {
    _id: "fb4", userName: "Liam Torres", userEmail: "liam.torres@email.com", userPhoto: "https://ui-avatars.com/api/?name=Liam+Torres&background=b45309&color=fff",
    type: "complaint", rating: 1, subject: "Suspended without clear explanation",
    message: "My account got suspended and the email just said 'complaint pattern' with no specifics. I don't know what I actually did wrong and support hasn't replied in 3 days.",
    context: "Account status: suspended", status: "in_review", createdAt: "2026-07-05 08:55",
    internalNote: "Escalated to Trust & Safety — verify original suspension reason before replying.",
  },
  {
    _id: "fb5", userName: "Zara Nguyen", userEmail: "zara.nguyen@email.com", userPhoto: "https://ui-avatars.com/api/?name=Zara+Nguyen&background=be185d&color=fff",
    type: "bug", rating: 3, subject: "Category filter resets when going back",
    message: "If I filter by 'Collectibles' and open an item, then hit back, the filter is gone and I'm looking at all categories again.",
    context: "Browse auctions page", status: "new", createdAt: "2026-07-07 12:30",
  },
  {
    _id: "fb6", userName: "Ken Watanabe", userEmail: "ken.watanabe@email.com", userPhoto: "https://ui-avatars.com/api/?name=Ken+Watanabe&background=475569&color=fff",
    type: "general", rating: null, subject: "Question about international shipping fees",
    message: "Are international shipping costs calculated automatically or does the seller set a flat rate? Wasn't obvious from the checkout page.",
    context: "Checkout page", status: "dismissed", createdAt: "2026-06-29 09:18",
    adminReply: "Sellers set their own flat or calculated rates — we've added a tooltip to clarify this at checkout.",
  },
  {
    _id: "fb7", userName: "Sofia Diaz", userEmail: "sofia.diaz@email.com", userPhoto: "https://ui-avatars.com/api/?name=Sofia+Diaz&background=be185d&color=fff",
    type: "feature", rating: 4, subject: "Add a 'watchlist ending soon' email digest",
    message: "I'd love a daily email that just tells me which watchlist items are ending in the next 24 hours instead of me having to check the app constantly.",
    context: "Watchlist", status: "new", createdAt: "2026-07-08 07:45",
  },
];

const PAGE_SIZE = 5;
const spring = { type: "spring" as const, stiffness: 120, damping: 20 };

// ─── Component ─────────────────────────────────────────────────────────────

export default function AdminFeedbackPage() {
  const { isDarkMode } = useTheme();

  const [items, setItems] = useState<FeedbackItem[]>(INITIAL_FEEDBACK);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | FeedbackType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | FeedbackStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [noteDraft, setNoteDraft] = useState("");

  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const divider = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const panel = isDarkMode ? "bg-slate-700/40" : "bg-slate-50";
  const hover = isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-slate-50";
  const inputCls = `w-full px-3 py-2 text-sm rounded-xl border outline-none transition-all ${
    isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
  }`;

  useEffect(() => { setCurrentPage(1); }, [searchQuery, typeFilter, statusFilter]);

  const selected = useMemo(() => items.find(i => i._id === selectedId) || null, [items, selectedId]);

  const filtered = useMemo(() => {
    return items.filter(i => {
      const matchesSearch = i.subject.toLowerCase().includes(searchQuery.toLowerCase()) || i.userName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || i.type === typeFilter;
      const matchesStatus = statusFilter === "all" || i.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [items, searchQuery, typeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const rated = items.filter(i => i.rating !== null) as (FeedbackItem & { rating: number })[];
  const avgRating = rated.length ? (rated.reduce((s, i) => s + i.rating, 0) / rated.length) : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({ star, count: rated.filter(i => i.rating === star).length }));
  const maxRatingCount = Math.max(...ratingCounts.map(r => r.count), 1);

  const stats = [
    { label: "Total feedback", value: items.length, icon: <MessageSquare className="w-4 h-4" />, color: "text-violet-400", bg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50", bar: "from-violet-500 to-blue-500" },
    { label: "Needs attention", value: items.filter(i => i.status === "new" || i.status === "in_review").length, icon: <AlertCircle className="w-4 h-4" />, color: "text-amber-400", bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50", bar: "from-amber-500 to-orange-500" },
    { label: "Resolved", value: items.filter(i => i.status === "resolved").length, icon: <CheckCircle2 className="w-4 h-4" />, color: "text-emerald-400", bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50", bar: "from-emerald-500 to-teal-500" },
    { label: "Average rating", value: rated.length ? avgRating.toFixed(1) : "—", icon: <Star className="w-4 h-4" />, color: "text-sky-400", bg: isDarkMode ? "bg-sky-500/10" : "bg-sky-50", bar: "from-sky-500 to-blue-400" },
  ];

  const typeTabs: { key: "all" | FeedbackType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "bug", label: "Bugs" },
    { key: "feature", label: "Feature requests" },
    { key: "complaint", label: "Complaints" },
    { key: "praise", label: "Praise" },
    { key: "general", label: "General" },
  ];

  // ── Handlers ─────────────────────────────────────────────────────────────
  const openItem = (item: FeedbackItem) => {
    setSelectedId(item._id);
    setReplyDraft(item.adminReply || "");
    setNoteDraft(item.internalNote || "");
    if (item.status === "new") {
      setItems(prev => prev.map(i => i._id === item._id ? { ...i, status: "in_review" } : i));
    }
  };

  const closeModal = () => { setSelectedId(null); setReplyDraft(""); setNoteDraft(""); };

  const setStatus = (item: FeedbackItem, status: FeedbackStatus) => {
    setItems(prev => prev.map(i => i._id === item._id ? { ...i, status } : i));
    toast.success(`Marked as ${STATUS_META[status].label.toLowerCase()}`);
  };

  const sendReply = (item: FeedbackItem) => {
    if (!replyDraft.trim()) { toast.error("Write a reply before sending"); return; }
    setItems(prev => prev.map(i => i._id === item._id ? { ...i, adminReply: replyDraft.trim(), status: i.status === "dismissed" ? i.status : "resolved" } : i));
    toast.success(`Reply sent to ${item.userName}`);
  };

  const saveNote = (item: FeedbackItem) => {
    setItems(prev => prev.map(i => i._id === item._id ? { ...i, internalNote: noteDraft.trim() } : i));
    toast.success("Internal note saved");
  };

  const Stars = ({ value }: { value: number | null }) => {
    if (value === null) return <span className={`text-xs ${muted}`}>No rating</span>;
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(n => (
          <Star key={n} className={`w-3.5 h-3.5 ${n <= value ? "fill-amber-400 text-amber-400" : isDarkMode ? "text-slate-600" : "text-slate-300"}`} />
        ))}
      </div>
    );
  };

  // ── Pagination ───────────────────────────────────────────────────────────
  const Pagination = () => (
    <div className={`flex items-center justify-between px-5 py-4 border-t ${divider}`}>
      <p className={`text-xs ${muted}`}>
        Showing {filtered.length === 0 ? 0 : (pageSafe - 1) * PAGE_SIZE + 1}–{Math.min(pageSafe * PAGE_SIZE, filtered.length)} of {filtered.length}
      </p>
      <div className="flex items-center gap-1.5">
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={pageSafe === 1} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === pageSafe ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"}`}>
            {p}
          </button>
        ))}
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={pageSafe === totalPages} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px", borderRadius: "10px", background: isDarkMode ? "#1e293b" : "#fff", color: isDarkMode ? "#f1f5f9" : "#0f172a", border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0" },
        }}
      />

      {/* Header */}
      <div className={`sticky top-0 z-20 border-b backdrop-blur-xl ${isDarkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-slate-200"}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-xl font-bold tracking-tight">User Feedback</h1>
          <p className={`text-xs mt-0.5 ${muted}`}>Bug reports, feature requests, complaints and praise from across the platform</p>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`rounded-2xl border overflow-hidden ${surface}`}>
              <div className="p-4 flex items-start justify-between">
                <div>
                  <p className={`text-xs font-medium mb-2 ${muted}`}>{s.label}</p>
                  <p className={`font-semibold text-2xl ${strong}`}>{s.value}</p>
                </div>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.bg}`}><span className={s.color}>{s.icon}</span></div>
              </div>
              <div className={`h-0.5 bg-gradient-to-r ${s.bar}`} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── Left: feedback list ───────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search subject or user..." className={`${inputCls} pl-9`} />
              </div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className={inputCls + " sm:w-40"}>
                <option value="all">All statuses</option>
                <option value="new">New</option>
                <option value="in_review">In review</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>

            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {typeTabs.map(tab => (
                <button key={tab.key} onClick={() => setTypeFilter(tab.key)} className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${typeFilter === tab.key ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={`rounded-2xl border ${surface}`}>
              {paginated.length === 0 ? (
                <div className="p-14 text-center">
                  <MessageSquare className={`w-10 h-10 mx-auto mb-3 ${muted}`} />
                  <p className={`text-sm font-medium ${strong}`}>No feedback found</p>
                  <p className={`text-xs mt-1 ${muted}`}>Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700/20">
                  {paginated.map((item, i) => (
                    <motion.button key={item._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} onClick={() => openItem(item)} className={`w-full text-left flex items-start gap-3 px-5 py-4 transition-colors ${hover}`}>
                      <img src={item.userPhoto} alt={item.userName} className="w-9 h-9 rounded-xl object-cover shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <p className={`text-sm font-semibold truncate ${strong}`}>{item.subject}</p>
                          <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_META[item.status].color}`}>
                            {STATUS_META[item.status].icon} {STATUS_META[item.status].label}
                          </span>
                        </div>
                        <p className={`text-xs line-clamp-1 mt-0.5 ${muted}`}>{item.message}</p>
                        <div className="flex flex-wrap items-center gap-2.5 mt-2">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${TYPE_META[item.type].color}`}>{TYPE_META[item.type].icon} {TYPE_META[item.type].label}</span>
                          <Stars value={item.rating} />
                          <span className={`text-[11px] ml-auto ${muted}`}>{item.userName} · {item.createdAt}</span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
              {filtered.length > 0 && <Pagination />}
            </div>
          </div>

          {/* ── Right: rating breakdown ───────────────────────────── */}
          <div className="space-y-5">
            <div className={`rounded-2xl border ${surface}`}>
              <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${divider}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-amber-500/10" : "bg-amber-50"}`}><Star className="text-amber-500 w-3.5 h-3.5" /></div>
                <span className={`text-sm font-semibold ${strong}`}>Rating breakdown</span>
              </div>
              <div className="p-4 space-y-3">
                {ratingCounts.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-3">
                    <span className={`text-xs w-3 shrink-0 ${strong}`}>{star}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                    <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDarkMode ? "bg-slate-700/60" : "bg-slate-100"}`}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(count / maxRatingCount) * 100}%` }} transition={{ delay: 0.2, duration: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
                    </div>
                    <span className={`text-xs w-5 text-right shrink-0 ${muted}`}>{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl border ${surface}`}>
              <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${divider}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-violet-500/10" : "bg-violet-50"}`}><MessageSquare className="text-violet-500 w-3.5 h-3.5" /></div>
                <span className={`text-sm font-semibold ${strong}`}>By type</span>
              </div>
              <div className="p-4 space-y-2">
                {(Object.keys(TYPE_META) as FeedbackType[]).map(t => {
                  const count = items.filter(i => i.type === t).length;
                  return (
                    <div key={t} className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${panel}`}>
                      <span className={`text-xs font-medium flex items-center gap-1.5 ${strong}`}>{TYPE_META[t].icon} {TYPE_META[t].label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? "bg-slate-800 text-slate-300" : "bg-white text-slate-600"}`}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Detail modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={closeModal}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} transition={spring} className={`w-full max-w-xl rounded-2xl ${surface} max-h-[92vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
              <div className={`flex items-center justify-between px-6 py-4 border-b sticky top-0 ${surface} ${divider}`}>
                <div className="flex items-center gap-3">
                  <img src={selected.userPhoto} alt={selected.userName} className="w-9 h-9 rounded-xl object-cover" />
                  <div>
                    <p className={`text-sm font-semibold ${strong}`}>{selected.userName}</p>
                    <p className={`text-xs ${muted}`}>{selected.userEmail}</p>
                  </div>
                </div>
                <button onClick={closeModal} className={muted}><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${TYPE_META[selected.type].color}`}>{TYPE_META[selected.type].icon} {TYPE_META[selected.type].label}</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_META[selected.status].color}`}>{STATUS_META[selected.status].icon} {STATUS_META[selected.status].label}</span>
                  <Stars value={selected.rating} />
                </div>

                <div>
                  <h3 className={`text-base font-semibold mb-1.5 ${strong}`}>{selected.subject}</h3>
                  <p className={`text-sm leading-relaxed p-3 rounded-xl ${panel} ${strong}`}>{selected.message}</p>
                  <p className={`text-xs mt-2 ${muted}`}>{selected.context} · {selected.createdAt}</p>
                </div>

                {selected.adminReply && (
                  <div className={`rounded-xl p-3 border-l-2 ${isDarkMode ? "bg-emerald-500/10 border-emerald-500" : "bg-emerald-50 border-emerald-400"}`}>
                    <p className={`text-xs font-medium mb-1 ${muted}`}>Your reply</p>
                    <p className={`text-sm ${strong}`}>{selected.adminReply}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className={`text-xs font-medium flex items-center gap-1.5 ${muted}`}><Send className="w-3 h-3" /> Reply to user</label>
                  <textarea value={replyDraft} onChange={e => setReplyDraft(e.target.value)} rows={3} placeholder="Write a reply..." className={inputCls} />
                  <button onClick={() => sendReply(selected)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white">
                    <Send className="w-3.5 h-3.5" /> Send reply
                  </button>
                </div>

                <div className="space-y-2">
                  <label className={`text-xs font-medium flex items-center gap-1.5 ${muted}`}><StickyNote className="w-3 h-3" /> Internal note (not visible to user)</label>
                  <textarea value={noteDraft} onChange={e => setNoteDraft(e.target.value)} rows={2} placeholder="e.g. ticket reference, escalation status..." className={inputCls} />
                  <button onClick={() => saveNote(selected)} className={`px-4 py-2 rounded-xl text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                    Save note
                  </button>
                </div>

                <div className={`flex flex-wrap gap-2 pt-2 border-t ${divider}`}>
                  <button onClick={() => setStatus(selected, "in_review")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${isDarkMode ? "border-slate-600 text-slate-300 hover:bg-slate-700" : "border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
                    <Clock className="w-3.5 h-3.5" /> In review
                  </button>
                  <button onClick={() => setStatus(selected, "resolved")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Check className="w-3.5 h-3.5" /> Mark resolved
                  </button>
                  <button onClick={() => setStatus(selected, "dismissed")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${isDarkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-500 hover:bg-slate-100"}`}>
                    <Archive className="w-3.5 h-3.5" /> Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}