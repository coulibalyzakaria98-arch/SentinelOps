export default function Badge({ children, variant = 'accent', className = '' }) {
  const styles = {
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    muted: 'bg-white/5 text-slate-300',
  };

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}
