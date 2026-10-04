'use client';

type Props = { onSelect: (dataUrl: string) => void; className?: string; children: React.ReactNode };

// children are the visible tile — the whole thing is the label, so clicking anywhere on it opens the picker
export default function GalleryUpload({ onSelect, className, children }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // cancelling the picker fires change with no file — nothing to do
    if (!file) return;
    const reader = new FileReader();
    // cast is safe — readAsDataURL always gives a string, the ArrayBuffer type only comes from readAsArrayBuffer
    reader.onload = () => onSelect(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <>
      {/* native file input can't be styled — it's hidden and the label's htmlFor opens the picker. gallery-input id is hardcoded, so only one of these per page */}
      <input type="file" accept="image/*" onChange={handleChange} className="hidden" id="gallery-input" />
      <label htmlFor="gallery-input" className={`cursor-pointer ${className ?? ''}`}>
        {children}
      </label>
    </>
  );
}
