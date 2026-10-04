'use client';
import { useEffect, useState } from 'react';

// fills its parent — the parent sets the size
export default function ConfidenceRing({ percent }: { percent: number }) {
  const [display, setDisplay] = useState(0);
  // 48 is the circle's r below — change one, change all three
  const circumference = 2 * Math.PI * 48;

  // counts up 1% every 15ms instead of jumping — restarts from 0 when percent changes on a tab switch or a correction click
  useEffect(() => {
    setDisplay(0);
    const id = setInterval(() => {
      setDisplay((d) => (d < percent ? d + 1 : percent));
    }, 15);
    return () => clearInterval(id);
  }, [percent]);

  return (
    // xMaxYMax — if the parent box isn't square, the circle hugs its bottom-right instead of floating in the middle
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMaxYMax meet" className="w-full h-full" role="img" aria-label={`${percent}% A.I. confidence`}>
      {/* colors via stroke-/fill- classes, not the stroke attribute — svg attributes can't read css vars, so the theme tokens wouldn't reach them */}
      <circle cx="50" cy="50" r="48" fill="none" className="stroke-line" strokeWidth="1.2" />
      <circle
        cx="50" cy="50" r="48" fill="none" className="stroke-fg" strokeWidth="1.2"
        // svg arcs start at 3 o'clock — rotate -90 around the center so it starts at 12 like the reference
        transform="rotate(-90 50 50)"
        // one dash the length of the whole circle, pushed back by the unfilled part — that's what draws the arc
        strokeDasharray={circumference}
        strokeDashoffset={circumference - (display / 100) * circumference}
        style={{ transition: 'stroke-dashoffset 0.2s' }}
      />
      <text x="50" y="54" textAnchor="middle" fontSize="12" className="fill-fg">
        {display}
        {/* small raised % — dy moves it up relative to the number's baseline */}
        <tspan fontSize="6" dy="-5">%</tspan>
      </text>
    </svg>
  );
}
