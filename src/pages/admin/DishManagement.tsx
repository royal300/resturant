import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, TrendingUp, Filter, X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

const DishManagement = () => {
  const [dishes, setDishes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
    original_price: "",
    selling_price: "",
    is_trending: false,
    is_veg: true,
    status: "Available",
    image: null as File | null
  });

  useEffect(() => {
    fetchDishes();
    fetchCategories();
  }, []);

  const fetchDishes = async () => {
    try {
      const res = await fetch("/api/dishes.php");
      const data = await res.json();
      if (data.status === "success") setDishes(data.dishes || []);
    } catch (err) {
      toast.error("Failed to load dishes");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories.php");
      const data = await res.json();
      if (data.status === "success") setCategories(data.categories);
    } catch (err) {}
  };

  const deleteDish = async (id: number) => {
    if (!confirm("Are you sure you want to delete this dish?")) return;
    try {
      const res = await fetch(`/api/dishes.php?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === "success") {
        toast.success("Dish deleted");
        fetchDishes();
      }
    } catch (err) {
      toast.error("Error deleting dish");
    }
  };

  const handleEdit = (dish: any) => {
    setEditingDish(dish);
    setFormData({
      name: dish.name,
      description: dish.description || "",
      category_id: dish.category_id || "",
      original_price: dish.original_price || "",
      selling_price: dish.selling_price || "",
      is_trending: String(dish.is_trending).toLowerCase() === "1" || String(dish.is_trending).toLowerCase() === "true" || dish.is_trending === true,
      is_veg: String(dish.is_veg).toLowerCase() === "1" || String(dish.is_veg).toLowerCase() === "true" || dish.is_veg === true,
      status: dish.status || "Available",
      image: null
    });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingDish(null);
    setFormData({
      name: "",
      description: "",
      category_id: categories.length > 0 ? categories[0].id : "",
      original_price: "",
      selling_price: "",
      is_trending: false,
      is_veg: true,
      status: "Available",
      image: null
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const body = new FormData();
    if (editingDish) body.append("id", editingDish.id);
    body.append("name", formData.name);
    body.append("description", formData.description);
    body.append("category_id", formData.category_id);
    body.append("original_price", formData.original_price);
    body.append("selling_price", formData.selling_price);
    body.append("is_trending", String(formData.is_trending));
    body.append("is_veg", String(formData.is_veg));
    body.append("status", formData.status);
    if (formData.image) body.append("image", formData.image);

    try {
      const res = await fetch("/api/dishes.php", {
        method: "POST",
        body: body
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success(editingDish ? "Dish updated" : "Dish added");
        setIsModalOpen(false);
        fetchDishes();
      } else {
        toast.error(data.message || "Error saving dish");
      }
    } catch (err) {
      toast.error("Failed to connect to server");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDishes = dishes.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    (d.category_name && d.category_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-display">Menu Items</h1>
          <p className="text-muted-foreground mt-1">Manage all dishes, prices and trending status.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="h-5 w-5" />
          Add New Dish
        </button>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by dish name or category..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent border-2 focus:bg-white focus:border-primary/20 focus:outline-none rounded-2xl text-sm transition-all font-medium"
          />
        </div>
        <button className="p-3 bg-gray-50 rounded-2xl text-gray-600 hover:bg-gray-100 transition-colors">
          <Filter className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary/40" />
            Loading dishes...
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground bg-white rounded-3xl border-2 border-dashed border-gray-100 italic">
            No dishes found. Add your first dish or try a different search.
          </div>
        ) : filteredDishes.map((dish) => (
          <div key={dish.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={dish.image_url || "/placeholder.svg"} 
                alt={dish.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-wider text-gray-900 border shadow-sm">
                  {dish.category_name || "Uncategorized"}
                </span>
                {String(dish.is_veg).toLowerCase() === "1" || String(dish.is_veg).toLowerCase() === "true" || dish.is_veg === true ? (
                   <span className="px-3 py-1 bg-green-500/90 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">Veg</span>
                ) : (
                   <span className="px-3 py-1 bg-red-500 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">Non-Veg</span>
                )}
                {String(dish.is_trending).toLowerCase() === "1" || String(dish.is_trending).toLowerCase() === "true" || dish.is_trending === true ? (
                  <span className="px-3 py-1 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Trending
                  </span>
                ) : null}
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors text-base line-clamp-1">{dish.name}</h3>
                <div className="flex flex-col items-end">
                  <span className="text-lg font-black text-gray-900">₹{dish.selling_price}</span>
                  {dish.original_price && parseFloat(dish.original_price) > parseFloat(dish.selling_price) && (
                    <span className="text-[11px] text-muted-foreground line-through font-bold">₹{dish.original_price}</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-6 font-medium leading-relaxed h-10">{dish.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className={`text-[10px] font-black uppercase tracking-widest ${dish.status === 'Available' ? 'text-green-500' : 'text-red-500'}`}>
                  ● {dish.status}
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEdit(dish)}
                    className="p-2.5 bg-gray-50 text-gray-600 hover:bg-primary/5 hover:text-primary rounded-xl transition-all"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => deleteDish(dish.id)}
                    className="p-2.5 bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-display">{editingDish ? "Edit Dish" : "Add New Dish"}</h2>
                <p className="text-xs text-muted-foreground mt-0.5 font-medium">Fill in the details to {editingDish ? "update" : "create"} your menu item.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2.5 hover:bg-gray-200/50 rounded-2xl transition-colors text-gray-400 hover:text-gray-900"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 max-h-[70vh] overflow-y-auto scrollbar-hide">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Dish Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Butter Chicken"
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl transition-all outline-none font-medium text-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Category</label>
                  <select 
                    required
                    value={formData.category_id}
                    onChange={e => setFormData({...formData, category_id: e.target.value})}
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl transition-all outline-none font-medium text-sm appearance-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700">Description</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your delicious dish..."
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl transition-all outline-none font-medium text-sm resize-none"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Original Price (₹)</label>
                  <input 
                    type="number" 
                    value={formData.original_price}
                    onChange={e => setFormData({...formData, original_price: e.target.value})}
                    placeholder="Optional MRP"
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl transition-all outline-none font-medium text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Selling Price (₹)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.selling_price}
                    onChange={e => setFormData({...formData, selling_price: e.target.value})}
                    placeholder="Menu Price"
                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl transition-all outline-none font-medium text-sm font-black"
                  />
                </div>

                <div className="space-y-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                  <div className="flex flex-col gap-3">
                    <span className="text-sm font-bold text-gray-800">Dietary Option</span>
                    <div className="flex p-1 bg-gray-100 rounded-2xl w-full">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, is_veg: true})}
                        className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
                          formData.is_veg 
                            ? "bg-white text-green-600 shadow-sm ring-1 ring-black/5" 
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Vegetarian
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, is_veg: false})}
                        className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${
                          !formData.is_veg 
                            ? "bg-white text-red-600 shadow-sm ring-1 ring-black/5" 
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Non-Vegetarian
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-gray-800">Trending</span>
                      <p className="text-[10px] text-gray-500 font-medium">Add "Fire" tag on menu</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.is_trending}
                        onChange={e => setFormData({...formData, is_trending: e.target.checked})}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Dish Image</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all hover:border-primary/20">
                      {formData.image || editingDish?.image_url ? (
                        <div className="flex flex-col items-center gap-2 py-2">
                          <img 
                            src={formData.image ? URL.createObjectURL(formData.image) : editingDish.image_url} 
                            alt="Preview" 
                            className="w-20 h-20 object-cover rounded-xl shadow-md border-2 border-white"
                          />
                          <p className="text-[10px] text-primary font-bold truncate max-w-[150px]">
                            {formData.image ? formData.image.name : "Current Image"}
                          </p>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 mb-2 text-gray-400" />
                          <p className="text-[11px] text-gray-500 font-bold max-w-xs text-center px-4">
                            Click to upload or drag and drop
                          </p>
                        </>
                      )}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={e => setFormData({...formData, image: e.target.files?.[0] || null})}
                    />
                  </label>
                </div>
              </div>
              
              <div className="mt-10 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
                  {editingDish ? "Update Dish" : "Create Dish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DishManagement;
