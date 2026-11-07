"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

const HEAD = 64; // px, matches h-16 w-16
const STORAGE_KEY = "dd_santa_pos";

type Pos = { x: number; y: number };

const ROUTE_LINES: Array<{ match: (path: string) => boolean; text: string }> = [
  { match: (p) => p === "/", text: "Ho ho ho! Who are we surprising today?" },
  { match: (p) => p.startsWith("/create"), text: "Tell me the gist. The vibe you pick decides how much wahala I bring." },
  { match: (p) => p.startsWith("/preview"), text: "Not feeling it? Try another variation. Happy? Send it on WhatsApp." },
  { match: (p) => p.startsWith("/payment"), text: "Payment don land? Give me a moment to confirm." },
];

const TAP_LINES = [
  "Ho ho ho! Tap me again, I dey enjoy am.",
  "Careful with the beard o!",
  "Drag me anywhere you like. I no go vex.",
  "Pick a vibe, send the link, collect the reaction.",
  "Abeg, no tell anybody I'm ticklish.",
];

const clamp = (p: Pos): Pos => ({
  x: Math.min(Math.max(8, p.x), window.innerWidth - HEAD - 8),
  y: Math.min(Math.max(8, p.y), window.innerHeight - HEAD - 8),
});

function savePos(p: Pos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* storage can be unavailable; not critical */
  }
}

function SantaFace({ eyesRef }: { eyesRef: React.RefObject<SVGGElement | null> }) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
      <ellipse cx="50" cy="72" rx="29" ry="24" fill="#ffffff" />
      <circle cx="50" cy="48" r="22" fill="#8d5524" />
      <path d="M24 42 Q50 -8 76 42 Z" fill="#c41e3a" />
      <rect x="21" y="36" width="58" height="11" rx="5.5" fill="#ffffff" />
      <circle cx="50" cy="16" r="6" fill="#ffffff" />
      {/* outer group: eye-tracking offset; inner group: blink animation */}
      <g ref={eyesRef}>
        <g className="santa-eyes">
          <circle cx="42" cy="52" r="2.6" fill="#1f1a17" />
          <circle cx="58" cy="52" r="2.6" fill="#1f1a17" />
        </g>
      </g>
      <ellipse cx="50" cy="63" rx="13" ry="5" fill="#ffffff" />
    </svg>
  );
}

export function SantaGuide() {
  const pathname = usePathname();
  const [pos, setPos] = useState<Pos | null>(null);
  const [dragging, setDragging] = useState(false);
  const [bubbleOpen, setBubbleOpen] = useState(true);
  const [say, setSay] = useState<{ path: string; text: string } | null>(null);
  const eyesRef = useRef<SVGGElement>(null);
  const taps = useRef(0);
  const drag = useRef({ active: false, moved: false, offX: 0, offY: 0, startX: 0, startY: 0 });

  const routeLine = ROUTE_LINES.find((l) => l.match(pathname))?.text;
  const shown = say && say.path === pathname ? say.text : routeLine;

  // Place Santa after mount (window isn't available on the server).
  useEffect(() => {
    let start: Pos = { x: 16, y: window.innerHeight - HEAD - 16 };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (typeof saved?.x === "number" && typeof saved?.y === "number") start = saved;
      }
    } catch {
      /* ignore bad or unavailable storage */
    }
    const frame = requestAnimationFrame(() => setPos(clamp(start)));
    const onResize = () => setPos((p) => (p ? clamp(p) : p));
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Eyes follow the pointer. Writes the SVG attribute directly: no re-renders.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const svg = eyesRef.current?.ownerSVGElement;
      if (!svg) return;
      const r = svg.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(dist / 120, 1) * 3;
      eyesRef.current?.setAttribute("transform", `translate(${(dx / dist) * reach} ${(dy / dist) * reach})`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  if (!pos || !routeLine) return null; // no line for this route (e.g. recipient reveal) = no mascot

  function speak(text: string) {
    setSay({ path: pathname, text });
    setBubbleOpen(true);
  }

  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    if (!pos) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      active: true,
      moved: false,
      offX: e.clientX - pos.x,
      offY: e.clientY - pos.y,
      startX: e.clientX,
      startY: e.clientY,
    };
  }

  function onPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    const d = drag.current;
    if (!d.active) return;
    if (!d.moved) {
      if (Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 6) return; // still a tap
      d.moved = true;
      setDragging(true);
      speak("Eyyy! Where we dey go?");
    }
    setPos(clamp({ x: e.clientX - d.offX, y: e.clientY - d.offY }));
  }

  function endDrag(e: React.PointerEvent<HTMLButtonElement>) {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (d.moved && pos) {
      setDragging(false);
      savePos(pos);
      speak("Wheee! Nice spot.");
    }
  }

  function onClick() {
    if (drag.current.moved) {
      drag.current.moved = false; // this click is the tail end of a drag
      return;
    }
    taps.current += 1;
    speak(taps.current === 1 && routeLine ? routeLine : TAP_LINES[taps.current % TAP_LINES.length]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const step = 24;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const m = moves[e.key];
    if (!m || !pos) return;
    e.preventDefault();
    const next = clamp({ x: pos.x + m[0], y: pos.y + m[1] });
    setPos(next);
    savePos(next);
  }

  // Keep the speech bubble on-screen: above or below, left- or right-aligned.
  const vertical = pos.y < 120 ? "top-full mt-2" : "bottom-full mb-2";
  const horizontal = pos.x > window.innerWidth / 2 ? "right-0" : "left-0";

  return (
    <div className="fixed z-40" style={{ left: pos.x, top: pos.y }}>
      <button
        type="button"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClick={onClick}
        onKeyDown={onKeyDown}
        aria-label="Santa, your guide. Tap to chat, drag to move him, or use the arrow keys."
        className={`h-16 w-16 touch-none select-none rounded-full bg-pine shadow-lg ring-2 ring-gold transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold ${
          dragging ? "scale-110 -rotate-6 cursor-grabbing" : "animate-bob cursor-grab"
        }`}
      >
        <SantaFace eyesRef={eyesRef} />
      </button>

      {bubbleOpen && shown && (
        <div
          role="status"
          className={`animate-pop-in absolute ${vertical} ${horizontal} w-52 rounded-2xl bg-white p-3 pr-7 text-sm leading-snug text-ink shadow-lg ring-1 ring-pine/15`}
        >
          {shown}
          <button
            type="button"
            onClick={() => setBubbleOpen(false)}
            aria-label="Close Santa's message"
            className="absolute right-1.5 top-1.5 rounded p-0.5 text-ink/50 hover:text-ink"
          >
            <X aria-hidden className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}