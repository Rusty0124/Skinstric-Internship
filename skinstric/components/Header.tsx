import Link from 'next/link';
import BracketLabel from './BracketLabel';

export default function Header() {
  return (
    // bg-bg — fixed over pages that scroll on phones (summary), without it page content shows through behind the logo
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-8 py-4 z-10 bg-bg">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-xs font-semibold tracking-tight">SKINSTRIC</Link>
        {/* not wired up yet — BracketLabel is a span so this doesn't navigate anywhere */}
        <BracketLabel>INTRO</BracketLabel>
      </div>
      {/* no onClick — the reference's Enter Code button doesn't do anything either. wire it up once the brief says what it opens */}
      <button type="button" className="bg-fg text-bg text-[10px] font-semibold px-4 py-2 uppercase">
        Enter Code
      </button>
    </header>
  );
}
