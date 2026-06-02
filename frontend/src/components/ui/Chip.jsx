export default function Chip({ children, active = false, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold transition ${active ? 'bg-accent text-white shadow-soft' : 'bg-white/5 text-slate-300 hover:bg-white/10'} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
