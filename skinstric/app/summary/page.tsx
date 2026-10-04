"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { rankValues } from "@/lib/rankValues";
import ConfidenceRing from "@/components/ConfidenceRing";
import NavFooter from "@/components/NavFooter";

type Tab = "race" | "age" | "gender";
type Predictions = Record<Tab, Record<string, number>>;

// "gender" is the api key, "sex" is what the reference shows
const TAB_NAMES: Record<Tab, string> = { race: "Race", age: "Age", gender: "Sex" };
const TABS = Object.keys(TAB_NAMES) as Tab[];

// api keys are all lowercase ("latino hispanic") — the reference shows them sentence case
const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
// big label in the center panel — ages read as "50-59 y.o." there
const heading = (tab: Tab, label: string) => (tab === "age" ? `${label} y.o.` : sentence(label));

export default function Summary() {
  // undefined = haven't read localStorage yet, null = read it and there's nothing there
  const [data, setData] = useState<Predictions | null | undefined>(undefined);
  const [tab, setTab] = useState<Tab>("race");
  // user's corrections, keyed by tab — picking a race doesn't touch age or gender
  const [actual, setActual] = useState<Partial<Record<Tab, string>>>({});

  // localStorage only exists in the browser — reading it in an effect keeps the server render from crashing
  useEffect(() => {
    // skinstric_predictions is written by lib/analyzeImage.ts
    const stored = localStorage.getItem("skinstric_predictions");
    setData(stored ? JSON.parse(stored) : null);
  }, []);

  if (data === undefined) return <main className="min-h-screen" />;
  // direct visit or cleared storage — without this it sat on "Loading" forever
  if (data === null)
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-sm uppercase">No analysis yet</p>
        <Link href="/result" className="border border-fg px-6 py-2 text-sm uppercase">Take or upload a photo</Link>
      </main>
    );

  // user's pick if they made one, otherwise the AI's top guess — rankValues sorts descending, so [0] is the top
  const selectedFor = (t: Tab) => actual[t] ?? rankValues(data[t])[0][0];
  const ranked = rankValues(data[tab]);
  const selected = selectedFor(tab);
  // ring + big label follow the selection, not the AI's guess — checked against the reference, clicking a row moves both
  const selectedScore = ranked.find(([label]) => label === selected)?.[1] ?? 0;
  // scores are already rounded to 2 decimals by rankValues (the brief's requirement) — ×100 shows that same value as a percent, nothing is lost
  const pct = (score: number) => Math.round(score * 100);

  return (
    <main className="relative min-h-screen px-4 sm:px-8 pt-24 pb-32 md:pb-36">
      <p className="text-sm font-semibold uppercase">A.I. Analysis</p>
      <h1 className="text-5xl md:text-7xl font-light uppercase leading-none tracking-tight">Demographics</h1>
      <p className="mt-2 text-xs uppercase">Predicted race &amp; age</p>

      {/* phones: tabs in a row, then the panel, then the list. md+: three columns like the reference */}
      {/* proportions measured off the reference at two window sizes — columns scale with width (~10.5% / rest / 22%), panels with height (~57vh) */}
      <div className="mt-10 md:mt-16 grid gap-4 md:grid-cols-[minmax(100px,10.5%)_1fr_minmax(200px,22%)]">
        <div className="grid grid-cols-3 md:grid-cols-1 md:content-start gap-3">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t}
              className={`h-24 md:h-[11vh] md:min-h-24 flex flex-col justify-between border-t border-fg p-3 text-left text-sm md:text-[15px] font-semibold uppercase ${
                tab === t ? "bg-fg text-bg" : "bg-surface hover:bg-surface-strong"
              }`}
            >
              {/* race shows sentence case like the reference, age and sex stay as uppercase */}
              <span className={t === "race" ? "normal-case" : ""}>{t === "race" ? sentence(selectedFor(t)) : selectedFor(t)}</span>
              <span>{TAB_NAMES[t]}</span>
            </button>
          ))}
        </div>

        {/* the list column stretches to this height too — grid rows match their tallest cell */}
        <section className="relative min-h-[340px] md:h-[57vh] md:min-h-[420px] border-t border-fg bg-surface p-5">
          <p className="text-3xl md:text-4xl">{heading(tab, selected)}</p>
          {/* half the panel's width like the reference, but never taller than the space under the label — on short wide windows the max-h wins and ConfidenceRing's xMaxYMax keeps the circle in the corner */}
          {/* key restarts the count-up when the selection changes even if two scores match */}
          <div className="absolute bottom-4 right-4 size-[220px] md:size-auto md:w-1/2 md:aspect-square md:max-h-[calc(100%-96px)]">
            <ConfidenceRing key={`${tab}-${selected}`} percent={pct(selectedScore)} />
          </div>
        </section>

        <section className="border-t border-fg bg-surface">
          <div className="flex justify-between px-4 py-3 text-sm md:text-[15px] uppercase">
            <span>{TAB_NAMES[tab]}</span>
            <span>A.I. Confidence</span>
          </div>
          <ul>
            {ranked.map(([label, score]) => {
              const on = label === selected;
              return (
                <li key={label}>
                  <button
                    aria-pressed={on}
                    onClick={() => setActual((a) => ({ ...a, [tab]: label }))}
                    className={`flex items-center justify-between w-full px-4 py-3 md:py-3.5 text-sm md:text-[15px] ${on ? "bg-fg text-bg" : "hover:bg-surface-strong"}`}
                  >
                    <span className="flex items-center gap-3">
                      {/* outline diamond, with a filled one inside on the selected row */}
                      <span className="relative inline-flex size-2.5 rotate-45 border border-current items-center justify-center" aria-hidden="true">
                        {on && <span className="size-1 bg-current" />}
                      </span>
                      {sentence(label)}
                    </span>
                    <span>{pct(score)}%</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* fixed between Back and Home on desktop. phones have no room between them, so it just follows the list instead */}
      <p className="mt-8 md:mt-0 md:fixed md:inset-x-0 md:bottom-11 md:z-10 text-center text-sm text-muted pointer-events-none">
        If A.I. estimate is wrong, select the correct one.
      </p>
      <NavFooter backHref="/select" nextHref="/" nextLabel="Home" />
    </main>
  );
}
