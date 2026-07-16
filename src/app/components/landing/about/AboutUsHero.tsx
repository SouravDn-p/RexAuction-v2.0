import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../../../hooks/useTheme";
import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

import auction1 from "@/assets/images/landing/aboutUs/businessman-with-tablet-after-closing-deal.png";
import auction2 from "@/assets/images/landing/aboutUs/auction2.png";
import auction3 from "@/assets/images/landing/aboutUs/business-people-shaking-hands-together.png";
import auction4 from "@/assets/images/landing/aboutUs/auction.png";

const images = [auction1, auction2, auction3, auction4];

const AboutUsHero = () => {
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section
      className={`relative overflow-hidden ${
        isDarkMode
          ? "bg-gray-950"
          : "bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900"
      }`}
    >
      <div className="container mx-auto min-h-screen px-4 py-16 md:py-24 flex flex-col lg:flex-row items-center gap-12">
        {/* Left Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="w-full lg:w-1/2 text-center lg:text-left z-10"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Transforming Online
            <br className="hidden md:block" />
            <span className="text-purple-300"> Auctions </span>
            Since 2015
          </h1>

          <p className="text-purple-100 text-lg md:text-xl mt-6 mb-8 max-w-xl">
            Your trusted platform for exceptional finds, secure transactions,
            and competitive bidding experiences.
          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link to="/auction">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white text-purple-700 font-semibold rounded-xl shadow-lg"
              >
                Explore Auctions
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                howItWorksRef.current?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="px-8 py-3 border-2 border-white text-white rounded-xl font-semibold"
            >
              How It Works
            </motion.button>
          </div>
        </motion.div>

        {/* Right Slider */}
        <div className="w-full lg:w-1/2 relative">
          <div className="relative h-[300px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide}
                src={images[currentSlide]}
                alt={`Auction ${currentSlide + 1}`}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-black/25" />
          </div>

          {/* Indicators */}
          <div className="flex justify-center mt-5 gap-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-10 bg-white"
                    : "w-3 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, index) => (
          <motion.div
            key={index}
            className={`absolute rounded-full ${
              isDarkMode
                ? "bg-purple-700/20"
                : "bg-white/10"
            }`}
            style={{
              width: `${60 + index * 10}px`,
              height: `${60 + index * 10}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
            }}
            transition={{
              duration: 8 + index,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default AboutUsHero;