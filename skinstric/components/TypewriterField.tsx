'use client';
import { useState } from 'react';

type Props = { label: string; value: string; onChange: (v: string) => void };

export default function TypewriterField({ label, value, onChange }: Props) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="mb-6">
      <label htmlFor={label} className="sr-only">{label}</label>
      {editing || value ? (
        <input
          id={label}
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