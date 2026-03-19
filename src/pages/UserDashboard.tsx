import { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  CreditCard, 
  HelpCircle, 
  ChevronRight, 
  RefreshCcw,
  Star,
  Package,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mock data for loyalty and active order
  const loyaltyPoints = 1250;
  const activeOrder = {
    id: "RR-1024",
    status: "Preparing",
    message: "Our chef is preparing your delicious meal... 🍳",
    progress: 45
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // We'll use the existing get_orders.php but might need to filter by user in future
      const res = await fetch("/api/get_orders.php");
      const data = await res.json();
      if (data.status === "success") {
        setOrders(data.orders.slice(0, 5)); // Just show recent 5
      }
    } catch (err) {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-8 rounded-b-[3rem] shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Hello, Alex! ✨</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Gourmet Member</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/20 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-6 space-y-6">
        {/* Activity Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[2rem] shadow-premium border border-gray-100 flex flex-col justify-between h-32">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Orders</p>
              <p className="text-xl font-black text-gray-900">42</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-[2rem] shadow-premium border border-gray-100 flex flex-col justify-between h-32">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loyalty Points</p>
              <p className="text-xl font-black text-gray-900">{loyaltyPoints.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Active Order */}
        <div className="bg-primary text-white p-6 rounded-[2.5rem] shadow-xl shadow-primary/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
             <Clock className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Active Order #{activeOrder.id}</span>
                <h3 className="text-lg font-bold mt-3">{activeOrder.message}</h3>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white animate-pulse" 
                  style={{ width: `${activeOrder.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-80">
                <span>Ordered</span>
                <span>Arriving in 18m</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Recent Orders</h2>
            <Link to="/orders" className="text-[10px] font-black uppercase tracking-widest text-primary">View All</Link>
          </div>

          {loading ? (
            <div className="py-10 flex flex-col items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Fetching history...</p>
            </div>
          ) : orders.map((order) => (
            <div key={order.id} className="bg-white p-5 rounded-[2.5rem] shadow-premium border border-gray-50 flex items-center gap-4 group">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform">
                <Package className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-black text-gray-900 truncate">#{order.id}</h4>
                  <span className="text-[10px] font-bold text-gray-400">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-xs font-bold text-muted-foreground truncate italic">
                  {JSON.parse(order.items || "[]").map((i: any) => i.name).join(", ")}
                </p>
                <div className="flex items-center justify-between mt-3">
                   <p className="text-sm font-black text-primary">₹{order.total_price}</p>
                   <button className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm shadow-gray-100">
                     <RefreshCcw className="h-3 w-3" />
                     Reorder
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Settings Links */}
        <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-50 overflow-hidden divide-y divide-gray-50">
          {[
            { icon: MapPin, text: "Saved Addresses", color: "text-red-500", bg: "bg-red-50" },
            { icon: CreditCard, text: "Payment Methods", color: "text-blue-500", bg: "bg-blue-50" },
            { icon: CheckCircle2, text: "Gourmet Rewards", color: "text-amber-500", bg: "bg-amber-50" },
            { icon: HelpCircle, text: "Help & Support", color: "text-purple-500", bg: "bg-purple-50" },
          ].map((item, i) => (
            <button key={i} className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-1.5xl ${item.bg} ${item.color} flex items-center justify-center`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold text-gray-700">{item.text}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className="max-w-2xl mx-auto px-6 mt-8 pb-10">
        <button 
          onClick={() => {
            localStorage.removeItem("user_authed");
            window.location.href = "/login";
          }}
          className="w-full py-4 text-red-500 font-black text-[10px] uppercase tracking-widest border-2 border-red-50 rounded-[2rem] hover:bg-red-50 transition-colors"
        >
          Sign Out of Royal Restaurant
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
