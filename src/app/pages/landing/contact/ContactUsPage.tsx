import { motion } from "framer-motion";
import {
    Briefcase,
    Globe,
    HelpCircle,
    Mail,
    MapPin,
    Phone,
    RefreshCw,
    Send,
    Star,
    User,
    Users,
} from "lucide-react";
import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useTheme } from "../../../../hooks/useTheme";

// ─── Company logos ────────────────────────────────────────────────────────────
const COMPANIES = [
  { name: "Google",    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"              },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"               },
  { name: "Amazon",    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"                  },
  { name: "Netflix",   logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"            },
  { name: "Spotify",   logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"   },
];

// ─── Info cards ───────────────────────────────────────────────────────────────
const INFO_CARDS = [
  {
    icon: <Globe className="w-5 h-5" />,
    accent: "text-purple-400",
    bg: "bg-purple-500/10",
    title: "Across 200+ countries",
    body: "Meet with a product consultant to see how Rex Auction can fit your exact business needs.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    accent: "text-amber-400",
    bg: "bg-amber-500/10",
    title: "225k+ paying customers",
    body: "Explore our tailored pricing plans based on your goals and priorities.",
  },
  {
    icon: <Star className="w-5 h-5" />,
    accent: "text-emerald-400",
    bg: "bg-emerald-500/10",
    title: "Serving 200+ industries",
    body: "Boost productivity from day one by building your team's ideal workflow.",
  },
];

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-3.5 pointer-events-none opacity-50">{icon}</span>
      {children}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
const ContactUsPage = () => {
  const { isDarkMode } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bg      = isDarkMode ? "bg-[#0E0F14]"              : "bg-slate-50";
  const surface = isDarkMode ? "bg-[#161820] border-[#252733]" : "bg-white border-gray-200";
  const text    = isDarkMode ? "text-[#E2E8F0]"             : "text-gray-900";
  const subtext = isDarkMode ? "text-gray-500"              : "text-gray-400";
  const inputCls = [
    "w-full rounded-xl border px-4 py-3 pl-10 text-sm outline-none",
    "focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all",
    isDarkMode
      ? "bg-[#0E0F14] border-[#252733] text-[#E2E8F0] placeholder-gray-600 hover:border-[#3d4055]"
      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 hover:border-gray-300",
  ].join(" ");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message sent! We'll get back to you within 24 hours.", {
        icon: "✉️",
        style: {
          background: isDarkMode ? "#161820" : "#fff",
          color: isDarkMode ? "#E2E8F0" : "#111827",
          border: isDarkMode ? "1px solid #252733" : "1px solid #E5E7EB",
          borderRadius: "12px",
          fontSize: "13px",
        },
      });
      (e.target as HTMLFormElement).reset();
    }, 1600);
  };

  return (
    <div className={`min-h-screen pt-30 pb-16 transition-colors duration-300 ${bg} ${text}`}>
      <Toaster position="top-center" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Page header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${subtext}`}>
            Get in touch
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
            Contact Our Team
          </h1>
          <p className={`text-sm max-w-md mx-auto ${subtext}`}>
            Have questions about Rex Auction? We reply within 24 hours.
          </p>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Form (3/5) ── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className={`lg:col-span-3 rounded-2xl border shadow-sm p-6 sm:p-8 ${surface}`}
          >
            <h2 className="font-bold text-lg mb-1">Send us a message</h2>
            <p className={`text-sm mb-6 ${subtext}`}>We'll respond to every inquiry personally.</p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field icon={<User className="w-4 h-4" />}>
                  <input type="text" placeholder="First name *" required className={inputCls} />
                </Field>
                <Field icon={<User className="w-4 h-4" />}>
                  <input type="text" placeholder="Last name *" required className={inputCls} />
                </Field>
              </div>

              {/* Email + job */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field icon={<Mail className="w-4 h-4" />}>
                  <input type="email" placeholder="Work email *" required className={inputCls} />
                </Field>
                <Field icon={<Briefcase className="w-4 h-4" />}>
                  <input type="text" placeholder="Job title" className={inputCls} />
                </Field>
              </div>

              {/* Phone */}
              <Field icon={<Phone className="w-4 h-4" />}>
                <input type="tel" placeholder="Phone number *" required className={inputCls} />
              </Field>

              {/* Company size */}
              <div className="relative">
                <select
                  required
                  className={[inputCls, "pl-4 cursor-pointer appearance-none"].join(" ")}
                >
                  <option value="">Company size</option>
                  {["1-10", "11-50", "51-200", "200+"].map((s) => (
                    <option key={s} value={s}>{s} employees</option>
                  ))}
                </select>
              </div>

              {/* Primary textarea */}
              <Field icon={<HelpCircle className="w-4 h-4" style={{ marginTop: "2px" }} />}>
                <textarea
                  required
                  placeholder="What would you like to discuss? *"
                  className={[inputCls, "h-28 resize-none"].join(" ")}
                />
              </Field>

              {/* Secondary textarea */}
              <Field icon={<HelpCircle className="w-4 h-4" style={{ marginTop: "2px" }} />}>
                <textarea
                  placeholder="Anything else we should know?"
                  className={[inputCls, "h-24 resize-none"].join(" ")}
                />
              </Field>

              {/* Terms */}
              <label className={`flex items-start gap-3 text-xs cursor-pointer ${subtext}`}>
                <input
                  type="checkbox"
                  required
                  className="mt-0.5 w-4 h-4 rounded accent-purple-600 flex-shrink-0"
                />
                <span>
                  I accept the{" "}
                  <Link
                    to="/terms-of-service"
                    className="text-purple-400 underline underline-offset-2"
                  >
                    Terms of Service
                  </Link>{" "}
                  and acknowledge the Rex Auction{" "}
                  <Link
                    to="/privacy-policy"
                    className="text-purple-400 underline underline-offset-2"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white transition shadow-lg shadow-purple-900/30 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Sending…</>
                ) : (
                  <><Send className="w-4 h-4" /> Send Message</>
                )}
              </button>
            </form>
          </motion.div>

          {/* ── Right column (2/5) ── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {/* Tagline */}
            <div>
              <h2 className="text-2xl font-black leading-snug mb-3">
                Align, collaborate, and gain visibility —
                <span className="text-purple-500"> all in one place.</span>
              </h2>
              <p className={`text-sm leading-relaxed ${subtext}`}>
                Rex Auction brings buyers, sellers, and administrators into a single connected workspace built for speed and transparency.
              </p>
            </div>

            {/* Info cards */}
            <div className="space-y-3">
              {INFO_CARDS.map((card) => (
                <div
                  key={card.title}
                  className={`flex items-start gap-4 p-4 rounded-2xl border transition-colors ${surface}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${card.bg} ${card.accent}`}>
                    {card.icon}
                  </div>
                  <div>
                    <p className={`text-sm font-bold mb-0.5 ${card.accent}`}>{card.title}</p>
                    <p className={`text-xs leading-relaxed ${subtext}`}>{card.body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact links */}
            <div className={`rounded-2xl border p-5 space-y-3 ${surface}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${subtext}`}>Direct contact</p>
              {[
                { icon: <Mail className="w-4 h-4" />, label: "support@rex-auction.com" },
                { icon: <Phone className="w-4 h-4" />, label: "+1 (800) 555-0199" },
                { icon: <MapPin className="w-4 h-4" />, label: "Dhaka, Bangladesh" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-purple-500 flex-shrink-0">{icon}</span>
                  <span className={`text-sm ${subtext}`}>{label}</span>
                </div>
              ))}
            </div>

            {/* Trusted by strip */}
            <div className={`rounded-2xl border p-5 ${surface}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-4 ${subtext}`}>
                Trusted by teams at
              </p>
              <div className="flex flex-wrap gap-4 items-center">
                {COMPANIES.map(({ name, logo }) => (
                  <img
                    key={name}
                    src={logo}
                    alt={name}
                    className={`h-4 w-auto object-contain ${isDarkMode ? "brightness-0 invert opacity-40" : "opacity-50"} hover:opacity-80 transition-opacity`}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;