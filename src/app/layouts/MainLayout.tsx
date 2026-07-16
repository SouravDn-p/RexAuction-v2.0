import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Agent from "../components/bot/Agent";

const MainLayout = () => {
  const location = useLocation();
  const head =
    location.pathname.includes("login") ||
    location.pathname.includes("register") ||
    location.pathname.includes("forgotPassword");
  return (
    <div>
    {head || <Navbar />}
      <main>
        <Outlet />
      </main>
     {head || <Agent />}
     {head || <Footer />}
    </div>
  );
};

export default MainLayout;