import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function HomePage({ products, addToCart }) {
  return (
    <div className="space-y-16 px-4 py-10 sm:px-6">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="max-w-2xl space-y-6">
          <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">
            Warm flavors · Crafted for daily cravings
          </span>
          <div className="space-y-4">
            <h1 className="max-w-xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Comfort food designed for a modern table.
            </h1>
            <p className="max-w-lg text-base leading-8 text-slate-600 sm:text-lg">
              Discover a beautifully styled menu, fast checkout, and a
              responsive ordering flow built around your favorite meals.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-950/20 transition hover:bg-slate-800"
              to="/menu"
            >
              Explore menu
            </Link>
            <Link
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
              to="/login"
            >
              Create account
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <span className="rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
              Freshly prepared favorites
            </span>
            <span className="rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
              Fast checkout experience
            </span>
            <span className="rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
              Responsive across every device
            </span>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.7)] sm:p-8">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-amber-700">
              Tonight’s spotlight
            </p>
            <h2 className="text-3xl font-black text-slate-950">
              Spiced beef suya bowl
            </h2>
            <div className="rounded-3xl bg-amber-50 p-5 shadow-inner shadow-amber-100/70">
              <div className="flex items-center justify-between gap-4">
                <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                  Chef pick
                </span>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-700">
                    Smoky spice
                  </p>
                  <p className="text-sm text-slate-500">
                    Rice, greens, and house sauce
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-700">
              Featured picks
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">
              Built for cravings and easy browsing.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600">
            Browse curated dishes and add your favorites to the cart. The menu
            falls back to the highlighted local collection if the backend is
            unavailable.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} onAdd={addToCart} />
          ))}
        </div>
      </section>
    </div>
  );
}
