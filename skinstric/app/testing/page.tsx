"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import TypewriterField from "@/components/TypewriterField";
import NavFooter from "@/components/NavFooter";

// letters and spaces only — rejects accents and hyphens, so "São Paulo" or "Winston-Salem" can't submit
const isValid = (v: string) => v.trim().length > 0 && /^[A-Za-z\s]+$/.test(v);

export default function Testing() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  // !submitting blocks double clicks from firing a second Phase One POST
  const canSubmit = isValid(name) && isValid(location) && !submitting;

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(
        "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, location }),
        },
      );
      const data = await res.json();
      // their typo, not ours — API returns SUCCUSS, not SUCCESS
      if (!res.ok || !data.SUCCUSS) throw new Error("Phase One request failed");
      // nothing reads skinstric_profile yet — saved for later steps in the flow
      localStorage.setItem(
        "skinstric_profile",
        JSON.stringify({ name, location }),
      );
      router.push("/result");
    } catch {
      // network failure and a falsy SUCCUSS both land here — one message covers both
      setError("Something went wrong — check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center">
      <h1 className="mb-10 text-2xl tracking-widest uppercase">
        To start analysis
      </h1>
      <TypewriterField label="name" value={name} onChange={setName} />
      <TypewriterField
        label="location"
        value={location}
        onChange={setLocation}
      />
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="border px-6 py-2 text-sm uppercase disabled:opacity-30"
      >
        Submit
      </button>
      <NavFooter backHref="/" />
    </main>
  );
}
