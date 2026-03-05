import { Link } from "react-router-dom";
import { categories, menuItems } from "@/data/menuData";
import FoodCard from "@/components/FoodCard";

const MenuPage = () => (
  <div className="container mx-auto section-padding">
    <div className="text-center mb-12">
      <h1 className="section-title mb-3">Our Menu</h1>
      <p className="text-muted-foreground">Explore our wide variety of delicious dishes</p>
    </div>

    {categories.map(cat => {
      const items = menuItems.filter(i => i.category === cat.name);
      return (
        <div key={cat.name} className="mb-12">
          <h2 className="text-2xl font-bold font-display mb-6 flex items-center gap-2">
            <span>{cat.emoji}</span> {cat.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map(item => <FoodCard key={item.id} item={item} />)}
          </div>
        </div>
      );
    })}

    <div className="text-center mt-8">
      <Link to="/order" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
        Order Now
      </Link>
    </div>
  </div>
);

export default MenuPage;
