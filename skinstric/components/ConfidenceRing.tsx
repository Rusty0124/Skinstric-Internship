'use client';
import { useEffect, useState } from 'react';

export default function ConfidenceRing({ percent }: { percent: number }) {
  const [display, setDisplay] = useState(0);
  // 45 is the circle's r below — change one, change all three
  const circumference = 2 * Math.PI * 45;

  // counts up 1% every 15ms instead of jumping — restarts from 0 when percent changes on a tab switch
  useEffect(() => {
    setDisplay(0);
    const id = setInterval(() => {
      setDisplay((d) => (d < percent ? d + 1 : percent));
    }, 15);
    return () => clearInterval(id);
  }, [percent]);

  // no rotate(-90) on the svg — the arc starts at 3 o'clock, not 12
  return (
    <svg width="120" height="120" viewBox="0 0 100 100">
      {/* #333 track isn't a theme token. #fcfcfc below duplicates --color-offwhite */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="4" />
      <circle
        cx="50" cy="50" r="45" fill="none" stroke="#fcfcfc" strokeWidth="4"
        // one dash the length of the whole circle, pushed back by the unfilled part — that's what draws the arc
        strokeDasharray={circumference}
        strokeDashoffset={circumference - (display / 100) * circumference}
        style={{ transition: 'stroke-dashoffset 0.2s' }}
      />
      <text x="50" y="55" textAnchor="middle" fontSize="16" fill="#fcfcfc">{display}%</text>
    </svg>
  );
}