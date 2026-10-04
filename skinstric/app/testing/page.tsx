"use client";
import { useState } from "react";
import TypewriterField from "@/components/TypewriterField";
import NavFooter from "@/components/NavFooter";
import RotatingSquares from "@/components/RotatingSquares";
import LoadingDots from "@/components/LoadingDots";
import { isValid } from "@/lib/isValid";

// one question on screen at a time, like the reference — Enter advances, there's no submit button
type Step = "name" | "location" | "submitting" | "done";

export default function Testing() {
  const [step, setStep] = useState<Step>("name");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  async function submit() {
    // the "submitting" step unmounts the input, so a second Enter can't fire a second Phase One POST
    setStep("submitting");
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
      // brief's sample output says SUCCUSS — the live API actually returns success
      if (!res.ok || !data.success) throw new Error("Phase One request failed");
      // nothing reads skinstric_profile yet — saved for later steps in the flow
      localStorage.setItem(
        "skinstric_profile",
        JSON.stringify({ name, location }),
      );
      setStep("done");
    } catch {
      // network failure and a falsy success both land here — back to the city field so Enter retries with what's typed
      setError("Something went wrong — check your connection and try again.");
      setStep("location");
    }
  }

  function handleEnter() {
    const value = step === "name" ? name : location;
    // brief: can't proceed without a valid value — stay on this step and say why
    if (!isValid(value)) {
      setError("Letters and spaces only, please.");
      return;
    }
    setError("");
    if (step === "name") setStep("location");
    else submit();
  }

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-6">
      {/* top-16 clears the fixed Header */}
      <p className="absolute top-16 left-8 text-xs font-semibold uppercase">To start analysis</p>
      <RotatingSquares />

      {/* relative so it stacks above the absolute squares */}
      <div className="relative flex flex-col items-center w-full">
        {(step === "name" || step === "location") && (
          <TypewriterField
            // key per step remounts the input — fresh autoFocus and no carried-over caret position
            key={step}
            id={step}
            // placeholders copied from the reference
            placeholder={step === "name" ? "Introduce Yourself" : "your city name"}
            value={step === "name" ? name : location}
            onChange={step === "name" ? setName : setLocation}
            onEnter={handleEnter}
          />
        )}
        {step === "submitting" && (
          <div className="flex flex-col items-center gap-6" role="status">
            <p className="text-lg text-muted">Processing submission</p>
            <LoadingDots />
          </div>
        )}
        {step === "done" && (
          <div className="flex flex-col items-center gap-2 text-center" role="status">
            <p className="text-2xl">Thank you!</p>
            <p className="text-lg text-muted">Proceed for the next step</p>
          </div>
        )}
        {/* fixed height so the error appearing doesn't shove the field up */}
        <p className="mt-4 h-5 text-sm text-red-600" role="alert">{error}</p>
      </div>

      {/* proceed only exists once Phase One has succeeded — before that the only way forward is Enter */}
      {step === "done" ? (
        <NavFooter backHref="/" nextHref="/result" nextLabel="Proceed" />
      ) : (
        <NavFooter backHref="/" />
      )}
    </main>
  );
}
