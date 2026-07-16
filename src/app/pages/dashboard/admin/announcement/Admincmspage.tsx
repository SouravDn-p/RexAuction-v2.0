import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  Check,
  Contact2,
  FileText,
  GripVertical,
  HelpCircle,
  History,
  Image as ImageIcon,
  Layers,
  Link2,
  Mail,
  MapPin,
  MessagesSquare,
  Phone,
  Plus,
  RotateCcw,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "../../../../../hooks/useTheme";

// ─── Types ─────────────────────────────────────────────────────────────────

type LegalDocKey = "terms" | "privacy";

interface DocVersion {
  version: string;
  content: string;
  publishedBy: string;
  publishedAt: string;
  note: string;
}

interface LegalDoc {
  key: LegalDocKey;
  title: string;
  current: DocVersion;
  history: DocVersion[];
  draft: string;
}

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
}

interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaLabel: string;
  ctaLink: string;
  active: boolean;
  startDate: string;
  endDate: string;
}

interface FeaturedAuction {
  _id: string;
  title: string;
  category: string;
  currentBid: number;
  seller: string;
  photo: string;
  featured: boolean;
  order: number;
}

// ─── Mock data ─────────────────────────────────────────────────────────────

const INITIAL_LEGAL: Record<LegalDocKey, LegalDoc> = {
  terms: {
    key: "terms",
    title: "Terms of Service",
    current: {
      version: "v3.2", publishedBy: "Admin Sara", publishedAt: "2026-05-01",
      note: "Clarified seller payout timelines and dispute windows.",
      content: "By using RexAuction, buyers and sellers agree to bid and list in good faith. Sellers are responsible for accurate item descriptions; buyers commit to completing payment for winning bids within 48 hours...",
    },
    history: [
      { version: "v3.1", publishedBy: "Admin Rafiq", publishedAt: "2026-02-14", note: "Added arbitration clause for cross-border disputes.", content: "..." },
      { version: "v3.0", publishedBy: "Admin Sara", publishedAt: "2025-11-02", note: "Full rewrite for the marketplace relaunch.", content: "..." },
    ],
    draft: "",
  },
  privacy: {
    key: "privacy",
    title: "Privacy Policy",
    current: {
      version: "v2.4", publishedBy: "Admin Sara", publishedAt: "2026-04-12",
      note: "Updated data retention period for login history to 12 months.",
      content: "RexAuction collects account information, bidding activity, and device data to operate the marketplace and prevent fraud. We do not sell personal data to third parties...",
    },
    history: [
      { version: "v2.3", publishedBy: "Admin Rafiq", publishedAt: "2026-01-05", note: "Added section on third-party payment processors.", content: "..." },
    ],
    draft: "",
  },
};

const INITIAL_FAQ: FaqItem[] = [
  { _id: "f1", question: "How do I become a verified seller?", answer: "Submit your NID and a business license (if applicable) from Settings → Seller Application. Reviews typically take 1–2 business days.", category: "Selling" },
  { _id: "f2", question: "When am I charged after winning an auction?", answer: "Payment is captured automatically within 48 hours of the auction closing, using your saved payment method.", category: "Buying" },
  { _id: "f3", question: "Can I cancel a bid?", answer: "Bids are binding once placed. Contact support immediately if you believe a bid was placed in error.", category: "Buying" },
  { _id: "f4", question: "How are payouts scheduled for sellers?", answer: "Payouts are released 3 days after delivery confirmation to protect against disputes.", category: "Selling" },
  { _id: "f5", question: "What happens if my account is suspended?", answer: "You'll receive an email with the reason and, for temporary suspensions, the reinstatement date. Permanent bans can be appealed via support.", category: "Account" },
];

const INITIAL_CONTACT = {
  supportEmail: "support@rexauction.com",
  phone: "+880 1234-567890",
  address: "Level 4, Gulshan Avenue, Dhaka 1212, Bangladesh",
  liveChatEnabled: true,
  hours: "Sun–Thu, 9:00 AM – 7:00 PM (GMT+6)",
};

const INITIAL_BANNERS: Banner[] = [
  { _id: "b1", title: "Summer Clearance Auctions", subtitle: "Up to 40% below market on Electronics", image: "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=800&q=80", ctaLabel: "Browse now", ctaLink: "/auctions/electronics", active: true, startDate: "2026-07-01", endDate: "2026-07-15" },
  { _id: "b2", title: "Verified Sellers Spotlight", subtitle: "Shop with confidence from our top-rated sellers", image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&q=80", ctaLabel: "Meet the sellers", ctaLink: "/sellers/verified", active: true, startDate: "2026-06-20", endDate: "2026-08-01" },
  { _id: "b3", title: "Holiday Auction Countdown", subtitle: "Our biggest event of the year returns", image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&q=80", ctaLabel: "Get notified", ctaLink: "/notify/holiday", active: false, startDate: "2026-11-15", endDate: "2026-12-05" },
];

const INITIAL_FEATURED: FeaturedAuction[] = [
  { _id: "fa1", title: "Vintage Leica M6 Camera", category: "Electronics", currentBid: 1120, seller: "Noah Kim", photo: "https://images.unsplash.com/photo-1519183071298-a2962be90b8e?w=200&q=80", featured: true, order: 1 },
  { _id: "fa2", title: "1965 Fender Stratocaster", category: "Instruments", currentBid: 4300, seller: "Emily Carter", photo: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=200&q=80", featured: true, order: 2 },
  { _id: "fa3", title: "Hand-carved Chess Set", category: "Collectibles", currentBid: 210, seller: "Zara Nguyen", photo: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=200&q=80", featured: false, order: 3 },
  { _id: "fa4", title: "Antique Pocket Watch", category: "Collectibles", currentBid: 410, seller: "Sofia Diaz", photo: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=200&q=80", featured: true, order: 3 },
  { _id: "fa5", title: "Original Oil Landscape Painting", category: "Art", currentBid: 890, seller: "Jordan Lee", photo: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200&q=80", featured: false, order: 5 },
];

const spring = { type: "spring" as const, stiffness: 120, damping: 20 };

const TABS = [
  { key: "legal", label: "Legal Pages", icon: <FileText className="w-3.5 h-3.5" /> },
  { key: "faq", label: "FAQ", icon: <HelpCircle className="w-3.5 h-3.5" /> },
  { key: "contact", label: "Contact Info", icon: <Contact2 className="w-3.5 h-3.5" /> },
  { key: "banners", label: "Homepage Banners", icon: <ImageIcon className="w-3.5 h-3.5" /> },
  { key: "featured", label: "Featured Auctions", icon: <Star className="w-3.5 h-3.5" /> },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// ─── Component ─────────────────────────────────────────────────────────────

export default function AdminCMSPage() {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<TabKey>("legal");

  const [legal, setLegal] = useState(INITIAL_LEGAL);
  const [activeLegalKey, setActiveLegalKey] = useState<LegalDocKey>("terms");
  const [publishNote, setPublishNote] = useState("");
  const [viewingVersion, setViewingVersion] = useState<DocVersion | null>(null);

  const [faqs, setFaqs] = useState<FaqItem[]>(INITIAL_FAQ);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqDraft, setFaqDraft] = useState<{ question: string; answer: string; category: string }>({ question: "", answer: "", category: "Buying" });
  const [showFaqForm, setShowFaqForm] = useState(false);

  const [contact, setContact] = useState(INITIAL_CONTACT);
  const [contactDraft, setContactDraft] = useState(INITIAL_CONTACT);

  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [showBannerForm, setShowBannerForm] = useState(false);

  const [featured, setFeatured] = useState<FeaturedAuction[]>(INITIAL_FEATURED);
  const [featuredSearch, setFeaturedSearch] = useState("");

  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const divider = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const panel = isDarkMode ? "bg-slate-700/40" : "bg-slate-50";
  const hover = isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-slate-50";
  const inputCls = `w-full px-3 py-2 text-sm rounded-xl border outline-none transition-all ${
    isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
  }`;

  const activeDoc = legal[activeLegalKey];

  const stats = [
    { label: "Published pages", value: 2, icon: <BookOpen className="w-4 h-4" />, color: "text-violet-400", bg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50", bar: "from-violet-500 to-blue-500" },
    { label: "FAQ entries", value: faqs.length, icon: <HelpCircle className="w-4 h-4" />, color: "text-sky-400", bg: isDarkMode ? "bg-sky-500/10" : "bg-sky-50", bar: "from-sky-500 to-blue-400" },
    { label: "Active banners", value: banners.filter(b => b.active).length, icon: <ImageIcon className="w-4 h-4" />, color: "text-emerald-400", bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50", bar: "from-emerald-500 to-teal-500" },
    { label: "Featured auctions", value: featured.filter(f => f.featured).length, icon: <Star className="w-4 h-4" />, color: "text-amber-400", bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50", bar: "from-amber-500 to-orange-500" },
  ];

  // ── Legal pages ──────────────────────────────────────────────────────────
  const startDraftFromCurrent = () => {
    setLegal(prev => ({ ...prev, [activeLegalKey]: { ...prev[activeLegalKey], draft: prev[activeLegalKey].current.content } }));
  };

  const publishVersion = () => {
    const doc = legal[activeLegalKey];
    if (!doc.draft.trim()) { toast.error("Nothing to publish — start editing the draft first"); return; }
    if (!publishNote.trim()) { toast.error("Add a short change note for the version history"); return; }
    const [major, minor] = doc.current.version.replace("v", "").split(".").map(Number);
    const nextVersion = `v${major}.${minor + 1}`;
    setLegal(prev => ({
      ...prev,
      [activeLegalKey]: {
        ...prev[activeLegalKey],
        history: [prev[activeLegalKey].current, ...prev[activeLegalKey].history],
        current: { version: nextVersion, content: doc.draft.trim(), publishedBy: "You", publishedAt: new Date().toISOString().slice(0, 10), note: publishNote.trim() },
        draft: "",
      },
    }));
    toast.success(`${doc.title} published as ${nextVersion}`);
    setPublishNote("");
  };

  const restoreVersion = (version: DocVersion) => {
    setLegal(prev => ({ ...prev, [activeLegalKey]: { ...prev[activeLegalKey], draft: version.content } }));
    toast.success(`${version.version} loaded into the draft editor — publish to make it live`);
    setViewingVersion(null);
  };

  // ── FAQ ──────────────────────────────────────────────────────────────────
  const openFaqForm = (item?: FaqItem) => {
    if (item) { setEditingFaqId(item._id); setFaqDraft({ question: item.question, answer: item.answer, category: item.category }); }
    else { setEditingFaqId(null); setFaqDraft({ question: "", answer: "", category: "Buying" }); }
    setShowFaqForm(true);
  };

  const saveFaq = () => {
    if (!faqDraft.question.trim() || !faqDraft.answer.trim()) { toast.error("Add both a question and an answer"); return; }
    if (editingFaqId) {
      setFaqs(prev => prev.map(f => f._id === editingFaqId ? { ...f, ...faqDraft } : f));
      toast.success("FAQ entry updated");
    } else {
      setFaqs(prev => [...prev, { _id: `f-${Date.now()}`, ...faqDraft }]);
      toast.success("FAQ entry added");
    }
    setShowFaqForm(false);
  };

  const deleteFaq = (id: string) => {
    setFaqs(prev => prev.filter(f => f._id !== id));
    toast.error("FAQ entry removed");
  };

  const moveFaq = (index: number, dir: -1 | 1) => {
    setFaqs(prev => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  // ── Contact ──────────────────────────────────────────────────────────────
  const saveContact = () => {
    if (!contactDraft.supportEmail.trim()) { toast.error("Support email is required"); return; }
    setContact(contactDraft);
    toast.success("Contact information saved");
  };

  // ── Banners ──────────────────────────────────────────────────────────────
  const openBannerForm = (banner?: Banner) => {
    setEditingBanner(banner || { _id: "", title: "", subtitle: "", image: "", ctaLabel: "", ctaLink: "", active: true, startDate: "", endDate: "" });
    setShowBannerForm(true);
  };

  const saveBanner = () => {
    if (!editingBanner) return;
    if (!editingBanner.title.trim() || !editingBanner.image.trim()) { toast.error("Title and image URL are required"); return; }
    if (editingBanner._id) {
      setBanners(prev => prev.map(b => b._id === editingBanner._id ? editingBanner : b));
      toast.success("Banner updated");
    } else {
      setBanners(prev => [...prev, { ...editingBanner, _id: `b-${Date.now()}` }]);
      toast.success("Banner added");
    }
    setShowBannerForm(false);
    setEditingBanner(null);
  };

  const toggleBannerActive = (id: string) => {
    setBanners(prev => prev.map(b => b._id === id ? { ...b, active: !b.active } : b));
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b._id !== id));
    toast.error("Banner removed");
  };

  // ── Featured auctions ────────────────────────────────────────────────────
  const filteredFeatured = useMemo(
    () => featured.filter(f => f.title.toLowerCase().includes(featuredSearch.toLowerCase()) || f.seller.toLowerCase().includes(featuredSearch.toLowerCase())),
    [featured, featuredSearch]
  );

  const toggleFeatured = (id: string) => {
    setFeatured(prev => prev.map(f => f._id === id ? { ...f, featured: !f.featured } : f));
  };

  const updateFeaturedOrder = (id: string, order: number) => {
    setFeatured(prev => prev.map(f => f._id === id ? { ...f, order } : f));
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'DM Sans', sans-serif", fontSize: "13px", borderRadius: "10px",
            background: isDarkMode ? "#1e293b" : "#fff", color: isDarkMode ? "#f1f5f9" : "#0f172a",
            border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0",
          },
        }}
      />

      {/* Header */}
      <div className={`sticky top-0 z-20 border-b backdrop-blur-xl ${isDarkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-slate-200"}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-xl font-bold tracking-tight">Content Management</h1>
          <p className={`text-xs mt-0.5 ${muted}`}>Legal pages, FAQ, contact details, and homepage merchandising</p>
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
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.bg}`}>
                  <span className={s.color}>{s.icon}</span>
                </div>
              </div>
              <div className={`h-0.5 bg-gradient-to-r ${s.bar}`} />
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── Legal Pages ─────────────────────────────────────────── */}
        {activeTab === "legal" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className={`rounded-2xl border ${surface} lg:col-span-1 h-fit`}>
              <div className={`px-5 py-4 border-b ${divider}`}><span className={`text-sm font-semibold ${strong}`}>Pages</span></div>
              <div className="p-3 space-y-1.5">
                {(Object.keys(legal) as LegalDocKey[]).map(key => (
                  <button
                    key={key}
                    onClick={() => setActiveLegalKey(key)}
                    className={`w-full flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeLegalKey === key ? (isDarkMode ? "bg-violet-500/10 text-violet-400" : "bg-violet-50 text-violet-700") : hover
                    }`}
                  >
                    <span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> {legal[key].title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{legal[key].current.version}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-5">
              <div className={`rounded-2xl border ${surface}`}>
                <div className={`flex items-center justify-between px-5 py-4 border-b ${divider}`}>
                  <div>
                    <span className={`text-sm font-semibold ${strong}`}>{activeDoc.title} — currently published</span>
                    <p className={`text-xs mt-0.5 ${muted}`}>{activeDoc.current.version} · published {activeDoc.current.publishedAt} by {activeDoc.current.publishedBy}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isDarkMode ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                    <Check className="w-3.5 h-3.5" /> Live
                  </span>
                </div>
                <div className="p-5 space-y-4">
                  <p className={`text-sm leading-relaxed p-3 rounded-xl ${panel} ${strong}`}>{activeDoc.current.content}</p>

                  {!activeDoc.draft ? (
                    <button onClick={startDraftFromCurrent} className="px-4 py-2 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white">
                      Start a new draft
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className={`text-xs font-medium ${muted}`}>Editing draft — not yet published</p>
                      <textarea value={activeDoc.draft} onChange={e => setLegal(prev => ({ ...prev, [activeLegalKey]: { ...prev[activeLegalKey], draft: e.target.value } }))} rows={6} className={inputCls} />
                      <input value={publishNote} onChange={e => setPublishNote(e.target.value)} placeholder="Change note for version history (required)" className={inputCls} />
                      <div className="flex gap-2">
                        <button onClick={publishVersion} className="px-4 py-2 rounded-xl text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white">
                          Publish new version
                        </button>
                        <button
                          onClick={() => setLegal(prev => ({ ...prev, [activeLegalKey]: { ...prev[activeLegalKey], draft: "" } }))}
                          className={`px-4 py-2 rounded-xl text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}
                        >
                          Discard draft
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className={`rounded-2xl border ${surface}`}>
                <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${divider}`}>
                  <History className={`w-3.5 h-3.5 ${muted}`} />
                  <span className={`text-sm font-semibold ${strong}`}>Version history</span>
                </div>
                <div className="p-4 space-y-2">
                  {activeDoc.history.length === 0 ? (
                    <p className={`text-sm p-2 ${muted}`}>No earlier versions on file.</p>
                  ) : (
                    activeDoc.history.map(v => (
                      <div key={v.version} className={`flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl ${panel}`}>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium ${strong}`}>{v.version} <span className={muted}>· {v.publishedAt}</span></p>
                          <p className={`text-xs truncate ${muted}`}>{v.note}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button onClick={() => setViewingVersion(v)} className={`text-xs font-medium px-2.5 py-1.5 rounded-lg ${isDarkMode ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-white"}`}>View</button>
                          <button onClick={() => restoreVersion(v)} className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white">
                            <RotateCcw className="w-3 h-3" /> Restore
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── FAQ ─────────────────────────────────────────────────── */}
        {activeTab === "faq" && (
          <div className={`rounded-2xl border ${surface}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${divider}`}>
              <span className={`text-sm font-semibold ${strong}`}>Frequently asked questions</span>
              <button onClick={() => openFaqForm()} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white">
                <Plus className="w-3.5 h-3.5" /> Add question
              </button>
            </div>
            <div className="p-4 space-y-2">
              {faqs.map((f, i) => (
                <div key={f._id} className={`flex items-start gap-3 px-4 py-3.5 rounded-xl ${panel}`}>
                  <GripVertical className={`w-4 h-4 mt-1 shrink-0 ${muted}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`text-sm font-semibold ${strong}`}>{f.question}</p>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ${isDarkMode ? "bg-slate-800 text-slate-400" : "bg-white text-slate-500"}`}>{f.category}</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${muted}`}>{f.answer}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => moveFaq(i, -1)} disabled={i === 0} className={`w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30 ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-white"}`}><ArrowUp className="w-3.5 h-3.5" /></button>
                    <button onClick={() => moveFaq(i, 1)} disabled={i === faqs.length - 1} className={`w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-30 ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-white"}`}><ArrowDown className="w-3.5 h-3.5" /></button>
                    <button onClick={() => openFaqForm(f)} className={`text-xs font-medium px-2.5 py-1.5 rounded-lg ${isDarkMode ? "text-violet-400 hover:bg-slate-800" : "text-violet-600 hover:bg-white"}`}>Edit</button>
                    <button onClick={() => deleteFaq(f._id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-500/10"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Contact ─────────────────────────────────────────────── */}
        {activeTab === "contact" && (
          <div className={`rounded-2xl border ${surface} max-w-2xl`}>
            <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${divider}`}>
              <Contact2 className={`w-4 h-4 ${muted}`} />
              <span className={`text-sm font-semibold ${strong}`}>Contact information shown to users</span>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className={`text-xs font-medium flex items-center gap-1.5 mb-1.5 ${muted}`}><Mail className="w-3 h-3" /> Support email</label>
                <input value={contactDraft.supportEmail} onChange={e => setContactDraft(d => ({ ...d, supportEmail: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className={`text-xs font-medium flex items-center gap-1.5 mb-1.5 ${muted}`}><Phone className="w-3 h-3" /> Support phone</label>
                <input value={contactDraft.phone} onChange={e => setContactDraft(d => ({ ...d, phone: e.target.value }))} className={inputCls} />
              </div>
              <div>
                <label className={`text-xs font-medium flex items-center gap-1.5 mb-1.5 ${muted}`}><MapPin className="w-3 h-3" /> Office address</label>
                <textarea value={contactDraft.address} onChange={e => setContactDraft(d => ({ ...d, address: e.target.value }))} rows={2} className={inputCls} />
              </div>
              <div>
                <label className={`text-xs font-medium block mb-1.5 ${muted}`}>Support hours</label>
                <input value={contactDraft.hours} onChange={e => setContactDraft(d => ({ ...d, hours: e.target.value }))} className={inputCls} />
              </div>
              <div className={`flex items-center justify-between p-3 rounded-xl ${panel}`}>
                <div className="flex items-center gap-2.5">
                  <MessagesSquare className={`w-4 h-4 ${muted}`} />
                  <span className={`text-sm font-medium ${strong}`}>Live chat widget</span>
                </div>
                <button
                  onClick={() => setContactDraft(d => ({ ...d, liveChatEnabled: !d.liveChatEnabled }))}
                  className={`relative w-9 h-5 rounded-full transition-colors ${contactDraft.liveChatEnabled ? "bg-emerald-500" : isDarkMode ? "bg-slate-600" : "bg-slate-300"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${contactDraft.liveChatEnabled ? "left-4" : "left-0.5"}`} />
                </button>
              </div>
              <button onClick={saveContact} className="px-5 py-2.5 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white">
                Save changes
              </button>
              {JSON.stringify(contact) !== JSON.stringify(contactDraft) && (
                <p className={`text-xs ${muted}`}>You have unsaved changes.</p>
              )}
            </div>
          </div>
        )}

        {/* ── Banners ─────────────────────────────────────────────── */}
        {activeTab === "banners" && (
          <div className={`rounded-2xl border ${surface}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${divider}`}>
              <span className={`text-sm font-semibold ${strong}`}>Homepage banners</span>
              <button onClick={() => openBannerForm()} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white">
                <Plus className="w-3.5 h-3.5" /> Add banner
              </button>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map(b => (
                <div key={b._id} className={`rounded-xl overflow-hidden border ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}>
                  <div className="relative h-32">
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                    <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[11px] font-medium ${b.active ? "bg-emerald-500 text-white" : "bg-slate-900/70 text-slate-300"}`}>
                      {b.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className={`p-3.5 space-y-2 ${panel}`}>
                    <p className={`text-sm font-semibold ${strong}`}>{b.title}</p>
                    <p className={`text-xs ${muted}`}>{b.subtitle}</p>
                    <p className={`text-[11px] flex items-center gap-1 ${muted}`}><Link2 className="w-3 h-3" /> {b.ctaLabel} → {b.ctaLink}</p>
                    <p className={`text-[11px] ${muted}`}>{b.startDate} – {b.endDate}</p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <button onClick={() => toggleBannerActive(b._id)} className={`text-xs font-medium px-2.5 py-1.5 rounded-lg ${isDarkMode ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-white text-slate-600 hover:bg-slate-100"}`}>
                        {b.active ? "Deactivate" : "Activate"}
                      </button>
                      <button onClick={() => openBannerForm(b)} className={`text-xs font-medium px-2.5 py-1.5 rounded-lg ${isDarkMode ? "text-violet-400 hover:bg-slate-800" : "text-violet-600 hover:bg-white"}`}>Edit</button>
                      <button onClick={() => deleteBanner(b._id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-500/10 ml-auto"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Featured Auctions ───────────────────────────────────── */}
        {activeTab === "featured" && (
          <div className={`rounded-2xl border ${surface}`}>
            <div className={`flex items-center justify-between gap-3 px-5 py-4 border-b ${divider}`}>
              <span className={`text-sm font-semibold ${strong}`}>Homepage featured auctions</span>
              <input value={featuredSearch} onChange={e => setFeaturedSearch(e.target.value)} placeholder="Search by title or seller..." className={`${inputCls} max-w-xs`} />
            </div>
            <div className="divide-y divide-slate-700/20">
              {filteredFeatured.map(a => (
                <div key={a._id} className="flex items-center gap-4 px-5 py-3.5">
                  <img src={a.photo} alt={a.title} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${strong}`}>{a.title}</p>
                    <p className={`text-xs truncate ${muted}`}>{a.seller} · {a.category} · current bid ${a.currentBid.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <label className={`text-xs ${muted}`}>Order</label>
                    <input
                      type="number"
                      value={a.order}
                      onChange={e => updateFeaturedOrder(a._id, Number(e.target.value))}
                      disabled={!a.featured}
                      className={`${inputCls} w-16 disabled:opacity-40`}
                    />
                    <button
                      onClick={() => toggleFeatured(a._id)}
                      className={`relative w-9 h-5 rounded-full transition-colors ${a.featured ? "bg-amber-500" : isDarkMode ? "bg-slate-600" : "bg-slate-300"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${a.featured ? "left-4" : "left-0.5"}`} />
                    </button>
                  </div>
                </div>
              ))}
              {filteredFeatured.length === 0 && (
                <div className="p-12 text-center">
                  <Layers className={`w-8 h-8 mx-auto mb-2 ${muted}`} />
                  <p className={`text-sm ${muted}`}>No auctions match your search</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── FAQ form modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {showFaqForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowFaqForm(false)}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} transition={spring} className={`w-full max-w-md rounded-2xl ${surface}`} onClick={e => e.stopPropagation()}>
              <div className={`flex items-center justify-between px-6 py-4 border-b ${divider}`}>
                <span className={`text-sm font-semibold ${strong}`}>{editingFaqId ? "Edit FAQ entry" : "Add FAQ entry"}</span>
                <button onClick={() => setShowFaqForm(false)} className={muted}><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <input value={faqDraft.question} onChange={e => setFaqDraft(d => ({ ...d, question: e.target.value }))} placeholder="Question" className={inputCls} />
                <textarea value={faqDraft.answer} onChange={e => setFaqDraft(d => ({ ...d, answer: e.target.value }))} rows={3} placeholder="Answer" className={inputCls} />
                <select value={faqDraft.category} onChange={e => setFaqDraft(d => ({ ...d, category: e.target.value }))} className={inputCls}>
                  {["Buying", "Selling", "Account", "Payments"].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className={`flex justify-end gap-2.5 px-6 py-4 border-t ${divider}`}>
                <button onClick={() => setShowFaqForm(false)} className={`px-4 py-2 rounded-xl text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                <button onClick={saveFaq} className="px-4 py-2 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white">Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Banner form modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {showBannerForm && editingBanner && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowBannerForm(false)}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} transition={spring} className={`w-full max-w-md rounded-2xl ${surface} max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
              <div className={`flex items-center justify-between px-6 py-4 border-b sticky top-0 ${surface} ${divider}`}>
                <span className={`text-sm font-semibold ${strong}`}>{editingBanner._id ? "Edit banner" : "Add banner"}</span>
                <button onClick={() => setShowBannerForm(false)} className={muted}><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <input value={editingBanner.title} onChange={e => setEditingBanner(b => b && { ...b, title: e.target.value })} placeholder="Title" className={inputCls} />
                <input value={editingBanner.subtitle} onChange={e => setEditingBanner(b => b && { ...b, subtitle: e.target.value })} placeholder="Subtitle" className={inputCls} />
                <input value={editingBanner.image} onChange={e => setEditingBanner(b => b && { ...b, image: e.target.value })} placeholder="Image URL" className={inputCls} />
                <div className="grid grid-cols-2 gap-3">
                  <input value={editingBanner.ctaLabel} onChange={e => setEditingBanner(b => b && { ...b, ctaLabel: e.target.value })} placeholder="Button label" className={inputCls} />
                  <input value={editingBanner.ctaLink} onChange={e => setEditingBanner(b => b && { ...b, ctaLink: e.target.value })} placeholder="Link path" className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" value={editingBanner.startDate} onChange={e => setEditingBanner(b => b && { ...b, startDate: e.target.value })} className={inputCls} />
                  <input type="date" value={editingBanner.endDate} onChange={e => setEditingBanner(b => b && { ...b, endDate: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div className={`flex justify-end gap-2.5 px-6 py-4 border-t ${divider}`}>
                <button onClick={() => setShowBannerForm(false)} className={`px-4 py-2 rounded-xl text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                <button onClick={saveBanner} className="px-4 py-2 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white">Save banner</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Version viewer modal ──────────────────────────────────── */}
      <AnimatePresence>
        {viewingVersion && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setViewingVersion(null)}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} transition={spring} className={`w-full max-w-lg rounded-2xl ${surface}`} onClick={e => e.stopPropagation()}>
              <div className={`flex items-center justify-between px-6 py-4 border-b ${divider}`}>
                <span className={`text-sm font-semibold ${strong}`}>{viewingVersion.version} · {viewingVersion.publishedAt}</span>
                <button onClick={() => setViewingVersion(null)} className={muted}><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-3">
                <p className={`text-xs ${muted}`}>Published by {viewingVersion.publishedBy}</p>
                <p className={`text-sm p-3 rounded-xl ${panel} ${strong}`}>{viewingVersion.note}</p>
                <p className={`text-sm leading-relaxed ${strong}`}>{viewingVersion.content}</p>
              </div>
              <div className={`flex justify-end gap-2.5 px-6 py-4 border-t ${divider}`}>
                <button onClick={() => restoreVersion(viewingVersion)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white">
                  <RotateCcw className="w-3.5 h-3.5" /> Restore this version
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}