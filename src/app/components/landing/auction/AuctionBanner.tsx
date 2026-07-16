import { motion } from "framer-motion";

const AuctionBanner = () => (
  <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
    <div className="absolute inset-0 bg-black">
      <img
        src="https://i.ibb.co/BHFqCZDs/Untitled-design-37.jpg"
        alt="Auction Banner"
        className="w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/50 to-purple-900/50"></div>
    </div>

    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center px-4 w-full max-w-3xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Premium Auctions
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-xl md:text-2xl text-white mb-8 max-w-2xl mx-auto"
        >
          Discover unique treasures and rare collectibles from around the world
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <button
            onClick={() => {
              document
                .getElementById("auction-section")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-lg font-medium rounded-xl hover:from-purple-700 hover:to-purple-600 transition shadow-lg shadow-purple-900/30 transform hover:-translate-y-1"
          >
            Explore All Auctions
          </button>
        </motion.div>
      </motion.div>
    </div>

    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-900 to-transparent"></div>
  </div>
);

export default AuctionBanner
