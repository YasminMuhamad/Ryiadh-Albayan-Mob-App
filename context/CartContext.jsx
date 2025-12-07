import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = useCallback((course) => {
    if (!course?.id) return;
    setCartItems((prev) => {
      const exists = prev.some((item) => item.id === course.id);
      if (exists) return prev;
      return [...prev, course];
    });
  }, []);

  const removeFromCart = useCallback((courseId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== courseId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const value = useMemo(
    () => ({
      cartItems,
      cartCount: cartItems.length,
      addToCart,
      removeFromCart,
      clearCart,
    }),
    [cartItems, addToCart, removeFromCart, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
