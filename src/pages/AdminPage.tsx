import { useCart } from "@/contexts/CartContext";
import { menuItems } from "@/data/menuData";
import { DollarSign, ShoppingBag, Clock, TrendingUp } from "lucide-react";

const AdminPage = () => {
  const { orders, contactMessages, updateOrderStatus } = useCart();

  const totalSales = orders.reduce((s, o) => s + o.total, 0);
  const todayOrders = orders.filter(o => {
    const today = new Date();
    return o.createdAt.toDateString() === today.toDateString();
  });

  // Top selling items
  const itemCounts: Record<string, { name: string; count: number }> = {};
  orders.forEach(o => o.items.forEach(i => {
    if (!itemCounts[i.id]) itemCounts[i.id] = { name: i.name, count: 0 };
    itemCounts[i.id].count += i.quantity;
  }));
  const topItems = Object.values(itemCounts).sort((a, b) => b.count - a.count).slice(0, 5);

  const stats = [
    { icon: DollarSign, label: "Total Sales", value: `₹${totalSales}` },
    { icon: ShoppingBag, label: "Total Orders", value: orders.length },
    { icon: Clock, label: "Today's Orders", value: todayOrders.length },
    { icon: TrendingUp, label: "Menu Items", value: menuItems.length },
  ];

  const statusColors: Record<string, string> = {
    Pending: "bg-warning/20 text-warning",
    Preparing: "bg-primary/20 text-primary",
    Ready: "bg-success/20 text-success",
    Completed: "bg-muted text-muted-foreground",
  };

  return (
    <div className="container mx-auto section-padding">
      <h1 className="section-title mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(s => (
          <div key={s.label} className="bg-card border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10"><s.icon className="h-5 w-5 text-primary" /></div>
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Top Selling */}
      {topItems.length > 0 && (
        <div className="bg-card border rounded-xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4">Top Selling Items</h2>
          <div className="space-y-3">
            {topItems.map((item, i) => (
              <div key={item.name} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="flex items-center gap-3">
                  <span className="text-sm font-bold text-primary">#{i + 1}</span>
                  <span>{item.name}</span>
                </span>
                <span className="text-sm font-medium text-muted-foreground">{item.count} sold</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders */}
      <div className="bg-card border rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Orders ({orders.length})</h2>
        {orders.length === 0 ? (
          <p className="text-muted-foreground">No orders yet</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div>
                    <span className="font-bold">{order.id}</span>
                    <span className="text-sm text-muted-foreground ml-3">{order.customerName} — Table {order.tableNumber}</span>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status]}`}>{order.status}</span>
                </div>
                <p className="text-sm text-muted-foreground">{order.items.map(i => `${i.name} ×${i.quantity}`).join(", ")}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-primary">₹{order.total}</span>
                  <select
                    value={order.status}
                    onChange={e => updateOrderStatus(order.id, e.target.value as any)}
                    className="text-sm border rounded-lg px-3 py-1.5 bg-background"
                  >
                    <option>Pending</option>
                    <option>Preparing</option>
                    <option>Ready</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Messages */}
      <div className="bg-card border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Contact Messages ({contactMessages.length})</h2>
        {contactMessages.length === 0 ? (
          <p className="text-muted-foreground">No messages yet</p>
        ) : (
          <div className="space-y-3">
            {contactMessages.map(msg => (
              <div key={msg.id} className="border rounded-lg p-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{msg.name}</span>
                  <span className="text-muted-foreground">{msg.email}</span>
                </div>
                <p className="text-sm text-muted-foreground">{msg.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
