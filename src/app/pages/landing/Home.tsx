import { useEffect } from "react";
import AmazingFeatures from "../../components/landing/home/AmazingFeatures";
import Banner from "../../components/landing/home/Banner";
import BrowsCategory from "../../components/landing/home/BrowsCategory";
import HotAuction from "../../components/landing/home/HotAuction";
import UpcomingAuction from "../../components/landing/home/UpcomingAuction";
import { useAppSelector } from "../../redux/hooks";

function Home() {
  const theme = useAppSelector((state) => state.ui.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === "dark" 
        ? "bg-slate-950 text-white" 
        : "bg-white text-gray-900"
    }`}>
      <Banner />
      {/* <BlogCard /> */}
      <HotAuction />
      <UpcomingAuction />
      <BrowsCategory />
      <AmazingFeatures />
    </div>
  );
}

export default Home;