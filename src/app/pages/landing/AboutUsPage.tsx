import  { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { useTheme } from "../../../hooks/useTheme";
import AboutUsHero from "../../components/landing/about/AboutUsHero";
import OurStorySection from "../../components/landing/about/OurStorySection";
import RateUsSection from "../../components/landing/about/RateUsSection";
import OurTeam from "../../components/landing/about/OurTeam";
import HowItWorksSection from "../../components/landing/about/HowItWorksSection";
import BuyerandSellerSection from "../../components/landing/about/BuyerandSellerSection";
import TrustSection from "../../components/landing/about/TrustSection";

const AboutUsPage = () => {
  const howItWorksRef = useRef(null);
  const { isDarkMode } = useTheme();
  
  const darkModeStyles = {
    backgroundColor: isDarkMode ? "#1a1a1a" : "",
    color: isDarkMode ? "#ffffff" : "",
  };

  const {inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });


  useEffect(() => {
    if (inView) {
      // Animation can be triggered here if needed in the future
    }
  }, [inView]);

  return (
    <div style={darkModeStyles} className="overflow-x-hidden">
      <AboutUsHero />
      <OurStorySection />
      <TrustSection />
      <HowItWorksSection howItWorksRef={howItWorksRef} />
      <BuyerandSellerSection />
      <OurTeam />
      <RateUsSection />
      {/* {!user && (
        <AboutCTASection />
      )} */}

       {/* <AboutCTASection /> */}
    </div>
  );
};

export default AboutUsPage;
