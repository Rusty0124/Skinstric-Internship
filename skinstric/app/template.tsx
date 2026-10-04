'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

// template, not layout — next remounts this on every navigation, so the timeline replays per page. layout never remounts
export default function Template({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // reduced-motion users get the page with no animation at all
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        // opacity only on the wrapper — any transform here makes it the containing block for NavFooter and the other `fixed` elements, so they'd move with the page
        tl.from(root.current, { opacity: 0, duration: 0.4 });
        // length checks because gsap console.warns "target not found" on an empty match
        const headings = gsap.utils.toArray<HTMLElement>('h1');
        if (headings.length) tl.from(headings, { opacity: 0, y: 24, duration: 0.6 }, '-=0.2');
        // [data-diamond] — home's edge diamonds and DiamondBackground's svgs. skipped on pages with neither
        const diamonds = gsap.utils.toArray<SVGElement>('[data-diamond]');
        if (diamonds.length) tl.from(diamonds, { opacity: 0, scale: 0.85, duration: 0.8, stagger: 0.1 }, '<');
      });
    },
    // scope keeps 'h1' from matching outside this page. summary's h1 only renders after its effect reads localStorage, so it misses this and appears without the slide
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
