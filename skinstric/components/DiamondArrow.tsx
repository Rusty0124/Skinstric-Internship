// svg triangle, not the ▶ character — windows renders ▶ as a blue emoji box
// decorative only — always sits next to a text label, so the label is what screen readers get
// border-current/fill-current — takes the parent's text color, so it works dark on the page and white over the camera video
export default function DiamondArrow({ direction }: { direction: 'left' | 'right' }) {
  return (
    <span className="relative inline-flex w-11 h-11 items-center justify-center" aria-hidden="true">
      {/* rotated border square is the diamond — the arrow sits outside it so it doesn't rotate too */}
      <span className="absolute inset-[6px] rotate-45 border border-current" />
      <svg width="10" height="10" viewBox="0 0 10 10" className={`fill-current ${direction === 'left' ? 'rotate-180' : ''}`}>
        <polygon points="1,0 10,5 1,10" />
      </svg>
    </span>
  );
}
