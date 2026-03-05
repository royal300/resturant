import { Link } from "react-router-dom";
import { Utensils, Clock, ShieldCheck, Star } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import { categories, menuItems } from "@/data/menuData";
import FoodCard from "@/components/FoodCard";

const whyUs = [
  { icon: Utensils, title: "Fresh Ingredients", desc: "We source the freshest produce daily" },
  { icon: Clock, title: "Fast Service", desc: "Quick preparation without compromising quality" },
  { icon: ShieldCheck, title: "Hygienic Kitchen", desc: "Strict hygiene standards maintained" },
  { icon: Star, title: "Best Taste", desc: "Recipes crafted by expert chefs" },
];

const Index = () => {
  const popular = menuItems.filter(i => i.popular);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <img src={heroBanner} alt="Delicious food spread" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/60" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-background mb-4 font-display">
            Delicious Food<br />Delivered Fresh
          </h1>
          <p className="text-background/80 text-lg mb-8 max-w-lg mx-auto">
            Experience the finest flavors at Royal Restaurant — where every meal is a celebration.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/order" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Order Now
            </Link>
            <Link to="/menu" className="bg-background/20 backdrop-blur text-background border border-background/30 px-8 py-3 rounded-lg font-semibold hover:bg-background/30 transition-colors">
              View Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding container mx-auto">
        <h2 className="section-title text-center mb-10">Our Special Menu</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4">
          {categories.map(c => (
            <Link
              key={c.name}
              to={`/order?category=${c.name}`}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary hover:bg-primary/10 transition-colors"
            >
              <span className="text-3xl">{c.emoji}</span>
              <span className="text-sm font-medium text-foreground">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className="section-padding bg-secondary/50">
        <div className="container mx-auto">
          <h2 className="section-title text-center mb-10">Popular Dishes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popular.map(item => <FoodCard key={item.id} item={item} />)}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding container mx-auto">
        <h2 className="section-title text-center mb-10">Why Choose Us</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {whyUs.map(w => (
            <div key={w.title} className="text-center p-6 rounded-xl bg-card border">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <w.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1 font-body">{w.title}</h3>
              <p className="text-sm text-muted-foreground">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground font-display mb-4">
            Order Your Favourite Food Now
          </h2>
          <Link to="/order" className="inline-block bg-background text-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity mt-2">
            Start Ordering
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
