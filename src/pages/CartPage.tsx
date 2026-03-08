import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto section-padding text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="section-title mb-3">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">Add some delicious items to get started</p>
        <Link to="/order" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto section-padding max-w-3xl">
      <h1 className="section-title mb-8">Your Cart</h1>

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex items-start gap-3 bg-card rounded-2xl border border-border/40 p-3 shadow-sm">
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm leading-tight">{item.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">₹{item.price} each</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-0 rounded-full overflow-hidden border border-border">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors">
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 h-8 flex items-center justify-center text-sm font-bold bg-card">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <span className="font-bold text-primary text-sm">₹{item.price * item.quantity}</span>
              </div>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex-shrink-0">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-card rounded-lg border p-6">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">₹{totalPrice}</span>
        </div>
        <Link to="/checkout" className="mt-4 block text-center bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
