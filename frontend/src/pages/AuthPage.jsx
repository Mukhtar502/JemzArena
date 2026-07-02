import { useMemo, useState } from "react";

export default function AuthPage({ onLogin, onRegister, loading }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const title = useMemo(
    () =>
      mode === "login" ? "Sign in to your account" : "Create your account",
    [mode],
  );
  const description = useMemo(
    () =>
      mode === "login"
        ? "Enter your credentials to continue browsing the menu and placing orders."
        : "Create your account to save your order history and access your cart from any device.",
    [mode],
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (mode === "login") {
      onLogin({ email, password });
    } else {
      onRegister({ email, password, fullName });
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.15)]">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-700">
            Account
          </p>
          <h1 className="text-4xl font-black text-slate-950">{title}</h1>
          <p className="text-sm leading-7 text-slate-600">{description}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              mode === "login"
                ? "bg-slate-950 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              mode === "register"
                ? "bg-slate-950 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "register" ? (
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Full name
              </span>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </label>
          ) : null}

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Email address
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Working..."
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>
      </div>
    </main>
  );
}
