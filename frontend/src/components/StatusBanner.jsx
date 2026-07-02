export default function StatusBanner({ message }) {
  if (!message) return null;
  return (
    <div className="fixed left-0 right-0 top-24 z-40 mx-auto max-w-7xl px-4 py-3 text-sm font-semibold text-slate-950 sm:px-6">
      <div className="rounded-3xl bg-amber-200/95 px-4 py-3 shadow-lg shadow-slate-900/10 animate-in fade-in duration-300">
        {message}
      </div>
    </div>
  );
}
