import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Utensils, 
  Tags, 
  TicketPercent, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: ShoppingBag, label: "Orders", path: "/admin/orders" },
  { icon: Utensils, label: "Menu Items", path: "/admin/menu" },
  { icon: Tags, label: "Categories", path: "/admin/categories" },
  { icon: TicketPercent, label: "Coupons", path: "/admin/coupons" },
  { icon: TicketPercent, label: "Combos", path: "/admin/combos" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
];

const AdminSidebar: React.FC = () => {
  const { pathname } = useLocation();
  const { logout, adminUser } = useAdmin();

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col fixed left-0 top-0 z-20">
      <div className="p-6 border-b flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Utensils className="h-5 w-5 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight">Royal Admin</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-muted-foreground hover:bg-gray-50 hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "group-hover:text-primary")} />
                <span className="font-medium">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="h-4 w-4" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border">
            <span className="font-bold text-gray-600">{adminUser?.name.charAt(0)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground truncate max-w-[140px]">{adminUser?.name}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{adminUser?.role}</span>
          </div>
        </div>
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
