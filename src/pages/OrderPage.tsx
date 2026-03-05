import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { categories, menuItems, type FoodCategory } from "@/data/menuData";
import FoodCard from "@/components/FoodCard";

const OrderPage = () => {
  const [searchParams] = useSearchParams();
  const initialCat = (searchParams.get("category") as FoodCategory) || "Tandoor";
  const [active, setActive] = useState<FoodCategory>(categories.some(c => c.name === initialCat) ? initialCat : "Tandoor");

  const filtered = menuItems.filter(i => i.category === active);

  return (
    <div className="container mx-auto section-padding">
      <h1 className="section-title text-center mb-8">Order Food</h1>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        {categories.map(c => (
          <button
            key={c.name}
            onClick={() => setActive(c.name)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${active === c.name ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary/10"}`}
          >
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(item => <FoodCard key={item.id} item={item} />)}
      </div>
    </div>
  );
};

export default OrderPage;
