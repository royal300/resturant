import React from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Search, Bell, User } from "lucide-react";

const AdminLayout: React.FC = () => {
  const { isAuthed, adminUser } = useAdmin();
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search orders, dishes, or analytics..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 mx-1"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">{adminUser?.name}</span>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold text-xs uppercase">
                {adminUser?.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
