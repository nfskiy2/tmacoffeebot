
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper to handle both default and named exports from CDN
function safeClsx(...inputs: ClassValue[]) {
  // @ts-ignore
  if (typeof clsx === 'function') return clsx(...inputs);
  // @ts-ignore
  if (typeof clsx?.default === 'function') return clsx.default(...inputs);
  // @ts-ignore
  return window.clsx ? window.clsx(...inputs) : inputs.join(' ');
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(safeClsx(inputs));
}
