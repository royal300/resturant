import React, { createContext, useContext, useState, useCallback } from "react";
import type { FoodItem } from "@/data/menuData";

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

interface CartContextType {
  items: CartItem[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
  placeOrder: (customerName: string, phone: string, tableNumber: string) => Promise<Order>;
  contactMessages: ContactMessage[];
  addContactMessage: (msg: Omit<ContactMessage, "id" | "createdAt">) => void;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  const addToCart = useCallback((item: FoodItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.id !== id));
    } else {
      setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = useCallback(async (customerName: string, phone: string, tableNumber: string): Promise<Order> => {
    const order: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      customerName,
      phone,
      tableNumber,
      items: [...items],
      total: totalPrice,
      status: "Pending",
      createdAt: new Date(),
    };

    // Send order to PHP API
    try {
      await fetch("/api/place_order.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: order.id,
          customerName: order.customerName,
          phone: order.phone,
          tableNumber: order.tableNumber,
          items: order.items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          totalPrice: order.total,
        }),
      });
    } catch (e) {
      console.error("Failed to submit order to server:", e);
    }

    setItems([]);
    return order;
  }, [items, totalPrice]);

  const addContactMessage = useCallback((msg: Omit<ContactMessage, "id" | "createdAt">) => {
    setContactMessages(prev => [...prev, { ...msg, id: `MSG-${Date.now()}`, createdAt: new Date() }]);
  }, []);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems, placeOrder, contactMessages, addContactMessage }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
