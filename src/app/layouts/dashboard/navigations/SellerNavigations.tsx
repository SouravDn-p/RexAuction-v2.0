import { Ship } from "lucide-react";
import { CiChat2, CiViewBoard } from "react-icons/ci";
import { FaBlog, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ImHammer2 } from "react-icons/im";
import { IoChatbubbleEllipsesOutline, IoSettingsOutline, IoWalletOutline } from "react-icons/io5";
import {
  MdManageAccounts,
  MdMonitor,
  MdOutlineDashboard,
  MdTipsAndUpdates,
} from "react-icons/md";
import { TbMessageReport } from "react-icons/tb";
import { TfiAnnouncement } from "react-icons/tfi";
import { NavLink } from "react-router-dom";
interface SellerNavigationsProps {
  colors: {
    text: string;
    icon: string;
    hover: string;
    active: string;
    primary?: string;
    navActive?: string;
    navHover?: string;
  };
  openDropdown: Record<string, boolean>;
  toggleDropdown: (key: string) => void;
  collapsed?: boolean;
  t?: {
    navActive: string;
    navHover: string;
    text: string;
    icon: string;
    sectionLabel: string;
    border: string;
  };
}

const SellerNavigations = ({
  colors,
  openDropdown,
  toggleDropdown,
  collapsed = false,
  t,
}: SellerNavigationsProps) => {
  // Use t theme if provided, else fall back to legacy colors strings
  const navActive = t?.navActive ?? `bg-${colors.active} text-gray-800 border-l-2 border-${colors.primary ?? "amber"}-500`;
  const navHover = t?.navHover ?? `hover:bg-${colors.hover}`;
  const textClass = t?.text ?? `text-${colors.text}`;
  const iconClass = t?.icon ?? `text-${colors.icon}`;
  const sectionLabel = t?.sectionLabel ?? `text-${colors.icon} opacity-70`;

  // Shared NavLink class builder
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 py-2 px-2.5 rounded-lg text-sm cursor-pointer transition-all duration-150 mb-0.5
    ${isActive ? navActive : `${textClass} ${navHover}`}
    ${collapsed ? "justify-center" : ""}`;

  // Dropdown toggle button
  const dropdownBtn = (label: string, icon: React.ReactNode, key: string) => (
    <button
      onClick={() => toggleDropdown(key)}
      title={collapsed ? label : undefined}
      className={`
        flex items-center w-full py-2 px-2.5 rounded-lg text-sm cursor-pointer transition-all duration-150 mb-0.5
        ${textClass} ${navHover}
        ${collapsed ? "justify-center" : "justify-between"}
      `}
    >
      <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
        <span className={iconClass}>{icon}</span>
        {!collapsed && <span>{label}</span>}
      </div>
      {!collapsed && (
        openDropdown[key]
          ? <FaChevronUp size={11} className={iconClass} />
          : <FaChevronDown size={11} className={iconClass} />
      )}
    </button>
  );

  return (
    <div className="space-y-0.5">
      {!collapsed && (
        <p className={`text-[10px] font-semibold uppercase tracking-widest mb-2 px-2 ${sectionLabel}`}>
          Seller Dashboard
        </p>
      )}

      {/* Dashboard Dropdown */}
      <div>
        {dropdownBtn("Dashboard", <MdOutlineDashboard size={18} />, "dashboard")}
        {openDropdown.dashboard && !collapsed && (
          <div className="ml-3 pl-3 border-l border-dashed border-gray-700/30 space-y-0.5 mt-0.5 mb-1">
            <NavLink to="/seller" end className={navClass}>
              <CiViewBoard size={16} className={iconClass} />
              <span>Overview</span>
            </NavLink>
            <NavLink to="/seller/blog" className={navClass}>
              <FaBlog size={14} className={iconClass} />
              <span>Blog</span>
            </NavLink>
            <NavLink to="/seller/wallet" className={navClass}>
              <IoWalletOutline size={16} className={iconClass} />
              <span>Wallet</span>
            </NavLink>
          </div>
        )}
        {/* Collapsed: show direct links as icon-only */}
        {collapsed && (
          <div className="space-y-0.5">
            <NavLink to="/seller" end className={navClass} title="Overview">
              <CiViewBoard size={16} className={iconClass} />
            </NavLink>
            <NavLink to="/seller/blog" className={navClass} title="Blog">
              <FaBlog size={14} className={iconClass} />
            </NavLink>
            <NavLink to="/seller/wallet" className={navClass} title="Wallet">
              <IoWalletOutline size={16} className={iconClass} />
            </NavLink>
          </div>
        )}
      </div>

      {/* Inbox Dropdown */}
      <div>
        {dropdownBtn("Inbox", <CiChat2 size={18} />, "inbox")}
        {openDropdown.inbox && !collapsed && (
          <div className="ml-3 pl-3 border-l border-dashed border-gray-700/30 space-y-0.5 mt-0.5 mb-1">
            <NavLink to="/seller/chat" className={navClass}>
              <IoChatbubbleEllipsesOutline size={16} className={iconClass} />
              <span>Chats</span>
            </NavLink>
          </div>
        )}
        {collapsed && (
          <NavLink to="/seller/chat" className={navClass} title="Chats">
            <IoChatbubbleEllipsesOutline size={16} className={iconClass} />
          </NavLink>
        )}
      </div>

      {/* Auctions Dropdown */}
      <div>
        {dropdownBtn("Auctions", <ImHammer2 size={16} />, "auctions")}
        {openDropdown.auctions && !collapsed && (
          <div className="ml-3 pl-3 border-l border-dashed border-gray-700/30 space-y-0.5 mt-0.5 mb-1">
            <NavLink to="/seller/manageAuctions" className={navClass}>
              <MdManageAccounts size={16} className={iconClass} />
              <span>Manage Auction</span>
            </NavLink>
            <NavLink to="/seller/monitor-auctions" className={navClass}>
              <MdMonitor size={16} className={iconClass} />
              <span>Live Auctions</span>
            </NavLink>
            <NavLink to="/seller/sold-auctions" className={navClass}>
              <Ship size={16} className={iconClass} />
              <span>Sold Auctions</span>
            </NavLink>
          </div>
        )}
        {collapsed && (
          <div className="space-y-0.5">
            <NavLink to="/seller/manageAuctions" className={navClass} title="Manage Auction">
              <MdManageAccounts size={16} className={iconClass} />
            </NavLink>
            <NavLink to="/seller/monitor-auctions" className={navClass} title="Live Auctions">
              <MdMonitor size={16} className={iconClass} />
            </NavLink>
            <NavLink to="/seller/sold-auctions" className={navClass} title="Sold Auctions">
              <Ship size={16} className={iconClass} />
            </NavLink>
          </div>
        )}
      </div>

      {/* Updates Dropdown */}
      <div>
        {dropdownBtn("Updates", <MdTipsAndUpdates size={18} />, "updates")}
        {openDropdown.updates && !collapsed && (
          <div className="ml-3 pl-3 border-l border-dashed border-gray-700/30 space-y-0.5 mt-0.5 mb-1">
            <NavLink to="/seller/announcement" className={navClass}>
              <TfiAnnouncement size={14} className={iconClass} />
              <span>Announcements</span>
            </NavLink>
            <NavLink to="/seller/reports" className={navClass}>
              <TbMessageReport size={16} className={iconClass} />
              <span>Reports</span>
            </NavLink>
          </div>
        )}
        {collapsed && (
          <div className="space-y-0.5">
            <NavLink to="/seller/announcement" className={navClass} title="Announcements">
              <TfiAnnouncement size={14} className={iconClass} />
            </NavLink>
            <NavLink to="/seller/reports" className={navClass} title="Reports">
              <TbMessageReport size={16} className={iconClass} />
            </NavLink>
          </div>
        )}
      </div>

      {/* Settings Dropdown */}
      <div>
        {dropdownBtn("Settings", <IoSettingsOutline size={18} />, "settings")}
        {openDropdown.settings && !collapsed && (
          <div className="ml-3 pl-3 border-l border-dashed border-gray-700/30 space-y-0.5 mt-0.5 mb-1">
            <NavLink to="/seller/settings/profile" className={navClass}>
              <MdManageAccounts size={16} className={iconClass} />
              <span>Profile</span>
            </NavLink>
            <NavLink to="/seller/settings/password" className={navClass}>
              <MdManageAccounts size={16} className={iconClass} />
              <span>Password</span>
            </NavLink>
            <NavLink to="/seller/settings/billings" className={navClass}>
              <IoWalletOutline size={16} className={iconClass} />
              <span>Billings</span>
            </NavLink>
            <NavLink to="/seller/settings/notifications" className={navClass}>
              <MdTipsAndUpdates size={16} className={iconClass} />
              <span>Notifications</span>
            </NavLink>
            <NavLink to="/seller/settings/plan" className={navClass}>
              <MdOutlineDashboard size={16} className={iconClass} />
              <span>Plan</span>
            </NavLink>
          </div>
        )}
        {collapsed && (
          <NavLink to="/seller/settings" className={navClass} title="Settings">
            <IoSettingsOutline size={18} className={iconClass} />
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default SellerNavigations;