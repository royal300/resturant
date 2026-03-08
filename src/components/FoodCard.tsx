import { Plus } from "lucide-react";
import type { FoodItem } from "@/data/menuData";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const FoodCard = ({ item }: { item: FoodItem }) => {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(item);
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="flex items-center gap-3 bg-card rounded-xl border p-2.5 hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <span
          className={`absolute top-1 left-1 w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center ${
            item.isVeg
              ? "border-green-600"
              : "border-red-600"
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? "bg-green-600" : "bg-red-600"}`} />
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground text-sm leading-tight truncate">{item.name}</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-sm font-bold text-foreground">₹{item.price}</span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
