'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CameraCapture from '@/components/CameraCapture';
import GalleryUpload from '@/components/GalleryUpload';
import NavFooter from '@/components/NavFooter';
import { analyzeImage } from '@/lib/analyzeImage';

export default function Result() {
  // data url from either CameraCapture or GalleryUpload — both hand back the same format. lives in state only, gone on refresh
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleProceed() {
    if (!image) return;
    setAnalyzing(true);
    setError('');
    try {
      await analyzeImage(image);
      // /select doesn't exist until Day 5 — 404 here is expected for now
      router.push('/select');
    } catch {
      setError('Analysis failed — try again or retake the photo.');
      setAnalyzing(false);
    }
  }

  if (image) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center">
        <h1 className="mb-6 text-2xl uppercase">Preview</h1>
        {/* plain img on purpose — next/image has nothing to optimize on a data url. eslint's no-img-element warning is expected here */}
        <img src={image} alt="Captured photo preview" className="w-64 h-64 object-cover mb-6" />
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {/* not NavFooter — its Links can't clear state on Back or wait for analyzeImage before navigating on Proceed */}
        <footer className="fixed bottom-0 left-0 right-0 flex justify-between items-center px-6 py-4">
          <button onClick={() => setImage(null)} disabled={analyzing} className="text-sm tracking-widest uppercase disabled:opacity-30">
            Back
          </button>
          <button onClick={handleProceed} disabled={analyzing} className="text-sm tracking-widest uppercase disabled:opacity-30">
            {analyzing ? 'Analyzing…' : 'Proceed'}
          </button>
        </footer>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex flex-col md:flex-row items-center justify-around gap-8 px-6">
      {/* wrapper keeps the caption stacked above the camera — main flips to flex-row on md, which would put it beside instead */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs tracking-widest uppercase">Recommended — take a selfie</p>
        <CameraCapture onCapture={setImage} />
      </div>
      <GalleryUpload onSelect={setImage} />
      {/* NavFooter is fine here — this Back is a plain navigation, no state to clear */}
      <NavFooter backHref="/testing" />
    </main>
  );
}
