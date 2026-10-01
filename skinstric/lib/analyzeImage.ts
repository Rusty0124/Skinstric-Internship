// Phase Two — sends the photo, gets back race/age/gender scores for /summary
export async function analyzeImage(dataUrl: string) {
  // shrink to max 800px wide at jpeg 0.8 before sending — full-res camera frames make the payload huge
  const compressed = await new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Math.min(1, …) so images already under 800px never get upscaled
      const scale = Math.min(1, 800 / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = dataUrl;
  });

  // API wants bare base64 — strip the "data:image/jpeg;base64," prefix
  const base64Only = compressed.split(',')[1];
  const res = await fetch('https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Only }),
  });
  if (!res.ok) throw new Error('Phase Two request failed');
  // only the data field gets stored — summary/page reads data[tab] straight off it
  const { data } = await res.json();
  // skinstric_predictions is the key summary/page reads — rename both or neither
  localStorage.setItem('skinstric_predictions', JSON.stringify(data));
  return data;
}