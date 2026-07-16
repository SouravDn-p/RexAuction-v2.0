import {
  ArrowLeft,
  Check,
  CheckCheck,
  FileText,
  Gavel,
  Image as ImageIcon,
  Layers,
  Paperclip,
  Search,
  Send,
  ShieldCheck,
  Smile,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../hooks/useTheme";

// ─── Types ─────────────────────────────────────────────────────────────────

type Role = "buyer" | "seller" | "admin";

interface Attachment {
  type: "image" | "file";
  url: string;
  name: string;
  size?: string;
}

interface ChatMessage {
  _id: string;
  sender: Role;
  text?: string;
  attachment?: Attachment;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
}

interface Conversation {
  _id: string;
  auctionId: string;
  auctionTitle: string;
  auctionPhoto: string;
  auctionPrice: number;
  buyerName: string;
  buyerPhoto: string;
  buyerOnline: boolean;
  sellerName: string;
  sellerPhoto: string;
  sellerOnline: boolean;
  unreadCount: number;
  messages: ChatMessage[];
}

// ─── Config ────────────────────────────────────────────────────────────────

// Swap this to preview the page as a buyer, seller, or admin.
const CURRENT_ROLE: Role = "seller";

const ROLE_COPY: Record<Role, { title: string; subtitle: string }> = {
  seller: { title: "Messages", subtitle: "Chat with buyers about your auctions" },
  buyer: { title: "Messages", subtitle: "Chat with sellers about auctions you're bidding on" },
  admin: { title: "Conversation monitor", subtitle: "Review buyer–seller chats and step in when needed" },
};

// ─── Mock data ─────────────────────────────────────────────────────────────

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    _id: "c1", auctionId: "a1", auctionTitle: "Vintage Leica M6 Camera", auctionPhoto: "https://images.unsplash.com/photo-1519183071298-a2962be90b8e?w=200&q=80", auctionPrice: 1120,
    buyerName: "Emily Carter", buyerPhoto: "https://ui-avatars.com/api/?name=Emily+Carter&background=7c3aed&color=fff", buyerOnline: true,
    sellerName: "Noah Kim", sellerPhoto: "https://ui-avatars.com/api/?name=Noah+Kim&background=0369a1&color=fff", sellerOnline: true,
    unreadCount: 2,
    messages: [
      { _id: "m1", sender: "buyer", text: "Hi! Does this come with the original leather case?", timestamp: "10:02 AM", status: "read" },
      { _id: "m2", sender: "seller", text: "Yes, the case and the original box are both included.", timestamp: "10:05 AM", status: "read" },
      { _id: "m3", sender: "buyer", text: "Perfect, here's a photo of a small mark I noticed — is that a scratch or just reflection?", timestamp: "10:07 AM", status: "read" },
      { _id: "m4", sender: "buyer", attachment: { type: "image", url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80", name: "camera-mark.jpg" }, timestamp: "10:07 AM", status: "delivered" },
      { _id: "m5", sender: "buyer", text: "Also — could you ship internationally to Canada?", timestamp: "10:08 AM", status: "delivered" },
    ],
  },
  {
    _id: "c2", auctionId: "a2", auctionTitle: "1965 Fender Stratocaster", auctionPhoto: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=200&q=80", auctionPrice: 4300,
    buyerName: "Marcus Webb", buyerPhoto: "https://ui-avatars.com/api/?name=Marcus+Webb&background=1d4ed8&color=fff", buyerOnline: false,
    sellerName: "Jordan Lee", sellerPhoto: "https://ui-avatars.com/api/?name=Jordan+Lee&background=0d9488&color=fff", sellerOnline: true,
    unreadCount: 0,
    messages: [
      { _id: "m1", sender: "buyer", text: "Congrats on the win, haha — is the neck original or has it been reset?", timestamp: "Yesterday", status: "read" },
      { _id: "m2", sender: "seller", text: "Original neck, never reset. I have the setup receipts from 2019 if that helps.", timestamp: "Yesterday", status: "read" },
      { _id: "m3", sender: "buyer", text: "That would be great, thank you!", timestamp: "Yesterday", status: "read" },
      { _id: "m4", sender: "seller", attachment: { type: "file", url: "#", name: "setup-receipt-2019.pdf", size: "212 KB" }, timestamp: "Yesterday", status: "read" },
    ],
  },
  {
    _id: "c3", auctionId: "a3", auctionTitle: "Hand-carved Chess Set", auctionPhoto: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=200&q=80", auctionPrice: 210,
    buyerName: "Zara Nguyen", buyerPhoto: "https://ui-avatars.com/api/?name=Zara+Nguyen&background=be185d&color=fff", buyerOnline: true,
    sellerName: "Sofia Diaz", sellerPhoto: "https://ui-avatars.com/api/?name=Sofia+Diaz&background=be185d&color=fff", sellerOnline: false,
    unreadCount: 1,
    messages: [
      { _id: "m1", sender: "buyer", text: "What wood is this carved from?", timestamp: "9:14 AM", status: "delivered" },
    ],
  },
  {
    _id: "c4", auctionId: "a4", auctionTitle: "Antique Pocket Watch", auctionPhoto: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=200&q=80", auctionPrice: 410,
    buyerName: "Ken Watanabe", buyerPhoto: "https://ui-avatars.com/api/?name=Ken+Watanabe&background=475569&color=fff", buyerOnline: false,
    sellerName: "Noah Kim", sellerPhoto: "https://ui-avatars.com/api/?name=Noah+Kim&background=0369a1&color=fff", sellerOnline: true,
    unreadCount: 0,
    messages: [
      { _id: "m1", sender: "seller", text: "Thanks for the win! I'll ship this out tomorrow morning.", timestamp: "Mon", status: "read" },
      { _id: "m2", sender: "buyer", text: "Awesome, appreciate the quick turnaround 🙏", timestamp: "Mon", status: "read" },
    ],
  },
  {
    _id: "c5", auctionId: "a5", auctionTitle: "Original Oil Landscape Painting", auctionPhoto: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200&q=80", auctionPrice: 890,
    buyerName: "Priya Sharma", buyerPhoto: "https://ui-avatars.com/api/?name=Priya+Sharma&background=9333ea&color=fff", buyerOnline: true,
    sellerName: "Jordan Lee", sellerPhoto: "https://ui-avatars.com/api/?name=Jordan+Lee&background=0d9488&color=fff", sellerOnline: true,
    unreadCount: 0,
    messages: [
      { _id: "m1", sender: "buyer", text: "Is the frame included in the auction or sold separately?", timestamp: "Last week", status: "read" },
      { _id: "m2", sender: "seller", text: "Included — it's the original frame from the artist's studio.", timestamp: "Last week", status: "read" },
    ],
  },
  {
    // Same buyer as c1, different auction — demonstrates why an "all auctions" view matters.
    _id: "c6", auctionId: "a3", auctionTitle: "Hand-carved Chess Set", auctionPhoto: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=200&q=80", auctionPrice: 210,
    buyerName: "Emily Carter", buyerPhoto: "https://ui-avatars.com/api/?name=Emily+Carter&background=7c3aed&color=fff", buyerOnline: true,
    sellerName: "Sofia Diaz", sellerPhoto: "https://ui-avatars.com/api/?name=Sofia+Diaz&background=be185d&color=fff", sellerOnline: false,
    unreadCount: 0,
    messages: [
      { _id: "m1", sender: "buyer", text: "Would you take $190 if I also buy the pocket watch?", timestamp: "2 days ago", status: "read" },
      { _id: "m2", sender: "admin", text: "Reminder: price negotiation outside the bidding system isn't permitted — please keep offers within the auction flow.", timestamp: "2 days ago" },
    ],
  },
];

const MOCK_IMAGE_ATTACHMENT = "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=500&q=80";

// ─── Component ─────────────────────────────────────────────────────────────

export default function MessagesPage() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState<"all" | "unread">("all");
  const [auctionFilter, setAuctionFilter] = useState<"all" | string>("all");
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const divider = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const hover = isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-slate-50";
  const pageBg = isDarkMode ? "bg-slate-900" : "bg-slate-50";

  const active = useMemo(() => conversations.find(c => c._id === activeId) || null, [conversations, activeId]);

  // Distinct auctions across all threads — powers the "all vs. one auction" filter.
  const auctions = useMemo(() => {
    const seen = new Map<string, { id: string; title: string; photo: string }>();
    conversations.forEach(c => { if (!seen.has(c.auctionId)) seen.set(c.auctionId, { id: c.auctionId, title: c.auctionTitle, photo: c.auctionPhoto }); });
    return Array.from(seen.values());
  }, [conversations]);

  const counterpartOf = (c: Conversation) =>
    CURRENT_ROLE === "seller"
      ? { name: c.buyerName, photo: c.buyerPhoto, online: c.buyerOnline, tag: "Buyer" }
      : CURRENT_ROLE === "buyer"
      ? { name: c.sellerName, photo: c.sellerPhoto, online: c.sellerOnline, tag: "Seller" }
      : { name: `${c.buyerName} ↔ ${c.sellerName}`, photo: c.buyerPhoto, online: c.buyerOnline || c.sellerOnline, tag: "Buyer ↔ Seller" };

  const filteredConversations = useMemo(() => {
    return conversations
      .filter(c => (tab === "unread" ? c.unreadCount > 0 : true))
      .filter(c => (auctionFilter === "all" ? true : c.auctionId === auctionFilter))
      .filter(c => {
        const cp = counterpartOf(c);
        return cp.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.auctionTitle.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => (b.unreadCount > 0 ? 1 : 0) - (a.unreadCount > 0 ? 1 : 0));
  }, [conversations, searchQuery, tab, auctionFilter]);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages.length, activeId]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const openConversation = (id: string) => {
    setActiveId(id);
    setConversations(prev => prev.map(c => c._id === id ? { ...c, unreadCount: 0 } : c));
  };

  const backToList = () => setActiveId(null);
  const exitMessages = () => navigate(-1);

  const sendMessage = () => {
    if (!draft.trim() || !active) return;
    const msg: ChatMessage = { _id: `m-${Date.now()}`, sender: CURRENT_ROLE, text: draft.trim(), timestamp: "Just now", status: "sent" };
    setConversations(prev => prev.map(c => c._id === active._id ? { ...c, messages: [...c.messages, msg] } : c));
    setDraft("");
    if (CURRENT_ROLE === "admin") toast.success("Sent as admin — visible to both buyer and seller");
  };

  const sendAttachment = (type: "image" | "file") => {
    if (!active) return;
    const attachment: Attachment = type === "image"
      ? { type: "image", url: MOCK_IMAGE_ATTACHMENT, name: "photo.jpg" }
      : { type: "file", url: "#", name: "shipping-label.pdf", size: "184 KB" };
    const msg: ChatMessage = { _id: `m-${Date.now()}`, sender: CURRENT_ROLE, attachment, timestamp: "Just now", status: "sent" };
    setConversations(prev => prev.map(c => c._id === active._id ? { ...c, messages: [...c.messages, msg] } : c));
    toast.success(`${type === "image" ? "Photo" : "File"} sent`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className={`h-screen flex flex-col transition-colors ${pageBg} text-slate-100`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px", borderRadius: "10px", background: isDarkMode ? "#1e293b" : "#fff", color: isDarkMode ? "#f1f5f9" : "#0f172a", border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0" },
        }}
      />

      <div className={`flex-1 min-h-0 flex ${isDarkMode ? "bg-slate-900" : "bg-slate-50"}`}>

        {/* ── Conversation list ──────────────────────────────────── */}
        <div className={`${activeId ? "hidden md:flex" : "flex"} w-full md:w-80 lg:w-96 shrink-0 flex-col border-r ${divider} ${surface}`}>
          <div className={`px-3 py-4 border-b ${divider}`}>
            <div className="flex items-center gap-2 mb-3">
              <button onClick={exitMessages} className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${hover}`} aria-label="Back">
                <ArrowLeft className={`w-4.5 h-4.5 ${strong}`} />
              </button>
              <div className="flex-1 min-w-0">
                <h1 className={`text-lg font-bold truncate ${strong}`}>{ROLE_COPY[CURRENT_ROLE].title}</h1>
                <p className={`text-[11px] truncate ${muted}`}>{ROLE_COPY[CURRENT_ROLE].subtitle}</p>
              </div>
              {totalUnread > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-600 text-white shrink-0">{totalUnread}</span>
              )}
            </div>

            <div className="relative mb-3 px-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
              <input
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search people or auctions..."
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border outline-none transition-all ${isDarkMode ? "bg-slate-900 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"}`}
              />
            </div>

            <div className="flex gap-1.5 mb-3 px-1">
              {(["all", "unread"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === t ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"}`}>
                  {t === "all" ? "All" : "Unread"}
                </button>
              ))}
            </div>

            {/* Auction filter — a buyer/seller can have threads across several auctions */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-1 pb-0.5">
              <button
                onClick={() => setAuctionFilter("all")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
                  auctionFilter === "all" ? "bg-violet-600 text-white border-violet-600" : isDarkMode ? "border-slate-700 text-slate-400 hover:bg-slate-700" : "border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Layers className="w-3 h-3" /> All auctions
              </button>
              {auctions.map(a => (
                <button
                  key={a.id}
                  onClick={() => setAuctionFilter(a.id)}
                  className={`flex items-center gap-1.5 pl-1 pr-3 py-1 rounded-full text-xs font-medium whitespace-nowrap border transition-colors ${
                    auctionFilter === a.id ? "bg-violet-600 text-white border-violet-600" : isDarkMode ? "border-slate-700 text-slate-400 hover:bg-slate-700" : "border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <img src={a.photo} className="w-5 h-5 rounded-full object-cover" alt="" /> {a.title}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-10 text-center"><p className={`text-sm ${muted}`}>No conversations found</p></div>
            ) : (
              filteredConversations.map(c => {
                const cp = counterpartOf(c);
                return (
                  <button
                    key={c._id}
                    onClick={() => openConversation(c._id)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3.5 border-b transition-colors ${divider} ${hover} ${activeId === c._id ? (isDarkMode ? "bg-slate-700/40" : "bg-violet-50/60") : ""}`}
                  >
                    <div className="relative shrink-0">
                      <img src={cp.photo} alt={cp.name} className="w-11 h-11 rounded-2xl object-cover" />
                      {cp.online && <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 ${isDarkMode ? "border-slate-800" : "border-white"}`} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-semibold truncate ${strong}`}>{cp.name}</p>
                        <span className={`text-[11px] shrink-0 ${muted}`}>{c.messages[c.messages.length - 1]?.timestamp}</span>
                      </div>
                      <p className={`text-xs truncate mt-0.5 ${c.unreadCount > 0 ? strong + " font-medium" : muted}`}>
                        {c.messages[c.messages.length - 1]?.attachment ? "📎 Attachment" : c.messages[c.messages.length - 1]?.text}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className={`text-[11px] truncate flex items-center gap-1 ${muted}`}><Gavel className="w-3 h-3 shrink-0" /> {c.auctionTitle}</span>
                        {c.unreadCount > 0 && <span className="text-[11px] font-semibold w-5 h-5 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0">{c.unreadCount}</span>}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── Chat window ─────────────────────────────────────────── */}
        <div className={`${activeId ? "flex" : "hidden md:flex"} flex-1 min-w-0 flex-col`}>
          {!active ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
                <Send className={`w-6 h-6 ${muted}`} />
              </div>
              <p className={`text-sm font-medium ${strong}`}>Select a conversation</p>
              <p className={`text-xs ${muted}`}>{ROLE_COPY[CURRENT_ROLE].subtitle}</p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className={`flex items-center gap-3 px-4 py-3 border-b shrink-0 ${divider} ${surface}`}>
                <button onClick={backToList} className={`md:hidden p-1.5 -ml-1 rounded-lg ${hover}`} aria-label="Back to conversations">
                  <ArrowLeft className={`w-5 h-5 ${strong}`} />
                </button>
                {(() => {
                  const cp = counterpartOf(active);
                  return (
                    <>
                      <div className="relative shrink-0">
                        <img src={cp.photo} alt={cp.name} className="w-9 h-9 rounded-xl object-cover" />
                        {cp.online && <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 ${isDarkMode ? "border-slate-800" : "border-white"}`} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${strong}`}>{cp.name}</p>
                        <p className={`text-[11px] ${muted}`}>{cp.tag}{CURRENT_ROLE !== "admin" && ` · ${cp.online ? "Online" : "Offline"}`}</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* Auction discussion context bar */}
              <div className={`flex items-center gap-3 px-4 py-2.5 border-b shrink-0 ${divider} ${isDarkMode ? "bg-slate-800/60" : "bg-violet-50/60"}`}>
                <img src={active.auctionPhoto} alt={active.auctionTitle} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-medium truncate ${strong}`}>{active.auctionTitle}</p>
                  <p className={`text-[11px] ${muted}`}>Current bid ${active.auctionPrice.toLocaleString()}</p>
                </div>
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full shrink-0 ${isDarkMode ? "bg-violet-500/15 text-violet-400" : "bg-violet-100 text-violet-700"}`}>View auction</span>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3">
                {active.messages.map(m => {
                  const isMine = m.sender === CURRENT_ROLE;
                  const isAdminNote = m.sender === "admin" && CURRENT_ROLE !== "admin";

                  if (isAdminNote) {
                    return (
                      <div key={m._id} className="flex justify-center">
                        <div className={`flex items-start gap-2 max-w-[85%] px-3.5 py-2.5 rounded-xl text-xs ${isDarkMode ? "bg-amber-500/10 text-amber-300" : "bg-amber-50 text-amber-700"}`}>
                          <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{m.text}</span>
                        </div>
                      </div>
                    );
                  }

                  const speakerLabel = CURRENT_ROLE === "admin" && !isMine ? (m.sender === "buyer" ? active.buyerName : active.sellerName) : null;
                  const bubbleColor = isMine
                    ? "bg-violet-600 text-white rounded-br-md"
                    : CURRENT_ROLE === "admin"
                    ? m.sender === "buyer"
                      ? isDarkMode ? "bg-sky-500/15 text-slate-100 rounded-bl-md" : "bg-sky-50 text-slate-800 rounded-bl-md"
                      : isDarkMode ? "bg-emerald-500/15 text-slate-100 rounded-bl-md" : "bg-emerald-50 text-slate-800 rounded-bl-md"
                    : isDarkMode ? "bg-slate-800 text-slate-100 rounded-bl-md" : "bg-white text-slate-800 border border-slate-100 rounded-bl-md";

                  return (
                    <div key={m._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[78%] sm:max-w-[65%] flex flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}>
                        {speakerLabel && <span className={`text-[10px] font-medium px-1 ${muted}`}>{speakerLabel}</span>}
                        {m.text && <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${bubbleColor}`}>{m.text}</div>}
                        {m.attachment?.type === "image" && <img src={m.attachment.url} alt={m.attachment.name} className="w-48 rounded-2xl object-cover" />}
                        {m.attachment?.type === "file" && (
                          <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl ${isMine ? "bg-violet-600 text-white" : isDarkMode ? "bg-slate-800 text-slate-100" : "bg-white text-slate-800 border border-slate-100"}`}>
                            <FileText className="w-4 h-4 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-medium truncate">{m.attachment.name}</p>
                              {m.attachment.size && <p className="text-[10px] opacity-70">{m.attachment.size}</p>}
                            </div>
                          </div>
                        )}
                        <div className={`flex items-center gap-1 px-1 ${isMine ? "flex-row-reverse" : ""}`}>
                          <span className={`text-[10px] ${muted}`}>{m.timestamp}</span>
                          {isMine && m.status && (
                            m.status === "read" ? <CheckCheck className="w-3 h-3 text-sky-400" /> : m.status === "delivered" ? <CheckCheck className="w-3 h-3 text-slate-400" /> : <Check className="w-3 h-3 text-slate-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Composer */}
              <div className={`shrink-0 border-t px-3 py-3 ${divider} ${surface}`}>
                {CURRENT_ROLE === "admin" && (
                  <p className={`text-[11px] mb-2 flex items-center gap-1.5 ${muted}`}><ShieldCheck className="w-3 h-3" /> Messages you send here are visible to both the buyer and seller as admin notes.</p>
                )}
                <div className="flex items-end gap-2">
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => sendAttachment("image")} className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDarkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-500 hover:bg-slate-100"}`}>
                      <ImageIcon className="w-4.5 h-4.5" />
                    </button>
                    <button onClick={() => sendAttachment("file")} className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDarkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-500 hover:bg-slate-100"}`}>
                      <Paperclip className="w-4.5 h-4.5" />
                    </button>
                  </div>
                  <div className={`flex-1 flex items-end gap-2 rounded-2xl border px-3 py-2 ${isDarkMode ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"}`}>
                    <textarea
                      value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={handleKeyDown}
                      placeholder={CURRENT_ROLE === "admin" ? "Write an admin note..." : "Write a message..."}
                      rows={1} className={`flex-1 bg-transparent text-sm outline-none resize-none max-h-24 ${strong} placeholder-slate-500`}
                    />
                    <Smile className={`w-4.5 h-4.5 shrink-0 mb-0.5 ${muted}`} />
                  </div>
                  <button
                    onClick={sendMessage} disabled={!draft.trim()}
                    className="w-9 h-9 rounded-xl flex items-center justify-center bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white shrink-0 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}