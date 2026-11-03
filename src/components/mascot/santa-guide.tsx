"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

const LINES: Array<{ match: (path: string) => boolean; text: string }> = [
  { match: (p) => p === "/", text: "Ho ho ho! Who are we surprising today?" },
  { match: (p) => p.startsWith("/create"), text: "Tell me the gist. The vibe you pick decides how much wahala I bring." },
  { match: (p) => p.startsWith("/preview"), text: "Not feeling it? Try another variation. Happy? Send it on WhatsApp." },
  { match: (p) => p.startsWith("/payment"), text: "Payment don land? Give me a moment to confirm." },
];

function SantaFace() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      <ellipse cx="50" cy="72" rx="29" ry="24" fill="#ffffff" />
      <circle cx="50" cy="48" r="22" fill="#8d5524" />
      <path d="M24 42 Q50 -8 76 42 Z" fill="#c41e3a" />
      <rect x="21" y="36" width="58" height="11" rx="5.5" fill="#ffffff" />
      <circle cx="50" cy="16" r="6" fill="#ffffff" />
      <g className="santa-eyes">
        <circle cx="42" cy="52" r="2.6" fill="#1f1a17" />
        <circle cx="58" cy="52" r="2.6" fill="#1f1a17" />
      </g>
      <ellipse cx="50" cy="63" rx="13" ry="5" fill="#ffffff" />
    </svg>
  );
}

export function SantaGuide() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(true);

  const line = LINES.find((l) => l.match(pathname));
  if (!line || dismissed) return null; // no line = no mascot (e.g. recipient reveal page)

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-end gap-2">
      <button
        type="button"
        onClick={() => setBubbleOpen((v) => !v)}
        aria-expanded={bubbleOpen}
        aria-label="Santa, your guide. Tap to show or hide his tip."
        className="animate-bob h-16 w-16 shrink-0 rounded-full bg-pine shadow-lg ring-2 ring-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      >
        <SantaFace />
      </button>

      {bubbleOpen && (
        <div
          role="status"
          className="animate-pop-in relative max-w-[210px] rounded-2xl rounded-bl-sm bg-white p-3 pr-7 text-sm leading-snug text-ink shadow-lg ring-1 ring-pine/15"
        >
          {line.text}
          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss Santa"
            className="absolute right-1.5 top-1.5 rounded p-0.5 text-ink/50 hover:text-ink"
          >
            <X aria-hidden className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}