import React, {  useEffect, useState } from "react";
import { 
//   Facebook, 
//   Instagram, 
//   LinkedIn, 
  MapPin, 
  Mail, 
  Phone, 
  X 
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

import Particles from "@tsparticles/react";

// Social Media Icons
const SocialLinks = React.memo(() => {
  const links = [
    { 
      href: "https://facebook.com", 
      icon: <FaFacebookF className="w-5 h-5" />, 
      label: "Facebook" 
    },
    { 
      href: "https://X.com", 
      icon: <X className="w-5 h-5" />, 
      label: "X" 
    },
    { 
      href: "https://instagram.com", 
      icon: <FaInstagram className="w-5 h-5" />, 
      label: "Instagram" 
    },
    { 
      href: "https://linkedin.com", 
      icon: <FaLinkedinIn className="w-5 h-5" />, 
      label: "LinkedIn" 
    },
  ];

  return (
    <div className="flex gap-4 mt-6">
      {links.map(({ href, icon, label }, idx) => (
        <a
          key={idx}
          href={href}
          aria-label={label}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center text-white hover:bg-violet-600 transition floating-icon border border-violet-500/50 hover:scale-110"
        >
          {icon}
        </a>
      ))}
    </div>
  );
});

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const theme = useAppSelector((state) => state.ui.theme);
  const isDarkMode = theme === "dark";
  const [showParticles, setShowParticles] = useState(false);

  // Initialize AOS
  useEffect(() => {
    AOS.init({ 
      duration: 1000,
      once: true 
    });
    
    // Show particles only on larger screens
    if (window.innerWidth > 768) {
      setShowParticles(true);
    }
  }, []);

  return (
    <footer
      className={`relative py-12 overflow-hidden ${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-r from-purple-600 to-purple-400"
      }`}
    >
      {/* Particles Background */}
      {showParticles && (
        <Particles
          id="tsparticles"
          className="absolute inset-0 z-0"
          options={{
            fullScreen: { enable: false },
            background: { color: { value: "transparent" } },
            particles: {
              color: { value: isDarkMode ? "#ffffff" : "#4c1d95" },
              links: {
                enable: true,
                color: isDarkMode ? "#a5b4fc" : "#6b21a8",
                distance: 120,
              },
              move: { 
                enable: true, 
                speed: 0.8 
              },
              number: { value: 80 },
              size: { value: 2.5 },
              opacity: { value: 0.6 },
            },
            interactivity: {
              events: {
                onHover: { enable: true, mode: "repulse" },
              },
            },
          }}
        />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      <div className="relative z-10 container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-center md:text-left">
          
          {/* Logo & About */}
          <div
            className="flex flex-col items-center md:items-start"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="flex items-center gap-3">
              <img
                className="w-[60px] lg:w-[70px] animate-pulse"
                src="https://i.ibb.co.com/TDRpg4tS/Screenshot-2025-03-20-174700-removebg-preview.png"
                alt="Rex Auction"
              />
              <h1 className="text-3xl font-bold text-white tracking-tight">
                <span className="text-violet-400">Rex</span> Auction
              </h1>
            </div>
            <p className="text-gray-300 mt-4 max-w-xs leading-relaxed">
              A reliable platform for bidding and auctioning items. Find great 
              deals or auction your own items today.
            </p>
            <SocialLinks />
          </div>

          {/* Contact Info */}
          <div
            className="flex flex-col"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <h2 className="text-xl font-bold text-white mb-6 relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-violet-500 rounded-full"></span>
            </h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start hover:text-white transition-colors">
                <MapPin className="mr-3 mt-1 text-violet-400 flex-shrink-0" />
                123 Auction Street, NY 10001
              </li>
              <li className="flex items-start hover:text-white transition-colors">
                <Mail className="mr-3 mt-1 text-violet-400 flex-shrink-0" />
                <a 
                  href="mailto:rexauctiontechnorexers@gmail.com"
                  className="hover:underline"
                >
                  rexauctiontechnorexers@gmail.com
                </a>
              </li>
              <li className="flex items-start hover:text-white transition-colors">
                <Phone className="mr-3 mt-1 text-violet-400 flex-shrink-0" />
                <a href="tel:+123456789" className="hover:underline">
                  +1 234 567 89
                </a>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div
            className="flex flex-col"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <h2 className="text-xl font-bold text-white mb-6 relative inline-block">
              Business Hours
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-violet-500 rounded-full"></span>
            </h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex justify-between">
                <span>Mon - Fri:</span>
                <span>9:00 AM - 8:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span>10:00 AM - 6:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span>Closed</span>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div
            className="m-2 p-6 bg-violet-600/20 rounded-2xl border border-violet-500/30 backdrop-blur-sm"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <h3 className="text-white font-semibold mb-3 text-lg">Customer Support</h3>
            <p className="text-gray-300 text-base leading-relaxed">
              Our team is available 24/7 for urgent auction support.
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; {currentYear} Techno Rexers. All rights reserved.</p>
          
          <div className="mt-4 md:mt-0 flex flex-wrap justify-center gap-x-6 gap-y-2">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookie-policy" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;