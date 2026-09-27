// display only — plain span, not clickable. wrap it in a Link/button where it needs to act as nav
export default function BracketLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs tracking-widest uppercase text-muted">
      {/* brackets dimmed separately so the label text stays full contrast */}
      <span className="opacity-60">[</span>{children}<span className="opacity-60">]</span>
    </span>
  );
}