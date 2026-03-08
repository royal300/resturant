import { Link } from "react-router-dom";
import { Utensils, Clock, ShieldCheck, Star, ArrowRight } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import { categories } from "@/data/menuData";

const whyUs = [
  { icon: Utensils, title: "Fresh Ingredients", desc: "We source the freshest produce daily" },
  { icon: Clock, title: "Fast Service", desc: "Quick preparation without compromising quality" },
  { icon: ShieldCheck, title: "Hygienic Kitchen", desc: "Strict hygiene standards maintained" },
  { icon: Star, title: "Best Taste", desc: "Recipes crafted by expert chefs" },
];

const bannerCards = [
  {
    title: "Today's Special Combo",
    subtitle: "Burger + Fries + Drink",
    price: "₹299",
    bg: "bg-primary",
    textColor: "text-primary-foreground",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop",
  },
  {
    title: "Family Feast",
    subtitle: "Pizza + Noodles + Beverages",
    price: "₹799",
    bg: "bg-foreground",
    textColor: "text-background",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&h=400&fit=crop",
  },
  {
    title: "Tandoor Night",
    subtitle: "2 Starters + 2 Mains + Naan",
    price: "₹599",
    bg: "bg-card",
    textColor: "text-foreground",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&h=400&fit=crop",
    border: true,
  },
  {
    title: "Drinks & Chill",
    subtitle: "Any 3 Beverages",
    price: "₹249",
    bg: "bg-accent",
    textColor: "text-accent-foreground",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=400&fit=crop",
  },
];

const Index = () => {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-[75vh] min-h-[450px] flex items-center justify-center overflow-hidden">
        <img src={heroBanner} alt="Delicious food spread" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/65" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-background mb-3 font-display leading-tight">
            Delicious Food<br />Delivered Fresh
          </h1>
          <p className="text-background/75 text-sm md:text-lg mb-6 max-w-lg mx-auto">
            Experience the finest flavors at Royal Restaurant — where every meal is a celebration.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/order" className="bg-primary text-primary-foreground px-7 py-2.5 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-primary/30 transition-all">
              Order Now
            </Link>
            <Link to="/menu" className="bg-background/15 backdrop-blur text-background border border-background/30 px-7 py-2.5 rounded-full font-semibold text-sm hover:bg-background/25 transition-colors">
              View Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Banner Cards */}
      <section className="section-padding container mx-auto">
        <h2 className="section-title text-center mb-8">🔥 Hot Deals & Combos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bannerCards.map(card => (
            <Link
              key={card.title}
              to="/order"
              className={`${card.bg} ${card.textColor} rounded-2xl overflow-hidden flex items-stretch group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${card.border ? "border border-border" : ""}`}
            >
              <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
                <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">Limited Offer</span>
                <h3 className="text-lg md:text-xl font-bold font-display mb-0.5">{card.title}</h3>
                <p className="opacity-75 text-xs mb-3">{card.subtitle}</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">{card.price}</span>
                  <span className="flex items-center gap-1 text-xs font-semibold opacity-70 group-hover:opacity-100 transition-opacity">
                    Order <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
              <div className="w-36 md:w-48 flex-shrink-0">
                <img src={card.image} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-muted/50">
        <div className="container mx-auto">
          <h2 className="section-title text-center mb-8">Explore Menu</h2>
          <div className="flex justify-center flex-wrap gap-5 md:gap-7">
            {categories.map(c => (
              <Link
                key={c.name}
                to={`/order?category=${c.name}`}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-border group-hover:border-primary group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding container mx-auto">
        <h2 className="section-title text-center mb-8">Why Choose Us</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {whyUs.map(w => (
            <div key={w.title} className="text-center p-5 rounded-2xl bg-card border border-border/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
              <div className="mx-auto w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <w.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1 text-sm">{w.title}</h3>
              <p className="text-xs text-muted-foreground">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-primary">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground font-display mb-4">
            Order Your Favourite Food Now
          </h2>
          <Link to="/order" className="inline-block bg-background text-foreground px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all">
            Start Ordering
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;