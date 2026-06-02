export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-surface/95 border border-white/10 shadow-soft rounded-2xl backdrop-blur-md ${className}`}>
      {children}
    </div>
  );
}
