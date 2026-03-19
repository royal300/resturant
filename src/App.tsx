import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AdminProvider } from "@/contexts/AdminContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import MenuPage from "./pages/MenuPage";
import OrderPage from "./pages/OrderPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ContactPage from "./pages/ContactPage";
import KitchenPage from "./pages/KitchenPage";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLayout from "./components/admin/AdminLayout";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import DashboardOverview from "./pages/admin/DashboardOverview";
import OrderManagement from "./pages/admin/OrderManagement";
import DishManagement from "./pages/admin/DishManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import CouponManagement from "./pages/admin/CouponManagement";
import ComboManagement from "./pages/admin/ComboManagement";
import AnalyticsPage from "./pages/admin/AnalyticsPage";

import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/UserDashboard";
import OrderTrackingPage from "./pages/OrderTrackingPage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthed = localStorage.getItem("user_authed") === "true";
  if (!isAuthed) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Customer Routes */}
              <Route path="/" element={<><Navbar /><main className="min-h-screen food-pattern-bg"><Index /></main><Footer /></>} />
              <Route path="/menu" element={<><Navbar /><main className="min-h-screen food-pattern-bg"><MenuPage /></main><Footer /></>} />
              <Route path="/order" element={<><Navbar /><main className="min-h-screen food-pattern-bg"><OrderPage /></main><Footer /></>} />
              <Route path="/cart" element={<><Navbar /><main className="min-h-screen food-pattern-bg"><CartPage /></main><Footer /></>} />
              <Route path="/checkout" element={<><Navbar /><main className="min-h-screen food-pattern-bg"><CheckoutPage /></main><Footer /></>} />
              <Route path="/contact" element={<><Navbar /><main className="min-h-screen food-pattern-bg"><ContactPage /></main><Footer /></>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><><Navbar /><main className="min-h-screen food-pattern-bg"><UserDashboard /></main><Footer /></></ProtectedRoute>} />
              <Route path="/track/:orderId" element={<ProtectedRoute><><Navbar /><main className="min-h-screen food-pattern-bg"><OrderTrackingPage /></main><Footer /></></ProtectedRoute>} />
              
              {/* Kitchen Panel */}
              <Route path="/kitchen" element={<KitchenPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardOverview />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="menu" element={<DishManagement />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="coupons" element={<CouponManagement />} />
                <Route path="combos" element={<ComboManagement />} />
                <Route path="analytics" element={<AnalyticsPage />} />
              </Route>

              <Route path="*" element={<><Navbar /><NotFound /><Footer /></>} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
