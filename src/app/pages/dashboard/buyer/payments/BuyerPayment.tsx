import { useState, useMemo } from "react";
import {
  ShoppingBag,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  Search,
  Calendar,
  FileText,
  X,
  Eye,
  BarChart2,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../../../hooks/useTheme";
import { MOCK_PAYMENTS } from "../../../../../data/MOCK_PAYMENTS";
import { Button } from "../../../../components/ui/button";

const spring = { type: "spring" as const, stiffness: 120, damping: 20 };

export default function BuyerPayment() {
  const { isDarkMode } = useTheme();

  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showStats, setShowStats] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const payments = MOCK_PAYMENTS;

  const surface = isDarkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-slate-100 shadow-sm";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";

  // Filtered & Sorted Payments
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    if (activeTab !== "all") {
      result = result.filter((p) => p.status === activeTab);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.item.toLowerCase().includes(term) ||
          p.seller.toLowerCase().includes(term)
      );
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [payments, activeTab, searchTerm]);

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const pendingCount = payments.filter((p) => p.status === "pending").length;
  const completedCount = payments.filter((p) => p.status === "completed").length;

  const handleViewDetails = (payment: any) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            borderRadius: "10px",
          },
        }}
      />

      {/* Header */}
      <div
        className={`border-b px-6 py-4 sticky top-0 z-30 backdrop-blur-sm ${
          isDarkMode
            ? "border-slate-700/50 bg-slate-900/80"
            : "border-slate-100 bg-white/80"
        }`}
      >
        <div className="mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isDarkMode ? "bg-violet-500/10" : "bg-violet-50"
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-violet-500" />
            </div>
            <div>
              <h1 className={`text-sm font-semibold ${strong}`}>Payments</h1>
              <p className={`text-xs ${muted}`}>Track your auction purchases</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div
              className={`relative flex-1 sm:w-80 ${
                isDarkMode ? "text-slate-300" : "text-slate-600"
              }`}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none transition-all ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500"
                    : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
                }`}
              />
            </div>

            <button
              onClick={() => setShowStats(!showStats)}
              className={`p-2.5 rounded-xl border transition-all ${
                showStats
                  ? "bg-violet-600 text-white border-violet-600"
                  : isDarkMode
                  ? "bg-slate-800 border-slate-700 hover:bg-slate-700"
                  : "bg-white border-slate-200 hover:bg-slate-100"
              }`}
            >
              <BarChart2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 py-6 max-w-7xl">
        {/* Stats */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-8 rounded-2xl p-6 border ${surface}`}
            >
              <h3 className={`text-lg font-semibold mb-5 ${strong}`}>Payment Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Spent", value: `৳${totalAmount.toLocaleString()}`, color: "text-violet-500" },
                  { label: "Pending", value: pendingCount, color: "text-amber-500" },
                  { label: "Completed", value: completedCount, color: "text-emerald-500" },
                  { label: "Total Orders", value: payments.length, color: "text-sky-500" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-5 rounded-xl border ${surface}`}
                  >
                    <p className={`text-xs font-medium ${muted}`}>{stat.label}</p>
                    <p className={`text-2xl font-semibold mt-1.5 ${stat.color}`}>{stat.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b pb-3 border-slate-700/50 dark:border-slate-700/50">
          {["all", "pending", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/30"
                  : isDarkMode
                  ? "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Payments Table / Cards */}
        <div className={`rounded-2xl border overflow-hidden ${surface}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}>
                  <th className="p-4 text-left font-medium text-xs uppercase tracking-widest text-slate-500">Item</th>
                  <th className="p-4 text-left font-medium text-xs uppercase tracking-widest text-slate-500">Seller</th>
                  <th className="p-4 text-left font-medium text-xs uppercase tracking-widest text-slate-500">Amount</th>
                  <th className="p-4 text-left font-medium text-xs uppercase tracking-widest text-slate-500">Date</th>
                  <th className="p-4 text-left font-medium text-xs uppercase tracking-widest text-slate-500">Status</th>
                  <th className="p-4 text-left font-medium text-xs uppercase tracking-widest text-slate-500">Delivery</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment, i) => (
                    <motion.tr
                      key={payment._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`border-b last:border-none ${isDarkMode ? "border-slate-700 hover:bg-slate-700/50" : "border-slate-200 hover:bg-slate-50"} transition-colors`}
                    >
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={payment.image}
                          alt={payment.item}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <span className={`font-medium line-clamp-2 ${strong}`}>{payment.item}</span>
                      </td>
                      <td className={`p-4 ${muted}`}>{payment.seller}</td>
                      <td className="p-4 font-semibold text-emerald-500">৳{payment.amount.toLocaleString()}</td>
                      <td className={`p-4 text-sm ${muted}`}>{payment.date}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            payment.status === "completed"
                              ? isDarkMode
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-emerald-100 text-emerald-700"
                              : isDarkMode
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {payment.status === "completed" ? <CheckCircle size={14} /> : <Clock size={14} />}
                          {payment.status}
                        </span>
                      </td>
                      <td className={`p-4 ${muted}`}>
                        <span className="flex items-center gap-1.5">
                          <Truck size={16} /> {payment.deliveryStatus}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <Button
                          onClick={() => handleViewDetails(payment)}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" /> View
                        </Button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-16 text-center">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                      <p className={`text-lg font-medium ${strong}`}>No payments found</p>
                      <p className={muted}>Try adjusting your search or filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={spring}
              className={`w-full max-w-lg rounded-2xl ${surface}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-xl font-semibold ${strong}`}>Payment Details</h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className={`p-2 rounded-lg hover:bg-slate-700 ${muted}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <img
                  src={selectedPayment.image}
                  alt={selectedPayment.item}
                  className="w-full h-52 object-cover rounded-xl mb-5"
                />

                <h4 className={`font-semibold text-lg mb-4 ${strong}`}>{selectedPayment.item}</h4>

                <div className="grid grid-cols-2 gap-y-5 text-sm">
                  <div>
                    <p className={muted}>Amount</p>
                    <p className="font-semibold text-emerald-500">৳{selectedPayment.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className={muted}>Seller</p>
                    <p className={strong}>{selectedPayment.seller}</p>
                  </div>
                  <div>
                    <p className={muted}>Date</p>
                    <p className={strong}>{selectedPayment.date}</p>
                  </div>
                  <div>
                    <p className={muted}>Payment Method</p>
                    <p className={strong}>{selectedPayment.paymentMethod}</p>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-colors ${
                      isDarkMode ? "border-slate-700 hover:bg-slate-700" : "border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Close
                  </button>
                  <button
                    onClick={() => toast.success("Receipt downloaded successfully!")}
                    className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <FileText className="w-4 h-4" /> Download Receipt
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