import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'manager';
}

interface AdminContextType {
  adminUser: AdminUser | null;
  login: (userData: AdminUser) => void;
  logout: () => void;
  isAuthed: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem("admin_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData: AdminUser) => {
    setAdminUser(userData);
    localStorage.setItem("admin_user", JSON.stringify(userData));
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem("admin_user");
  };

  const isAuthed = !!adminUser;

  return (
    <AdminContext.Provider value={{ adminUser, login, logout, isAuthed }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
};
