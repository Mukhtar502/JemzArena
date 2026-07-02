import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import {
  fetchFeaturedProducts,
  fetchProductCategories,
  fetchProducts,
} from "../services/api";

export default function ProductsPage({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadPageData = async () => {
      setLoading(true);
      setError("");

      try {
        const [productResponse, categoryResponse, featuredResponse] =
          await Promise.all([
            fetchProducts({ limit: 12 }),
            fetchProductCategories(),
            fetchFeaturedProducts(),
          ]);

        if (!isActive) return;

        const allProducts = Array.isArray(productResponse?.data)
          ? productResponse.data
          : Array.isArray(productResponse)
            ? productResponse
            : [];

        setProducts(allProducts);
        setCategories(Array.isArray(categoryResponse) ? categoryResponse : []);
        setFeatured(Array.isArray(featuredResponse) ? featuredResponse : []);
      } catch (err) {
        if (isActive) {
          setError(err.message || "Unable to load products right now.");
        }
      } finally {
        if (isActive) setLoading(false);
      }
    };

    void loadPageData();

    return () => {
      isActive = false;
    };
  }, []);

  const featuredProducts = useMemo(() => featured.slice(0, 4), [featured]);

  return (
    <main className="space-y-10 px-4 py-10 sm:px-6">
      <section className="space-y-5 rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.2)]">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-700">
            Products API
          </p>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            Browse the live products catalog from the backend.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-slate-600">
            This screen connects to the products, categories, and
            featured-product endpoints so the storefront stays synced with the
            API.
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                {category}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      {error ? (
        <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 text-sm font-semibold text-amber-800">
          {error}
        </div>
      ) : null}

      {!loading && featuredProducts.length > 0 ? (
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-700">
                Featured
              </p>
              <h2 className="text-3xl font-black text-slate-950">
                Popular picks right now
              </h2>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <article
                key={product.id}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                  {product.category}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-slate-950">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {product.description}
                </p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="text-lg font-semibold text-slate-950">
                    ${Number(product.price || 0).toFixed(2)}
                  </span>
                  <Link
                    to={`/products/${product.id}`}
                    className="text-sm font-semibold text-amber-700 hover:text-amber-900"
                  >
                    View details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-700">
              Catalog
            </p>
            <h2 className="text-3xl font-black text-slate-950">
              All products from the backend
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-10 text-center text-sm font-semibold text-slate-600">
            Loading the product catalog...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-10 text-center text-sm font-semibold text-slate-600">
            No products are available from the backend yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products
              .filter((p) => p.available !== false)
              .map((product) => (
                <div key={product.id} className="space-y-3">
                  <ProductCard product={product} onAdd={addToCart} />
                  <Link
                    to={`/products/${product.id}`}
                    className="inline-flex text-sm font-semibold text-amber-700 hover:text-amber-900"
                  >
                    View full details →
                  </Link>
                </div>
              ))}
          </div>
        )}
      </section>
    </main>
  );
}
