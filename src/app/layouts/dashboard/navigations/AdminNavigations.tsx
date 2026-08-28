import { Handshake, Rss, Scale, ShieldAlert } from "lucide-react";
import { AiOutlineInteraction } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { CiChat2, CiUser, CiViewBoard } from "react-icons/ci";
import { FaBlog, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ImHammer2 } from "react-icons/im";
import { IoChatbubbleEllipsesOutline, IoSettingsOutline, IoWalletOutline } from "react-icons/io5";
import {
  MdAccountBalance,
  MdFeedback,
  MdManageAccounts,
  MdOutlineDashboard,
  MdRateReview,
  MdTipsAndUpdates
} from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { NavLink } from "react-router-dom";

interface AdminNavigationsProps {
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

const AdminNavigations = ({
  colors,
  openDropdown,
  toggleDropdown,
  collapsed = false,
  t,
}: AdminNavigationsProps) => {

  // Use t theme if provided, else fall back to legacy colors strings
  const navActive = t?.navActive ?? `bg-${colors.active} text-gray-800 border-l-2 border-${colors.primary ?? "indigo"}-500`;
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
          Admin Controls
        </p>
      )}

      {/* Dashboard Dropdown */}
      <div>
        {dropdownBtn("Dashboard", <MdOutlineDashboard size={18} />, "dashboard")}
        {openDropdown.dashboard && !collapsed && (
          <div className="ml-3 pl-3 border-l border-dashed border-gray-700/30 space-y-0.5 mt-0.5 mb-1">
            <NavLink to="/admin" end className={navClass}>
              <CiViewBoard size={16} className={iconClass} />
              <span>Overview</span>
            </NavLink>
            <NavLink to="/admin/blog" className={navClass}>
              <FaBlog size={14} className={iconClass} />
              <span>Blog</span>
            </NavLink>
            {/* <NavLink to="/admin/walletHistory" className={navClass}>
              <IoWalletOutline size={16} className={iconClass} />
              <span>Wallet History</span>
            </NavLink> */}
          </div>
        )}
        {/* Collapsed: show direct links as icon-only */}
        {collapsed && (
          <div className="space-y-0.5">
            <NavLink to="/admin" end className={navClass} title="Overview">
              <CiViewBoard size={16} className={iconClass} />
            </NavLink>
            <NavLink to="/admin/blog" className={navClass} title="Blog">
              <FaBlog size={14} className={iconClass} />
            </NavLink>
            {/* <NavLink to="/admin/walletHistory" className={navClass} title="Wallet History">
              <IoWalletOutline size={16} className={iconClass} />
            </NavLink> */}
          </div>
        )}
      </div>

      {/* Inbox Dropdown */}
      <div>
        {dropdownBtn("Inbox", <CiChat2 size={18} />, "inbox")}
        {openDropdown.inbox && !collapsed && (
          <div className="ml-3 pl-3 border-l border-dashed border-gray-700/30 space-y-0.5 mt-0.5 mb-1">
            <NavLink to="/admin/chat" className={navClass}>
              <IoChatbubbleEllipsesOutline size={16} className={iconClass} />
              <span>Chats</span>
            </NavLink>
          </div>
        )}
        {collapsed && (
          <NavLink to="/admin/chat" className={navClass} title="Chats">
            <IoChatbubbleEllipsesOutline size={16} className={iconClass} />
          </NavLink>
        )}
      </div>

      {/* Dispute & Support Dropdown */}
      <div>
        {dropdownBtn("Dispute", <ShieldAlert  size={18} />, "dispute")}
        {openDropdown.dispute && !collapsed && (
          <div className="ml-3 pl-3 border-l border-dashed border-gray-700/30 space-y-0.5 mt-0.5 mb-1">
            <NavLink to="/admin/dispute" className={navClass}>
              <Handshake  size={16} className={iconClass} />
              <span>Disputes</span>
            </NavLink>
          </div>
        )}
        {collapsed && (
          <NavLink to="/admin/dispute" className={navClass} title="Disputes">
            <Handshake  size={16} className={iconClass} />
          </NavLink>
        )}
      </div>

      {/* Management Dropdown */}
      <div>
        {dropdownBtn("Management", <MdManageAccounts size={18} />, "management")}
        {openDropdown.management && !collapsed && (
          <div className="ml-3 pl-3 border-l border-dashed border-gray-700/30 space-y-0.5 mt-0.5 mb-1">
            <NavLink to="/admin/userManagement" className={navClass}>
              <CiUser size={16} className={iconClass} />
              <span>User Management</span>
            </NavLink>
            <NavLink to="/admin/sellerRequest" className={navClass}>
              <AiOutlineInteraction size={16} className={iconClass} />
              <span>Seller Requests</span>
            </NavLink>
          </div>
        )}
        {collapsed && (
          <div className="space-y-0.5">
            <NavLink to="/admin/userManagement" className={navClass} title="Users">
              <CiUser size={16} className={iconClass} />
            </NavLink>
            <NavLink to="/admin/sellerRequest" className={navClass} title="Seller Requests">
              <AiOutlineInteraction size={16} className={iconClass} />
            </NavLink>
          </div>
        )}
      </div>

      {/* Auctions Dropdown */}
      <div>
        {dropdownBtn("Auctions", <ImHammer2 size={16} />, "auctions")}
        {openDropdown.auctions && !collapsed && (
          <div className="ml-3 pl-3 border-l border-dashed border-gray-700/30 space-y-0.5 mt-0.5 mb-1">
            <NavLink to="/admin/manageAuctions" className={navClass}>
              <MdManageAccounts size={16} className={iconClass} />
              <span>Auction Management</span>
            </NavLink>
            <NavLink to="/admin/endedAuctions" className={navClass}>
              <BiCategory size={16} className={iconClass} />
              <span>Ended Auctions</span>
            </NavLink>
          </div>
        )}
        {collapsed && (
          <div className="space-y-0.5">
            <NavLink to="/admin/manageAuctions" className={navClass} title="Manage Auctions">
              <MdManageAccounts size={16} className={iconClass} />
            </NavLink>
            <NavLink to="/admin/endedAuctions" className={navClass} title="Ended Auctions">
              <BiCategory size={16} className={iconClass} />
            </NavLink>
          </div>
        )}
      </div>

        {/* Finance Dropdown */}
      <div>
        {dropdownBtn("Finance", <MdAccountBalance size={16} />, "finance")}
        {openDropdown.finance && !collapsed && (
          <div className="ml-3 pl-3 border-l border-dashed border-gray-700/30 space-y-0.5 mt-0.5 mb-1">
            <NavLink to="/admin/finance" className={navClass}>
              <MdAccountBalance size={16} className={iconClass} />
              <span>Finance Management</span>
            </NavLink>
            <NavLink to="/admin/payment" className={navClass}>
              <BiCategory size={16} className={iconClass} />
              <span>Payment Management</span>
            </NavLink>
          </div>
        )}
        {collapsed && (
          <div className="space-y-0.5">
            <NavLink to="/admin/finance" className={navClass} title="Finance Management">
              <MdAccountBalance size={16} className={iconClass} />
            </NavLink>
            <NavLink to="/admin/payment" className={navClass} title="Payment Management">
              <BiCategory size={16} className={iconClass} />
            </NavLink>
          </div>
        )}
      </div>

      {/* Updates Dropdown */}
      <div>
        {dropdownBtn("Updates", <MdTipsAndUpdates size={18} />, "updates")}
        {openDropdown.updates && !collapsed && (
          <div className="ml-3 pl-3 border-l border-dashed border-gray-700/30 space-y-0.5 mt-0.5 mb-1">
            <NavLink to="/admin/announcement" className={navClass}>
              <Rss size={14} className={iconClass} />
              <span>Announcements</span>
            </NavLink>
            <NavLink to="/admin/cms" className={navClass}>
              <TfiAnnouncement size={14} className={iconClass} />
              <span>CMS</span>
            </NavLink>
            <NavLink to="/admin/feedback" className={navClass}>
              <MdFeedback size={16} className={iconClass} />
              <span>Feedback</span>
            </NavLink>
            <NavLink to="/admin/review" className={navClass}>
              <MdRateReview size={16} className={iconClass} />
              <span>Reviews</span>
            </NavLink>
          </div>
        )}
        {collapsed && (
          <div className="space-y-0.5">
            <NavLink to="/admin/announcement" className={navClass} title="Announcements">
              <Rss size={14} className={iconClass} />
            </NavLink>
            <NavLink to="/admin/CreateAnnouncement" className={navClass} title="Create Announcement">
              <TfiAnnouncement size={14} className={iconClass} />
            </NavLink>
            <NavLink to="/admin/feedback" className={navClass} title="Feedback">
              <MdFeedback size={16} className={iconClass} />
            </NavLink>
            <NavLink to="/admin/review" className={navClass} title="Reviews">
              <MdRateReview size={16} className={iconClass} />
            </NavLink>
          </div>
        )}
      </div>

      {/* Settings Dropdown */}
      <div>
        {dropdownBtn("Settings", <IoSettingsOutline size={18} />, "settings")}
        {openDropdown.settings && !collapsed && (
          <div className="ml-3 pl-3 border-l border-dashed border-gray-700/30 space-y-0.5 mt-0.5 mb-1">
            <NavLink to="/admin/settings/profile" className={navClass}>
              <CiUser size={16} className={iconClass} />
              <span>Profile</span>
            </NavLink>
            <NavLink to="/admin/settings/password" className={navClass}>
              <MdManageAccounts size={16} className={iconClass} />
              <span>Password</span>
            </NavLink>
            <NavLink to="/admin/settings/billings" className={navClass}>
              <IoWalletOutline size={16} className={iconClass} />
              <span>Billings</span>
            </NavLink>
            <NavLink to="/admin/settings/notifications" className={navClass}>
              <MdTipsAndUpdates size={16} className={iconClass} />
              <span>Notifications</span>
            </NavLink>
            <NavLink to="/admin/settings/plan" className={navClass}>
              <BiCategory size={16} className={iconClass} />
              <span>Plan</span>
            </NavLink>
          </div>
        )}
        {collapsed && (
          <NavLink to="/admin/settings" className={navClass} title="Settings">
            <IoSettingsOutline size={18} className={iconClass} />
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default AdminNavigations;