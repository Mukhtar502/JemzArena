import { useEffect, useState } from "react";
import { requestJson } from "../services/api";

export default function OrdersPage({ orders, user }) {
  const [displayOrders, setDisplayOrders] = useState(orders);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    console.log("OrdersPage - User:", user);
    console.log("OrdersPage - isAdmin:", isAdmin);

    if (isAdmin) {
      setLoading(true);
      setError("");
      console.log("Fetching admin orders from /api/orders/admin/all");
      requestJson("/api/orders/admin/all")
        .then((data) => {
          console.log("Admin orders response:", data);
          setDisplayOrders(Array.isArray(data) ? data : data.items || []);
        })
        .catch((error) => {
          console.error("Failed to load admin orders:", error);
          setError(error.message || "Failed to load orders");
          setDisplayOrders([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log("Not admin, using local orders");
      setDisplayOrders(orders);
      setError("");
    }
  }, [isAdmin, orders]);

  const pageTitle = isAdmin ? "All Orders" : "Your recent orders";
  const pageDescription = isAdmin
    ? "View and manage all customer orders in the system."
    : "Review order status, item details, and total spending from your account.";

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-700">
          Orders
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950">
          {pageTitle}.
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          {pageDescription}
        </p>
      </div>

      {loading ? (
        <div className="mt-12 text-center text-slate-600">
          <p className="text-lg font-semibold text-slate-900">Loading...</p>
        </div>
      ) : error ? (
        <div className="mt-12 rounded-[2rem] border border-rose-200 bg-rose-50 p-10 text-center shadow-inner shadow-rose-100">
          <p className="text-lg font-semibold text-rose-900">
            Error loading orders
          </p>
          <p className="mt-3 text-sm leading-7 text-rose-700">{error}</p>
        </div>
      ) : displayOrders.length === 0 ? (
        <div className="mt-12 rounded-[2rem] border border-slate-200 bg-slate-50 p-10 text-center text-slate-600 shadow-inner shadow-slate-100">
          <p className="text-lg font-semibold text-slate-900">
            {isAdmin ? "No orders yet." : "No orders yet."}
          </p>
          <p className="mt-3 text-sm leading-7">
            {isAdmin
              ? "Customer orders will appear here once they place their first order."
              : "Place an order to see it appear here."}
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {displayOrders.map((order) => (
            <article
              key={order.id}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.15)]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-amber-700">
                    Order #{order.id}
                  </p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  {isAdmin && order.user && (
                    <p className="mt-1 text-sm text-slate-600">
                      {order.user.firstName} {order.user.lastName} (
                      {order.user.email})
                    </p>
                  )}
                </div>
                <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                  {order.status || "Confirmed"}
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-3 rounded-3xl bg-slate-50 p-4 sm:grid-cols-[1.4fr_0.9fr_0.6fr] sm:items-center"
                  >
                    <div>
                      <p className="font-semibold text-slate-950">
                        {item.name}
                      </p>
                      <p className="text-sm text-slate-600">
                        {item.description}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                      x{item.quantity}
                    </p>
                    <p className="text-right text-sm text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">
                  Total items:{" "}
                  {order.items?.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
                <p className="text-xl font-black text-slate-950">
                  ${order.total.toFixed(2)}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
