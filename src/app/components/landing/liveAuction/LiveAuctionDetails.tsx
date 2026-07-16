import { useEffect, useRef, useState } from "react";
import { GiSelfLove } from "react-icons/gi";
import { FaShare, FaEnvelope, FaFacebook, FaTwitter, FaWhatsapp, FaLink } from "react-icons/fa";
import { FaHeart, FaThumbsUp, FaFaceSmile, FaFaceSurprise } from "react-icons/fa6";
import { IoFlagOutline } from "react-icons/io5";
import { MdVerifiedUser } from "react-icons/md";

import toast, { Toaster } from "react-hot-toast";
import {motion, AnimatePresence } from "framer-motion";


const formatRelativeTime = (iso: string) => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)  return "Just now";
  const m = Math.floor(diff / 60);
  if (m  < 60)   return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h  < 24)   return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

interface RecentActivity {
  name: string;
  photo: string | null;
  amount: number;
  createdAt: string;
  email?: string;
}

interface LiveAuctionDetailsProps {
  auction: any;
  recentActivity: RecentActivity[];
  card: string;
  strong: string;
  muted: string;
  isDarkMode: boolean;
  isEnded: boolean;
}

const LiveAuctionDetails = ({ auction, recentActivity, card, strong, muted, isDarkMode, isEnded }: LiveAuctionDetailsProps) => {
  const [activeImage,      setActiveImage]      = useState(0);
  const [userReaction,     setUserReaction]     = useState<string | null>(null);
  const [reactions,        setReactions]        = useState({ likes:14, loves:8, smiles:5, wows:3 });
  const [showShareMenu,    setShowShareMenu]    = useState(false);
  const [showReactions,    setShowReactions]    = useState(false);

    const handleReaction = (type: string) => {
    if (userReaction === type) {
      setReactions(p => ({ ...p, [type]: Math.max(0, p[type as keyof typeof p] - 1) }));
      setUserReaction(null);
    } else {
      if (userReaction) setReactions(p => ({ ...p, [userReaction]: Math.max(0, p[userReaction as keyof typeof p] - 1) }));
      setReactions(p => ({ ...p, [type]: p[type as keyof typeof p] + 1 }));
      setUserReaction(type);
    }
    setShowReactions(false);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const shareMap: Record<string,string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter:  `https://twitter.com/intent/tweet?text=${encodeURIComponent(auction.name)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(auction.name + " " + url)}`,
    };
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
      setShowShareMenu(false);
      return;
    }
    if (shareMap[platform]) window.open(shareMap[platform], "_blank", "width=600,height=400");
    setShowShareMenu(false);
  };

  const totalReactions = Object.values(reactions).reduce((a,b) => a+b, 0);
  const reactionIcon = (type: string | null) => {
    const map: Record<string, React.ReactNode> = {
      likes:  <FaThumbsUp  className="text-blue-500"   />,
      loves:  <FaHeart     className="text-rose-500"   />,
      smiles: <FaFaceSmile className="text-amber-400"  />,
      wows:   <FaFaceSurprise className="text-amber-400" />,
    };
    return type && map[type] ? map[type] : <GiSelfLove className={muted} />;
  };

  const shareRef    = useRef<HTMLDivElement>(null);
  const reactionRef = useRef<HTMLDivElement>(null);

    // Close popups on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (shareRef.current    && !shareRef.current.contains(e.target as Node))    setShowShareMenu(false);
      if (reactionRef.current && !reactionRef.current.contains(e.target as Node)) setShowReactions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div className="lg:w-[62%] space-y-5">

            {/* Main image */}
            <div className={`rounded-2xl border overflow-hidden ${card}`}>
              <div className="relative h-80 md:h-96 bg-slate-900">
                <img
                  src={auction.images[activeImage]}
                  alt="Auction item"
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                {isEnded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="text-white text-2xl font-bold tracking-wide uppercase opacity-80">Auction Ended</span>
                  </div>
                )}
              </div>
              {/* Thumbnails */}
              <div className={`flex gap-3 p-3 border-t ${isDarkMode?"border-slate-700/60":"border-slate-100"}`}>
                {auction.images.map((src: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative flex-1 h-16 rounded-xl overflow-hidden transition-all ${
                      activeImage === i
                        ? "ring-2 ring-violet-500 ring-offset-2 " + (isDarkMode?"ring-offset-slate-800":"ring-offset-white")
                        : `ring-1 ${isDarkMode?"ring-slate-700":"ring-slate-200"} opacity-60 hover:opacity-100`
                    }`}
                  >
                    <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Title + actions */}
            <div className={`rounded-2xl border p-5 ${card}`}>
              <div className="flex items-start justify-between gap-4">
                <h2 className={`text-xl font-bold leading-snug ${strong}`}>{auction.name}</h2>
                <div className="flex items-center gap-3 shrink-0">

                  {/* Reactions */}
                  <div className="relative" ref={reactionRef}>
                    <button
                      onClick={() => setShowReactions(!showReactions)}
                      className={`flex items-center gap-1.5 text-sm transition ${muted} hover:text-rose-500`}
                    >
                      {reactionIcon(userReaction)}
                      <span className="font-medium">{totalReactions}</span>
                    </button>
                    <AnimatePresence>
                      {showReactions && (
                        <motion.div
                          initial={{ opacity:0, y:6, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:4, scale:0.96 }}
                          transition={{ duration:0.14 }}
                          className={`absolute top-full left-0 mt-2 p-2 rounded-xl shadow-xl z-20 flex gap-1 border ${isDarkMode?"bg-slate-800 border-slate-700":"bg-white border-slate-100"}`}
                        >
                          {[
                            { type:"likes",  icon:<FaThumbsUp  className="text-blue-500"  />, bg:"hover:bg-blue-50"   },
                            { type:"loves",  icon:<FaHeart     className="text-rose-500"  />, bg:"hover:bg-rose-50"   },
                            { type:"smiles", icon:<FaFaceSmile className="text-amber-400" />, bg:"hover:bg-amber-50"  },
                            { type:"wows",   icon:<FaFaceSurprise className="text-amber-400"/>, bg:"hover:bg-amber-50" },
                          ].map(r => (
                            <button key={r.type} onClick={() => handleReaction(r.type)}
                              className={`p-2.5 rounded-xl text-lg transition-all hover:scale-110 ${userReaction===r.type?(isDarkMode?"bg-slate-700":"bg-slate-100"):""} ${isDarkMode?"":r.bg}`}
                              title={r.type}
                            >{r.icon}</button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Share */}
                  <div className="relative" ref={shareRef}>
                    <button onClick={() => setShowShareMenu(!showShareMenu)} className={`text-sm transition ${muted} hover:text-blue-500`}>
                      <FaShare />
                    </button>
                    <AnimatePresence>
                      {showShareMenu && (
                        <motion.div
                          initial={{ opacity:0, y:6, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:4, scale:0.96 }}
                          transition={{ duration:0.14 }}
                          className={`absolute top-full right-0 mt-2 rounded-xl shadow-xl z-20 overflow-hidden border w-44 ${isDarkMode?"bg-slate-800 border-slate-700":"bg-white border-slate-100"}`}
                        >
                          {[
                            { key:"facebook", icon:<FaFacebook className="text-blue-600"/>,  label:"Facebook"  },
                            { key:"twitter",  icon:<FaTwitter  className="text-sky-400"/>,   label:"Twitter"   },
                            { key:"whatsapp", icon:<FaWhatsapp className="text-emerald-500"/>,label:"WhatsApp"  },
                            { key:"copy",     icon:<FaLink     className="text-slate-400"/>,  label:"Copy link" },
                          ].map(s => (
                            <button key={s.key} onClick={() => handleShare(s.key)}
                              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium transition ${isDarkMode?"hover:bg-slate-700 text-slate-300":"hover:bg-slate-50 text-slate-600"}`}
                            >{s.icon}{s.label}</button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button className={`text-sm transition ${muted} hover:text-orange-500`}><IoFlagOutline /></button>
                </div>
              </div>

              <p className={`text-sm leading-relaxed mt-3 ${muted}`}>{auction.description}</p>
            </div>

            {/* Item details */}
            <div className={`rounded-2xl border ${card}`}>
              <div className={`px-5 py-4 border-b ${isDarkMode?"border-slate-700/60":"border-slate-100"}`}>
                <h3 className={`text-sm font-semibold ${strong}`}>Item details</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-0 divide-x divide-y divide-slate-100 dark:divide-slate-700/50">
                {[
                  { label:"Condition",       value: auction.condition    },
                  { label:"Year",            value: auction.itemYear     },
                  { label:"Starting price",  value: `$${auction.startingPrice.toLocaleString()}` },
                  { label:"Reference",       value: `#${auction.reference}` },
                ].map((item,i) => (
                  <div key={i} className={`px-5 py-4 ${isDarkMode?"divide-slate-700/50":""}`}>
                    <p className={`text-xs mb-1 ${muted}`}>{item.label}</p>
                    <p className={`text-sm font-semibold ${strong}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Seller info */}
            <div className={`rounded-2xl border p-5 ${card}`}>
              <h3 className={`text-sm font-semibold mb-4 ${strong}`}>Seller information</h3>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <img src={auction.sellerPhotoUrl} alt="seller" className="w-11 h-11 rounded-2xl object-cover" />
                  <div>
                    <p className={`text-sm font-semibold ${strong}`}>{auction.sellerDisplayName}</p>
                    <p className={`text-xs ${muted}`}>{auction.sellerEmail}</p>
                    <p className="flex items-center gap-1 text-xs text-emerald-500 font-medium mt-0.5">
                      <MdVerifiedUser /> Verified seller
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => toast.success("Redirecting to chat…")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors ${isDarkMode?"bg-slate-700 hover:bg-slate-600 text-slate-200":"bg-violet-50 hover:bg-violet-100 text-violet-700"}`}
                >
                  <FaEnvelope /> Message seller
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`rounded-2xl border ${card}`}>
              <div className={`flex items-center justify-between px-5 py-4 border-b ${isDarkMode?"border-slate-700/60":"border-slate-100"}`}>
                <h3 className={`text-sm font-semibold ${strong}`}>Recent activity</h3>
                <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${isDarkMode?"bg-slate-700 text-slate-300":"bg-slate-100 text-slate-600"}`}>
                  {recentActivity.length} bids
                </span>
              </div>
              <div className="p-4 space-y-2">
                {recentActivity.length === 0 ? (
                  <p className={`text-center py-6 text-sm ${muted}`}>No bids yet. Be the first!</p>
                ) : recentActivity.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay: i*0.04 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      item.email === auction.sellerEmail
                        ? isDarkMode?"bg-violet-500/10 border border-violet-500/30":"bg-violet-50 border border-violet-200"
                        : isDarkMode?"bg-slate-700/30 hover:bg-slate-700/50":"bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <img src={item.photo || ""} alt={item.name} className="w-8 h-8 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${strong}`}>
                        {item.name}
                        {item.email === auction.sellerEmail && <span className="ml-1.5 text-xs text-violet-500">(You)</span>}
                      </p>
                      <p className={`text-xs ${muted}`}>{formatRelativeTime(item.createdAt)}</p>
                    </div>
                    <span className={`text-sm font-semibold shrink-0 ${isDarkMode?"text-violet-400":"text-violet-600"}`}>
                      ${item.amount.toLocaleString()}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
  )
}

export default LiveAuctionDetails;
