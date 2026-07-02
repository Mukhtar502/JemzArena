export default function ProductCard({ product, onAdd }) {
  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-slate-200/70 bg-white/90 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.75)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-40px_rgba(15,23,42,0.75)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-center text-slate-500">
            {product.name}
          </div>
        )}
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-amber-700">
            {product.tag}
          </span>
          <span className="text-lg font-semibold text-slate-900">
            {product.price}
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-950">
            {product.name}
          </h3>
          <p className="text-sm leading-6 text-slate-600">
            {product.description}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onAdd(product)}
          className="w-full rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Add to cart
        </button>
      </div>
    </article>
  );
}
