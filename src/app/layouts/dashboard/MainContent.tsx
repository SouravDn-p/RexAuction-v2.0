import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import { FaSun, FaMoon } from "react-icons/fa";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  LogOut,
  Settings,
  User,
  Search,
  ChevronDown,
  Wallet, 
  Clock,
  X,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useTheme } from "../../../hooks/useTheme";
import { MOCK_NOTIFICATIONS, type Notification } from "../../../data/MOCK_NOTIFICATIONS";
import { MOCK_USER } from "../../../data/MOCK_USER";

const formatTimestamp = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

interface MainContentProps {
  onMobileMenuOpen?: () => void;
}

const MainContent = ({ onMobileMenuOpen }: MainContentProps) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const chatPath = location.pathname.includes("chat");

  const notificationCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node))
        setIsNotificationsOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setIsProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setIsSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markNotificationsAsRead = () => {
    if (notifications.every((n) => n.read)) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const viewNotificationDetails = (notification: Notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
    );
    setIsNotificationsOpen(false);
    navigate(`/${MOCK_USER.role}/announcement`, { state: { notificationDetails: notification } });
  };

  const handleLogout = () => {
    toast.success("Successfully signed out");
    setTimeout(() => navigate("/"), 1000);
  };

  const getPageInfo = () => {
    const path = location.pathname;
    const map: Record<string, { name: string; sub: string }> = {  
      [`${MOCK_USER.role}`]: { name: "Dashboard", sub: "Overview & analytics" },
      [`${MOCK_USER.role}/announcement`]: { name: "Announcements", sub: "Platform updates" },
      [`${MOCK_USER.role}/profile`]: { name: "Profile", sub: "Manage your account" },
      [`${MOCK_USER.role}/settings`]: { name: "Settings", sub: "App preferences" },
      [`${MOCK_USER.role}/blog`]: { name: "Blog", sub: "Manage blog posts" },
      [`${MOCK_USER.role}/userManagement`]: { name: "Users", sub: "Manage platform users" },
      [`${MOCK_USER.role}/manageAuctions`]: { name: "Auctions", sub: "Manage all auctions" },
    };
    return map[path] ?? { name: "Dashboard", sub: "Welcome back" };
  };

  const { name: pageName, sub: pageSub } = getPageInfo();

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Toaster position="top-right" toastOptions={{ style: { zIndex: 9999 } }} />

      {/* ── Floating Header ── */}
      {!chatPath && (
        <header
          className={`
            flex-shrink-0 z-30
            ${isDarkMode
              ? "bg-gray-900/80 border-gray-800"
              : "bg-white/80 border-gray-200/80"
            }
            backdrop-blur-xl border-b transition-colors duration-300
          `}
        >
          <div className="flex items-center justify-between px-5 h-16">
            {/* Left */}
            <div className="flex items-center gap-4">
              <button
                onClick={onMobileMenuOpen}
                className={`
                  lg:hidden w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer transition-colors
                  ${isDarkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}
                `}
                aria-label="Open sidebar"
              >
                <FaBars size={16} />
              </button>
              <div>
                <h1 className={`text-base hidden lg:block font-semibold leading-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  {pageName}
                </h1>
                <p className={`text-xs hidden lg:block  leading-tight ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                  {pageSub}
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-1">

              {/* Search */}
              <div className="relative" ref={searchRef}>
                <button
                  onClick={() => setIsSearchOpen((p) => !p)}
                  className={`
                    w-9 h-9 flex items-center justify-center rounded-xl transition-colors
                    ${isDarkMode ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}
                  `}
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>

                {isSearchOpen && (
                  <div className={`absolute right-0 top-12 w-72 rounded-2xl shadow-2xl border overflow-hidden ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
                    <div className="relative p-2">
                      <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                      <input
                        autoFocus
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search anything..."
                        className={`
                          w-full pl-9 pr-8 py-2.5 rounded-xl text-sm outline-none transition-colors
                          ${isDarkMode ? "bg-gray-800 text-white placeholder-gray-500" : "bg-gray-50 text-gray-800 placeholder-gray-400"}
                        `}
                      />
                      {searchValue && (
                        <button onClick={() => setSearchValue("")} className="absolute right-5 top-1/2 -translate-y-1/2">
                          <X className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setIsNotificationsOpen((p) => !p)}
                  className={`
                    relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors
                    ${isDarkMode ? "text-gray-400 hover:bg-gray-800 hover:text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}
                  `}
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {notificationCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className={`absolute right-0 top-12 w-80 rounded-2xl shadow-2xl border overflow-hidden ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
                    <div className={`flex items-center justify-between px-4 py-3 border-b ${isDarkMode ? "border-gray-800" : "border-gray-100"}`}>
                      <div>
                        <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Notifications</p>
                        {notificationCount > 0 && (
                          <p className="text-xs text-red-400 font-medium">{notificationCount} unread</p>
                        )}
                      </div>
                      {notificationCount > 0 && (
                        <button onClick={markNotificationsAsRead} className="text-xs px-2.5 py-1 rounded-lg font-medium bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors">
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto no-scrollbar">
                      {notifications.map((notif, i) => (
                        <div
                          key={notif._id || i}
                          onClick={() => viewNotificationDetails(notif)}
                          className={`
                            flex gap-3 px-4 py-3 cursor-pointer border-b last:border-b-0 transition-colors
                            ${isDarkMode ? "border-gray-800" : "border-gray-50"}
                            ${!notif.read
                              ? isDarkMode ? "bg-blue-500/5 hover:bg-blue-500/10" : "bg-blue-50/50 hover:bg-blue-50"
                              : isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50"
                            }
                          `}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${isDarkMode ? "bg-blue-500/15" : "bg-blue-100"}`}>
                            {notif.type === "auction" ? <Clock className="w-4 h-4 text-blue-500" /> : <Bell className="w-4 h-4 text-blue-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-xs font-semibold truncate ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{notif.title}</p>
                              {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1" />}
                            </div>
                            <p className={`text-xs mt-0.5 line-clamp-2 ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>{notif.message}</p>
                            <p className={`text-[10px] mt-1 ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}>{formatTimestamp(notif.timestamp)}</p>
                          </div>
                        </div>
                      ))}
                      {notifications.length === 0 && (
                        <div className={`px-4 py-10 text-center text-sm ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}>No notifications</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={`w-9 h-9 flex items-center cursor-pointer justify-center rounded-xl transition-colors ${isDarkMode ? "text-yellow-400 hover:bg-gray-800" : "text-gray-500 hover:bg-gray-100"}`}
                aria-label="Toggle theme"
              >
                {isDarkMode ? <FaSun size={15} /> : <FaMoon size={15} />}
              </button>

              {/* Divider */}
              <div className={`w-px h-6 mx-1 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`} />

              {/* Profile */}
              <div className="relative"  ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen((p) => !p)}
                  className={`flex items-center gap-2.5 cursor-pointer pl-1 pr-2 py-1 rounded-xl transition-colors ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                >
                  {MOCK_USER.photoURL ? (
                    <img src={MOCK_USER.photoURL} alt={MOCK_USER.name} className={`w-8 h-8 rounded-xl object-cover ring-2 ${isDarkMode ? "ring-gray-700" : "ring-gray-200"}`} />
                  ) : (
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-semibold text-sm text-white ${isDarkMode ? "bg-indigo-600" : "bg-indigo-500"}`}>
                      {MOCK_USER.name.charAt(0)}
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className={`text-xs font-semibold leading-tight ${isDarkMode ? "text-white" : "text-gray-800"}`}>{MOCK_USER.name.split(" ")[0]}</p>
                    <p className={`text-[10px] leading-tight capitalize ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>{MOCK_USER.role}</p>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isProfileOpen ? "rotate-180" : ""} ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />
                </button>

                {isProfileOpen && (
                  <div className={`absolute right-0 top-12 w-52 rounded-2xl shadow-2xl border overflow-hidden ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}>
                    <div className={`px-4 py-3 border-b ${isDarkMode ? "border-gray-800" : "border-gray-100"}`}>
                      <p className={`text-sm font-semibold truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>{MOCK_USER.name}</p>
                      <p className={`text-xs truncate mt-0.5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>{MOCK_USER.email}</p>
                    </div>
                    <div className="py-1.5 px-1.5 space-y-0.5">
                      {[
                        { to: `/${MOCK_USER.role}/settings/profile`, icon: <User className="w-3.5 h-3.5" />, label: "Profile" },
                        { to: `/${MOCK_USER.role}/walletHistory`, icon: <Wallet className="w-3.5 h-3.5" />, label: "Wallet History" },
                        { to: `/${MOCK_USER.role}/settings`, icon: <Settings className="w-3.5 h-3.5" />, label: "Settings" },
                      ].map(({ to, icon, label }) => (
                        <Link
                          key={to}
                          to={to}
                          onClick={() => setIsProfileOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${isDarkMode ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          {icon}{label}
                        </Link>
                      ))}
                      <div className={`my-1 border-t ${isDarkMode ? "border-gray-800" : "border-gray-100"}`} />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors text-red-500 hover:bg-red-500/10"
                      >
                        <LogOut className="w-3.5 h-3.5" />Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* ── Scrollable content ── */}
      <main className={`flex-1 overflow-y-auto content-scroll ${isDarkMode ? "bg-gray-950" : "bg-slate-50"}`}>
        <div className="min-h-full">
          <Outlet />
        </div>
      </main>

      <style>{`
        .content-scroll::-webkit-scrollbar { width: 5px; }
        .content-scroll::-webkit-scrollbar-track { background: transparent; }
        .content-scroll::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.2); border-radius: 10px; }
        .content-scroll { scrollbar-width: thin; scrollbar-color: rgba(128,128,128,0.2) transparent; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default MainContent;