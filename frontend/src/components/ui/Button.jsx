export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const styles = {
    primary: 'bg-accent text-white hover:bg-blue-500',
    secondary: 'bg-white/5 text-slate-100 hover:bg-white/10',
    success: 'bg-success text-slate-900 hover:bg-emerald-500',
    warning: 'bg-warning text-slate-900 hover:bg-orange-400',
    danger: 'bg-danger text-white hover:bg-red-500',
    ghost: 'bg-transparent text-slate-200 hover:bg-white/10',
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
