import { Link } from "react-router-dom";
import { Home, Search } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

const LOGO =
  "https://i.ibb.co.com/TDRpg4tS/Screenshot-2025-03-20-174700-removebg-preview.png";

const NotFound = () => {
  const { isDarkMode } = useTheme();
  const bg = isDarkMode ? "bg-[#0E0F14]" : "bg-slate-50";
  const text = isDarkMode ? "text-[#E2E8F0]" : "text-gray-900";
  const muted = isDarkMode ? "text-gray-500" : "text-gray-500";
  const surface = isDarkMode ? "bg-[#161820] border-[#252733]" : "bg-white border-gray-200";

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-16 ${bg} ${text}`}>
      <div className={`w-full max-w-lg rounded-2xl border p-8 sm:p-10 text-center ${surface}`}>
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <img src={LOGO} alt="Rex Auction" className="w-10 h-10 object-contain" />
          <span className="font-semibold">
            <span className="text-violet-500">Rex</span> Auction
          </span>
        </Link>

        <p className="text-6xl font-bold text-violet-500 tracking-tight">404</p>
        <h1 className="text-2xl font-bold mt-3 mb-2">Page not found</h1>
        <p className={`text-sm leading-relaxed mb-8 ${muted}`}>
          That address is not on Rex Auction. It may have been moved, or the link is incomplete.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white"
          >
            <Home className="w-4 h-4" />
            Back to home
          </Link>
          <Link
            to="/auction"
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border ${surface}`}
          >
            <Search className="w-4 h-4" />
            Browse auctions
          </Link>
        </div>

        <div className={`mt-8 pt-6 border-t text-sm flex flex-wrap justify-center gap-x-4 gap-y-2 ${muted} ${isDarkMode ? "border-[#252733]" : "border-gray-200"}`}>
          <Link to="/contactUs" className="hover:text-violet-500">
            Contact
          </Link>
          <Link to="/aboutUs" className="hover:text-violet-500">
            About
          </Link>
          <Link to="/login" className="hover:text-violet-500">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
