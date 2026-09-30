'use client';
export default function GalleryUpload({ onSelect }: { onSelect: (dataUrl: string) => void }) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    // cast is safe — readAsDataURL always gives a string, the ArrayBuffer type only comes from readAsArrayBuffer
    reader.onload = () => onSelect(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col items-center">
      {/* native file input can't be styled — it's hidden and the label's htmlFor opens the picker. gallery-input id is hardcoded, so only one of these per page */}
      <input type="file" accept="image/*" onChange={handleChange} className="hidden" id="gallery-input" />
      <label htmlFor="gallery-input" aria-label="Upload photo" className="border px-6 py-2 text-sm uppercase cursor-pointer">
        Upload Photo
      </label>
    </div>
  );
}