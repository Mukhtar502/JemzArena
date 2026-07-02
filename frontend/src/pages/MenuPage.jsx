import ProductCard from "../components/ProductCard";

export default function MenuPage({ products, addToCart }) {
  return (
    <main className="space-y-8 px-4 py-10 sm:px-6">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-700">
          Our menu
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          A menu designed for everyday comfort.
        </h1>
        <p className="max-w-2xl text-base leading-7 text-slate-600">
          Choose from chef-inspired plates, vibrant bowls, and easy add-ons. The
          shop is built to stay responsive no matter which device you use.
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onAdd={addToCart} />
        ))}
      </div>
    </main>
  );
}
