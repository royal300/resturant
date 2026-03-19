import { Plus, Minus, Star } from "lucide-react";
import type { FoodItem } from "@/data/menuData";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const tagConfig: Record<string, { label: string; className: string }> = {
  popular: { label: "🔥 Popular", className: "bg-orange-50 text-orange-500" },
  spicy: { label: "🌶 Spicy", className: "bg-red-50 text-red-500" },
  healthy: { label: "🥗 Healthy", className: "bg-green-50 text-green-600" },
  bestseller: { label: "⭐ Bestseller", className: "bg-amber-50 text-amber-600" },
};

const FoodCard = ({ item }: { item: FoodItem }) => {
  const { items, addToCart, updateQuantity } = useCart();
  const cartItem = items.find(i => i.id === item.id);

  const handleAdd = () => {
    addToCart(item);
    toast.success(`✔ ${item.name} added`, { 
      duration: 1500,
      className: "rounded-2xl font-bold text-xs uppercase tracking-widest"
    });
  };

  return (
    <div className="group bg-white rounded-[2rem] overflow-hidden shadow-premium shadow-premium-hover border border-gray-100/50 flex flex-col h-full animate-in zoom-in duration-500">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        
        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
           <span className={`w-5 h-5 rounded-md border-2 border-white shadow-sm flex items-center justify-center ${item.isVeg ? "bg-green-500" : "bg-red-500"}`}>
             <div className="w-1.5 h-1.5 rounded-full bg-white" />
           </span>
           {item.tags?.includes("popular") && (
             <span className="bg-white/90 backdrop-blur-sm text-[8px] font-black uppercase tracking-tighter px-2 py-1 rounded-lg shadow-sm">Trending Now</span>
           )}
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-xl shadow-sm flex items-center gap-1">
           <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
           <span className="text-[10px] font-black">4.5</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-sm font-black text-gray-900 tracking-tight leading-tight mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
          <p className="text-[11px] text-gray-400 font-medium line-clamp-2 leading-relaxed mb-3">
            {item.description || "A delicious classic prepared with the finest ingredients and authentic spices."}
          </p>
        </div>

        <div className="flex items-end justify-between mt-auto pt-2">
          <div className="flex flex-col">
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="text-[10px] font-bold text-gray-300 line-through mb-0.5">₹{item.originalPrice}</span>
            )}
            <div className="flex items-center gap-1">
              <span className="text-base font-black text-gray-900 tracking-tight">₹{item.price}</span>
              {item.originalPrice && item.originalPrice > item.price && (
                <span className="text-[8px] font-black text-green-500 bg-green-50 px-1 rounded-md uppercase">OFF</span>
              )}
            </div>
          </div>

          {cartItem ? (
            <div className="flex items-center gap-0 bg-primary rounded-1.5xl overflow-hidden shadow-lg shadow-primary/20">
              <button
                onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                className="p-2 text-white hover:bg-black/10 transition-colors"
                aria-label="Decrease"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="text-xs font-black text-white w-7 text-center">{cartItem.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                className="p-2 text-white hover:bg-black/10 transition-colors"
                aria-label="Increase"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 bg-white text-primary border-2 border-primary/10 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm active:scale-90"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;