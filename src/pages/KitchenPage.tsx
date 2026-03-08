import { useState, useEffect, useRef, useCallback } from "react";
import { Clock, ChefHat, CheckCircle2, Bell, LogOut, Utensils, UtensilsCrossed } from "lucide-react";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface KitchenOrder {
  id: string;
  customer_name: string;
  phone: string;
  table_number: string;
  items: OrderItem[];
  total_price: number;
  status: "Pending" | "Preparing" | "Ready";
  created_at: string;
}

const KITCHEN_USER = "kitchen";
const KITCHEN_PASS = "kitchen123";

// Red/white column config
const statusConfig = {
  Pending: {
    label: "New Order",
    headerBg: "bg-red-600",
    cardBorder: "border-red-300",
    cardBg: "bg-red-50",
    badgeBg: "bg-red-600 text-white",
    icon: Bell,
    dot: "bg-red-500",
    btn: "bg-red-600 hover:bg-red-700 text-white",
    btnLabel: "Start Cooking",
    btnIcon: ChefHat,
  },
  Preparing: {
    label: "Cooking",
    headerBg: "bg-orange-500",
    cardBorder: "border-orange-300",
    cardBg: "bg-orange-50",
    badgeBg: "bg-orange-500 text-white",
    icon: ChefHat,
    dot: "bg-orange-400",
    btn: "bg-green-600 hover:bg-green-700 text-white",
    btnLabel: "Mark Ready",
    btnIcon: CheckCircle2,
  },
  Ready: {
    label: "Ready to Serve",
    headerBg: "bg-green-600",
    cardBorder: "border-green-300",
    cardBg: "bg-green-50",
    badgeBg: "bg-green-600 text-white",
    icon: CheckCircle2,
    dot: "bg-green-500",
    btn: "bg-gray-500 hover:bg-gray-600 text-white",
    btnLabel: "Complete",
    btnIcon: CheckCircle2,
  },
};

const KitchenPage = () => {
  // ─── Auth ────────────────────────────────────────────────────────────────
  const [authed, setAuthed] = useState(false);
  const [loginForm, setLoginForm] = useState({ id: "", pass: "" });
  const [loginError, setLoginError] = useState("");
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Unlock AudioContext on login click (user interaction required by browser)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.id === KITCHEN_USER && loginForm.pass === KITCHEN_PASS) {
      // Create and immediately resume AudioContext on user gesture
      try {
        const ctx = new AudioContext();
        ctx.resume();
        audioCtxRef.current = ctx;
      } catch (err) {
        console.warn("AudioContext creation failed:", err);
      }
      setAuthed(true);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Please try again.");
    }
  };

  // ─── Bell Sound ──────────────────────────────────────────────────────────
  const playBell = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    // Resume if suspended
    if (ctx.state === "suspended") ctx.resume();

    // Multiple chimes for a clear bell effect
    const chimes = [
      { freq: 1040, time: 0, dur: 1.5 },
      { freq: 880, time: 0.25, dur: 1.5 },
      { freq: 1040, time: 0.5, dur: 1.5 },
    ];

    chimes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const now = ctx.currentTime + time;

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.6, now + dur);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.5, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + dur);

      osc.start(now);
      osc.stop(now + dur);
    });
  }, []);

  // ─── Orders & Polling ────────────────────────────────────────────────────
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [bellCount, setBellCount] = useState(0);
  const knownIds = useRef<Set<string>>(new Set());
  const initialized = useRef(false);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/get_orders.php");
      const data = await res.json();
      if (!data.success) return;

      const newOrders: KitchenOrder[] = data.orders;
      const incomingIds = new Set(newOrders.map((o: KitchenOrder) => o.id));

      if (initialized.current) {
        const hasNew = newOrders.some((o: KitchenOrder) => !knownIds.current.has(o.id));
        if (hasNew) {
          playBell();
          setBellCount(c => c + 1);
        }
      } else {
        initialized.current = true;
      }

      knownIds.current = incomingIds;
      setOrders(newOrders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  }, [playBell]);

  useEffect(() => {
    if (!authed) return;
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [authed, fetchOrders]);

  const updateStatus = async (id: string, nextStatus: string) => {
    await fetch("/api/update_order.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: nextStatus }),
    });
    fetchOrders();
  };

  const timeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const pending = orders.filter(o => o.status === "Pending");
  const preparing = orders.filter(o => o.status === "Preparing");
  const ready = orders.filter(o => o.status === "Ready");

  // ─── Login Screen ─────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-red-700 flex items-center justify-center px-4">
        {/* Diagonal accent */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-red-800/50" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-red-600/40" />
        </div>
        <div className="relative w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-18 h-18 w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-xl">
              <ChefHat className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-white">Kitchen Panel</h1>
            <p className="text-red-200 text-sm mt-1">Royal Restaurant — Staff Only</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-2xl p-8 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Staff ID</label>
              <input
                type="text"
                autoFocus
                value={loginForm.id}
                onChange={e => setLoginForm(p => ({ ...p, id: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none text-gray-800 font-medium transition-colors"
                placeholder="Enter staff ID"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={loginForm.pass}
                onChange={e => setLoginForm(p => ({ ...p, pass: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 focus:outline-none text-gray-800 font-medium transition-colors"
                placeholder="Enter password"
              />
            </div>
            {loginError && (
              <p className="text-red-600 text-sm font-medium text-center bg-red-50 py-2 rounded-lg">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-3.5 rounded-xl font-bold text-base transition-colors shadow-md shadow-red-200"
            >
              Enter Kitchen →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Kitchen Dashboard ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-red-600 shadow-md px-6 py-3.5 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow">
            <ChefHat className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">Kitchen Dashboard</h1>
            <p className="text-red-200 text-xs mt-0.5">Royal Restaurant</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
            Live · {orders.length} active
          </div>
          {bellCount > 0 && (
            <div className="flex items-center gap-1.5 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full">
              <Bell className="h-3.5 w-3.5" />
              {bellCount}
            </div>
          )}
          <button
            onClick={() => { setAuthed(false); initialized.current = false; knownIds.current = new Set(); }}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {(["Pending", "Preparing", "Ready"] as const).map(col => {
          const colOrders = col === "Pending" ? pending : col === "Preparing" ? preparing : ready;
          const cfg = statusConfig[col];
          const Icon = cfg.icon;

          return (
            <div key={col}>
              {/* Column Header */}
              <div className={`${cfg.headerBg} rounded-xl px-4 py-3 mb-4 flex items-center justify-between shadow-sm`}>
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-white" />
                  <span className="text-white font-bold text-sm">{cfg.label}</span>
                </div>
                <span className="bg-white/25 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  {colOrders.length}
                </span>
              </div>

              {/* Order Cards */}
              <div className="space-y-2">
                {colOrders.length === 0 ? (
                  <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-6 text-center">
                    <UtensilsCrossed className="h-5 w-5 text-gray-300 mx-auto mb-1.5" />
                    <p className="text-gray-400 text-xs">No orders</p>
                  </div>
                ) : (
                  colOrders.map(order => (
                    <div
                      key={order.id}
                      className={`bg-white rounded-xl border-2 ${cfg.cardBorder} shadow-sm overflow-hidden`}
                    >
                      {/* Top accent */}
                      <div className={`${cfg.headerBg} h-1 w-full`} />

                      <div className="p-3">
                        {/* Order ID + Time + Table - compact row */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-gray-400">{order.id}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${cfg.badgeBg}`}>T-{order.table_number}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-gray-400">
                            <Clock className="h-2.5 w-2.5" />
                            {timeAgo(order.created_at)}
                          </div>
                        </div>

                        {/* Customer name - small */}
                        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                          <Utensils className="h-3 w-3" />
                          {order.customer_name}
                        </p>

                        {/* Order Items - amber highlighted */}
                        <div className="space-y-1 mb-3">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Items</p>
                          {(order.items || []).map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5"
                            >
                              <span className="text-sm font-bold text-amber-900">{item.name}</span>
                              <span className="text-xs font-extrabold bg-amber-400 text-amber-900 px-2 py-0.5 rounded-md">
                                ×{item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between border-t border-gray-100 pt-2 mb-2.5">
                          <span className="text-[10px] text-gray-400 font-medium">Total</span>
                          <span className="text-sm font-extrabold text-gray-900">₹{order.total_price}</span>
                        </div>

                        {/* Action Button */}
                        {order.status !== "Ready" ? (
                          <button
                            onClick={() => updateStatus(order.id, order.status === "Pending" ? "Preparing" : "Ready")}
                            className={`w-full ${cfg.btn} py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm`}
                          >
                            <cfg.btnIcon className="h-4 w-4" />
                            {cfg.btnLabel}
                          </button>
                        ) : (
                          <button
                            onClick={() => updateStatus(order.id, "Completed")}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 py-2.5 rounded-xl font-bold text-sm transition-colors border border-gray-200"
                          >
                            ✓ Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {orders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="text-6xl mb-4">🍽️</div>
          <p className="text-xl font-bold text-gray-700">All clear in the kitchen!</p>
          <p className="text-gray-400 text-sm mt-1">New orders will appear automatically every 5 seconds.</p>
        </div>
      )}
    </div>
  );
};

export default KitchenPage;
