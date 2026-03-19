import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, FolderOpen, X, Loader2, ChefHat, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const CategoryManagement = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Dish Drilldown State
  const [viewingCategory, setViewingCategory] = useState<any | null>(null);
  const [categoryDishes, setCategoryDishes] = useState<any[]>([]);
  const [loadingDishes, setLoadingDishes] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories.php");
      const data = await res.json();
      if (data.status === "success") setCategories(data.categories);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchDishesByCategory = async (cat: any) => {
    setViewingCategory(cat);
    setLoadingDishes(true);
    try {
      const res = await fetch(`/api/dishes.php?category_id=${cat.id}`);
      const data = await res.json();
      if (data.status === "success") {
        setCategoryDishes(data.dishes);
      }
    } catch (err) {
      toast.error("Failed to load dishes for this category");
    } finally {
      setLoadingDishes(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return toast.error("Name is required");
    
    setSubmitting(true);
    try {
      const formData = new FormData();
      if (editingId) formData.append("id", editingId);
      formData.append("name", newName);
      formData.append("description", newDesc);
      if (selectedImage) formData.append("image", selectedImage);

      const res = await fetch("/api/categories.php", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (data.status === "success") {
        toast.success(editingId ? "Category updated" : "Category added");
        resetForm();
        fetchCategories();
      } else {
        toast.error(data.message || "Error saving category");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cat: any) => {
    setEditingId(cat.id);
    setNewName(cat.name);
    setNewDesc(cat.description || "");
    setSelectedImage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"? This might affect dishes assigned to it.`)) return;
    
    try {
      const res = await fetch(`/api/categories.php?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error(data.message || "Error deleting category");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setNewName("");
    setNewDesc("");
    setSelectedImage(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display">Menu Categories</h1>
          <p className="text-muted-foreground mt-1">Organize your dishes into manageable categories.</p>
        </div>
      </div>

      {/* Add/Edit Form */}
      <div className={`bg-white p-8 rounded-[32px] border-2 transition-all duration-300 shadow-sm relative overflow-hidden group ${editingId ? 'border-primary/20 bg-primary/5 shadow-lg' : 'border-gray-100 shadow-sm'}`}>
        <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors ${editingId ? 'bg-primary' : 'bg-primary/20 group-hover:bg-primary'}`}></div>
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold flex items-center gap-3">
            {editingId ? (
              <Edit2 className="h-6 w-6 text-primary" />
            ) : (
              <Plus className="h-6 w-6 text-primary" />
            )}
            {editingId ? "Edit Category" : "Add New Category"}
          </h2>
          {editingId && (
            <button 
              onClick={resetForm}
              className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900"
              title="Cancel editing"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2 text-left">
            <label className="text-sm font-black text-gray-700 ml-1 uppercase tracking-wider">Category Name</label>
            <input 
              type="text" 
              value={newName}
              required
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Italian Main Course"
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-primary/20 focus:outline-none transition-all font-semibold shadow-inner"
            />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-sm font-black text-gray-700 ml-1 uppercase tracking-wider">Description (Optional)</label>
            <input 
              type="text" 
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Brief overview"
              className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-[20px] focus:bg-white focus:border-primary/20 focus:outline-none transition-all font-semibold shadow-inner"
            />
          </div>
          <div className="md:col-span-2 space-y-2 text-left">
            <label className="text-sm font-black text-gray-700 ml-1 uppercase tracking-wider">Category Image</label>
            <div className={`relative h-48 rounded-[32px] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 bg-gray-50/50 group/upload ${selectedImage ? 'border-primary/50 bg-primary/5' : 'border-gray-200 hover:border-primary/30 hover:bg-gray-50'}`}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {selectedImage || (editingId && categories.find(c => String(c.id) === String(editingId))?.image_url) ? (
                  <div className="flex flex-col items-center gap-2">
                    <img 
                      src={selectedImage ? URL.createObjectURL(selectedImage) : categories.find(c => String(c.id) === String(editingId))?.image_url} 
                      alt="Preview" 
                      className="w-24 h-24 object-cover rounded-2xl shadow-md border-2 border-white"
                    />
                    <span className="text-xs font-bold text-primary truncate max-w-[200px]">
                      {selectedImage ? selectedImage.name : "Current Image"}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gray-400 group-hover/upload:text-primary transition-colors">
                      <Plus className="h-6 w-6" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-900">Choose an image</p>
                      <p className="text-[10px] text-gray-500 font-medium">PNG, JPG up to 5MB</p>
                    </div>
                  </>
                )}
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end gap-3 mt-2">
            {editingId && (
               <button 
                type="button" 
                onClick={resetForm}
                className="bg-white text-gray-600 px-8 py-4 rounded-[20px] font-bold border border-gray-100 hover:bg-gray-50 transition-all font-display"
              >
                Cancel
              </button>
            )}
            <button 
              type="submit" 
              disabled={submitting}
              className="bg-primary text-white px-10 py-4 rounded-[20px] font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all font-display flex items-center gap-2"
            >
              {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
              {editingId ? "Update Category" : "Save Category"}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold px-1 font-display flex items-center gap-2">
          Existings Categories
          <span className="text-xs font-black bg-gray-100 text-gray-400 px-2 py-1 rounded-full">{categories.length}</span>
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground bg-white rounded-[32px] border-2 border-dashed border-gray-100 italic">
               <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary/30" />
               Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground bg-white rounded-[32px] border-2 border-dashed border-gray-100 italic">
              No categories found. Start by adding one above.
            </div>
          ) : categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => fetchDishesByCategory(cat)}
              className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer animate-in fade-in"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gray-50 rounded-[22px] flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:bg-primary/5 transition-all shadow-inner border border-gray-50 overflow-hidden">
                  {cat.image_url ? (
                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <FolderOpen className="h-8 w-8" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-sm text-gray-500 font-semibold leading-relaxed mt-0.5">{cat.description || "No description provided."}</p>
                </div>
              </div>
              <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                <button 
                  onClick={() => handleEdit(cat)}
                  className="p-4 bg-gray-50 text-gray-500 hover:bg-primary/10 hover:text-primary rounded-2xl transition-all shadow-sm active:scale-95"
                  title="Edit Category"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-4 bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all shadow-sm active:scale-95"
                  title="Delete Category"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dishes Drilldown Modal */}
      {viewingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <ChefHat className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-display">{viewingCategory.name} Dishes</h2>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">{categoryDishes.length} items listed in this category.</p>
                </div>
              </div>
              <button 
                onClick={() => setViewingCategory(null)}
                className="p-2.5 hover:bg-gray-200/50 rounded-2xl transition-colors text-gray-400 hover:text-gray-900"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-8 max-h-[60vh] overflow-y-auto scrollbar-hide">
              {loadingDishes ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="h-10 w-10 text-primary animate-spin opacity-50" />
                  <p className="text-sm font-bold text-gray-400">Fetching delicious dishes...</p>
                </div>
              ) : categoryDishes.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-gray-200">
                    <X className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-muted-foreground font-bold italic">No dishes found in this category.</p>
                  <Link to="/admin/menu" className="text-primary text-sm font-black mt-4 inline-block hover:underline">
                    + Add your first dish to {viewingCategory.name}
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {categoryDishes.map((dish) => (
                    <div key={dish.id} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-primary/20 transition-all group">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                        <img 
                          src={dish.image_url || "/placeholder.svg"} 
                          alt={dish.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-gray-900 text-sm">{dish.name}</h4>
                          <span className="text-xs font-black text-primary">₹{dish.selling_price}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 line-clamp-1 font-semibold mt-0.5">{dish.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end">
                <Link 
                  to="/admin/menu"
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold text-xs hover:bg-gray-50 transition-all shadow-sm"
                >
                  Manage Dishes in Menu Page <ExternalLink className="h-3.5 w-3.5" />
                </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
