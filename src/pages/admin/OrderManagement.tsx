import { useState, useEffect } from "react";
import { Eye, Search, Filter, Printer, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const OrderManagement = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/get_orders.php?all=1");
        const data = await res.json();
        if (data.success) setOrders(data.orders || []);
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = statusFilter === "All" 
    ? orders 
    : orders.filter(o => o.status === statusFilter);

  const statusColors: Record<string, string> = {
    Pending: "bg-orange-50 text-orange-600 border-orange-100",
    Preparing: "bg-blue-50 text-blue-600 border-blue-100",
    Ready: "bg-green-50 text-green-600 border-green-100",
    Completed: "bg-gray-50 text-gray-500 border-gray-100",
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Live Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track all incoming orders in real-time.</p>
        </div>

      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by Order ID, customer or table..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-transparent border-2 focus:bg-white focus:border-primary/20 focus:outline-none rounded-xl text-sm transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2">
          {["All", "Pending", "Preparing", "Ready", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === status 
                ? "bg-primary text-white shadow-md shadow-primary/20" 
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Table</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={8} className="px-6 py-10 text-center text-muted-foreground">Loading orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-10 text-center text-muted-foreground">No orders found matching filters.</td></tr>
              ) : filteredOrders.map((order) => {
                const items = order.items || [];
                const itemSummary = items.map((i: any) => `${i.quantity}x ${i.name}`).join(", ");
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">#{order.id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{order.customer_name}</span>
                        <span className="text-xs text-gray-500 font-medium">{order.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">Table {order.table_number}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 line-clamp-1 max-w-[200px]" title={itemSummary}>{itemSummary}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-extrabold text-gray-900">₹{order.total_price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusColors[order.status] || statusColors.Pending}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-500">
                      {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Mockup */}
        <div className="px-6 py-4 border-t bg-gray-50/50 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-500 uppercase">Showing 1 to {filteredOrders.length} of {filteredOrders.length} orders</p>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border bg-white disabled:opacity-50" disabled><ChevronLeft className="h-4 w-4" /></button>
            <button className="p-2 rounded-lg border bg-white disabled:opacity-50" disabled><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
