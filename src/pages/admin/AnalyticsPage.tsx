import { useEffect, useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area
} from "recharts";
import { Calendar, Download, RefreshCw, Search } from "lucide-react";

const AnalyticsPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Date Range State
  const [dateRange, setDateRange] = useState("last_30_days");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  
  // Search state for Food-wise sales
  const [foodSearch, setFoodSearch] = useState("");

  const fetchAnalytics = async () => {
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
      const json = await res.json();
      if (json.status === "success") setData(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dateRange !== "custom" || (customStart && customEnd)) {
        fetchAnalytics();
    }
  }, [dateRange, customStart, customEnd]);

  if (loading && !data) return <div className="p-8 font-bold text-gray-500 text-center">Loading Analytics...</div>;

  const filteredFoodSales = (data?.foodWiseSales || []).filter((item: any) => 
    item.name.toLowerCase().includes(foodSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics & Reports</h1>
          <p className="text-muted-foreground mt-1">Deep dive into your restaurant's sales and order data.</p>
        </div>
        <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
          
          {/* Global Date Filter */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm relative z-50">
             <Calendar className="h-4 w-4 text-gray-400 ml-2" />
             <select 
               value={dateRange} 
               onChange={(e) => setDateRange(e.target.value)}
               className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer pr-2"
             >
               <option value="today">Today</option>
               <option value="last_7_days">Last 7 Days</option>
               <option value="last_30_days">Last 30 Days</option>
               <option value="custom">Custom Range</option>
             </select>
             
             {dateRange === "custom" && (
               <div className="flex items-center gap-2 px-2 border-l border-gray-100">
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

          <div className="flex items-center gap-2">
            <button 
              onClick={fetchAnalytics}
              className="p-3 bg-white border rounded-xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Download className="h-5 w-5" />
              Download Report
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Full Revenue Area Chart */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 animate-pulse" />}
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Revenue Growth</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border">
              Total: ₹{data?.summary?.totalRevenue || 0}
            </div>
          </div>
          <div className="h-[400px]">
            {data?.dailySales && data.dailySales.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.dailySales}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d41121" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#d41121" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} />
                  <Tooltip 
                    formatter={(value: any) => [`₹${value}`, 'Revenue']}
                    labelFormatter={(label) => `Date: ${label}`}
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', padding: '16px', fontWeight: 'bold'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#d41121" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#areaGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-400 font-bold">No sales data for selected period</div>
            )}
          </div>
        </div>

        {/* Food Wise Sales Bar Chart */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 animate-pulse" />}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h3 className="text-lg font-bold">Food-Wise Sales Analytics</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search food items..." 
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-gray-50 border-transparent border-2 focus:bg-white focus:border-primary/20 focus:outline-none rounded-xl text-sm transition-all"
              />
            </div>
          </div>
          
          <div className="h-[400px]">
             {filteredFoodSales.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={filteredFoodSales} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                   <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                   <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                   <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 600}} width={150} />
                   <Tooltip 
                     formatter={(value: any, name: string) => {
                       return name === 'revenue' ? [`₹${value}`, 'Revenue'] : [value, 'Orders'];
                     }}
                     cursor={{fill: '#f8fafc'}}
                     contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                   />
                   <Bar dataKey="revenue" fill="#f97316" radius={[0, 4, 4, 0]} barSize={20} name="revenue" />
                 </BarChart>
               </ResponsiveContainer>
             ) : (
                <div className="h-full flex items-center justify-center text-gray-400 font-bold">No food items match the criteria</div>
             )}
          </div>
          
          {/* Food Wise Sales Table overlay (optional raw data view) */}
          <div className="mt-8 border-t pt-8">
            <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Detailed Data</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-2">
              {filteredFoodSales.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <span className="font-bold text-gray-900 block line-clamp-1">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.orders} items sold</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-primary block">₹{item.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPage;
