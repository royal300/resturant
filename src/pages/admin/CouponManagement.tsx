import { useState, useEffect } from "react";
import { Plus, Ticket, Calendar, Trash2, ArrowRight, X, Loader2, IndianRupee, Hash } from "lucide-react";
import { toast } from "sonner";

const CouponManagement = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    id: "",
    code: "",
    type: "percent",
    value: "",
    usage_limit: "",
    expiry_date: "",
    min_order_value: "0",
    status: "Active"
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/coupons.php");
      const data = await res.json();
      if (data.status === "success") setCoupons(data.coupons || []);
    } catch (err) {
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (coupon: any = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setForm({
        id: coupon.id,
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        usage_limit: coupon.usage_limit || "",
        expiry_date: coupon.expiry_date || "",
        min_order_value: coupon.min_order_value || "0",
        status: coupon.status
      });
    } else {
      setEditingCoupon(null);
      setForm({
        id: "",
        code: "",
        type: "percent",
        value: "",
        usage_limit: "",
        expiry_date: "",
        min_order_value: "0",
        status: "Active"
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.value) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/coupons.php", {
        method: "POST", // The API uses action logic or just inserts based on presence of ID
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           ...form,
           action: form.id ? 'update' : 'create' // My API might need this if it's dual purpose
        })
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success(editingCoupon ? "Coupon updated" : "Coupon created");
        setIsModalOpen(false);
        fetchCoupons();
      } else {
        toast.error(data.message || "Failed to save coupon");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(`/api/coupons.php?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === "success") {
        toast.success("Coupon deleted");
        fetchCoupons();
      }
    } catch (err) {
      toast.error("Failed to delete coupon");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coupon Codes</h1>
          <p className="text-muted-foreground mt-1">Manage discounts, usage limits, and expiration dates.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="h-5 w-5" />
          Create New Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center gap-3">
             <Loader2 className="h-8 w-8 text-primary animate-spin" />
             <p className="text-sm font-bold text-gray-400">Loading coupons...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
              <Ticket className="h-8 w-8 text-gray-300" />
            </div>
            <p className="text-muted-foreground font-medium italic">No active coupons found. Build your first promotion!</p>
          </div>
        ) : coupons.map((coupon) => (
          <div key={coupon.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group relative hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
            <div className="h-2 bg-primary/10 flex">
              {Array.from({length: 20}).map((_, i) => (
                <div key={i} className="flex-1 h-full border-r border-white"></div>
              ))}
            </div>
            
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-red-50 text-primary rounded-2xl border border-red-100 group-hover:rotate-6 transition-transform">
                  <Ticket className="h-6 w-6" />
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${coupon.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {coupon.status}
                  </span>
                  {coupon.usage_limit && (
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg flex items-center gap-1">
                       <Hash className="h-2.5 w-2.5" />
                       {coupon.used_count} / {coupon.usage_limit} Used
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="text-2xl font-black text-gray-900 tracking-tighter group-hover:text-primary transition-colors uppercase">{coupon.code}</h3>
                <p className="text-sm font-bold text-primary flex items-center gap-1.5">
                  {coupon.type === 'percent' ? (
                    <span className="flex items-center gap-1 text-lg">
                      {parseInt(coupon.value)}% <span className="text-xs uppercase tracking-widest font-black opacity-70">Off</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-lg">
                      ₹{parseInt(coupon.value)} <span className="text-xs uppercase tracking-widest font-black opacity-70">Flat Off</span>
                    </span>
                  )}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-dashed border-gray-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 opacity-50" />
                    Expires
                  </span>
                  <span className={`font-bold ${coupon.expiry_date ? 'text-gray-700' : 'text-gray-300 italic'}`}>
                    {coupon.expiry_date || "No Expiry"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <IndianRupee className="h-3.5 w-3.5 opacity-50" />
                    Min. Order
                  </span>
                  <span className="font-bold text-gray-700">₹{coupon.min_order_value}</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50/50 border-t flex items-center justify-between">
              <button 
                onClick={() => handleDelete(coupon.id)}
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
              <button 
                onClick={() => handleOpenModal(coupon)}
                className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 group/btn"
              >
                Edit Details
                <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 bg-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{editingCoupon ? 'Edit Coupon' : 'New Coupon'}</h2>
                  <p className="text-primary-foreground/70 text-[10px] font-bold uppercase tracking-widest">Promotion Builder</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Coupon Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SUMMER50"
                    value={form.code}
                    onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                    className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-primary focus:outline-none font-bold tracking-widest"
                  />
                </div>
                
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Type</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-primary focus:outline-none font-bold"
                  >
                    <option value="percent">Percentage %</option>
                    <option value="fixed">Fixed ₹</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Discount Value</label>
                  <input
                    type="number"
                    required
                    placeholder={form.type === 'percent' ? '10%' : '100'}
                    value={form.value}
                    onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                    className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-primary focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Usage Limit</label>
                  <input
                    type="number"
                    placeholder="Unlimited"
                    value={form.usage_limit}
                    onChange={e => setForm(f => ({ ...f, usage_limit: e.target.value }))}
                    className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-primary focus:outline-none font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Expiry Date</label>
                  <input
                    type="date"
                    value={form.expiry_date}
                    onChange={e => setForm(f => ({ ...f, expiry_date: e.target.value }))}
                    className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-primary focus:outline-none font-bold text-sm"
                  />
                </div>

                <div>
                   <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Min Order ₹</label>
                   <input
                    type="number"
                    value={form.min_order_value}
                    onChange={e => setForm(f => ({ ...f, min_order_value: e.target.value }))}
                    className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-primary focus:outline-none font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full px-5 py-3 rounded-2xl border-2 border-gray-100 focus:border-primary focus:outline-none font-bold"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  editingCoupon ? 'Update Campaign' : 'Launch Campaign'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;
