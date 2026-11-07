/** Client-side helpers. Origin is read at click time, so no env var is needed. */
export function openWhatsApp(text: string, path: string) {
  const url = `${window.location.origin}${path}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank", "noopener,noreferrer");
}

export async function copyLink(path: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(`${window.location.origin}${path}`);
    return true;
  } catch {
    return false;
  }
}