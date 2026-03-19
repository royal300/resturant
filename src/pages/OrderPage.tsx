import { useState, useRef, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import FoodCard from "@/components/FoodCard";
import { Search, ShoppingCart, ChevronRight, Loader2, Sparkles, Filter } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

type VegFilter = "all" | "veg" | "nonveg";

const OrderPage = () => {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const initialCat = searchParams.get("category") || "Tandoor";
  const [active, setActive] = useState<string>(initialCat);
  const [search, setSearch] = useState("");
  const [vegFilter, setVegFilter] = useState<VegFilter>("all");
  const { totalItems, finalPrice } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, dishesRes, combosRes] = await Promise.all([
          fetch("/api/categories.php"),
          fetch("/api/dishes.php"),
          fetch("/api/combos.php")
        ]);
        const catsData = await catsRes.json();
        const dishesData = await dishesRes.json();
        const combosData = await combosRes.json();
        
        let fetchedCats = catsData.status === "success" ? catsData.categories : [];
        if (combosData.status === "success" && combosData.combos?.length > 0) {
           const activeCombos = combosData.combos.filter((c: any) => c.status === "Active");
           if (activeCombos.length > 0) {
              setCombos(activeCombos);
              const adminComboCat = fetchedCats.find((c: any) => c.name === "Combos & Offers");
              fetchedCats = fetchedCats.filter((c: any) => c.name !== "Combos & Offers");
              
              fetchedCats.unshift({
                id: adminComboCat ? adminComboCat.id : "cat-combos",
                name: "Combos & Offers",
                image_url: adminComboCat?.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
              });
           }
        }
        
        if (fetchedCats.length > 0) {
          setCategories(fetchedCats);
          const currentActiveCat = fetchedCats.find((c: any) => c.name === active);
          if (!currentActiveCat) {
            setActive(fetchedCats[0].name);
          }
        }
        if (dishesData.status === "success") {
          setMenuItems(dishesData.dishes);
        }
      } catch (err) {
        toast.error("Failed to load menu data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isCombosActive = active === "Combos & Offers";

  const filtered = isCombosActive
    ? combos.filter(c => {
        if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      })
    : menuItems.filter(i => {
        if (i.category_name !== active && i.category !== active) return false;
        if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
        const isVeg = String(i.is_veg).toLowerCase() === "1" || String(i.is_veg).toLowerCase() === "true" || i.is_veg === true;
        if (vegFilter === "veg" && !isVeg) return false;
        if (vegFilter === "nonveg" && isVeg) return false;
        return true;
      });

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollCategories = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 animate-in fade-in duration-1000">
        <div className="relative">
          <Loader2 className="h-14 w-14 text-primary animate-spin" />
          <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-amber-400 animate-pulse" />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">Setting the table...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 pb-32">
      {/* Search Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl px-4 py-4 mb-2 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Hungry? Search for dishes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border-2 border-transparent rounded-[1.5rem] text-sm font-bold focus:bg-white focus:border-primary/20 focus:outline-none transition-all placeholder:text-gray-300"
            />
          </div>
          <button className="w-14 h-14 bg-gray-50 flex items-center justify-center rounded-[1.5rem] border-2 border-transparent hover:border-primary/10 transition-all text-gray-400">
             <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Category Icons */}
        <div className="relative mb-8 pt-2">
          <div className="flex items-center justify-between mb-4 px-1">
             <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Craving something specific?</h2>
          </div>
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setActive(c.name)}
                className={`flex flex-col items-center gap-3 flex-shrink-0 transition-all duration-300 ${
                  active === c.name ? "translate-y-[-4px]" : "hover:translate-y-[-2px]"
                }`}
              >
                <div
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-[2rem] overflow-hidden border-2 transition-all duration-300 p-1 flex items-center justify-center bg-white ${
                    active === c.name
                      ? "border-primary shadow-xl shadow-primary/15 scale-105"
                      : "border-gray-50 shadow-sm"
                  }`}
                >
                    <div className="w-full h-full rounded-[1.5rem] overflow-hidden">
                      {c.image_url ? (
                        <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/5 flex items-center justify-center text-2xl font-black text-primary">{c.name.charAt(0)}</div>
                      )}
                    </div>
                </div>
                <span
                  className={`text-[11px] font-black uppercase tracking-widest transition-colors duration-200 ${
                    active === c.name ? "text-primary" : "text-gray-500"
                  }`}
                >
                  {c.name}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={scrollCategories}
            className="absolute right-0 top-1/2 w-10 h-10 rounded-full bg-white shadow-xl border border-gray-100 hidden md:flex items-center justify-center text-primary transform translate-x-1/2 z-10 hover:scale-110 transition-transform"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-6 bg-primary rounded-full" />
             <h2 className="text-xl font-black text-gray-900 tracking-tight tracking-tight">{active}</h2>
             <span className="text-gray-300 ml-2 font-bold text-xs uppercase">{filtered.length} Dishes</span>
          </div>
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
             {[
               { id: "all", label: "All", color: "bg-primary" },
               { id: "veg", label: "Pure Veg 🥗", color: "bg-green-500" },
               { id: "nonveg", label: "Non-Veg 🍗", color: "bg-red-500" }
             ].map(f => (
               <button
                 key={f.id}
                 onClick={() => setVegFilter(f.id as VegFilter)}
                 className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                   vegFilter === f.id 
                    ? `${f.color} text-white shadow-lg shadow-${f.id === 'all' ? 'primary' : (f.id === 'veg' ? 'green' : 'red')}/20` 
                    : "bg-white text-gray-400 border border-gray-100"
                 }`}
               >
                 {f.label}
               </button>
             ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-8">
          {isCombosActive ? filtered.map((combo, i) => (
            <div key={`combo-${combo.id}`} className="flex">
              <FoodCard item={{
                id: `combo-${combo.id}`,
                name: combo.name,
                description: combo.description || "Limited time combo pack with exclusive items",
                price: parseFloat(combo.combo_price),
                originalPrice: combo.original_price > 0 ? parseFloat(combo.original_price) : undefined,
                category: "Combos & Offers",
                isVeg: false,
                image: combo.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
                tags: ["popular", "bestseller"]
              }} />
            </div>
          )) : filtered.map((item, i) => (
            <div key={item.id} className="flex">
              <FoodCard item={{
                id: String(item.id),
                name: item.name,
                description: item.description || "",
                price: parseFloat(item.selling_price),
                originalPrice: item.original_price > 0 ? parseFloat(item.original_price) : undefined,
                category: item.category_name || item.category,
                isVeg: String(item.is_veg).toLowerCase() === "1" || String(item.is_veg).toLowerCase() === "true" || item.is_veg === true,
                image: item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
                tags: item.is_popular ? ["popular"] : []
              }} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <Search className="w-8 h-8 text-gray-200" />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-1">No dishes found</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Try searching for something else!</p>
          </div>
        )}

        {/* Floating Cart Button (Mobile) */}
        {totalItems > 0 && (
          <div className="fixed bottom-6 left-6 right-6 md:hidden z-40 animate-in slide-in-from-bottom-10 duration-500">
            <Link
              to="/cart"
              className="flex items-center justify-between bg-primary text-white rounded-[2rem] px-6 py-5 shadow-2xl shadow-primary/40 group active:scale-95 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-black text-sm leading-none">{totalItems} {totalItems === 1 ? 'Item' : 'Items'}</p>
                  <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-1">Ready to checkout</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-lg">₹{finalPrice}</span>
                <ChevronRight className="h-5 w-5 opacity-60" />
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;