const terms = [
  "All buyers must be at least 18 years old to register.",
  "Bidders are required to provide accurate personal and payment details.",
  "All bids placed are legally binding and cannot be withdrawn.",
  "Winning bidders must complete payment within 48 hours.",
  "RexAuction reserves the right to cancel or suspend accounts due to misconduct.",
  "Items sold are ‘as is’ and returns/refunds are not permitted unless stated otherwise.",
  "Shill bidding (artificially inflating bids) is strictly prohibited.",
  "RexAuction is not liable for shipping delays or item damages post-auction.",
  "Bidders must comply with all local and international trade laws.",
  "Personal data will be protected under our privacy policy.",
  "Sellers may impose additional terms, which must be followed.",
  "Violation of any terms may result in account suspension or legal action.",
  "Sellers must provide accurate descriptions and images of listed items.",
  "All items must comply with legal and marketplace regulations.",
  "Once an item receives a bid, sellers cannot withdraw the listing.",
  "Sellers are responsible for packaging and shipping sold items within the specified timeframe.",
  "Misrepresentation of products may lead to account suspension or legal action.",
  "All transactions must be conducted through RexAuction's payment system.",
  "RexAuction reserves the right to remove any listings that violate policies.",
  "Sellers must honor the winning bid and complete the transaction as agreed.",
  "Refunds and returns must follow the marketplace's stated policy.",
  "Sellers are responsible for resolving disputes with buyers professionally.",
  "Violation of any terms may result in suspension or termination of the seller account.",
  "Personal and business data provided will be managed according to the privacy policy.",
];

import { motion } from "framer-motion";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../../../hooks/useTheme";
import {
  ShieldCheck,
  FileText,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function Terms() {
  const { isDarkMode } = useTheme();
  const [accepted, setAccepted] = useState(false);

  return (
    <div
      className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-purple-50 via-white to-blue-50 text-gray-800"
        }`}
    >
      <div className="max-w-5xl mx-auto pt-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${isDarkMode
                ? "bg-purple-500/20 text-purple-300"
                : "bg-purple-100 text-purple-700"
              }`}
          >
            <ShieldCheck size={18} />
            Terms & Conditions
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
            Seller Agreement
          </h1>

          <p
            className={`max-w-2xl mx-auto text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
          >
            Please review and accept the marketplace terms before becoming a
            seller on RexAuction.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-3xl overflow-hidden shadow-xl border ${isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-100"
            }`}
        >
          {/* Header */}
          <div
            className={`p-6 border-b ${isDarkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50"
              }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="text-purple-500" size={24} />
              <div>
                <h2 className="font-bold text-xl">
                  Marketplace Terms
                </h2>
                <p
                  className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  {terms.length} conditions must be followed.
                </p>
              </div>
            </div>
          </div>

          {/* Terms List */}
          <div
            className={`h-[450px] overflow-y-auto p-6 ${isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
          >
            <div className="space-y-4">
              {terms.map((term, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`flex gap-3 p-4 rounded-xl ${isDarkMode
                      ? "bg-gray-700/50 hover:bg-gray-700"
                      : "bg-gray-50 hover:bg-purple-50"
                    } transition-colors`}
                >
                  <CheckCircle
                    size={18}
                    className="text-purple-500 mt-1 flex-shrink-0"
                  />

                  <p
                    className={`text-sm md:text-base ${isDarkMode
                        ? "text-gray-300"
                        : "text-gray-700"
                      }`}
                  >
                    {term}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            className={`p-6 border-t ${isDarkMode
                ? "border-gray-700 bg-gray-800"
                : "border-gray-100 bg-gray-50"
              }`}
          >
            <label className="flex items-center gap-3 cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="w-5 h-5 accent-purple-600"
              />

              <span
                className={
                  isDarkMode
                    ? "text-gray-300"
                    : "text-gray-700"
                }
              >
                I have read and agree to all Terms & Conditions.
              </span>
            </label>

            <NavLink
              to={accepted ? "/buyer/becomeSeller" : "#"}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all ${accepted
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-gray-400 cursor-not-allowed text-white"
                }`}
            >
              Accept & Continue
              <ArrowRight size={18} />
            </NavLink>
          </div>
        </motion.div>
      </div>
    </div>
  );
}