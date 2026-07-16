import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  ExternalLink,
  FileText,
  Gavel,
  MapPin,
  MessageSquareWarning,
  Package,
  RefreshCw,
  ShieldCheck,
  Star,
  Tag,
  Truck,
  Trophy,
  X,
} from "lucide-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { type BuyerAuction, type DeliveryStatus, type PaymentStatus } from "../../../../../data/Buyerauctiondata";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const spring = { type: "spring" as const, stiffness: 120, damping: 20 };
const fmt = (n: number) => "$" + n.toLocaleString("en-US");
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const DELIVERY_STEPS: { key: DeliveryStatus; label: string; sub: string; icon: React.ReactNode }[] = [
  { key: "awaiting", label: "Payment Received", sub: "Held in escrow", icon: <CreditCard className="w-4 h-4" /> },
  { key: "preparing", label: "Preparing Item", sub: "Packaging in progress", icon: <Package className="w-4 h-4" /> },
  { key: "shipped", label: "Shipped", sub: "Handed to courier", icon: <Truck className="w-4 h-4" /> },
  { key: "in_transit", label: "In Transit", sub: "On its way to you", icon: <Truck className="w-4 h-4" /> },
  { key: "delivered", label: "Delivered", sub: "Confirm to release payout", icon: <CheckCircle2 className="w-4 h-4" /> },
];
const DELIVERY_ORDER: DeliveryStatus[] = ["awaiting", "preparing", "shipped", "in_transit", "delivered"];
const stepIndex = (s: DeliveryStatus) => DELIVERY_ORDER.indexOf(s);

const PAYMENT_CONFIG: Record<PaymentStatus, { label: string; icon: React.ReactNode }> = {
  pending: { label: "Payment Pending", icon: <Clock className="w-4 h-4" /> },
  processing: { label: "Processing", icon: <RefreshCw className="w-4 h-4" /> },
  paid: { label: "Paid", icon: <CheckCircle2 className="w-4 h-4" /> },
  failed: { label: "Payment Failed", icon: <AlertCircle className="w-4 h-4" /> },
};

const DISPUTE_REASONS = ["Item not as described", "Item not received", "Item arrived damaged", "Wrong item sent"];

export default function BuyerWonAuctionDetail({ auction: initial, isDarkMode }: { auction: BuyerAuction; isDarkMode: boolean }) {
  const [auction, setAuction] = useState<BuyerAuction>(initial);
  const [payBusy, setPayBusy] = useState(false);

  // Checkout
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  // Post-win state
  const [receiptConfirmed, setReceiptConfirmed] = useState(false);
  const [review, setReview] = useState<{ rating: number; text: string } | null>(null);
  const [dispute, setDispute] = useState<{ reason: string; desc: string } | null>(null);

  // Modals
  const [reviewOpen, setReviewOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  // ── Tokens ──
  const card = `rounded-2xl border ${isDarkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-slate-100 shadow-sm"}`;
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const div = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const soft = isDarkMode ? "bg-slate-700/40" : "bg-slate-50";

  const paymentCfg = PAYMENT_CONFIG[auction.paymentStatus ?? "pending"];
  const currentDelivIdx = stepIndex(auction.deliveryStatus ?? "awaiting");
  const premium = Math.round(auction.myBid * 0.05);
  const total = (auction.totalPaid ?? auction.myBid + premium) - discount;
  const isPaid = auction.paymentStatus === "paid";
  const isDelivered = auction.deliveryStatus === "delivered";
  const canCancel = isPaid && !isDelivered && (auction.deliveryStatus === "awaiting" || auction.deliveryStatus === "preparing") && !dispute;

  const handlePay = async () => {
    setPayBusy(true);
    await new Promise((r) => setTimeout(r, 1200));
    setAuction((prev) => ({ ...prev, paymentStatus: "paid", deliveryStatus: "awaiting" }));
    toast.success("Payment held in escrow — seller notified to ship");
    setPayBusy(false);
  };

  const applyCoupon = () => {
    if (!coupon.trim()) { toast.error("Enter a coupon code"); return; }
    setDiscount(50);
    toast.success(`Coupon "${coupon.toUpperCase()}" applied — $50 off`);
  };

  const copyTracking = () => {
    if (auction.trackingNumber) { navigator.clipboard.writeText(auction.trackingNumber); toast.success("Tracking number copied!"); }
  };

  const confirmReceipt = () => {
    setReceiptConfirmed(true);
    toast.success("Receipt confirmed — payout released to seller from escrow");
  };
  const cancelOrder = () => {
    setAuction((prev) => ({ ...prev, deliveryStatus: "awaiting", paymentStatus: "pending" }));
    setCancelOpen(false);
    toast.success("Order cancelled — refund issued to your wallet");
  };

  const statBadge = `inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${auction.paymentStatus === "paid" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : auction.paymentStatus === "failed" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"}`;
  const inputCls = `w-full px-3 py-2.5 text-sm rounded-xl border outline-none transition-all ${isDarkMode ? "bg-slate-900 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"}`;

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px", borderRadius: "10px", background: isDarkMode ? "#1e293b" : "#fff", color: isDarkMode ? "#f1f5f9" : "#0f172a", border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0" } }} />

      {/* Header */}
      <div className={`border-b backdrop-blur-xl sticky top-0 z-20 ${isDarkMode ? "border-slate-700/50 bg-slate-900/80" : "border-slate-100 bg-white/80"}`}>
        <div className="px-4 sm:px-8 py-4 flex items-center gap-3">
          <Link to="/buyer/won-auctions" className={`p-2 rounded-xl transition-colors ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}><ArrowLeft className="w-4 h-4" /></Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-bold truncate">{auction.name}</h1>
            <p className={`text-xs ${muted}`}>Invoice {auction.invoiceId ?? "—"}</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-500 border border-amber-500/20 flex items-center gap-1"><Trophy className="w-3 h-3" /> Won</span>
        </div>
      </div>

      <div className="px-4 sm:px-8 py-6 max-w-5xl mx-auto space-y-5">
        {/* Item overview */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${card} overflow-hidden`}>
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-56 h-48 sm:h-auto flex-shrink-0"><img src={auction.image} alt={auction.name} className="w-full h-full object-cover" /></div>
            <div className="p-5 flex-1">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="font-bold text-base leading-tight">{auction.name}</h2>
                <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /><span className="text-xs font-medium">{auction.sellerRating}</span></div>
              </div>
              <p className={`text-xs mb-4 leading-relaxed ${muted}`}>{auction.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: "Winning Bid", value: fmt(auction.myBid), color: "text-amber-500" },
                  { label: "Total Paid", value: fmt(auction.totalPaid ?? auction.myBid + premium) },
                  { label: "Category", value: auction.category },
                  { label: "Condition", value: auction.condition },
                  { label: "Seller", value: auction.seller },
                  { label: "Ended", value: fmtDate(auction.endTime) },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <p className={`text-[10px] font-medium uppercase tracking-wide ${muted}`}>{label}</p>
                    <p className={`text-sm font-semibold mt-0.5 ${color ?? ""}`}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment / Checkout */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className={`${card} overflow-hidden`}>
          <div className={`px-5 py-4 border-b flex items-center justify-between ${div}`}>
            <div className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-violet-500" /><h3 className="font-bold text-sm">Checkout & payment</h3></div>
            <span className={statBadge}>{paymentCfg.icon} {paymentCfg.label}</span>
          </div>
          <div className="p-5">
            <div className={`rounded-xl p-4 mb-4 space-y-2 ${soft}`}>
              <div className="flex justify-between text-sm"><span className={muted}>Hammer Price</span><span className="font-medium">{fmt(auction.myBid)}</span></div>
              <div className="flex justify-between text-sm"><span className={muted}>Buyer's Premium (5%)</span><span className="font-medium">{fmt(premium)}</span></div>
              {discount > 0 && <div className="flex justify-between text-sm text-emerald-500"><span>Coupon discount</span><span className="font-medium">−{fmt(discount)}</span></div>}
              <div className={`pt-2 mt-2 border-t flex justify-between ${isDarkMode ? "border-slate-600" : "border-slate-200"}`}>
                <span className="font-bold text-sm">Total</span><span className="font-bold text-sm text-amber-500">{fmt(total)}</span>
              </div>
            </div>

            {/* Coupon (pre-payment) */}
            {auction.paymentStatus === "pending" && (
              <div className="flex gap-2 mb-4">
                <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon code" className={inputCls} />
                <button onClick={applyCoupon} className={`px-4 rounded-xl text-sm font-semibold border shrink-0 transition-colors ${isDarkMode ? "border-slate-700 hover:bg-slate-700" : "border-slate-200 hover:bg-slate-100"}`}>Apply</button>
              </div>
            )}

            {auction.paymentStatus === "pending" && (
              <div className="space-y-3">
                <div className={`flex items-start gap-2 p-3 rounded-xl text-xs ${isDarkMode ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-700"}`}>
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> Payment must be completed within 48 hours. Funds are held in escrow until you confirm receipt.
                </div>
                <button onClick={handlePay} disabled={payBusy} className="w-full py-3 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-600 text-black transition disabled:opacity-60 flex items-center justify-center gap-2">
                  {payBusy ? <><RefreshCw className="w-4 h-4 animate-spin" /> Processing…</> : <><CreditCard className="w-4 h-4" /> Pay {fmt(total)} via SSLCommerz</>}
                </button>
                <div className={`flex items-center justify-center gap-1.5 text-xs ${muted}`}><ShieldCheck className="w-3 h-3" /> Secured by Rex Auction escrow protection</div>
              </div>
            )}
            {auction.paymentStatus === "paid" && (
              <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${isDarkMode ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700"}`}>
                <CheckCircle2 className="w-4 h-4" /> Paid via SSLCommerz — {receiptConfirmed ? "payout released to seller." : "funds held in escrow until you confirm receipt."}
              </div>
            )}
            {auction.paymentStatus === "failed" && (
              <button onClick={handlePay} className="w-full py-3 rounded-xl font-bold text-sm bg-rose-500 hover:bg-rose-600 text-white transition">Retry Payment</button>
            )}
          </div>
        </motion.div>

        {/* Delivery */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }} className={`${card} overflow-hidden`}>
          <div className={`px-5 py-4 border-b flex items-center justify-between ${div}`}>
            <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-sky-500" /><h3 className="font-bold text-sm">Track order & shipment</h3></div>
            {auction.estimatedDelivery && <span className={`text-xs ${muted}`}>Est. {auction.estimatedDelivery}</span>}
          </div>
          <div className="p-5">
            <div className="mb-5">
              {DELIVERY_STEPS.map((step, i) => {
                const done = i <= currentDelivIdx;
                const active = i === currentDelivIdx;
                const isLast = i === DELIVERY_STEPS.length - 1;
                return (
                  <div key={step.key} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${done ? active ? "bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/30" : "bg-emerald-500 border-emerald-500 text-white" : isDarkMode ? "bg-slate-700 border-slate-600 text-slate-500" : "bg-white border-slate-200 text-slate-300"}`}>
                        {done && !active ? <CheckCircle2 className="w-4 h-4" /> : step.icon}
                      </div>
                      {!isLast && <div className={`w-0.5 h-8 mt-1 rounded-full transition-colors ${done && !active ? "bg-emerald-500" : isDarkMode ? "bg-slate-700" : "bg-slate-200"}`} />}
                    </div>
                    <div className={`pb-6 ${isLast ? "pb-0" : ""} pt-1`}>
                      <p className={`text-sm font-semibold ${active ? "text-amber-500" : done ? "" : isDarkMode ? "text-slate-600" : "text-slate-300"}`}>
                        {step.label}{active && <span className="ml-2 text-[10px] font-normal bg-amber-500/15 text-amber-500 px-1.5 py-0.5 rounded-full">Current</span>}
                      </p>
                      <p className={`text-xs mt-0.5 ${muted}`}>{step.sub}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {auction.trackingNumber && (
              <div className={`rounded-xl p-3 flex items-center justify-between gap-3 mb-4 ${soft}`}>
                <div><p className={`text-[10px] font-semibold uppercase tracking-wide ${muted}`}>Tracking Number</p><p className="text-sm font-mono font-bold mt-0.5">{auction.trackingNumber}</p></div>
                <div className="flex gap-2">
                  <button onClick={copyTracking} className={`p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-slate-600" : "hover:bg-slate-200"}`} title="Copy"><Copy className={`w-3.5 h-3.5 ${muted}`} /></button>
                  <a href={`https://www.dhl.com/en/express/tracking.html?AWB=${auction.trackingNumber}`} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-slate-600" : "hover:bg-slate-200"}`} title="Track"><ExternalLink className={`w-3.5 h-3.5 ${muted}`} /></a>
                </div>
              </div>
            )}
            {auction.deliveryAddress && (
              <div className={`rounded-xl p-3 flex items-start gap-2 ${soft}`}>
                <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${muted}`} />
                <div><p className={`text-[10px] font-semibold uppercase tracking-wide ${muted}`}>Shipping Address</p><p className="text-sm font-medium mt-0.5">{auction.deliveryAddress}</p></div>
              </div>
            )}
            {!isPaid && <div className={`mt-4 flex items-center gap-2 p-3 rounded-xl text-xs ${isDarkMode ? "bg-slate-700/40 text-slate-500" : "bg-slate-100 text-slate-400"}`}><Clock className="w-3.5 h-3.5" /> Delivery tracking activates once payment is confirmed.</div>}
          </div>
        </motion.div>

        {/* Post-win actions (escrow) */}
        {isPaid && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`${card} overflow-hidden`}>
            <div className={`px-5 py-4 border-b flex items-center gap-2 ${div}`}><ShieldCheck className="w-4 h-4 text-emerald-500" /><h3 className="font-bold text-sm">Escrow & post-win actions</h3></div>
            <div className="p-5 space-y-4">
              {/* Confirm receipt */}
              <div className={`rounded-xl p-4 ${soft}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">Confirm receipt</p>
                    <p className={`text-xs mt-0.5 ${muted}`}>{receiptConfirmed ? "You confirmed receipt — the seller has been paid." : isDelivered ? "Received your item? Confirm to release the escrow payout to the seller." : "Available once your item is delivered."}</p>
                  </div>
                  {receiptConfirmed ? (
                    <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="w-3.5 h-3.5" /> Released</span>
                  ) : (
                    <button onClick={confirmReceipt} disabled={!isDelivered} className="shrink-0 px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Confirm receipt</button>
                  )}
                </div>
              </div>

              {/* Review + dispute + cancel */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button onClick={() => setReviewOpen(true)} className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${review ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : isDarkMode ? "border-slate-700 hover:bg-slate-700" : "border-slate-200 hover:bg-slate-50"}`}>
                  <Star className="w-3.5 h-3.5" /> {review ? "Edit review" : "Leave review"}
                </button>
                <button onClick={() => setDisputeOpen(true)} className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${dispute ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : isDarkMode ? "border-slate-700 hover:bg-slate-700" : "border-slate-200 hover:bg-slate-50"}`}>
                  <MessageSquareWarning className="w-3.5 h-3.5" /> {dispute ? "Dispute raised" : "Raise dispute"}
                </button>
                <button onClick={() => setCancelOpen(true)} disabled={!canCancel} className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${isDarkMode ? "border-slate-700 hover:bg-slate-700" : "border-slate-200 hover:bg-slate-50"}`}>
                  <X className="w-3.5 h-3.5" /> Cancel order
                </button>
              </div>

              {review && (
                <div className={`rounded-xl p-3 ${soft}`}>
                  <div className="flex items-center gap-1 mb-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "text-amber-400 fill-amber-400" : isDarkMode ? "text-slate-600" : "text-slate-300"}`} />)}</div>
                  <p className={`text-xs ${muted}`}>{review.text || "No comment added."}</p>
                </div>
              )}
              {dispute && (
                <div className={`rounded-xl p-3 flex items-start gap-2 ${isDarkMode ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-600"}`}>
                  <MessageSquareWarning className="w-4 h-4 mt-0.5 shrink-0" />
                  <div><p className="text-xs font-semibold">Dispute open: {dispute.reason}</p><p className="text-xs mt-0.5 opacity-80">{dispute.desc || "Our support team will contact you within 24 hours."}</p></div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Documents & support */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }} className={`${card} p-5`}>
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-violet-500" /> Documents & support</h3>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => toast.success("Invoice PDF downloaded!")} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${isDarkMode ? "border-slate-700 hover:bg-slate-700 text-slate-300" : "border-slate-200 hover:bg-slate-50 text-slate-600"}`}><FileText className="w-3.5 h-3.5" /> Download Invoice</button>
            <Link to="/buyer/chat" className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${isDarkMode ? "border-slate-700 hover:bg-slate-700 text-slate-300" : "border-slate-200 hover:bg-slate-50 text-slate-600"}`}>Contact Seller</Link>
            <Link to="/buyer/won-auctions" className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-colors"><Gavel className="w-3.5 h-3.5" /> All Won Auctions</Link>
          </div>
        </motion.div>
      </div>

      {/* ── Review modal ── */}
      <AnimatePresence>
        {reviewOpen && <ReviewModal isDarkMode={isDarkMode} card={card} muted={muted} initial={review} sellerName={auction.seller} onClose={() => setReviewOpen(false)} onSubmit={(r) => { setReview(r); setReviewOpen(false); toast.success("Review submitted — thanks for your feedback!"); }} />}
        {disputeOpen && <DisputeModal isDarkMode={isDarkMode} card={card} muted={muted} inputCls={inputCls} onClose={() => setDisputeOpen(false)} onSubmit={(d) => { setDispute(d); setDisputeOpen(false); toast.success("Dispute raised — escrow is paused pending review"); }} />}
        {cancelOpen && (
          <Backdrop onClose={() => setCancelOpen(false)}>
            <div className={`w-full max-w-sm rounded-2xl ${card} p-5`} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2 mb-2"><AlertCircle className="w-5 h-5 text-rose-500" /><h3 className="font-bold text-sm">Cancel this order?</h3></div>
              <p className={`text-xs mb-5 ${muted}`}>This is only possible before the item ships. Your escrow payment will be fully refunded to your wallet.</p>
              <div className="flex gap-2">
                <button onClick={() => setCancelOpen(false)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border ${isDarkMode ? "border-slate-700 hover:bg-slate-700" : "border-slate-200 hover:bg-slate-100"}`}>Keep order</button>
                <button onClick={cancelOrder} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-rose-500 hover:bg-rose-600 text-white">Cancel order</button>
              </div>
            </div>
          </Backdrop>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Backdrop ─────────────────────────────────────────────────────────────────
function Backdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.97 }} transition={spring} className="w-full flex justify-center">
        {children}
      </motion.div>
    </motion.div>
  );
}

// ─── Review modal ─────────────────────────────────────────────────────────────
function ReviewModal({ isDarkMode, card, muted, initial, sellerName, onClose, onSubmit }: {
  isDarkMode: boolean; card: string; muted: string; initial: { rating: number; text: string } | null; sellerName: string; onClose: () => void; onSubmit: (r: { rating: number; text: string }) => void;
}) {
  const [rating, setRating] = useState(initial?.rating ?? 5);
  const [text, setText] = useState(initial?.text ?? "");
  return (
    <Backdrop onClose={onClose}>
      <div className={`w-full max-w-md rounded-2xl ${card} p-5`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-sm flex items-center gap-2"><Star className="w-4 h-4 text-amber-400" /> Rate {sellerName}</h3><button onClick={onClose} className={muted}><X className="w-4 h-4" /></button></div>
        <div className="flex items-center gap-1.5 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <button key={i} onClick={() => setRating(i + 1)}><Star className={`w-7 h-7 transition-colors ${i < rating ? "text-amber-400 fill-amber-400" : isDarkMode ? "text-slate-600" : "text-slate-300"}`} /></button>
          ))}
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Share your experience with this seller…" className={`w-full px-3 py-2.5 text-sm rounded-xl border outline-none resize-none mb-4 ${isDarkMode ? "bg-slate-900 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"}`} />
        <button onClick={() => onSubmit({ rating, text })} className="w-full py-3 rounded-xl text-sm font-bold bg-violet-600 hover:bg-violet-700 text-white transition-colors">Submit review</button>
      </div>
    </Backdrop>
  );
}

// ─── Dispute modal ────────────────────────────────────────────────────────────
function DisputeModal({ isDarkMode, card, muted, inputCls, onClose, onSubmit }: {
  isDarkMode: boolean; card: string; muted: string; inputCls: string; onClose: () => void; onSubmit: (d: { reason: string; desc: string }) => void;
}) {
  const [reason, setReason] = useState(DISPUTE_REASONS[0]);
  const [desc, setDesc] = useState("");
  return (
    <Backdrop onClose={onClose}>
      <div className={`w-full max-w-md rounded-2xl ${card} p-5`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-sm flex items-center gap-2"><MessageSquareWarning className="w-4 h-4 text-rose-500" /> Raise a dispute</h3><button onClick={onClose} className={muted}><X className="w-4 h-4" /></button></div>
        <div className="space-y-1.5 mb-4">
          {DISPUTE_REASONS.map((r) => (
            <button key={r} onClick={() => setReason(r)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-colors border ${reason === r ? "border-rose-500 " + (isDarkMode ? "bg-rose-500/10" : "bg-rose-50") : isDarkMode ? "border-slate-700 hover:bg-slate-700/40" : "border-slate-200 hover:bg-slate-50"}`}>
              <Tag className="w-3.5 h-3.5 opacity-60" /> {r}
            </button>
          ))}
        </div>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Describe the issue…" className={`${inputCls} resize-none mb-4`} />
        <p className={`text-xs mb-4 ${muted}`}>Raising a dispute pauses the escrow payout while our team investigates.</p>
        <button onClick={() => onSubmit({ reason, desc })} className="w-full py-3 rounded-xl text-sm font-bold bg-rose-500 hover:bg-rose-600 text-white transition-colors">Submit dispute</button>
      </div>
    </Backdrop>
  );
}
