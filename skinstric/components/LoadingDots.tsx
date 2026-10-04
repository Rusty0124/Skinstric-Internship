// staggered pulse — reads as "working" without a spinner. square, not round — globals.css forces border-radius 0 on everything
export default function LoadingDots() {
  return (
    <div className="flex gap-3" aria-hidden="true">
      {[0, 150, 300].map((d) => (
        <span key={d} className="size-2 bg-muted animate-pulse" style={{ animationDelay: `${d}ms` }} />
      ))}
    </div>
  );
}
