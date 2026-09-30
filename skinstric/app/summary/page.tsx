'use client';
import { useEffect, useState } from 'react';

export default function Summary() {
  const [data, setData] = useState<Record<string, Record<string, number>> | null>(null);
  const [tab, setTab] = useState<'race' | 'age' | 'gender'>('race');

  useEffect(() => {
    const stored = localStorage.getItem('skinstric_predictions');
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data) return <main className="min-h-screen flex items-center justify-center">Loading analysis data...</main>;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-xl uppercase mb-6">Demographics — Predicted {tab}</h1>
      <div className="flex gap-4 mb-6">
        {(['race', 'age', 'gender'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className="uppercase text-sm">{t}</button>
        ))}
      </div>
      {/* ConfidenceRing + ranked list added Day 6 */}
    </main>
  );
}