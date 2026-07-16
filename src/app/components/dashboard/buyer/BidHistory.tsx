import { useState, useMemo } from "react";
import { Search, Trophy, ArrowUp, ArrowDown, Eye, Star, Flag } from "lucide-react";
import { useTheme } from "../../../../hooks/useTheme";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK_BID_HISTORY } from "../../../../data/MOCK_BID_HISTORY";

const spring = { type: "spring" as const, stiffness: 120, damping: 20 };

export default function BidHistory() {
  const { isDarkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [selectedBid, setSelectedBid] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const surface = isDarkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-slate-100 shadow-sm";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";

  const filteredBids = useMemo(() => {
    let result = [...MOCK_BID_HISTORY];

    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      result = result.filter(
        (bid) =>
          bid.auctionTitle.toLowerCase().includes(term) ||
          bid.status.toLowerCase().includes(term)
      );
    }

    result.sort((a, b) =>
      sortOrder === "desc" ? b.bidAmount - a.bidAmount : a.bidAmount - b.bidAmount
    );

    return result;
  }, [searchQuery, sortOrder]);

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString();
  };

  const openBidDetails = (bid: any) => {
    setSelectedBid(bid);
    setShowModal(true);
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
              <Trophy className="w-4 h-4 text-violet-500" />
            </div>
            <div>
              <h1 className={`text-sm font-semibold ${strong}`}>Bid History</h1>
              <p className={`text-xs ${muted}`}>Track all your bidding activity</p>
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
                placeholder="Search auctions or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none transition-all ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500"
                    : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto px-6 py-6">
        {/* Sort Controls */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setSortOrder("desc")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              sortOrder === "desc"
                ? "bg-violet-600 text-white shadow-md shadow-violet-500/30"
                : isDarkMode
                ? "bg-slate-800 hover:bg-slate-700 border border-slate-700"
                : "bg-white border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <ArrowDown className="w-4 h-4" /> High to Low
          </button>
          <button
            onClick={() => setSortOrder("asc")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              sortOrder === "asc"
                ? "bg-violet-600 text-white shadow-md shadow-violet-500/30"
                : isDarkMode
                ? "bg-slate-800 hover:bg-slate-700 border border-slate-700"
                : "bg-white border border-slate-200 hover:bg-slate-100"
            }`}
          >
            <ArrowUp className="w-4 h-4" /> Low to High
          </button>
        </div>

        {/* Table Container */}
        <div className={`rounded-2xl border overflow-hidden ${surface}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}>
                  <th className="py-5 px-6 text-left font-medium text-xs uppercase tracking-widest text-slate-500">Auction</th>
                  <th className="py-5 px-6 text-left font-medium text-xs uppercase tracking-widest text-slate-500">Bid Amount</th>
                  <th className="py-5 px-6 text-left font-medium text-xs uppercase tracking-widest text-slate-500">Time</th>
                  <th className="py-5 px-6 text-left font-medium text-xs uppercase tracking-widest text-slate-500">Status</th>
                  <th className="py-5 px-6 w-20"></th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-slate-700" : "divide-slate-200"}`}>
                {filteredBids.length > 0 ? (
                  filteredBids.map((bid, i) => (
                    <motion.tr
                      key={bid._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, ...spring }}
                      className={`hover:bg-slate-700/50 transition-colors cursor-pointer ${isDarkMode ? "hover:bg-slate-700/50" : "hover:bg-slate-50"}`}
                      onClick={() => openBidDetails(bid)}
                    >
                      <td className="py-5 px-6 flex items-center gap-4">
                        <img
                          src={bid.auctionImage}
                          alt={bid.auctionTitle}
                          className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
                        />
                        <div className={`font-medium line-clamp-2 ${strong}`}>{bid.auctionTitle}</div>
                      </td>
                      <td className="py-5 px-6 font-semibold text-emerald-500">
                        ${bid.bidAmount.toLocaleString()}
                      </td>
                      <td className={`py-5 px-6 text-sm ${muted}`}>
                        {formatTime(bid.time)}
                      </td>
                      <td className="py-5 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium ${
                            bid.status === "Won"
                              ? isDarkMode
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-emerald-100 text-emerald-700"
                              : isDarkMode
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : "bg-rose-100 text-rose-700"
                          }`}
                        >
                          {bid.status === "Won" ? "🏆 Won" : "❌ Lost"}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openBidDetails(bid);
                          }}
                          className={`p-2 rounded-lg transition-colors ${isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isDarkMode ? "bg-slate-700" : "bg-slate-100"}`}>
                        <Trophy className={`w-8 h-8 ${muted}`} />
                      </div>
                      <p className={`font-medium ${strong}`}>No bids found</p>
                      <p className={muted}>Try adjusting your search term</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bid Detail Modal */}
      <AnimatePresence>
        {showModal && selectedBid && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={spring}
              className={`w-full max-w-md rounded-2xl ${surface}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className={`text-xl font-semibold ${strong}`}>Bid Details</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className={`p-2 rounded-lg ${muted}`}
                  >
                    ✕
                  </button>
                </div>

                <div className="rounded-xl overflow-hidden mb-6">
                  <img
                    src={selectedBid.auctionImage}
                    alt={selectedBid.auctionTitle}
                    className="w-full h-48 object-cover"
                  />
                </div>

                <h4 className={`font-semibold text-lg mb-4 ${strong}`}>{selectedBid.auctionTitle}</h4>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className={muted}>Bid Amount</span>
                    <span className="font-semibold text-emerald-500">${selectedBid.bidAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={muted}>Placed On</span>
                    <span className={strong}>{formatTime(selectedBid.time)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={muted}>Status</span>
                    <span className={`font-medium ${selectedBid.status === "Won" ? "text-emerald-500" : "text-rose-500"}`}>
                      {selectedBid.status === "Won" ? "🏆 Won" : "❌ Lost"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={muted}>Seller rating</span>
                    <span className={`font-medium flex items-center gap-1 ${strong}`}>
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {(4 + ((selectedBid.position ?? 1) % 10) / 10).toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => toast.success("Auction reported — our team will review it")}
                    className={`flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium border transition-colors ${isDarkMode ? "border-slate-700 hover:bg-slate-700 text-rose-400" : "border-slate-200 hover:bg-slate-100 text-rose-500"}`}
                  >
                    <Flag className="w-4 h-4" /> Report
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Close
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