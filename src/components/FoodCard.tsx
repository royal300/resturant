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
    <div className="bg-card rounded-lg overflow-hidden border hover:shadow-lg transition-shadow animate-fade-in">
      <div className="relative h-48 overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
        <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded ${item.isVeg ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"}`}>
          {item.isVeg ? "VEG" : "NON-VEG"}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground">{item.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-primary">₹{item.price}</span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
