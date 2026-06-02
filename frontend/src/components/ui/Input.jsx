export default function Input({ label, className = '', ...props }) {
  return (
    <label className="block text-sm text-slate-300">
      {label && <span className="mb-2 block text-slate-300 font-medium">{label}</span>}
      <input
        className={`w-full rounded-2xl border border-white/10 bg-[#0C1A34] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-accent focus:ring-2 focus:ring-accent/20 ${className}`}
        {...props}
      />
    </label>
  );
}
