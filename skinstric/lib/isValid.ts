// lives here, not in testing/page.tsx — next build rejects non-standard named exports from a page file, and the tests need to import it
// letters and spaces only — rejects accents and hyphens, so "São Paulo" or "Winston-Salem" can't submit
export const isValid = (v: string) => v.trim().length > 0 && /^[A-Za-z\s]+$/.test(v);
