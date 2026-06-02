export default function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-[20px] border border-white/10 bg-panel/95 shadow-soft backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="rounded-xl bg-white/5 px-3 py-2 text-slate-200 hover:bg-white/10">Close</button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="border-t border-white/10 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
