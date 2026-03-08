import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { categories, menuItems, type FoodCategory } from "@/data/menuData";
import FoodCard from "@/components/FoodCard";
import { Search, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

type VegFilter = "all" | "veg" | "nonveg";

const VegIcon = () => (
  <span className="inline-flex items-center justify-center w-4 h-4 border-2 border-success rounded-sm">
    <span className="w-2 h-2 rounded-full bg-success" />
  </span>
);

const NonVegIcon = () => (
  <span className="inline-flex items-center justify-center w-4 h-4 border-2 border-primary rounded-sm">
    <span className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[7px] border-b-primary" />
  </span>
);

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
    <div className="min-h-screen food-pattern-bg">
      <div className="max-w-7xl mx-auto px-3 py-3 md:px-6 md:py-5 pb-28 md:pb-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for dishes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-card border border-border/50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow shadow-sm font-medium placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Category Icons - Scrollable */}
        <div className="flex gap-4 overflow-x-auto pb-3 mb-4 scrollbar-hide -mx-3 px-3">
          {categories.map(c => (
            <button
              key={c.name}
              onClick={() => setActive(c.name)}
              className={`flex flex-col items-center gap-2 flex-shrink-0 transition-all duration-300 ${
                active === c.name ? "scale-105" : "hover:scale-[1.03]"
              }`}
            >
              <div
                className={`w-16 h-16 md:w-[76px] md:h-[76px] rounded-full overflow-hidden border-[3px] transition-all duration-300 p-0.5 ${
                  active === c.name
                    ? "border-primary shadow-lg shadow-primary/25 ring-2 ring-primary/15"
                    : "border-border/40 hover:border-border"
                }`}
              >
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              </div>
              <span
                className={`text-[13px] font-medium transition-colors duration-200 whitespace-nowrap ${
                  active === c.name
                    ? "text-primary font-semibold"
                    : "text-foreground"
                }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {c.name}
              </span>
            </button>
          ))}
        </div>

        {/* Veg/Non-Veg Toggle + Section Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-1.5" style={{ fontFamily: "var(--font-display)" }}>
            {categories.find(c => c.name === active)?.emoji} {active}
          </h2>
          
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setVegFilter("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                vegFilter === "all"
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                  : "bg-card text-muted-foreground border-border/60 hover:border-border"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setVegFilter("veg")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border flex items-center gap-1.5 ${
                vegFilter === "veg"
                  ? "bg-success text-success-foreground border-success shadow-md shadow-success/20"
                  : "bg-card text-muted-foreground border-border/60 hover:border-border"
              }`}
            >
              <VegIcon /> Veg
            </button>
            <button
              onClick={() => setVegFilter("nonveg")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border flex items-center gap-1.5 ${
                vegFilter === "nonveg"
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                  : "bg-card text-muted-foreground border-border/60 hover:border-border"
              }`}
            >
              <NonVegIcon /> Non-Veg
            </button>
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3">
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
    </div>
  );
};

export default OrderPage;