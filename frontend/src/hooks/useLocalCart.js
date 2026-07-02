import { useCallback, useState, useEffect } from "react";

const GUEST_CART_KEY = "jemz_guest_cart";

export function useLocalCart() {
  const [cart, setCart] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(GUEST_CART_KEY);
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.warn("Failed to parse cart from localStorage", e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  const addItem = useCallback((product, quantity, notes) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, notes }
            : item,
        );
      }
      return [...prev, { product, quantity, notes, id: crypto.randomUUID() }];
    });
  }, []);

  const updateItem = useCallback((itemId, quantity, notes) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity, notes } : item,
      ),
    );
  }, []);

  const removeItem = useCallback((itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const clear = useCallback(() => {
    setCart([]);
  }, []);

  return {
    cart,
    addItem,
    updateItem,
    removeItem,
    clear,
    isHydrated,
  };
}
