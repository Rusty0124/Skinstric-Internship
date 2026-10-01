export function rankValues(obj: Record<string, number>) {
  return Object.entries(obj)
    // sort on raw scores before rounding — near-ties keep their real order
    .sort((a, b) => b[1] - a[1])
    // as const keeps each entry a [string, number] tuple — without it TS widens to (string | number)[] and score.toFixed in summary/page breaks
    .map(([label, score]) => [label, Math.round(score * 100) / 100] as const);
}