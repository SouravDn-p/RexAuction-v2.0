import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Gavel,
  Mail,
  Megaphone,
  Package,
  Settings2,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "../../../../hooks/useTheme";

// ─── Types ─────────────────────────────────────────────────────────────────

type Channel = "email" | "push" | "sms" | "banner";
type Category = "system" | "order" | "bid" | "promo" | "security";

interface UserNotification {
  _id: string;
  title: string;
  message: string;
  category: Category;
  channels: Channel[];
  createdAt: string;
  read: boolean;
  ctaLabel?: string;
  ctaLink?: string;
}

interface ChannelPref {
  category: Category;
  label: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

// ─── Config ────────────────────────────────────────────────────────────────

// Swap to "seller" to preview what a seller account would see.
const CURRENT_USER_ROLE: "buyer" | "seller" = "seller";

const CATEGORY_META: Record<Category, { label: string; icon: React.JSX.Element; color: string }> = {
  system: { label: "Platform", icon: <Sparkles className="w-4 h-4" />, color: "bg-violet-500/15 text-violet-400 border-violet-500/20" },
  order: { label: "Orders", icon: <Package className="w-4 h-4" />, color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
  bid: { label: "Bids & Auctions", icon: <Gavel className="w-4 h-4" />, color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  promo: { label: "Promotions", icon: <Megaphone className="w-4 h-4" />, color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  security: { label: "Account & Security", icon: <ShieldAlert className="w-4 h-4" />, color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
};

const CHANNEL_META: Record<Channel, { label: string; icon: React.JSX.Element }> = {
  email: { label: "Email", icon: <Mail className="w-3 h-3" /> },
  push: { label: "Push", icon: <Bell className="w-3 h-3" /> },
  sms: { label: "SMS", icon: <Smartphone className="w-3 h-3" /> },
  banner: { label: "Banner", icon: <Megaphone className="w-3 h-3" /> },
};

// ─── Mock data ─────────────────────────────────────────────────────────────
// Mirrors what an admin broadcast in AdminAnnouncementsPage would actually deliver to this user.

const ALL_NOTIFICATIONS: (UserNotification & { audience: "all" | "buyers" | "sellers" })[] = [
  {
    _id: "u1", audience: "all", category: "system", channels: ["email", "banner"],
    title: "Platform maintenance tonight, 11PM–1AM",
    message: "RexAuction will be briefly unavailable for scheduled maintenance. Any active bids will be preserved and auction end times extended automatically.",
    createdAt: "2026-07-05 14:22", read: true,
  },
  {
    _id: "u2", audience: "sellers", category: "system", channels: ["email", "push"],
    title: "New seller badge program is live",
    message: "Verified sellers now get a trust badge on every listing. Apply for verification from your seller dashboard to build more buyer confidence.",
    createdAt: "2026-07-03 09:05", read: true, ctaLabel: "Apply for verification", ctaLink: "/seller/verification",
  },
  {
    _id: "u3", audience: "buyers", category: "promo", channels: ["push", "sms"],
    title: "Weekend flash auctions — don't miss out",
    message: "Over 60 new listings just went live across Electronics and Collectibles, with several starting under $50.",
    createdAt: "2026-07-08 09:00", read: false, ctaLabel: "Browse listings", ctaLink: "/auctions",
  },
  {
    _id: "u4", audience: "sellers", category: "security", channels: ["email"],
    title: "Reminder: verify your NID for seller payouts",
    message: "Sellers without a verified national ID on file will have payouts held starting next month. Upload your documents to avoid delays.",
    createdAt: "2026-07-06 08:00", read: false, ctaLabel: "Upload documents", ctaLink: "/settings/verification",
  },
  {
    _id: "u5", audience: "all", category: "promo", channels: ["email", "push", "banner"],
    title: "Something big is coming this season",
    message: "Our biggest auction event of the year is almost here — stay tuned for details on featured lots, early access, and exclusive seller slots.",
    createdAt: "2026-07-07 08:30", read: false,
  },
  {
    _id: "u6", audience: "sellers", category: "order", channels: ["email", "push"],
    title: "Your payout of $860 was processed",
    message: "Funds for your completed sale of \"Vintage Leica M6 Camera\" have been sent to your linked account and should arrive within 1–2 business days.",
    createdAt: "2026-07-06 16:10", read: true,
  },
  {
    _id: "u7", audience: "buyers", category: "bid", channels: ["push"],
    title: "You've been outbid on \"1965 Fender Stratocaster\"",
    message: "Another buyer placed a higher bid. Jump back in before the auction closes in 3 hours to stay in the running.",
    createdAt: "2026-07-08 11:42", read: false, ctaLabel: "Place a new bid", ctaLink: "/auctions/fender-stratocaster",
  },
  {
    _id: "u8", audience: "sellers", category: "bid", channels: ["push", "email"],
    title: "Your listing \"Hand-carved Chess Set\" is ending soon",
    message: "This auction closes in 6 hours with 4 active bids. Consider sharing it once more to maximize the final price.",
    createdAt: "2026-07-08 06:00", read: true,
  },
];

const INITIAL_PREFS: ChannelPref[] = [
  { category: "order", label: "Orders & payouts", email: true, push: true, sms: false },
  { category: "bid", label: "Bids & auctions", email: false, push: true, sms: true },
  { category: "promo", label: "Promotions", email: true, push: false, sms: false },
  { category: "security", label: "Account & security", email: true, push: true, sms: true },
  { category: "system", label: "Platform updates", email: true, push: false, sms: false },
];

const spring = { type: "spring" as const, stiffness: 120, damping: 20 };

const timeAgo = (dateStr: string) => {
  const diffMs = Date.now() - new Date(dateStr.replace(" ", "T")).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${Math.max(mins, 1)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

// ─── Component ─────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const { isDarkMode } = useTheme();

  const [items, setItems] = useState(
    ALL_NOTIFICATIONS.filter(n => n.audience === "all" || n.audience === `${CURRENT_USER_ROLE}s`)
  );
  const [prefs, setPrefs] = useState<ChannelPref[]>(INITIAL_PREFS);
  const [filter, setFilter] = useState<"all" | "unread" | Category>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const divider = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const panel = isDarkMode ? "bg-slate-700/40" : "bg-slate-50";
  const hover = isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-slate-50";

  const selected = useMemo(() => items.find(i => i._id === selectedId) || null, [items, selectedId]);
  const unreadCount = items.filter(i => !i.read).length;

  const filterTabs: { key: "all" | "unread" | Category; label: string }[] = [
    { key: "all", label: "All" },
    { key: "unread", label: `Unread${unreadCount ? ` (${unreadCount})` : ""}` },
    { key: "bid", label: "Bids & Auctions" },
    { key: "order", label: "Orders" },
    { key: "promo", label: "Promotions" },
    { key: "security", label: "Account & Security" },
  ];

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "unread") return items.filter(i => !i.read);
    return items.filter(i => i.category === filter);
  }, [items, filter]);

  const stats = [
    { label: "Unread", value: unreadCount, icon: <Bell className="w-4 h-4" />, color: "text-violet-400", bg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50", bar: "from-violet-500 to-blue-500" },
    { label: "Bids & auctions", value: items.filter(i => i.category === "bid").length, icon: <Gavel className="w-4 h-4" />, color: "text-emerald-400", bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50", bar: "from-emerald-500 to-teal-500" },
    { label: "Orders & payouts", value: items.filter(i => i.category === "order").length, icon: <Package className="w-4 h-4" />, color: "text-sky-400", bg: isDarkMode ? "bg-sky-500/10" : "bg-sky-50", bar: "from-sky-500 to-blue-400" },
    { label: "Promotions", value: items.filter(i => i.category === "promo").length, icon: <Megaphone className="w-4 h-4" />, color: "text-amber-400", bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50", bar: "from-amber-500 to-orange-500" },
  ];

  // ── Handlers ─────────────────────────────────────────────────────────────
  const openItem = (item: UserNotification) => {
    setSelectedId(item._id);
    if (!item.read) setItems(prev => prev.map(i => i._id === item._id ? { ...i, read: true } : i));
  };

  const markAllRead = () => {
    setItems(prev => prev.map(i => ({ ...i, read: true })));
    toast.success("All notifications marked as read");
  };

  const toggleRead = (item: UserNotification) => {
    setItems(prev => prev.map(i => i._id === item._id ? { ...i, read: !i.read } : i));
  };

  const deleteItem = (item: UserNotification) => {
    setItems(prev => prev.filter(i => i._id !== item._id));
    toast.error("Notification removed");
    setSelectedId(null);
  };

  const togglePref = (category: Category, channel: "email" | "push" | "sms") => {
    setPrefs(prev => prev.map(p => p.category === category ? { ...p, [channel]: !p[channel] } : p));
  };

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
            <h1 className="text-xl font-bold tracking-tight">Notifications</h1>
            <p className={`text-xs mt-0.5 ${muted}`}>Updates on your bids, orders, and account — plus platform news</p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shrink-0 ${isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-200" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}>
              <CheckCheck className="w-3.5 h-3.5" /> Mark all as read
            </button>
          )}
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
          {/* ── Left: notification list ───────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {filterTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    filter === tab.key ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={`rounded-2xl border ${surface}`}>
              {filtered.length === 0 ? (
                <div className="p-14 text-center">
                  <BellOff className={`w-10 h-10 mx-auto mb-3 ${muted}`} />
                  <p className={`text-sm font-medium ${strong}`}>Nothing here</p>
                  <p className={`text-xs mt-1 ${muted}`}>You're all caught up in this category</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700/20">
                  {filtered.map((item, i) => (
                    <motion.button
                      key={item._id}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      onClick={() => openItem(item)}
                      className={`w-full text-left flex items-start gap-3 px-5 py-4 transition-colors ${hover} ${!item.read ? (isDarkMode ? "bg-violet-500/5" : "bg-violet-50/50") : ""}`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${CATEGORY_META[item.category].color}`}>
                        {CATEGORY_META[item.category].icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <p className={`text-sm ${!item.read ? "font-semibold" : "font-medium"} ${strong}`}>{item.title}</p>
                          {!item.read && <span className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0" />}
                        </div>
                        <p className={`text-xs line-clamp-1 mt-0.5 ${muted}`}>{item.message}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {item.channels.map(c => (
                            <span key={c} className={`inline-flex items-center gap-1 text-[11px] ${muted}`}>{CHANNEL_META[c].icon}</span>
                          ))}
                          <span className={`text-[11px] ml-auto ${muted}`}>{timeAgo(item.createdAt)}</span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: notification preferences ───────────────────── */}
          <div className="space-y-5">
            <div className={`rounded-2xl border ${surface}`}>
              <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${divider}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-slate-700" : "bg-slate-100"}`}>
                  <Settings2 className={`w-3.5 h-3.5 ${muted}`} />
                </div>
                <span className={`text-sm font-semibold ${strong}`}>Notification preferences</span>
              </div>
              <div className="p-4 space-y-3">
                {prefs.map(p => (
                  <div key={p.category} className={`p-3 rounded-xl ${panel}`}>
                    <p className={`text-xs font-medium mb-2.5 ${strong}`}>{p.label}</p>
                    <div className="flex items-center gap-4">
                      {(["email", "push", "sms"] as const).map(ch => (
                        <label key={ch} className="flex items-center gap-1.5 cursor-pointer">
                          <button
                            onClick={() => togglePref(p.category, ch)}
                            className={`relative w-8 h-4.5 rounded-full transition-colors ${p[ch] ? "bg-emerald-500" : isDarkMode ? "bg-slate-600" : "bg-slate-300"}`}
                            style={{ height: "18px" }}
                          >
                            <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-all ${p[ch] ? "left-4" : "left-0.5"}`} />
                          </button>
                          <span className={`text-[11px] ${muted}`}>{ch === "email" ? "Email" : ch === "push" ? "Push" : "SMS"}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl border p-5 ${surface}`}>
              <div className="flex items-center gap-2.5 mb-3">
                <Bell className={`w-4 h-4 ${isDarkMode ? "text-violet-400" : "text-violet-500"}`} />
                <span className={`text-sm font-semibold ${strong}`}>Tip</span>
              </div>
              <p className={`text-xs leading-relaxed ${muted}`}>
                Keep push notifications on for bids — outbid alerts arrive instantly, while email digests can lag by a few minutes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Detail modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedId(null)}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} transition={spring} className={`w-full max-w-lg rounded-2xl ${surface} max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
              <div className={`flex items-center justify-between px-6 py-4 border-b sticky top-0 ${surface} ${divider}`}>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${CATEGORY_META[selected.category].color}`}>
                  {CATEGORY_META[selected.category].icon} {CATEGORY_META[selected.category].label}
                </span>
                <button onClick={() => setSelectedId(null)} className={muted}><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <h3 className={`text-base font-semibold mb-2 ${strong}`}>{selected.title}</h3>
                  <p className={`text-sm leading-relaxed p-3 rounded-xl ${panel} ${strong}`}>{selected.message}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className={`text-xs ${muted}`}>{timeAgo(selected.createdAt)} · {selected.createdAt}</span>
                  <span className={`text-xs flex items-center gap-1 ${muted}`}>
                    Delivered via {selected.channels.map(c => CHANNEL_META[c].label).join(", ")}
                  </span>
                </div>

                {selected.ctaLabel && (
                  <button className="w-full py-2.5 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white">
                    {selected.ctaLabel}
                  </button>
                )}

                <div className={`flex gap-2 pt-2 border-t ${divider}`}>
                  <button onClick={() => toggleRead(selected)} className={`flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 ${isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}>
                    <Check className="w-3.5 h-3.5" /> Mark as {selected.read ? "unread" : "read"}
                  </button>
                  <button onClick={() => deleteItem(selected)} className="flex-1 py-2.5 rounded-xl text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center gap-2">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
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