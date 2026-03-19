import { useEffect, useState } from "react";
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Calendar
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalDishes: number;
}

const DashboardOverview = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [dailySales, setDailySales] = useState<any[]>([]);
  const [orderTrend, setOrderTrend] = useState<any[]>([]);
  const [popularDishes, setPopularDishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Date Range State
  const [dateRange, setDateRange] = useState("last_30_days");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    let start = "";
    let end = "";
    
    const today = new Date();
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    if (dateRange === "today") {
      start = formatDate(today);
      end = formatDate(today);
    } else if (dateRange === "last_7_days") {
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      start = formatDate(lastWeek);
      end = formatDate(today);
    } else if (dateRange === "last_30_days") {
      const lastMonth = new Date(today);
      lastMonth.setDate(today.getDate() - 30);
      start = formatDate(lastMonth);
      end = formatDate(today);
    } else if (dateRange === "custom") {
      start = customStart;
      end = customEnd;
    }

    try {
      const queryParams = new URLSearchParams();
      if (start && end) {
         queryParams.append("start_date", start);
         queryParams.append("end_date", end);
      }
      const res = await fetch(`/api/analytics.php?${queryParams.toString()}`);
      const data = await res.json();
      if (data.status === "success") {
        setStats(data.data.summary);
        setDailySales(data.data.dailySales || []);
        setOrderTrend(data.data.orderTrend || []);
        setPopularDishes(data.data.popularDishes || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dateRange !== "custom" || (customStart && customEnd)) {
        fetchStats();
    }
  }, [dateRange, customStart, customEnd]);

  if (loading && !stats) return <div className="p-8 text-center text-gray-500 font-bold">Loading Dashboard...</div>;

  const cards = [
    { label: "Total Revenue", value: `₹${stats?.totalRevenue || 0}`, icon: DollarSign, color: "bg-blue-500", trend: "Live", positive: true },
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, color: "bg-orange-500", trend: "Live", positive: true },
    { label: "Pending Orders", value: stats?.pendingOrders || 0, icon: Clock, color: "bg-red-500", trend: "Live", positive: false },
    { label: "Menu Items", value: stats?.totalDishes || 0, icon: TrendingUp, color: "bg-green-500", trend: "Catalog", positive: true },
  ];

  const STATUS_COLORS = ['#ef4444', '#f97316', '#22c55e', '#6b7280'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Monitor your restaurant's performance in real-time.</p>
        </div>
        
        {/* Global Date Filter */}
        <div className="flex flex-col items-end gap-2 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-2">
             <Calendar className="h-4 w-4 text-gray-400" />
             <select 
               value={dateRange} 
               onChange={(e) => setDateRange(e.target.value)}
               className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer"
             >
               <option value="today">Today</option>
               <option value="last_7_days">Last 7 Days</option>
               <option value="last_30_days">Last 30 Days</option>
               <option value="custom">Custom Range</option>
             </select>
           </div>
           
           {dateRange === "custom" && (
             <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
               <input 
                 type="date" 
                 value={customStart} 
                 onChange={(e) => setCustomStart(e.target.value)} 
                 className="text-xs p-1.5 border rounded-lg outline-none focus:border-primary"
                 max={customEnd || undefined}
               />
               <span className="text-xs text-gray-400 font-bold">to</span>
               <input 
                 type="date" 
                 value={customEnd} 
                 onChange={(e) => setCustomEnd(e.target.value)} 
                 className="text-xs p-1.5 border rounded-lg outline-none focus:border-primary"
                 min={customStart || undefined}
               />
             </div>
           )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 animate-pulse" />}
            <div className="flex justify-between items-start mb-4">
              <div className={`${card.color} p-3 rounded-xl shadow-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${card.positive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {card.trend}
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
            <h3 className="text-2xl font-extrabold mt-1">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10" />}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold">Revenue Analytics</h2>
          </div>
          <div className="h-[350px]">
            {dailySales.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailySales}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d41121" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#d41121" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#d41121" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 font-bold">No sales data for selected period</div>
            )}
          </div>
        </div>

        {/* Order Types Chart */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden">
          {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10" />}
          <h2 className="text-lg font-bold mb-8">Order Statistics</h2>
          <div className="flex-1 min-h-[300px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderTrend}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="count"
                >
                  {orderTrend.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <p className="text-[32px] font-black text-gray-900 leading-none">{stats?.totalOrders}</p>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">Total Orders</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {orderTrend.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: STATUS_COLORS[i % STATUS_COLORS.length]}}></div>
                <span className="text-xs font-bold text-gray-600 uppercase">{item.status} ({item.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Most Popular Dishes Section */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mt-8 relative overflow-hidden">
        {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10" />}
        <h2 className="text-lg font-bold mb-6">Top 5 Ordered Dishes</h2>
        {popularDishes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {popularDishes.map((dish, i) => (
              <div key={i} className="flex flex-col p-4 bg-gray-50 rounded-2xl border border-border/50 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">#{i + 1}</span>
                  <span className="text-xs font-bold text-muted-foreground bg-white px-2 py-1 rounded-full shadow-sm">{dish.orders} Orders</span>
                </div>
                <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight mt-1">{dish.name}</h3>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-muted-foreground font-medium">
             No completed orders in this time period.
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;
