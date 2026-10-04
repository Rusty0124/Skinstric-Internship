// three dotted squares slowly turning behind the content — css animation, not gsap, so it never fights template.tsx's entrance tween
// negative delays start each square partway through its turn, so they're already at different angles on first paint
const squares = [
  { size: 'size-[300px] sm:size-[360px]', dur: '60s', delay: '-5s', reverse: false, tone: 'border-line' },
  { size: 'size-[320px] sm:size-[400px]', dur: '80s', delay: '-20s', reverse: true, tone: 'border-line opacity-60' },
  { size: 'size-[340px] sm:size-[430px]', dur: '100s', delay: '-40s', reverse: false, tone: 'border-line opacity-40' },
];

// absolute — parent needs `relative` and should be overflow-hidden, the corners swing past 430px wide while turning
export default function RotatingSquares() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
      {squares.map((s, i) => (
        <div
          key={i}
          className={`absolute border-2 border-dotted ${s.size} ${s.tone} animate-[square-spin_linear_infinite] motion-reduce:animate-none`}
          style={{ animationDuration: s.dur, animationDelay: s.delay, animationDirection: s.reverse ? 'reverse' : 'normal' }}
        />
      ))}
    </div>
  );
}
