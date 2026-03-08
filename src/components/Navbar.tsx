import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect, useRef } from "react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/order", label: "Order" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { items, totalItems, totalPrice } = useCart();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(e.target as Node)) setCartOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => { setOpen(false); setCartOpen(false); }, [location]);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-foreground/95 backdrop-blur-lg shadow-xl" : "bg-foreground"}`}>
      <div className="container mx-auto flex items-center justify-between h-14 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-base">R</span>
          </div>
          <span className="font-display text-lg font-bold text-background tracking-tight">
            Royal
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                location.pathname === l.to
                  ? "bg-primary text-primary-foreground"
                  : "text-background/60 hover:text-background hover:bg-background/10"
              }`}
            >
              {l.label}
            </Link>
          ))}
          
          {/* Cart with dropdown */}
          <div className="relative ml-2" ref={cartRef}>
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors"
            >
              <ShoppingCart className="h-5 w-5 text-background" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold animate-bounce-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Cart Preview Dropdown */}
            {cartOpen && totalItems > 0 && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-2xl shadow-2xl p-4 animate-fade-in z-50">
                <h4 className="font-display font-bold text-sm mb-3 text-foreground">Your Cart</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {items.slice(0, 5).map(ci => (
                    <div key={ci.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <img src={ci.image} alt={ci.name} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                        <span className="truncate text-foreground text-xs">{ci.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground ml-2 flex-shrink-0">
                        {ci.quantity} × ₹{ci.price}
                      </span>
                    </div>
                  ))}
                  {items.length > 5 && (
                    <p className="text-[11px] text-muted-foreground">+{items.length - 5} more items</p>
                  )}
                </div>
                <div className="border-t border-border mt-3 pt-3 flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">₹{totalPrice}</span>
                  <Link
                    to="/cart"
                    className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold hover:shadow-md transition-shadow"
                  >
                    Checkout →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-1">
          <Link to="/cart" className="relative p-2">
            <ShoppingCart className="h-5 w-5 text-background" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] rounded-full h-4.5 w-4.5 flex items-center justify-center font-bold min-w-[18px] h-[18px]">
                {totalItems}
              </span>
            )}
          </Link>
          <button onClick={() => setOpen(!open)} className="p-2 text-background">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-foreground/95 backdrop-blur-lg border-t border-background/10 px-4 pb-4 animate-fade-in">
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block py-3 text-sm font-semibold border-b border-background/10 last:border-0 ${
                location.pathname === l.to ? "text-primary" : "text-background/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;