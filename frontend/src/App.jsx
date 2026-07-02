import { useCallback, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { fallbackProducts } from "./data/fallbackProducts";
import { requestJson, removeAuthToken, saveAuthToken } from "./services/api";
import { useLocalCart } from "./hooks/useLocalCart";
import Header from "./components/Header";
import StatusBanner from "./components/StatusBanner";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import AuthPage from "./pages/AuthPage";
import AdminProductsPage from "./pages/AdminProductsPage";

function App() {
  const [products, setProducts] = useState(fallbackProducts);
  const [token, setToken] = useState(
    () => localStorage.getItem("jemz_token") || "",
  );
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const guestCart = useLocalCart();
  const navigate = useNavigate();

  const normalizeItems = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.items && Array.isArray(data.items)) return data.items;
    return [];
  };

  const loadProducts = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/products?limit=10`,
      );
      if (!response.ok) throw new Error("Backend unavailable");
      const data = await response.json();
      const items = Array.isArray(data) ? data : data.items || [];
      if (items.length) {
        const mapped = items.slice(0, 10).map((item, index) => ({
          id: item.id || `backend-${index + 1}`,
          name: item.name,
          description: item.description,
          price: `$${Number(item.price).toFixed(2)}`,
          tag: item.category || "Featured",
          image:
            item.image ||
            fallbackProducts[index % fallbackProducts.length].image,
        }));
        setProducts(mapped);
      }
    } catch (error) {
      console.info("Using fallback menu:", error);
    }
  }, []);

  const loadProfile = useCallback(async () => {
    if (!token) return;
    try {
      const data = await requestJson("/api/auth/me");
      setUser(data);
    } catch (error) {
      console.info("Profile unavailable:", error);
    }
  }, [token]);

  const loadCart = useCallback(async () => {
    if (!token) return;
    try {
      const data = await requestJson("/api/cart");
      setCart(normalizeItems(data));
    } catch (error) {
      console.info("Cart unavailable:", error);
    }
  }, [token]);

  const loadOrders = useCallback(async () => {
    if (!token) return;
    try {
      const data = await requestJson("/api/orders");
      setOrders(Array.isArray(data) ? data : data.items || []);
    } catch (error) {
      console.info("Orders unavailable:", error);
    }
  }, [token]);

  useEffect(() => {
    let isActive = true;

    const syncData = async () => {
      await loadProducts();
      if (!isActive) return;
      if (token) {
        await Promise.all([loadProfile(), loadCart(), loadOrders()]);
      }
    };

    void syncData();

    return () => {
      isActive = false;
    };
  }, [token, loadProducts, loadProfile, loadCart, loadOrders]);

  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => setMessage(""), 5000);
    return () => window.clearTimeout(timer);
  }, [message]);

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setMessage("");

    try {
      const data = await requestJson("/api/auth/login", {
        method: "POST",
        body: { email, password },
        auth: false,
      });
      saveAuthToken(data.token);
      setToken(data.token);
      setMessage(data.message || "Signed in successfully");
      navigate("/menu");
    } catch (error) {
      setMessage(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ email, password, fullName }) => {
    setLoading(true);
    setMessage("");

    try {
      const data = await requestJson("/api/auth/register", {
        method: "POST",
        body: {
          email,
          password,
          firstName: fullName,
        },
        auth: false,
      });
      saveAuthToken(data.token);
      setToken(data.token);
      setMessage(data.message || "Account created successfully");
      navigate("/menu");
    } catch (error) {
      setMessage(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1, notes = "") => {
    if (!token) {
      // Guest mode: add to local cart
      guestCart.addItem(product, quantity, notes);
      setMessage(`${product.name} added to cart`);
      return;
    }

    // Authenticated mode: send to backend
    try {
      const data = await requestJson("/api/cart", {
        method: "POST",
        body: { productId: product.id, quantity, notes },
      });
      setCart(normalizeItems(data));
      setMessage(`${product.name} added to cart`);
    } catch (error) {
      setMessage(error.message || "Unable to add item to cart");
    }
  };

  const updateCartItem = async (itemId, quantity, notes = "") => {
    if (!token) {
      // Guest mode
      guestCart.updateItem(itemId, quantity, notes);
      return;
    }

    // Authenticated mode
    try {
      const data = await requestJson(`/api/cart/${itemId}`, {
        method: "PUT",
        body: { quantity, notes },
      });
      setCart(normalizeItems(data));
    } catch (error) {
      setMessage(error.message || "Unable to update cart");
    }
  };

  const removeCartItem = async (itemId) => {
    if (!token) {
      guestCart.removeItem(itemId);
      return;
    }

    try {
      const data = await requestJson(`/api/cart/${itemId}`, {
        method: "DELETE",
      });
      setCart(normalizeItems(data));
    } catch (error) {
      setMessage(error.message || "Unable to remove cart item");
    }
  };

  const checkoutCart = async ({
    deliveryAddress,
    specialInstructions,
    guestName,
    guestEmail,
    guestPhone,
  }) => {
    setLoading(true);
    setMessage("");

    if (!token) {
      const payload = {
        deliveryAddress,
        specialInstructions,
        guestName,
        guestEmail,
        guestPhone,
        items: guestCart.cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          notes: item.notes,
        })),
      };

      try {
        const data = await requestJson("/api/orders/guest-checkout", {
          method: "POST",
          body: payload,
          auth: false,
        });
        guestCart.clear();
        setMessage("Order placed successfully");
        navigate("/orders");
        return data;
      } catch (error) {
        setMessage(error.message || "Checkout failed");
        throw error;
      } finally {
        setLoading(false);
      }
    }

    const payload = {
      deliveryAddress,
      specialInstructions,
    };

    try {
      const data = await requestJson("/api/orders/checkout", {
        method: "POST",
        body: payload,
      });
      setMessage("Order placed successfully");
      guestCart.clear();
      navigate(token ? "/orders" : "/menu");
      return data;
    } catch (error) {
      setMessage(error.message || "Checkout failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setToken("");
    setUser(null);
    setCart([]);
    setOrders([]);
    setMessage("Signed out successfully");
    navigate("/");
  };

  const isAdmin = Boolean(token && user?.role === "admin");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Header token={token} user={user} onLogout={logout} />
      <StatusBanner message={message} />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route
            path="/"
            element={<HomePage products={products} addToCart={addToCart} />}
          />
          <Route
            path="/menu"
            element={<MenuPage products={products} addToCart={addToCart} />}
          />
          <Route
            path="/products"
            element={<ProductsPage addToCart={addToCart} />}
          />
          <Route
            path="/products/:productId"
            element={<ProductDetailPage addToCart={addToCart} />}
          />
          <Route
            path="/login"
            element={
              token ? (
                <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-lg shadow-slate-200/50">
                  <p className="text-lg font-semibold text-slate-900">
                    You are already logged in.
                  </p>
                  <p className="mt-3 text-sm text-slate-600">
                    You can browse the menu and manage your cart.
                  </p>
                </div>
              ) : (
                <AuthPage
                  onLogin={handleLogin}
                  onRegister={handleRegister}
                  loading={loading}
                />
              )
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                cart={token ? cart : guestCart.cart}
                onItemChange={updateCartItem}
                onRemoveItem={removeCartItem}
                onCheckout={checkoutCart}
                isGuest={!token}
              />
            }
          />
          <Route
            path="/orders"
            element={
              token ? (
                <OrdersPage orders={orders} user={user} />
              ) : (
                <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-lg shadow-slate-200/50">
                  <p className="text-lg font-semibold text-slate-900">
                    Please log in to view orders.
                  </p>
                  <p className="mt-3 text-sm text-slate-600">
                    Order history is available after signing in.
                  </p>
                </div>
              )
            }
          />
          <Route
            path="/admin/products"
            element={
              isAdmin ? (
                <AdminProductsPage />
              ) : (
                <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-lg shadow-slate-200/50">
                  <p className="text-lg font-semibold text-slate-900">
                    Admin access required.
                  </p>
                  <p className="mt-3 text-sm text-slate-600">
                    Sign in with an admin account to manage products.
                  </p>
                </div>
              )
            }
          />
        </Routes>
      </main>
      <footer className="border-t border-slate-200 bg-slate-950/90 py-6 text-center text-sm text-slate-200">
        <p>JemzArena • Designed for joyful, responsive ordering.</p>
      </footer>
    </div>
  );
}

export default App;
