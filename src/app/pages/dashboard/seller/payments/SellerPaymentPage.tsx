import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  MessageSquare,
  Search,
  X
} from "lucide-react";
import { useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MOCK_PAYMENTS } from "../../../../../data/MOCK_PAYMENTS";
import { useTheme } from "../../../../../hooks/useTheme";

const SellerPaymentPage = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"received" | "auctions">("received");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const surface = isDarkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-slate-100 shadow-sm";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";

  const receivedPayments = MOCK_PAYMENTS;

  const filteredPayments = useMemo(() => {
    if (!searchTerm) return receivedPayments;
    const term = searchTerm.toLowerCase();
    return receivedPayments.filter(
      (p) =>
        p.item.toLowerCase().includes(term) ||
        p.buyer.toLowerCase().includes(term)
    );
  }, [receivedPayments, searchTerm]);

  const handleViewDetails = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleContactBuyer = (buyer: string) => {
    toast.success(`Opening chat with ${buyer}`);
    setIsModalOpen(false);
    // navigate to chat later
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
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
        className={`border-b px-6 py-4 sticky top-0 z-30 backdrop-blur-sm ${isDarkMode
            ? "border-slate-700/50 bg-slate-900/80"
            : "border-slate-100 bg-white/80"
          }`}
      >
        <div className="mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 ">
          <div className="flex items-center gap-3 flex-1">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50"
                }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <h1 className={`text-sm font-semibold ${strong}`}>Payments</h1>
              <p className={`text-xs ${muted}`}>Track received payments & sales</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div
              className={`relative flex-1 sm:w-80 ${isDarkMode ? "text-slate-300" : "text-slate-600"
                }`}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none transition-all ${isDarkMode
                    ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500"
                    : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
                  }`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className=" mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex border-b mb-8 border-slate-200 dark:border-slate-700">
          {["received", "auctions"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-8 py-4 font-medium text-sm transition-all border-b-2 -mb-px ${activeTab === tab
                  ? "border-violet-500 text-violet-600"
                  : isDarkMode
                    ? "border-transparent text-slate-400 hover:text-slate-200"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
            >
              {tab === "received" ? "Received Payments" : "My Auctions"}
            </button>
          ))}
        </div>

        {/* Received Payments Tab */}
        {activeTab === "received" && (
          <>
            <div className={`rounded-2xl border overflow-hidden ${surface}`}>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className={`border-b ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}>
                      <th className="px-6 py-5 text-left font-medium text-xs uppercase tracking-widest text-slate-500">Item</th>
                      <th className="px-6 py-5 text-left font-medium text-xs uppercase tracking-widest text-slate-500">Buyer</th>
                      <th className="px-6 py-5 text-left font-medium text-xs uppercase tracking-widest text-slate-500">Amount</th>
                      <th className="px-6 py-5 text-left font-medium text-xs uppercase tracking-widest text-slate-500">Date</th>
                      <th className="px-6 py-5 text-left font-medium text-xs uppercase tracking-widest text-slate-500">Status</th>
                      <th className="px-6 py-5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDarkMode ? "divide-slate-700" : "divide-slate-200"}`}>
                    {filteredPayments.length > 0 ? (
                      filteredPayments.map((payment, i) => (
                        <motion.tr
                          key={payment._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className={`hover:bg-slate-700/30 transition-colors`}
                        >
                          <td className="px-6 py-5 flex items-center gap-4">
                            <img
                              src={payment.image}
                              alt={payment.item}
                              className="w-12 h-12 object-cover rounded-xl"
                            />
                            <span className={`font-medium ${strong}`}>{payment.item}</span>
                          </td>
                          <td className={`px-6 py-5 ${muted}`}>{payment.buyer}</td>
                          <td className="px-6 py-5 font-semibold text-emerald-500">
                            ৳{payment.amount.toLocaleString()}
                          </td>
                          <td className={`px-6 py-5 text-sm ${muted}`}>{payment.date}</td>
                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${payment.status === "completed"
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
                          <td className="px-6 py-5 text-center">
                            <button
                              onClick={() => handleViewDetails(payment)}
                              className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all ${isDarkMode
                                  ? "border-slate-600 hover:bg-slate-700"
                                  : "border-slate-200 hover:bg-slate-100"
                                }`}
                            >
                              <Eye className="inline w-4 h-4 mr-1" /> View
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-20 text-center">
                          <p className={`text-lg ${strong}`}>No payments found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Auctions Tab */}
        {activeTab === "auctions" && (
          <div className={`rounded-2xl border p-16 text-center ${surface}`}>
            <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${isDarkMode ? "bg-slate-700" : "bg-slate-100"}`}>
              <DollarSign className={`w-10 h-10 ${muted}`} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${strong}`}>Your Auctions</h3>
            <p className={muted}>Active auctions and their payment status will appear here</p>
            <button
              onClick={() => navigate("/seller/create-auction")}
              className="mt-6 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors"
            >
              Create New Auction
            </button>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
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
              className={`w-full max-w-lg rounded-2xl ${surface}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className={`text-xl font-semibold ${strong}`}>Payment Details</h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className={`p-2 rounded-lg ${muted}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <img
                  src={selectedItem.image}
                  alt={selectedItem.item}
                  className="w-full h-56 object-cover rounded-xl mb-6"
                />

                <h4 className={`font-semibold text-lg mb-5 ${strong}`}>{selectedItem.item}</h4>

                <div className="grid grid-cols-2 gap-y-5 text-sm mb-8">
                  <div>
                    <p className={muted}>Buyer</p>
                    <p className={strong}>{selectedItem.buyer}</p>
                  </div>
                  <div>
                    <p className={muted}>Amount</p>
                    <p className="font-semibold text-emerald-500">৳{selectedItem.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className={muted}>Date</p>
                    <p className={strong}>{selectedItem.date}</p>
                  </div>
                  <div>
                    <p className={muted}>Payment Method</p>
                    <p className={strong}>{selectedItem.paymentMethod}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-colors ${isDarkMode ? "border-slate-700 hover:bg-slate-700" : "border-slate-200 hover:bg-slate-100"
                      }`}
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleContactBuyer(selectedItem.buyer);
                    }}
                    className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" /> Message Buyer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellerPaymentPage;