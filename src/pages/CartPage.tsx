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
          <div key={item.id} className="flex items-center gap-4 bg-card rounded-lg border p-4">
            <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground">{item.name}</h3>
              <p className="text-sm text-muted-foreground">₹{item.price} each</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded bg-secondary hover:bg-primary/10">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded bg-secondary hover:bg-primary/10">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="font-bold text-primary w-20 text-right">₹{item.price * item.quantity}</span>
            <button onClick={() => removeFromCart(item.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded">
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
