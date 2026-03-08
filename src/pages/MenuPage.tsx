import { Link } from "react-router-dom";
import { categories, menuItems } from "@/data/menuData";
import FoodCard from "@/components/FoodCard";

const MenuPage = () => (
  <div className="container mx-auto section-padding">
    <div className="text-center mb-8">
      <h1 className="section-title mb-2">Our Menu</h1>
      <p className="text-muted-foreground text-sm">Explore our wide variety of delicious dishes</p>
    </div>

    {categories.map(cat => {
      const items = menuItems.filter(i => i.category === cat.name);
      return (
        <div key={cat.name} className="mb-10">
          <h2 className="text-lg font-bold font-display mb-4 flex items-center gap-2 text-foreground">
            <span className="text-xl">{cat.emoji}</span> {cat.name} Specials
            <span className="flex-1 h-px bg-border ml-3" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {items.map(item => <FoodCard key={item.id} item={item} />)}
          </div>
        </div>
      );
    })}

    <div className="text-center mt-8">
      <Link to="/order" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all">
        Order Now
      </Link>
    </div>
  </div>
);

export default MenuPage;