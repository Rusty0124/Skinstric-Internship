import Link from 'next/link';
import DiamondArrow from './DiamondArrow';

// next is optional for the last step in a flow. nextLabel has no default — pass it whenever nextHref is set or the link renders empty
// tone light is for dark backgrounds — the camera page's video
type Props = { backHref: string; nextHref?: string; nextLabel?: string; tone?: 'dark' | 'light' };

export default function NavFooter({ backHref, nextHref, nextLabel, tone = 'dark' }: Props) {
  return (
    // bg-bg on the dark tone — fixed over scrolling content (summary on phones) it'd otherwise sit on top of list rows. light tone stays clear so the camera video shows through
    <footer className={`fixed bottom-0 left-0 right-0 flex justify-between items-center px-8 py-8 ${tone === 'light' ? 'text-bg' : 'text-fg bg-bg'}`}>
      <Link href={backHref} className="flex items-center gap-4 text-sm font-semibold uppercase">
        <DiamondArrow direction="left" />
        Back
      </Link>
      {nextHref && (
        <Link href={nextHref} className="flex items-center gap-4 text-sm font-semibold uppercase">
          {nextLabel}
          <DiamondArrow direction="right" />
        </Link>
      )}
    </footer>
  );
}
