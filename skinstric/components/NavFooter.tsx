import Link from 'next/link';

// next is optional for the last step in a flow. nextLabel has no default — pass it whenever nextHref is set or the link renders empty
type Props = { backHref: string; nextHref?: string; nextLabel?: string };

export default function NavFooter({ backHref, nextHref, nextLabel }: Props) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 flex justify-between items-center px-6 py-4">
      <Link href={backHref} className="text-sm tracking-widest uppercase">BACK</Link>
      {nextHref && <Link href={nextHref} className="text-sm tracking-widest uppercase">{nextLabel}</Link>}
    </footer>
  );
}