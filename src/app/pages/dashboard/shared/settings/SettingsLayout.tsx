import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import { useTheme } from "../../../../../hooks/useTheme";

const spring = { type: "spring" as const, stiffness: 120, damping: 20 };

export default function SettingsLayout() {
  const { isDarkMode } = useTheme();

  const muted  = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            borderRadius: "10px",
            background: isDarkMode ? "#1e293b" : "#fff",
            color: isDarkMode ? "#f1f5f9" : "#0f172a",
            border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0",
          },
        }}
      />

      <div className="mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <h1 className={`text-2xl font-bold ${strong}`}>Settings</h1>
          <p className={`text-sm mt-1 ${muted}`}>Manage your account preferences</p>
        </motion.div>

        <div className="grid grid-cols-1  gap-6">
          {/* Sidebar Tabs */}
          {/* <motion.div
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.05 }}
            className={card}
          >
            <div className="p-3 space-y-1">
              {tabs.map((tab) => {
                const isActive = location.pathname.endsWith(`/settings/${tab.path}`) || 
                  (tab.path === "profile" && location.pathname.endsWith("/settings"));
                return (
                  <NavLink
                    key={tab.path}
                    to={`${basePath}/${tab.path}`}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive ? activeBg : inactiveBg
                    }`}
                  >
                    <tab.icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </motion.div> */}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
