import { Plus, Minus } from "lucide-react";
import type { FoodItem } from "@/data/menuData";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const tagConfig: Record<string, { label: string; className: string }> = {
  popular: { label: "🔥 Popular", className: "bg-accent/15 text-accent" },
  spicy: { label: "🌶 Spicy", className: "bg-primary/10 text-primary" },
  healthy: { label: "🥗 Healthy", className: "bg-success/15 text-success" },
  bestseller: { label: "⭐ Bestseller", className: "bg-secondary/20 text-secondary-foreground" },
};

const FoodCard = ({ item }: { item: FoodItem }) => {
  const { items, addToCart, updateQuantity } = useCart();
  const cartItem = items.find(i => i.id === item.id);

  const handleAdd = () => {
    addToCart(item);
    toast.success(`✔ ${item.name} added to cart`, { duration: 1500 });
  };

  return (
    <div className="flex items-center gap-3.5 bg-card rounded-2xl border border-border/40 p-3 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group shadow-sm">
      {/* Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        {/* Veg/Non-veg indicator */}
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-sm border-2 flex items-center justify-center bg-card/90 ${
            item.isVeg ? "border-success" : "border-primary"
          }`}
        >
          {item.isVeg ? (
            <span className="w-2 h-2 rounded-full bg-success" />
          ) : (
            <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-primary" />
          )}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 py-0.5">
        <h3 className="font-semibold text-foreground text-[13px] leading-tight truncate">{item.name}</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
        
        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {item.tags.slice(0, 2).map(tag => (
              <span key={tag} className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${tagConfig[tag]?.className || ""}`}>
                {tagConfig[tag]?.label || tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-1.5">
          <span className="text-sm font-bold text-foreground">₹{item.price}</span>
          
          {cartItem ? (
            <div className="flex items-center gap-0 bg-primary rounded-full overflow-hidden shadow-md shadow-primary/20">
              <button
                onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                className="p-1.5 text-primary-foreground hover:bg-primary/80 transition-colors active:scale-90"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="text-xs font-bold text-primary-foreground w-6 text-center">{cartItem.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                className="p-1.5 text-primary-foreground hover:bg-primary/80 transition-colors active:scale-90"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1 bg-primary text-primary-foreground px-3.5 py-1.5 rounded-full text-xs font-bold hover:shadow-md hover:shadow-primary/20 transition-all active:scale-95"
            >
              <Plus className="h-3 w-3" /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;