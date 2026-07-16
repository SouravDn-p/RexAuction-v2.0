import { useTheme } from "../../../../hooks/useTheme";
import { motion } from "framer-motion";

import biddingBg from "@/assets/images/landing/aboutUs/auction.png";

const OurStorySection = () => {
    const { isDarkMode } = useTheme();

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    };

  return (
    <div className={`py-16 ${isDarkMode ? "bg-gray-950" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeIn}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row gap-12 items-center"
          >
            <div className="w-full lg:w-1/2 relative">
              <div
                className={`${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } p-2 rounded-xl shadow-2xl`}
              >
                <img
                  className="w-full h-auto rounded-lg object-cover"
                  src={biddingBg}
                  alt="Auction bidding"
                />
              </div>
              <div
                className={`absolute -bottom-6 -right-6 ${
                  isDarkMode ? "bg-purple-900" : "bg-purple-500"
                } p-4 rounded-xl shadow-lg w-1/3`}
              >
                <h3
                  className={`text-lg font-bold ${
                    isDarkMode ? "text-purple-200" : "text-white"
                  }`}
                >
                  Since 2015
                </h3>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-purple-300" : "text-purple-100"
                  }`}
                >
                  Trusted by thousands
                </p>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="mb-2">
                <span
                  className={`px-3 py-1 rounded-full ${
                    isDarkMode
                      ? "bg-purple-900 text-purple-200"
                      : "bg-purple-100 text-purple-600"
                  } text-sm font-semibold`}
                >
                  OUR JOURNEY
                </span>
              </div>
              <h2
                className={`text-3xl md:text-4xl font-bold mb-6 ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                The Story Behind{" "}
                <span className="text-purple-500">RexAuction</span>
              </h2>
              <div
                className={`h-1 w-20 mb-6 ${
                  isDarkMode ? "bg-purple-600" : "bg-purple-400"
                }`}
              ></div>

              <p
                className={`text-lg mb-6 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Founded in 2015, RexAuction emerged from a simple vision: to
                create a trusted space where buyers and sellers could connect
                through exciting online auctions.
              </p>

              <div
                className={`p-6 rounded-lg mb-6 ${
                  isDarkMode ? "bg-gray-800" : "bg-purple-50"
                } border-l-4 border-purple-500`}
              >
                <p
                  className={`italic ${
                    isDarkMode ? "text-purple-200" : "text-purple-600"
                  }`}
                >
                  "Our commitment to transparency and security has made us the
                  preferred choice for both seasoned collectors and first-time
                  bidders."
                </p>
              </div>

              <p
                className={`text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                What started as a small platform has grown into a global
                marketplace, serving millions of users worldwide with unique
                items and memorable bidding experiences.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
  )
}

export default OurStorySection
