import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, ArrowRight, Github, Lock, ChevronLeft, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

const LoginPage = () => {
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [step, setStep] = useState<"input" | "otp">("input");
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (method === "email") {
       // Mock email login for now as requested for phone flow
       setLoading(true);
       setTimeout(() => {
         localStorage.setItem("user_authed", "true");
         toast.success("Logged in with Email");
         navigate("/dashboard");
       }, 1000);
       return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/send_otp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: inputValue }),
      });
      const data = await response.json();
      if (data.status === "success") {
        setStep("otp");
        toast.success("OTP sent to your phone! 📱");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/verify_otp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: inputValue, otp: otpValue }),
      });
      const data = await response.json();
      if (data.status === "success") {
        localStorage.setItem("user_authed", "true");
        localStorage.setItem("user_phone", inputValue);
        toast.success("Welcome Back! 👋");
        navigate("/dashboard");
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (err) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col food-pattern-bg animate-in fade-in duration-700">
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
        {/* Logo & Welcome */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20 rotate-3">
             <span className="text-white text-3xl font-black italic">RR</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
            {step === 'input' ? 'Welcome Back! 👋' : 'Verify Mobile 🔒'}
          </h1>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            {step === 'input' ? 'Login to enjoy your favorite meals' : `Enter the 6-digit code sent to ${inputValue}`}
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full bg-white rounded-[2.5rem] shadow-premium p-8 border border-gray-100 relative overflow-hidden">
          {step === 'otp' && (
            <button 
              onClick={() => setStep('input')}
              className="absolute top-8 left-8 text-gray-400 hover:text-primary transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          {/* Tabs - Only show on input step */}
          {step === 'input' && (
            <div className="flex p-1 bg-gray-50 rounded-2xl mb-8">
              <button 
                onClick={() => setMethod("phone")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${method === 'phone' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}
              >
                Phone
              </button>
              <button 
                onClick={() => setMethod("email")}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${method === 'email' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}
              >
                Email
              </button>
            </div>
          )}

          <form onSubmit={step === 'input' ? handleSendOTP : handleVerifyOTP} className="space-y-6">
            {step === 'input' ? (
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">
                  {method === 'phone' ? 'Phone Number' : 'Email Address'}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {method === 'phone' ? <Phone className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                  </div>
                  <input
                    type={method === 'phone' ? 'tel' : 'email'}
                    required
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={method === 'phone' ? '+91 9876543210' : 'name@example.com'}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-50 focus:border-primary/50 focus:outline-none font-bold placeholder:text-gray-300 transition-all"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">
                  6-Digit OTP Code
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                    placeholder="0 0 0 0 0 0"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-50 focus:border-primary/50 focus:outline-none font-black text-center text-xl tracking-[0.5em] placeholder:text-gray-300 transition-all"
                  />
                </div>
                <button 
                  type="button" 
                  onClick={handleSendOTP}
                  className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity mx-auto"
                >
                  <RefreshCcw className="h-3 w-3" /> Resend Code
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (step === 'input' ? "Sending..." : "Verifying...") : (
                <>
                  {step === 'input' ? 'Continue' : 'Verify & Login'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {step === 'input' && (
            <>
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-white px-4 text-gray-400">Or continue with</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors font-bold text-xs">
                   <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                   Google
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors font-bold text-xs">
                   <Github className="w-4 h-4" />
                   GitHub
                </button>
              </div>
            </>
          )}
        </div>

        <p className="mt-8 text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest px-8 leading-relaxed">
          By continuing, you agree to our <span className="text-primary cursor-pointer">Terms of Service</span> and <span className="text-primary cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
