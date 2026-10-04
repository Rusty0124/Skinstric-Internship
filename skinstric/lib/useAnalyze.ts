'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { analyzeImage } from './analyzeImage';

// shared by /result (gallery) and /camera/capture (selfie) — both send a data url to Phase Two and land on /select
export function useAnalyze() {
  const router = useRouter();
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  // Back stays clickable while Phase Two is in flight — without this, the late response would yank the user to /select from wherever they went
  const left = useRef(false);
  useEffect(() => {
    // reset on mount too — strict mode in dev runs cleanup then mounts again
    left.current = false;
    return () => {
      left.current = true;
    };
  }, []);

  async function run(dataUrl: string) {
    setAnalyzing(true);
    setError('');
    try {
      await analyzeImage(dataUrl);
      if (!left.current) router.push('/select');
    } catch {
      if (left.current) return;
      setError('Analysis failed — try again or pick another photo.');
      setAnalyzing(false);
    }
  }

  return { analyzing, error, run };
}
