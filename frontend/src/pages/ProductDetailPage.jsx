import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProductById } from "../services/api";
import ProductSelector from "../components/ProductSelector";

export default function ProductDetailPage({ addToCart }) {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchProductById(productId);
        if (isActive) setProduct(data);
      } catch (err) {
        if (isActive) {
          setError(err.message || "Unable to load product details.");
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    void loadProduct();

    return () => {
      isActive = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <main className="px-4 py-10 sm:px-6">
        <Link
          to="/products"
          className="inline-flex items-center text-sm font-semibold text-amber-700 hover:text-amber-900"
        >
          ← Back to catalog
        </Link>
        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-600 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.2)]">
          Loading product details...
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="px-4 py-10 sm:px-6">
        <Link
          to="/products"
          className="inline-flex items-center text-sm font-semibold text-amber-700 hover:text-amber-900"
        >
          ← Back to catalog
        </Link>
        <div className="mt-8 rounded-[2rem] border border-amber-200 bg-amber-50 p-10 text-center text-sm font-semibold text-amber-800 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.2)]">
          {error || "The requested product could not be found."}
        </div>
      </main>
    );
  }

  return (
    <main className="px-4 py-10 sm:px-6">
      <Link
        to="/products"
        className="inline-flex items-center text-sm font-semibold text-amber-700 hover:text-amber-900"
      >
        ← Back to catalog
      </Link>

      <div className="mt-8 grid gap-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.2)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
          <div className="grid h-full place-items-center rounded-[1.2rem] bg-gradient-to-br from-amber-100 to-slate-100 p-8 text-center text-lg font-semibold text-slate-700">
            {product.name}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-700">
              {product.category || "Featured"}
            </p>
            <h1 className="text-4xl font-black tracking-tight text-slate-950">
              {product.name}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600">
              {product.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              Availability: {product.available ? "In stock" : "Unavailable"}
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              Price: ${Number(product.price || 0).toFixed(2)}
            </div>
          </div>

          <ProductSelector product={product} onAdd={addToCart} />
        </div>
      </div>
    </main>
  );
}
