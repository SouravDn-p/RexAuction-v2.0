"use client";

import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  ArrowDown,
  ArrowUp,
  Search,
  Download,
  Plus,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../hooks/useTheme";
import { MOCK_USER } from "../../../data/MOCK_USER";
import { exportTransactionPdf } from "../../lib/exportTransactionPdf";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

export default function WalletHistoryPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "deposit" | "withdrawal">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const filterRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();
  const dbUser = MOCK_USER;

  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatNumber = (number: number | string) => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };

  const filteredTransactions = dbUser?.transactions?.filter((transaction) => {
    if (!transaction) return false;

    const matchesType =
      filterType === "all" ||
      (filterType === "deposit" && transaction.type === "Deposit") ||
      (filterType === "withdrawal" && transaction.type === "Withdrawal");

    const matchesSearch =
      (transaction.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.amount?.toString().includes(searchQuery) ||
        transaction.status?.toLowerCase().includes(searchQuery.toLowerCase())) ?? false;

    return matchesType && matchesSearch;
  }) || [];

  const exportToPDF = () => {
    exportTransactionPdf({ dbUser, filteredTransactions });
    toast.success("PDF exported successfully!");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Toaster position="top-right" />

      {/* Header */}
      <div
        className={`border-b px-6 py-4 sticky top-0 z-30 backdrop-blur-sm ${
          isDarkMode
            ? "border-slate-700/50 bg-slate-900/80"
            : "border-slate-100 bg-white/80"
        }`}
      >
        <div className="mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 ">
          <div className="flex items-center gap-3 flex-1">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50"
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <h1 className={`text-sm font-semibold ${strong}`}>Wallet History</h1>
              <p className={`text-xs ${muted}`}>Track all your transactions</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/addBalance"
              className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Add Balance
            </Link>

            <button
              onClick={exportToPDF}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-colors ${
                isDarkMode
                  ? "border-slate-700 hover:bg-slate-800"
                  : "border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Balance Card */}
        <div className={`rounded-2xl border p-8 mb-8 ${surface}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className={`text-sm ${muted}`}>Current Balance</p>
              <p className={`text-5xl font-bold tracking-tight ${strong}`}>
                {formatNumber(dbUser?.accountBalance || 0)} <span className="text-2xl">৳</span>
              </p>
            </div>

            <div className="flex gap-6 text-sm">
              <div>
                <p className={muted}>Total Deposits</p>
                <p className="font-semibold text-emerald-500">৳45,820</p>
              </div>
              <div>
                <p className={muted}>Total Withdrawals</p>
                <p className="font-semibold text-rose-500">৳12,450</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 rounded-2xl border outline-none transition-all ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500"
                  : "bg-white border-slate-200 placeholder-slate-400 focus:border-violet-400"
              }`}
            />
          </div>

          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center justify-between w-full md:w-52 px-5 py-3 rounded-2xl border transition-all ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 hover:bg-slate-700"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span>
                {filterType === "all"
                  ? "All Transactions"
                  : filterType === "deposit"
                  ? "Deposits Only"
                  : "Withdrawals Only"}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
            </button>

            {isFilterOpen && (
              <div className={`absolute mt-2 w-full rounded-2xl border shadow-lg z-50 ${surface}`}>
                {[
                  { id: "all", label: "All Transactions" },
                  { id: "deposit", label: "Deposits Only" },
                  { id: "withdrawal", label: "Withdrawals Only" },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setFilterType(item.id as any);
                      setIsFilterOpen(false);
                    }}
                    className={`px-5 py-3 cursor-pointer hover:bg-slate-700/50 rounded-2xl transition-colors ${
                      filterType === item.id ? "bg-violet-500/10 text-violet-400" : ""
                    }`}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className={`rounded-2xl border overflow-hidden ${surface}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className={`border-b ${isDarkMode ? "border-slate-700" : "border-slate-200"}`}>
                  <th className={`py-5 px-6 text-left text-xs font-medium uppercase tracking-widest ${muted}`}>Date</th>
                  <th className={`py-5 px-6 text-left text-xs font-medium uppercase tracking-widest ${muted}`}>Description</th>
                  <th className={`py-5 px-6 text-left text-xs font-medium uppercase tracking-widest ${muted}`}>Amount</th>
                  <th className={`py-5 px-6 text-right text-xs font-medium uppercase tracking-widest ${muted}`}>Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-slate-700" : "divide-slate-200"}`}>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction, index) => (
                    <motion.tr
                      key={transaction.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`hover:bg-slate-700/30 transition-colors`}
                    >
                      <td className="py-5 px-6">
                        <div className={strong}>{formatDate(transaction.date)}</div>
                        <div className={`text-xs ${muted}`}>{formatTime(transaction.date)}</div>
                      </td>
                      <td className={`py-5 px-6 ${strong}`}>{transaction.description || "N/A"}</td>
                      <td className="py-5 px-6">
                        <div
                          className={`font-semibold flex items-center gap-1 ${
                            transaction.type === "Deposit" ? "text-emerald-500" : "text-rose-500"
                          }`}
                        >
                          {transaction.type === "Deposit" ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                          ৳{formatNumber(transaction.amount)}
                        </div>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-4 py-1 rounded-full text-xs font-medium ${
                            transaction.status === "completed"
                              ? isDarkMode
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-emerald-100 text-emerald-700"
                              : isDarkMode
                              ? "bg-amber-500/10 text-amber-400"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {transaction.status === "completed" ? "Completed" : "Pending"}
                        </span>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <p className={`text-lg ${strong}`}>No transactions found</p>
                      <p className={muted}>Try changing your filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center text-sm mt-6 text-slate-500">
          Showing {filteredTransactions.length} of {dbUser?.transactions?.length || 0} transactions
        </div>
      </div>
    </div>
  );
}