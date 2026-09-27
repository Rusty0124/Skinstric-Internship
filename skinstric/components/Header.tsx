import Link from 'next/link';
import BracketLabel from './BracketLabel';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 z-10">
      <Link href="/" className="font-bold tracking-widest">SKINSTRIC</Link>
      {/* not wired up yet — BracketLabel is a span so these don't navigate anywhere */}
      <div className="flex gap-4">
        <BracketLabel>INTRO</BracketLabel>
        <BracketLabel>ENTER CODE</BracketLabel>
      </div>
    </header>
  );
}