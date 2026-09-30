export async function analyzeImage(dataUrl: string) {
  const compressed = await new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 800 / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d')?.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = dataUrl;
  });

  const base64Only = compressed.split(',')[1];
  const res = await fetch('https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Only }),
  });
  if (!res.ok) throw new Error('Phase Two request failed');
  const { data } = await res.json();
  localStorage.setItem('skinstric_predictions', JSON.stringify(data));
  return data;
}