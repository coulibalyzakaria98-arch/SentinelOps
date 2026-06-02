export default function Toast({ message, variant = 'accent', className = '' }) {
  const styles = {
    accent: 'bg-accent text-white',
    success: 'bg-success text-slate-900',
    warning: 'bg-warning text-slate-900',
    danger: 'bg-danger text-white',
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl border border-white/10 px-4 py-3 shadow-glow ${styles[variant]} ${className}`}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
