// Phase Two — sends the photo, gets back race/age/gender predictions for /select
export async function analyzeImage(dataUrl: string) {
  // API wants bare base64 — strip the "data:image/jpeg;base64," prefix CameraCapture/GalleryUpload leave on
  const image = dataUrl.split(',')[1];
  const res = await fetch('https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image }),
  });
  if (!res.ok) throw new Error('Phase Two request failed');
  const data = await res.json();
  // /select reads skinstric_analysis — same pattern as skinstric_profile from Phase One
  localStorage.setItem('skinstric_analysis', JSON.stringify(data));
  return data;
}
