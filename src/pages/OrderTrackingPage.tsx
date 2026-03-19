import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  ChefHat, 
  Bike, 
  Home, 
  ChevronLeft,
  Loader2,
  Sparkles,
  Search,
  ArrowRight
} from "lucide-react";

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"confirmed" | "preparing" | "delivery" | "delivered">("preparing");
  
  // Mocking status change for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      // Logic to poll real status from /api/get_order_status.php could go here
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    { id: "confirmed", label: "Confirmed", icon: CheckCircle2, time: "8:45 PM" },
    { id: "preparing", label: "Preparing", icon: ChefHat, time: "8:47 PM" },
    { id: "delivery", label: "Out for Delivery", icon: Bike, time: "---" },
    { id: "delivered", label: "Delivered", icon: Home, time: "---" },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === status);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl px-4 py-6 border-b border-gray-100">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/dashboard")}
              className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">Track Order</h1>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-4 py-2 rounded-xl border border-primary/10">#{orderId}</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-8 space-y-6">
        {/* Success Branding */}
        <div className="bg-white rounded-[3rem] shadow-premium p-8 text-center relative overflow-hidden">
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-50" />
           <div className="w-20 h-20 bg-green-50 text-green-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/10 border-2 border-green-100">
              <Sparkles className="h-10 w-10 animate-pulse" />
           </div>
           <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Order Placed! 🚀</h2>
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Our chefs are preparing something special for you</p>
        </div>

        {/* Live Status Stepper */}
        <div className="bg-white rounded-[3rem] shadow-premium p-8 border border-gray-100">
           <div className="flex flex-col gap-8 relative">
              {/* Connecting Line */}
              <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gray-100">
                 <div 
                   className="w-full bg-primary transition-all duration-1000" 
                   style={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                 />
              </div>

              {steps.map((step, i) => {
                const isActive = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;
                const Icon = step.icon;

                return (
                  <div key={step.id} className={`flex items-start gap-6 relative z-10 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                      isCurrent ? 'bg-primary text-white border-primary shadow-xl shadow-primary/30 scale-110' : (isActive ? 'bg-white text-primary border-primary shadow-sm' : 'bg-gray-50 text-gray-300 border-gray-100')
                    }`}>
                      {isCurrent && i < steps.length - 1 ? <Loader2 className="h-6 w-6 animate-spin absolute" /> : <Icon className="h-6 w-6" />}
                    </div>
                    <div className="flex-1 pt-2">
                       <div className="flex justify-between items-start">
                          <h4 className={`text-sm font-black uppercase tracking-widest ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</h4>
                          <span className="text-[10px] font-bold text-gray-300">{step.time}</span>
                       </div>
                       {isCurrent && (
                         <p className="text-[11px] font-bold text-primary mt-1 animate-pulse">Expected Arrival in 18 mins</p>
                       )}
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Delivery Map Mockup */}
        <div className="bg-white rounded-[3rem] shadow-premium p-4 border border-gray-100 h-64 relative overflow-hidden group">
           <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 px-12 text-center">
                 <MapPin className="h-10 w-10 text-primary/30" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 leading-relaxed">Map data loading...<br/>Our courier is picking up your order.</p>
              </div>
           </div>
           
           {/* Pulsing delivery marker animation mockup */}
           <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-primary rounded-full animate-ping opacity-20" />
           <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-primary rounded-full border-2 border-white shadow-xl" />
           
           <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-[1.5rem] border border-gray-100 shadow-xl flex items-center justify-between group-hover:translate-y-[-4px] transition-transform">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                    <Bike className="h-5 w-5" />
                 </div>
                 <div>
                    <h5 className="text-xs font-black uppercase tracking-widest text-gray-900 leading-none">Rahul (Runner)</h5>
                    <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase">Courier Partner</p>
                 </div>
              </div>
              <button className="w-10 h-10 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all">
                 <Phone className="h-4 w-4" />
              </button>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="grid grid-cols-2 gap-4">
           <Link to="/order" className="flex items-center justify-center gap-2 py-5 bg-white border-2 border-gray-50 rounded-[2rem] font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-primary hover:border-primary/10 transition-all shadow-sm">
              <Search className="h-4 w-4" /> Browse More
           </Link>
           <Link to="/dashboard" className="flex items-center justify-center gap-2 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-gray-900/10 hover:opacity-90 transition-all">
              My Dashboard <ArrowRight className="h-4 w-4" />
           </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
