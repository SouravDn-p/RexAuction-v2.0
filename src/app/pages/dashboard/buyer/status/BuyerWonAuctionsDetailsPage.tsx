import { useParams, Link } from "react-router-dom";
import { Trophy } from "lucide-react";
    import {
    MOCK_BUYER_AUCTIONS,
    } from "../../../../../data/Buyerauctiondata";
import { useTheme } from "../../../../../hooks/useTheme";
import { MOCK_USER } from "../../../../../data/MOCK_USER";
import BuyerWonAuctionDetail from "../../../../components/dashboard/buyer/auction/BuyerWonAuctionDetail";

export default function BuyerWonAuctionsDetailsPage() {
  const { id } = useParams<{ id?: string }>();
  const { isDarkMode } = useTheme();
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

  return <BuyerWonAuctionDetail auction={auction} isDarkMode={isDarkMode} />;
}