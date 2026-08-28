import { useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowRight,
  Gavel,
  Globe,
  Headset,
  Mail,
  MapPin,
  Phone,
  Scale,
  Send,
  ShieldCheck,
  Star,
  Store,
  UserCheck,
  Users,
} from "lucide-react";
import { useTheme } from "../../../hooks/useTheme";
import AboutBanner from "../../components/landing/about/AboutBanner";
import OurTeam from "../../components/landing/about/OurTeam";

const STATS = [
  { value: "2015", label: "Founded" },
  { value: "4.8k+", label: "Active bidders" },
  { value: "310+", label: "Verified sellers" },
  { value: "99.9%", label: "Uptime target" },
];

const STEPS = [
  { icon: Gavel, title: "Browse auctions", body: "Filter live and upcoming lots by category, condition, and closing time." },
  { icon: Scale, title: "Place a bid", body: "Submit a bid or set an auto-bid ceiling. Countdown and top offers stay visible." },
  { icon: ShieldCheck, title: "Win and settle", body: "Won lots move to your dashboard for payment, delivery, and history." },
  { icon: Store, title: "List as a seller", body: "Apply from the buyer dashboard. Admin review unlocks listing tools." },
];

const TRUST = [
  { icon: ShieldCheck, accent: "text-violet-400", bg: "bg-violet-500/10", title: "Secure checkout", body: "Payments and wallet activity are isolated per account with a full history." },
  { icon: UserCheck, accent: "text-amber-400", bg: "bg-amber-500/10", title: "Verified sellers", body: "Seller applications include ID, phone, and category review before listing." },
  { icon: Globe, accent: "text-emerald-400", bg: "bg-emerald-500/10", title: "Transparent bidding", body: "Highest bid, recent activity, and time remaining are shown on every live lot." },
  { icon: Headset, accent: "text-sky-400", bg: "bg-sky-500/10", title: "Human support", body: "Disputes, chat, and the in-app assistant cover buyers, sellers, and admins." },
];

const AboutUsPage = () => {
  const { isDarkMode } = useTheme();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);

  const bg = isDarkMode ? "bg-[#0E0F14]" : "bg-slate-50";
  const text = isDarkMode ? "text-[#E2E8F0]" : "text-gray-900";
  const subtext = isDarkMode ? "text-gray-500" : "text-gray-400";
  const surface = isDarkMode ? "bg-[#161820] border-[#252733]" : "bg-white border-gray-200";
  const inputCls = [
    "w-full rounded-xl border px-4 py-3 text-sm outline-none",
    "focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition-all",
    isDarkMode
      ? "bg-[#0E0F14] border-[#252733] text-[#E2E8F0] placeholder-gray-600"
      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400",
  ].join(" ");

  const handleFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please choose a star rating");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Thank you — your feedback was recorded.");
      setRating(0);
      setFeedback("");
    }, 900);
  };

  return (
    <div className={`min-h-screen pb-16 transition-colors duration-300 ${bg} ${text}`}>
      <Toaster position="top-center" />
      <AboutBanner />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-16">
          {STATS.map((s) => (
            <div key={s.label} className={`rounded-2xl border p-4 text-center ${surface}`}>
              <p className="text-xl font-bold text-purple-600">{s.value}</p>
              <p className={`text-xs mt-1 ${subtext}`}>{s.label}</p>
            </div>
          ))}
        </div>

        <section className="mb-16">
          <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${subtext}`}>Our story</p>
          <h2 className="text-2xl font-black tracking-tight mb-6">Why the platform exists</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`rounded-2xl border p-6 sm:p-8 ${surface}`}>
              <p className={`text-sm leading-relaxed mb-4 ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
                Founded in 2015, RexAuction was built to give buyers a trustworthy live-bid room and sellers a path that does not skip identity checks. Lots stay on a public catalog; the work of winning, paying, and fulfilling happens in role dashboards.
              </p>
              <p
                className={`text-sm italic border-l-2 border-violet-500 pl-4 ${
                  isDarkMode ? "text-violet-200" : "text-violet-700"
                }`}
              >
                Transparency on price and seller status matters more than a noisy landing page.
              </p>
            </div>
            <div className="space-y-3">
              {[
                { icon: Users, title: "For buyers", body: "Watch lots, bid, track status, and settle wins from one dashboard." },
                { icon: Store, title: "For sellers", body: "Apply, list with photos, monitor live bids, and fulfill sold items." },
                { icon: ShieldCheck, title: "For operators", body: "Users, seller requests, auctions, finance, and disputes in admin." },
              ].map((item) => (
                <div key={item.title} className={`flex items-start gap-4 p-4 rounded-2xl border ${surface}`}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-violet-500/10 text-violet-400">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold mb-0.5">{item.title}</p>
                    <p className={`text-xs leading-relaxed ${subtext}`}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-16">
          <p className={`text-xs font-semibold uppercase tracking-widest mb-2 text-center ${subtext}`}>How it works</p>
          <h2 className="text-2xl font-black tracking-tight mb-8 text-center">From browse to fulfillment</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STEPS.map((step, i) => (
              <div key={step.title} className={`flex items-start gap-4 p-5 rounded-2xl border ${surface}`}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-violet-500/10 text-violet-400">
                  <step.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-[11px] font-semibold uppercase tracking-wide mb-1 ${subtext}`}>Step {i + 1}</p>
                  <p className="text-sm font-bold mb-1">{step.title}</p>
                  <p className={`text-xs leading-relaxed ${subtext}`}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <p className={`text-xs font-semibold uppercase tracking-widest mb-2 text-center ${subtext}`}>Trust</p>
          <h2 className="text-2xl font-black tracking-tight mb-8 text-center">What we refuse to hide</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TRUST.map((card) => (
              <div key={card.title} className={`flex items-start gap-4 p-5 rounded-2xl border ${surface}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${card.bg} ${card.accent}`}>
                  <card.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className={`text-sm font-bold mb-0.5 ${card.accent}`}>{card.title}</p>
                  <p className={`text-xs leading-relaxed ${subtext}`}>{card.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <OurTeam />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <form onSubmit={handleFeedback} className={`lg:col-span-3 rounded-2xl border p-6 sm:p-8 ${surface}`}>
            <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${subtext}`}>Feedback</p>
            <h2 className="text-lg font-black mb-1">How was the experience?</h2>
            <p className={`text-sm mb-5 ${subtext}`}>Ratings stay on this prototype — they are not posted to a server.</p>
            <div className="flex gap-1.5 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(n)}
                  aria-label={`${n} stars`}
                >
                  <Star
                    className={`w-6 h-6 ${
                      n <= (hoverRating || rating) ? "fill-amber-400 text-amber-400" : mutedStar(isDarkMode)
                    }`}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="What should we improve?"
              className={`${inputCls} h-28 resize-none mb-4`}
            />
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              {sending ? "Sending…" : "Submit feedback"}
            </button>
          </form>

          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className={`rounded-2xl border p-5 space-y-3 ${surface}`}>
              <p className={`text-xs font-semibold uppercase tracking-wide ${subtext}`}>Direct contact</p>
              {[
                { icon: Mail, label: "support@rex-auction.com" },
                { icon: Phone, label: "+1 (800) 555-0199" },
                { icon: MapPin, label: "Dhaka, Bangladesh" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-violet-500">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className={`text-sm ${subtext}`}>{label}</span>
                </div>
              ))}
            </div>
            <Link
              to="/register"
              className={`rounded-2xl border p-5 block ${surface} hover:border-violet-500/40 transition-colors`}
            >
              <p className="text-sm font-bold mb-1">Ready to bid?</p>
              <p className={`text-xs mb-3 ${subtext}`}>Create an account — email verification uses mock OTP 123456.</p>
              <span className="text-sm font-semibold text-violet-500 inline-flex items-center gap-1">
                Create account <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

function mutedStar(isDarkMode: boolean) {
  return isDarkMode ? "text-slate-600" : "text-slate-300";
}

export default AboutUsPage;
