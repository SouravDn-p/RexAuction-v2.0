import { useState, useMemo } from "react";
import {
  CheckCircle,
  XCircle,
  Search,
  Trophy,
} from "lucide-react";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { useTheme } from "../../../../../hooks/useTheme";
import { MOCK_BID_HISTORY } from "../../../../../data/MOCK_BID_HISTORY";

const AuctionStatus = () => {
  const { isDarkMode } = useTheme();
  const [filterStatus, setFilterStatus] = useState<"All" | "Won" | "Lost">("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBids = useMemo(() => {
    let result = [...MOCK_BID_HISTORY];

    if (filterStatus !== "All") {
      result = result.filter((bid) => bid.status === filterStatus);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((bid) =>
        bid.auctionTitle.toLowerCase().includes(term)
      );
    }

    return result;
  }, [filterStatus, searchTerm]);

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900"
      }`}
    >
      <Toaster position="top-right" />

      <div className=" mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isDarkMode ? "bg-gray-800" : "bg-purple-100"}`}>
              <Trophy className={`w-7 h-7 ${isDarkMode ? "text-yellow-400" : "text-purple-600"}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                My Auction History
              </h1>
              <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Track your bidding performance
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search auctions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-200 text-gray-800"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className={`flex gap-2 mb-8 border-b pb-4 ${isDarkMode ? "border-gray-700" : "border-gray-200"} `}>
          {["All", "Won", "Lost"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status as "All" | "Won" | "Lost")}
              className={`px-6 py-2.5 rounded-2xl font-medium transition-all text-sm ${
                filterStatus === status
                  ? "bg-purple-600 text-white shadow-lg"
                  : isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  : "bg-white hover:bg-gray-100 text-gray-700 border"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className={`rounded-3xl overflow-hidden shadow-xl border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
          <table className={`min-w-full ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <thead>
              <tr className={`${isDarkMode ? "bg-gray-900" : "bg-gray-50"} border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <th className="py-5 px-6 text-left font-semibold">Item</th>
                <th className="py-5 px-6 text-left font-semibold">Your Position</th>
                <th className="py-5 px-6 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBids.length > 0 ? (
                filteredBids.map((bid) => (
                  <motion.tr
                    key={bid._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border-b hover:bg-opacity-80 transition-all ${isDarkMode ? "hover:bg-gray-700 border-gray-700" : "hover:bg-gray-50 border-gray-200"}`}
                  >
                    <td className="py-5 px-6 flex items-center gap-4">
                      <img
                        src={bid.auctionImage}
                        alt={bid.auctionTitle}
                        className="w-14 h-14 object-cover rounded-lg shadow"
                      />
                      <div>
                        <p className="font-medium line-clamp-2">{bid.auctionTitle}</p>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-xl">#{bid.position}</span>
                        <span className="text-sm text-gray-500">of {bid.topBiddersLength}</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                            style={{ width: `${(bid.position / bid.topBiddersLength) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ${
                          bid.status === "Won"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {bid.status === "Won" ? <CheckCircle size={18} /> : <XCircle size={18} />}
                        {bid.status}
                      </span>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-20 text-center">
                    <p className="text-lg text-gray-500">No bids found matching your filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuctionStatus;