import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem } from '../utils/database';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product_id: string, quantity: number, price: number) => void;
  removeFromCart: (product_id: string) => void;
  updateQuantity: (product_id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('instashop_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('instashop_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product_id: string, quantity: number, price: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product_id === product_id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.product_id === product_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product_id, quantity, price }];
    });
  };

  const removeFromCart = (product_id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product_id !== product_id));
  };

  const updateQuantity = (product_id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(product_id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product_id === product_id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
