import { Link } from "react-router-dom";
import { useTheme } from "../../../../hooks/useTheme";

const AboutCTASection = () => {
  const isDarkMode = useTheme();
  return (
    <div
          className={`relative overflow-hidden py-20 px-4 sm:px-6 ${
            isDarkMode
              ? "bg-gray-950"
              : "bg-gradient-to-br from-purple-900 to-indigo-900"
          }`}
        >
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => {
              const size = Math.random() * 20 + 10;
              const duration = Math.random() * 20 + 10;
              const delay = Math.random() * 5;
              const color = isDarkMode
                ? `rgba(167, 139, 250, ${Math.random() * 0.3 + 0.1})`
                : `rgba(236, 72, 153, ${Math.random() * 0.3 + 0.1})`;

              return (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: color,
                    opacity: 0.3,
                    animation: `float ${duration}s ease-in-out infinite`,
                    animationDelay: `${delay}s`,
                    filter: "blur(1px)",
                  }}
                />
              );
            })}
          </div>

          <div className="max-w-6xl mx-auto relative z-10 text-center">
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-md`}
            >
              Ready to Get Started?
            </h2>
            <p
              className={`max-w-2xl mx-auto text-lg mb-8 ${
                isDarkMode ? "text-gray-300" : "text-purple-200"
              }`}
            >
              Join thousands of happy users buying and selling on RexAuction
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    new Audio("/sounds/click.mp3")
                      .play()
                      .catch((e) => console.log("Audio play failed:", e));
                  }
                }}
                className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 focus:scale-105 focus:outline-none shadow-lg ${
                  isDarkMode
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-purple-500/30 hover:brightness-110"
                    : "bg-white text-purple-900 hover:shadow-lg hover:shadow-white/20 hover:brightness-95"
                }`}
              >
                Join as Buyer
              </button>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    new Audio("/sounds/click.mp3")
                      .play()
                      .catch((e) => console.log("Audio play failed:", e));
                  }
                }}
                className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 focus:scale-105 focus:outline-none shadow-lg ${
                  isDarkMode
                    ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-indigo-500/30 hover:brightness-110"
                    : "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-purple-500/30 hover:brightness-110"
                }`}
              >
                Start Selling
              </button>
            </div>

            <div className="mt-8">
              <Link
                to="/terms"
                className={`text-sm font-medium transition-colors duration-200 ${
                  isDarkMode
                    ? "text-purple-400 hover:text-purple-300"
                    : "text-purple-300 hover:text-white"
                }`}
              >
                Terms and Conditions
              </Link>
            </div>
          </div>

          {/* CSS for floating animation */}
          <style >{`
            @keyframes float {
              0% {
                transform: translateY(0) translateX(0);
                opacity: 0.3;
              }
              50% {
                transform: translateY(-50px) translateX(20px);
                opacity: 0.6;
              }
              100% {
                transform: translateY(-100px) translateX(0);
                opacity: 0.3;
              }
            }
          `}</style>
        </div>
  )
}

export default AboutCTASection;
