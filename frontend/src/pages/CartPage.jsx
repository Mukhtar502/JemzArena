import { useState } from "react";

export default function CartPage({
  cart,
  onItemChange,
  onRemoveItem,
  onCheckout,
  isGuest,
}) {
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const handleCheckout = (event) => {
    event.preventDefault();
    onCheckout({
      deliveryAddress,
      specialInstructions,
      guestName,
      guestEmail,
      guestPhone,
    });
  };

  const parsePrice = (item) => {
    if (typeof item?.price === "string" && item.price.trim()) {
      return Number(item.price.replace(/[^0-9.-]+/g, "")) || 0;
    }
    if (typeof item?.product?.price === "string") {
      return Number(item.product.price.replace(/[^0-9.-]+/g, "")) || 0;
    }
    return Number(item?.product?.price || item?.price || 0);
  };

  const total = cart.reduce(
    (sum, item) => sum + parsePrice(item) * item.quantity,
    0,
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-700">
          Your cart
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950">
          Review your order.
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          Adjust quantities, remove items, and place your order with one click.
          The total updates automatically.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="mt-12 rounded-[2rem] border border-slate-200 bg-slate-50 p-10 text-center text-slate-600 shadow-inner shadow-slate-100">
          <p className="text-lg font-semibold text-slate-900">
            Your cart is empty.
          </p>
          <p className="mt-3 text-sm leading-7">
            Add something delicious from the menu to begin.
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.2)]">
            {cart.map((item) => (
              <div
                key={item.id}
                className="grid gap-4 rounded-3xl bg-slate-50 p-4 sm:grid-cols-[1.5fr_0.75fr_0.4fr] sm:items-center"
              >
                <div>
                  <p className="text-lg font-semibold text-slate-950">
                    {item.product?.name || item.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {item.product?.description || item.description}
                  </p>
                  {item.notes ? (
                    <p className="mt-3 rounded-3xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      <span className="font-semibold">Item note:</span>{" "}
                      {item.notes}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200">
                    <button
                      type="button"
                      onClick={() =>
                        onItemChange(
                          item.id,
                          Math.max(1, item.quantity - 1),
                          item.notes,
                        )
                      }
                      className="h-8 w-8 rounded-full bg-slate-950 text-white transition hover:bg-slate-800"
                    >
                      –
                    </button>
                    <span className="min-w-[2rem] text-center text-base font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onItemChange(item.id, item.quantity + 1, item.notes)
                      }
                      className="h-8 w-8 rounded-full bg-slate-950 text-white transition hover:bg-slate-800"
                    >
                      +
                    </button>
                  </div>
                  <label className="block text-sm text-slate-700">
                    Special requests
                    <textarea
                      value={item.notes || ""}
                      onChange={(event) =>
                        onItemChange(item.id, item.quantity, event.target.value)
                      }
                      placeholder="Add a note for this item"
                      className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                      rows="2"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-sm font-semibold text-amber-700 transition hover:text-amber-900"
                  >
                    Remove
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-slate-950">
                    ${(parsePrice(item) * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-500">
                    ${parsePrice(item).toFixed(2)} each
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form
            className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.15)]"
            onSubmit={handleCheckout}
          >
            <div className="space-y-4">
              {isGuest ? (
                <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Full name
                    </span>
                    <input
                      value={guestName}
                      onChange={(event) => setGuestName(event.target.value)}
                      placeholder="Guest name"
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                      required
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Email
                    </span>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(event) => setGuestEmail(event.target.value)}
                      placeholder="guest@example.com"
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    />
                  </label>
                </div>
              ) : null}

              {isGuest ? (
                <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Phone number
                    </span>
                    <input
                      value={guestPhone}
                      onChange={(event) => setGuestPhone(event.target.value)}
                      placeholder="Phone number"
                      className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    />
                  </label>
                </div>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Delivery address
                  </span>
                  <input
                    value={deliveryAddress}
                    onChange={(event) => setDeliveryAddress(event.target.value)}
                    placeholder="Street, city, state"
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Special instructions
                  </span>
                  <textarea
                    rows="2"
                    value={specialInstructions}
                    onChange={(event) =>
                      setSpecialInstructions(event.target.value)
                    }
                    placeholder="Leave at gate, no onions, etc."
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                  />
                </label>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-4 rounded-[2rem] bg-slate-950 p-6 text-slate-50 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-amber-300">
                  Order total
                </p>
                <p className="text-3xl font-black">${total.toFixed(2)}</p>
              </div>
              <button
                type="submit"
                className="rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
              >
                Place order
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
