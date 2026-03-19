import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, User, LogIn } from "lucide-react";
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
  
  const isAuthed = localStorage.getItem("user_authed") === "true";

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
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-[1rem] bg-primary flex items-center justify-center rotate-3 shadow-lg shadow-primary/20">
            <span className="text-white font-black text-base italic">RR</span>
          </div>
          <span className="font-display text-lg font-bold text-white tracking-tight">
            Royal
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                location.pathname === l.to
                  ? "bg-white/10 text-primary"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {l.label}
            </Link>
          ))}
          
          <div className="h-4 w-px bg-white/10 mx-2" />

          {/* User Profile / Login */}
          <Link
            to={isAuthed ? "/dashboard" : "/login"}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-all border border-white/10 group"
          >
            {isAuthed ? (
              <>
                <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center overflow-hidden border border-primary/20">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Me" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Profile</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-primary" />
                <span className="text-xs font-black uppercase tracking-widest text-primary">Login</span>
              </>
            )}
          </Link>

          {/* Cart with dropdown */}
          <div className="relative ml-2" ref={cartRef}>
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative p-2.5 rounded-xl bg-primary text-white hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-primary text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-black border-2 border-primary">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Cart Preview Dropdown */}
            {cartOpen && totalItems > 0 && (
              <div className="absolute right-0 top-full mt-4 w-80 bg-white border border-gray-100 rounded-[2rem] shadow-2xl p-6 animate-in zoom-in duration-300 z-50">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-gray-400">Your Basket</h4>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
                  {items.map(ci => (
                    <div key={ci.id} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img src={ci.image} alt={ci.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="truncate text-gray-900 text-xs font-bold">{ci.name}</span>
                          <span className="text-[10px] text-gray-400 font-bold">{ci.quantity} × ₹{ci.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-50 mt-6 pt-6 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">Total</p>
                    <span className="font-black text-lg text-gray-900">₹{totalPrice}</span>
                  </div>
                  <Link
                    to="/cart"
                    className="bg-primary text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-1">
          <Link to={isAuthed ? "/dashboard" : "/login"} className="p-2.5 text-white bg-white/5 rounded-xl ml-1">
            <User className="h-5 w-5" />
          </Link>
          <Link to="/cart" className="relative p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 ml-1">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-primary text-[10px] rounded-full h-4.5 w-4.5 flex items-center justify-center font-black border-2 border-primary">
                {totalItems}
              </span>
            )}
          </Link>
          <button onClick={() => setOpen(!open)} className="p-2 text-white ml-1">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-foreground backdrop-blur-xl border-t border-white/5 px-6 pb-10 animate-in slide-in-from-top-4 duration-500 shadow-2xl">
          <div className="space-y-1 pt-6">
            {navLinks.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`block py-4 text-sm font-black uppercase tracking-widest transition-colors ${
                  location.pathname === l.to ? "text-primary" : "text-white/60"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-white/5">
             <Link
               to={isAuthed ? "/dashboard" : "/login"}
               className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] border border-white/5"
             >
                <User className="h-4 w-4" />
                {isAuthed ? "Manage Profile" : "Sign In"}
             </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;