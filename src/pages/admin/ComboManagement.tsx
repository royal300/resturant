import { useState, useEffect } from "react";
import { Plus, Package, Edit2, Trash2, X, Upload, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

const ComboManagement = () => {
  const [combos, setCombos] = useState<any[]>([]);
  const [dishes, setDishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    original_price: "",
    combo_price: "",
    status: "Active",
    image: null as File | null
  });
  
  const [selectedDishes, setSelectedDishes] = useState<number[]>([]);

  useEffect(() => {
    fetchCombos();
    fetchDishes();
  }, []);

  const fetchCombos = async () => {
    try {
      const res = await fetch("/api/combos.php");
      const data = await res.json();
      if (data.status === "success") setCombos(data.combos || []);
    } catch (err) {
      toast.error("Failed to load combos");
    } finally {
      setLoading(false);
    }
  };

  const fetchDishes = async () => {
    try {
      const res = await fetch("/api/dishes.php");
      const data = await res.json();
      if (data.status === "success") setDishes(data.dishes || []);
    } catch (err) { }
  };

  const calculateOriginalPrice = (dishIds: number[]) => {
    let total = 0;
    dishIds.forEach(id => {
      const dish = dishes.find(d => Number(d.id) === id);
      if (dish) total += parseFloat(dish.selling_price);
    });
    return total.toFixed(2);
  };

  const toggleDish = (dishId: number) => {
    setSelectedDishes(prev => {
      const newSelection = prev.includes(dishId) 
        ? prev.filter(id => id !== dishId)
        : [...prev, dishId];
        
      // Auto-update original price
      const newPrice = calculateOriginalPrice(newSelection);
      setFormData(f => ({ ...f, original_price: newPrice }));
      return newSelection;
    });
  };

  const handleAdd = () => {
    setEditingCombo(null);
    setFormData({
      name: "",
      description: "",
      original_price: "",
      combo_price: "",
      status: "Active",
      image: null
    });
    setSelectedDishes([]);
    setIsModalOpen(true);
  };

  const handleEdit = (combo: any) => {
    setEditingCombo(combo);
    setFormData({
      name: combo.name,
      description: combo.description || "",
      original_price: combo.original_price || "",
      combo_price: combo.combo_price,
      status: combo.status,
      image: null
    });
    
    // Parse items JSON
    try {
      const parsedItems = typeof combo.items === 'string' ? JSON.parse(combo.items) : combo.items;
      setSelectedDishes(Array.isArray(parsedItems) ? parsedItems.map(Number) : []);
    } catch (e) {
      setSelectedDishes([]);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this combo?")) return;
    try {
      const res = await fetch(`/api/combos.php?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.status === "success") {
        toast.success("Combo deleted");
        fetchCombos();
      } else {
        toast.error(data.message || "Failed to delete combo");
      }
    } catch (err) {
      toast.error("Connection error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.combo_price) {
      toast.error("Name and Final Price are required");
      return;
    }

    setSubmitting(true);
    const body = new FormData();
    if (editingCombo) body.append("id", editingCombo.id);
    body.append("name", formData.name);
    body.append("description", formData.description);
    body.append("original_price", formData.original_price);
    body.append("combo_price", formData.combo_price);
    body.append("status", formData.status);
    body.append("items", JSON.stringify(selectedDishes));
    if (formData.image) body.append("image", formData.image);

    try {
      const res = await fetch("/api/combos.php", {
        method: "POST",
        body
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success(editingCombo ? "Combo updated" : "Combo created");
        setIsModalOpen(false);
        fetchCombos();
      } else {
        toast.error(data.message || "Error saving combo");
      }
    } catch (err) {
      toast.error("Connection error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Combos & Offers</h1>
          <p className="text-muted-foreground mt-1">Bundle your best-selling items into attractive offers.</p>
        </div>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="h-5 w-5" />
          Create New Combo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center">Loading...</div>
        ) : combos.length === 0 ? (
          <div className="col-span-full py-20 bg-white rounded-3xl border border-dashed text-center text-muted-foreground">
            No active combos found. Create a bundle deal!
          </div>
        ) : combos.map((combo) => (
          <div key={combo.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
            <div className="w-full h-48 overflow-hidden relative">
              <img 
                src={combo.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} 
                alt={combo.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md backdrop-blur-md ${combo.status === 'Active' ? 'bg-green-500/90 text-white' : 'bg-gray-500/90 text-white'}`}>
                {combo.status}
              </span>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{combo.name}</h3>
              <p className="text-sm font-medium text-muted-foreground mt-1 mb-4 line-clamp-2">
                {combo.description || "Limited time delicious combo pack."}
              </p>
              
              <div className="mt-auto flex items-center justify-between">
                <div className="flex flex-col">
                  {combo.original_price > 0 && Number(combo.original_price) > Number(combo.combo_price) && (
                    <span className="text-xs text-muted-foreground line-through">₹{combo.original_price}</span>
                  )}
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-black text-gray-900 leading-none">₹{combo.combo_price}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(combo)} className="p-2.5 bg-gray-50 text-gray-600 hover:bg-primary/10 hover:text-primary rounded-xl transition-all">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(combo.id)} className="p-2.5 bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col scale-in-center">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-20">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCombo ? "Edit Combo" : "Create New Combo"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar flex-1 flex flex-col lg:flex-row gap-8">
              {/* Left Column: Form Details */}
              <div className="flex-1 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Combo Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                    placeholder="e.g. Family Gala Pack"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium resize-none"
                    placeholder="Describe the items in this combo..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Original Price (₹)</label>
                    <input 
                      type="number" 
                      value={formData.original_price}
                      onChange={e => setFormData({...formData, original_price: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-2xl focus:outline-none font-medium text-muted-foreground"
                      placeholder="Auto calculated"
                    />
                    <p className="text-xs text-muted-foreground mt-1 ml-1">Sum of selected dishes</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Final Price (₹) *</label>
                    <input 
                      type="number" 
                      required
                      value={formData.combo_price}
                      onChange={e => setFormData({...formData, combo_price: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-primary"
                      placeholder="Discounted price"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium appearance-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Combo Image</label>
                    <div className="relative group w-full h-[52px]">
                      <div className="absolute inset-0 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center gap-2 group-hover:bg-gray-100 transition-colors">
                        <Upload className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-600">Choose Image</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => setFormData({...formData, image: e.target.files?.[0] || null})}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Dish Selection */}
              <div className="flex-1 bg-gray-50 rounded-[2rem] p-6 border border-gray-100 flex flex-col h-[500px]">
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center justify-between">
                  <span>Included Dishes</span>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs">
                    {selectedDishes.length} Selected
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground mb-4">Select the dishes that make up this combo pack. Original price will calculate automatically.</p>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                  {dishes.map(dish => {
                    const isSelected = selectedDishes.includes(Number(dish.id));
                    return (
                      <div 
                        key={dish.id} 
                        onClick={() => toggleDish(Number(dish.id))}
                        className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer border transition-all duration-200 ${
                          isSelected 
                            ? "bg-primary/5 border-primary shadow-sm shadow-primary/10" 
                            : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isSelected ? "bg-primary border-primary text-white" : "border-gray-300 bg-gray-50"
                        }`}>
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                        </div>
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {dish.image_url ? (
                            <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-gray-400">{dish.name[0]}</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold truncate ${isSelected ? "text-primary" : "text-gray-900"}`}>{dish.name}</p>
                          <p className="text-xs text-muted-foreground font-medium">₹{dish.selling_price}</p>
                        </div>
                      </div>
                    );
                  })}
                  {dishes.length === 0 && (
                     <div className="text-center py-10 text-muted-foreground text-sm font-medium">No dishes found in inventory.</div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 mt-auto">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 font-bold text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                {submitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                ) : (
                  editingCombo ? 'Update Combo' : 'Save Combo'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComboManagement;
