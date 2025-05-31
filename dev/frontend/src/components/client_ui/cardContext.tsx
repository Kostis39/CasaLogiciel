"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Nouveau type avec 'type' pour distinguer produit/abonnement
type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity?: number;
  type: "produit" | "abonnement" | "ticket";
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeOneFromCart: (id: number, type: CartItem["type"]) => void;
  removeFromCart: (id: number, type: CartItem["type"]) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Charger depuis localStorage au démarrage
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCartItems(JSON.parse(stored));
    }
  }, []);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.type === item.type
      );
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.type === item.type
            ? { ...i, quantity: (i.quantity || 1) + 1 }
            : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: number, type: CartItem["type"]) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id || item.type !== type));
  };

  const removeOneFromCart = (id: number, type: CartItem["type"]) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id && item.type === type
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        .filter((item) => (item.quantity || 0) > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, removeOneFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
