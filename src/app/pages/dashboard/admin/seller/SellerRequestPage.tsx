import { useMemo, useState, type ReactElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  UserCheck,
  Clock,
  XCircle,
  Search,
  X,
  Eye,
  CheckCircle,
  ShieldAlert,
  BadgeCheck,
  TrendingUp,
  Phone,
  Mail,
  FileText,
  Shield,
  RefreshCw,
  Users,
  Store,
  AlertTriangle,
} from "lucide-react";
import { useTheme } from "../../../../../hooks/useTheme";

type SellerStatus = "pending" | "active" | "suspended" | "rejected";
type VerificationTier = "basic" | "verified";

interface SellerApplication {
  phoneVerified: boolean;
  emailVerified: boolean;
  nidVerified: boolean;
  businessLicenseVerified: boolean;
  documentsUploaded: number;
}

interface SellerRequest {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  businessName: string;
  requestDate: string;
  status: SellerStatus;
  verificationTier: VerificationTier;
  earnings: number;
  listedProducts: number;
  disputes: number;
  application: SellerApplication;
  sellerRequestMessage: string;
  reviewFeedback?: string;
  needsReverification?: boolean;
  stats: {
    rating: string;
    responseTime: string;
    completionRate: string;
  };
}

const MOCK_SELLER_REQUESTS: SellerRequest[] = [
  {
    _id: "sr1",
    name: "Jordan Lee",
    email: "jordan.lee@email.com",
    phoneNumber: "+8801712345678",
    address: "Dhaka, Bangladesh",
    businessName: "Nova Watch Co.",
    requestDate: "2026-07-05",
    status: "pending",
    verificationTier: "basic",
    earnings: 1240,
    listedProducts: 7,
    disputes: 1,
    application: {
      phoneVerified: true,
      emailVerified: false,
      nidVerified: true,
      businessLicenseVerified: false,
      documentsUploaded: 2,
    },
    sellerRequestMessage: "I have been selling vintage watches for 5 years and want to expand my business.",
    stats: {
      rating: "4.8/5",
      responseTime: "2h",
      completionRate: "94%",
    },
  },
  {
    _id: "sr2",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phoneNumber: "+8801812345678",
    address: "Chittagong, Bangladesh",
    businessName: "Luxe Fashion Hub",
    requestDate: "2026-07-04",
    status: "active",
    verificationTier: "verified",
    earnings: 3860,
    listedProducts: 24,
    disputes: 0,
    application: {
      phoneVerified: true,
      emailVerified: true,
      nidVerified: true,
      businessLicenseVerified: true,
      documentsUploaded: 3,
    },
    sellerRequestMessage: "Experienced fashion seller looking to list premium clothing.",
    stats: {
      rating: "4.9/5",
      responseTime: "35m",
      completionRate: "97%",
    },
  },
  {
    _id: "sr3",
    name: "Marcus Webb",
    email: "marcus.webb@email.com",
    phoneNumber: "+8801912345678",
    address: "Sylhet, Bangladesh",
    businessName: "Craft & Co.",
    requestDate: "2026-07-02",
    status: "suspended",
    verificationTier: "basic",
    earnings: 650,
    listedProducts: 4,
    disputes: 3,
    application: {
      phoneVerified: true,
      emailVerified: true,
      nidVerified: true,
      businessLicenseVerified: false,
      documentsUploaded: 2,
    },
    sellerRequestMessage: "I am a local artisan seller focusing on handmade products and gift collections.",
    reviewFeedback: "Suspended after repeated buyer complaints and a pending dispute review.",
    needsReverification: true,
    stats: {
      rating: "3.7/5",
      responseTime: "4h",
      completionRate: "82%",
    },
  },
  {
    _id: "sr4",
    name: "Sofia Diaz",
    email: "sofia.diaz@email.com",
    phoneNumber: "+8801612345678",
    address: "Khulna, Bangladesh",
    businessName: "Sofia Originals",
    requestDate: "2026-06-29",
    status: "rejected",
    verificationTier: "basic",
    earnings: 0,
    listedProducts: 0,
    disputes: 0,
    application: {
      phoneVerified: true,
      emailVerified: true,
      nidVerified: false,
      businessLicenseVerified: false,
      documentsUploaded: 1,
    },
    sellerRequestMessage: "Looking to operate a curated art-and-design boutique.",
    reviewFeedback: "Rejected due to incomplete business documentation and missing NID validation.",
    stats: {
      rating: "0/5",
      responseTime: "N/A",
      completionRate: "0%",
    },
  },
];

const STATUS_CONFIG: Record<SellerStatus, { label: string; icon: ReactElement; color: string }> = {
  pending: { label: "Pending", icon: <Clock className="w-3.5 h-3.5" />, color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  active: { label: "Active", icon: <CheckCircle className="w-3.5 h-3.5" />, color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  suspended: { label: "Suspended", icon: <ShieldAlert className="w-3.5 h-3.5" />, color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
  rejected: { label: "Rejected", icon: <XCircle className="w-3.5 h-3.5" />, color: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
};

const TIER_CONFIG: Record<VerificationTier, { label: string; icon: ReactElement; color: string }> = {
  basic: { label: "Basic Seller", icon: <Shield className="w-3.5 h-3.5" />, color: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
  verified: { label: "Verified Seller", icon: <BadgeCheck className="w-3.5 h-3.5" />, color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
};

const TAB_OPTIONS = [
  { key: "all", label: "All Sellers" },
  { key: "pending", label: "Pending" },
  { key: "active", label: "Active" },
  { key: "suspended", label: "Suspended" },
  { key: "rejected", label: "Rejected" },
] as const;

type SellerTabKey = (typeof TAB_OPTIONS)[number]["key"];

export default function SellerRequestPage() {
  const { isDarkMode } = useTheme();
  const [requests, setRequests] = useState<SellerRequest[]>(MOCK_SELLER_REQUESTS);
  const [activeTab, setActiveTab] = useState<SellerTabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeller, setSelectedSeller] = useState<SellerRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [tier, setTier] = useState<VerificationTier>("basic");

  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const panel = isDarkMode ? "bg-slate-700/40" : "bg-slate-50";
  const inputCls = `w-full px-3 py-2 text-sm rounded-xl border outline-none transition-all ${
    isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
  }`;

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesTab = activeTab === "all" ? true : req.status === activeTab;
      const matchesSearch =
        !searchQuery ||
        req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.businessName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [requests, activeTab, searchQuery]);

  const stats = useMemo(() => ({
    pending: requests.filter((req) => req.status === "pending").length,
    active: requests.filter((req) => req.status === "active").length,
    suspended: requests.filter((req) => req.status === "suspended").length,
    verified: requests.filter((req) => req.verificationTier === "verified").length,
    earnings: requests.reduce((sum, req) => sum + req.earnings, 0),
    products: requests.reduce((sum, req) => sum + req.listedProducts, 0),
  }), [requests]);

  const openDetailsModal = (seller: SellerRequest) => {
    setSelectedSeller(seller);
    setFeedback(seller.reviewFeedback ?? "");
    setTier(seller.verificationTier);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSeller(null);
    setFeedback("");
    setTier("basic");
  };

  const updateSeller = (sellerId: string, updates: Partial<SellerRequest>) => {
    setRequests((prev) => prev.map((req) => (req._id === sellerId ? { ...req, ...updates } : req)));
  };

  const handleApprove = () => {
    if (!selectedSeller) return;
    updateSeller(selectedSeller._id, {
      status: "active",
      verificationTier: tier,
      reviewFeedback: feedback || "Approved and moved to active seller status.",
      needsReverification: false,
    });
    toast.success(`${selectedSeller.name} approved successfully.`);
    closeModal();
  };

  const handleReject = () => {
    if (!selectedSeller) return;
    updateSeller(selectedSeller._id, {
      status: "rejected",
      reviewFeedback: feedback || "Rejected due to incomplete or non-compliant seller information.",
      needsReverification: false,
    });
    toast.error(`${selectedSeller.name}'s request was rejected.`);
    closeModal();
  };

  const handleSuspend = () => {
    if (!selectedSeller) return;
    updateSeller(selectedSeller._id, {
      status: "suspended",
      reviewFeedback: feedback || "Seller suspended pending review.",
      needsReverification: true,
    });
    toast.error(`${selectedSeller.name} has been suspended.`);
    closeModal();
  };

  const handleActivate = () => {
    if (!selectedSeller) return;
    updateSeller(selectedSeller._id, {
      status: "active",
      reviewFeedback: feedback || "Seller reactivated and restored to active status.",
      needsReverification: false,
    });
    toast.success(`${selectedSeller.name} is active again.`);
    closeModal();
  };

  const handleVerifyBusiness = () => {
    if (!selectedSeller) return;
    updateSeller(selectedSeller._id, {
      verificationTier: tier,
      reviewFeedback: feedback || "Business verification completed.",
      needsReverification: false,
    });
    toast.success(`${selectedSeller.name} verified as ${tier === "verified" ? "Verified Seller" : "Basic Seller"}.`);
    closeModal();
  };

  const handleReverify = () => {
    if (!selectedSeller) return;
    updateSeller(selectedSeller._id, {
      needsReverification: true,
      reviewFeedback: feedback || "Flagged for re-verification after complaints or fraud indicators.",
    });
    toast(`Re-verification requested for ${selectedSeller.name}.`, { icon: <RefreshCw className="w-4 h-4" /> });
    closeModal();
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <Toaster position="top-right" />

      <div className={`sticky top-0 z-20 border-b backdrop-blur-xl ${isDarkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-slate-200"}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight">Seller Management</h1>
              <p className={`text-sm mt-1 ${muted}`}>Review applications, manage seller status, and monitor verification compliance.</p>
            </div>
            <div className={`relative w-full lg:w-80 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input
                type="text"
                placeholder="Search sellers or businesses"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border outline-none transition-all ${
                  isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
                }`}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Pending Review", value: stats.pending, icon: <Clock className="w-4 h-4" />, color: "text-amber-400", bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50" },
            { label: "Active Sellers", value: stats.active, icon: <Users className="w-4 h-4" />, color: "text-emerald-400", bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50" },
            { label: "Suspended", value: stats.suspended, icon: <ShieldAlert className="w-4 h-4" />, color: "text-rose-400", bg: isDarkMode ? "bg-rose-500/10" : "bg-rose-50" },
            { label: "Verified Sellers", value: stats.verified, icon: <BadgeCheck className="w-4 h-4" />, color: "text-sky-400", bg: isDarkMode ? "bg-sky-500/10" : "bg-sky-50" },
          ].map((card) => (
            <div key={card.label} className={`rounded-2xl border p-4 ${surface}`}>
              <div className={`inline-flex rounded-xl p-2 ${card.bg} ${card.color}`}>{card.icon}</div>
              <div className="mt-4">
                <p className={`text-2xl font-semibold ${strong}`}>{card.value}</p>
                <p className={`text-sm mt-1 ${muted}`}>{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={`rounded-2xl border p-4 ${surface}`}>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {TAB_OPTIONS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.key ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-700/60" : "text-slate-600 hover:bg-slate-100"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredRequests.map((seller) => (
              <motion.div
                key={seller._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border p-5 ${surface}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white font-semibold flex items-center justify-center">
                      {seller.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${strong}`}>{seller.name}</h3>
                      <p className={`text-sm ${muted}`}>{seller.businessName}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_CONFIG[seller.status].color}`}>
                    {STATUS_CONFIG[seller.status].icon}
                    {STATUS_CONFIG[seller.status].label}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${TIER_CONFIG[seller.verificationTier].color}`}>
                    {TIER_CONFIG[seller.verificationTier].icon}
                    {TIER_CONFIG[seller.verificationTier].label}
                  </span>
                  {seller.needsReverification && (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-amber-500/10 text-amber-400 border-amber-500/20`}>
                      <RefreshCw className="w-3.5 h-3.5" /> Re-verification due
                    </span>
                  )}
                </div>

                <div className={`mt-4 grid grid-cols-3 gap-3 text-sm ${panel} rounded-2xl p-3`}>
                  <div>
                    <p className={`text-xs ${muted}`}>Earnings</p>
                    <p className={`font-semibold ${strong}`}>${seller.earnings}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${muted}`}>Products</p>
                    <p className={`font-semibold ${strong}`}>{seller.listedProducts}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${muted}`}>Disputes</p>
                    <p className={`font-semibold ${strong}`}>{seller.disputes}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-violet-500">
                  <Store className="w-4 h-4" />
                  <span>{seller.email}</span>
                </div>

                <div className="mt-5 flex gap-2">
                  <button onClick={() => openDetailsModal(seller)} className={`flex-1 py-2.5 text-sm font-medium rounded-xl border transition-all ${isDarkMode ? "border-slate-600 hover:bg-slate-700" : "border-slate-200 hover:bg-slate-100"}`}>
                    <Eye className="inline w-4 h-4 mr-1.5" /> Review
                  </button>
                  {seller.status === "pending" && (
                    <button onClick={() => openDetailsModal(seller)} className="flex-1 py-2.5 text-sm font-medium rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all">
                      <CheckCircle className="inline w-4 h-4 mr-1.5" /> Approve
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <div className={`rounded-2xl border p-10 text-center mt-4 ${surface}`}>
              <AlertTriangle className={`w-10 h-10 mx-auto mb-3 ${muted}`} />
              <p className={`text-lg font-medium ${strong}`}>No sellers match your current filters.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedSeller && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={closeModal}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} className={`w-full max-w-3xl rounded-2xl ${surface} max-h-[92vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-inherit z-10">
                <div>
                  <h3 className={`text-xl font-semibold ${strong}`}>Seller Verification & Management</h3>
                  <p className={`text-sm ${muted}`}>Review KYC, business documents, and admin actions.</p>
                </div>
                <button onClick={closeModal} className={`p-2 rounded-lg ${muted}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-3xl font-semibold flex items-center justify-center">
                        {selectedSeller.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className={`text-2xl font-semibold ${strong}`}>{selectedSeller.name}</h4>
                        <p className={muted}>{selectedSeller.businessName}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className={muted}>Phone</p>
                        <p className={strong}>{selectedSeller.phoneNumber}</p>
                      </div>
                      <div>
                        <p className={muted}>Request Date</p>
                        <p className={strong}>{selectedSeller.requestDate}</p>
                      </div>
                      <div>
                        <p className={muted}>Address</p>
                        <p className={strong}>{selectedSeller.address}</p>
                      </div>
                      <div>
                        <p className={muted}>Email</p>
                        <p className={strong}>{selectedSeller.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`w-full lg:w-72 rounded-2xl border p-4 ${panel}`}>
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold ${strong}`}>Seller stats</p>
                      <TrendingUp className="w-4 h-4 text-violet-400" />
                    </div>
                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex items-center justify-between"><span className={muted}>Earnings</span><span className={strong}>${selectedSeller.earnings}</span></div>
                      <div className="flex items-center justify-between"><span className={muted}>Listed products</span><span className={strong}>{selectedSeller.listedProducts}</span></div>
                      <div className="flex items-center justify-between"><span className={muted}>Disputes</span><span className={strong}>{selectedSeller.disputes}</span></div>
                      <div className="flex items-center justify-between"><span className={muted}>Rating</span><span className={strong}>{selectedSeller.stats.rating}</span></div>
                      <div className="flex items-center justify-between"><span className={muted}>Response time</span><span className={strong}>{selectedSeller.stats.responseTime}</span></div>
                      <div className="flex items-center justify-between"><span className={muted}>Completion</span><span className={strong}>{selectedSeller.stats.completionRate}</span></div>
                    </div>
                  </div>
                </div>

                <div className={`rounded-2xl border p-4 ${panel}`}>
                  <div className="flex items-center justify-between mb-3">
                    <p className={`font-semibold ${strong}`}>Seller Verification Checklist</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${TIER_CONFIG[selectedSeller.verificationTier].color}`}>
                      {TIER_CONFIG[selectedSeller.verificationTier].icon}
                      {TIER_CONFIG[selectedSeller.verificationTier].label}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {[
                      { label: "Phone verification", verified: selectedSeller.application.phoneVerified, icon: <Phone className="w-4 h-4" /> },
                      { label: "Email verification", verified: selectedSeller.application.emailVerified, icon: <Mail className="w-4 h-4" /> },
                      { label: "NID validation", verified: selectedSeller.application.nidVerified, icon: <FileText className="w-4 h-4" /> },
                      { label: "Business license", verified: selectedSeller.application.businessLicenseVerified, icon: <Shield className="w-4 h-4" /> },
                    ].map((item) => (
                      <div key={item.label} className={`rounded-xl border p-3 flex items-center justify-between ${surface}`}>
                        <div className="flex items-center gap-2">
                          {item.icon}
                          <span className={strong}>{item.label}</span>
                        </div>
                        {item.verified ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-rose-500" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className={`text-sm ${muted} mb-2`}>Application message</p>
                  <div className={`rounded-2xl p-4 text-sm leading-relaxed ${isDarkMode ? "bg-slate-700/50" : "bg-slate-50"}`}>
                    {selectedSeller.sellerRequestMessage}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className={`text-sm font-medium ${strong}`}>Feedback message</label>
                  <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={3} className={inputCls} placeholder="Leave approval, rejection, suspension, or re-verification feedback here." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className={`text-sm font-medium ${strong}`}>Verification tier</label>
                    <select value={tier} onChange={(e) => setTier(e.target.value as VerificationTier)} className={inputCls}>
                      <option value="basic">Basic Seller</option>
                      <option value="verified">Verified / Trusted Seller</option>
                    </select>
                  </div>
                  <div>
                    <label className={`text-sm font-medium ${strong}`}>Current status</label>
                    <div className={`rounded-xl border px-3 py-2 text-sm ${surface}`}>{STATUS_CONFIG[selectedSeller.status].label}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button onClick={handleApprove} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-700">
                    <CheckCircle className="w-4 h-4" /> Approve seller
                  </button>
                  <button onClick={handleReject} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-rose-700">
                    <XCircle className="w-4 h-4" /> Reject seller
                  </button>
                  <button onClick={handleSuspend} className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-amber-700">
                    <ShieldAlert className="w-4 h-4" /> Suspend seller
                  </button>
                  <button onClick={handleActivate} className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-sky-700">
                    <UserCheck className="w-4 h-4" /> Activate seller
                  </button>
                  <button onClick={handleVerifyBusiness} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-violet-700">
                    <BadgeCheck className="w-4 h-4" /> Verify business
                  </button>
                  <button onClick={handleReverify} className="inline-flex items-center gap-2 rounded-xl border border-slate-500/40 px-4 py-2.5 text-sm font-medium transition-all hover:bg-slate-700/50">
                    <RefreshCw className="w-4 h-4" /> Trigger re-verification
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