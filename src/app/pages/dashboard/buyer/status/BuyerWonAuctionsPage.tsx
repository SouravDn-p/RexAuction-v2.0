import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  Trophy,
  ArrowLeft,
  CreditCard,
  Package,
  Truck,
  CheckCircle2,
  MapPin,
  FileText,
  Copy,
  AlertCircle,
  Clock,
  ChevronRight,
  Shield,
  RefreshCw,
  Star,
  ExternalLink,
  Gavel,
} from "lucide-react";
import {
  MOCK_BUYER_AUCTIONS,
  type BuyerAuction,
  type DeliveryStatus,
  type PaymentStatus,
} from "../../../../../data/Buyerauctiondata";
import { useTheme } from "../../../../../hooks/useTheme";
import { MOCK_USER } from "../../../../../data/MOCK_USER";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => "$" + n.toLocaleString("en-US");
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

// ─── Delivery timeline steps ──────────────────────────────────────────────────
const DELIVERY_STEPS: { key: DeliveryStatus; label: string; sub: string; icon: React.ReactNode }[] = [
  { key: "awaiting", label: "Payment Received", sub: "Seller notified", icon: <CreditCard className="w-4 h-4" /> },
  { key: "preparing", label: "Preparing Item", sub: "Packaging in progress", icon: <Package className="w-4 h-4" /> },
  { key: "shipped", label: "Shipped", sub: "Handed to courier", icon: <Truck className="w-4 h-4" /> },
  { key: "in_transit", label: "In Transit", sub: "On its way to you", icon: <Truck className="w-4 h-4" /> },
  { key: "delivered", label: "Delivered", sub: "Successfully received", icon: <CheckCircle2 className="w-4 h-4" /> },
];

const DELIVERY_ORDER: DeliveryStatus[] = [
  "awaiting", "preparing", "shipped", "in_transit", "delivered",
];

const stepIndex = (s: DeliveryStatus) => DELIVERY_ORDER.indexOf(s);

// ─── Payment step config ──────────────────────────────────────────────────────
const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Payment Pending", color: "text-amber-400", icon: <Clock className="w-4 h-4" /> },
  processing: { label: "Processing", color: "text-blue-400", icon: <RefreshCw className="w-4 h-4" /> },
  paid: { label: "Paid", color: "text-emerald-400", icon: <CheckCircle2 className="w-4 h-4" /> },
  failed: { label: "Payment Failed", color: "text-rose-400", icon: <AlertCircle className="w-4 h-4" /> },
};

// ─── Won Auction List (when no ID in URL) ─────────────────────────────────────
function WonAuctionsList({ isDarkMode }: { isDarkMode: boolean }) {
  const won = MOCK_BUYER_AUCTIONS.filter((a) => a.status === "won");
  const subtext = isDarkMode ? "text-gray-400" : "text-gray-500";
  const surface = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100";

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-slate-50 text-gray-900"}`}>
      {/* Header */}
      <div className={`border-b ${isDarkMode ? "border-gray-800 bg-gray-900/80" : "border-gray-200 bg-white/80"} backdrop-blur-xl sticky top-0 z-10`}>
        <div className="px-4 sm:px-8 py-5 flex items-center gap-4">
          <Link to="/buyer" className={`p-2 rounded-xl transition-colors ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> Won Auctions
            </h1>
            <p className={`text-xs ${subtext}`}>{won.length} items — manage payments & deliveries</p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-4">
        {won.map((a, i) => {
          const paymentCfg = PAYMENT_CONFIG[a.paymentStatus ?? "pending"];
          const delivIdx = stepIndex(a.deliveryStatus ?? "awaiting");

          return (
            <motion.div
              key={a._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`rounded-2xl border overflow-hidden ${surface} shadow-sm`}
            >
              <div className="flex flex-col sm:flex-row gap-4 p-4">
                {/* Image */}
                <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={a.image} alt={a.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-sm leading-tight">{a.name}</h3>
                    <span className="text-amber-400 font-bold text-sm whitespace-nowrap">{fmt(a.myBid)}</span>
                  </div>

                  <p className={`text-xs mb-3 ${subtext}`}>
                    Won {fmtDate(a.endTime)} · Invoice {a.invoiceId ?? "—"}
                  </p>

                  {/* Payment & delivery status row */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${a.paymentStatus === "paid" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : a.paymentStatus === "failed" ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>
                      {paymentCfg.icon} {paymentCfg.label}
                    </span>

                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${a.deliveryStatus === "delivered" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                      }`}>
                      <Truck className="w-3 h-3" />
                      {DELIVERY_STEPS[delivIdx]?.label ?? "—"}
                    </span>
                  </div>

                  {/* Mini progress bar */}
                  <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-700"
                      style={{ width: `${((delivIdx + 1) / DELIVERY_ORDER.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Manage link */}
              <Link
                to={`/${MOCK_USER.role}/won-auctions/${a._id}`}
                className={`flex items-center justify-center gap-1.5 py-3 text-xs font-semibold border-t transition-colors ${isDarkMode
                    ? "border-gray-700 hover:bg-gray-700/50 text-amber-400"
                    : "border-gray-100 hover:bg-amber-50 text-amber-600"
                  }`}
              >
                Manage Payment & Delivery <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Single Won Auction Detail ────────────────────────────────────────────────
function WonAuctionDetail({ auction: initial, isDarkMode }: { auction: BuyerAuction; isDarkMode: boolean }) {
  const [auction, setAuction] = useState<BuyerAuction>(initial);
  const [payBusy, setPayBusy] = useState(false);

  const subtext = isDarkMode ? "text-gray-400" : "text-gray-500";
  const surface = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100";
  const paymentCfg = PAYMENT_CONFIG[auction.paymentStatus ?? "pending"];
  const currentDelivIdx = stepIndex(auction.deliveryStatus ?? "awaiting");

  const handlePay = async () => {
    setPayBusy(true);
    await new Promise((r) => setTimeout(r, 1200));
    setAuction((prev) => ({ ...prev, paymentStatus: "paid", deliveryStatus: "awaiting" }));
    toast.success("Payment successful! Seller has been notified.");
    setPayBusy(false);
  };

  const copyTracking = () => {
    if (auction.trackingNumber) {
      navigator.clipboard.writeText(auction.trackingNumber);
      toast.success("Tracking number copied!");
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-slate-50 text-gray-900"}`}>
      <Toaster position="top-right" />

      {/* Header */}
      <div className={`border-b backdrop-blur-xl sticky top-0 z-10 ${isDarkMode ? "border-gray-800 bg-gray-900/80" : "border-gray-200 bg-white/80"}`}>
        <div className="px-4 sm:px-8 py-4 flex items-center gap-3">
          <Link to={`/${MOCK_USER.role}/won-auctions`} className={`p-2 rounded-xl transition-colors ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-bold truncate">{auction.name}</h1>
            <p className={`text-xs ${subtext}`}>Invoice {auction.invoiceId ?? "—"}</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/20 flex items-center gap-1">
            <Trophy className="w-3 h-3" /> Won
          </span>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-6 max-w-7xl mx-auto space-y-5">
        {/* ── Item overview card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border overflow-hidden ${surface} shadow-sm`}
        >
          <div className="flex flex-col sm:flex-row gap-0">
            <div className="sm:w-56 h-48 sm:h-auto flex-shrink-0">
              <img src={auction.image} alt={auction.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-5 flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="font-bold text-base leading-tight">{auction.name}</h2>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-medium">{auction.sellerRating}</span>
                </div>
              </div>

              <p className={`text-xs mb-4 leading-relaxed ${subtext}`}>{auction.description}</p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: "Winning Bid", value: fmt(auction.myBid), strong: true, color: "text-amber-400" },
                  { label: "Total Paid", value: fmt(auction.totalPaid ?? auction.myBid + Math.round(auction.myBid * 0.05)), strong: true },
                  { label: "Category", value: auction.category },
                  { label: "Condition", value: auction.condition },
                  { label: "Seller", value: auction.seller },
                  { label: "Ended", value: fmtDate(auction.endTime) },
                ].map(({ label, value, strong, color }) => (
                  <div key={label}>
                    <p className={`text-[10px] font-medium uppercase tracking-wide ${subtext}`}>{label}</p>
                    <p className={`text-sm font-${strong ? "bold" : "medium"} mt-0.5 ${color ?? ""}`}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Payment card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className={`rounded-2xl border ${surface} shadow-sm overflow-hidden`}
        >
          <div className={`px-5 py-4 border-b flex items-center justify-between ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-violet-400" />
              <h3 className="font-bold text-sm">Payment</h3>
            </div>
            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${auction.paymentStatus === "paid" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : auction.paymentStatus === "failed" ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}>
              {paymentCfg.icon} {paymentCfg.label}
            </span>
          </div>

          <div className="p-5">
            {/* Invoice summary */}
            <div className={`rounded-xl p-4 mb-4 space-y-2 ${isDarkMode ? "bg-gray-700/40" : "bg-slate-50"}`}>
              {[
                { label: "Hammer Price", value: fmt(auction.myBid) },
                { label: "Buyer's Premium (5%)", value: fmt(Math.round(auction.myBid * 0.05)) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className={subtext}>{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
              <div className={`pt-2 mt-2 border-t flex justify-between ${isDarkMode ? "border-gray-600" : "border-gray-200"}`}>
                <span className="font-bold text-sm">Total</span>
                <span className="font-bold text-sm text-amber-400">
                  {fmt(auction.totalPaid ?? auction.myBid + Math.round(auction.myBid * 0.05))}
                </span>
              </div>
            </div>

            {/* Pay button or confirmation */}
            {auction.paymentStatus === "pending" && (
              <div className="space-y-3">
                <div className={`flex items-start gap-2 p-3 rounded-xl text-xs ${isDarkMode ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-700"}`}>
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  Payment must be completed within 48 hours of winning. Failure to pay may result in account suspension.
                </div>
                <button
                  onClick={handlePay}
                  disabled={payBusy}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-600 text-black transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {payBusy ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Processing…</>
                  ) : (
                    <><CreditCard className="w-4 h-4" /> Pay {fmt(auction.totalPaid ?? auction.myBid + Math.round(auction.myBid * 0.05))}</>
                  )}
                </button>
                <div className={`flex items-center justify-center gap-1.5 text-xs ${subtext}`}>
                  <Shield className="w-3 h-3" /> Secured by Rex Auction Payment Protection
                </div>
              </div>
            )}

            {auction.paymentStatus === "paid" && (
              <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${isDarkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700"}`}>
                <CheckCircle2 className="w-4 h-4" />
                Payment confirmed — seller has been notified to ship your item.
              </div>
            )}

            {auction.paymentStatus === "failed" && (
              <div className="space-y-2">
                <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${isDarkMode ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-700"}`}>
                  <AlertCircle className="w-4 h-4" /> Payment failed. Please retry.
                </div>
                <button
                  onClick={handlePay}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-rose-500 hover:bg-rose-600 text-white transition"
                >
                  Retry Payment
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Delivery card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className={`rounded-2xl border ${surface} shadow-sm overflow-hidden`}
        >
          <div className={`px-5 py-4 border-b flex items-center justify-between ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-sky-400" />
              <h3 className="font-bold text-sm">Delivery</h3>
            </div>
            {auction.estimatedDelivery && (
              <span className={`text-xs ${subtext}`}>Est. {auction.estimatedDelivery}</span>
            )}
          </div>

          <div className="p-5">
            {/* Timeline */}
            <div className="space-y-0 mb-5">
              {DELIVERY_STEPS.map((step, i) => {
                const done = i <= currentDelivIdx;
                const active = i === currentDelivIdx;
                const isLast = i === DELIVERY_STEPS.length - 1;

                return (
                  <div key={step.key} className="flex gap-3">
                    {/* Spine */}
                    <div className="flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0.7 }}
                        animate={{ scale: 1 }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${done
                            ? active
                              ? "bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/30"
                              : "bg-emerald-500 border-emerald-500 text-white"
                            : isDarkMode
                              ? "bg-gray-700 border-gray-600 text-gray-500"
                              : "bg-white border-gray-200 text-gray-300"
                          }`}
                      >
                        {done && !active ? <CheckCircle2 className="w-4 h-4" /> : step.icon}
                      </motion.div>
                      {!isLast && (
                        <div className={`w-0.5 h-8 mt-1 rounded-full transition-colors ${done && !active ? "bg-emerald-500" : isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                      )}
                    </div>

                    {/* Label */}
                    <div className={`pb-6 ${isLast ? "pb-0" : ""} pt-1`}>
                      <p className={`text-sm font-semibold ${active ? "text-amber-400" : done ? "" : isDarkMode ? "text-gray-600" : "text-gray-300"}`}>
                        {step.label}
                        {active && <span className="ml-2 text-[10px] font-normal bg-amber-500/15 text-amber-400 px-1.5 py-0.5 rounded-full">Current</span>}
                      </p>
                      <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>{step.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tracking number */}
            {auction.trackingNumber && (
              <div className={`rounded-xl p-3 flex items-center justify-between gap-3 mb-4 ${isDarkMode ? "bg-gray-700/40" : "bg-slate-50"}`}>
                <div>
                  <p className={`text-[10px] font-semibold uppercase tracking-wide ${subtext}`}>Tracking Number</p>
                  <p className="text-sm font-mono font-bold mt-0.5">{auction.trackingNumber}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={copyTracking}
                    className={`p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                    title="Copy"
                  >
                    <Copy className={`w-3.5 h-3.5 ${subtext}`} />
                  </button>
                  <a
                    href={`https://www.dhl.com/en/express/tracking.html?AWB=${auction.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
                    title="Track"
                  >
                    <ExternalLink className={`w-3.5 h-3.5 ${subtext}`} />
                  </a>
                </div>
              </div>
            )}

            {/* Delivery address */}
            {auction.deliveryAddress && (
              <div className={`rounded-xl p-3 flex items-start gap-2 ${isDarkMode ? "bg-gray-700/40" : "bg-slate-50"}`}>
                <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${subtext}`} />
                <div>
                  <p className={`text-[10px] font-semibold uppercase tracking-wide ${subtext}`}>Delivery Address</p>
                  <p className="text-sm font-medium mt-0.5">{auction.deliveryAddress}</p>
                </div>
              </div>
            )}

            {/* Not paid yet — muted */}
            {auction.paymentStatus !== "paid" && (
              <div className={`mt-4 flex items-center gap-2 p-3 rounded-xl text-xs ${isDarkMode ? "bg-gray-700/40 text-gray-500" : "bg-gray-100 text-gray-400"}`}>
                <Clock className="w-3.5 h-3.5" />
                Delivery tracking will activate once payment is confirmed.
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Invoice download / contact ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl border ${surface} shadow-sm p-5`}
        >
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet-400" /> Documents & Support
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => toast.success("Invoice PDF downloaded!")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${isDarkMode ? "border-gray-600 hover:bg-gray-700 text-gray-300" : "border-gray-200 hover:bg-gray-50 text-gray-600"}`}
            >
              <FileText className="w-3.5 h-3.5" /> Download Invoice
            </button>
            <Link
              to="/dashboard/chat"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${isDarkMode ? "border-gray-600 hover:bg-gray-700 text-gray-300" : "border-gray-200 hover:bg-gray-50 text-gray-600"}`}
            >
              Contact Seller
            </Link>
            <Link
              to="/seller/manageAuctions"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-colors"
            >
              <Gavel className="w-3.5 h-3.5" /> All Auctions
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Router entry ─────────────────────────────────────────────────────────────
export default function WonAuctions() {
  const { id } = useParams<{ id?: string }>();
  const { isDarkMode } = useTheme();

  if (!id) return <WonAuctionsList isDarkMode={isDarkMode} />;

  const auction = MOCK_BUYER_AUCTIONS.find((a) => a._id === id && a.status === "won");

  if (!auction) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-slate-50"}`}>
        <div className="text-center">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="font-semibold">Auction not found</p>
          <Link to={`/${MOCK_USER.role}/won-auctions`} className="text-violet-500 text-sm mt-2 inline-block hover:underline">
            Back to Won Auctions
          </Link>
        </div>
      </div>
    );
  }

  return <WonAuctionDetail auction={auction} isDarkMode={isDarkMode} />;
}