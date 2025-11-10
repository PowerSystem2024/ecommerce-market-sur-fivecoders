import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity) => {
    setCartItems(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.qty + quantity, product.stock);
        return prev.map(p => p.id === product.id ? { ...p, qty: newQty } : p);
      } else {
        return [...prev, { ...product, qty: Math.min(quantity, product.stock) }];
      }
    });
  };

  const removeFromCart = (id) => setCartItems(prev => prev.filter(p => p.id !== id));
  const clearCart = () => setCartItems([]);
  const updateQty = (id, qty) => {
    setCartItems(prev => prev.map(p => p.id === id ? { ...p, qty: Math.min(qty, p.stock) } : p));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, updateQty }}>
      {children}
    </CartContext.Provider>
  );
};

