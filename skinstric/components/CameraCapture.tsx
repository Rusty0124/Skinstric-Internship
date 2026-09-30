'use client';
import { useEffect, useRef, useState } from 'react';

export default function CameraCapture({ onCapture }: { onCapture: (dataUrl: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState('');

  // starts on mount, not onCanPlay — canplay never fires until srcObject is set, and this is what sets it
  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;

    async function start() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true });
        // unmounted while the permission prompt was open (strict mode double mount does this in dev) — kill it right away
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch {
        // getUserMedia throws on denial or no camera — same catch either way, so just fall back
        if (!cancelled) setError('Camera access denied — try Upload Photo instead.');
      }
    }

    start();
    // stopping tracks is what turns the camera light off — runs after a capture too since result/page swaps this out for the preview
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function capture() {
    const video = videoRef.current;
    if (!video) return;
    // offscreen canvas sized to the stream's real resolution, not the w-64 css box — videoWidth is 0 until the stream is playing
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    // jpeg over the png default — data url comes out much smaller
    onCapture(canvas.toDataURL('image/jpeg'));
  }

  return (
    <div className="flex flex-col items-center">
      {error ? (
        <p className="text-sm text-muted">{error}</p>
      ) : (
        <>
          <video ref={videoRef} autoPlay playsInline className="w-64 h-64 object-cover" />
          <button aria-label="Capture photo" onClick={capture} className="mt-4 border px-6 py-2 text-sm uppercase">
            Capture
          </button>
        </>
      )}
    </div>
  );
}
