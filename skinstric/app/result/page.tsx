'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GalleryUpload from '@/components/GalleryUpload';
import NavFooter from '@/components/NavFooter';
import RotatingSquares from '@/components/RotatingSquares';
import LoadingDots from '@/components/LoadingDots';
import { ShutterIcon, GalleryIcon } from '@/components/CaptureIcons';
import { useAnalyze } from '@/lib/useAnalyze';

export default function Result() {
  const router = useRouter();
  // gallery pick only — the camera path lives on /camera/capture. state only, gone on refresh
  const [preview, setPreview] = useState<string | null>(null);
  // our own allow/deny step before the browser's permission prompt, like the reference
  const [asking, setAsking] = useState(false);
  const { analyzing, error, run } = useAnalyze();

  // no confirm step for gallery picks — the reference goes straight to analysis, the preview box is the confirmation
  function handleSelect(dataUrl: string) {
    setPreview(dataUrl);
    run(dataUrl);
  }

  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center px-4">
      {/* top-16 clears the fixed Header */}
      <p className="absolute top-16 left-8 text-xs font-semibold uppercase">To start analysis</p>
      <div className="absolute top-16 right-8">
        <p className="mb-1 text-sm">Preview</p>
        <div className="size-20 md:size-32 border border-line">
          {/* plain img on purpose — next/image has nothing to optimize on a data url. eslint's no-img-element warning is expected here */}
          {preview && <img src={preview} alt="Selected photo" className="w-full h-full object-cover" />}
        </div>
      </div>

      {analyzing ? (
        <div className="relative flex flex-col items-center gap-6" role="status">
          <RotatingSquares />
          <p className="relative text-sm font-semibold uppercase">Preparing your analysis…</p>
          <div className="relative">
            <LoadingDots />
          </div>
        </div>
      ) : (
        // mt-32 on phones keeps the stacked tiles below the preview box. self-start/self-end there push the labels toward the middle so they don't run off the screen edge
        <div className="w-full mt-32 md:mt-0 flex flex-col md:flex-row md:items-center md:justify-center gap-6 md:gap-40">
          <button type="button" onClick={() => setAsking(true)} className="self-start md:self-auto">
            <Tile icon={<ShutterIcon />} side="camera" lines={['Allow A.I.', 'to scan your face']} />
          </button>
          {/* dimmed while the camera dialog is open, same as the reference */}
          <GalleryUpload onSelect={handleSelect} className={`self-end md:self-auto transition-opacity ${asking ? 'opacity-40' : ''}`}>
            <Tile icon={<GalleryIcon />} side="gallery" lines={['Allow A.I.', 'access gallery']} />
          </GalleryUpload>
        </div>
      )}

      {asking && !analyzing && (
        <div
          role="alertdialog"
          aria-labelledby="camera-dialog-title"
          // Escape = Deny. focus starts on Allow (autoFocus below) so the key events land here
          onKeyDown={(e) => e.key === 'Escape' && setAsking(false)}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(352px,calc(100vw-32px))] bg-fg text-bg"
        >
          <p id="camera-dialog-title" className="px-4 pt-4 pb-10 text-sm font-semibold uppercase">
            Allow A.I. to access your camera
          </p>
          <div className="flex justify-end gap-8 border-t border-bg/40 px-4 py-2 text-sm uppercase">
            <button type="button" onClick={() => setAsking(false)} className="text-bg/60">Deny</button>
            {/* the browser's own permission prompt only fires on /camera/capture when getUserMedia runs */}
            <button type="button" autoFocus onClick={() => router.push('/camera/capture')} className="font-semibold">Allow</button>
          </div>
        </div>
      )}

      <p className="absolute bottom-28 inset-x-0 text-center text-sm text-red-600" role="alert">{error}</p>
      <NavFooter backHref="/testing" />
    </main>
  );
}

// icon in a square of rotating dotted squares, with a pointer line out to the label — camera's goes up-right, gallery's down-left
// all positions are % of the square, so the same layout works at the 260px phone size and 360px desktop size
function Tile({ icon, side, lines }: { icon: React.ReactNode; side: 'camera' | 'gallery'; lines: string[] }) {
  const camera = side === 'camera';
  return (
    <span className="relative block size-[260px] md:size-[360px]">
      <RotatingSquares />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[34%]">{icon}</span>
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible" aria-hidden="true">
        {/* starts on the icon's outer ring at 45° (50 ± 17·cos45 ≈ 62/38) */}
        <line
          x1={camera ? 62 : 38} y1={camera ? 38 : 62} x2={camera ? 80 : 20} y2={camera ? 20 : 80}
          className="stroke-fg" strokeWidth="1" vectorEffect="non-scaling-stroke"
        />
        <circle cx={camera ? 80 : 20} cy={camera ? 20 : 80} r="1" className="fill-bg stroke-fg" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      <span
        className={`absolute whitespace-nowrap text-xs md:text-sm uppercase leading-relaxed ${camera ? 'left-[82%] top-[15%] text-left' : 'right-[82%] top-[77%] text-right'}`}
      >
        {lines.map((l) => (
          <span key={l} className="block">{l}</span>
        ))}
      </span>
    </span>
  );
}
