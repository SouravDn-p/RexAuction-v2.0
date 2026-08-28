import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import auction1 from "@/assets/images/landing/aboutUs/businessman-with-tablet-after-closing-deal.png";
import auction2 from "@/assets/images/landing/aboutUs/auction2.png";
import auction3 from "@/assets/images/landing/aboutUs/business-people-shaking-hands-together.png";
import auction4 from "@/assets/images/landing/aboutUs/auction.png";

const images = [auction1, auction2, auction3, auction4];

const AboutBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[88vh] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={images[currentSlide]}
          alt="Rex Auction"
          className="w-full h-full object-cover object-center scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/80" />
      </div>

      <div className="absolute top-[20%] left-[10%] w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-yellow-400/20 animate-pulse filter blur-sm pointer-events-none" />

      <div className="absolute inset-0 lg:mt-[100px] flex flex-col items-center justify-center text-center px-2 sm:px-3 text-white pt-[60px] sm:pt-10">
        <div className="relative mb-3 sm:mb-5">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight leading-none">
            <span className="text-yellow-400">OUR</span>{" "}
            <span className="text-white">STORY</span>
          </h1>
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
          <span className="bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">
            TRUSTED AUCTIONS SINCE 2015
          </span>
        </h2>

        <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl opacity-90 leading-relaxed mt-4">
          Rex Auction is where buyers chase rare lots and sellers reach a global floor — with live bidding, verified listings, and a team that actually picks up the phone.
        </p>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-5 w-full px-4">
          <Link
            to="/auction"
            className="relative overflow-hidden group flex-1 sm:flex-none min-w-[200px] max-w-xs bg-gradient-to-br from-purple-500 to-purple-600 text-white px-6 py-3 sm:px-8 sm:py-3 rounded-full font-bold text-sm sm:text-base md:text-lg hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            EXPLORE AUCTIONS
          </Link>
          <Link
            to="/contactUs"
            className="relative overflow-hidden group flex-1 sm:flex-none min-w-[200px] max-w-xs border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-3 rounded-full font-bold text-sm sm:text-base md:text-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:-translate-y-0.5"
          >
            TALK TO US
          </Link>
        </div>

        <div className="flex justify-center mt-8 gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === index ? "w-8 bg-yellow-400" : "w-2 bg-white/50"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutBanner;
