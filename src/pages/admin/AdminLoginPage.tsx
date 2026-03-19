import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Utensils, Loader2, Lock, Mail } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from "sonner";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill all fields");

    setLoading(true);
    try {
      const res = await fetch("/api/admin_login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.status === "success") {
        login(data.user);
        toast.success("Welcome back, " + data.user.name);
        const from = location.state?.from?.pathname || "/admin";
        navigate(from, { replace: true });
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (err) {
      toast.error("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl"></div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20 animate-in fade-in zoom-in duration-500">
            <Utensils className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Royal Admin</h1>
          <p className="text-muted-foreground mt-2 font-medium">Please sign in to your dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-10 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Work Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@royal300.com"
                className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary focus:outline-none transition-all duration-200 text-gray-900 font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-gray-700">Password</label>
              <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot password?</button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary focus:outline-none transition-all duration-200 text-gray-900 font-medium"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 active:scale-[0.98] text-white py-4 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg shadow-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In →"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Not a staff member? <a href="/" className="font-bold text-primary hover:underline">Go back home</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
