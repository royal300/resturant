import { useCart } from "@/contexts/CartContext";
import { Clock } from "lucide-react";

const KitchenPage = () => {
  const { orders, updateOrderStatus } = useCart();
  const activeOrders = orders.filter(o => o.status !== "Completed");

  const statusColors: Record<string, string> = {
    Pending: "border-warning bg-warning/5",
    Preparing: "border-primary bg-primary/5",
    Ready: "border-success bg-success/5",
  };

  return (
    <div className="container mx-auto section-padding">
      <h1 className="section-title mb-2">Kitchen Dashboard</h1>
      <p className="text-muted-foreground mb-8">Active orders: {activeOrders.length}</p>

      {activeOrders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-muted-foreground">No active orders 🎉</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeOrders.map(order => (
            <div key={order.id} className={`rounded-xl border-2 p-6 ${statusColors[order.status] || "border-border"}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{order.id}</h2>
                  <p className="text-sm text-muted-foreground">Table {order.tableNumber}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {order.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className="font-bold">×{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                {order.status === "Pending" && (
                  <button onClick={() => updateOrderStatus(order.id, "Preparing")} className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg font-medium text-sm">
                    Start Preparing
                  </button>
                )}
                {order.status === "Preparing" && (
                  <button onClick={() => updateOrderStatus(order.id, "Ready")} className="flex-1 bg-success text-success-foreground py-2.5 rounded-lg font-medium text-sm">
                    Mark Ready
                  </button>
                )}
                {order.status === "Ready" && (
                  <button onClick={() => updateOrderStatus(order.id, "Completed")} className="flex-1 bg-muted text-muted-foreground py-2.5 rounded-lg font-medium text-sm">
                    Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KitchenPage;
