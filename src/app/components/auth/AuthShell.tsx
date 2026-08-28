import { Link } from "react-router-dom";

const BANNER = "https://i.ibb.co.com/Pvc4sVfL/Untitled-design-35.jpg";
const LOGO =
  "https://i.ibb.co.com/TDRpg4tS/Screenshot-2025-03-20-174700-removebg-preview.png";

export const glassCard =
  "w-full rounded-[28px] border border-white/20 bg-white/[0.12] backdrop-blur-[22px] shadow-[0_24px_80px_rgba(0,0,0,0.45)] p-8 sm:p-9";

export const glassInput =
  "w-full rounded-xl border border-white/20 bg-black/25 px-4 py-3 pl-11 text-sm text-white placeholder-white/35 outline-none transition focus:border-purple-400/80 focus:bg-black/30 focus:ring-2 focus:ring-purple-500/25";

export const glassLabel =
  "block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55 mb-1.5";

const AuthShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={BANNER}
          alt=""
          className="w-full h-full object-cover object-center scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/55 to-black/85" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-10">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <img src={LOGO} alt="Rex Auction" className="w-12 h-12 object-contain" />
          <span className="text-white text-xl font-bold">
            <span className="border-b-2 border-purple-500">Rex</span> Auction
          </span>
        </Link>
        {children}
        <p className="mt-6 text-xs text-white/40 text-center max-w-md leading-relaxed">
          <Link to="/privacy-policy" className="hover:text-white/80">
            Privacy Policy
          </Link>
          <span className="mx-2 text-white/20">·</span>
          <Link to="/terms-of-service" className="hover:text-white/80">
            Terms of Service
          </Link>
          <span className="mx-2 text-white/20">·</span>
          <Link to="/cookie-policy" className="hover:text-white/80">
            Cookie Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthShell;
