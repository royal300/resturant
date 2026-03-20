import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Phone, ArrowRight, Lock, ChevronLeft, RefreshCcw, User } from "lucide-react";
import { toast } from "sonner";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<"input" | "otp">("input");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const navigate = useNavigate();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/send_otp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (data.status === "success") {
        setIsNewUser(data.is_new);
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
    if (isNewUser && !name) {
      toast.error("Please enter your name to complete signup");
      return;
    }
    if (otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/verify_otp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone, 
          otp,
          name: isNewUser ? name : undefined 
        }),
      });
      const data = await response.json();
      if (data.status === "success") {
        localStorage.setItem("user_authed", "true");
        localStorage.setItem("user_phone", phone);
        localStorage.setItem("user_name", data.user.name);
        localStorage.setItem("user_id", data.user.id);
        toast.success(isNewUser ? "Account created! Welcome 🥂" : "Welcome Back! 👋");
        navigate(redirect);
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
            {step === 'input' ? 'Welcome! 👋' : (isNewUser ? 'Create Account ✨' : 'Verify Mobile 🔒')}
          </h1>
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
            {step === 'input' 
              ? 'Login or Sign up with your mobile number' 
              : (isNewUser ? 'Tell us your name and enter the code' : `Enter the 6-digit code sent to ${phone}`)}
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

          <form onSubmit={step === 'input' ? handleSendOTP : handleVerifyOTP} className="space-y-6">
            {step === 'input' ? (
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-50 focus:border-primary/50 focus:outline-none font-bold placeholder:text-gray-300 transition-all"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {isNewUser && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-50 focus:border-primary/50 focus:outline-none font-bold placeholder:text-gray-300 transition-all"
                      />
                    </div>
                  </div>
                )}
                
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
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="0 0 0 0 0 0"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-50 focus:border-primary/50 focus:outline-none font-black text-center text-xl tracking-[0.5em] placeholder:text-gray-300 transition-all"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleSendOTP()}
                    className="mt-4 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity mx-auto"
                  >
                    <RefreshCcw className="h-3 w-3" /> Resend Code
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (step === 'input' ? "Sending..." : "Verifying...") : (
                <>
                  {step === 'input' ? 'Continue' : (isNewUser ? 'Create Account' : 'Verify & Login')}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest px-8 leading-relaxed">
          By continuing, you agree to our <span className="text-primary cursor-pointer">Terms of Service</span> and <span className="text-primary cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
