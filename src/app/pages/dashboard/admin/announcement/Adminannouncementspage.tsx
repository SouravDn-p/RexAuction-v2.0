import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Crown,
  Loader2,
  Mail,
  Megaphone,
  Radio,
  Send,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "../../../../../hooks/useTheme";

// ─── Types ─────────────────────────────────────────────────────────────────

type Channel = "email" | "push" | "sms" | "banner";
type Audience = "all" | "buyers" | "sellers" | "admins" | "active" | "suspended";
type NotifStatus = "draft" | "scheduled" | "sent" | "sending" | "cancelled" | "failed";

interface DeliveryStats {
  recipients: number;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
}

interface AnnouncementItem {
  _id: string;
  title: string;
  message: string;
  channels: Channel[];
  audience: Audience;
  status: NotifStatus;
  createdBy: string;
  createdAt: string;
  scheduledFor?: string;
  sentAt?: string;
  stats?: DeliveryStats;
}

interface IntegrationConfig {
  key: Channel;
  label: string;
  provider: string;
  connected: boolean;
  icon: React.JSX.Element;
  detail: string;
}

// ─── Mock data ─────────────────────────────────────────────────────────────

const AUDIENCE_LABEL: Record<Audience, string> = {
  all: "All users",
  buyers: "Buyers only",
  sellers: "Sellers only",
  admins: "Admins",
  active: "Active accounts",
  suspended: "Suspended / banned accounts",
};

const AUDIENCE_COUNT: Record<Audience, number> = {
  all: 4821,
  buyers: 4509,
  sellers: 312,
  admins: 6,
  active: 4602,
  suspended: 128,
};

const CHANNEL_META: Record<Channel, { label: string; icon: React.JSX.Element; color: string }> = {
  email: { label: "Email", icon: <Mail className="w-3.5 h-3.5" />, color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
  push: { label: "Push", icon: <Bell className="w-3.5 h-3.5" />, color: "bg-violet-500/15 text-violet-400 border-violet-500/20" },
  sms: { label: "SMS", icon: <Smartphone className="w-3.5 h-3.5" />, color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  banner: { label: "In-app banner", icon: <Megaphone className="w-3.5 h-3.5" />, color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
};

const STATUS_META: Record<NotifStatus, { label: string; icon: React.JSX.Element; color: string }> = {
  draft: { label: "Draft", icon: <Copy className="w-3.5 h-3.5" />, color: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
  scheduled: { label: "Scheduled", icon: <Clock className="w-3.5 h-3.5" />, color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  sending: { label: "Sending", icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />, color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
  sent: { label: "Sent", icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  cancelled: { label: "Cancelled", icon: <XCircle className="w-3.5 h-3.5" />, color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
  failed: { label: "Failed", icon: <XCircle className="w-3.5 h-3.5" />, color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
};

const INITIAL_ITEMS: AnnouncementItem[] = [
  {
    _id: "n1",
    title: "Platform maintenance tonight, 11PM–1AM",
    message: "RexAuction will be briefly unavailable for scheduled maintenance. Any active bids will be preserved and auction end times extended automatically.",
    channels: ["email", "banner"],
    audience: "all",
    status: "sent",
    createdBy: "Admin Sara",
    createdAt: "2026-07-05 14:20",
    sentAt: "2026-07-05 14:22",
    stats: { recipients: 4821, delivered: 4780, opened: 3012, clicked: 640, failed: 41 },
  },
  {
    _id: "n2",
    title: "New seller badge program is live",
    message: "Verified sellers now get a trust badge on every listing. Apply for verification from your seller dashboard today.",
    channels: ["email", "push"],
    audience: "sellers",
    status: "sent",
    createdBy: "Admin Rafiq",
    createdAt: "2026-07-03 09:00",
    sentAt: "2026-07-03 09:05",
    stats: { recipients: 312, delivered: 309, opened: 244, clicked: 98, failed: 3 },
  },
  {
    _id: "n3",
    title: "Weekend flash auctions — don't miss out",
    message: "Over 60 new listings just went live across Electronics and Collectibles, with several starting under $50.",
    channels: ["push", "sms"],
    audience: "buyers",
    status: "scheduled",
    createdBy: "You",
    createdAt: "2026-07-06 16:40",
    scheduledFor: "2026-07-11 09:00",
  },
  {
    _id: "n4",
    title: "Reminder: verify your NID for seller payouts",
    message: "Sellers without a verified national ID on file will have payouts held starting next month. Upload your documents to avoid delays.",
    channels: ["email"],
    audience: "sellers",
    status: "scheduled",
    createdBy: "Admin Sara",
    createdAt: "2026-07-06 11:12",
    scheduledFor: "2026-07-09 08:00",
  },
  {
    _id: "n5",
    title: "Draft: Holiday promotion teaser",
    message: "Something big is coming this season — stay tuned for details on our biggest auction event of the year.",
    channels: ["email", "push", "banner"],
    audience: "all",
    status: "draft",
    createdBy: "You",
    createdAt: "2026-07-07 08:30",
  },
  {
    _id: "n6",
    title: "Account security check required",
    message: "We noticed unusual login activity on suspended accounts. Please review the attached security checklist.",
    channels: ["email", "sms"],
    audience: "suspended",
    status: "failed",
    createdBy: "Admin Rafiq",
    createdAt: "2026-06-30 10:00",
    sentAt: "2026-06-30 10:02",
    stats: { recipients: 128, delivered: 61, opened: 20, clicked: 4, failed: 67 },
  },
];

const INITIAL_INTEGRATIONS: IntegrationConfig[] = [
  { key: "email", label: "Email", provider: "SendGrid", connected: true, icon: <Mail className="w-4 h-4" />, detail: "Transactional + broadcast sending" },
  { key: "push", label: "Push notifications", provider: "Firebase Cloud Messaging", connected: true, icon: <Bell className="w-4 h-4" />, detail: "iOS, Android and web push" },
  { key: "sms", label: "SMS", provider: "Twilio", connected: false, icon: <Smartphone className="w-4 h-4" />, detail: "Not connected — add credentials to enable" },
  { key: "banner", label: "In-app banner", provider: "Built-in", connected: true, icon: <Megaphone className="w-4 h-4" />, detail: "Shows across web and mobile app home screens" },
];

const spring = { type: "spring" as const, stiffness: 120, damping: 20 };

// ─── Component ─────────────────────────────────────────────────────────────

export default function AdminAnnouncementsPage() {
  const { isDarkMode } = useTheme();

  const [items, setItems] = useState<AnnouncementItem[]>(INITIAL_ITEMS);
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>(INITIAL_INTEGRATIONS);
  const [statusFilter, setStatusFilter] = useState<"all" | NotifStatus>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);

  // compose form
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [channels, setChannels] = useState<Channel[]>(["email"]);
  const [audience, setAudience] = useState<Audience>("all");
  const [sendMode, setSendMode] = useState<"now" | "later">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("09:00");

  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const divider = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const panel = isDarkMode ? "bg-slate-700/40" : "bg-slate-50";
  const hover = isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-slate-50";
  const inputCls = `w-full px-3 py-2 text-sm rounded-xl border outline-none transition-all ${
    isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
  }`;

  const selected = useMemo(() => items.find(i => i._id === selectedId) || null, [items, selectedId]);

  const filtered = useMemo(
    () => (statusFilter === "all" ? items : items.filter(i => i.status === statusFilter)),
    [items, statusFilter]
  );

  const stats = [
    { label: "Sent this month", value: items.filter(i => i.status === "sent").length, icon: <Send className="w-4 h-4" />, color: "text-emerald-400", bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50", bar: "from-emerald-500 to-teal-500" },
    { label: "Scheduled", value: items.filter(i => i.status === "scheduled").length, icon: <Clock className="w-4 h-4" />, color: "text-amber-400", bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50", bar: "from-amber-500 to-orange-500" },
    { label: "Avg. open rate", value: "58%", icon: <Sparkles className="w-4 h-4" />, color: "text-sky-400", bg: isDarkMode ? "bg-sky-500/10" : "bg-sky-50", bar: "from-sky-500 to-blue-400" },
    { label: "Channels connected", value: `${integrations.filter(c => c.connected).length}/${integrations.length}`, icon: <Radio className="w-4 h-4" />, color: "text-violet-400", bg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50", bar: "from-violet-500 to-blue-500" },
  ];

  const statusTabs: { key: "all" | NotifStatus; label: string }[] = [
    { key: "all", label: "All" },
    { key: "sent", label: "Sent" },
    { key: "scheduled", label: "Scheduled" },
    { key: "draft", label: "Drafts" },
    { key: "failed", label: "Failed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  // ── Compose helpers ──────────────────────────────────────────────────────
  const resetCompose = () => {
    setTitle(""); setMessage(""); setChannels(["email"]); setAudience("all");
    setSendMode("now"); setScheduleDate(""); setScheduleTime("09:00");
  };

  const openCompose = () => { resetCompose(); setShowCompose(true); };

  const toggleChannel = (c: Channel) => {
    setChannels(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const validateCompose = () => {
    if (!title.trim()) { toast.error("Give the announcement a title"); return false; }
    if (!message.trim()) { toast.error("Write a message body"); return false; }
    if (channels.length === 0) { toast.error("Choose at least one channel"); return false; }
    const disconnected = channels.filter(c => !integrations.find(i => i.key === c)?.connected);
    if (disconnected.length > 0) { toast.error(`${CHANNEL_META[disconnected[0]].label} isn't connected yet`); return false; }
    if (sendMode === "later" && !scheduleDate) { toast.error("Pick a date to schedule for"); return false; }
    return true;
  };

  const saveDraft = () => {
    if (!title.trim()) { toast.error("Give the announcement a title"); return; }
    const draft: AnnouncementItem = {
      _id: `n-${Date.now()}`, title: title.trim(), message: message.trim(), channels, audience,
      status: "draft", createdBy: "You", createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
    };
    setItems(prev => [draft, ...prev]);
    toast.success("Saved as draft");
    setShowCompose(false);
  };

  const sendOrSchedule = () => {
    if (!validateCompose()) return;
    const now = new Date().toISOString().slice(0, 16).replace("T", " ");
    const recipients = AUDIENCE_COUNT[audience];
    if (sendMode === "later") {
      const item: AnnouncementItem = {
        _id: `n-${Date.now()}`, title: title.trim(), message: message.trim(), channels, audience,
        status: "scheduled", createdBy: "You", createdAt: now, scheduledFor: `${scheduleDate} ${scheduleTime}`,
      };
      setItems(prev => [item, ...prev]);
      toast.success(`Scheduled for ${scheduleDate} at ${scheduleTime}`);
    } else {
      const delivered = Math.round(recipients * 0.97);
      const opened = Math.round(delivered * 0.55);
      const item: AnnouncementItem = {
        _id: `n-${Date.now()}`, title: title.trim(), message: message.trim(), channels, audience,
        status: "sent", createdBy: "You", createdAt: now, sentAt: now,
        stats: { recipients, delivered, opened, clicked: Math.round(opened * 0.3), failed: recipients - delivered },
      };
      setItems(prev => [item, ...prev]);
      toast.success(`Sent to ${recipients.toLocaleString()} recipients`);
    }
    setShowCompose(false);
  };

  const cancelScheduled = (item: AnnouncementItem) => {
    setItems(prev => prev.map(i => i._id === item._id ? { ...i, status: "cancelled" } : i));
    toast.error(`"${item.title}" cancelled`);
    setSelectedId(null);
  };

  const duplicateItem = (item: AnnouncementItem) => {
    setTitle(`${item.title} (copy)`); setMessage(item.message); setChannels(item.channels);
    setAudience(item.audience); setSendMode("now"); setScheduleDate(""); setScheduleTime("09:00");
    setSelectedId(null);
    setShowCompose(true);
  };

  const toggleIntegration = (key: Channel) => {
    setIntegrations(prev => prev.map(i => {
      if (i.key !== key) return i;
      const next = !i.connected;
      toast.success(`${i.label} ${next ? "connected" : "disconnected"}`);
      return { ...i, connected: next, detail: next ? i.detail.replace("Not connected — add credentials to enable", "Ready to send") : "Not connected — add credentials to enable" };
    }));
  };

  const sendTest = (label: string) => toast.success(`Test ${label.toLowerCase()} sent to your admin account`);

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
        <div className="px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight">Notifications & Announcements</h1>
            <p className={`text-xs mt-0.5 ${muted}`}>Broadcast messages by email, push, SMS or in-app banner — instantly or on a schedule</p>
          </div>
          <button
            onClick={openCompose}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5" /> New announcement
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
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.bg}`}>
                  <span className={s.color}>{s.icon}</span>
                </div>
              </div>
              <div className={`h-0.5 bg-gradient-to-r ${s.bar}`} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* ── Left: history list ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {statusTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    statusFilter === tab.key ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={`rounded-2xl border ${surface}`}>
              {filtered.length === 0 ? (
                <div className="p-14 text-center">
                  <Megaphone className={`w-10 h-10 mx-auto mb-3 ${muted}`} />
                  <p className={`text-sm font-medium ${strong}`}>Nothing here yet</p>
                  <p className={`text-xs mt-1 ${muted}`}>Announcements matching this filter will show up here</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700/20">
                  {filtered.map((item, i) => (
                    <motion.button
                      key={item._id}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      onClick={() => setSelectedId(item._id)}
                      className={`w-full text-left flex flex-col gap-2 px-5 py-4 transition-colors ${hover}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className={`text-sm font-semibold ${strong}`}>{item.title}</p>
                        <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_META[item.status].color}`}>
                          {STATUS_META[item.status].icon} {STATUS_META[item.status].label}
                        </span>
                      </div>
                      <p className={`text-xs line-clamp-1 ${muted}`}>{item.message}</p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {item.channels.map(c => (
                          <span key={c} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${CHANNEL_META[c].color}`}>
                            {CHANNEL_META[c].icon} {CHANNEL_META[c].label}
                          </span>
                        ))}
                        <span className={`text-[11px] flex items-center gap-1 ml-1 ${muted}`}>
                          <Users className="w-3 h-3" /> {AUDIENCE_LABEL[item.audience]}
                        </span>
                        <span className={`text-[11px] ml-auto ${muted}`}>
                          {item.status === "scheduled" ? `Scheduled · ${item.scheduledFor}` : item.status === "sent" ? `Sent · ${item.sentAt}` : `Created · ${item.createdAt}`}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: channel integrations ───────────────────────── */}
          <div className="space-y-5">
            <div className={`rounded-2xl border ${surface}`}>
              <div className={`flex items-center gap-2.5 px-5 py-4 border-b ${divider}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-slate-700" : "bg-slate-100"}`}>
                  <Settings2 className={`w-3.5 h-3.5 ${muted}`} />
                </div>
                <span className={`text-sm font-semibold ${strong}`}>Channel integrations</span>
              </div>
              <div className="p-4 space-y-2.5">
                {integrations.map(c => (
                  <div key={c.key} className={`flex items-center gap-3 p-3 rounded-xl ${panel}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${c.connected ? (isDarkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-600") : (isDarkMode ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-400")}`}>
                      {c.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${strong}`}>{c.label} <span className={muted}>· {c.provider}</span></p>
                      <p className={`text-[11px] truncate ${muted}`}>{c.detail}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {c.connected && (
                        <button onClick={() => sendTest(c.label)} className={`text-[11px] font-medium px-2 py-1 rounded-lg ${isDarkMode ? "text-violet-400 hover:bg-slate-800" : "text-violet-600 hover:bg-white"}`}>
                          Test
                        </button>
                      )}
                      <button
                        onClick={() => toggleIntegration(c.key)}
                        className={`relative w-9 h-5 rounded-full transition-colors ${c.connected ? "bg-emerald-500" : isDarkMode ? "bg-slate-600" : "bg-slate-300"}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${c.connected ? "left-4" : "left-0.5"}`} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl border p-5 ${surface}`}>
              <div className="flex items-center gap-2.5 mb-3">
                <Crown className={`w-4 h-4 ${isDarkMode ? "text-amber-400" : "text-amber-500"}`} />
                <span className={`text-sm font-semibold ${strong}`}>Segmentation tip</span>
              </div>
              <p className={`text-xs leading-relaxed ${muted}`}>
                Target suspended accounts sparingly — deliverability tends to be lower and messages can read as punitive. Reserve broad "All users" sends for platform-wide notices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Compose modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showCompose && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowCompose(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={spring}
              className={`w-full max-w-xl rounded-2xl ${surface} max-h-[92vh] overflow-y-auto`}
              onClick={e => e.stopPropagation()}
            >
              <div className={`flex items-center justify-between px-6 py-4 border-b sticky top-0 ${surface} ${divider}`}>
                <span className={`text-sm font-semibold ${strong}`}>New announcement</span>
                <button onClick={() => setShowCompose(false)} className={muted}><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className={`text-xs font-medium block mb-1.5 ${muted}`}>Title</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Scheduled maintenance tonight" className={inputCls} />
                </div>
                <div>
                  <label className={`text-xs font-medium block mb-1.5 ${muted}`}>Message</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="Write the announcement body..." className={inputCls} />
                </div>

                <div>
                  <label className={`text-xs font-medium block mb-1.5 ${muted}`}>Channels</label>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(CHANNEL_META) as Channel[]).map(c => {
                      const connected = integrations.find(i => i.key === c)?.connected;
                      const active = channels.includes(c);
                      return (
                        <button
                          key={c}
                          onClick={() => toggleChannel(c)}
                          disabled={!connected}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                            active ? CHANNEL_META[c].color + " ring-1 ring-current" : isDarkMode ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"
                          }`}
                        >
                          {CHANNEL_META[c].icon} {CHANNEL_META[c].label}{!connected && " (not connected)"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className={`text-xs font-medium block mb-1.5 ${muted}`}>Audience</label>
                  <select value={audience} onChange={e => setAudience(e.target.value as Audience)} className={inputCls}>
                    {(Object.keys(AUDIENCE_LABEL) as Audience[]).map(a => (
                      <option key={a} value={a}>{AUDIENCE_LABEL[a]} · {AUDIENCE_COUNT[a].toLocaleString()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`text-xs font-medium block mb-1.5 ${muted}`}>Delivery</label>
                  <div className="flex gap-2 mb-3">
                    <button onClick={() => setSendMode("now")} className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${sendMode === "now" ? "bg-violet-500/15 text-violet-400 border-violet-500/30" : isDarkMode ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                      Send now
                    </button>
                    <button onClick={() => setSendMode("later")} className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${sendMode === "later" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" : isDarkMode ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                      Schedule for later
                    </button>
                  </div>
                  {sendMode === "later" && (
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
                          <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className={`${inputCls} pl-9`} />
                        </div>
                      </div>
                      <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className={`${inputCls} w-32`} />
                    </div>
                  )}
                </div>
              </div>

              <div className={`flex items-center justify-end gap-2.5 px-6 py-4 border-t ${divider}`}>
                <button onClick={saveDraft} className={`px-4 py-2 rounded-xl text-xs font-medium ${isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}>
                  Save as draft
                </button>
                <button onClick={sendOrSchedule} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors">
                  <Send className="w-3.5 h-3.5" /> {sendMode === "now" ? "Send now" : "Schedule"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Detail modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={spring}
              className={`w-full max-w-lg rounded-2xl ${surface} max-h-[90vh] overflow-y-auto`}
              onClick={e => e.stopPropagation()}
            >
              <div className={`flex items-center justify-between px-6 py-4 border-b sticky top-0 ${surface} ${divider}`}>
                <span className={`text-sm font-semibold ${strong}`}>Announcement details</span>
                <button onClick={() => setSelectedId(null)} className={muted}><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className={`text-base font-semibold ${strong}`}>{selected.title}</h3>
                    <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_META[selected.status].color}`}>
                      {STATUS_META[selected.status].icon} {STATUS_META[selected.status].label}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed p-3 rounded-xl ${panel} ${strong}`}>{selected.message}</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {selected.channels.map(c => (
                    <span key={c} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${CHANNEL_META[c].color}`}>
                      {CHANNEL_META[c].icon} {CHANNEL_META[c].label}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className={muted}>Audience</p><p className={strong}>{AUDIENCE_LABEL[selected.audience]}</p></div>
                  <div><p className={muted}>Created by</p><p className={strong}>{selected.createdBy}</p></div>
                  <div><p className={muted}>Created</p><p className={strong}>{selected.createdAt}</p></div>
                  <div><p className={muted}>{selected.status === "scheduled" ? "Scheduled for" : "Sent at"}</p><p className={strong}>{selected.scheduledFor || selected.sentAt || "—"}</p></div>
                </div>

                {selected.stats && (
                  <div className={`rounded-2xl p-4 space-y-3 ${panel}`}>
                    <p className={`text-xs font-semibold flex items-center gap-2 ${strong}`}><ShieldCheck className="w-3.5 h-3.5" /> Delivery breakdown</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><p className={muted}>Recipients</p><p className={strong}>{selected.stats.recipients.toLocaleString()}</p></div>
                      <div><p className={muted}>Delivered</p><p className={strong}>{selected.stats.delivered.toLocaleString()}</p></div>
                      <div><p className={muted}>Opened</p><p className={strong}>{selected.stats.opened.toLocaleString()} ({Math.round((selected.stats.opened / selected.stats.recipients) * 100)}%)</p></div>
                      <div><p className={muted}>Failed</p><p className="text-rose-500">{selected.stats.failed.toLocaleString()}</p></div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  {selected.status === "scheduled" && (
                    <button onClick={() => cancelScheduled(selected)} className="flex-1 py-2.5 rounded-xl text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center gap-2">
                      <XCircle className="w-3.5 h-3.5" /> Cancel scheduled send
                    </button>
                  )}
                  <button onClick={() => duplicateItem(selected)} className={`flex-1 py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 ${isDarkMode ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}>
                    <Copy className="w-3.5 h-3.5" /> Duplicate
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