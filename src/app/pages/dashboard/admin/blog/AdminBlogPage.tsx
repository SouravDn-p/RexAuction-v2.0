import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Edit3,
  Eye,
  FileText,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  Plus,
  Search,
  Tag,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "../../../../../hooks/useTheme";

// ─── Types ─────────────────────────────────────────────────────────────────

type PostStatus = "draft" | "published" | "scheduled";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  status: PostStatus;
  publishDate: string;
  updatedAt: string;
  views: number;
  likes: number;
  comments: number;
}

// ─── Mock data ─────────────────────────────────────────────────────────────

const CATEGORIES = ["Auction Tips", "Seller Guides", "Platform Updates", "Success Stories", "Industry News"];

const INITIAL_POSTS: BlogPost[] = [
  {
    _id: "p1", title: "5 Photography Tricks That Sell Your Auction Items Faster",
    slug: "photography-tricks-sell-faster", category: "Seller Guides",
    excerpt: "Great lighting and honest angles do more for your bid count than any promoted listing. Here's what top sellers do differently.",
    content: "Great lighting and honest angles do more for your bid count than any promoted listing.\n\nStart with natural light near a window, shoot from multiple angles including close-ups of any flaws, and always include a size reference. Buyers trust listings that show imperfections upfront — it reduces disputes and builds long-term seller reputation.\n\nAvoid harsh flash, which flattens texture and can misrepresent color. A simple $20 ring light outperforms most phone flashes.",
    coverImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1000&q=80",
    tags: ["photography", "selling-tips"], author: "Admin Sara", status: "published",
    publishDate: "2026-06-28", updatedAt: "2026-06-28", views: 4820, likes: 312, comments: 28,
  },
  {
    _id: "p2", title: "RexAuction Platform Update: Faster Payouts Starting July",
    slug: "platform-update-faster-payouts", category: "Platform Updates",
    excerpt: "We're cutting seller payout hold times from 5 days to 3 days following delivery confirmation.",
    content: "We're cutting seller payout hold times from 5 days to 3 days following delivery confirmation, effective July 15.\n\nThis change comes after months of fraud-detection improvements that let us safely reduce the buffer. Sellers with a Verified badge will see payouts even faster — within 24 hours of confirmed delivery.",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1000&q=80",
    tags: ["announcement", "payouts"], author: "Admin Rafiq", status: "published",
    publishDate: "2026-07-01", updatedAt: "2026-07-02", views: 6104, likes: 489, comments: 61,
  },
  {
    _id: "p3", title: "Inside a $12,000 Vintage Watch Bidding War",
    slug: "vintage-watch-bidding-war", category: "Success Stories",
    excerpt: "How a 1962 Omega Seamaster went from a $200 opening bid to a record close in under 90 minutes.",
    content: "How a 1962 Omega Seamaster went from a $200 opening bid to a record close in under 90 minutes.\n\nThe seller, a first-time RexAuction user, had no idea what the piece was worth. Three collectors recognized the reference number within the first ten minutes and the bidding war was on.",
    coverImage: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1000&q=80",
    tags: ["watches", "case-study"], author: "Admin Sara", status: "published",
    publishDate: "2026-06-20", updatedAt: "2026-06-20", views: 9231, likes: 720, comments: 94,
  },
  {
    _id: "p4", title: "Draft: How Reserve Prices Actually Work",
    slug: "how-reserve-prices-work", category: "Auction Tips",
    excerpt: "A plain-language explainer for sellers confused about reserve versus starting price.",
    content: "A plain-language explainer for sellers confused about reserve versus starting price.\n\n[Draft — needs a diagram and two more examples before publishing]",
    coverImage: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1000&q=80",
    tags: ["reserve-price", "education"], author: "You", status: "draft",
    publishDate: "", updatedAt: "2026-07-06", views: 0, likes: 0, comments: 0,
  },
  {
    _id: "p5", title: "Preparing for Our Biggest Holiday Auction Yet",
    slug: "holiday-auction-preview", category: "Platform Updates",
    excerpt: "A first look at what's coming to the December mega-auction event, and how sellers can get featured.",
    content: "A first look at what's coming to the December mega-auction event, and how sellers can get featured.\n\nApplications for featured seller slots open November 1st. Priority goes to Verified sellers with a clean dispute record over the trailing 90 days.",
    coverImage: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1000&q=80",
    tags: ["holiday", "featured-sellers"], author: "Admin Rafiq", status: "scheduled",
    publishDate: "2026-11-01", updatedAt: "2026-07-05", views: 0, likes: 0, comments: 0,
  },
  {
    _id: "p6", title: "Why We Redesigned the Bidding Interface",
    slug: "why-we-redesigned-bidding", category: "Platform Updates",
    excerpt: "The reasoning behind the new countdown timer, proxy bidding indicator, and mobile layout.",
    content: "The reasoning behind the new countdown timer, proxy bidding indicator, and mobile layout.\n\nUser testing showed most missed bids happened in the last 10 seconds on mobile, where the bid button was too easy to mis-tap. The new layout adds a confirmation step only in the closing minute.",
    coverImage: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=1000&q=80",
    tags: ["design", "ux"], author: "Admin Sara", status: "published",
    publishDate: "2026-05-14", updatedAt: "2026-05-15", views: 3350, likes: 201, comments: 17,
  },
];

const STATUS_META: Record<PostStatus, { label: string; color: string }> = {
  draft: { label: "Draft", color: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
  published: { label: "Published", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  scheduled: { label: "Scheduled", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
};

const PAGE_SIZE = 5;
const spring = { type: "spring" as const, stiffness: 120, damping: 20 };

const emptyDraft = (): BlogPost => ({
  _id: "", title: "", slug: "", excerpt: "", content: "", coverImage: "",
  category: CATEGORIES[0], tags: [], author: "You", status: "draft",
  publishDate: "", updatedAt: "", views: 0, likes: 0, comments: 0,
});

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ─── Component ─────────────────────────────────────────────────────────────

export default function AdminBlogPage() {
  const { isDarkMode } = useTheme();

  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PostStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const divider = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const panel = isDarkMode ? "bg-slate-700/40" : "bg-slate-50";
  const hover = isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-slate-50";
  const inputCls = `w-full px-3 py-2 text-sm rounded-xl border outline-none transition-all ${
    isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
  }`;

  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter, categoryFilter]);

  const filteredPosts = useMemo(() => {
    return posts.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [posts, searchQuery, statusFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const pageSafe = Math.min(currentPage, totalPages);
  const paginatedPosts = filteredPosts.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);
  const topPosts = useMemo(() => [...posts].filter(p => p.status === "published").sort((a, b) => b.views - a.views).slice(0, 4), [posts]);
  const maxViews = Math.max(...topPosts.map(p => p.views), 1);

  const stats = [
    { label: "Total posts", value: posts.length, icon: <FileText className="w-4 h-4" />, color: "text-violet-400", bg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50", bar: "from-violet-500 to-blue-500" },
    { label: "Published", value: posts.filter(p => p.status === "published").length, icon: <TrendingUp className="w-4 h-4" />, color: "text-emerald-400", bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50", bar: "from-emerald-500 to-teal-500" },
    { label: "Drafts + scheduled", value: posts.filter(p => p.status !== "published").length, icon: <Clock className="w-4 h-4" />, color: "text-amber-400", bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50", bar: "from-amber-500 to-orange-500" },
    { label: "Total views", value: totalViews.toLocaleString(), icon: <Eye className="w-4 h-4" />, color: "text-sky-400", bg: isDarkMode ? "bg-sky-500/10" : "bg-sky-50", bar: "from-sky-500 to-blue-400" },
  ];

  // ── CRUD helpers ─────────────────────────────────────────────────────────
  const openCreate = () => { setEditingPost(emptyDraft()); setTagInput(""); };
  const openEdit = (post: BlogPost) => { setEditingPost({ ...post }); setTagInput(""); };
  const closeEditor = () => { setEditingPost(null); setTagInput(""); };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (!t || !editingPost) return;
    if (editingPost.tags.includes(t)) { setTagInput(""); return; }
    setEditingPost({ ...editingPost, tags: [...editingPost.tags, t] });
    setTagInput("");
  };

  const removeTag = (t: string) => {
    if (!editingPost) return;
    setEditingPost({ ...editingPost, tags: editingPost.tags.filter(tag => tag !== t) });
  };

  const savePost = (statusOverride?: PostStatus) => {
    if (!editingPost) return;
    if (!editingPost.title.trim()) { toast.error("Give the post a title"); return; }
    if (!editingPost.excerpt.trim()) { toast.error("Add a short excerpt"); return; }
    if (!editingPost.content.trim()) { toast.error("The post needs some content"); return; }

    const status = statusOverride ?? editingPost.status;
    if (status === "scheduled" && !editingPost.publishDate) { toast.error("Pick a scheduled publish date"); return; }

    const now = new Date().toISOString().slice(0, 10);
    const finalPost: BlogPost = {
      ...editingPost,
      slug: editingPost.slug.trim() || slugify(editingPost.title),
      status,
      publishDate: status === "published" && !editingPost.publishDate ? now : editingPost.publishDate,
      updatedAt: now,
    };

    if (finalPost._id) {
      setPosts(prev => prev.map(p => p._id === finalPost._id ? finalPost : p));
      toast.success("Post updated");
    } else {
      setPosts(prev => [{ ...finalPost, _id: `p-${Date.now()}` }, ...prev]);
      toast.success(status === "published" ? "Post published" : status === "scheduled" ? "Post scheduled" : "Draft saved");
    }
    closeEditor();
  };

  const duplicatePost = (post: BlogPost) => {
    setPosts(prev => [{ ...post, _id: `p-${Date.now()}`, title: `${post.title} (copy)`, slug: `${post.slug}-copy`, status: "draft", views: 0, likes: 0, comments: 0, publishDate: "", updatedAt: new Date().toISOString().slice(0, 10) }, ...prev]);
    toast.success("Post duplicated as a draft");
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setPosts(prev => prev.filter(p => p._id !== deleteTarget._id));
    toast.error(`"${deleteTarget.title}" deleted`);
    setDeleteTarget(null);
  };

  // ── Pagination ───────────────────────────────────────────────────────────
  const Pagination = () => (
    <div className={`flex items-center justify-between px-5 py-4 border-t ${divider}`}>
      <p className={`text-xs ${muted}`}>
        Showing {filteredPosts.length === 0 ? 0 : (pageSafe - 1) * PAGE_SIZE + 1}–{Math.min(pageSafe * PAGE_SIZE, filteredPosts.length)} of {filteredPosts.length}
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
        <div className="px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight">Blog</h1>
            <p className={`text-xs mt-0.5 ${muted}`}>Write, schedule and track posts published to the RexAuction blog</p>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors shrink-0">
            <Plus className="w-3.5 h-3.5" /> New post
          </button>
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
          {/* ── Left: posts list ──────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search title or author..." className={`${inputCls} pl-9`} />
              </div>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className={inputCls + " sm:w-40"}>
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
              </select>
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className={inputCls + " sm:w-44"}>
                <option value="all">All categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className={`rounded-2xl border ${surface}`}>
              {paginatedPosts.length === 0 ? (
                <div className="p-14 text-center">
                  <FileText className={`w-10 h-10 mx-auto mb-3 ${muted}`} />
                  <p className={`text-sm font-medium ${strong}`}>No posts found</p>
                  <p className={`text-xs mt-1 ${muted}`}>Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700/20">
                  {paginatedPosts.map((post, i) => (
                    <motion.div key={post._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={`flex flex-col sm:flex-row gap-3 px-5 py-4 transition-colors ${hover}`}>
                      <img src={post.coverImage} alt={post.title} className="w-full sm:w-24 h-24 sm:h-16 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <p className={`text-sm font-semibold truncate ${strong}`}>{post.title}</p>
                          <span className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_META[post.status].color}`}>{STATUS_META[post.status].label}</span>
                        </div>
                        <p className={`text-xs line-clamp-1 mt-0.5 ${muted}`}>{post.excerpt}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className={`text-[11px] flex items-center gap-1 ${muted}`}><Tag className="w-3 h-3" /> {post.category}</span>
                          <span className={`text-[11px] flex items-center gap-1 ${muted}`}><Eye className="w-3 h-3" /> {post.views.toLocaleString()}</span>
                          <span className={`text-[11px] flex items-center gap-1 ${muted}`}><Heart className="w-3 h-3" /> {post.likes}</span>
                          <span className={`text-[11px] flex items-center gap-1 ${muted}`}><MessageCircle className="w-3 h-3" /> {post.comments}</span>
                          <span className={`text-[11px] ml-auto ${muted}`}>{post.author} · {post.status === "scheduled" ? `set for ${post.publishDate}` : post.publishDate || `updated ${post.updatedAt}`}</span>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end gap-1.5 shrink-0">
                        <button onClick={() => setPreviewPost(post)} className={`text-xs font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1 ${isDarkMode ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}><Eye className="w-3.5 h-3.5" /> Preview</button>
                        <button onClick={() => openEdit(post)} className={`text-xs font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1 ${isDarkMode ? "text-violet-400 hover:bg-slate-800" : "text-violet-600 hover:bg-slate-100"}`}><Edit3 className="w-3.5 h-3.5" /> Edit</button>
                        <div className="flex gap-1.5">
                          <button onClick={() => duplicatePost(post)} className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"}`}><Copy className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setDeleteTarget(post)} className="w-7 h-7 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-500/10"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              {filteredPosts.length > 0 && <Pagination />}
            </div>
          </div>

          {/* ── Right: top posts stats ───────────────────────────── */}
          <div className="space-y-5">
            <div className={`rounded-2xl border ${surface}`}>
              <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${divider}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-sky-500/10" : "bg-sky-50"}`}><BarChart3 className="text-sky-500 w-3.5 h-3.5" /></div>
                <span className={`text-sm font-semibold ${strong}`}>Top posts by views</span>
              </div>
              <div className="p-4 space-y-3">
                {topPosts.map((p, i) => (
                  <div key={p._id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium truncate pr-2 ${strong}`}>{p.title}</span>
                      <span className={`text-xs shrink-0 ${muted}`}>{p.views.toLocaleString()}</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? "bg-slate-700/60" : "bg-slate-100"}`}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(p.views / maxViews) * 100}%` }} transition={{ delay: 0.2 + i * 0.08, duration: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl border ${surface}`}>
              <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${divider}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-violet-500/10" : "bg-violet-50"}`}><Tag className="text-violet-500 w-3.5 h-3.5" /></div>
                <span className={`text-sm font-semibold ${strong}`}>Posts by category</span>
              </div>
              <div className="p-4 space-y-2">
                {CATEGORIES.map(c => {
                  const count = posts.filter(p => p.category === c).length;
                  return (
                    <div key={c} className={`flex items-center justify-between px-3 py-2.5 rounded-xl ${panel}`}>
                      <span className={`text-xs font-medium ${strong}`}>{c}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? "bg-slate-800 text-slate-300" : "bg-white text-slate-600"}`}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Create / Edit modal ───────────────────────────────────── */}
      <AnimatePresence>
        {editingPost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={closeEditor}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} transition={spring} className={`w-full max-w-2xl rounded-2xl ${surface} max-h-[92vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
              <div className={`flex items-center justify-between px-6 py-4 border-b sticky top-0 ${surface} ${divider}`}>
                <span className={`text-sm font-semibold ${strong}`}>{editingPost._id ? "Edit post" : "New post"}</span>
                <button onClick={closeEditor} className={muted}><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className={`text-xs font-medium block mb-1.5 ${muted}`}>Title</label>
                  <input value={editingPost.title} onChange={e => setEditingPost({ ...editingPost, title: e.target.value })} placeholder="Post title" className={inputCls} />
                </div>
                <div>
                  <label className={`text-xs font-medium block mb-1.5 ${muted}`}>Slug</label>
                  <input value={editingPost.slug} onChange={e => setEditingPost({ ...editingPost, slug: e.target.value })} placeholder={slugify(editingPost.title) || "auto-generated-from-title"} className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`text-xs font-medium block mb-1.5 ${muted}`}>Category</label>
                    <select value={editingPost.category} onChange={e => setEditingPost({ ...editingPost, category: e.target.value })} className={inputCls}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={`text-xs font-medium block mb-1.5 ${muted}`}>Cover image URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
                      <input value={editingPost.coverImage} onChange={e => setEditingPost({ ...editingPost, coverImage: e.target.value })} placeholder="https://..." className={`${inputCls} pl-9`} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={`text-xs font-medium block mb-1.5 ${muted}`}>Excerpt</label>
                  <textarea value={editingPost.excerpt} onChange={e => setEditingPost({ ...editingPost, excerpt: e.target.value })} rows={2} placeholder="One or two sentences shown in previews and listings" className={inputCls} />
                </div>
                <div>
                  <label className={`text-xs font-medium block mb-1.5 ${muted}`}>Content</label>
                  <textarea value={editingPost.content} onChange={e => setEditingPost({ ...editingPost, content: e.target.value })} rows={7} placeholder="Write the full post..." className={inputCls} />
                </div>
                <div>
                  <label className={`text-xs font-medium block mb-1.5 ${muted}`}>Tags</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {editingPost.tags.map(t => (
                      <span key={t} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                        #{t} <button onClick={() => removeTag(t)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add a tag and press Enter" className={inputCls} />
                    <button onClick={addTag} className={`px-3 py-2 rounded-xl text-xs font-medium shrink-0 ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Add</button>
                  </div>
                </div>
                {(editingPost.status === "scheduled") && (
                  <div>
                    <label className={`text-xs font-medium flex items-center gap-1.5 mb-1.5 ${muted}`}><Calendar className="w-3 h-3" /> Scheduled publish date</label>
                    <input type="date" value={editingPost.publishDate} onChange={e => setEditingPost({ ...editingPost, publishDate: e.target.value })} className={inputCls} />
                  </div>
                )}
              </div>

              <div className={`flex flex-wrap items-center justify-end gap-2.5 px-6 py-4 border-t ${divider}`}>
                <button onClick={() => savePost("draft")} className={`px-4 py-2 rounded-xl text-xs font-medium ${isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}>Save as draft</button>
                <button onClick={() => setEditingPost({ ...editingPost, status: "scheduled" })} className={`px-4 py-2 rounded-xl text-xs font-medium border ${isDarkMode ? "border-slate-600 text-slate-300 hover:bg-slate-700" : "border-slate-200 text-slate-600 hover:bg-slate-100"}`}>Set schedule</button>
                {editingPost.status === "scheduled" ? (
                  <button onClick={() => savePost("scheduled")} className="px-4 py-2 rounded-xl text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white">Confirm schedule</button>
                ) : (
                  <button onClick={() => savePost("published")} className="px-4 py-2 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white">Publish now</button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Preview modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {previewPost && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setPreviewPost(null)}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} transition={spring} className={`w-full max-w-2xl rounded-2xl ${surface} max-h-[92vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
              <div className={`flex items-center justify-between px-6 py-4 border-b sticky top-0 ${surface} ${divider}`}>
                <span className={`text-sm font-semibold ${strong}`}>Preview</span>
                <button onClick={() => setPreviewPost(null)} className={muted}><X className="w-5 h-5" /></button>
              </div>
              <img src={previewPost.coverImage} alt={previewPost.title} className="w-full h-56 object-cover" />
              <div className="p-6 space-y-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${isDarkMode ? "bg-violet-500/15 text-violet-400" : "bg-violet-50 text-violet-700"}`}>{previewPost.category}</span>
                <h2 className={`text-2xl font-bold ${strong}`}>{previewPost.title}</h2>
                <div className={`flex items-center gap-3 text-xs ${muted}`}>
                  <span>{previewPost.author}</span><span>·</span><span>{previewPost.publishDate || "Not yet published"}</span>
                </div>
                <div className={`text-sm leading-relaxed whitespace-pre-line ${strong}`}>{previewPost.content}</div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {previewPost.tags.map(t => <span key={t} className={`px-2.5 py-1 rounded-full text-xs ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>#{t}</span>)}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete confirm ────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteTarget(null)}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} transition={spring} className={`w-full max-w-sm rounded-2xl ${surface} p-6`} onClick={e => e.stopPropagation()}>
              <p className={`text-sm font-semibold mb-1.5 ${strong}`}>Delete this post?</p>
              <p className={`text-xs mb-5 ${muted}`}>"{deleteTarget.title}" will be permanently removed. This can't be undone.</p>
              <div className="flex gap-2.5">
                <button onClick={() => setDeleteTarget(null)} className={`flex-1 py-2.5 rounded-xl text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}