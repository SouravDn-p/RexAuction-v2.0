import { NavLink } from "react-router-dom";
import { CiChat2, CiSquareQuestion, CiViewBoard } from "react-icons/ci";
import { FaChevronDown, FaChevronUp, FaBlog } from "react-icons/fa";
import {
  MdHistory,
  MdOutlineDashboard,
  MdTipsAndUpdates,
} from "react-icons/md";
import { IoChatbubbleEllipsesOutline, IoWalletOutline, IoSettingsOutline } from "react-icons/io5";
import { TfiAnnouncement } from "react-icons/tfi";
import { RiAuctionLine } from "react-icons/ri";
import { CreditCard, Trophy } from "lucide-react";

interface BuyerNavigationsProps {
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

const BuyerNavigations = ({
  colors,
  openDropdown,
  toggleDropdown,
  collapsed = false,
  t,
}: BuyerNavigationsProps) => {
  // Use t theme if provided, else fall back to legacy colors strings
  const navActive = t?.navActive ?? `bg-${colors.active} text-gray-800 border-l-2 border-${colors.primary ?? "emerald"}-500`;
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
          Buyer Dashboard
        </p>
      )}

      {/* Dashboard Dropdown */}
      <div>
        {dropdownBtn("Dashboard", <MdOutlineDashboard size={18} />, "dashboard")}
        {openDropdown.dashboard && !collapsed && (
          <div className="ml-3 pl-3 border-l border-dashed border-gray-700/30 space-y-0.5 mt-0.5 mb-1">
            <NavLink to="/buyer" end className={navClass}>
              <CiViewBoard size={16} className={iconClass} />
              <span>Overview</span>
            </NavLink>
            <NavLink to="/buyer/blog" className={navClass}>
              <FaBlog size={14} className={iconClass} />
              <span>Blog</span>
            </NavLink>
            <NavLink to="/buyer/payments" className={navClass}>
              <CreditCard size={16} className={iconClass} />
              <span>Payments</span>
            </NavLink>
          </div>
        )}
        {/* Collapsed: show direct links as icon-only */}
        {collapsed && (
          <div className="space-y-0.5">
            <NavLink to="/buyer" end className={navClass} title="Overview">
              <CiViewBoard size={16} className={iconClass} />
            </NavLink>
            <NavLink to="/buyer/blog" className={navClass} title="Blog">
              <FaBlog size={14} className={iconClass} />
            </NavLink>
            <NavLink to="/buyer/payments" className={navClass} title="Payments">
              <CreditCard size={16} className={iconClass} />
            </NavLink>
          </div>
        )}
      </div>

      {/* Inbox Dropdown */}
      <div>
        {dropdownBtn("Inbox", <CiChat2 size={18} />, "inbox")}
        {openDropdown.inbox && !collapsed && (
          <div className="ml-3 pl-3 border-l border-dashed border-gray-700/30 space-y-0.5 mt-0.5 mb-1">
            <NavLink to="/buyer/chat" className={navClass}>
              <IoChatbubbleEllipsesOutline size={16} className={iconClass} />
              <span>Chats</span>
            </NavLink>
          </div>
        )}
        {collapsed && (
          <NavLink to="/buyer/chat" className={navClass} title="Chats">
            <IoChatbubbleEllipsesOutline size={16} className={iconClass} />
          </NavLink>
        )}
      </div>

      {/* Auction Activities Dropdown */}
      <div>
        {dropdownBtn("Auction Activities", <RiAuctionLine size={18} />, "buyerAuction")}
        {openDropdown.buyerAuction && !collapsed && (
          <div className="ml-3 pl-3 border-l border-dashed border-gray-700/30 space-y-0.5 mt-0.5 mb-1">
            <NavLink to="/buyer/status" className={navClass}>
              <RiAuctionLine size={16} className={iconClass} />
              <span>Auction Status</span>
            </NavLink>
            <NavLink to="/buyer/won-auctions" className={navClass}>
              <Trophy size={16} className={iconClass} />
              <span>Won Auctions</span>
            </NavLink>
          </div>
        )}
        {collapsed && (
          <div className="space-y-0.5">
            <NavLink to="/buyer/status" className={navClass} title="Auction Status">
              <RiAuctionLine size={16} className={iconClass} />
            </NavLink>
            <NavLink to="/buyer/won-auctions" className={navClass} title="Won Auctions">
              <Trophy size={16} className={iconClass} />
            </NavLink>
          </div>
        )}
      </div>

      {/* Updates Dropdown */}
      <div>
        {dropdownBtn("Updates", <MdTipsAndUpdates size={18} />, "updates")}
        {openDropdown.updates && !collapsed && (
          <div className="ml-3 pl-3 border-l border-dashed border-gray-700/30 space-y-0.5 mt-0.5 mb-1">
            <NavLink to="/buyer/announcement" className={navClass}>
              <TfiAnnouncement size={14} className={iconClass} />
              <span>Announcements</span>
            </NavLink>
          </div>
        )}
        {collapsed && (
          <NavLink to="/buyer/announcement" className={navClass} title="Announcements">
            <TfiAnnouncement size={14} className={iconClass} />
          </NavLink>
        )}
      </div>

      {/* Settings Dropdown */}
      <div>
        {dropdownBtn("Settings", <IoSettingsOutline size={18} />, "settings")}
        {openDropdown.settings && !collapsed && (
          <div className="ml-3 pl-3 border-l border-dashed border-gray-700/30 space-y-0.5 mt-0.5 mb-1">
            <NavLink to="/buyer/settings/profile" className={navClass}>
              <MdOutlineDashboard size={16} className={iconClass} />
              <span>Profile</span>
            </NavLink>
            <NavLink to="/buyer/settings/password" className={navClass}>
              <MdOutlineDashboard size={16} className={iconClass} />
              <span>Password</span>
            </NavLink>
            <NavLink to="/buyer/settings/billings" className={navClass}>
              <IoWalletOutline size={16} className={iconClass} />
              <span>Billings</span>
            </NavLink>
            <NavLink to="/buyer/settings/notifications" className={navClass}>
              <MdTipsAndUpdates size={16} className={iconClass} />
              <span>Notifications</span>
            </NavLink>
            <NavLink to="/buyer/settings/plan" className={navClass}>
              <MdHistory size={16} className={iconClass} />
              <span>Plan</span>
            </NavLink>
          </div>
        )}
        {collapsed && (
          <NavLink to="/buyer/settings" className={navClass} title="Settings">
            <IoSettingsOutline size={18} className={iconClass} />
          </NavLink>
        )}
      </div>

      {/* Become Seller Link */}
      <NavLink to="/buyer/becomeSeller" className={navClass}>
        <CiSquareQuestion size={16} className={iconClass} />
        {!collapsed && <span>Become Seller</span>}
      </NavLink>
    </div>
  );
};

export default BuyerNavigations;
