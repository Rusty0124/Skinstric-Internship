import Link from 'next/link';
import NavFooter from '@/components/NavFooter';

// only Demographics has a page so far — the other three are greyed-out placeholders with no href
const categories = [
  { label: 'Demographics', href: '/summary', enabled: true },
  { label: 'Cosmetic Concerns', enabled: false },
  { label: 'Skin Type Details', enabled: false },
  { label: 'Weather', enabled: false },
];

// no 'use client' — static list with plain Links, so this stays a server component
export default function Select() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center">
      <h1 className="mb-10 text-2xl uppercase">A.I. Analysis</h1>
      {categories.map((c) =>
        c.enabled ? (
          // href! is safe only because every enabled entry has an href — enabling one without it breaks at runtime
          <Link key={c.label} href={c.href!} className="mb-4 text-lg uppercase">{c.label}</Link>
        ) : (
          <span key={c.label} className="mb-4 text-lg uppercase text-muted pointer-events-none">{c.label}</span>
        )
      )}
      {/* /result is the photo capture page, not a results page — back goes to retake */}
      <NavFooter backHref="/result" nextHref="/summary" nextLabel="Sum" />
    </main>
  );
}