import {
  ArrowLeft,
  Calendar,
  Edit,
  Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MOCK_AUCTIONS } from "../../../../../data/MOCK_AUCTIONS";
import { useTheme } from "../../../../../hooks/useTheme";

export default function SellerAuctionDetail() {
  const { id } = useParams<{ id: string }>();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [auction, setAuction] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const surface = isDarkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-slate-100 shadow-sm";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";

  useEffect(() => {
    const found = MOCK_AUCTIONS.find((a) => a._id === id);
    if (found) {
      setAuction(found);
    } else {
      toast.error("Auction not found");
      navigate("/seller/manageAuctions");
    }
  }, [id, navigate]);

  if (!auction) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-slate-900" : "bg-slate-50"}`}>
        <div className="text-center">
          <p className="text-xl font-medium">Loading auction...</p>
        </div>
      </div>
    );
  }

  const isActive = auction.status === "Active";

  const handleDelete = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium">Delete this auction?</p>
        <p className="text-sm text-slate-500">This action cannot be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setIsDeleting(true);
              setTimeout(() => {
                toast.success("Auction deleted successfully!");
                navigate("/seller/manageAuctions");
              }, 800);
            }}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-medium"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
        }`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Toaster position="top-right" />

      {/* Header */}
      <div
        className={`border-b px-6 py-4 sticky top-0 z-30 backdrop-blur-sm ${isDarkMode ? "border-slate-700/50 bg-slate-900/80" : "border-slate-100 bg-white/80"
          }`}
      >
        <div className="flex items-center gap-4  mx-auto">
          <Link
            to="/seller/manageAuctions"
            className={`p-2 rounded-xl transition-colors ${isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className={`text-lg font-semibold truncate ${strong}`}>{auction.name}</h1>
            <p className={`text-xs ${muted}`}>Auction ID: {auction._id}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-500/10 text-slate-400"}`}>
            {auction.status}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Images & Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl overflow-hidden border shadow-sm">
              <img
                src={auction.images[0]}
                alt={auction.name}
                className="w-full h-[420px] object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {auction.images.slice(0, 4).map((img: string, i: number) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div className={`rounded-2xl border p-6 ${surface}`}>
              <h3 className={`font-semibold text-lg mb-4 ${strong}`}>Description</h3>
              <p className={`leading-relaxed ${muted}`}>{auction.description}</p>
            </div>
          </div>

          {/* Right Column - Details & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className={`rounded-2xl border p-6 ${surface}`}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className={muted}>Current Bid</p>
                  <p className="text-4xl font-bold text-emerald-500">${auction.currentBid?.toLocaleString() || auction.startingPrice}</p>
                </div>
                <div className="text-right">
                  <p className={muted}>Starting Price</p>
                  <p className="font-medium">${auction.startingPrice}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div className={`p-4 rounded-xl ${isDarkMode ? "bg-slate-700/50" : "bg-slate-50"}`}>
                  <p className={muted}>Status</p>
                  <p className="font-medium mt-1">{auction.status}</p>
                </div>
                <div className={`p-4 rounded-xl ${isDarkMode ? "bg-slate-700/50" : "bg-slate-50"}`}>
                  <p className={muted}>Category</p>
                  <p className="font-medium mt-1">{auction.category}</p>
                </div>
                <div className={`p-4 rounded-xl ${isDarkMode ? "bg-slate-700/50" : "bg-slate-50"}`}>
                  <p className={muted}>Condition</p>
                  <p className="font-medium mt-1">{auction.condition}</p>
                </div>
                <div className={`p-4 rounded-xl ${isDarkMode ? "bg-slate-700/50" : "bg-slate-50"}`}>
                  <p className={muted}>Year</p>
                  <p className="font-medium mt-1">{auction.itemYear || "—"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm mb-6">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className={muted}>
                  Ends on {new Date(auction.endTime).toLocaleDateString("en-US", {
                    weekday: "long", month: "long", day: "numeric", year: "numeric"
                  })}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => toast.success("Edit mode coming soon!")}
                className="flex items-center justify-center gap-2 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-medium transition-all"
              >
                <Edit className="w-4 h-4" />
                Edit Auction
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center justify-center gap-2 py-3.5 border border-rose-500 text-rose-500 hover:bg-rose-500/10 rounded-2xl font-medium transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Delete Auction
              </button>
            </div>

            {/* Additional Info */}
            <div className={`rounded-2xl border p-6 ${surface}`}>
              <h4 className={`font-semibold mb-4 ${strong}`}>Auction Details</h4>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className={muted}>Reference</span>
                  <span className={strong}>{auction.reference || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className={muted}>Seller</span>
                  <span className={strong}>{auction.sellerDisplayName}</span>
                </div>
                <div className="flex justify-between">
                  <span className={muted}>Total Bids</span>
                  <span className={strong}>12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}