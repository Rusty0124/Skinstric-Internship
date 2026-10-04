// hand-drawn stand-ins for the reference's icons — swap for the figma exports once we have the file
// all draw in a 0–100 box and scale to whatever size the parent gives them

// aperture: each blade is one hexagon edge extended out to the lens ring
const HEX_R = 11;
const LENS_R = 38;
const hex = Array.from({ length: 6 }, (_, i) => {
  const a = (Math.PI / 3) * i;
  return [50 + HEX_R * Math.cos(a), 50 + HEX_R * Math.sin(a)];
});
const blades = hex.map(([x, y], i) => {
  const [nx, ny] = hex[(i + 1) % 6];
  // walk backwards along the edge (away from the next vertex) until we hit the lens circle
  const dx = x - nx, dy = y - ny;
  const len = Math.hypot(dx, dy);
  const ux = dx / len, uy = dy / len;
  // solve |(x,y) - (50,50) + t·u| = LENS_R for the positive t
  const px = x - 50, py = y - 50;
  const b = px * ux + py * uy;
  const t = -b + Math.sqrt(b * b - (px * px + py * py - LENS_R * LENS_R));
  return [x, y, x + ux * t, y + uy * t];
});

export function ShutterIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      <circle cx="50" cy="50" r="49" fill="none" className="stroke-fg" strokeWidth="0.75" />
      <circle cx="50" cy="50" r="41" className="fill-bg stroke-fg" strokeWidth="5" />
      <polygon points={hex.map((p) => p.join(',')).join(' ')} className="fill-fg" />
      {blades.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-fg" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

export function GalleryIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      {/* static id — only one GalleryIcon per page. a second copy would point at the first one's clip */}
      <defs>
        <clipPath id="gallery-icon-clip">
          <circle cx="50" cy="50" r="41" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="49" fill="none" className="stroke-fg" strokeWidth="0.75" />
      <circle cx="50" cy="50" r="41" className="fill-bg" />
      <g clipPath="url(#gallery-icon-clip)">
        <path d="M5 70 Q 25 54 45 68 T 95 60 L 95 95 L 5 95 Z" className="fill-fg" />
        <circle cx="62" cy="38" r="8" className="fill-fg" />
      </g>
      <circle cx="50" cy="50" r="41" fill="none" className="stroke-fg" strokeWidth="5" />
    </svg>
  );
}

// white ring with a grey camera glyph — sits on the live video, so it's drawn light
export function CaptureButtonIcon() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" aria-hidden="true">
      <circle cx="50" cy="50" r="48" fill="none" className="stroke-bg" strokeWidth="3" />
      <circle cx="50" cy="50" r="42" className="fill-bg" />
      <path d="M32 40 h8 l4 -6 h12 l4 6 h8 v24 h-36 Z" fill="none" className="stroke-muted" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="50" cy="52" r="7" fill="none" className="stroke-muted" strokeWidth="2.5" />
    </svg>
  );
}
