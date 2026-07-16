import { createBrowserRouter } from "react-router-dom";

import DashboardLayout from "../layouts/dashboard/DashboardLayout";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import AboutUsPage from "../pages/landing/AboutUsPage";
import AuctionPage from "../pages/landing/AuctionPage";
import BlogPage from "../pages/landing/blog/BlogPage";
import BlogDetails from "../pages/landing/blog/details/Blogdetails";
import ContactUsPage from "../pages/landing/contact/ContactUsPage";
import Home from "../pages/landing/Home";
import Terms from "../pages/landing/terms/Terms";
import NotFound from "../pages/NotFound";

import ProtectedRoute from "./ProtectedRoute";

// Buyer Routes
import Chat from "../components/chat/Chat";
import BidHistory from "../components/dashboard/buyer/BidHistory";
import Announcement from "../components/dashboard/shared/Announcement";
import BecomeSellerPage from "../pages/dashboard/buyer/become-seller/BecomeSellerPage";
import BuyerBlogPage from "../pages/dashboard/buyer/blog/BuyerBlogPage";
import BuyerCreateBlogPage from "../pages/dashboard/buyer/blog/BuyerCreateBlogPage";
import BuyerDashboardPage from "../pages/dashboard/buyer/BuyerDashboardPage";
import BuyerWalletPage from "../pages/dashboard/buyer/wallet/BuyerWalletPage";
import BuyerAuctionStatusPage from "../pages/dashboard/buyer/status/BuyerAuctionStatusPage";

// Seller Routes
import CreateAuction from "../pages/dashboard/seller/auction/CreateAuction";
import SellerBlogPage from "../pages/dashboard/seller/blog/SellerBlogPage";
import SellerCreateBlogPage from "../pages/dashboard/seller/blog/SellerCreateBlogPage";
import SellerPaymentPage from "../pages/dashboard/seller/payments/SellerPaymentPage";
import SellerDashboardPage from "../pages/dashboard/seller/SellerDashboardPage";
import ReportsPage from "../pages/dashboard/shared/ReportsPage";

// Admin Routes
import AdminDashboardPage from "../pages/dashboard/admin/AdminDashboardPage";
import AdminAuctionManagementPage from "../pages/dashboard/admin/auctions/AdminAuctionManagementPage";
import EndedAuctionsHistoryPage from "../pages/dashboard/admin/auctions/EndedAuctionsHistoryPage";
import AdminBlogPage from "../pages/dashboard/admin/blog/AdminBlogPage";
import AdminCreateBlogPage from "../pages/dashboard/admin/blog/AdminCreateBlogPage";
import FeedbackDisplayPage from "../pages/dashboard/admin/feedback/FeedbackDisplayPage";
import SellerRequestPage from "../pages/dashboard/admin/seller/SellerRequestPage";
import UserManagementPage from "../pages/dashboard/admin/user/UserManagementPage";

// Settings Routes
import BillingSettings from "../pages/dashboard/shared/settings/BillingSettings";
import NotificationSettings from "../pages/dashboard/shared/settings/NotificationSettings";
import PasswordSettings from "../pages/dashboard/shared/settings/PasswordSettings";
import Plan from "../pages/dashboard/shared/settings/Plan";
import ProfileSettings from "../pages/dashboard/shared/settings/ProfileSettings";
import SettingsLayout from "../pages/dashboard/shared/settings/SettingsLayout";


// Shared Components
import WalletHistoryPage from "../components/shared/WalletHistoryPage";
import AdminAnnouncementsPage from "../pages/dashboard/admin/announcement/Adminannouncementspage";
import AdminCMSPage from "../pages/dashboard/admin/announcement/Admincmspage";
import DisputeSupportPage from "../pages/dashboard/admin/dispute/Disputesupportpage";
import AdminReviewsPage from "../pages/dashboard/admin/feedback/AdminReviewsPage";
import FinancialManagementPage from "../pages/dashboard/admin/finance/FinancialManagementPage";
import PaymentManagementPage from "../pages/dashboard/admin/payments/PaymentManagementPage";
import BuyerWonAuctionsDetailsPage from "../pages/dashboard/buyer/status/BuyerWonAuctionsDetailsPage";
import BuyerWonAuctionsPage from "../pages/dashboard/buyer/status/BuyerWonAuctionsPage";
import SellerManageAuctionDetailPage from "../pages/dashboard/seller/auction/SellerManageAuctionDetailPage";
import SellerAuctionManagementPage from "../pages/dashboard/seller/auction/SellerManageAuctionPage";
import LiveAuctionPage from "../pages/landing/auction/LiveAuctionPage";
import BidAuctionMonitoringPage from "../pages/dashboard/seller/auction/Bidauctionmonitoringpage";
import Postauctionfulfillmentpage from "../pages/dashboard/seller/auction/Postauctionfulfillmentpage";
import SellerWalletPage from "../components/dashboard/buyer/wallet/Sellerwalletpage";

export const router = createBrowserRouter([
{
  path: "/",
  element: <MainLayout />,
  errorElement: <NotFound />,
  children: [
    { index: true, element: <Home /> },
    { path: "auction", element: <AuctionPage /> },
    { path: "liveAuction/:id", element: <LiveAuctionPage /> },

    { path: "aboutUs", element: <AboutUsPage /> },
    { path: "contactUs", element: <ContactUsPage /> },
    { path: "blogs", element: <BlogPage /> },
    { path: "blogDetails/:id", element: <BlogDetails /> },
    { path: "terms", element: <Terms /> },
    { path: "login", element: <Login /> },
    { path: "register", element: <RegisterPage /> },
  ],
},

// =========================
// ADMIN ROUTES
// =========================
{
  path: "/admin",
  element: <ProtectedRoute allowedRoles={["admin"]} />,
  children: [
    {
      element: <DashboardLayout />,
      children: [
        { index: true, element: <AdminDashboardPage />  },

        { path: "chat", element: <Chat /> },
        { path: "blog", element: <AdminBlogPage /> },
        { path: "create-blog", element: <AdminCreateBlogPage /> },
        // { path: "walletHistory", element: <WalletHistoryPage /> },

        {
        path: "feedback",
        element: <FeedbackDisplayPage />,
        },
        { path: "review", element: <AdminReviewsPage /> },
        { path: "dispute", element: <DisputeSupportPage /> },

        { path: "userManagement", element: <UserManagementPage /> },
        { path: "sellerRequest", element: <SellerRequestPage /> },

        { path: "finance", element: <FinancialManagementPage /> },
        { path: "payment", element: <PaymentManagementPage /> },

        { path: "endedAuctions", element: <EndedAuctionsHistoryPage /> },
        { path: "manageAuctions", element: <AdminAuctionManagementPage /> },

        { path: "announcement", element: <AdminAnnouncementsPage /> },
        { path: "cms", element: <AdminCMSPage /> },

        {
          path: "settings",
          element: <SettingsLayout />,
          children: [
            { index: true, element: <ProfileSettings /> },
            { path: "profile", element: <ProfileSettings /> },
            { path: "password", element: <PasswordSettings /> },
            { path: "billings", element: <BillingSettings /> },
            { path: "notifications", element: <NotificationSettings /> },
            { path: "plan", element: <Plan /> },
          ],
        },
      ],
    },
  ],
},

// =========================
// SELLER ROUTES
// =========================
{
  path: "/seller",
  element: <ProtectedRoute allowedRoles={["seller"]} />,
  children: [
    {
      element: <DashboardLayout />,
      children: [
        { index: true, element: <SellerDashboardPage />},

        { path: "blog", element: <SellerBlogPage /> },
        { path: "create-blog", element: <SellerCreateBlogPage /> },

        { path: "announcement", element: <Announcement /> },
        { path:"payments" , element:<SellerPaymentPage /> },

        { path: "chat", element: <Chat /> },
        { path: "reports", element: <ReportsPage /> },
        { path: "wallet", element: <SellerWalletPage /> },

        { path:"manageAuctions" , element:<SellerAuctionManagementPage /> },
        { path :"monitor-auctions" , element:<BidAuctionMonitoringPage /> },
        { path: "sold-auctions", element: <Postauctionfulfillmentpage /> },

        // { path: "manageAuctions/:id", element: <SellerManageAuctionDetailPage /> },

        { path: "create-auction", element: <CreateAuction />},
        { path: "my-auctions", element: <div>My Auctions</div> },
        { path: "bids", element: <div>Incoming Bids</div> },

        {
          path: "settings",
          element: <SettingsLayout />,
          children: [
            { index: true, element: <ProfileSettings /> },
            { path: "profile", element: <ProfileSettings /> },
            { path: "password", element: <PasswordSettings /> },
            { path: "billings", element: <BillingSettings /> },
            { path: "notifications", element: <NotificationSettings /> },
            { path: "plan", element: <Plan /> },
          ],
        },
      ],
    },
  ],
},

// =========================
// BUYER ROUTES
// =========================
{
  path: "/buyer",
  element: <ProtectedRoute allowedRoles={["buyer"]} />,
  children: [
    {
      element: <DashboardLayout />,
      children: [
        { index: true, element: <BuyerDashboardPage /> },
        { path:"blog" , element:<BuyerBlogPage /> },
        { path:"wallet" , element:<BuyerWalletPage /> },
        { path: "create-blog", element: <BuyerCreateBlogPage /> },

        { path: "announcement", element: <Announcement /> },

        { path: "status", element: <BuyerAuctionStatusPage /> },
        { path: "won-auctions", element: <BuyerWonAuctionsPage /> },
        { path: "won-auctions/:id", element: <BuyerWonAuctionsDetailsPage /> },

        { path: "becomeSeller", element: <BecomeSellerPage /> },
        { path: "bidHistory", element: <BidHistory /> },

        { path: "chat", element: <Chat /> },

        {
          path: "settings",
          element: <SettingsLayout />,
          children: [
            { index: true, element: <ProfileSettings /> },
            { path: "profile", element: <ProfileSettings /> },
            { path: "password", element: <PasswordSettings /> },
            { path: "billings", element: <BillingSettings /> },
            { path: "notifications", element: <NotificationSettings /> },
            { path: "plan", element: <Plan /> },
          ],
        },
      ],
    },
  ],
},
{
  path: "*",
  element: <NotFound />,
},
]);