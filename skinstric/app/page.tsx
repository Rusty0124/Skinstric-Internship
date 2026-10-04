import Link from 'next/link';
import DiamondArrow from '@/components/DiamondArrow';

// big outline diamond centered on the screen edge, so half hangs off — main's overflow-hidden clips it instead of adding a horizontal scrollbar
// data-diamond hooks it into app/template.tsx's entrance animation
const edgeDiamond = 'absolute top-1/2 -translate-y-1/2 size-[320px] rotate-45 border border-line hidden md:block';

export default function Home() {
  // no top padding for the fixed Header here — content is centered in min-h-screen so it never reaches the top
  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-6">
      <div data-diamond className={`${edgeDiamond} left-0 -translate-x-1/2`} aria-hidden="true" />
      <div data-diamond className={`${edgeDiamond} right-0 translate-x-1/2`} aria-hidden="true" />

      {/* br, not a max-width — the reference breaks here at every screen width, not only when it runs out of room */}
      <h1 className="text-5xl sm:text-6xl md:text-8xl font-light leading-none tracking-tight text-center">
        Sophisticated
        <br />
        skincare
      </h1>

      {/* mobile only — the side diamonds don't fit at phone width, so this is the way into /testing there */}
      <Link href="/testing" className="md:hidden mt-10 border border-fg px-6 py-3 text-sm tracking-widest uppercase">
        Enter Experience
      </Link>

      {/* no destination yet — the reference's Discover A.I. is a button that doesn't navigate either */}
      <button type="button" className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 items-center gap-4 text-sm uppercase">
        <DiamondArrow direction="left" />
        Discover A.I.
      </button>
      <Link href="/testing" className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 items-center gap-4 text-sm uppercase">
        Take Test
        <DiamondArrow direction="right" />
      </Link>

      <p className="absolute bottom-8 left-8 md:left-16 max-w-xs text-sm uppercase leading-relaxed">
        Skinstric developed an A.I. that creates a highly-personalized routine tailored to what your skin needs.
      </p>
    </main>
  );
}
