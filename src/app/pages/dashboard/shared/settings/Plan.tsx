import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaCrown } from "react-icons/fa";
import { useTheme } from "../../../../../hooks/useTheme";

const spring = { type: "spring" as const, stiffness: 120, damping: 20 };

interface PlanOption {
  _id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular: boolean;
  color: string;
}

const PLANS: PlanOption[] = [
  {
    _id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    features: ["Browse auctions", "Place up to 5 bids/day", "Basic support", "View auction history"],
    popular: false,
    color: "slate",
  },
  {
    _id: "pro",
    name: "Pro",
    price: 19.99,
    period: "month",
    features: ["Unlimited bids", "Priority support", "Early access to auctions", "Advanced analytics", "Custom alerts", "No transaction fees"],
    popular: true,
    color: "violet",
  },
  {
    _id: "enterprise",
    name: "Enterprise",
    price: 49.99,
    period: "month",
    features: ["Everything in Pro", "Dedicated account manager", "API access", "Custom branding", "Bulk listing tools", "Premium placement", "24/7 phone support"],
    popular: false,
    color: "amber",
  },
];

export default function Plan() {
  const { isDarkMode } = useTheme();
  const [currentPlan] = useState<string>("free");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const card   = `rounded-2xl border ${isDarkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-slate-100 shadow-sm"}`;
  const muted  = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const div    = isDarkMode ? "border-slate-700/60" : "border-slate-100";

  const handleUpgrade = async () => {
    if (!selectedPlan || selectedPlan === currentPlan) return;
    setIsUpgrading(true);
    const toastId = toast.loading("Processing upgrade...");
    await new Promise((r) => setTimeout(r, 1500));
    toast.success(`Successfully upgraded to ${PLANS.find(p => p._id === selectedPlan)?.name}!`, { id: toastId });
    setIsUpgrading(false);
    setSelectedPlan(null);
  };

  return (
    <div className="space-y-5">
      {/* Current Plan Card */}
      <div className={card}>
        <div className={`flex items-center gap-3 px-6 py-4 border-b ${div}`}>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-amber-500/10" : "bg-amber-50"}`}>
            <FaCrown className="text-amber-500 w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className={`text-sm font-semibold ${strong}`}>Subscription Plan</h2>
            <p className={`text-xs ${muted}`}>You're currently on the <span className="font-semibold capitalize text-violet-500">{currentPlan}</span> plan</p>
          </div>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan, i) => {
          const isCurrent = plan._id === currentPlan;
          const isSelected = plan._id === selectedPlan;

          return (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: i * 0.06 }}
              className={`relative rounded-2xl border p-5 cursor-pointer transition-all ${
                isSelected
                  ? "border-violet-500 ring-2 ring-violet-500/20"
                  : isDarkMode
                    ? "bg-slate-800 border-slate-700/60 hover:border-slate-600"
                    : "bg-white border-slate-100 shadow-sm hover:border-slate-300"
              }`}
              onClick={() => !isCurrent && setSelectedPlan(plan._id)}
            >
              {plan.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-600 text-white">
                  Popular
                </div>
              )}

              <div className="mb-4">
                <h3 className={`text-lg font-bold ${strong}`}>{plan.name}</h3>
                <div className="mt-2">
                  <span className={`text-3xl font-bold ${strong}`}>${plan.price}</span>
                  <span className={`text-sm ${muted}`}>/{plan.period}</span>
                </div>
              </div>

              <div className="space-y-2.5 mb-5">
                {plan.features.map((feature, fi) => (
                  <div key={fi} className="flex items-center gap-2">
                    <FaCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span className={`text-xs ${muted}`}>{feature}</span>
                  </div>
                ))}
              </div>

              {isCurrent ? (
                <div className={`w-full py-2.5 rounded-xl text-center text-sm font-medium ${isDarkMode ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                  Current Plan
                </div>
              ) : (
                <div
                  className={`w-full py-2.5 rounded-xl text-center text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-violet-600 text-white"
                      : isDarkMode
                        ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {isSelected ? "Selected" : "Select Plan"}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Upgrade Button */}
      {selectedPlan && selectedPlan !== currentPlan && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <button
            onClick={handleUpgrade}
            disabled={isUpgrading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors disabled:opacity-50"
          >
            {isUpgrading ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <FaCrown className="w-3.5 h-3.5" />
            )}
            {isUpgrading ? "Processing..." : `Upgrade to ${PLANS.find(p => p._id === selectedPlan)?.name}`}
          </button>
        </motion.div>
      )}
    </div>
  );
}
