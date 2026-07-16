import { AnimatePresence, motion } from "framer-motion";
import {
  AlertOctagon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  Eye,
  History,
  Lock,
  MapPinned,
  PackageCheck,
  PackageX,
  RotateCcw,
  Search,
  Truck,
  Unlock,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "../../../../../hooks/useTheme";

// ─── Types ─────────────────────────────────────────────────────────────────

type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
type EscrowStatus = "held" | "released" | "refunded";
type DeliveryStatus = "awaiting_shipment" | "shipped" | "in_transit" | "delivered" | "returned";
type PayoutStatus = "on_hold" | "pending" | "released";

interface Dispute {
  reason: string;
  raisedBy: "buyer" | "seller";
  date: string;
  status: "open" | "resolved";
  resolution?: string;
}

interface EndedAuditEntry {
  id: string;
  type: "payment" | "escrow" | "delivery" | "payout" | "dispute";
  detail: string;
  admin: string;
  date: string;
}

interface EndedAuction {
  _id: string;
  title: string;
  coverImage: string;
  category: string;
  seller: { name: string; photo: string };
  winner: { name: string; photo: string; email: string };
  finalPrice: number;
  commissionRate: number;
  endDate: string;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  transactionId: string;
  escrowStatus: EscrowStatus;
  deliveryStatus: DeliveryStatus;
  carrier?: string;
  trackingNumber?: string;
  shippedDate?: string;
  deliveredDate?: string;
  payoutStatus: PayoutStatus;
  dispute?: Dispute;
  auditTrail: EndedAuditEntry[];
}

// ─── Mock data ─────────────────────────────────────────────────────────────

const MOCK_ENDED: EndedAuction[] = [
  {
    _id: "ea1",
    title: "Antique Pocket Watch — 18k Gold",
    coverImage: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80",
    category: "Collectibles",
    seller: { name: "Sofia Diaz", photo: "https://ui-avatars.com/api/?name=Sofia+Diaz&background=be185d&color=fff" },
    winner: { name: "Liam Torres", photo: "https://ui-avatars.com/api/?name=Liam+Torres&background=b45309&color=fff", email: "liam.torres@email.com" },
    finalPrice: 940,
    commissionRate: 10,
    endDate: "2026-06-28",
    paymentStatus: "paid",
    paymentMethod: "SSLCommerz (bKash)",
    transactionId: "SSLCZ-88213740",
    escrowStatus: "held",
    deliveryStatus: "shipped",
    carrier: "Sundarban Courier",
    trackingNumber: "SB-4471029",
    shippedDate: "2026-06-30",
    payoutStatus: "on_hold",
    auditTrail: [
      { id: "e1", type: "payment", detail: "Payment confirmed via SSLCommerz", admin: "System", date: "2026-06-28" },
      { id: "e2", type: "delivery", detail: "Marked shipped via Sundarban Courier · SB-4471029", admin: "Admin Sara", date: "2026-06-30" },
    ],
  },
  {
    _id: "ea2",
    title: "Hand-carved Rosewood Chess Set",
    coverImage: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=600&q=80",
    category: "Collectibles",
    seller: { name: "Zara Nguyen", photo: "https://ui-avatars.com/api/?name=Zara+Nguyen&background=be185d&color=fff" },
    winner: { name: "Aisha Patel", photo: "https://ui-avatars.com/api/?name=Aisha+Patel&background=065f46&color=fff", email: "aisha.patel@email.com" },
    finalPrice: 150,
    commissionRate: 10,
    endDate: "2026-06-25",
    paymentStatus: "pending",
    paymentMethod: "SSLCommerz (Card)",
    transactionId: "—",
    escrowStatus: "held",
    deliveryStatus: "awaiting_shipment",
    payoutStatus: "on_hold",
    auditTrail: [
      { id: "e1", type: "payment", detail: "Awaiting buyer payment confirmation", admin: "System", date: "2026-06-25" },
    ],
  },
  {
    _id: "ea3",
    title: "Signed First-Edition Novel Set",
    coverImage: "https://images.unsplash.com/photo-1521123845560-14093637aa7d?w=600&q=80",
    category: "Collectibles",
    seller: { name: "Aisha Patel", photo: "https://ui-avatars.com/api/?name=Aisha+Patel&background=065f46&color=fff" },
    winner: { name: "Noah Kim", photo: "https://ui-avatars.com/api/?name=Noah+Kim&background=0369a1&color=fff", email: "noah.kim@email.com" },
    finalPrice: 410,
    commissionRate: 10,
    endDate: "2026-06-20",
    paymentStatus: "paid",
    paymentMethod: "SSLCommerz (Nagad)",
    transactionId: "SSLCZ-77012984",
    escrowStatus: "released",
    deliveryStatus: "delivered",
    carrier: "Pathao Courier",
    trackingNumber: "PT-2201938",
    shippedDate: "2026-06-21",
    deliveredDate: "2026-06-24",
    payoutStatus: "released",
    auditTrail: [
      { id: "e1", type: "payment", detail: "Payment confirmed via SSLCommerz", admin: "System", date: "2026-06-20" },
      { id: "e2", type: "delivery", detail: "Delivered and confirmed by buyer", admin: "Admin Rafiq", date: "2026-06-24" },
      { id: "e3", type: "escrow", detail: "Escrow released to seller", admin: "Admin Rafiq", date: "2026-06-25" },
      { id: "e4", type: "payout", detail: "Payout of $369 released to seller", admin: "Admin Rafiq", date: "2026-06-25" },
    ],
  },
  {
    _id: "ea4",
    title: "Gaming PC — RTX 4090 Build",
    coverImage: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80",
    category: "Electronics",
    seller: { name: "Priya Sharma", photo: "https://ui-avatars.com/api/?name=Priya+Sharma&background=9333ea&color=fff" },
    winner: { name: "Marcus Webb", photo: "https://ui-avatars.com/api/?name=Marcus+Webb&background=1d4ed8&color=fff", email: "marcus.webb@email.com" },
    finalPrice: 1650,
    commissionRate: 8,
    endDate: "2026-06-30",
    paymentStatus: "failed",
    paymentMethod: "SSLCommerz (Card)",
    transactionId: "SSLCZ-11029384 (declined)",
    escrowStatus: "refunded",
    deliveryStatus: "returned",
    payoutStatus: "on_hold",
    auditTrail: [
      { id: "e1", type: "payment", detail: "Card payment declined by issuing bank", admin: "System", date: "2026-06-30" },
      { id: "e2", type: "escrow", detail: "Escrow released back to buyer — payment never settled", admin: "Admin Rafiq", date: "2026-06-30" },
    ],
  },
  {
    _id: "ea5",
    title: "Restored 1978 Vespa Scooter",
    coverImage: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80",
    category: "Vehicles",
    seller: { name: "Ken Watanabe", photo: "https://ui-avatars.com/api/?name=Ken+Watanabe&background=475569&color=fff" },
    winner: { name: "Emily Carter", photo: "https://ui-avatars.com/api/?name=Emily+Carter&background=7c3aed&color=fff", email: "emily.carter@email.com" },
    finalPrice: 2150,
    commissionRate: 8,
    endDate: "2026-06-18",
    paymentStatus: "paid",
    paymentMethod: "SSLCommerz (Bank transfer)",
    transactionId: "SSLCZ-90218837",
    escrowStatus: "held",
    deliveryStatus: "delivered",
    carrier: "Self pickup",
    deliveredDate: "2026-06-22",
    payoutStatus: "on_hold",
    dispute: { reason: "Buyer reports odometer reading does not match listing description.", raisedBy: "buyer", date: "2026-06-23", status: "open" },
    auditTrail: [
      { id: "e1", type: "payment", detail: "Payment confirmed via bank transfer", admin: "System", date: "2026-06-18" },
      { id: "e2", type: "delivery", detail: "Buyer confirmed self pickup delivery", admin: "Admin Sara", date: "2026-06-22" },
      { id: "e3", type: "dispute", detail: "Dispute opened — odometer mismatch claim", admin: "Buyer", date: "2026-06-23" },
    ],
  },
  {
    _id: "ea6",
    title: "1965 Fender Stratocaster",
    coverImage: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&q=80",
    category: "Instruments",
    seller: { name: "Emily Carter", photo: "https://ui-avatars.com/api/?name=Emily+Carter&background=7c3aed&color=fff" },
    winner: { name: "Jordan Lee", photo: "https://ui-avatars.com/api/?name=Jordan+Lee&background=0d9488&color=fff", email: "jordan.lee@email.com" },
    finalPrice: 4550,
    commissionRate: 8,
    endDate: "2026-06-10",
    paymentStatus: "paid",
    paymentMethod: "SSLCommerz (Card)",
    transactionId: "SSLCZ-56231190",
    escrowStatus: "held",
    deliveryStatus: "in_transit",
    carrier: "FedEx International",
    trackingNumber: "FX-88012738",
    shippedDate: "2026-06-12",
    payoutStatus: "on_hold",
    auditTrail: [
      { id: "e1", type: "payment", detail: "Payment confirmed via SSLCommerz", admin: "System", date: "2026-06-10" },
      { id: "e2", type: "delivery", detail: "Shipped via FedEx International · FX-88012738", admin: "Admin Sara", date: "2026-06-12" },
    ],
  },
  {
    _id: "ea7",
    title: "Rare Vinyl Record Collection",
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    category: "Collectibles",
    seller: { name: "Noah Kim", photo: "https://ui-avatars.com/api/?name=Noah+Kim&background=0369a1&color=fff" },
    winner: { name: "Sofia Diaz", photo: "https://ui-avatars.com/api/?name=Sofia+Diaz&background=be185d&color=fff", email: "sofia.diaz@email.com" },
    finalPrice: 380,
    commissionRate: 10,
    endDate: "2026-06-05",
    paymentStatus: "refunded",
    paymentMethod: "SSLCommerz (bKash)",
    transactionId: "SSLCZ-33920172",
    escrowStatus: "refunded",
    deliveryStatus: "returned",
    payoutStatus: "on_hold",
    dispute: { reason: "Several records arrived cracked; buyer requested a full refund.", raisedBy: "buyer", date: "2026-06-08", status: "resolved", resolution: "Refunded buyer in full after seller confirmed damage in transit; return shipment received." },
    auditTrail: [
      { id: "e1", type: "payment", detail: "Payment confirmed via SSLCommerz", admin: "System", date: "2026-06-05" },
      { id: "e2", type: "dispute", detail: "Dispute opened — items damaged in transit", admin: "Buyer", date: "2026-06-08" },
      { id: "e3", type: "dispute", detail: "Resolved — full refund issued to buyer", admin: "Admin Rafiq", date: "2026-06-10" },
      { id: "e4", type: "escrow", detail: "Escrow refunded to buyer", admin: "Admin Rafiq", date: "2026-06-10" },
    ],
  },
];

// ─── Config ────────────────────────────────────────────────────────────────

const PAYMENT_CFG: Record<PaymentStatus, { label: string; color: string }> = {
  pending: { label: "Payment Pending", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  paid: { label: "Paid", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  failed: { label: "Payment Failed", color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
  refunded: { label: "Refunded", color: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
};

const DELIVERY_CFG: Record<DeliveryStatus, { label: string; icon: React.JSX.Element; color: string }> = {
  awaiting_shipment: { label: "Awaiting Shipment", icon: <Clock3 className="w-3.5 h-3.5" />, color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  shipped: { label: "Shipped", icon: <Truck className="w-3.5 h-3.5" />, color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
  in_transit: { label: "In Transit", icon: <Truck className="w-3.5 h-3.5" />, color: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
  delivered: { label: "Delivered", icon: <PackageCheck className="w-3.5 h-3.5" />, color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  returned: { label: "Returned", icon: <PackageX className="w-3.5 h-3.5" />, color: "bg-rose-500/15 text-rose-400 border-rose-500/20" },
};

const ESCROW_CFG: Record<EscrowStatus, { label: string; icon: React.JSX.Element; color: string }> = {
  held: { label: "Held in Escrow", icon: <Lock className="w-3.5 h-3.5" />, color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  released: { label: "Released", icon: <Unlock className="w-3.5 h-3.5" />, color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  refunded: { label: "Refunded", icon: <RotateCcw className="w-3.5 h-3.5" />, color: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
};

const PAYOUT_CFG: Record<PayoutStatus, { label: string; color: string }> = {
  on_hold: { label: "On Hold", color: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
  pending: { label: "Pending Release", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  released: { label: "Released", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
};

const AUDIT_ICON: Record<EndedAuditEntry["type"], React.JSX.Element> = {
  payment: <CreditCard className="w-3.5 h-3.5" />,
  escrow: <Lock className="w-3.5 h-3.5" />,
  delivery: <Truck className="w-3.5 h-3.5" />,
  payout: <Wallet className="w-3.5 h-3.5" />,
  dispute: <AlertOctagon className="w-3.5 h-3.5" />,
};

const PAGE_SIZE = 5;
const TABS = [
  { key: "all", label: "All Completed" },
  { key: "payment_pending", label: "Awaiting Payment" },
  { key: "in_delivery", label: "Shipping & Delivery" },
  { key: "delivered", label: "Delivered" },
  { key: "disputed", label: "Disputed" },
  { key: "refunded", label: "Refunded" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

// ─── Component ─────────────────────────────────────────────────────────────

export default function EndedAuctionManagementPage() {
  const { isDarkMode } = useTheme();

  const [orders, setOrders] = useState<EndedAuction[]>(MOCK_ENDED);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shipCarrier, setShipCarrier] = useState("");
  const [shipTracking, setShipTracking] = useState("");
  const [showShipForm, setShowShipForm] = useState(false);
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeRaisedBy, setDisputeRaisedBy] = useState<"buyer" | "seller">("buyer");
  const [resolutionNote, setResolutionNote] = useState("");
  const [showResolveForm, setShowResolveForm] = useState<"refund" | "release" | null>(null);

  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const divider = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const panel = isDarkMode ? "bg-slate-700/40" : "bg-slate-50";
  const inputCls = `w-full px-3 py-2 text-sm rounded-xl border outline-none transition-all ${
    isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
  }`;

  const selected = useMemo(() => orders.find(o => o._id === selectedId) || null, [orders, selectedId]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, activeTab]);

  const tabCounts = {
    payment_pending: orders.filter(o => o.paymentStatus === "pending").length,
    in_delivery: orders.filter(o => o.deliveryStatus === "shipped" || o.deliveryStatus === "in_transit" || o.deliveryStatus === "awaiting_shipment").length,
    delivered: orders.filter(o => o.deliveryStatus === "delivered").length,
    disputed: orders.filter(o => o.dispute && o.dispute.status === "open").length,
    refunded: orders.filter(o => o.paymentStatus === "refunded").length,
  };

  const filtered = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.title.toLowerCase().includes(searchQuery.toLowerCase()) || o.seller.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.winner.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab =
        activeTab === "all" ? true :
        activeTab === "payment_pending" ? o.paymentStatus === "pending" :
        activeTab === "in_delivery" ? ["shipped", "in_transit", "awaiting_shipment"].includes(o.deliveryStatus) :
        activeTab === "delivered" ? o.deliveryStatus === "delivered" :
        activeTab === "disputed" ? !!o.dispute && o.dispute.status === "open" :
        activeTab === "refunded" ? o.paymentStatus === "refunded" : true;
      return matchesSearch && matchesTab;
    });
  }, [orders, searchQuery, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const gmv = orders.reduce((sum, o) => sum + o.finalPrice, 0);

  const stats = [
    { label: "Completed Auctions", value: orders.length, icon: <PackageCheck className="w-4 h-4" />, color: "text-violet-400", bg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50", bar: "from-violet-500 to-blue-500" },
    { label: "Escrow Held", value: orders.filter(o => o.escrowStatus === "held").length, icon: <Lock className="w-4 h-4" />, color: "text-amber-400", bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50", bar: "from-amber-500 to-orange-500" },
    { label: "Open Disputes", value: tabCounts.disputed, icon: <AlertOctagon className="w-4 h-4" />, color: "text-rose-400", bg: isDarkMode ? "bg-rose-500/10" : "bg-rose-50", bar: "from-rose-500 to-pink-500" },
    { label: "GMV (completed)", value: `$${gmv.toLocaleString()}`, icon: <Wallet className="w-4 h-4" />, color: "text-emerald-400", bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50", bar: "from-emerald-500 to-teal-500" },
  ];

  // ── helpers ──────────────────────────────────────────────────────────────
  const today = () => new Date().toISOString().slice(0, 10);
  const addAudit = (id: string, entry: Omit<EndedAuditEntry, "id">) => {
    setOrders(prev => prev.map(o => o._id === id ? { ...o, auditTrail: [{ ...entry, id: `e-${Date.now()}` }, ...o.auditTrail] } : o));
  };
  const openModal = (o: EndedAuction) => {
    setSelectedId(o._id);
    setShowShipForm(false); setShipCarrier(""); setShipTracking("");
    setShowDisputeForm(false); setDisputeReason(""); setDisputeRaisedBy("buyer");
    setShowResolveForm(null); setResolutionNote("");
  };
  const closeModal = () => setSelectedId(null);

  // ── payment ──────────────────────────────────────────────────────────────
  const confirmPayment = (o: EndedAuction) => {
    setOrders(prev => prev.map(x => x._id === o._id ? { ...x, paymentStatus: "paid", transactionId: `SSLCZ-${Math.floor(10000000 + Math.random() * 89999999)}` } : x));
    addAudit(o._id, { type: "payment", detail: "Payment manually confirmed by admin", admin: "You", date: today() });
    toast.success(`Payment confirmed for "${o.title}"`);
  };

  const markPaymentFailed = (o: EndedAuction) => {
    setOrders(prev => prev.map(x => x._id === o._id ? { ...x, paymentStatus: "failed" } : x));
    addAudit(o._id, { type: "payment", detail: "Payment marked as failed", admin: "You", date: today() });
    toast.error(`Payment marked failed for "${o.title}"`);
  };

  // ── escrow ───────────────────────────────────────────────────────────────
  const releaseEscrow = (o: EndedAuction) => {
    setOrders(prev => prev.map(x => x._id === o._id ? { ...x, escrowStatus: "released", payoutStatus: "pending" } : x));
    addAudit(o._id, { type: "escrow", detail: "Escrow released to seller, payout queued", admin: "You", date: today() });
    toast.success(`Escrow released for "${o.title}"`);
  };

  const refundEscrow = (o: EndedAuction) => {
    setOrders(prev => prev.map(x => x._id === o._id ? { ...x, escrowStatus: "refunded", paymentStatus: "refunded" } : x));
    addAudit(o._id, { type: "escrow", detail: "Escrow refunded to buyer", admin: "You", date: today() });
    toast.success(`Escrow refunded to buyer for "${o.title}"`);
  };

  // ── delivery ─────────────────────────────────────────────────────────────
  const markShipped = (o: EndedAuction) => {
    if (!shipCarrier.trim() || !shipTracking.trim()) { toast.error("Carrier and tracking number are required"); return; }
    setOrders(prev => prev.map(x => x._id === o._id ? { ...x, deliveryStatus: "shipped", carrier: shipCarrier.trim(), trackingNumber: shipTracking.trim(), shippedDate: today() } : x));
    addAudit(o._id, { type: "delivery", detail: `Marked shipped via ${shipCarrier.trim()} · ${shipTracking.trim()}`, admin: "You", date: today() });
    toast.success(`"${o.title}" marked as shipped`);
    setShowShipForm(false); setShipCarrier(""); setShipTracking("");
  };

  const markInTransit = (o: EndedAuction) => {
    setOrders(prev => prev.map(x => x._id === o._id ? { ...x, deliveryStatus: "in_transit" } : x));
    addAudit(o._id, { type: "delivery", detail: "Marked in transit", admin: "You", date: today() });
    toast.success(`"${o.title}" marked in transit`);
  };

  const markDelivered = (o: EndedAuction) => {
    setOrders(prev => prev.map(x => x._id === o._id ? { ...x, deliveryStatus: "delivered", deliveredDate: today() } : x));
    addAudit(o._id, { type: "delivery", detail: "Marked delivered, confirmed with buyer", admin: "You", date: today() });
    toast.success(`"${o.title}" marked delivered`);
  };

  const markReturned = (o: EndedAuction) => {
    setOrders(prev => prev.map(x => x._id === o._id ? { ...x, deliveryStatus: "returned" } : x));
    addAudit(o._id, { type: "delivery", detail: "Marked returned to seller", admin: "You", date: today() });
    toast.error(`"${o.title}" marked returned`);
  };

  // ── payout ───────────────────────────────────────────────────────────────
  const releasePayout = (o: EndedAuction) => {
    setOrders(prev => prev.map(x => x._id === o._id ? { ...x, payoutStatus: "released" } : x));
    addAudit(o._id, { type: "payout", detail: `Payout of $${(o.finalPrice * (1 - o.commissionRate / 100)).toFixed(0)} released to seller`, admin: "You", date: today() });
    toast.success(`Payout released for "${o.title}"`);
  };

  const holdPayout = (o: EndedAuction) => {
    setOrders(prev => prev.map(x => x._id === o._id ? { ...x, payoutStatus: "on_hold" } : x));
    addAudit(o._id, { type: "payout", detail: "Payout placed on hold", admin: "You", date: today() });
    toast.error(`Payout put on hold for "${o.title}"`);
  };

  // ── disputes ─────────────────────────────────────────────────────────────
  const openDispute = (o: EndedAuction) => {
    if (!disputeReason.trim()) { toast.error("Please describe the dispute"); return; }
    setOrders(prev => prev.map(x => x._id === o._id ? { ...x, dispute: { reason: disputeReason.trim(), raisedBy: disputeRaisedBy, date: today(), status: "open" } } : x));
    addAudit(o._id, { type: "dispute", detail: `Dispute opened by ${disputeRaisedBy} — ${disputeReason.trim()}`, admin: "You", date: today() });
    toast.error(`Dispute opened for "${o.title}"`);
    setShowDisputeForm(false); setDisputeReason("");
  };

  const resolveDispute = (o: EndedAuction, outcome: "refund" | "release") => {
    if (!resolutionNote.trim()) { toast.error("Please add a resolution note"); return; }
    setOrders(prev => prev.map(x => x._id === o._id ? {
      ...x,
      dispute: x.dispute ? { ...x.dispute, status: "resolved", resolution: resolutionNote.trim() } : x.dispute,
      escrowStatus: outcome === "refund" ? "refunded" : "released",
      paymentStatus: outcome === "refund" ? "refunded" : x.paymentStatus,
      payoutStatus: outcome === "release" ? "pending" : x.payoutStatus,
    } : x));
    addAudit(o._id, { type: "dispute", detail: `Resolved — ${outcome === "refund" ? "refunded buyer" : "released to seller"} — ${resolutionNote.trim()}`, admin: "You", date: today() });
    toast.success(`Dispute resolved for "${o.title}"`);
    setShowResolveForm(null); setResolutionNote("");
  };

  // ── Pagination ───────────────────────────────────────────────────────────
  const Pagination = () => (
    <div className={`flex items-center justify-between px-5 py-4 border-t ${divider}`}>
      <p className={`text-xs ${muted}`}>Showing {filtered.length === 0 ? 0 : (pageSafe - 1) * PAGE_SIZE + 1}–{Math.min(pageSafe * PAGE_SIZE, filtered.length)} of {filtered.length}</p>
      <div className="flex items-center gap-1.5">
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={pageSafe === 1} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}><ChevronLeft className="w-4 h-4" /></button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 rounded-lg text-xs font-medium ${p === pageSafe ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-700" : "text-slate-600 hover:bg-slate-100"}`}>{p}</button>
        ))}
        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={pageSafe === totalPages} className={`w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 ${isDarkMode ? "hover:bg-slate-700 text-slate-300" : "hover:bg-slate-100 text-slate-600"}`}><ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );

  const commissionAmount = selected ? Math.round(selected.finalPrice * (selected.commissionRate / 100)) : 0;
  const sellerPayout = selected ? selected.finalPrice - commissionAmount : 0;

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px", borderRadius: "10px", background: isDarkMode ? "#1e293b" : "#fff", color: isDarkMode ? "#f1f5f9" : "#0f172a", border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0" } }} />

      {/* Header */}
      <div className={`sticky top-0 z-20 border-b backdrop-blur-xl ${isDarkMode ? "bg-slate-900/80 border-slate-700" : "bg-white/80 border-slate-200"}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-xl font-bold tracking-tight">Ended Auction Management</h1>
              <p className={`text-xs mt-0.5 ${muted}`}>Oversee payment, escrow, delivery and dispute resolution for completed auctions</p>
            </div>
            <div className={`relative w-full sm:w-80 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
              <input type="text" placeholder="Search title, seller or winner..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-8 py-2 text-sm rounded-xl border outline-none transition-all ${isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"}`} />
              {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-3.5 h-3.5" /></button>}
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
                <div><p className={`text-xs font-medium mb-2 ${muted}`}>{s.label}</p><p className={`font-semibold text-2xl ${strong}`}>{s.value}</p></div>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${s.bg}`}><span className={s.color}>{s.icon}</span></div>
              </div>
              <div className={`h-0.5 bg-gradient-to-r ${s.bar}`} />
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200" : "text-slate-600 hover:bg-slate-100"}`}>
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${activeTab === tab.key ? "bg-white/20" : isDarkMode ? "bg-slate-700" : "bg-slate-200"}`}>{tab.key === "all" ? orders.length : (tabCounts as any)[tab.key] || 0}</span>
            </button>
          ))}
        </div>

        {/* List */}
        <div className={`rounded-2xl border ${surface}`}>
          {paginated.length > 0 ? (
            <div className="divide-y divide-slate-700/40">
              {paginated.map((o, i) => (
                <motion.div key={o._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={`flex flex-col md:flex-row md:items-center gap-3 md:gap-4 px-5 py-4 ${isDarkMode ? "hover:bg-slate-700/30" : "hover:bg-slate-50"} transition-colors`}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img src={o.coverImage} alt={o.title} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${strong}`}>{o.title}</p>
                      <p className={`text-xs truncate ${muted}`}>{o.seller.name} → {o.winner.name} · ${o.finalPrice}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${PAYMENT_CFG[o.paymentStatus].color}`}>{PAYMENT_CFG[o.paymentStatus].label}</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${DELIVERY_CFG[o.deliveryStatus].color}`}>{DELIVERY_CFG[o.deliveryStatus].icon} {DELIVERY_CFG[o.deliveryStatus].label}</span>
                    {o.dispute && o.dispute.status === "open" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border bg-rose-500/15 text-rose-400 border-rose-500/20"><AlertOctagon className="w-3 h-3" /> Disputed</span>
                    )}
                  </div>

                  <div className={`hidden lg:block text-xs ${muted} w-32 shrink-0`}>
                    <p>Ended {o.endDate}</p>
                    <p>Escrow: {ESCROW_CFG[o.escrowStatus].label}</p>
                  </div>

                  <button onClick={() => openModal(o)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors shrink-0">
                    <Eye className="w-3.5 h-3.5" /> Review
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-16 text-center">
              <PackageCheck className={`w-12 h-12 mx-auto mb-4 ${muted}`} />
              <p className={`text-lg font-medium ${strong}`}>No completed auctions found</p>
              <p className={muted}>Try adjusting your search or filters</p>
            </div>
          )}
          {filtered.length > 0 && <Pagination />}
        </div>
      </div>

      {/* ── Detail modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={closeModal}>
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.98 }} className={`w-full max-w-3xl rounded-2xl ${surface} max-h-[92vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
              <div className={`p-6 border-b flex items-center justify-between sticky top-0 z-10 ${surface} ${divider}`}>
                <div className="flex items-center gap-4 min-w-0">
                  <img src={selected.coverImage} alt={selected.title} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                  <div className="min-w-0">
                    <h3 className={`text-lg font-semibold truncate ${strong}`}>{selected.title}</h3>
                    <p className={`text-sm ${muted}`}>{selected.seller.name} → {selected.winner.name}</p>
                  </div>
                </div>
                <button onClick={closeModal} className={`p-2 rounded-lg ${muted}`}><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 space-y-7">
                {/* Financial overview */}
                <div className={`rounded-2xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm ${panel}`}>
                  <div><p className={muted}>Final price</p><p className={strong}>${selected.finalPrice}</p></div>
                  <div><p className={muted}>Commission ({selected.commissionRate}%)</p><p className={strong}>${commissionAmount}</p></div>
                  <div><p className={muted}>Seller payout</p><p className={strong}>${sellerPayout}</p></div>
                  <div><p className={muted}>Ended</p><p className={strong}>{selected.endDate}</p></div>
                </div>

                {/* Payment & escrow */}
                <div className={`rounded-2xl p-5 space-y-3 ${panel}`}>
                  <p className={`text-sm font-semibold flex items-center gap-2 ${strong}`}><CreditCard className="w-4 h-4" /> Payment & escrow</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><p className={muted}>Status</p><span className={`inline-flex mt-1 items-center px-2.5 py-1 rounded-full text-xs font-medium border ${PAYMENT_CFG[selected.paymentStatus].color}`}>{PAYMENT_CFG[selected.paymentStatus].label}</span></div>
                    <div><p className={muted}>Method</p><p className={strong}>{selected.paymentMethod}</p></div>
                    <div><p className={muted}>Transaction ID</p><p className={`${strong} break-all`}>{selected.transactionId}</p></div>
                    <div><p className={muted}>Escrow</p><span className={`inline-flex mt-1 items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${ESCROW_CFG[selected.escrowStatus].color}`}>{ESCROW_CFG[selected.escrowStatus].icon} {ESCROW_CFG[selected.escrowStatus].label}</span></div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {selected.paymentStatus === "pending" && (
                      <>
                        <button onClick={() => confirmPayment(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white"><CheckCircle2 className="w-3.5 h-3.5" /> Confirm payment received</button>
                        <button onClick={() => markPaymentFailed(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white"><XCircle className="w-3.5 h-3.5" /> Mark failed</button>
                      </>
                    )}
                    {selected.escrowStatus === "held" && (
                      <>
                        <button onClick={() => releaseEscrow(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white"><Unlock className="w-3.5 h-3.5" /> Release escrow to seller</button>
                        <button onClick={() => refundEscrow(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white"><RotateCcw className="w-3.5 h-3.5" /> Refund to buyer</button>
                      </>
                    )}
                  </div>
                </div>

                {/* Delivery */}
                <div className={`rounded-2xl p-5 space-y-3 ${panel}`}>
                  <p className={`text-sm font-semibold flex items-center gap-2 ${strong}`}><Truck className="w-4 h-4" /> Delivery</p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${DELIVERY_CFG[selected.deliveryStatus].color}`}>{DELIVERY_CFG[selected.deliveryStatus].icon} {DELIVERY_CFG[selected.deliveryStatus].label}</span>
                  </div>
                  {(selected.carrier || selected.trackingNumber) && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2"><MapPinned className="w-3.5 h-3.5 opacity-60" /><span className={strong}>{selected.carrier}</span></div>
                      <div><p className={muted}>Tracking</p><p className={strong}>{selected.trackingNumber || "—"}</p></div>
                      {selected.shippedDate && <div><p className={muted}>Shipped</p><p className={strong}>{selected.shippedDate}</p></div>}
                      {selected.deliveredDate && <div><p className={muted}>Delivered</p><p className={strong}>{selected.deliveredDate}</p></div>}
                    </div>
                  )}

                  {selected.deliveryStatus === "awaiting_shipment" && !showShipForm && (
                    <button onClick={() => setShowShipForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-500 hover:bg-sky-600 text-white"><Truck className="w-3.5 h-3.5" /> Mark shipped</button>
                  )}
                  {selected.deliveryStatus === "awaiting_shipment" && showShipForm && (
                    <div className="space-y-2">
                      <input value={shipCarrier} onChange={e => setShipCarrier(e.target.value)} placeholder="Carrier (e.g. Pathao Courier)" className={inputCls} />
                      <input value={shipTracking} onChange={e => setShipTracking(e.target.value)} placeholder="Tracking number" className={inputCls} />
                      <div className="flex gap-2">
                        <button onClick={() => markShipped(selected)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-500 hover:bg-sky-600 text-white">Confirm</button>
                        <button onClick={() => setShowShipForm(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                      </div>
                    </div>
                  )}
                  {selected.deliveryStatus === "shipped" && (
                    <div className="flex gap-2">
                      <button onClick={() => markInTransit(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-500 hover:bg-sky-600 text-white"><Truck className="w-3.5 h-3.5" /> Mark in transit</button>
                      <button onClick={() => markDelivered(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white"><PackageCheck className="w-3.5 h-3.5" /> Mark delivered</button>
                    </div>
                  )}
                  {selected.deliveryStatus === "in_transit" && (
                    <div className="flex gap-2">
                      <button onClick={() => markDelivered(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white"><PackageCheck className="w-3.5 h-3.5" /> Mark delivered</button>
                      <button onClick={() => markReturned(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white"><PackageX className="w-3.5 h-3.5" /> Mark returned</button>
                    </div>
                  )}
                </div>

                {/* Payout */}
                <div className={`rounded-2xl p-5 space-y-3 ${panel}`}>
                  <p className={`text-sm font-semibold flex items-center gap-2 ${strong}`}><Wallet className="w-4 h-4" /> Seller payout</p>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${PAYOUT_CFG[selected.payoutStatus].color}`}>{PAYOUT_CFG[selected.payoutStatus].label}</span>
                    <span className={`text-sm ${strong}`}>${sellerPayout}</span>
                  </div>
                  <div className="flex gap-2">
                    {selected.payoutStatus !== "released" && selected.escrowStatus === "released" && (
                      <button onClick={() => releasePayout(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white"><Unlock className="w-3.5 h-3.5" /> Release payout</button>
                    )}
                    {selected.payoutStatus === "released" && (
                      <button onClick={() => holdPayout(selected)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-600 hover:bg-slate-700 text-white"><Lock className="w-3.5 h-3.5" /> Put on hold</button>
                    )}
                  </div>
                </div>

                {/* Dispute */}
                <div className={`rounded-2xl p-5 space-y-3 ${panel}`}>
                  <p className={`text-sm font-semibold flex items-center gap-2 ${strong}`}><AlertOctagon className="w-4 h-4" /> Dispute resolution</p>

                  {selected.dispute ? (
                    <div className="space-y-3">
                      <div className={`rounded-xl p-3 text-sm ${isDarkMode ? "bg-rose-500/10" : "bg-rose-50"}`}>
                        <p className={`font-medium ${selected.dispute.status === "open" ? "text-rose-500" : "text-emerald-500"}`}>{selected.dispute.status === "open" ? "Open dispute" : "Resolved"}</p>
                        <p className={muted}>Raised by {selected.dispute.raisedBy} · {selected.dispute.date}</p>
                        <p className={`mt-1 ${strong}`}>{selected.dispute.reason}</p>
                        {selected.dispute.resolution && <p className={`mt-2 text-xs ${muted}`}>Resolution: {selected.dispute.resolution}</p>}
                      </div>

                      {selected.dispute.status === "open" && (
                        showResolveForm ? (
                          <div className="space-y-2">
                            <textarea value={resolutionNote} onChange={e => setResolutionNote(e.target.value)} rows={2} placeholder="Resolution notes..." className={inputCls} />
                            <div className="flex gap-2">
                              <button onClick={() => resolveDispute(selected, showResolveForm)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white">
                                Confirm {showResolveForm === "refund" ? "refund to buyer" : "release to seller"}
                              </button>
                              <button onClick={() => setShowResolveForm(null)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button onClick={() => setShowResolveForm("refund")} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white">Resolve — refund buyer</button>
                            <button onClick={() => setShowResolveForm("release")} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white">Resolve — release to seller</button>
                          </div>
                        )
                      )}
                    </div>
                  ) : !showDisputeForm ? (
                    <button onClick={() => setShowDisputeForm(true)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}><AlertOctagon className="w-3.5 h-3.5" /> Open dispute / flag for investigation</button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button onClick={() => setDisputeRaisedBy("buyer")} className={`flex-1 py-2 rounded-lg text-xs font-medium border ${disputeRaisedBy === "buyer" ? "bg-violet-500/15 text-violet-400 border-violet-500/30" : isDarkMode ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"}`}>Raised by buyer</button>
                        <button onClick={() => setDisputeRaisedBy("seller")} className={`flex-1 py-2 rounded-lg text-xs font-medium border ${disputeRaisedBy === "seller" ? "bg-violet-500/15 text-violet-400 border-violet-500/30" : isDarkMode ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"}`}>Raised by seller</button>
                      </div>
                      <textarea value={disputeReason} onChange={e => setDisputeReason(e.target.value)} rows={2} placeholder="Describe the issue..." className={inputCls} />
                      <div className="flex gap-2">
                        <button onClick={() => openDispute(selected)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white">Open dispute</button>
                        <button onClick={() => setShowDisputeForm(false)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Audit trail */}
                <div className="space-y-3">
                  <p className={`text-sm font-semibold flex items-center gap-2 ${strong}`}><History className="w-4 h-4" /> Audit trail</p>
                  <div className="space-y-2">
                    {selected.auditTrail.map(entry => (
                      <div key={entry.id} className={`flex items-start gap-3 px-3 py-2.5 rounded-xl ${panel}`}>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isDarkMode ? "bg-slate-800" : "bg-white"}`}>{AUDIT_ICON[entry.type]}</div>
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
    </div>
  );
}