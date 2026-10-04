'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CaptureButtonIcon } from './CaptureIcons';

// fills its parent — parent needs `relative` and a size. the parent page swaps this out once a shot is taken
export default function CameraCapture({ onCapture }: { onCapture: (dataUrl: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState('');

  // starts on mount, not onCanPlay — canplay never fires until srcObject is set, and this is what sets it
  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    async function start() {
      try {
        // facingMode user picks the front camera on phones — without it some open the back one
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        // unmounted while the permission prompt was open (strict mode double mount does this in dev) — kill it right away
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch {
        // getUserMedia throws on denial or no camera — same catch either way, so just fall back
        if (!cancelled) setError('Camera access denied or no camera found.');
      }
    }

    start();
    // stopping tracks is what turns the camera light off — runs after a capture too since the page swaps this out for the still
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function capture() {
    const video = videoRef.current;
    // videoWidth is 0 until the stream is actually playing — a click before then would hand back a blank image
    if (!video || !video.videoWidth) return;
    // offscreen canvas sized to the stream's real resolution, not the css box
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    // jpeg over the png default — data url comes out much smaller
    onCapture(canvas.toDataURL('image/jpeg'));
  }

  if (error) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-sm">{error}</p>
        {/* gallery is the fallback — it lives on /result, not here */}
        <Link href="/result" className="border border-current px-6 py-2 text-sm uppercase">
          Upload a photo instead
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* muted — some mobile browsers refuse to autoplay a stream that isn't */}
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
      <button onClick={capture} className="absolute right-6 sm:right-8 top-1/2 -translate-y-1/2 flex items-center gap-4 text-sm font-semibold uppercase">
        <span className="hidden sm:inline">Take picture</span>
        <span className="size-16">
          <CaptureButtonIcon />
        </span>
        {/* visible text is hidden on phones, so the button still needs a name there */}
        <span className="sr-only sm:hidden">Take picture</span>
      </button>
      <div className="absolute bottom-28 inset-x-0 px-4 text-center text-xs sm:text-sm uppercase">
        <p className="mb-4">To get better results make sure to have</p>
        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          {['Neutral expression', 'Frontal pose', 'Adequate lighting'].map((tip) => (
            <li key={tip} className="flex items-center gap-2">
              <span className="size-1.5 rotate-45 border border-current" aria-hidden="true" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
