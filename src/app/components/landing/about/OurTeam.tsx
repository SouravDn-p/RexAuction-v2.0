import { useTheme } from "../../../../hooks/useTheme";

import AbirImg from "@/assets/OurTeam/abir.jpg";
import JasminImg from "@/assets/OurTeam/jasminaramim.jpg";
import JoyetaImg from "@/assets/OurTeam/joyetamondal.jpg";
import RohitImg from "@/assets/OurTeam/rohit.jpg";
import SudiptaImg from "@/assets/OurTeam/sudiptaroy.jpg";

const leader = {
  image: "https://res.cloudinary.com/dc6zbxbvm/image/upload/v1777885566/gift-cards/v7tab3od61htcbn2qcmo.jpg",
  name: "Sourav Debnath",
  initials: "SD",
  project_role: "Backend & Systems · Full-stack · Team coordination",
  email: "sdsouravdebnath26@gmail.com",
  bio: "Architected and led the full project — backend systems, server infrastructure, cross-team coordination, and agile delivery. Also contributed to frontend responsiveness and UI coherence across the platform.",
  tags: ["Node.js", "System design", "React.js", "Socket.io", "UI/UX", "Agile"],
  isLeader: true,
};

const coreTeam = [
  {
    image: SudiptaImg,
    name: "Sudipta Roy",
    initials: "SR",
    project_role: "Backend developer · Requirements",
    email: "sudiptaroy@gmail.com",
    bio: "Documented all system requirements and built core backend services with Node.js and MongoDB powering the auction engine.",
    tags: ["Node.js", "Express", "MongoDB", "Socket"],
  },
  {
    image: JasminImg,
    name: "Jasmin Ara Mim",
    initials: "JM",
    project_role: "UI developer · DevOps",
    email: "jasminaramim@gmail.com",
    bio: "Designed and built key UI components while maintaining deployment pipelines and ensuring server reliability for the platform.",
    tags: ["Next.js", "MERN", "Socket", "DevOps"],
  },
  {
    image: JoyetaImg,
    name: "Joyeta Mondal Kotha",
    initials: "JK",
    project_role: "UI & interaction designer",
    email: "dipannitakotha2019@gmail.com",
    bio: "Crafted responsive layouts and animated interactions while bridging frontend views with backend data flows.",
    tags: ["React", "Firebase", "Animation", "MERN"],
  },
  {
    image: RohitImg,
    name: "Rafid Islam Rohit",
    initials: "RI",
    project_role: "Full-stack integration",
    email: "rafidislamrohit@gmail.com",
    bio: "Ensured seamless communication between frontend and backend — every feature working end-to-end without friction.",
    tags: ["Full-stack", "Socket", "MERN"],
  },
  {
    image: AbirImg,
    name: "Nazmul Hasan Abir",
    initials: "NA",
    project_role: "State management · Redux",
    email: "nazmulhasanabir@gmail.com",
    bio: "Built the Redux layer keeping the entire app state predictable, reactive, and in sync with real-time auction updates.",
    tags: ["Redux", "Full-stack", "Socket"],
  },
];

interface TeamMember {
  image: string;
  name: string;
  initials: string;
  project_role: string;
  email: string;
  bio: string;
  tags: string[];
  isLeader?: boolean;
}

const MemberCard = ({ member, isDarkMode }: { member: TeamMember; isDarkMode: boolean }) => (
  <div
    className={`flex flex-col gap-3 p-5 transition-colors duration-150 ${
      isDarkMode ? "hover:bg-gray-800" : "hover:bg-slate-50"
    }`}
  >
    {/* Avatar */}
    <div className="relative w-fit">
      <img
        src={member.image}
        alt={member.name}
        className="w-32 h-32 rounded-full object-cover border"
        style={{
          borderColor: isDarkMode
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.08)",
        }}
      />
    </div>

    {/* Info */}
    <div className="flex flex-col gap-1 flex-1">
      <p
        className={`font-medium text-sm leading-snug ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {member.name}
      </p>
      <p className="text-xs font-medium text-violet-500 leading-snug">
        {member.project_role}
      </p>
      <p
        className={`text-xs leading-relaxed mt-1 ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {member.bio}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        {member.tags.map((tag) => (
          <span
            key={tag}
            className={`text-[10px] px-2 py-0.5 rounded-full border ${
              isDarkMode
                ? "bg-gray-700 text-gray-300 border-gray-600"
                : "bg-gray-100 text-gray-500 border-gray-200"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Email */}
      <p
        className={`text-[11px] mt-2 flex items-center gap-1 ${
          isDarkMode ? "text-gray-500" : "text-gray-400"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3 h-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        {member.email}
      </p>
    </div>
  </div>
);

const LeaderCard = ({ member, isDarkMode }: { member: TeamMember; isDarkMode: boolean }) => (
  <div
    className={`flex flex-col sm:flex-row gap-5 p-6 transition-colors duration-150 ${
      isDarkMode ? "hover:bg-gray-800" : "hover:bg-slate-50"
    }`}
  >
    {/* Avatar */}
    <div className="relative flex-shrink-0 w-fit">
      <img
        src={member.image}
        alt={member.name}
        className="w-40 h-40 rounded-full object-cover border"
        style={{
          borderColor: isDarkMode
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.08)",
        }}
      />
      <span
        className="absolute -bottom-1.5 -right-1.5 text-[9px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap tracking-wide"
        style={{ background: "#534AB7", color: "#EEEDFE" }}
      >
        Team lead
      </span>
    </div>

    {/* Info */}
    <div className="flex flex-col gap-1 flex-1 min-w-0">
      <p
        className={`font-semibold text-base leading-snug ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {member.name}
      </p>
      <p className="text-xs font-medium text-violet-500 leading-snug">
        {member.project_role}
      </p>
      <p
        className={`text-sm leading-relaxed mt-1 ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {member.bio}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-2">
        {member.tags.map((tag) => (
          <span
            key={tag}
            className={`text-[10px] px-2 py-0.5 rounded-full border ${
              isDarkMode
                ? "bg-gray-700 text-gray-300 border-gray-600"
                : "bg-gray-100 text-gray-500 border-gray-200"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Email */}
      <p
        className={`text-[11px] mt-2 flex items-center gap-1 ${
          isDarkMode ? "text-gray-500" : "text-gray-400"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3 h-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        {member.email}
      </p>
    </div>
  </div>
);

const SectionLabel = ({ label, isDarkMode }: { label: string; isDarkMode: boolean }) => (
  <div
    className={`col-span-full px-5 py-2 text-[10px] font-semibold tracking-widest uppercase border-b ${
      isDarkMode
        ? "bg-[#0E0F14] text-gray-500 border-[#252733]"
        : "bg-slate-50 text-gray-400 border-gray-200"
    }`}
  >
    {label}
  </div>
);

const OurTeam = () => {
  const { isDarkMode } = useTheme();

  const borderColor = isDarkMode ? "border-[#252733]" : "border-gray-200";
  const surface = isDarkMode ? "bg-[#161820]" : "bg-white";
  const pageBg = isDarkMode ? "bg-[#0E0F14]" : "bg-slate-50";

  return (
    <div className={`py-4 px-4 ${pageBg}`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <p
            className={`text-xs font-semibold uppercase tracking-widest mb-2 ${
              isDarkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            The people
          </p>
          <h2
            className={`text-2xl sm:text-3xl font-black tracking-tight mb-2 ${
              isDarkMode ? "text-[#E2E8F0]" : "text-gray-900"
            }`}
          >
            Meet the team
          </h2>
          <p
            className={`text-sm max-w-md leading-relaxed ${
              isDarkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            The people who built RexAuction — from system architecture to interface.
          </p>
        </div>

        <div className={`rounded-2xl border overflow-hidden ${borderColor} ${surface}`}>
          {/* Leadership section */}
          <SectionLabel label="Leadership" isDarkMode={isDarkMode} />

          {/* Leader card spans full width */}
          <div className={`border-b ${borderColor}`}>
            <LeaderCard member={leader} isDarkMode={isDarkMode} />
          </div>

          {/* Core team label */}
          <SectionLabel label="Core team" isDarkMode={isDarkMode} />

          {/* Core team grid */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`}
          >
            {coreTeam.map((member, index) => (
              <div
                key={member.name}
                className={`border-b border-r ${borderColor} ${
                  // Remove right border on last in each row (handled via CSS)
                  ""
                }`}
                style={{
                  borderRight:
                    index % 3 === 2 || index === coreTeam.length - 1
                      ? "none"
                      : undefined,
                }}
              >
                <MemberCard member={member} isDarkMode={isDarkMode} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurTeam;