import { useEffect, useState, useRef, type MouseEvent } from "react";
import {
  Sun,
  Moon,
  Gavel,
  Newspaper,
  Mail,
  LayoutDashboard,
  LogOut,
  Info,
  User,
  Settings,
  Wallet,
  ChevronRight,
  Trophy,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { toggleTheme } from "../redux/features/slices/uiSlice";
import { MOCK_USER } from "../../data/MOCK_USER";
import toast from "react-hot-toast";

// ─── Role accent config ───────────────────────────────────────────────────────
const ROLE_ACCENT: Record<string, { badge: string; dot: string; hover: string }> = {
  admin:  { badge: "from-rose-500 to-pink-600",    dot: "bg-rose-400",    hover: "hover:bg-rose-500/10"    },
  seller: { badge: "from-amber-500 to-orange-500", dot: "bg-amber-400",   hover: "hover:bg-amber-500/10"   },
  buyer:  { badge: "from-violet-500 to-purple-600",dot: "bg-violet-400",  hover: "hover:bg-violet-500/10"  },
};

const accent = ROLE_ACCENT[MOCK_USER.role as string] ?? ROLE_ACCENT.buyer;

// ─── Profile Dropdown ─────────────────────────────────────────────────────────
interface ProfileMenuProps {
  isDarkMode: boolean;
  onClose: () => void;
}

function ProfileMenu({ isDarkMode, onClose }: ProfileMenuProps) {
  const handleLogout = () => {
    toast.success("Signed out successfully");
    onClose();
  };

  const surface = isDarkMode
    ? "bg-gray-900 border-gray-800"
    : "bg-white border-gray-200";
  const divider = isDarkMode ? "border-gray-800" : "border-gray-100";
  const itemBase = `flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-150 group`;
  const itemDefault = isDarkMode
    ? "text-gray-300 hover:bg-white/5 hover:text-white"
    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  const profileLinks = [
    {
      to: `/${MOCK_USER.role}`,
      icon: <LayoutDashboard className="w-4 h-4" />,
      label: "Dashboard",
      sub: "Overview & analytics",
    },
    {
      to: `/${MOCK_USER.role}/settings/profile`,
      icon: <User className="w-4 h-4" />,
      label: "My Profile",
      sub: "Edit your information",
    },
    {
      to: `/${MOCK_USER.role}/wallet`,
      icon: <Wallet className="w-4 h-4" />,
      label: "Wallet",
      sub: `$${(47935).toLocaleString()} available`,
    },
    {
      to: `/${MOCK_USER.role}/won-auctions`,
      icon: <Trophy className="w-4 h-4" />,
      label: "Won Auctions",
      sub: "Track your wins",
    },
    {
      to: `/${MOCK_USER.role}/settings`,
      icon: <Settings className="w-4 h-4" />,
      label: "Settings",
      sub: "Preferences & security",
    },
  ];

  return (
    <div
      className={`absolute right-0 mt-3 w-72 rounded-2xl border shadow-2xl z-50 overflow-hidden ${surface}`}
      style={{
        animation: "profileDrop 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      }}
    >
      {/* ── User identity block ── */}
      <div className={`px-4 pt-4 pb-3 border-b ${divider}`}>
        <div className="flex items-center gap-3">
          {/* Avatar with online dot */}
          <div className="relative flex-shrink-0">
            {MOCK_USER.photoURL ? (
              <img
                src={MOCK_USER.photoURL}
                alt={MOCK_USER.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-pink-400/50"
              />
            ) : (
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white bg-gradient-to-br ${accent.badge}`}>
                {MOCK_USER.name.charAt(0)}
              </div>
            )}
            {/* Online indicator */}
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 ${
                isDarkMode ? "border-gray-900" : "border-white"
              } ${accent.dot}`}
            />
          </div>

          {/* Name + email + role */}
          <div className="min-w-0 flex-1">
            <p className={`font-semibold text-sm truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              {MOCK_USER.name}
            </p>
            <p className={`text-xs truncate mt-0.5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
              {MOCK_USER.email}
            </p>
            <span
              className={`inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold text-white bg-gradient-to-r ${accent.badge} capitalize`}
            >
              {MOCK_USER.role}
            </span>
          </div>
        </div>
      </div>

      {/* ── Navigation links ── */}
      <div className="p-2">
        {profileLinks.map(({ to, icon, label, sub }) => (
          <Link
            key={to}
            to={to}
            onClick={onClose}
            className={`${itemBase} ${itemDefault}`}
          >
            {/* Icon container */}
            <span
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-150 ${
                isDarkMode
                  ? "bg-white/5 group-hover:bg-white/10"
                  : "bg-gray-100 group-hover:bg-gray-200"
              }`}
            >
              {icon}
            </span>

            {/* Label + sub */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight">{label}</p>
              <p className={`text-[11px] leading-tight mt-0.5 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}>
                {sub}
              </p>
            </div>

            <ChevronRight
              className={`w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
          </Link>
        ))}
      </div>

      {/* ── Sign out ── */}
      <div className={`p-2 border-t ${divider}`}>
        <button
          onClick={handleLogout}
          className={`${itemBase} w-full text-rose-500 hover:bg-rose-500/10 hover:text-rose-400`}
        >
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
            bg-rose-500/10 group-hover:bg-rose-500/20 transition-colors duration-150"
          >
            <LogOut className="w-4 h-4" />
          </span>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium leading-tight">Sign out</p>
            <p className={`text-[11px] leading-tight mt-0.5 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}>
              {MOCK_USER.email}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);
  const isDarkMode = theme === "dark";

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const profileRef = useRef<HTMLDivElement | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | globalThis.MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Apply dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const getNavLinkClass = (path: string) =>
    location.pathname === path
      ? isDarkMode
        ? "flex items-center gap-3 py-2 px-3 rounded-lg bg-indigo-700/60 text-white font-bold shadow-md"
        : "flex items-center gap-3 py-2 px-3 rounded-lg bg-indigo-200 text-indigo-900 font-bold shadow-md"
      : isDarkMode
      ? "flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-indigo-800/40 text-indigo-100"
      : "flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-indigo-100 text-indigo-800";

  const navRoutes = [
    { path: "/auction",   label: "Auction",    icon: <Gavel     className="w-5 h-5" /> },
    { path: "/aboutUs",   label: "About Us",   icon: <Info      className="w-5 h-5" /> },
    { path: "/blogs",     label: "Blog",       icon: <Newspaper className="w-5 h-5" /> },
    { path: "/contactUs", label: "Contact Us", icon: <Mail      className="w-5 h-5" /> },
  ];

  return (
    <div>
      <nav
        className={`fixed top-0 left-0 w-full z-50 shadow-lg transition-all duration-300 ${
          isScrolled
            ? isDarkMode
              ? "backdrop-blur-md bg-gray-900/30 shadow-lg"
              : "backdrop-blur-md bg-gray-900/30 shadow-lg"
            : isDarkMode
            ? "bg-gray-900/30"
            : "bg-gray-900/30"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-4 py-3">
          {/* Logo */}
          <Link to="/" className="relative group flex items-center">
            <div className="relative overflow-hidden rounded-full">
              <img
                className="w-14 transition-transform duration-300 group-hover:scale-110 mt-2"
                src="https://i.ibb.co.com/TDRpg4tS/Screenshot-2025-03-20-174700-removebg-preview.png"
                alt="Rex Auction Logo"
              />
            </div>
            <h1 className="font-bold text-lg md:text-xl lg:text-2xl tracking-tight ml-2">
              <span
                className={`${
                  isDarkMode
                    ? "text-transparent bg-clip-text bg-white border-b-2 border-purple-600"
                    : "text-transparent bg-clip-text bg-white border-purple-600 border-b-2"
                } font-serif`}
              >
                Rex
              </span>
              <span className="text-white transition-all duration-500 group-hover:tracking-wider">
                {" "}Auction
              </span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex justify-center flex-grow">
            <div className="flex items-center space-x-6">
              {navRoutes.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 group ${
                    location.pathname === item.path
                      ? "text-white font-bold border-b-2 border-purple-400"
                      : isDarkMode
                      ? "text-white hover:text-purple-200"
                      : "text-white hover:text-purple-100"
                  }`}
                >
                  <span className="transition-transform duration-300 group-hover:scale-110">
                    {item.icon}
                  </span>
                  <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-0.5">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={handleToggleTheme}
              className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110 ${
                isDarkMode
                  ? "bg-indigo-800/50 text-purple-400 hover:bg-indigo-700/70"
                  : "bg-indigo-100/50 text-indigo-700 hover:bg-indigo-200/70"
              }`}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 cursor-pointer group"
                aria-label="Open profile menu"
                aria-expanded={showProfileMenu}
              >
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-xl overflow-hidden ring-2 transition-all duration-200 ${
                  showProfileMenu ? "ring-amber-400 ring-offset-1 ring-offset-transparent" : "ring-pink-400/50 group-hover:ring-pink-400"
                }`}>
                  {MOCK_USER.photoURL ? (
                    <img
                      src={MOCK_USER.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br ${accent.badge}`}>
                      {MOCK_USER.name.charAt(0)}
                    </div>
                  )}
                </div>
                {/* Name on desktop */}
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-semibold text-white leading-tight">{MOCK_USER.name.split(" ")[0]}</p>
                  <p className="text-[10px] text-white/50 leading-tight capitalize">{MOCK_USER.role}</p>
                </div>
              </button>

              {/* ── Profile dropdown ── */}
              {showProfileMenu && (
                <ProfileMenu
                  isDarkMode={isDarkMode}
                  onClose={() => setShowProfileMenu(false)}
                />
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={handleToggleTheme}
              className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110 ${
                isDarkMode
                  ? "bg-indigo-800/50 text-purple-400"
                  : "bg-indigo-100/50 text-indigo-700"
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2.5 rounded-full transition-all ${mobileMenuOpen ? "bg-indigo-700/70" : ""}`}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu — unchanged */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-indigo-700/30">
            <div className={`px-4 py-6 ${isDarkMode ? "backdrop-blur-md bg-gray-900/60 shadow-lg" : "backdrop-blur-md bg-gray-100/80 shadow-lg"}`}>
              {navRoutes.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={getNavLinkClass(item.path)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className="mt-6 pt-6 border-t border-indigo-700/30">
                <Link
                  to={`/${MOCK_USER.role}`}
                  className={getNavLinkClass(`/${MOCK_USER.role}`)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to={`/${MOCK_USER.role}/profile`}
                  className={getNavLinkClass(`/${MOCK_USER.role}/profile`)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        @keyframes profileDrop {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
    </div>
  );
};

export default Navbar;