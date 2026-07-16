import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { ImHammer2 } from "react-icons/im";
import { IoSettingsOutline } from "react-icons/io5";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import AdminNavigations from "./navigations/AdminNavigations";
import SellerNavigations from "./navigations/SellerNavigations";
import BuyerNavigations from "./navigations/BuyerNavigations";
import { MOCK_USER } from "../../../data/MOCK_USER";

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar = ({ mobileOpen, onMobileClose }: SidebarProps) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Collapsed only applies on desktop (lg+)
  const [collapsed, setCollapsed] = useState(false);

  const isAdmin = MOCK_USER.role === "admin";
  const isSeller = MOCK_USER.role === "seller";
  const isBuyer = MOCK_USER.role === "buyer";

  const [openDropdown, setOpenDropdown] = useState<Record<string, boolean>>({
    dashboard: false,
    inbox: false,
    auctions: false,
    updates: false,
    management: false,
    buyerAuction: false,
  });

  const toggleDropdown = (key: string) => {
    setOpenDropdown((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const roleTheme: Record<string, any> = {
    admin: {
  gradient: isDarkMode
    ? "from-slate-950 via-slate-900 to-slate-950"
    : "from-white via-slate-50 to-white",

  accent: "indigo",

  badge: isDarkMode
    ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
    : "bg-indigo-50 text-indigo-600 border border-indigo-100",

  border: isDarkMode ? "border-slate-800" : "border-slate-200",

  navActive: isDarkMode
    ? "bg-indigo-500/10 text-indigo-300 border-l-2 border-indigo-400"
    : "bg-indigo-50 text-indigo-700 border-l-2 border-indigo-500",

  navHover: isDarkMode
    ? "hover:bg-slate-800/50"
    : "hover:bg-slate-100",

  text: isDarkMode ? "text-slate-200" : "text-slate-700",
  subtext: isDarkMode ? "text-slate-500" : "text-slate-400",
  icon: isDarkMode ? "text-indigo-400" : "text-indigo-500",
  sectionLabel: isDarkMode ? "text-slate-500" : "text-slate-400",
},
    seller: {
  gradient: isDarkMode
    ? "from-slate-950 via-slate-900 to-slate-950"
    : "from-white via-slate-50 to-white",

  accent: "amber",

  badge: isDarkMode
    ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
    : "bg-amber-50 text-amber-600 border border-amber-100",

  border: isDarkMode ? "border-slate-800" : "border-slate-200",

  navActive: isDarkMode
    ? "bg-amber-500/10 text-amber-300 border-l-2 border-amber-400"
    : "bg-amber-50 text-amber-700 border-l-2 border-amber-500",

  navHover: isDarkMode
    ? "hover:bg-slate-800/50"
    : "hover:bg-slate-100",

  text: isDarkMode ? "text-slate-200" : "text-slate-700",
  subtext: isDarkMode ? "text-slate-500" : "text-slate-400",
  icon: isDarkMode ? "text-amber-400" : "text-amber-500",
  sectionLabel: isDarkMode ? "text-slate-500" : "text-slate-400",
},
    buyer: {
  gradient: isDarkMode
    ? "from-slate-950 via-slate-900 to-slate-950"
    : "from-white via-slate-50 to-white",

  accent: "emerald",

  badge: isDarkMode
    ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
    : "bg-emerald-50 text-emerald-600 border border-emerald-100",

  border: isDarkMode ? "border-slate-800" : "border-slate-200",

  navActive: isDarkMode
    ? "bg-emerald-500/10 text-emerald-300 border-l-2 border-emerald-400"
    : "bg-emerald-50 text-emerald-700 border-l-2 border-emerald-500",

  navHover: isDarkMode
    ? "hover:bg-slate-800/50"
    : "hover:bg-slate-100",

  text: isDarkMode ? "text-slate-200" : "text-slate-700",
  subtext: isDarkMode ? "text-slate-500" : "text-slate-400",
  icon: isDarkMode ? "text-emerald-400" : "text-emerald-500",
  sectionLabel: isDarkMode ? "text-slate-500" : "text-slate-400",
},
  };

  const t = roleTheme[MOCK_USER.role];

  const colors = {
    text: t.text.replace("text-", ""),
    icon: t.icon.replace("text-", ""),
    hover: isDarkMode ? "white/5" : `${t.accent}-50/70`,
    active: isDarkMode ? `${t.accent}-500/20` : `${t.accent}-50`,
    primary: t.accent,
    secondary: t.accent,
    navActive: t.navActive,
    navHover: t.navHover,
  };

  // On mobile: sidebar is always "expanded" (never icon-only)
  // collapsed only applies on lg+
  const isCollapsed = collapsed; // mobile always shows full width

  const SidebarInner = () => (
    <aside
      className={`
        flex flex-col h-full
        border-r ${t.border}
        bg-gradient-to-b ${t.gradient}
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "w-[72px]" : "w-64"}
      `}
    >
      {/* ── Desktop collapse toggle (hidden on mobile) ── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`
          hidden lg:flex
          absolute -right-3.5 top-6 z-20
          w-7 h-7 rounded-full items-center justify-center
          shadow-lg border  cursor-pointer transition-all duration-200
          ${isDarkMode
            ? "bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300"
            : "bg-white border-gray-200 hover:bg-gray-50 text-gray-600"
          }
        `}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* ── Logo ── */}
      <div
        className={`flex items-center h-16 px-4 flex-shrink-0 border-b ${t.border} ${
          isCollapsed ? "justify-center" : "gap-3"
        }`}
      >
        <button
          onClick={() => { navigate("/"); onMobileClose(); }}
          className={`
            w-9 h-9 rounded-xl cursor-pointer flex items-center justify-center flex-shrink-0
            transition-transform hover:scale-105 active:scale-95
            ${isDarkMode ? "bg-white/10" : "bg-indigo-100"}
          `}
        >
          <ImHammer2 className={`text-lg ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`} />
        </button>

        {!isCollapsed && (
          <div className="flex-1 overflow-hidden">
            <h1 className="text-base font-bold cursor-pointer bg-gradient-to-r from-pink-500 to-yellow-400 bg-clip-text text-transparent whitespace-nowrap">
              Rex-Auction
            </h1>
            <p className={`text-[10px] ${t.subtext} whitespace-nowrap`}>
              Dashboard v1.2.0
            </p>
          </div>
        )}

        {/* Mobile close button — only visible on mobile */}
        {!isCollapsed && (
          <button
            onClick={onMobileClose}
            className={`
              lg:hidden ml-auto cursor-pointer w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0
              transition-colors
              ${isDarkMode
                ? "text-gray-400 hover:bg-white/10 hover:text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              }
            `}
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── User profile card ── */}
      <div className={`px-3 py-3 flex-shrink-0 border-b ${t.border}`}>
        <div
          className={`
            flex items-center gap-3 rounded-xl p-2.5 transition-colors
            ${isDarkMode ? "bg-white/5 hover:bg-white/8" : "bg-white/60 hover:bg-white/90"}
            ${isCollapsed ? "justify-center" : ""}
          `}
        >
          <div className="relative flex-shrink-0">
            {MOCK_USER.photoURL ? (
              <img
                src={MOCK_USER.photoURL}
                alt={MOCK_USER.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-pink-400/60"
              />
            ) : (
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ring-2 ring-pink-400/60 font-semibold text-sm
                  ${isDarkMode ? "bg-indigo-700 text-white" : "bg-indigo-600 text-white"}`}
              >
                {MOCK_USER.name.charAt(0)}
              </div>
            )}
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 ${
                isDarkMode ? "border-gray-900" : "border-white"
              } ${MOCK_USER.status === "active" ? "bg-green-400" : "bg-yellow-400"}`}
            />
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-semibold truncate ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {MOCK_USER.name}
              </p>
              <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-md capitalize mt-0.5 ${t.badge}`}>
                {MOCK_USER.role}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5 sidebar-scroll">
        {isAdmin && (
          <AdminNavigations
            colors={colors}
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            collapsed={isCollapsed}
            t={t}
          />
        )}
        {isSeller && (
          <SellerNavigations
            colors={colors}
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            collapsed={isCollapsed}
            t={t}
          />
        )}
        {isBuyer && (
          <BuyerNavigations
            colors={colors}
            openDropdown={openDropdown}
            toggleDropdown={toggleDropdown}
            collapsed={isCollapsed}
            t={t}
          />
        )}

        {/* Common links */}
        <div className={`pt-3 mt-3 border-t ${t.border}`}>
          {!isCollapsed && (
            <p className={`text-[10px] font-semibold uppercase tracking-widest mb-1.5 px-2 ${t.sectionLabel}`}>
              General
            </p>
          )}
          {[
            { to: "/", icon: <FaHome size={16} />, label: "Home" },
            { to: "/admin/settings", icon: <IoSettingsOutline size={17} />, label: "Settings" },
          ].map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              title={isCollapsed ? label : undefined}
              onClick={onMobileClose}
              className={({ isActive }) =>
                `flex items-center gap-3 py-2 px-2.5 rounded-lg mb-0.5 transition-all duration-150 text-sm
                ${isActive ? t.navActive : `${t.text} ${t.navHover}`}
                ${isCollapsed ? "justify-center" : ""}`
              }
            >
              <span className={t.icon}>{icon}</span>
              {!isCollapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ── Footer ── */}
      {!isCollapsed && (
        <div className={`flex-shrink-0 px-4 py-3 border-t ${t.border}`}>
          <p className={`text-[10px] text-center ${t.subtext}`}>
            © 2025 Rex-Auction · All rights reserved
          </p>
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* ── Desktop: in-flow sidebar (participates in layout width) ── */}
      <div className={`hidden lg:block relative flex-shrink-0 h-screen transition-all duration-300 ${isCollapsed ? "w-[72px]" : "w-64"}`}>
        <SidebarInner />
      </div>

      {/* ── Mobile: fixed overlay sidebar (above everything, no layout impact) ── */}
      <div
        className={`
          lg:hidden fixed inset-y-0 left-0 z-40 h-screen
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Always full-width on mobile, never collapsed */}
        <aside
          className={`
            flex flex-col h-full w-72
            border-r ${t.border}
            bg-gradient-to-b ${t.gradient}
            shadow-2xl
          `}
        >
          {/* Logo */}
          <div className={`flex items-center cursor-pointer gap-3 h-16 px-4 flex-shrink-0 border-b ${t.border}`}>
            <button
              onClick={() => { navigate("/"); onMobileClose(); }}
              className={`w-9 h-9 cursor-pointer rounded-xl flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 active:scale-95 ${isDarkMode ? "bg-white/10" : "bg-indigo-100"}`}
            >
              <ImHammer2 className={`text-lg ${isDarkMode ? "text-indigo-300" : "text-indigo-600"}`} />
            </button>
            <div className="flex-1 overflow-hidden">
              <h1 className="text-base font-bold  bg-gradient-to-r from-pink-500 to-yellow-400 bg-clip-text text-transparent whitespace-nowrap">
                Rex-Auction
              </h1>
              <p className={`text-[10px] ${t.subtext} whitespace-nowrap`}>Dashboard v1.2.0</p>
            </div>
            <button
              onClick={onMobileClose}
              className={`ml-auto w-8 h-8 flex items-center justify-center rounded-xl flex-shrink-0 transition-colors ${isDarkMode ? "text-gray-400 hover:bg-white/10 hover:text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"}`}
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User card */}
          <div className={`px-3 py-3 flex-shrink-0 border-b ${t.border}`}>
            <div className={`flex items-center gap-3 rounded-xl p-2.5 ${isDarkMode ? "bg-white/5" : "bg-white/60"}`}>
              <div className="relative flex-shrink-0">
                {MOCK_USER.photoURL ? (
                  <img src={MOCK_USER.photoURL} alt={MOCK_USER.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-pink-400/60" />
                ) : (
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ring-2 ring-pink-400/60 font-semibold text-sm ${isDarkMode ? "bg-indigo-700 text-white" : "bg-indigo-600 text-white"}`}>
                    {MOCK_USER.name.charAt(0)}
                  </div>
                )}
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 ${isDarkMode ? "border-gray-900" : "border-white"} ${MOCK_USER.status === "active" ? "bg-green-400" : "bg-yellow-400"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold truncate ${isDarkMode ? "text-white" : "text-gray-800"}`}>{MOCK_USER.name}</p>
                <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-md capitalize mt-0.5 ${t.badge}`}>{MOCK_USER.role}</span>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5 sidebar-scroll">
            {isAdmin && (
              <AdminNavigations
                colors={colors}
                openDropdown={openDropdown}
                toggleDropdown={toggleDropdown}
                collapsed={false}
                t={t}
              />
            )}
            {isSeller && (
              <SellerNavigations
                colors={colors}
                openDropdown={openDropdown}
                toggleDropdown={toggleDropdown}
                collapsed={false}
                t={t}
              />
            )}
            {isBuyer && (
              <BuyerNavigations
                colors={colors}
                openDropdown={openDropdown}
                toggleDropdown={toggleDropdown}
                collapsed={false}
                t={t}
              />
            )}

            <div className={`pt-3 mt-3 border-t ${t.border}`}>
              <p className={`text-[10px] font-semibold uppercase tracking-widest mb-1.5 px-2 ${t.sectionLabel}`}>General</p>
              {[
                { to: "/", icon: <FaHome size={16} />, label: "Home" },
                { to: "/admin/settings", icon: <IoSettingsOutline size={17} />, label: "Settings" },
              ].map(({ to, icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={onMobileClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2 px-2.5 rounded-lg mb-0.5 transition-all duration-150 text-sm
                    ${isActive ? t.navActive : `${t.text} ${t.navHover}`}`
                  }
                >
                  <span className={t.icon}>{icon}</span>
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </nav>

          <div className={`flex-shrink-0 px-4 py-3 border-t ${t.border}`}>
            <p className={`text-[10px] text-center ${t.subtext}`}>© 2025 Rex-Auction · All rights reserved</p>
          </div>
        </aside>
      </div>

      <style>{`
        .sidebar-scroll::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .sidebar-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }
      `}</style>
    </>
  );
};

export default Sidebar;