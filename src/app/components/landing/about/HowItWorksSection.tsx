import { useTheme } from '../../../../hooks/useTheme';
import { motion } from "framer-motion";

import {
  MdHeadsetMic,
} from "react-icons/md";
import {
  FaGavel,
  FaGlobe,
  FaUserCheck,
} from "react-icons/fa";

const HowItWorksSection = ({ howItWorksRef }: { howItWorksRef: React.RefObject<HTMLDivElement | null> }) => {
    const { isDarkMode } = useTheme();

    const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
   <div
        className={`py-16 ${isDarkMode ? "bg-gray-950" : "bg-gray-50"}`}
        ref={howItWorksRef}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              How <span className="text-purple-500">RexAuction</span> Works
            </h2>
            <p
              className={`max-w-2xl mx-auto text-lg ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              A simple guide to bidding and selling on our platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: <FaGavel className="text-3xl" />,
                title: "Browse Auctions",
                description: "Explore thousands of items across categories.",
                color: "from-purple-500 to-indigo-500",
              },
              {
                icon: <FaGavel className="text-3xl" />,
                title: "Place Bids",
                description:
                  "Join live auctions and bid in real-time with updates.",
                color: "from-pink-500 to-rose-500",
              },
              {
                icon: <FaGavel className="text-3xl" />,
                title: "Win & Pay",
                description:
                  "Win items and pay securely with ease ssl commerce.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: <FaUserCheck className="text-3xl" />,
                title: "List Your Item",
                description:
                  "Create listings with photos and details and verification.",
                color: "from-emerald-500 to-teal-500",
              },
              {
                icon: <FaGlobe className="text-3xl" />,
                title: "Reach Global Buyers",
                description:
                  "Showcase items to a worldwide audience within a minute.",
                color: "from-amber-500 to-orange-500",
              },
              {
                icon: <MdHeadsetMic className="text-3xl" />,
                title: "Get Support",
                description:
                  "Our team assists with all your needs and smoother experience.",
                color: "from-violet-500 to-purple-500",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className={`relative group max-w-[300px] mx-auto rounded-xl p-4 sm:p-6 transition-all duration-300 hover:translate-y-[-8px] hover:shadow-xl ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
                role="region"
                aria-label={item.title}
              >
                <div
                  className={`absolute inset-0 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
                    isDarkMode
                      ? "bg-gradient-to-r from-slate-800 to-gray-800"
                      : "bg-gradient-to-r from-violet-100 to-indigo-100"
                  }`}
                />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white mb-4 group-hover:rotate-[360deg] transition-transform duration-500`}
                  >
                    {item.icon}
                  </div>
                  <h3
                    className={`text-base sm:text-lg font-bold mb-2 ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-sm sm:text-base line-clamp-3 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {item.description}
                  </p>
                  <div className="w-12 h-1 rounded-full bg-gradient-to-r from-violet-400 to-indigo-400 mt-4 group-hover:w-20 transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
  )
}

export default HowItWorksSection
