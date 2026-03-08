import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { categories, menuItems, type FoodCategory } from "@/data/menuData";
import FoodCard from "@/components/FoodCard";
import { Search, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

type VegFilter = "all" | "veg" | "nonveg";

const OrderPage = () => {
  const [searchParams] = useSearchParams();
  const initialCat = (searchParams.get("category") as FoodCategory) || "Tandoor";
  const [active, setActive] = useState<FoodCategory>(
    categories.some(c => c.name === initialCat) ? initialCat : "Tandoor"
  );
  const [search, setSearch] = useState("");
  const [vegFilter, setVegFilter] = useState<VegFilter>("all");
  const { totalItems, totalPrice } = useCart();

  const filtered = menuItems.filter(i => {
    if (i.category !== active) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (vegFilter === "veg" && !i.isVeg) return false;
    if (vegFilter === "nonveg" && i.isVeg) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 py-3 md:px-6 md:py-5 pb-24 md:pb-6">
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search for dishes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-card border border-border/60 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow shadow-sm"
        />
      </div>

      {/* Category Icons - Scrollable */}
      <div className="flex gap-3 overflow-x-auto pb-2.5 mb-3 scrollbar-hide -mx-3 px-3">
        {categories.map(c => (
          <button
            key={c.name}
            onClick={() => setActive(c.name)}
            className={`flex flex-col items-center gap-1 flex-shrink-0 transition-all duration-200 ${
              active === c.name ? "scale-105" : "opacity-60 hover:opacity-90"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-full overflow-hidden border-[2.5px] transition-all duration-200 shadow-sm ${
                active === c.name
                  ? "border-primary shadow-md ring-2 ring-primary/20"
                  : "border-transparent"
              }`}
            >
              <img src={c.image} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <span
              className={`text-[10px] font-semibold transition-colors ${
                active === c.name ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {c.name}
            </span>
          </button>
        ))}
      </div>

      {/* Veg/Non-Veg Toggle + Section Title */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold font-display text-foreground flex items-center gap-1.5">
          {categories.find(c => c.name === active)?.emoji} {active}
        </h2>
        
        {/* Toggle */}
        <div className="flex items-center bg-muted rounded-full p-0.5 text-[11px] font-semibold">
          <button
            onClick={() => setVegFilter("all")}
            className={`px-3 py-1 rounded-full transition-all ${
              vegFilter === "all" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setVegFilter("veg")}
            className={`px-3 py-1 rounded-full transition-all ${
              vegFilter === "veg" ? "bg-success text-success-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            🌱 Veg
          </button>
          <button
            onClick={() => setVegFilter("nonveg")}
            className={`px-3 py-1 rounded-full transition-all ${
              vegFilter === "nonveg" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            🍗 Non-Veg
          </button>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-2">
        {filtered.map((item, i) => (
          <div key={item.id} className="animate-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
            <FoodCard item={item} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-sm">No items found.</p>
          <button
            onClick={() => { setSearch(""); setVegFilter("all"); }}
            className="text-primary text-sm font-semibold mt-2 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Floating Cart Button - Mobile */}
      {totalItems > 0 && (
        <div className="fixed bottom-4 left-3 right-3 md:hidden z-40 animate-slide-up">
          <Link
            to="/cart"
            className="flex items-center justify-between bg-primary text-primary-foreground rounded-2xl px-5 py-3.5 shadow-xl shadow-primary/30"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span className="font-bold text-sm">{totalItems} {totalItems === 1 ? "item" : "items"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">₹{totalPrice}</span>
              <span className="text-xs font-semibold bg-primary-foreground/20 px-2 py-0.5 rounded-full">View Cart →</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderPage;