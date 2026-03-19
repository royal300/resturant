import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { FoodItem } from "@/data/menuData";
import { toast } from "sonner";

export interface CartItem extends FoodItem {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  tableNumber: string;
  items: CartItem[];
  total: number;
  status: "Pending" | "Preparing" | "Ready" | "Completed";
  createdAt: Date;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
  
  // Coupon Support
  coupon: any | null;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  discount: number;
  finalPrice: number;
  
  placeOrder: (customerName: string, phone: string, tableNumber: string) => Promise<Order>;
  contactMessages: ContactMessage[];
  addContactMessage: (msg: Omit<ContactMessage, "id" | "createdAt">) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [coupon, setCoupon] = useState<any | null>(null);

  const addToCart = useCallback((item: FoodItem) => {
    setItems(prev => {
      const existing = prev.find(i => String(i.id) === String(item.id));
      if (existing) return prev.map(i => String(i.id) === String(item.id) ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string | number) => {
    setItems(prev => prev.filter(i => String(i.id) !== String(id)));
  }, []);

  const updateQuantity = useCallback((id: string | number, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => String(i.id) !== String(id)));
    } else {
      setItems(prev => prev.map(i => String(i.id) === String(id) ? { ...i, quantity } : i));
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCoupon(null);
  }, []);

  const totalPrice = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const discount = useMemo(() => {
    if (!coupon) return 0;
    if (coupon.type === 'percent') {
      return (totalPrice * coupon.value) / 100;
    } else {
      return Math.min(coupon.value, totalPrice);
    }
  }, [coupon, totalPrice]);

  const finalPrice = totalPrice - discount;

  const applyCoupon = useCallback(async (code: string) => {
    try {
      const res = await fetch("/api/validate_coupon.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, totalPrice })
      });
      const data = await res.json();
      if (data.status === "success") {
        setCoupon(data.coupon);
        toast.success("Coupon applied successfully! 🎉");
      } else {
        setCoupon(null);
        toast.error(data.message || "Invalid coupon code");
      }
    } catch (err) {
      toast.error("Failed to validate coupon");
    }
  }, [totalPrice]);

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    toast.info("Coupon removed");
  }, []);

  const placeOrder = useCallback(async (customerName: string, phone: string, tableNumber: string): Promise<Order> => {
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    
    // Send order to PHP API
    try {
      const resp = await fetch("/api/place_order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: orderId,
          customerName,
          phone,
          tableNumber,
          items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          totalPrice: finalPrice,
          couponId: coupon?.id || null
        }),
      });
      
      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${resp.status}`);
      }
    } catch (e) {
      console.error("Failed to submit order to server:", e);
      throw e;
    }

    const completedOrder: Order = {
      id: orderId,
      customerName,
      phone,
      tableNumber,
      items: [...items],
      total: finalPrice,
      status: "Pending",
      createdAt: new Date(),
    };

    setItems([]);
    setCoupon(null);
    return completedOrder;
  }, [items, finalPrice, coupon]);

  const addContactMessage = useCallback((msg: Omit<ContactMessage, "id" | "createdAt">) => {
    setContactMessages(prev => [...prev, { ...msg, id: `MSG-${Date.now()}`, createdAt: new Date() }]);
  }, []);

  return (
    <CartContext.Provider value={{ 
      items, addToCart, removeFromCart, updateQuantity, clearCart, 
      totalPrice, totalItems, 
      coupon, applyCoupon, removeCoupon, discount, finalPrice,
      placeOrder, contactMessages, addContactMessage 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
