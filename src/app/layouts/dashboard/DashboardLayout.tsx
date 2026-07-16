import { useState } from "react";
import { useTheme } from "../../../hooks/useTheme";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  const { isDarkMode } = useTheme();
  // Mobile drawer state — lifted here so MainContent header button can control it
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className={`h-screen w-screen flex overflow-hidden relative ${
        isDarkMode ? "bg-gray-950" : "bg-slate-50"
      }`}
    >
      {/* ── Mobile backdrop overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ──
          Desktop: in-flow, pushes content
          Mobile:  fixed overlay, slides in from left
      */}
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <MainContent onMobileMenuOpen={() => setMobileOpen(true)} />
      </div>
    </div>
  );
};

export default DashboardLayout;