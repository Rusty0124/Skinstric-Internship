'use client';
import { useState } from 'react';

type Props = { label: string; value: string; onChange: (v: string) => void };

export default function TypewriterField({ label, value, onChange }: Props) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="mb-6">
      {/* sr-only — the visible prompt is the "Click to type" button. id comes from label, so two fields with the same label collide */}
      <label htmlFor={label} className="sr-only">{label}</label>
      {/* `|| value` keeps a filled field as an input after blur — otherwise it'd flip back to the placeholder and hide what was typed */}
      {editing || value ? (
        <input
          id={label}
          // only focus after a click — a prefilled field shouldn't grab focus on mount
          autoFocus={editing}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
          className="bg-transparent border-b border-white text-2xl text-center outline-none"
        />
      ) : (
        <button onClick={() => setEditing(true)} className="text-2xl tracking-widest uppercase text-muted">
          Click to type
        </button>
      )}
    </div>
  );
}