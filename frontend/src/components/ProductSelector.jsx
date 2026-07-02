import { useState } from "react";

export default function ProductSelector({ product, onAdd }) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  const handleAdd = () => {
    onAdd(product, quantity, notes);
    setQuantity(1);
    setNotes("");
  };

  return (
    <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-slate-950">{product.name}</h3>
        <p className="mt-1 text-sm text-slate-600">{product.description}</p>
        <p className="mt-2 text-lg font-semibold text-slate-900">
          ${Number(product.price || 0).toFixed(2)}
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Quantity
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-full bg-slate-100 p-2">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="h-8 w-8 rounded-full bg-slate-950 text-sm text-white hover:bg-slate-800"
            >
              −
            </button>
            <span className="flex-1 text-center text-sm font-semibold">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="h-8 w-8 rounded-full bg-slate-950 text-sm text-white hover:bg-slate-800"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="notes"
            className="text-sm font-semibold text-slate-700"
          >
            Special requests (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g., No onions, extra spicy, etc."
            className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm placeholder-slate-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            rows="2"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={product.available === false}
        className="w-full rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {product.available === false ? "Out of stock" : "Add to cart"}
      </button>
    </div>
  );
}
