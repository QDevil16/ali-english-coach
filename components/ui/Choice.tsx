"use client";

import { cn } from "@/lib/utils";

function chip(active: boolean) {
  return cn(
    "rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors",
    active
      ? "border-brand bg-brand-light text-brand-dark"
      : "border-slate-300 bg-white text-slate-700 hover:border-brand",
  );
}

export function SingleChoice<T extends string | number>({
  label,
  options,
  value,
  onChange,
  columns = 2,
}: {
  label: string;
  options: Array<{ value: T; label: string }>;
  value: T | null;
  onChange: (v: T) => void;
  columns?: number;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-slate-800">
        {label}
      </legend>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            className={chip(value === o.value)}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function MultiChoice({
  label,
  options,
  values,
  onToggle,
  columns = 2,
}: {
  label: string;
  options: string[];
  values: string[];
  onToggle: (v: string) => void;
  columns?: number;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-slate-800">
        {label}
      </legend>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className={chip(values.includes(o))}
            onClick={() => onToggle(o)}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
