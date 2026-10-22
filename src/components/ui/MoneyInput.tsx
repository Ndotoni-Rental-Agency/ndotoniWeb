'use client';

import { InputHTMLAttributes, useLayoutEffect, useRef } from 'react';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> & {
  value: string | number | undefined;
  onValueChange: (value: string) => void;
};

/** Group amounts for display; keep form submissions and application state unformatted. */
export default function MoneyInput({ value, onValueChange, name, min, max, ...props }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);
  const raw = String(value ?? '');
  const display = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  useLayoutEffect(() => {
    const input = ref.current;
    if (!input) return;
    const amount = Number(raw);
    input.setCustomValidity(raw && min !== undefined && amount < Number(min)
      ? `Enter an amount of at least ${Number(min).toLocaleString('en-US')}.`
      : raw && max !== undefined && amount > Number(max)
        ? `Enter an amount no greater than ${Number(max).toLocaleString('en-US')}.` : '');
    if (caret.current !== null) {
      let digits = 0;
      let position = 0;
      while (position < display.length && digits < caret.current) {
        if (/\d/.test(display[position])) digits++;
        position++;
      }
      input.setSelectionRange(position, position);
      caret.current = null;
    }
  });

  return <>
    <input {...props} ref={ref} type="text" inputMode="numeric" value={display}
      onChange={event => {
        const text = event.target.value;
        if (!/^[\d,\s]*$/.test(text)) return;
        caret.current = text.slice(0, event.target.selectionStart ?? text.length).replace(/\D/g, '').length;
        onValueChange(text.replace(/\D/g, ''));
      }} />
    {name && <input type="hidden" name={name} value={raw} />}
  </>;
}
