import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BadgeCheck,
  Ban,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  History,
  ListChecks,
  Mail,
  MapPin,
  Monitor,
  Phone,
  RotateCcw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  User,
  UserCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "../../../../../hooks/useTheme";

// ─── Types ─────────────────────────────────────────────────────────────────

type Role = "admin" | "seller" | "buyer";
type AccountStatus = "active" | "suspended" | "banned" | "pending_seller";
type VerificationTier = "basic" | "verified";

interface AuditEntry {
  id: string;
  type: "role" | "suspend" | "ban" | "reinstate" | "tier" | "reverify" | "approve" | "reject";
  detail: string;
  admin: string;
  date: string;
}

interface LoginRecord {
  id: string;
  date: string;
  ip: string;
  device: string;
  location: string;
  flagged?: boolean;
}

interface SellerApplication {
  phone: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  nidNumber: string;
  businessLicense?: string;
  frontDocument: string;
  backDocument: string;
  message: string;
  requestDate: string;
}

interface PlatformUser {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: Role;
  status: AccountStatus;
  verificationTier?: VerificationTier;
  joinDate: string;
  lastLogin: string;
  lastIp: string;
  lastDevice: string;
  suspension?: { type: "temporary" | "permanent"; reason: string; until: string | null; by: string; date: string };
  flaggedForReverification?: { reason: string; date: string };
  sellerApplication?: SellerApplication;
  auditTrail: AuditEntry[];
  loginHistory: LoginRecord[];
}

// ─── Mock Data ─────────────────────────────────────────────────────────────

const MOCK_USERS: PlatformUser[] = [
  {
    _id: "u1",
    name: "Emily Carter",
    email: "emily.carter@email.com",
    photo: "https://ui-avatars.com/api/?name=Emily+Carter&background=7c3aed&color=fff",
    role: "buyer",
    status: "active",
    joinDate: "2025-02-12",
    lastLogin: "2026-07-05 09:14",
    lastIp: "103.98.22.14",
    lastDevice: "Chrome · Windows",
    auditTrail: [
      { id: "a1", type: "role", detail: "Account created as Buyer", admin: "System", date: "2025-02-12" },
    ],
    loginHistory: [
      { id: "l1", date: "2026-07-05 09:14", ip: "103.98.22.14", device: "Chrome · Windows", location: "Dhaka, BD" },
      { id: "l2", date: "2026-07-02 18:40", ip: "103.98.22.14", device: "Safari · iPhone", location: "Dhaka, BD" },
    ],
  },
  {
    _id: "u2",
    name: "Noah Kim",
    email: "noah.kim@email.com",
    photo: "https://ui-avatars.com/api/?name=Noah+Kim&background=0369a1&color=fff",
    role: "seller",
    status: "active",
    verificationTier: "verified",
    joinDate: "2025-03-01",
    lastLogin: "2026-07-06 07:02",
    lastIp: "45.121.9.201",
    lastDevice: "Chrome · macOS",
    auditTrail: [
      { id: "a1", type: "approve", detail: "Seller application approved · Basic tier", admin: "Admin Sara", date: "2025-03-02" },
      { id: "a2", type: "tier", detail: "Upgraded to Verified/Trusted Seller", admin: "Admin Sara", date: "2025-06-18" },
    ],
    loginHistory: [
      { id: "l1", date: "2026-07-06 07:02", ip: "45.121.9.201", device: "Chrome · macOS", location: "Chattogram, BD" },
      { id: "l2", date: "2026-07-04 21:11", ip: "45.121.9.201", device: "Chrome · macOS", location: "Chattogram, BD" },
    ],
  },
  {
    _id: "u3",
    name: "Aisha Patel",
    email: "aisha.patel@email.com",
    photo: "https://ui-avatars.com/api/?name=Aisha+Patel&background=065f46&color=fff",
    role: "buyer",
    status: "active",
    joinDate: "2025-01-15",
    lastLogin: "2026-07-01 11:20",
    lastIp: "88.12.44.9",
    lastDevice: "Edge · Windows",
    auditTrail: [],
    loginHistory: [
      { id: "l1", date: "2026-07-01 11:20", ip: "88.12.44.9", device: "Edge · Windows", location: "Sylhet, BD" },
      { id: "l2", date: "2026-06-29 08:02", ip: "154.90.2.3", device: "Chrome · Android", location: "Unknown (VPN)", flagged: true },
    ],
  },
  {
    _id: "u4",
    name: "Liam Torres",
    email: "liam.torres@email.com",
    photo: "https://ui-avatars.com/api/?name=Liam+Torres&background=b45309&color=fff",
    role: "admin",
    status: "active",
    joinDate: "2024-11-20",
    lastLogin: "2026-07-06 08:45",
    lastIp: "10.0.0.4",
    lastDevice: "Chrome · Linux",
    auditTrail: [
      { id: "a1", type: "role", detail: "Promoted from Seller to Admin", admin: "Super Admin", date: "2025-01-04" },
    ],
    loginHistory: [
      { id: "l1", date: "2026-07-06 08:45", ip: "10.0.0.4", device: "Chrome · Linux", location: "Dhaka, BD" },
    ],
  },
  {
    _id: "u5",
    name: "Zara Nguyen",
    email: "zara.nguyen@email.com",
    photo: "https://ui-avatars.com/api/?name=Zara+Nguyen&background=be185d&color=fff",
    role: "seller",
    status: "suspended",
    verificationTier: "basic",
    joinDate: "2025-04-05",
    lastLogin: "2026-06-20 14:02",
    lastIp: "77.30.5.19",
    lastDevice: "Firefox · Windows",
    suspension: { type: "temporary", reason: "Multiple buyer complaints about item condition mismatch", until: "2026-07-20", by: "Admin Rafiq", date: "2026-06-20" },
    auditTrail: [
      { id: "a1", type: "approve", detail: "Seller application approved · Basic tier", admin: "Admin Sara", date: "2025-04-06" },
      { id: "a2", type: "suspend", detail: "Suspended for 30 days — complaint pattern", admin: "Admin Rafiq", date: "2026-06-20" },
    ],
    loginHistory: [
      { id: "l1", date: "2026-06-20 14:02", ip: "77.30.5.19", device: "Firefox · Windows", location: "Khulna, BD" },
    ],
  },
  {
    _id: "u6",
    name: "Marcus Webb",
    email: "marcus.webb@email.com",
    photo: "https://ui-avatars.com/api/?name=Marcus+Webb&background=1d4ed8&color=fff",
    role: "seller",
    status: "banned",
    verificationTier: "basic",
    joinDate: "2025-02-28",
    lastLogin: "2026-05-30 10:00",
    lastIp: "199.21.4.8",
    lastDevice: "Chrome · Windows",
    suspension: { type: "permanent", reason: "Confirmed counterfeit goods listing, fraud flag from payments team", until: null, by: "Admin Sara", date: "2026-05-30" },
    auditTrail: [
      { id: "a1", type: "approve", detail: "Seller application approved · Basic tier", admin: "Admin Rafiq", date: "2025-03-01" },
      { id: "a2", type: "ban", detail: "Permanently banned — confirmed counterfeit listing", admin: "Admin Sara", date: "2026-05-30" },
    ],
    loginHistory: [
      { id: "l1", date: "2026-05-30 10:00", ip: "199.21.4.8", device: "Chrome · Windows", location: "Unknown (VPN)", flagged: true },
    ],
  },
  {
    _id: "u7",
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    photo: "https://ui-avatars.com/api/?name=Priya+Sharma&background=9333ea&color=fff",
    role: "buyer",
    status: "pending_seller",
    joinDate: "2025-05-20",
    lastLogin: "2026-07-04 16:30",
    lastIp: "103.11.7.2",
    lastDevice: "Safari · macOS",
    sellerApplication: {
      phone: "+880 1812-345678",
      phoneVerified: true,
      emailVerified: true,
      nidNumber: "NID-8820193744",
      businessLicense: "TRAD-2025-00918",
      frontDocument: "https://picsum.photos/id/201/600/400",
      backDocument: "https://picsum.photos/id/202/600/400",
      message: "Experienced fashion reseller looking to list premium clothing sourced locally.",
      requestDate: "2026-07-04",
    },
    auditTrail: [],
    loginHistory: [
      { id: "l1", date: "2026-07-04 16:30", ip: "103.11.7.2", device: "Safari · macOS", location: "Dhaka, BD" },
    ],
  },
  {
    _id: "u8",
    name: "Jordan Lee",
    email: "jordan.lee@email.com",
    photo: "https://ui-avatars.com/api/?name=Jordan+Lee&background=0d9488&color=fff",
    role: "buyer",
    status: "pending_seller",
    joinDate: "2025-06-02",
    lastLogin: "2026-07-05 20:12",
    lastIp: "45.10.90.3",
    lastDevice: "Chrome · Android",
    sellerApplication: {
      phone: "+880 1712-345678",
      phoneVerified: true,
      emailVerified: false,
      nidNumber: "NID-7710238819",
      frontDocument: "https://picsum.photos/id/1015/600/400",
      backDocument: "https://picsum.photos/id/102/600/400",
      message: "I have been selling vintage watches for 5 years and want to expand my business.",
      requestDate: "2026-07-05",
    },
    auditTrail: [],
    loginHistory: [
      { id: "l1", date: "2026-07-05 20:12", ip: "45.10.90.3", device: "Chrome · Android", location: "Dhaka, BD" },
    ],
  },
  {
    _id: "u9",
    name: "Sofia Diaz",
    email: "sofia.diaz@email.com",
    photo: "https://ui-avatars.com/api/?name=Sofia+Diaz&background=be185d&color=fff",
    role: "seller",
    status: "active",
    verificationTier: "verified",
    joinDate: "2024-12-11",
    lastLogin: "2026-07-06 06:10",
    lastIp: "88.4.20.6",
    lastDevice: "Chrome · Windows",
    flaggedForReverification: { reason: "Two unresolved delivery disputes filed in the last 30 days", date: "2026-07-03" },
    auditTrail: [
      { id: "a1", type: "tier", detail: "Upgraded to Verified/Trusted Seller", admin: "Admin Sara", date: "2025-09-02" },
      { id: "a2", type: "reverify", detail: "Flagged for re-verification — repeat delivery disputes", admin: "System", date: "2026-07-03" },
    ],
    loginHistory: [
      { id: "l1", date: "2026-07-06 06:10", ip: "88.4.20.6", device: "Chrome · Windows", location: "Dhaka, BD" },
    ],
  },
  {
    _id: "u10",
    name: "Ken Watanabe",
    email: "ken.watanabe@email.com",
    photo: "https://ui-avatars.com/api/?name=Ken+Watanabe&background=475569&color=fff",
    role: "buyer",
    status: "active",
    joinDate: "2025-07-19",
    lastLogin: "2026-06-30 12:44",
    lastIp: "210.4.5.6",
    lastDevice: "Chrome · Windows",
    auditTrail: [],
    loginHistory: [
      { id: "l1", date: "2026-06-30 12:44", ip: "210.4.5.6", device: "Chrome · Windows", location: "Dhaka, BD" },
    ],
  },
];

// ─── Config ────────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<Role, { label: string; icon: React.JSX.Element; color: string }> = {
  admin: { label: "Admin", icon: <Shield className="w-3.5 h-3.5" />, color: "bg-violet-500/15 text-violet-400 border-violet-500/20" },
  seller: { label: "Seller", icon: <UserCheck className="w-3.5 h-3.5" />, color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  buyer: { label: "Buyer", icon: <User className="w-3.5 h-3.5" />, color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
};

const STATUS_CONFIG: Record<AccountStatus, { label: string; icon: React.JSX.Element; color: string }> = {
  active: { label: "Active", icon: <CheckCircle className="w-3.5 h-3.5" />, color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  suspended: { label: "Suspended", icon: <Clock className="w-3.5 h-3.5" />, color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  banned: { label: "Banned", icon: <Ban className="w-3.5 h-3.5" />, color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
  pending_seller: { label: "Pending Application", icon: <ListChecks className="w-3.5 h-3.5" />, color: "bg-violet-500/15 text-violet-400 border-violet-500/20" },
};

const TIER_CONFIG: Record<VerificationTier, { label: string; icon: React.JSX.Element; color: string }> = {
  basic: { label: "Basic Seller", icon: <Shield className="w-3.5 h-3.5" />, color: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
  verified: { label: "Verified Seller", icon: <BadgeCheck className="w-3.5 h-3.5" />, color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
};

const AUDIT_ICON: Record<AuditEntry["type"], React.JSX.Element> = {
  role: <Shield className="w-3.5 h-3.5" />,
  suspend: <Clock className="w-3.5 h-3.5" />,
  ban: <Ban className="w-3.5 h-3.5" />,
  reinstate: <RotateCcw className="w-3.5 h-3.5" />,
  tier: <BadgeCheck className="w-3.5 h-3.5" />,
  reverify: <ShieldAlert className="w-3.5 h-3.5" />,
  approve: <CheckCircle className="w-3.5 h-3.5" />,
  reject: <XCircle className="w-3.5 h-3.5" />,
};

const PAGE_SIZE = 5;
const ROLE_TABS = [
  { key: "all", label: "All Users" },
  { key: "admin", label: "Admins" },
  { key: "seller", label: "Sellers" },
  { key: "buyer", label: "Buyers" },
  { key: "pending_seller", label: "Pending Applications" },
] as const;

type RoleTabKey = (typeof ROLE_TABS)[number]["key"];

// ─── Component ─────────────────────────────────────────────────────────────

export default function UserManagementPage() {
  const { isDarkMode } = useTheme();

  const [users, setUsers] = useState<PlatformUser[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<RoleTabKey>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | AccountStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [pendingRole, setPendingRole] = useState<Role | null>(null);
  const [showSuspendForm, setShowSuspendForm] = useState(false);
  const [suspendType, setSuspendType] = useState<"temporary" | "permanent">("temporary");
  const [suspendDays, setSuspendDays] = useState(7);
  const [suspendReason, setSuspendReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState("");
  const [approveTier, setApproveTier] = useState<VerificationTier>("basic");
  const [approveFeedback, setApproveFeedback] = useState("");
  const [reverifyReason, setReverifyReason] = useState("");
  const [showReverifyForm, setShowReverifyForm] = useState(false);

  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const divider = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const panel = isDarkMode ? "bg-slate-700/40" : "bg-slate-50";
  const inputCls = `w-full px-3 py-2 text-sm rounded-xl border outline-none transition-all ${
    isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
  }`;

  const selectedUser = useMemo(() => users.find(u => u._id === selectedUserId) || null, [users, selectedUserId]);

  // reset pagination whenever filters change
  useEffect(() => { setCurrentPage(1); }, [searchQuery, activeTab, statusFilter]);

  const roleCounts = users.reduce((acc: Record<string, number>, u) => {
    const key = u.status === "pending_seller" ? "pending_seller" : u.role;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab =
        activeTab === "all"
          ? true
          : activeTab === "pending_seller"
          ? u.status === "pending_seller"
          : u.role === activeTab && u.status !== "pending_seller";
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      return matchesSearch && matchesTab && matchesStatus;
    });
  }, [users, searchQuery, activeTab, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const pageSafe = Math.min(currentPage, totalPages);
  const paginatedUsers = filteredUsers.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const stats = [
    { label: "Total Users", value: users.length, icon: <Users className="w-4 h-4" />, color: "text-violet-400", bg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50", bar: "from-violet-500 to-blue-500" },
    { label: "Pending Applications", value: roleCounts.pending_seller || 0, icon: <ListChecks className="w-4 h-4" />, color: "text-amber-400", bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50", bar: "from-amber-500 to-orange-500" },
    { label: "Suspended / Banned", value: users.filter(u => u.status === "suspended" || u.status === "banned").length, icon: <ShieldAlert className="w-4 h-4" />, color: "text-rose-400", bg: isDarkMode ? "bg-rose-500/10" : "bg-rose-50", bar: "from-rose-500 to-pink-500" },
    { label: "Verified Sellers", value: users.filter(u => u.verificationTier === "verified").length, icon: <ShieldCheck className="w-4 h-4" />, color: "text-sky-400", bg: isDarkMode ? "bg-sky-500/10" : "bg-sky-50", bar: "from-sky-500 to-blue-400" },
  ];

  // ── Modal reset helpers ─────────────────────────────────────────────────
  const openUserModal = (user: PlatformUser) => {
    setSelectedUserId(user._id);
    setPendingRole(null);
    setShowSuspendForm(false);
    setSuspendType("temporary");
    setSuspendDays(7);
    setSuspendReason("");
    setShowRejectForm(false);
    setRejectFeedback("");
    setApproveTier("basic");
    setApproveFeedback("");
    setShowReverifyForm(false);
    setReverifyReason("");
  };
  const closeModal = () => setSelectedUserId(null);

  const addAudit = (userId: string, entry: Omit<AuditEntry, "id">) => {
    setUsers(prev => prev.map(u => u._id === userId ? { ...u, auditTrail: [{ ...entry, id: `aud-${Date.now()}` }, ...u.auditTrail] } : u));
  };

  // ── RBAC ─────────────────────────────────────────────────────────────────
  const confirmRoleChange = (user: PlatformUser) => {
    if (!pendingRole || pendingRole === user.role) return;
    setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: pendingRole, verificationTier: pendingRole === "seller" ? u.verificationTier || "basic" : undefined } : u));
    addAudit(user._id, { type: "role", detail: `Role changed from ${ROLE_CONFIG[user.role].label} to ${ROLE_CONFIG[pendingRole].label}`, admin: "You" , date: new Date().toISOString().slice(0, 10)});
    toast.success(`${user.name}'s role updated to ${ROLE_CONFIG[pendingRole].label}`);
    setPendingRole(null);
  };

  // ── Suspend / Ban / Reinstate ───────────────────────────────────────────
  const applySuspension = (user: PlatformUser) => {
    if (!suspendReason.trim()) { toast.error("Please provide a reason"); return; }
    const newStatus: AccountStatus = suspendType === "permanent" ? "banned" : "suspended";
    const until = suspendType === "temporary" ? new Date(Date.now() + suspendDays * 86400000).toISOString().slice(0, 10) : null;
    setUsers(prev => prev.map(u => u._id === user._id ? {
      ...u,
      status: newStatus,
      suspension: { type: suspendType, reason: suspendReason.trim(), until, by: "You", date: new Date().toISOString().slice(0, 10) },
    } : u));
    addAudit(user._id, {
      type: suspendType === "permanent" ? "ban" : "suspend",
      detail: suspendType === "permanent" ? `Permanently banned — ${suspendReason.trim()}` : `Suspended for ${suspendDays} days — ${suspendReason.trim()}`,
      admin: "You",
      date: new Date().toISOString().slice(0, 10),
    });
    toast.error(suspendType === "permanent" ? `${user.name} has been banned` : `${user.name} suspended for ${suspendDays} days`);
    setShowSuspendForm(false);
    setSuspendReason("");
  };

  const reinstateUser = (user: PlatformUser) => {
    setUsers(prev => prev.map(u => u._id === user._id ? { ...u, status: "active", suspension: undefined } : u));
    addAudit(user._id, { type: "reinstate", detail: "Account reinstated — restrictions lifted", admin: "You", date: new Date().toISOString().slice(0, 10) });
    toast.success(`${user.name}'s account reinstated`);
  };

  // ── Seller verification tier ────────────────────────────────────────────
  const setTier = (user: PlatformUser, tier: VerificationTier) => {
    setUsers(prev => prev.map(u => u._id === user._id ? { ...u, verificationTier: tier } : u));
    addAudit(user._id, { type: "tier", detail: `Set to ${TIER_CONFIG[tier].label}`, admin: "You", date: new Date().toISOString().slice(0, 10) });
    toast.success(`${user.name} set to ${TIER_CONFIG[tier].label}`);
  };

  const triggerReverification = (user: PlatformUser) => {
    if (!reverifyReason.trim()) { toast.error("Please provide a reason"); return; }
    setUsers(prev => prev.map(u => u._id === user._id ? { ...u, flaggedForReverification: { reason: reverifyReason.trim(), date: new Date().toISOString().slice(0, 10) } } : u));
    addAudit(user._id, { type: "reverify", detail: `Flagged for re-verification — ${reverifyReason.trim()}`, admin: "You", date: new Date().toISOString().slice(0, 10) });
    toast.success(`${user.name} flagged for re-verification`);
    setShowReverifyForm(false);
    setReverifyReason("");
  };

  const clearReverification = (user: PlatformUser) => {
    setUsers(prev => prev.map(u => u._id === user._id ? { ...u, flaggedForReverification: undefined } : u));
    addAudit(user._id, { type: "reverify", detail: "Re-verification cleared — checks passed", admin: "You", date: new Date().toISOString().slice(0, 10) });
    toast.success(`${user.name}'s re-verification cleared`);
  };

  // ── Seller application approve / reject ─────────────────────────────────
  const approveApplication = (user: PlatformUser) => {
    setUsers(prev => prev.map(u => u._id === user._id ? { ...u, role: "seller", status: "active", verificationTier: approveTier } : u));
    addAudit(user._id, { type: "approve", detail: `Seller application approved · ${TIER_CONFIG[approveTier].label}${approveFeedback ? ` — "${approveFeedback.trim()}"` : ""}`, admin: "You", date: new Date().toISOString().slice(0, 10) });
    toast.success(`${user.name} approved as ${TIER_CONFIG[approveTier].label}`);
    closeModal();
  };

  const rejectApplication = (user: PlatformUser) => {
    if (!rejectFeedback.trim()) { toast.error("Please add feedback for the applicant"); return; }
    setUsers(prev => prev.map(u => u._id === user._id ? { ...u, status: "active" } : u));
    addAudit(user._id, { type: "reject", detail: `Seller application rejected — "${rejectFeedback.trim()}"`, admin: "You", date: new Date().toISOString().slice(0, 10) });
    toast.error(`${user.name}'s application rejected`);
    closeModal();
  };

  // ── Pagination controls ─────────────────────────────────────────────────
  const Pagination = () => (
    <div className={`flex items-center justify-between px-5 py-4 border-t ${divider}`}>
      <p className={`text-xs ${muted}`}>
        Showing {filteredUsers.length === 0 ? 0 : (pageSafe - 1) * PAGE_SIZE + 1}–{Math.min(pageSafe * PAGE_SIZE, filteredUsers.length)} of {filteredUsers.length}
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={pageSafe === 1}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => setCurrentPage(p)}
            className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
              p === pageSafe ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={pageSafe === totalPages}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}
        >
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
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            borderRadius: "10px",
            background: isDarkMode ? "#1e293b" : "#fff",
            color: isDarkMode ? "#f1f5f9" : "#0f172a",
            border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0",
          },
        }}
      />

      {/* Header */}
      <div className={`sticky top-0 z-20 border-b backdrop-blur-xl ${isDarkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-slate-200"}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold tracking-tight">User & Role Management</h1>
              <p className={`text-xs mt-0.5 ${muted}`}>Manage accounts, seller upgrades, access levels and fraud signals</p>
            </div>

            <div className="flex items-center gap-2">
              <div className={`relative w-full sm:w-72 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-8 py-2 text-sm rounded-xl border outline-none transition-all ${
                    isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
                  }`}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className={`text-sm rounded-xl border px-3 py-2 outline-none ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"}`}
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
                <option value="pending_seller">Pending application</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
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

        {/* Role Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto no-scrollbar">
          {ROLE_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${activeTab === tab.key ? "bg-white/20" : isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>
                {tab.key === "all" ? users.length : roleCounts[tab.key] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* User list */}
        <div className={`rounded-2xl border ${surface}`}>
          {paginatedUsers.length > 0 ? (
            <div className="divide-y divide-slate-700/40">
              {paginatedUsers.map((user, i) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex flex-col md:flex-row md:items-center gap-3 md:gap-4 px-5 py-4 ${isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-slate-50"} transition-colors`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img src={user.photo} alt={user.name} className="w-11 h-11 rounded-2xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${strong}`}>{user.name}</p>
                      <p className={`text-xs truncate ${muted}`}>{user.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 md:w-auto">
                    {user.status !== "pending_seller" && (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${ROLE_CONFIG[user.role].color}`}>
                        {ROLE_CONFIG[user.role].icon} {ROLE_CONFIG[user.role].label}
                      </span>
                    )}
                    {user.verificationTier && (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${TIER_CONFIG[user.verificationTier].color}`}>
                        {TIER_CONFIG[user.verificationTier].icon} {TIER_CONFIG[user.verificationTier].label}
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${STATUS_CONFIG[user.status].color}`}>
                      {STATUS_CONFIG[user.status].icon} {STATUS_CONFIG[user.status].label}
                    </span>
                    {user.flaggedForReverification && (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isDarkMode ? "bg-orange-500/15 text-orange-400 border-orange-500/20" : "bg-orange-50 text-orange-600 border-orange-200"}`}>
                        <ShieldAlert className="w-3.5 h-3.5" /> Re-verification flagged
                      </span>
                    )}
                  </div>

                  <div className={`hidden lg:block text-xs ${muted} w-40 shrink-0`}>
                    <p>Joined {user.joinDate}</p>
                    <p>Last login {user.lastLogin}</p>
                  </div>

                  <button
                    onClick={() => openUserModal(user)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" /> Manage
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center">
              <Users className={`w-12 h-12 mx-auto mb-4 ${muted}`} />
              <p className={`text-lg font-medium ${strong}`}>No users found</p>
              <p className={muted}>Try adjusting your search or filters</p>
            </div>
          )}
          {filteredUsers.length > 0 && <Pagination />}
        </div>
      </div>

      {/* ── User Detail Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className={`w-full max-w-3xl rounded-2xl ${surface} max-h-[92vh] overflow-y-auto`}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-10 ${surface} ${divider}`}>
                <div className="flex items-center gap-4">
                  <img src={selectedUser.photo} alt={selectedUser.name} className="w-14 h-14 rounded-2xl object-cover" />
                  <div>
                    <h3 className={`text-lg font-semibold ${strong}`}>{selectedUser.name}</h3>
                    <p className={`text-sm ${muted}`}>{selectedUser.email}</p>
                  </div>
                </div>
                <button onClick={closeModal} className={`p-2 rounded-lg ${muted}`}><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-7">

                {/* Status badges row */}
                <div className="flex flex-wrap items-center gap-2">
                  {selectedUser.status !== "pending_seller" && (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${ROLE_CONFIG[selectedUser.role].color}`}>
                      {ROLE_CONFIG[selectedUser.role].icon} {ROLE_CONFIG[selectedUser.role].label}
                    </span>
                  )}
                  {selectedUser.verificationTier && (
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${TIER_CONFIG[selectedUser.verificationTier].color}`}>
                      {TIER_CONFIG[selectedUser.verificationTier].icon} {TIER_CONFIG[selectedUser.verificationTier].label}
                    </span>
                  )}
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_CONFIG[selectedUser.status].color}`}>
                    {STATUS_CONFIG[selectedUser.status].icon} {STATUS_CONFIG[selectedUser.status].label}
                  </span>
                </div>

                {/* Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><p className={muted}>Joined</p><p className={strong}>{selectedUser.joinDate}</p></div>
                  <div><p className={muted}>Last login</p><p className={strong}>{selectedUser.lastLogin}</p></div>
                  <div><p className={muted}>Last IP</p><p className={strong}>{selectedUser.lastIp}</p></div>
                  <div><p className={muted}>Device</p><p className={strong}>{selectedUser.lastDevice}</p></div>
                </div>

                {/* ── Pending seller application review ─────────────── */}
                {selectedUser.status === "pending_seller" && selectedUser.sellerApplication && (
                  <div className={`rounded-2xl p-5 space-y-4 ${panel}`}>
                    <p className={`text-sm font-semibold ${strong}`}>Seller verification — application review</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 opacity-60" />
                        <span className={strong}>{selectedUser.sellerApplication.phone}</span>
                        {selectedUser.sellerApplication.phoneVerified ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 opacity-60" />
                        <span className={strong}>Email</span>
                        {selectedUser.sellerApplication.emailVerified ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-500" />
                        )}
                      </div>
                      <div><p className={muted}>NID number</p><p className={strong}>{selectedUser.sellerApplication.nidNumber}</p></div>
                      <div><p className={muted}>Business license</p><p className={strong}>{selectedUser.sellerApplication.businessLicense || "Not provided"}</p></div>
                    </div>

                    <p className={`text-sm leading-relaxed p-3 rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>{selectedUser.sellerApplication.message}</p>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className={`text-xs mb-1.5 ${muted}`}>Front of ID</p>
                        <img src={selectedUser.sellerApplication.frontDocument} className="rounded-xl w-full aspect-video object-cover border" />
                      </div>
                      <div>
                        <p className={`text-xs mb-1.5 ${muted}`}>Back of ID</p>
                        <img src={selectedUser.sellerApplication.backDocument} className="rounded-xl w-full aspect-video object-cover border" />
                      </div>
                    </div>

                    {!showRejectForm ? (
                      <div className="space-y-3 pt-2">
                        <div>
                          <p className={`text-xs mb-1.5 ${muted}`}>Verification tier on approval</p>
                          <div className="flex gap-2">
                            {(["basic", "verified"] as VerificationTier[]).map(tier => (
                              <button
                                key={tier}
                                onClick={() => setApproveTier(tier)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                  approveTier === tier ? TIER_CONFIG[tier].color + " ring-1 ring-current" : isDarkMode ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"
                                }`}
                              >
                                {TIER_CONFIG[tier].icon} {TIER_CONFIG[tier].label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <textarea
                          value={approveFeedback}
                          onChange={e => setApproveFeedback(e.target.value)}
                          placeholder="Optional feedback message to send to the applicant..."
                          rows={2}
                          className={inputCls}
                        />
                        <div className="flex gap-3">
                          <button onClick={() => approveApplication(selectedUser)} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4" /> Approve as {TIER_CONFIG[approveTier].label}
                          </button>
                          <button onClick={() => setShowRejectForm(true)} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 pt-2">
                        <p className={`text-xs font-medium ${strong}`}>Feedback message to applicant (required)</p>
                        <textarea
                          value={rejectFeedback}
                          onChange={e => setRejectFeedback(e.target.value)}
                          placeholder="Explain why the application is being rejected..."
                          rows={2}
                          className={inputCls}
                        />
                        <div className="flex gap-3">
                          <button onClick={() => rejectApplication(selectedUser)} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium">
                            Confirm rejection
                          </button>
                          <button onClick={() => setShowRejectForm(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── RBAC — role management ─────────────────────────── */}
                {selectedUser.status !== "pending_seller" && (
                  <div className={`rounded-2xl p-5 space-y-3 ${panel}`}>
                    <p className={`text-sm font-semibold ${strong}`}>Role & access (RBAC)</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {(["buyer", "seller", "admin"] as Role[]).map(role => (
                        <button
                          key={role}
                          onClick={() => setPendingRole(role)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            (pendingRole ?? selectedUser.role) === role ? ROLE_CONFIG[role].color + " ring-1 ring-current" : isDarkMode ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"
                          }`}
                        >
                          {ROLE_CONFIG[role].icon} {ROLE_CONFIG[role].label}
                        </button>
                      ))}
                      {pendingRole && pendingRole !== selectedUser.role && (
                        <button onClick={() => confirmRoleChange(selectedUser)} className="ml-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white">
                          Confirm change
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Seller verification tier ───────────────────────── */}
                {selectedUser.role === "seller" && selectedUser.status !== "pending_seller" && (
                  <div className={`rounded-2xl p-5 space-y-3 ${panel}`}>
                    <p className={`text-sm font-semibold ${strong}`}>Seller verification tier</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {(["basic", "verified"] as VerificationTier[]).map(tier => (
                        <button
                          key={tier}
                          onClick={() => setTier(selectedUser, tier)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            selectedUser.verificationTier === tier ? TIER_CONFIG[tier].color + " ring-1 ring-current" : isDarkMode ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"
                          }`}
                        >
                          {TIER_CONFIG[tier].icon} {TIER_CONFIG[tier].label}
                        </button>
                      ))}
                    </div>

                    {selectedUser.flaggedForReverification ? (
                      <div className={`rounded-xl p-3 text-sm space-y-2 ${isDarkMode ? "bg-orange-500/10" : "bg-orange-50"}`}>
                        <p className="flex items-center gap-2 font-medium text-orange-500"><ShieldAlert className="w-4 h-4" /> Flagged for re-verification</p>
                        <p className={muted}>{selectedUser.flaggedForReverification.reason} · {selectedUser.flaggedForReverification.date}</p>
                        <button onClick={() => clearReverification(selectedUser)} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white">
                          Mark checks passed
                        </button>
                      </div>
                    ) : !showReverifyForm ? (
                      <button onClick={() => setShowReverifyForm(true)} className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border ${isDarkMode ? "border-slate-600 text-slate-300 hover:bg-slate-700" : "border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
                        <ShieldAlert className="w-3.5 h-3.5" /> Trigger re-verification (fraud flag / complaint)
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <textarea value={reverifyReason} onChange={e => setReverifyReason(e.target.value)} rows={2} placeholder="Reason — e.g. fraud flag from payments, repeated complaints..." className={inputCls} />
                        <div className="flex gap-2">
                          <button onClick={() => triggerReverification(selectedUser)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white">Flag account</button>
                          <button onClick={() => setShowReverifyForm(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Suspension / ban ────────────────────────────────── */}
                {selectedUser.status !== "pending_seller" && (
                  <div className={`rounded-2xl p-5 space-y-3 ${panel}`}>
                    <p className={`text-sm font-semibold ${strong}`}>Account restrictions</p>

                    {selectedUser.status === "suspended" || selectedUser.status === "banned" ? (
                      <div className="space-y-3">
                        <div className={`rounded-xl p-3 text-sm ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
                          <p className={strong}>
                            {selectedUser.status === "banned" ? "Permanently banned" : `Suspended until ${selectedUser.suspension?.until}`}
                          </p>
                          <p className={muted}>{selectedUser.suspension?.reason}</p>
                          <p className={`text-xs mt-1 ${muted}`}>By {selectedUser.suspension?.by} on {selectedUser.suspension?.date}</p>
                        </div>
                        <button onClick={() => reinstateUser(selectedUser)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white">
                          <RotateCcw className="w-3.5 h-3.5" /> Reinstate account
                        </button>
                      </div>
                    ) : !showSuspendForm ? (
                      <button onClick={() => setShowSuspendForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white">
                        <Ban className="w-3.5 h-3.5" /> Suspend or ban user
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <button onClick={() => setSuspendType("temporary")} className={`flex-1 py-2 rounded-lg text-xs font-medium border ${suspendType === "temporary" ? "bg-amber-500/15 text-amber-400 border-amber-500/30" : isDarkMode ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                            Temporary suspension
                          </button>
                          <button onClick={() => setSuspendType("permanent")} className={`flex-1 py-2 rounded-lg text-xs font-medium border ${suspendType === "permanent" ? "bg-rose-500/15 text-rose-400 border-rose-500/30" : isDarkMode ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"}`}>
                            Permanent ban
                          </button>
                        </div>
                        {suspendType === "temporary" && (
                          <div className="flex items-center gap-2">
                            <label className={`text-xs ${muted}`}>Duration (days)</label>
                            <input type="number" min={1} value={suspendDays} onChange={e => setSuspendDays(Number(e.target.value))} className={`${inputCls} w-24`} />
                          </div>
                        )}
                        <textarea value={suspendReason} onChange={e => setSuspendReason(e.target.value)} rows={2} placeholder="Reason for this action (required, kept in audit trail)..." className={inputCls} />
                        <div className="flex gap-2">
                          <button onClick={() => applySuspension(selectedUser)} className="px-4 py-2 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white">
                            Confirm {suspendType === "permanent" ? "ban" : "suspension"}
                          </button>
                          <button onClick={() => setShowSuspendForm(false)} className={`px-4 py-2 rounded-lg text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Activity log ────────────────────────────────────── */}
                <div className="space-y-3">
                  <p className={`text-sm font-semibold flex items-center gap-2 ${strong}`}><Monitor className="w-4 h-4" /> Activity log</p>
                  <div className="space-y-2">
                    {selectedUser.loginHistory.map(l => (
                      <div key={l.id} className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm ${l.flagged ? (isDarkMode ? "bg-rose-500/10" : "bg-rose-50") : panel}`}>
                        <div className="flex items-center gap-2 min-w-0">
                          {l.flagged && <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                          <span className={strong}>{l.date}</span>
                        </div>
                        <div className={`flex items-center gap-3 text-xs ${muted}`}>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{l.location}</span>
                          <span>{l.device}</span>
                          <span>{l.ip}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Audit trail ─────────────────────────────────────── */}
                <div className="space-y-3">
                  <p className={`text-sm font-semibold flex items-center gap-2 ${strong}`}><History className="w-4 h-4" /> Audit trail</p>
                  {selectedUser.auditTrail.length === 0 ? (
                    <p className={`text-sm ${muted}`}>No administrative actions recorded yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedUser.auditTrail.map(entry => (
                        <div key={entry.id} className={`flex items-start gap-3 px-3 py-2.5 rounded-xl ${panel}`}>
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>
                            {AUDIT_ICON[entry.type]}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-sm ${strong}`}>{entry.detail}</p>
                            <p className={`text-xs ${muted}`}>{entry.admin} · {entry.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
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