import Link from 'next/link';

export default function Home() {
  // no top padding for the fixed Header here — content is centered in min-h-screen so it never reaches the top
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">Sophisticated skincare</h1>
      <p className="max-w-md text-muted mb-10">
        Skinstric developed an A.I. that creates a highly-personalized routine tailored to what your skin needs.
      </p>
      <Link href="/testing" className="border border-offwhite px-6 py-3 text-sm tracking-widest uppercase">
        Enter Experience
      </Link>
      {/* fixed, not absolute — pins to the viewport corner and stays there on scroll */}
      <Link href="/testing" className="fixed bottom-6 right-6 text-sm tracking-widest uppercase">
        Take Test ▶
      </Link>
    </main>
  );
}