import { AnimatePresence, motion } from "framer-motion";
import {
    AlertOctagon,
    Ban,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Eye,
    Flag,
    History,
    LifeBuoy,
    MessageCircle,
    MessageSquareWarning,
    RotateCcw,
    Scale,
    Search,
    Send,
    ShieldAlert,
    Trash2,
    UserX,
    X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "../../../../../hooks/useTheme";

// ─── Types ─────────────────────────────────────────────────────────────────

type DisputeType = "buyer_complaint" | "seller_complaint";
type DisputeStatus = "open" | "resolved";
type ResolutionOutcome = "refund_buyer" | "penalize_seller" | "warn_seller" | "dismissed";

interface DisputeAuditEntry { id: string; detail: string; admin: string; date: string }

interface Dispute {
  _id: string;
  auctionTitle: string;
  coverImage: string;
  buyer: { name: string; photo: string };
  seller: { name: string; photo: string };
  amount: number;
  type: DisputeType;
  reason: string;
  description: string;
  date: string;
  status: DisputeStatus;
  resolution?: { outcome: ResolutionOutcome; note: string; date: string; admin: string };
  auditTrail: DisputeAuditEntry[];
}

type TicketStatus = "open" | "pending" | "closed";
type TicketPriority = "low" | "medium" | "high" | "urgent";
interface TicketMessage { id: string; from: "user" | "admin"; text: string; date: string }
interface Ticket {
  _id: string;
  subject: string;
  user: { name: string; photo: string; email: string };
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdDate: string;
  messages: TicketMessage[];
}

interface FlaggedMessage {
  id: string;
  snippet: string;
  sender: { name: string; photo: string };
  reportedBy: string;
  reason: string;
  context: string;
  date: string;
  status: "pending" | "dismissed" | "actioned";
}

interface ReportedUser {
  id: string;
  name: string;
  photo: string;
  reportCount: number;
  lastReason: string;
  lastDate: string;
}

// ─── Mock data ─────────────────────────────────────────────────────────────

const MOCK_DISPUTES: Dispute[] = [
  {
    _id: "d1",
    auctionTitle: "Restored 1978 Vespa Scooter",
    coverImage: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=200&q=80",
    buyer: { name: "Emily Carter", photo: "https://ui-avatars.com/api/?name=Emily+Carter&background=7c3aed&color=fff" },
    seller: { name: "Ken Watanabe", photo: "https://ui-avatars.com/api/?name=Ken+Watanabe&background=475569&color=fff" },
    amount: 2150,
    type: "buyer_complaint",
    reason: "Item not as described",
    description: "Buyer reports the odometer reading shown at pickup does not match the listing description (12,400 km listed vs 34,000 km on the dash).",
    date: "2026-06-23",
    status: "open",
    auditTrail: [{ id: "a1", detail: "Dispute opened by buyer", admin: "Buyer", date: "2026-06-23" }],
  },
  {
    _id: "d2",
    auctionTitle: "Rare Vinyl Record Collection",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&q=80",
    buyer: { name: "Sofia Diaz", photo: "https://ui-avatars.com/api/?name=Sofia+Diaz&background=be185d&color=fff" },
    seller: { name: "Noah Kim", photo: "https://ui-avatars.com/api/?name=Noah+Kim&background=0369a1&color=fff" },
    amount: 380,
    type: "buyer_complaint",
    reason: "Item damaged in transit",
    description: "Several records arrived with cracked sleeves and warped vinyl; buyer has photos showing damage.",
    date: "2026-06-08",
    status: "resolved",
    resolution: { outcome: "refund_buyer", note: "Full refund issued after seller confirmed inadequate packaging; return shipment received.", date: "2026-06-10", admin: "Admin Rafiq" },
    auditTrail: [
      { id: "a1", detail: "Dispute opened by buyer — item damaged in transit", admin: "Buyer", date: "2026-06-08" },
      { id: "a2", detail: "Resolved — refunded buyer in full", admin: "Admin Rafiq", date: "2026-06-10" },
    ],
  },
  {
    _id: "d3",
    auctionTitle: "Gaming PC — RTX 4090 Build",
    coverImage: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=200&q=80",
    buyer: { name: "Marcus Webb", photo: "https://ui-avatars.com/api/?name=Marcus+Webb&background=1d4ed8&color=fff" },
    seller: { name: "Priya Sharma", photo: "https://ui-avatars.com/api/?name=Priya+Sharma&background=9333ea&color=fff" },
    amount: 1650,
    type: "seller_complaint",
    reason: "Buyer chargeback after delivery",
    description: "Seller reports buyer confirmed delivery, then filed a chargeback with their card issuer 5 days later without contacting seller first.",
    date: "2026-06-30",
    status: "open",
    auditTrail: [{ id: "a1", detail: "Dispute opened by seller — chargeback after confirmed delivery", admin: "Seller", date: "2026-06-30" }],
  },
  {
    _id: "d4",
    auctionTitle: "Hand-carved Rosewood Chess Set",
    coverImage: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=200&q=80",
    buyer: { name: "Zara Nguyen", photo: "https://ui-avatars.com/api/?name=Zara+Nguyen&background=be185d&color=fff" },
    seller: { name: "Priya Sharma", photo: "https://ui-avatars.com/api/?name=Priya+Sharma&background=9333ea&color=fff" },
    amount: 150,
    type: "buyer_complaint",
    reason: "Seller has not shipped item",
    description: "It has been 9 days since payment and the seller has not provided any tracking information or responded to messages.",
    date: "2026-07-02",
    status: "open",
    auditTrail: [{ id: "a1", detail: "Dispute opened by buyer — seller unresponsive, no shipment", admin: "Buyer", date: "2026-07-02" }],
  },
  {
    _id: "d5",
    auctionTitle: "Replica Rolex Submariner",
    coverImage: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=200&q=80",
    buyer: { name: "Aisha Patel", photo: "https://ui-avatars.com/api/?name=Aisha+Patel&background=065f46&color=fff" },
    seller: { name: "Marcus Webb", photo: "https://ui-avatars.com/api/?name=Marcus+Webb&background=1d4ed8&color=fff" },
    amount: 260,
    type: "buyer_complaint",
    reason: "Suspected counterfeit item",
    description: "Buyer received the watch and believes it is a counterfeit branded item, not disclosed as a replica in the listing.",
    date: "2026-07-05",
    status: "open",
    auditTrail: [{ id: "a1", detail: "Dispute opened by buyer — suspected counterfeit", admin: "Buyer", date: "2026-07-05" }],
  },
  {
    _id: "d6",
    auctionTitle: "1965 Fender Stratocaster",
    coverImage: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=200&q=80",
    buyer: { name: "Jordan Lee", photo: "https://ui-avatars.com/api/?name=Jordan+Lee&background=0d9488&color=fff" },
    seller: { name: "Emily Carter", photo: "https://ui-avatars.com/api/?name=Emily+Carter&background=7c3aed&color=fff" },
    amount: 4550,
    type: "seller_complaint",
    reason: "Buyer requesting refund after 30 days",
    description: "Buyer is requesting a return outside the platform's stated return window with no reported defect.",
    date: "2026-06-16",
    status: "resolved",
    resolution: { outcome: "dismissed", note: "Return window had expired and item matched listing; no refund owed. Buyer notified of policy.", date: "2026-06-18", admin: "Admin Sara" },
    auditTrail: [
      { id: "a1", detail: "Dispute opened by seller — late refund request", admin: "Seller", date: "2026-06-16" },
      { id: "a2", detail: "Resolved — dismissed, return window expired", admin: "Admin Sara", date: "2026-06-18" },
    ],
  },
];

const MOCK_TICKETS: Ticket[] = [
  {
    _id: "t1",
    subject: "Unable to withdraw funds from seller wallet",
    user: { name: "Sofia Diaz", photo: "https://ui-avatars.com/api/?name=Sofia+Diaz&background=be185d&color=fff", email: "sofia.diaz@email.com" },
    category: "Payments",
    priority: "high",
    status: "open",
    createdDate: "2026-07-06",
    messages: [
      { id: "m1", from: "user", text: "I've been trying to withdraw $800 from my wallet for two days and it keeps failing at the confirmation step.", date: "2026-07-06 10:12" },
    ],
  },
  {
    _id: "t2",
    subject: "Question about seller verification tiers",
    user: { name: "Jordan Lee", photo: "https://ui-avatars.com/api/?name=Jordan+Lee&background=0d9488&color=fff", email: "jordan.lee@email.com" },
    category: "Account",
    priority: "low",
    status: "pending",
    createdDate: "2026-07-04",
    messages: [
      { id: "m1", from: "user", text: "What's the difference between Basic and Verified seller tiers, and how do I upgrade?", date: "2026-07-04 14:22" },
      { id: "m2", from: "admin", text: "Verified sellers get a lower commission rate and a trust badge — we'll review your account for eligibility after 5 completed sales.", date: "2026-07-04 16:05" },
    ],
  },
  {
    _id: "t3",
    subject: "Auction ended but bid history looks wrong",
    user: { name: "Noah Kim", photo: "https://ui-avatars.com/api/?name=Noah+Kim&background=0369a1&color=fff", email: "noah.kim@email.com" },
    category: "Auctions",
    priority: "medium",
    status: "open",
    createdDate: "2026-07-05",
    messages: [
      { id: "m1", from: "user", text: "My auction for the Fender Stratocaster shows 12 bids but the bid history page only lists 9. Can you check?", date: "2026-07-05 08:47" },
    ],
  },
  {
    _id: "t4",
    subject: "App crashes when uploading KYC documents",
    user: { name: "Priya Sharma", photo: "https://ui-avatars.com/api/?name=Priya+Sharma&background=9333ea&color=fff", email: "priya.sharma@email.com" },
    category: "Technical",
    priority: "urgent",
    status: "open",
    createdDate: "2026-07-07",
    messages: [
      { id: "m1", from: "user", text: "Every time I try to upload my NID photo for seller verification the app crashes. Using Chrome on Android.", date: "2026-07-07 09:03" },
    ],
  },
  {
    _id: "t5",
    subject: "Refund received but wallet balance not updated",
    user: { name: "Aisha Patel", photo: "https://ui-avatars.com/api/?name=Aisha+Patel&background=065f46&color=fff", email: "aisha.patel@email.com" },
    category: "Payments",
    priority: "medium",
    status: "closed",
    createdDate: "2026-06-29",
    messages: [
      { id: "m1", from: "user", text: "I was refunded for the vinyl records but my wallet still shows the old balance.", date: "2026-06-29 11:15" },
      { id: "m2", from: "admin", text: "Thanks for flagging — this was a display caching issue, now fixed. Your balance should reflect correctly.", date: "2026-06-29 15:40" },
      { id: "m3", from: "user", text: "Confirmed, it's showing correctly now. Thank you!", date: "2026-06-29 16:02" },
    ],
  },
  {
    _id: "t6",
    subject: "How do I dispute a delivery I never received?",
    user: { name: "Zara Nguyen", photo: "https://ui-avatars.com/api/?name=Zara+Nguyen&background=be185d&color=fff", email: "zara.nguyen@email.com" },
    category: "Auctions",
    priority: "high",
    status: "pending",
    createdDate: "2026-07-03",
    messages: [
      { id: "m1", from: "user", text: "The chess set I won hasn't arrived and the seller isn't answering my messages. What do I do?", date: "2026-07-03 12:30" },
      { id: "m2", from: "admin", text: "I've opened a formal dispute on your behalf and it's under review by our resolution team.", date: "2026-07-03 13:10" },
    ],
  },
];

const MOCK_FLAGGED_MESSAGES: FlaggedMessage[] = [
  { id: "f1", snippet: "Just pay me directly outside the platform and I'll knock 15% off, avoids the fees...", sender: { name: "Marcus Webb", photo: "https://ui-avatars.com/api/?name=Marcus+Webb&background=1d4ed8&color=fff" }, reportedBy: "Aisha Patel", reason: "Attempting to move transaction off-platform", context: "Replica Rolex Submariner — chat", date: "2026-07-05", status: "pending" },
  { id: "f2", snippet: "You're an idiot if you think that's a fair offer, don't waste my time.", sender: { name: "Ken Watanabe", photo: "https://ui-avatars.com/api/?name=Ken+Watanabe&background=475569&color=fff" }, reportedBy: "Emily Carter", reason: "Abusive language toward buyer", context: "Restored 1978 Vespa Scooter — chat", date: "2026-07-04", status: "pending" },
  { id: "f3", snippet: "Here's my WhatsApp number, message me there instead for a better deal.", sender: { name: "Zara Nguyen", photo: "https://ui-avatars.com/api/?name=Zara+Nguyen&background=be185d&color=fff" }, reportedBy: "System (auto-flag)", reason: "Contact info shared to bypass platform", context: "Hand-carved Rosewood Chess Set — chat", date: "2026-07-06", status: "pending" },
  { id: "f4", snippet: "Stop messaging me or I'll make sure you regret it.", sender: { name: "Marcus Webb", photo: "https://ui-avatars.com/api/?name=Marcus+Webb&background=1d4ed8&color=fff" }, reportedBy: "Aisha Patel", reason: "Threatening language", context: "Replica Rolex Submariner — chat", date: "2026-07-06", status: "pending" },
  { id: "f5", snippet: "Sure, I can ship it faster if you send an extra $50 to my personal account first.", sender: { name: "Noah Kim", photo: "https://ui-avatars.com/api/?name=Noah+Kim&background=0369a1&color=fff" }, reportedBy: "System (auto-flag)", reason: "Solicitation of off-platform payment", context: "Antique Pocket Watch — chat", date: "2026-06-27", status: "dismissed" },
];

const MOCK_REPORTED_USERS: ReportedUser[] = [
  { id: "ru1", name: "Marcus Webb", photo: "https://ui-avatars.com/api/?name=Marcus+Webb&background=1d4ed8&color=fff", reportCount: 4, lastReason: "Threatening language toward buyer", lastDate: "2026-07-06" },
  { id: "ru2", name: "Ken Watanabe", photo: "https://ui-avatars.com/api/?name=Ken+Watanabe&background=475569&color=fff", reportCount: 1, lastReason: "Abusive language toward buyer", lastDate: "2026-07-04" },
  { id: "ru3", name: "Zara Nguyen", photo: "https://ui-avatars.com/api/?name=Zara+Nguyen&background=be185d&color=fff", reportCount: 1, lastReason: "Contact info shared off-platform", lastDate: "2026-07-06" },
  { id: "ru4", name: "Noah Kim", photo: "https://ui-avatars.com/api/?name=Noah+Kim&background=0369a1&color=fff", reportCount: 2, lastReason: "Solicitation of off-platform payment", lastDate: "2026-06-27" },
];

// ─── Config ────────────────────────────────────────────────────────────────

const DISPUTE_TYPE_CFG: Record<DisputeType, { label: string; color: string }> = {
  buyer_complaint: { label: "Buyer Complaint", color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
  seller_complaint: { label: "Seller Complaint", color: "bg-violet-500/15 text-violet-400 border-violet-500/20" },
};

const PRIORITY_CFG: Record<TicketPriority, { label: string; color: string }> = {
  low: { label: "Low", color: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
  medium: { label: "Medium", color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
  high: { label: "High", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  urgent: { label: "Urgent", color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
};

const TICKET_STATUS_CFG: Record<TicketStatus, { label: string; color: string }> = {
  open: { label: "Open", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  pending: { label: "Pending", color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
  closed: { label: "Closed", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
};

const PAGE_SIZE = 5;
const SECTIONS = [
  { key: "disputes", label: "Disputes", icon: <Scale className="w-4 h-4" /> },
  { key: "tickets", label: "Support Tickets", icon: <LifeBuoy className="w-4 h-4" /> },
  { key: "chat", label: "Chat Moderation", icon: <MessageSquareWarning className="w-4 h-4" /> },
] as const;
type SectionKey = (typeof SECTIONS)[number]["key"];

// ─── Component ─────────────────────────────────────────────────────────────

export default function DisputeSupportPage() {
  const { isDarkMode } = useTheme();

  const [section, setSection] = useState<SectionKey>("disputes");

  // disputes state
  const [disputes, setDisputes] = useState<Dispute[]>(MOCK_DISPUTES);
  const [disputeTab, setDisputeTab] = useState<"all" | "open" | "buyer_complaint" | "seller_complaint" | "resolved">("all");
  const [disputeSearch, setDisputeSearch] = useState("");
  const [disputePage, setDisputePage] = useState(1);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [resolveMode, setResolveMode] = useState<ResolutionOutcome | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [penaltyType, setPenaltyType] = useState<"warning" | "fine" | "suspend">("warning");
  const [fineAmount, setFineAmount] = useState(50);

  // tickets state
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [ticketTab, setTicketTab] = useState<"all" | TicketStatus>("all");
  const [ticketSearch, setTicketSearch] = useState("");
  const [ticketPage, setTicketPage] = useState(1);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // chat moderation state
  const [flaggedMessages, setFlaggedMessages] = useState<FlaggedMessage[]>(MOCK_FLAGGED_MESSAGES);
  const [reportedUsers] = useState<ReportedUser[]>(MOCK_REPORTED_USERS);

  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const divider = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const panel = isDarkMode ? "bg-slate-700/40" : "bg-slate-50";
  const inputCls = `w-full px-3 py-2 text-sm rounded-xl border outline-none transition-all ${
    isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
  }`;

  useEffect(() => { setDisputePage(1); }, [disputeTab, disputeSearch]);
  useEffect(() => { setTicketPage(1); }, [ticketTab, ticketSearch]);

  const selectedDispute = useMemo(() => disputes.find(d => d._id === selectedDisputeId) || null, [disputes, selectedDisputeId]);
  const selectedTicket = useMemo(() => tickets.find(t => t._id === selectedTicketId) || null, [tickets, selectedTicketId]);

  const today = () => new Date().toISOString().slice(0, 10);

  // ── top-level stats ─────────────────────────────────────────────────────
  const openDisputeCount = disputes.filter(d => d.status === "open").length;
  const openTicketCount = tickets.filter(t => t.status !== "closed").length;
  const pendingFlagCount = flaggedMessages.filter(f => f.status === "pending").length;

  const stats = [
    { label: "Open Disputes", value: openDisputeCount, icon: <Scale className="w-4 h-4" />, color: "text-rose-400", bg: isDarkMode ? "bg-rose-500/10" : "bg-rose-50", bar: "from-rose-500 to-pink-500" },
    { label: "Open Support Tickets", value: openTicketCount, icon: <LifeBuoy className="w-4 h-4" />, color: "text-amber-400", bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50", bar: "from-amber-500 to-orange-500" },
    { label: "Flagged Messages", value: pendingFlagCount, icon: <MessageSquareWarning className="w-4 h-4" />, color: "text-violet-400", bg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50", bar: "from-violet-500 to-blue-500" },
    { label: "Reported Users", value: reportedUsers.length, icon: <UserX className="w-4 h-4" />, color: "text-sky-400", bg: isDarkMode ? "bg-sky-500/10" : "bg-sky-50", bar: "from-sky-500 to-blue-400" },
  ];

  // ── dispute handlers ─────────────────────────────────────────────────────
  const addDisputeAudit = (id: string, detail: string) => {
    setDisputes(prev => prev.map(d => d._id === id ? { ...d, auditTrail: [{ id: `da-${Date.now()}`, detail, admin: "You", date: today() }, ...d.auditTrail] } : d));
  };

  const openDisputeModal = (d: Dispute) => { setSelectedDisputeId(d._id); setResolveMode(null); setResolutionNote(""); setPenaltyType("warning"); setFineAmount(50); };
  const closeDisputeModal = () => setSelectedDisputeId(null);

  const finalizeResolution = (d: Dispute, outcome: ResolutionOutcome) => {
    if (!resolutionNote.trim()) { toast.error("Please add a resolution note"); return; }
    let detail = "";
    if (outcome === "refund_buyer") detail = `Resolved — refunded buyer $${d.amount} — ${resolutionNote.trim()}`;
    if (outcome === "penalize_seller") detail = `Resolved — seller penalized (${penaltyType}${penaltyType === "fine" ? `, $${fineAmount}` : ""}) — ${resolutionNote.trim()}`;
    if (outcome === "warn_seller") detail = `Resolved — seller warned — ${resolutionNote.trim()}`;
    if (outcome === "dismissed") detail = `Resolved — dismissed, no action taken — ${resolutionNote.trim()}`;

    setDisputes(prev => prev.map(x => x._id === d._id ? { ...x, status: "resolved", resolution: { outcome, note: resolutionNote.trim(), date: today(), admin: "You" } } : x));
    addDisputeAudit(d._id, detail);
    toast.success(`Dispute resolved for "${d.auctionTitle}"`);
    setResolveMode(null); setResolutionNote("");
  };

  const filteredDisputes = useMemo(() => disputes.filter(d => {
    const matchesSearch = d.auctionTitle.toLowerCase().includes(disputeSearch.toLowerCase()) || d.buyer.name.toLowerCase().includes(disputeSearch.toLowerCase()) || d.seller.name.toLowerCase().includes(disputeSearch.toLowerCase());
    const matchesTab =
      disputeTab === "all" ? true :
      disputeTab === "open" ? d.status === "open" :
      disputeTab === "resolved" ? d.status === "resolved" :
      d.type === disputeTab;
    return matchesSearch && matchesTab;
  }), [disputes, disputeSearch, disputeTab]);
  const disputeTotalPages = Math.max(1, Math.ceil(filteredDisputes.length / PAGE_SIZE));
  const disputePageSafe = Math.min(disputePage, disputeTotalPages);
  const paginatedDisputes = filteredDisputes.slice((disputePageSafe - 1) * PAGE_SIZE, disputePageSafe * PAGE_SIZE);
  const disputeCounts = {
    open: disputes.filter(d => d.status === "open").length,
    buyer_complaint: disputes.filter(d => d.type === "buyer_complaint").length,
    seller_complaint: disputes.filter(d => d.type === "seller_complaint").length,
    resolved: disputes.filter(d => d.status === "resolved").length,
  };

  // ── ticket handlers ──────────────────────────────────────────────────────
  const openTicketModal = (t: Ticket) => { setSelectedTicketId(t._id); setReplyText(""); };
  const closeTicketModal = () => setSelectedTicketId(null);

  const sendReply = (t: Ticket) => {
    if (!replyText.trim()) return;
    setTickets(prev => prev.map(x => x._id === t._id ? { ...x, status: x.status === "closed" ? "closed" : "pending", messages: [...x.messages, { id: `m-${Date.now()}`, from: "admin", text: replyText.trim(), date: new Date().toISOString().slice(0, 16).replace("T", " ") }] } : x));
    toast.success("Reply sent");
    setReplyText("");
  };

  const setPriority = (t: Ticket, priority: TicketPriority) => {
    setTickets(prev => prev.map(x => x._id === t._id ? { ...x, priority } : x));
    toast.success(`Priority set to ${PRIORITY_CFG[priority].label}`);
  };

  const closeTicket = (t: Ticket) => {
    setTickets(prev => prev.map(x => x._id === t._id ? { ...x, status: "closed" } : x));
    toast.success(`Ticket "${t.subject}" closed`);
  };

  const reopenTicket = (t: Ticket) => {
    setTickets(prev => prev.map(x => x._id === t._id ? { ...x, status: "open" } : x));
    toast.success(`Ticket "${t.subject}" reopened`);
  };

  const filteredTickets = useMemo(() => tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(ticketSearch.toLowerCase()) || t.user.name.toLowerCase().includes(ticketSearch.toLowerCase());
    const matchesTab = ticketTab === "all" || t.status === ticketTab;
    return matchesSearch && matchesTab;
  }), [tickets, ticketSearch, ticketTab]);
  const ticketTotalPages = Math.max(1, Math.ceil(filteredTickets.length / PAGE_SIZE));
  const ticketPageSafe = Math.min(ticketPage, ticketTotalPages);
  const paginatedTickets = filteredTickets.slice((ticketPageSafe - 1) * PAGE_SIZE, ticketPageSafe * PAGE_SIZE);
  const ticketCounts = tickets.reduce((acc: Record<string, number>, t) => { acc[t.status] = (acc[t.status] || 0) + 1; return acc; }, {});

  // ── chat moderation handlers ────────────────────────────────────────────
  const dismissFlag = (f: FlaggedMessage) => {
    setFlaggedMessages(prev => prev.map(x => x.id === f.id ? { ...x, status: "dismissed" } : x));
    toast.success("Flag dismissed");
  };
  const removeMessage = (f: FlaggedMessage) => {
    setFlaggedMessages(prev => prev.map(x => x.id === f.id ? { ...x, status: "actioned" } : x));
    toast.error(`Message from ${f.sender.name} removed`);
  };
  const warnUser = (name: string) => toast.success(`Warning sent to ${name}`);

  // ── Pagination component ─────────────────────────────────────────────────
  const Pagination = ({ page, totalPages, onPage, count }: { page: number; totalPages: number; onPage: (p: number) => void; count: number }) => (
    <div className={`flex items-center justify-between px-5 py-4 border-t ${divider}`}>
      <p className={`text-xs ${muted}`}>Showing {count === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, count)} of {count}</p>
      <div className="flex items-center gap-1.5">
        <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}><ChevronLeft className="w-4 h-4" /></button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium ${p === page ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"}`}>{p}</button>
        ))}
        <button onClick={() => onPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}><ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px", borderRadius: "10px", background: isDarkMode ? "#1e293b" : "#fff", color: isDarkMode ? "#f1f5f9" : "#0f172a", border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0" } }} />

      {/* Header */}
      <div className={`sticky top-0 z-20 border-b backdrop-blur-xl ${isDarkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-slate-200"}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-xl font-bold tracking-tight">Dispute & Support</h1>
          <p className={`text-xs mt-0.5 ${muted}`}>Resolution center, support inbox and chat moderation</p>
        </div>
        <div className="px-4 sm:px-6 lg:px-8 pb-3 flex gap-1 overflow-x-auto no-scrollbar">
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => setSection(s.key)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${section === s.key ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"}`}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats always visible */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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

        {/* ── Disputes section ─────────────────────────────────────────── */}
        {section === "disputes" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {([
                  { key: "all", label: "All" },
                  { key: "open", label: "Open" },
                  { key: "buyer_complaint", label: "Buyer Complaints" },
                  { key: "seller_complaint", label: "Seller Complaints" },
                  { key: "resolved", label: "Resolved" },
                ] as const).map(t => (
                  <button key={t.key} onClick={() => setDisputeTab(t.key)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${disputeTab === t.key ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}>
                    {t.label}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${disputeTab === t.key ? "bg-white/20" : isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>{t.key === "all" ? disputes.length : (disputeCounts as any)[t.key] || 0}</span>
                  </button>
                ))}
              </div>
              <div className={`relative w-full sm:w-64 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
                <input value={disputeSearch} onChange={e => setDisputeSearch(e.target.value)} placeholder="Search auction, buyer or seller..." className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border outline-none ${isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500" : "bg-slate-50 border-slate-200 placeholder-slate-400"}`} />
              </div>
            </div>

            <div className={`rounded-2xl border ${surface}`}>
              {paginatedDisputes.length > 0 ? (
                <div className="divide-y divide-slate-700/40">
                  {paginatedDisputes.map((d, i) => (
                    <motion.div key={d._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={`flex flex-col md:flex-row md:items-center gap-3 md:gap-4 px-5 py-4 ${isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-slate-50"} transition-colors`}>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img src={d.coverImage} alt={d.auctionTitle} className="w-12 h-12 rounded-2xl object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold truncate ${strong}`}>{d.auctionTitle}</p>
                          <p className={`text-xs truncate ${muted}`}>{d.buyer.name} vs {d.seller.name} · {d.reason}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${DISPUTE_TYPE_CFG[d.type].color}`}>{DISPUTE_TYPE_CFG[d.type].label}</span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${d.status === "open" ? "bg-rose-500/15 text-rose-400 border-rose-500/20" : "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"}`}>
                          {d.status === "open" ? <AlertOctagon className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />} {d.status === "open" ? "Open" : "Resolved"}
                        </span>
                      </div>
                      <div className={`hidden lg:block text-xs ${muted} w-28 shrink-0`}><p>${d.amount}</p><p>{d.date}</p></div>
                      <button onClick={() => openDisputeModal(d)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white shrink-0">
                        <Eye className="w-3.5 h-3.5" /> Review
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-16 text-center"><Scale className={`w-12 h-12 mx-auto mb-4 ${muted}`} /><p className={`text-lg font-medium ${strong}`}>No disputes found</p></div>
              )}
              {filteredDisputes.length > 0 && <Pagination page={disputePageSafe} totalPages={disputeTotalPages} onPage={setDisputePage} count={filteredDisputes.length} />}
            </div>
          </div>
        )}

        {/* ── Tickets section ──────────────────────────────────────────── */}
        {section === "tickets" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {(["all", "open", "pending", "closed"] as const).map(t => (
                  <button key={t} onClick={() => setTicketTab(t)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${ticketTab === t ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}`}>
                    {t === "all" ? "All" : TICKET_STATUS_CFG[t].label}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ticketTab === t ? "bg-white/20" : isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>{t === "all" ? tickets.length : ticketCounts[t] || 0}</span>
                  </button>
                ))}
              </div>
              <div className={`relative w-full sm:w-64 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
                <input value={ticketSearch} onChange={e => setTicketSearch(e.target.value)} placeholder="Search subject or user..." className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border outline-none ${isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500" : "bg-slate-50 border-slate-200 placeholder-slate-400"}`} />
              </div>
            </div>

            <div className={`rounded-2xl border ${surface}`}>
              {paginatedTickets.length > 0 ? (
                <div className="divide-y divide-slate-700/40">
                  {paginatedTickets.map((t, i) => (
                    <motion.div key={t._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={`flex flex-col md:flex-row md:items-center gap-3 md:gap-4 px-5 py-4 ${isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-slate-50"} transition-colors`}>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img src={t.user.photo} alt={t.user.name} className="w-10 h-10 rounded-2xl object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className={`text-sm font-semibold truncate ${strong}`}>{t.subject}</p>
                          <p className={`text-xs truncate ${muted}`}>{t.user.name} · {t.category}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${PRIORITY_CFG[t.priority].color}`}>{PRIORITY_CFG[t.priority].label}</span>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${TICKET_STATUS_CFG[t.status].color}`}>{TICKET_STATUS_CFG[t.status].label}</span>
                      </div>
                      <div className={`hidden lg:block text-xs ${muted} w-28 shrink-0`}>{t.createdDate}</div>
                      <button onClick={() => openTicketModal(t)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white shrink-0">
                        <Eye className="w-3.5 h-3.5" /> Open
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-16 text-center"><LifeBuoy className={`w-12 h-12 mx-auto mb-4 ${muted}`} /><p className={`text-lg font-medium ${strong}`}>No tickets found</p></div>
              )}
              {filteredTickets.length > 0 && <Pagination page={ticketPageSafe} totalPages={ticketTotalPages} onPage={setTicketPage} count={filteredTickets.length} />}
            </div>
          </div>
        )}

        {/* ── Chat moderation section ──────────────────────────────────── */}
        {section === "chat" && (
          <div className="space-y-5">
            <div className={`rounded-2xl border ${surface}`}>
              <div className={`px-5 py-4 border-b ${divider}`}><p className={`text-sm font-semibold flex items-center gap-2 ${strong}`}><Flag className="w-4 h-4" /> Flagged messages</p></div>
              <div className="divide-y divide-slate-700/40">
                {flaggedMessages.map(f => (
                  <div key={f.id} className="flex flex-col md:flex-row md:items-start gap-3 px-5 py-4">
                    <img src={f.sender.photo} alt={f.sender.name} className="w-10 h-10 rounded-2xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className={`text-sm font-semibold ${strong}`}>{f.sender.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{f.context}</span>
                        {f.status !== "pending" && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${f.status === "dismissed" ? "bg-slate-500/15 text-slate-400" : "bg-rose-500/15 text-rose-400"}`}>{f.status === "dismissed" ? "Dismissed" : "Actioned"}</span>
                        )}
                      </div>
                      <p className={`text-sm italic ${muted}`}>"{f.snippet}"</p>
                      <p className={`text-xs mt-1 ${muted}`}>Reported by {f.reportedBy} · {f.reason} · {f.date}</p>
                    </div>
                    {f.status === "pending" && (
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => dismissFlag(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}>Dismiss</button>
                        <button onClick={() => warnUser(f.sender.name)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white">Warn user</button>
                        <button onClick={() => removeMessage(f)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white"><Trash2 className="w-3.5 h-3.5" /> Remove</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={`rounded-2xl border ${surface}`}>
              <div className={`px-5 py-4 border-b ${divider}`}><p className={`text-sm font-semibold flex items-center gap-2 ${strong}`}><UserX className="w-4 h-4" /> Reported users</p></div>
              <div className="divide-y divide-slate-700/40">
                {reportedUsers.map(u => (
                  <div key={u.id} className="flex items-center justify-between px-5 py-3.5">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={u.photo} alt={u.name} className="w-9 h-9 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className={`text-sm font-medium ${strong}`}>{u.name}</p>
                        <p className={`text-xs truncate ${muted}`}>{u.lastReason} · {u.lastDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${isDarkMode ? "bg-rose-500/15 text-rose-400 border-rose-500/20" : "bg-rose-50 text-rose-600 border-rose-200"}`}>{u.reportCount} reports</span>
                      <button onClick={() => warnUser(u.name)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white">Warn</button>
                      <button onClick={() => toast.error(`${u.name} flagged for account review`)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white"><Ban className="w-3.5 h-3.5" /> Suspend</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Dispute detail modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {selectedDispute && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={closeDisputeModal}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} className={`w-full max-w-2xl rounded-2xl ${surface} max-h-[92vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
              <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-10 ${surface} ${divider}`}>
                <div className="flex items-center gap-4 min-w-0">
                  <img src={selectedDispute.coverImage} alt={selectedDispute.auctionTitle} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                  <div className="min-w-0">
                    <h3 className={`text-lg font-semibold truncate ${strong}`}>{selectedDispute.auctionTitle}</h3>
                    <p className={`text-sm ${muted}`}>{selectedDispute.buyer.name} vs {selectedDispute.seller.name}</p>
                  </div>
                </div>
                <button onClick={closeDisputeModal} className={`p-2 rounded-lg ${muted}`}><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${DISPUTE_TYPE_CFG[selectedDispute.type].color}`}>{DISPUTE_TYPE_CFG[selectedDispute.type].label}</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${selectedDispute.status === "open" ? "bg-rose-500/15 text-rose-400 border-rose-500/20" : "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"}`}>
                    {selectedDispute.status === "open" ? <AlertOctagon className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />} {selectedDispute.status === "open" ? "Open" : "Resolved"}
                  </span>
                  <span className={`text-xs ${muted}`}>${selectedDispute.amount} · {selectedDispute.date}</span>
                </div>

                <div>
                  <p className={`text-sm font-medium mb-1 ${strong}`}>{selectedDispute.reason}</p>
                  <p className={`text-sm leading-relaxed p-3 rounded-xl ${panel}`}>{selectedDispute.description}</p>
                </div>

                {selectedDispute.resolution && (
                  <div className={`rounded-xl p-3 text-sm ${isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50"}`}>
                    <p className="font-medium text-emerald-500">Resolved</p>
                    <p className={muted}>{selectedDispute.resolution.note}</p>
                    <p className={`text-xs mt-1 ${muted}`}>{selectedDispute.resolution.admin} · {selectedDispute.resolution.date}</p>
                  </div>
                )}

                {selectedDispute.status === "open" && (
                  <div className={`rounded-2xl p-5 space-y-3 ${panel}`}>
                    <p className={`text-sm font-semibold ${strong}`}>Resolve dispute</p>
                    {!resolveMode ? (
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => setResolveMode("refund_buyer")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white"><RotateCcw className="w-3.5 h-3.5" /> Refund buyer</button>
                        <button onClick={() => setResolveMode("penalize_seller")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white"><ShieldAlert className="w-3.5 h-3.5" /> Penalize seller</button>
                        <button onClick={() => setResolveMode("warn_seller")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-600 text-white">Warn seller only</button>
                        <button onClick={() => setResolveMode("dismissed")} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}>Dismiss</button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {resolveMode === "penalize_seller" && (
                          <div className="flex gap-2">
                            {(["warning", "fine", "suspend"] as const).map(p => (
                              <button key={p} onClick={() => setPenaltyType(p)} className={`flex-1 py-2 rounded-lg text-xs font-medium border capitalize ${penaltyType === p ? "bg-orange-500/15 text-orange-400 border-orange-500/30" : isDarkMode ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"}`}>{p}</button>
                            ))}
                          </div>
                        )}
                        {resolveMode === "penalize_seller" && penaltyType === "fine" && (
                          <div className="flex items-center gap-2">
                            <label className={`text-xs ${muted}`}>Fine amount ($)</label>
                            <input type="number" value={fineAmount} onChange={e => setFineAmount(Number(e.target.value))} className={`${inputCls} w-24`} />
                          </div>
                        )}
                        <textarea value={resolutionNote} onChange={e => setResolutionNote(e.target.value)} rows={2} placeholder="Resolution note (kept in audit trail, may be shared with parties)..." className={inputCls} />
                        <div className="flex gap-2">
                          <button onClick={() => finalizeResolution(selectedDispute, resolveMode)} className="px-4 py-2 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white">Confirm resolution</button>
                          <button onClick={() => setResolveMode(null)} className={`px-4 py-2 rounded-lg text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Back</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  <p className={`text-sm font-semibold flex items-center gap-2 ${strong}`}><History className="w-4 h-4" /> Audit trail</p>
                  <div className="space-y-2">
                    {selectedDispute.auditTrail.map(entry => (
                      <div key={entry.id} className={`flex items-start gap-3 px-3 py-2.5 rounded-xl ${panel}`}>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? "bg-slate-800" : "bg-white"}`}><Clock className="w-3.5 h-3.5" /></div>
                        <div className="min-w-0"><p className={`text-sm ${strong}`}>{entry.detail}</p><p className={`text-xs ${muted}`}>{entry.admin} · {entry.date}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Ticket detail modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={closeTicketModal}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} className={`w-full max-w-xl rounded-2xl ${surface} max-h-[92vh] overflow-y-auto flex flex-col`} onClick={e => e.stopPropagation()}>
              <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-10 ${surface} ${divider}`}>
                <div className="flex items-center gap-4 min-w-0">
                  <img src={selectedTicket.user.photo} alt={selectedTicket.user.name} className="w-12 h-12 rounded-2xl object-cover shrink-0" />
                  <div className="min-w-0">
                    <h3 className={`text-base font-semibold truncate ${strong}`}>{selectedTicket.subject}</h3>
                    <p className={`text-xs ${muted}`}>{selectedTicket.user.name} · {selectedTicket.user.email}</p>
                  </div>
                </div>
                <button onClick={closeTicketModal} className={`p-2 rounded-lg ${muted}`}><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${TICKET_STATUS_CFG[selectedTicket.status].color}`}>{TICKET_STATUS_CFG[selectedTicket.status].label}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{selectedTicket.category}</span>
                  <div className="flex gap-1">
                    {(["low", "medium", "high", "urgent"] as const).map(p => (
                      <button key={p} onClick={() => setPriority(selectedTicket, p)} className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${selectedTicket.priority === p ? PRIORITY_CFG[p].color + " ring-1 ring-current" : isDarkMode ? "border-slate-600 text-slate-500" : "border-slate-200 text-slate-400"}`}>{p}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedTicket.messages.map(m => (
                    <div key={m.id} className={`flex ${m.from === "admin" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.from === "admin" ? "bg-violet-600 text-white" : panel + " " + strong}`}>
                        <p>{m.text}</p>
                        <p className={`text-[10px] mt-1 ${m.from === "admin" ? "text-white/60" : muted}`}>{m.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key === "Enter" && sendReply(selectedTicket)} placeholder="Type a reply..." className={inputCls} />
                  <button onClick={() => sendReply(selectedTicket)} className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white shrink-0"><Send className="w-4 h-4" /></button>
                </div>

                <div className="flex gap-2">
                  {selectedTicket.status !== "closed" ? (
                    <button onClick={() => closeTicket(selectedTicket)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white"><CheckCircle2 className="w-3.5 h-3.5" /> Close ticket</button>
                  ) : (
                    <button onClick={() => reopenTicket(selectedTicket)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}><MessageCircle className="w-3.5 h-3.5" /> Reopen</button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}