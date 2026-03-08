import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { categories, menuItems, type FoodCategory } from "@/data/menuData";
import FoodCard from "@/components/FoodCard";
import { Search } from "lucide-react";

const OrderPage = () => {
  const [searchParams] = useSearchParams();
  const initialCat = (searchParams.get("category") as FoodCategory) || "Tandoor";
  const [active, setActive] = useState<FoodCategory>(
    categories.some(c => c.name === initialCat) ? initialCat : "Tandoor"
  );
  const [search, setSearch] = useState("");

  const filtered = menuItems.filter(
    i => i.category === active && (search === "" || i.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-3 py-4 md:px-6 md:py-6">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-card border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
        />
      </div>

      {/* Category Icons - Scrollable */}
      <div className="flex gap-4 overflow-x-auto pb-3 mb-4 scrollbar-hide -mx-3 px-3">
        {categories.map(c => (
          <button
            key={c.name}
            onClick={() => setActive(c.name)}
            className={`flex flex-col items-center gap-1.5 flex-shrink-0 transition-all ${
              active === c.name ? "scale-105" : "opacity-70"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-full overflow-hidden border-2 transition-colors ${
                active === c.name ? "border-primary shadow-md" : "border-transparent"
              }`}
            >
              <img src={c.image} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <span
              className={`text-[11px] font-semibold transition-colors ${
                active === c.name ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {c.name}
            </span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2.5">
        {filtered.map(item => (
          <FoodCard key={item.id} item={item} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12 text-sm">No items found.</p>
      )}
    </div>
  );
};

export default OrderPage;
