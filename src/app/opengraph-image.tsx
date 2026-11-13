import { ImageResponse } from "next/og";

export const alt = "Detty Decembizzy: a Christmas surprise from Nigerian Santa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #053d22 0%, #0b6b3a 100%)",
          color: "#fff6e0",
        }}
      >
        <div style={{ display: "flex", fontSize: 36, fontWeight: 700, color: "#ffc83d" }}>
          DETTY DECEMBIZZY
        </div>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 800, lineHeight: 1.05, marginTop: 24 }}>
          Santa has something to tell somebody.
        </div>
        <div style={{ display: "flex", width: 160, height: 12, background: "#d90429", marginTop: 40 }} />
        <div style={{ display: "flex", fontSize: 34, marginTop: 32, opacity: 0.85 }}>
          Your Christmas. Your Vibe. Santa&apos;s Watching.
        </div>
      </div>
    ),
    { ...size },
  );
}