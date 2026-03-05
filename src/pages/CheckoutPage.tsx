import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const CheckoutPage = () => {
  const { items, totalPrice, placeOrder } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", table: "" });

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.table.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    const order = placeOrder(form.name.trim(), form.phone.trim(), form.table.trim());
    toast.success(`Order ${order.id} placed successfully!`);
    navigate("/");
  };

  return (
    <div className="container mx-auto section-padding max-w-2xl">
      <h1 className="section-title mb-8">Checkout</h1>

      {/* Order Summary */}
      <div className="bg-card rounded-lg border p-6 mb-6">
        <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
        {items.map(item => (
          <div key={item.id} className="flex justify-between py-2 border-b last:border-0 text-sm">
            <span>{item.name} × {item.quantity}</span>
            <span className="font-medium">₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between pt-4 font-bold text-lg">
          <span>Total</span>
          <span className="text-primary">₹{totalPrice}</span>
        </div>
      </div>

      {/* Customer Form */}
      <form onSubmit={handleSubmit} className="bg-card rounded-lg border p-6 space-y-4">
        <h2 className="font-semibold text-lg mb-2">Your Details</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground"
            placeholder="Enter your name"
            maxLength={100}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground"
            placeholder="Enter your phone number"
            maxLength={15}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Table Number</label>
          <input
            type="text"
            value={form.table}
            onChange={e => setForm(p => ({ ...p, table: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground"
            placeholder="e.g. 5"
            maxLength={10}
          />
        </div>

        <div className="pt-2">
          <p className="text-sm text-muted-foreground mb-3">💳 Payment: Dummy Payment (Simulated)</p>
          <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
