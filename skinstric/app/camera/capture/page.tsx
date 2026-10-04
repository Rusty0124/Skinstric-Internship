'use client';
import { useState } from 'react';
import CameraCapture from '@/components/CameraCapture';
import NavFooter from '@/components/NavFooter';
import LoadingDots from '@/components/LoadingDots';
import { useAnalyze } from '@/lib/useAnalyze';

// same route as the reference — /result's Allow button sends people here
export default function CameraCapturePage() {
  // the still from CameraCapture — while it's set the camera is unmounted, so the camera light is off during review
  const [shot, setShot] = useState<string | null>(null);
  const { analyzing, error, run } = useAnalyze();

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* top-16 leaves the fixed Header on white like the reference. bg-fg shows while the stream is still starting */}
      <div className="absolute inset-x-0 top-16 bottom-0 bg-fg text-bg">
        {shot ? (
          <>
            {/* plain img on purpose — next/image has nothing to optimize on a data url. eslint's no-img-element warning is expected here */}
            <img src={shot} alt="Your photo" className="absolute inset-0 w-full h-full object-cover" />
            <p className="absolute top-10 inset-x-0 text-center text-sm font-semibold uppercase">Great shot!</p>
            {/* overlay on the photo while Phase Two runs — the reference keeps the photo and buttons visible underneath */}
            {analyzing && (
              <div
                role="status"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6 bg-bg/60 backdrop-blur-sm px-6 py-8 text-fg"
              >
                <p className="text-lg uppercase">Analyzing image…</p>
                <LoadingDots />
              </div>
            )}
            <div className="absolute bottom-28 inset-x-0 flex flex-col items-center gap-4">
              <p className="text-lg font-semibold">Preview</p>
              <div className="flex gap-6">
                {/* disabled while analyzing — retaking mid-upload would race the response that's about to push to /select */}
                {/* clearing shot remounts CameraCapture, which asks for a fresh stream */}
                <button onClick={() => setShot(null)} disabled={analyzing} className="bg-bg text-fg px-4 py-2 text-sm disabled:opacity-60">
                  Retake
                </button>
                <button onClick={() => run(shot)} disabled={analyzing} className="bg-fg text-bg px-6 py-2 text-sm">
                  {analyzing ? 'Uploading…' : 'Use This Photo'}
                </button>
              </div>
              <p className="text-sm text-red-300" role="alert">{error}</p>
            </div>
          </>
        ) : (
          <CameraCapture onCapture={setShot} />
        )}
      </div>
      <NavFooter backHref="/result" tone="light" />
    </main>
  );
}
