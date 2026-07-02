import { Link, NavLink } from "react-router-dom";

export default function Header({ token, user, onLogout }) {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-slate-900/40 text-slate-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          className="text-xl font-extrabold tracking-[0.2em] text-amber-200"
          to="/"
        >
          JemzArena
        </Link>

        <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-200 sm:gap-5">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `rounded-full px-3 py-2 transition ${
                isActive ? "bg-amber-500 text-slate-950" : "hover:bg-slate-800"
              }`
            }
          >
            Products
          </NavLink>
          <NavLink
            to="/menu"
            className={({ isActive }) =>
              `rounded-full px-3 py-2 transition ${
                isActive ? "bg-amber-500 text-slate-950" : "hover:bg-slate-800"
              }`
            }
          >
            Menu
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `rounded-full px-3 py-2 transition ${
                isActive ? "bg-amber-500 text-slate-950" : "hover:bg-slate-800"
              }`
            }
          >
            Orders
          </NavLink>
          {token && user?.role === "admin" ? (
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `rounded-full px-3 py-2 transition ${
                  isActive
                    ? "bg-amber-500 text-slate-950"
                    : "hover:bg-slate-800"
                }`
              }
            >
              Admin
            </NavLink>
          ) : null}
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `rounded-full px-3 py-2 transition ${
                isActive ? "bg-amber-500 text-slate-950" : "hover:bg-slate-800"
              }`
            }
          >
            Cart
          </NavLink>
          {token ? (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="rounded-full bg-amber-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
            >
              Login
            </NavLink>
          )}
        </nav>
      </div>
      {token && user ? (
        <div className="mx-auto max-w-7xl px-4 pb-4 text-right text-sm text-amber-200 sm:px-6">
          Hi, {user.firstName || user.email || "Customer"}.
        </div>
      ) : null}
    </header>
  );
}
