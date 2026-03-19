import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-foreground text-background py-12 mt-16">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="font-display text-xl font-bold text-primary mb-3">Royal Restaurant</h3>
        <p className="text-sm opacity-70">Serving delicious food with love since 2020. Fresh ingredients, authentic taste.</p>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Quick Links</h4>
        <div className="flex flex-col gap-2 text-sm opacity-70">
          <Link to="/menu" className="hover:text-primary transition-colors">Menu</Link>
          <Link to="/order" className="hover:text-primary transition-colors">Order Now</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          <Link to="/admin" className="hover:text-primary transition-colors font-bold text-xs mt-2 border-t border-background/10 pt-2">Admin Portal</Link>
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-3">Contact</h4>
        <div className="text-sm opacity-70 space-y-1">
          <p>123 Food Street, Flavor Town</p>
          <p>+91 98765 43210</p>
          <p>hello@royalrestaurant.com</p>
        </div>
      </div>
    </div>
    <div className="container mx-auto px-4 mt-8 pt-6 border-t border-background/10 text-center text-sm opacity-50">
      © 2026 Royal Restaurant. All rights reserved.
    </div>
  </footer>
);

export default Footer;
