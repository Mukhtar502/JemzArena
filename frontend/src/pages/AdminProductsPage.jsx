import { useEffect, useMemo, useState } from "react";
import { requestJson } from "../services/api";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  image: "",
  category: "",
  available: true,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      const response = await requestJson("/api/products?limit=100");
      setProducts(Array.isArray(response?.data) ? response.data : []);
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Unable to load products",
      });
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const isEditing = Boolean(editingId);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setForm((current) => ({
        ...current,
        image: e.target?.result || "",
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setFeedback({ type: "", message: "" });

    try {
      const payload = {
        ...form,
        price: Number(form.price),
      };

      if (editingId) {
        await requestJson(`/api/products/${editingId}`, {
          method: "PUT",
          body: payload,
        });
        setFeedback({
          type: "success",
          message: "Product updated successfully",
        });
      } else {
        await requestJson("/api/products", {
          method: "POST",
          body: payload,
        });
        setFeedback({
          type: "success",
          message: "Product created successfully",
        });
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadProducts();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Unable to save product",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      image: product.image || "",
      category: product.category || "",
      available: Boolean(product.available),
    });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await requestJson(`/api/products/${productId}`, { method: "DELETE" });
      setFeedback({ type: "success", message: "Product deleted successfully" });
      await loadProducts();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "Unable to delete product",
      });
    }
  };

  const stats = useMemo(
    () => ({
      total: products.length,
      available: products.filter((product) => product.available).length,
    }),
    [products],
  );

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
              Admin console
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950">
              Manage products
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Create, edit, and remove products from the customer-facing menu.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <div className="font-semibold text-slate-950">
              {stats.total} products
            </div>
            <div>{stats.available} available</div>
          </div>
        </div>
      </div>

      {feedback.message ? (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            feedback.type === "error"
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50"
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-950">
              {isEditing ? "Edit product" : "Add a new product"}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {isEditing
                ? "Update the selected product details."
                : "Add a menu item for customers to order."}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Name
              </span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
              />
            </label>

            <label className="md:col-span-2">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Description
              </span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                required
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
              />
            </label>

            <label>
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Price
              </span>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
              />
            </label>

            <label>
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Category
              </span>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
              />
            </label>

            <label className="md:col-span-2">
              <span className="mb-1 block text-sm font-medium text-slate-700">
                Product Image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
              />
              {form.image && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <span className="text-xs text-slate-600">Image preview</span>
                </div>
              )}
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:col-span-2">
              <input
                name="available"
                type="checkbox"
                checked={form.available}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm text-slate-700">
                Available for purchase
              </span>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Create product"}
            </button>
            {isEditing ? (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
                className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">
                Current menu
              </h2>
              <p className="text-sm text-slate-600">
                Tap an item to update it.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                No products yet.
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-950">
                        {product.name}
                      </div>
                      <div className="mt-1 text-sm text-slate-600">
                        {product.category}
                      </div>
                      <div className="mt-2 text-sm text-slate-500">
                        ${Number(product.price).toFixed(2)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(product)}
                        className="rounded-full border border-slate-300 px-3 py-1 text-sm font-semibold text-slate-700 transition hover:bg-white"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="rounded-full border border-rose-200 px-3 py-1 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
