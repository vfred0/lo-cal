import { twMerge } from "tailwind-merge";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function noop<R = void>(...args: any[]): R {
  return args as unknown as R;
}

export function logError<E = unknown>(
  error: E,
  onVisualLog?: (error: E) => void
) {
  console.error(error);
  onVisualLog?.(error);
}

export function cn(...classes: (string | undefined | null | false)[]) {
  return twMerge(classes.filter(Boolean).map((cn) => cn?.toString().trim()));
}
