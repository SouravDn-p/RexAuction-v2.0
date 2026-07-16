import { FiBell, FiFileText, FiGrid } from "react-icons/fi";
import { useTheme } from "../../../../hooks/useTheme";
import { FaGlobe, FaShieldAlt } from "react-icons/fa";
import { MdHeadsetMic } from "react-icons/md";

const BuyerandSellerSection = () => {
  const { isDarkMode } = useTheme();

  const buyerAndSellerBenefits = [
    {
      icon: <FaShieldAlt />,
      title: "Secure Bidding",
      description: "Advanced security measures to protect your transactions",
      color: "bg-gradient-to-br from-pink-500 to-rose-500",
      shadowColor: "shadow-pink-500/20",
    },
    {
      icon: <FiGrid />,
      title: "Wide Selection",
      description: "Thousands of items across multiple categories",
      color: "bg-gradient-to-br from-purple-500 to-indigo-600",
      shadowColor: "shadow-purple-500/20",
    },
    {
      icon: <FiBell />,
      title: "Real-time Updates",
      description: "Instant notifications on your bid status",
      color: "bg-gradient-to-br from-emerald-500 to-teal-500",
      shadowColor: "shadow-emerald-500/20",
    },
    {
      icon: <FaGlobe />,
      title: "Global Reach",
      description: "Connect with buyers worldwide",
      color: "bg-gradient-to-br from-pink-500 to-rose-500",
      shadowColor: "shadow-pink-500/20",
    },
    {
      icon: <FiFileText />,
      title: "Transparent Process",
      description: "Clear and fair auction procedures",
      color: "bg-gradient-to-br from-purple-500 to-indigo-600",
      shadowColor: "shadow-purple-500/20",
    },
    {
      icon: <MdHeadsetMic />,
      title: "Expert Support",
      description: "Dedicated team to help you succeed",
      color: "bg-gradient-to-br from-emerald-500 to-teal-500",
      shadowColor: "shadow-emerald-500/20",
    },
  ];

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-950" : "bg-white"
      } overflow-hidden py-10`}
    >
      {/* Animation CSS */}
      <style>
        {`
          @keyframes marqueeRight {
            from {
              transform: translateX(-50%);
            }
            to {
              transform: translateX(0%);
            }
          }

          .marquee-track {
            animation: marqueeRight 25s linear infinite;
          }

          .marquee-container:hover .marquee-track {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="flex justify-center items-center">
        <div className="w-full  px-4">
          <h2
            className={`text-3xl md:text-4xl font-bold bg-clip-text text-center text-transparent mb-12 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400`}
          >
            For Buyers and Sellers
          </h2>

          <div className="relative overflow-hidden marquee-container">
            <div className="flex w-max gap-6 marquee-track">
              {[...buyerAndSellerBenefits, ...buyerAndSellerBenefits].map(
                (item, index) => (
                  <div
                    key={index}
                    className={`relative rounded-2xl shadow-lg p-6 md:p-8 w-[300px] md:w-[350px] flex-shrink-0 hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden ${
                      isDarkMode ? "bg-gray-900" : "bg-white"
                    }`}
                  >
                    <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-purple-500 transition-all duration-500 hover:w-full"></div>

                    <div className="flex justify-center mb-4">
                      <div
                        className={`${item.color} ${item.shadowColor} text-white p-4 rounded-xl shadow-lg`}
                      >
                        <span className="text-2xl">{item.icon}</span>
                      </div>
                    </div>

                    <h3
                      className={`font-semibold text-xl text-center mb-3 ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {item.title}
                    </h3>

                    <p
                      className={`text-sm text-center leading-relaxed ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerandSellerSection;