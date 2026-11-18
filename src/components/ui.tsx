import type { ComponentChildren } from 'preact';
import { useEffect, useId, useState } from 'preact/hooks';
import { ChevronDown, Minus, Plus } from 'lucide-preact';

export function Field(p: { label: string; hint?: ComponentChildren; children: ComponentChildren; id?: string }) {
  return (
    <label class="field" for={p.id}>
      <span class="lbl">{p.label}</span>
      {p.children}
      {p.hint ? <span class="hint">{p.hint}</span> : null}
    </label>
  );
}

const parse = (s: string): number | null => {
  const clean = s.replace(/\s| | /g, '').replace(',', '.');
  if (clean === '') return null;
  const n = Number(clean);
  return Number.isFinite(n) ? n : NaN;
};
const show = (n: number | null, lang: string) =>
  n === null ? '' : new Intl.NumberFormat(lang === 'uk' ? 'uk-UA' : 'en-GB', { maximumFractionDigits: 2, useGrouping: true }).format(n);

/** Number input that keeps the user's text while typing and reports a number (or null when empty). */
export function NumberInput(p: {
  id?: string; value: number | null; onChange: (v: number | null) => void; lang: string;
  unit?: ComponentChildren; placeholder?: string; min?: number; max?: number; label?: string; compact?: boolean;
}) {
  const auto = useId();
  const id = p.id ?? auto;
  const [text, setText] = useState(show(p.value, p.lang));
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) setText(show(p.value, p.lang));
  }, [p.value, focused, p.lang]);
  const n = parse(text);
  const invalid = Number.isNaN(n) || (n !== null && ((p.min !== undefined && n < p.min) || (p.max !== undefined && n > p.max)));
  const input = (
    <input
      id={id}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      aria-label={p.label}
      aria-invalid={invalid || undefined}
      placeholder={p.placeholder}
      value={text}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onInput={(e) => {
        const s = (e.target as HTMLInputElement).value;
        setText(s);
        const v = parse(s);
        if (v === null || (!Number.isNaN(v) && (p.min === undefined || v >= p.min) && (p.max === undefined || v <= p.max))) p.onChange(v);
      }}
    />
  );
  if (p.compact) return input;
  return (
    <span class={`control${invalid ? ' invalid' : ''}`}>
      {input}
      {p.unit ? <span class="unit">{p.unit}</span> : null}
    </span>
  );
}

export function Select<T extends string | number>(p: { id?: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label?: string }) {
  return (
    <span class="control select">
      <select
        id={p.id}
        aria-label={p.label}
        value={String(p.value)}
        onChange={(e) => {
          const raw = (e.target as HTMLSelectElement).value;
          const opt = p.options.find((o) => String(o.value) === raw);
          if (opt) p.onChange(opt.value);
        }}
      >
        {p.options.map((o) => (
          <option value={String(o.value)}>{o.label}</option>
        ))}
      </select>
      <ChevronDown size={16} aria-hidden="true" />
    </span>
  );
}

export function Seg<T extends string>(p: { name: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string; wide?: boolean; pill?: boolean; class?: string }) {
  return (
    <div class={`seg${p.wide ? ' wide' : ''}${p.pill ? ' pill' : ''}${p.class ? ` ${p.class}` : ''}`} role="radiogroup" aria-label={p.label}>
      {p.options.map((o) => (
        <label>
          <input type="radio" name={p.name} value={o.value} checked={o.value === p.value} onChange={() => p.onChange(o.value)} />
          <span>{o.label}</span>
        </label>
      ))}
    </div>
  );
}

export function Check(p: { checked: boolean; onChange: (v: boolean) => void; children: ComponentChildren }) {
  return (
    <label class="check">
      <input type="checkbox" checked={p.checked} onChange={(e) => p.onChange((e.target as HTMLInputElement).checked)} />
      <span>{p.children}</span>
    </label>
  );
}

export function Stepper(p: { value: number; onChange: (v: number) => void; min?: number; max?: number; label: string; fewer: string; more: string }) {
  const min = p.min ?? 0;
  const max = p.max ?? 9;
  return (
    <div class="field">
      <span class="lbl">{p.label}</span>
      <div class="stepper">
        <button type="button" aria-label={`${p.fewer}: ${p.label}`} disabled={p.value <= min} onClick={() => p.onChange(Math.max(min, p.value - 1))}>
          <Minus size={16} aria-hidden="true" />
        </button>
        <output aria-live="polite">{p.value}</output>
        <button type="button" aria-label={`${p.more}: ${p.label}`} disabled={p.value >= max} onClick={() => p.onChange(Math.min(max, p.value + 1))}>
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
