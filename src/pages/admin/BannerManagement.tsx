import { useState, useEffect } from "react";
import { Plus, Image as ImageIcon, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Banner {
  id: string;
  image_url: string;
  status: 'Active' | 'Inactive';
  created_at: string;
}

const BannerManagement = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/banners.php");
      const data = await res.json();
      if (data.status === "success") {
        setBanners(data.banners);
      }
    } catch (err) {
      toast.error("Failed to fetch banners");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('status', 'Active');

    setIsUploading(true);
    try {
      const res = await fetch("/api/banners.php", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success(data.message);
        fetchBanners();
      } else {
        toast.error(data.message || "Failed to upload banner");
      }
    } catch (err) {
      toast.error("Failed to upload banner");
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const toggleStatus = async (banner: Banner) => {
    const newStatus = banner.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch("/api/banners.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_status", id: banner.id, status: newStatus }),
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success(`Banner marked as ${newStatus}`);
        setBanners(banners.map(b => b.id === banner.id ? { ...b, status: newStatus } : b));
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const deleteBanner = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    
    try {
      const res = await fetch("/api/banners.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      const data = await res.json();
      if (data.status === "success") {
        toast.success("Banner deleted successfully");
        setBanners(banners.filter(b => b.id !== id));
      }
    } catch (err) {
      toast.error("Failed to delete banner");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Offer Banners</h1>
          <p className="text-muted-foreground mt-1">Manage promotional sliders shown to customers on the Order page.</p>
        </div>
        
        <div>
          <label className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
            <Plus className="h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload New Banner"}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="text-center py-10 font-bold text-gray-400">Loading Banners...</div>
        ) : banners.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-400">
              <ImageIcon className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No Banners Found</h3>
            <p className="text-muted-foreground mt-1 max-w-sm">Upload promotional banners (1080x700 recommended) to engage your customers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
                <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
                  <img 
                    src={banner.image_url} 
                    alt="Promo Banner" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg backdrop-blur-md shadow-sm border ${
                      banner.status === 'Active' 
                        ? 'bg-green-500/90 text-white border-green-500/20' 
                        : 'bg-gray-500/90 text-white border-gray-500/20'
                    }`}>
                      {banner.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 flex items-center justify-between border-t bg-gray-50/50">
                   <div className="text-xs font-bold text-gray-500">
                     Added {new Date(banner.created_at).toLocaleDateString()}
                   </div>
                   <div className="flex items-center gap-2">
                     <button 
                       onClick={() => toggleStatus(banner)}
                       className={`p-2 rounded-xl border transition-all ${
                         banner.status === 'Active' 
                           ? 'bg-white text-orange-500 hover:bg-orange-50 border-gray-200' 
                           : 'bg-white text-green-500 hover:bg-green-50 border-gray-200'
                       }`}
                       title={banner.status === 'Active' ? 'Deactivate Banner' : 'Activate Banner'}
                     >
                       {banner.status === 'Active' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                     </button>
                     <button 
                       onClick={() => deleteBanner(banner.id)}
                       className="p-2 bg-white text-red-500 hover:bg-red-50 rounded-xl border border-gray-200 transition-all"
                       title="Delete Banner"
                     >
                       <Trash2 className="h-4 w-4" />
                     </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerManagement;
