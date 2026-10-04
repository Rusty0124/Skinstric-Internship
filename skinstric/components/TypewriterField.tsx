'use client';

type Props = {
  id: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onEnter: () => void;
};

// always a real input — the question is the placeholder, so the caret blinks inside it like the reference. no click-to-reveal swap
export default function TypewriterField({ id, placeholder, value, onChange, onEnter }: Props) {
  return (
    <div className="flex flex-col items-center w-full max-w-md">
      <label htmlFor={id} className="mb-2 text-sm uppercase text-muted">Click to type</label>
      <input
        id={id}
        // "click to type" alone doesn't say what to type — screen readers get the question instead
        aria-label={placeholder}
        // the page remounts this per step with a new key, so autoFocus lands the caret in each new question
        autoFocus
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onEnter();
        }}
        className="w-full bg-transparent border-b border-fg text-4xl sm:text-5xl font-light tracking-tight text-center outline-none placeholder:text-muted"
      />
    </div>
  );
}
