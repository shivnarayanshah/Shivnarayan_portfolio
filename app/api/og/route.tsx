import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

function trim(value: string | null, fallback: string, max = 120) {
  return (value || fallback).slice(0, max);
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = trim(searchParams.get("title"), "ShivNarayan Sah");
  const subtitle = trim(
    searchParams.get("subtitle"),
    "Full-Stack Developer · React, Next.js, Node.js & MongoDB",
    160,
  );
  const eyebrow = trim(searchParams.get("eyebrow"), "shivnarayan.com.np", 60);

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
          background:
            "radial-gradient(circle at 78% 18%, #d9855f 0%, transparent 42%), radial-gradient(circle at 12% 82%, #8c9a78 0%, transparent 38%), #f8f2e7",
          color: "#1c1914",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#7b4b36",
          }}
        >
          <span>{eyebrow}</span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid rgba(28,25,20,.2)",
              borderRadius: 999,
              padding: "8px 18px",
              letterSpacing: "0.08em",
            }}
          >
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: 999,
                background: "#c05a32",
              }}
            />
            Portfolio
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.05,
              fontWeight: 600,
              letterSpacing: "-0.04em",
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              lineHeight: 1.4,
              color: "#5f5548",
              maxWidth: 880,
            }}
          >
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(28,25,20,.16)",
            paddingTop: 28,
            fontSize: 22,
            color: "#6d6254",
          }}
        >
          <span>ShivNarayan Sah — Kathmandu, Nepal</span>
          <span style={{ color: "#c05a32" }}>SN.</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
