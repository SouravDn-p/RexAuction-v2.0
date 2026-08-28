import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../../hooks/useTheme";

export interface LegalSection {
  heading: string;
  body: string[];
}

interface LegalPageProps {
  kicker: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}

const LegalPage = ({ kicker, title, intro, updated, sections }: LegalPageProps) => {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);
  const bg = isDarkMode ? "bg-[#0E0F14]" : "bg-slate-50";
  const text = isDarkMode ? "text-[#E2E8F0]" : "text-gray-900";
  const muted = isDarkMode ? "text-gray-500" : "text-gray-500";
  const surface = isDarkMode ? "bg-[#161820] border-[#252733]" : "bg-white border-gray-200";

  return (
    <div className={`min-h-screen pt-28 pb-16 ${bg} ${text}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${muted}`}>{kicker}</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">{title}</h1>
        <p className={`text-sm mb-2 ${muted}`}>Last updated {updated}</p>
        <p className={`text-sm leading-relaxed mb-10 ${isDarkMode ? "text-slate-300" : "text-gray-600"}`}>
          {intro}
        </p>

        <div className={`rounded-2xl border divide-y ${surface} ${isDarkMode ? "divide-[#252733]" : "divide-gray-100"}`}>
          {sections.map((section) => (
            <section key={section.heading} className="p-6 sm:p-8">
              <h2 className="text-base font-semibold mb-3">{section.heading}</h2>
              <div className="space-y-3">
                {section.body.map((para) => (
                  <p
                    key={para.slice(0, 48)}
                    className={`text-sm leading-relaxed ${isDarkMode ? "text-slate-400" : "text-gray-600"}`}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className={`text-sm mt-8 ${muted}`}>
          Questions?{" "}
          <Link to="/contactUs" className="text-purple-500 hover:underline">
            Contact us
          </Link>
          {" · "}
          <Link to="/privacy-policy" className="text-purple-500 hover:underline">
            Privacy
          </Link>
          {" · "}
          <Link to="/terms-of-service" className="text-purple-500 hover:underline">
            Terms
          </Link>
          {" · "}
          <Link to="/cookie-policy" className="text-purple-500 hover:underline">
            Cookies
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LegalPage;
