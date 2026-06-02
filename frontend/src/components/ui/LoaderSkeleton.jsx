export default function LoaderSkeleton({ className = '' }) {
  return <div className={`h-5 rounded-2xl bg-white/10 animate-pulse ${className}`} />;
}
