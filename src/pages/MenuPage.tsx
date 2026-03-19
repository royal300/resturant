import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FoodCard from "@/components/FoodCard";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const MenuPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, dishesRes] = await Promise.all([
          fetch("/api/categories.php"),
          fetch("/api/dishes.php")
        ]);
        const catsData = await catsRes.json();
        const dishesData = await dishesRes.json();
        
        if (catsData.status === "success") setCategories(catsData.categories);
        if (dishesData.status === "success") setMenuItems(dishesData.dishes);
      } catch (err) {
        toast.error("Failed to load menu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto section-padding animate-in fade-in duration-700">
      <div className="text-center mb-12">
        <h1 className="section-title mb-3">Our Menu</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">Explore our wide variety of delicious dishes, from spicy tandoor to classic burgers.</p>
      </div>

      {categories.map(cat => {
        const items = menuItems.filter(i => i.category_id === cat.id || i.category_name === cat.name);
        if (items.length === 0) return null;
        
        return (
          <div key={cat.id} className="mb-14">
            <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-3 text-foreground">
              {cat.name} Specials
              <span className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map(item => (
                <FoodCard key={item.id} item={{
                  ...item,
                  price: parseFloat(item.selling_price),
                  image: item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
                  isVeg: item.is_veg === "1" || item.is_veg === true
                }} />
              ))}
            </div>
          </div>
        );
      })}

      <div className="text-center mt-12 bg-white/50 backdrop-blur-sm p-8 rounded-3xl border border-dashed border-gray-200">
        <h3 className="text-lg font-bold mb-4">Craving something specific?</h3>
        <Link to="/order" className="bg-primary text-primary-foreground px-10 py-4 rounded-full font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all inline-block">
          Order for Table Now
        </Link>
      </div>
    </div>
  );
};

export default MenuPage;