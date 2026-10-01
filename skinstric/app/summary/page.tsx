"use client";
import { useEffect, useState } from "react";
import { rankValues } from "@/lib/rankValues";
import ConfidenceRing from "@/components/ConfidenceRing";

export default function Summary() {
  const [data, setData] = useState<Record<
    string,
    Record<string, number>
  > | null>(null);
  const [tab, setTab] = useState<"race" | "age" | "gender">("race");
  // user's corrections, keyed by tab — picking a race doesn't touch age or gender
  const [actual, setActual] = useState<Record<string, string>>({});

  // localStorage only exists in the browser — reading it in an effect keeps the server render from crashing
  useEffect(() => {
    // skinstric_predictions is written by lib/analyzeImage.ts on Proceed
    const stored = localStorage.getItem("skinstric_predictions");
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data)
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading analysis data...
      </main>
    );

  const ranked = rankValues(data[tab]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-xl uppercase mb-6">Demographics — Predicted {tab}</h1>
      <div className="flex gap-4 mb-6">
        {(["race", "age", "gender"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="uppercase text-sm"
          >
            {t}
          </button>
        ))}
      </div>
      {/* rankValues sorts descending, so ranked[0] is the AI's top guess */}
      <ConfidenceRing percent={Math.round(ranked[0][1] * 100)} />
      <ul className="mt-6 w-64">
        {ranked.map(([label, score]) => (
          <li key={label}>
            <button
              aria-pressed={actual[tab] === label}
              onClick={() => setActual((a) => ({ ...a, [tab]: label }))}
              className="flex justify-between w-full py-2 uppercase text-sm"
            >
              <span>{label}</span>
              <span>{score.toFixed(2)}</span>
            </button>
          </li>
        ))}
      </ul>
      {/* user's pick if they made one, otherwise the AI's top guess — updates on click, no refetch */}
      <p className="mt-6 text-sm text-muted">
        Sidebar: {actual[tab] ?? ranked[0][0]}
      </p>
    </main>
  );
}
