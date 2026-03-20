import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { ChevronLeft, Ticket, MapPin, User, Phone, Table, ArrowRight, Loader2, CheckCircle2, CreditCard } from "lucide-react";

const CheckoutPage = () => {
  const { items, totalPrice, coupon, applyCoupon, removeCoupon, discount, finalPrice, placeOrder } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: localStorage.getItem("user_name") || "", 
    phone: localStorage.getItem("user_phone") || "", 
    table: "" 
  });
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const isAuthed = localStorage.getItem("user_authed") === "true";

  useEffect(() => {
    if (!isAuthed) {
      toast.error("Please login to proceed with your order");
      navigate("/login?redirect=/checkout");
      return;
    }
    if (items.length === 0) {
      navigate("/order");
    }
  }, [items, navigate, isAuthed]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    await applyCoupon(couponCode.trim());
    setApplyingCoupon(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.table.trim()) {
      toast.error("Please fill all details to continue");
      return;
    }
    setLoading(true);
    try {
      const order = await placeOrder(form.name.trim(), form.phone.trim(), form.table.trim());
      toast.success("Order Placed Successfully! 🚀");
      // Navigate to order tracking with the order ID
      navigate(`/track/${order.id}`);
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl px-4 py-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-colors active:scale-90"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Checkout</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-6">
        {/* Order Summary */}
        <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-6">
             <div className="w-1 h-4 bg-primary rounded-full" />
             <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Order Summary</h2>
          </div>
          
          <div className="space-y-4 mb-8">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm font-bold">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                   </div>
                   <span className="text-gray-700">{item.name} <span className="text-gray-400 ml-1">× {item.quantity}</span></span>
                </div>
                <span className="text-gray-900">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Coupon Section */}
          <div className="pt-6 border-t border-dashed">
            <div className="flex items-center justify-between mb-4">
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Apply Promo Code</label>
               {coupon && (
                 <span className="text-[10px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1">
                   <CheckCircle2 className="h-3 w-3" /> Applied
                 </span>
               )}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                 <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                 <input
                   type="text"
                   value={couponCode}
                   onChange={e => setCouponCode(e.target.value.toUpperCase())}
                   placeholder="ENTER CODE"
                   disabled={!!coupon || applyingCoupon}
                   className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-50 bg-gray-50/30 font-black tracking-widest focus:bg-white focus:border-primary/20 outline-none transition-all disabled:opacity-50 text-sm"
                 />
              </div>
              {coupon ? (
                <button
                  onClick={removeCoupon}
                  className="px-6 py-4 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-colors"
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={handleApplyCoupon}
                  disabled={applyingCoupon || !couponCode.trim()}
                  className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-gray-900/10 hover:opacity-90 active:scale-95 disabled:opacity-30 transition-all"
                >
                  {applyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bill Summary */}
        <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 p-6">
           <div className="space-y-3">
             <div className="flex justify-between text-xs font-bold">
               <span className="text-gray-400">Subtotal</span>
               <span className="text-gray-900">₹{totalPrice}</span>
             </div>
             <div className="flex justify-between text-xs font-bold">
               <span className="text-gray-400">Convenience & Taxes</span>
               <span className="text-gray-900">₹0</span>
             </div>
             {discount > 0 && (
               <div className="flex justify-between text-xs font-black text-green-500 bg-green-50/50 p-3 rounded-xl border border-green-100 border-dashed">
                 <span className="flex items-center gap-1.5 uppercase tracking-widest">
                   <Ticket className="h-3 w-3" /> Discount ({coupon?.code})
                 </span>
                 <span>-₹{discount}</span>
               </div>
             )}
             <div className="flex justify-between pt-4 mt-2 border-t border-gray-50 items-center">
               <span className="font-black text-gray-900 uppercase tracking-widest text-xs">Final Amount</span>
               <span className="text-2xl font-black text-primary">₹{finalPrice}</span>
             </div>
           </div>
        </div>

        {/* Details Form */}
        <div className="bg-white rounded-[2.5rem] shadow-premium border border-gray-100 p-6">
           <div className="flex items-center gap-2 mb-6">
             <div className="w-1 h-4 bg-primary rounded-full" />
             <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Delivery Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Your Name</label>
                 <div className="relative text-gray-400 focus-within:text-primary transition-colors">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" />
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-50 focus:border-primary/20 outline-none font-bold text-sm text-gray-900"
                      placeholder="e.g. John Doe"
                    />
                 </div>
               </div>
               <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Phone Number</label>
                  <div className="relative text-gray-400 focus-within:text-primary transition-colors">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" />
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-50 focus:border-primary/20 outline-none font-bold text-sm text-gray-900"
                      placeholder="+91 0000000000"
                    />
                  </div>
               </div>
            </div>

            <div>
               <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Table Number</label>
               <div className="relative text-gray-400 focus-within:text-primary transition-colors">
                  <Table className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" />
                  <input
                    required
                    type="text"
                    value={form.table}
                    onChange={e => setForm(p => ({ ...p, table: e.target.value }))}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-50 focus:border-primary/20 outline-none font-bold text-sm text-gray-900"
                    placeholder="e.g. 5"
                  />
               </div>
            </div>

            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50 flex items-start gap-4">
               <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                  <CreditCard className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-amber-700">Payment: Pay at Counter</p>
                  <p className="text-[10px] font-bold text-amber-600/70 mt-0.5">Currently we only accept cash or UPI at the counter.</p>
               </div>
            </div>
            
            {/* Desktop Hidden Footer Placeholder */}
            <div className="hidden md:block pt-4">
              <button
                disabled={loading}
                className="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:opacity-90 active:scale-95 transition-all"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Finish & Place Order <ArrowRight className="h-5 w-5" /></>}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-gray-100 md:hidden z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-5 bg-primary text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Place Order • ₹{finalPrice} <ArrowRight className="h-5 w-5" /></>}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
