// contexts/CartContext.tsx
"use client";

import { CartContextType, CartItem, Product } from "@/interface";
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("vendingMachineCart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("vendingMachineCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product._id);

      if (existingItem) {
        // Update quantity if item exists
        const newQuantity = existingItem.quantity + quantity;
        // Check if new quantity doesn't exceed available units
        const finalQuantity = Math.min(newQuantity, product.available_units);

        return prevItems.map((item) =>
          item.id === product._id ? { ...item, quantity: finalQuantity } : item
        );
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          id: product._id,
          name: product.name,
          price: product.price,
          display_image_url: product.display_image_url,
          quantity: Math.min(quantity, product.available_units),
          available_units: product.available_units,
        };
        return [...prevItems, newItem];
      }
    });

    // Show cart popup when item is added or quantity increased
    showCartPopup();
  };

  // New function to show cart popup (can be called from anywhere)
  const showCartPopup = () => {
    setIsCartOpen(true);
    // Auto-hide after 3 seconds if user doesn't interact
    setTimeout(() => {
      setIsCartOpen(false);
    }, 3000);
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: Math.min(quantity, item.available_units) }
          : item
      )
    );

    // Show cart popup when quantity is updated
    showCartPopup();
  };

  const clearCart = () => {
    setCartItems([]);
    setIsCartOpen(false);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Close cart popup when cart becomes empty
  useEffect(() => {
    if (cartItems.length === 0) {
      setIsCartOpen(false);
    }
  }, [cartItems.length]);

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    isCartOpen,
    setIsCartOpen,
    showCartPopup,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
