/** Minimal class-name joiner. Avoids adding clsx/tailwind-merge for now. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}