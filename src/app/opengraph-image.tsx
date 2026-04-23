import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Lumivara People Advisory";
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
          justifyContent: "space-between",
          padding: "72px",
          background: "#F7F4ED",
          fontFamily: "serif",
          color: "#0E1116",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: "-0.02em",
          }}
        >
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#C8912E",
              display: "inline-block",
            }}
          />
          <span>lumivara</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#6B6F7A",
              fontFamily: "monospace",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ color: "#C8912E" }}>—</span>
            <span>Lumivara People Advisory</span>
          </div>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: 980,
              fontWeight: 400,
            }}
          >
            Bring clarity to complex people problems.
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#2B2F3A",
              maxWidth: 860,
              display: "flex",
            }}
          >
            Boutique HR & people-strategy advisory — Toronto.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
