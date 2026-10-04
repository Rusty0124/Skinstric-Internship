import Link from 'next/link';
import NavFooter from '@/components/NavFooter';

// order is grid order, not screen order — the grid is turned 45° clockwise, so top-left lands on top, top-right on the right, bottom-left on the left, bottom-right on the bottom
// only Demographics has a page so far — the other three are placeholder tiles with no href
const tiles = [
  { label: 'Demographics', href: '/summary' },
  { label: 'Skin Type Details' },
  { label: 'Cosmetic Concerns' },
  { label: 'Weather' },
];

const tileBase = 'flex items-center justify-center size-[110px] sm:size-[150px]';

// no 'use client' — static tiles with plain Links, so this stays a server component
export default function Select() {
  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center px-4">
      {/* top-16 clears the fixed Header */}
      <div className="absolute top-16 left-8 uppercase">
        {/* h1 so app/template.tsx's entrance slide picks it up */}
        <h1 className="mb-1 text-base font-semibold">A.I. Analysis</h1>
        <p className="text-sm leading-relaxed">A.I. has estimated the following.</p>
        <p className="text-sm leading-relaxed">Fix estimated information if needed.</p>
      </div>

      <div className="grid grid-cols-2 gap-1.5 rotate-45">
        {tiles.map((t) =>
          t.href ? (
            <Link key={t.label} href={t.href} className={`${tileBase} bg-surface-strong hover:bg-line transition-colors`}>
              {/* counter-rotated so the text reads level while the tile stays a diamond */}
              <span className="-rotate-45 text-center text-xs sm:text-sm font-semibold uppercase">{t.label}</span>
            </Link>
          ) : (
            // not a link, so it isn't focusable or announced as one — it's a disabled placeholder, not a broken button
            <div key={t.label} className={`${tileBase} bg-surface`}>
              <span className="-rotate-45 text-center text-xs sm:text-sm font-semibold uppercase">{t.label}</span>
            </div>
          ),
        )}
      </div>

      {/* /result is the photo capture page, not a results page — back goes to retake */}
      <NavFooter backHref="/result" nextHref="/summary" nextLabel="Get Summary" />
    </main>
  );
}
