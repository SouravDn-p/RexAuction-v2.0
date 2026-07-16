import React from "react";
import {
  Paintbrush,
  Trophy,
  Laptop,
  Car,
  Gem,
  Shirt,
  Building2,
  Gavel,
  ArrowRight,
  LayoutGrid,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../../../hooks/useTheme";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Category {
  id: number;
  name: string;
  items: string;
  icon: React.ReactNode;
  gradient: string;
  glow: string;
  accent: string; // text color for count
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  { id: 1, name: "Art",          items: "2,847", icon: <Paintbrush className="w-6 h-6" />, gradient: "from-pink-500 to-rose-500",     glow: "rgba(244,63,94,0.3)",   accent: "text-rose-400"    },
  { id: 2, name: "Collectibles", items: "1,934", icon: <Trophy     className="w-6 h-6" />, gradient: "from-amber-500 to-orange-500",  glow: "rgba(245,158,11,0.3)",  accent: "text-amber-400"   },
  { id: 3, name: "Electronics",  items: "3,672", icon: <Laptop     className="w-6 h-6" />, gradient: "from-blue-500 to-indigo-600",   glow: "rgba(99,102,241,0.3)",  accent: "text-indigo-400"  },
  { id: 4, name: "Vehicles",     items: "892",   icon: <Car        className="w-6 h-6" />, gradient: "from-emerald-500 to-teal-600",  glow: "rgba(16,185,129,0.3)",  accent: "text-emerald-400" },
  { id: 5, name: "Jewelry",      items: "1,245", icon: <Gem        className="w-6 h-6" />, gradient: "from-purple-500 to-fuchsia-600",glow: "rgba(168,85,247,0.3)",  accent: "text-purple-400"  },
  { id: 6, name: "Fashion",      items: "4,128", icon: <Shirt      className="w-6 h-6" />, gradient: "from-red-500 to-pink-600",      glow: "rgba(239,68,68,0.3)",   accent: "text-rose-400"    },
  { id: 7, name: "Real Estate",  items: "367",   icon: <Building2  className="w-6 h-6" />, gradient: "from-cyan-500 to-blue-600",     glow: "rgba(6,182,212,0.3)",   accent: "text-cyan-400"    },
  { id: 8, name: "Antiques",     items: "1,673", icon: <Gavel      className="w-6 h-6" />, gradient: "from-yellow-500 to-amber-600",  glow: "rgba(234,179,8,0.3)",   accent: "text-yellow-400"  },
];

// ─── Animation variants ───────────────────────────────────────────────────────
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const cardAnim = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 22 } },
};

// ─── Component ────────────────────────────────────────────────────────────────
const BrowseCategory: React.FC = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const bg      = isDarkMode ? "bg-slate-950 text-white"    : "bg-white text-gray-900";
  const surface = isDarkMode ? "bg-gray-900 text-white border-[#252733]" : "bg-white border-gray-200";
  const subtext = isDarkMode ? "text-gray-500"   : "text-gray-400";
  const text    = isDarkMode ? "text-[#E2E8F0]"  : "text-gray-900";

  const totalItems = CATEGORIES.reduce((s, c) => s + parseInt(c.items.replace(",", "")), 0);

  return (
    <section className={`w-full py-16 sm:py-20 transition-colors duration-300 ${bg}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <LayoutGrid className="w-6 h-6 text-purple-500 flex-shrink-0" />
              <h2 className={`text-3xl font-black tracking-tight ${text}`}>
                Browse Categories
              </h2>
            </div>
            <p className={`text-sm pl-9 ${subtext}`}>
              {totalItems.toLocaleString()}+ items across {CATEGORIES.length} categories
            </p>
          </div>

          <button
            onClick={() => navigate("/auction")}
            className="flex items-center gap-1.5 text-sm font-semibold text-purple-500 hover:text-purple-400 transition-colors group"
          >
            View all auctions
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.div>

        {/* ── Grid ── */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.id}
              variants={cardAnim}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/auction?category=${cat.name}`)}
              className={`relative group rounded-2xl border p-5 cursor-pointer transition-all duration-200 overflow-hidden ${surface}`}
              style={{ boxShadow: "none" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${cat.glow}`;
                (e.currentTarget as HTMLDivElement).style.borderColor = "transparent";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                (e.currentTarget as HTMLDivElement).style.borderColor = "";
              }}
            >
              {/* Subtle glow background on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                style={{
                  background: `radial-gradient(ellipse at top left, ${cat.glow} 0%, transparent 70%)`,
                }}
              />

              <div className="relative z-10 flex flex-col gap-4">
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${cat.gradient} shadow-lg flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}
                >
                  {cat.icon}
                </div>

                {/* Text */}
                <div>
                  <h3 className={`font-bold text-base leading-tight mb-1 ${text}`}>
                    {cat.name}
                  </h3>
                  <p className={`text-xs font-semibold ${cat.accent}`}>
                    {cat.items} items
                  </p>
                </div>

                {/* Arrow — appears on hover */}
                <div className="flex items-center gap-1 mt-auto">
                  <span className={`text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0 ${subtext}`}>
                    Browse
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0 ${subtext}`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Bottom stat strip ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={`mt-12 rounded-2xl border px-6 py-4 flex flex-wrap items-center justify-between gap-4 ${surface}`}
        >
          {[
            { label: "Live auctions",  value: "1,247" },
            { label: "Registered bidders", value: "48,320" },
            { label: "Items sold this week", value: "3,891" },
            { label: "Avg. satisfaction",    value: "4.9 / 5" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center sm:text-left">
              <p className={`text-xs font-medium uppercase tracking-wide ${subtext}`}>{label}</p>
              <p className={`text-xl font-black mt-0.5 ${text}`}>{value}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrowseCategory;