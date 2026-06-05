export default function Toast({ message, type = "success", onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[min(95%,420px)] -translate-x-1/2 rounded-3xl px-5 py-4 shadow-2xl shadow-slate-900/10" role="status">
      <div className={`flex items-start gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-white ${type === "success" ? "bg-emerald-600" : "bg-rose-600"}`}>
        <span className="mt-0.5 text-lg">{type === "success" ? "✓" : "⚠"}</span>
        <div className="flex-1 leading-tight">{message}</div>
        <button type="button" onClick={onClose} className="text-white/80 transition hover:text-white">
          ✕
        </button>
      </div>
    </div>
  );
}
