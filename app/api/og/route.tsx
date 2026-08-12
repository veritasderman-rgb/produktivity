import { ImageResponse } from "next/og";

export const runtime = "edge";

// Brandová OG karta: bílá plocha, klávesa P, titulek, mono štítek.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "Produktivní.cz").slice(0, 120);
  const label = (searchParams.get("label") ?? "produktivni.cz").slice(0, 60);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          padding: "64px 72px",
          border: "16px solid #141414",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 20,
              background: "#ffffff",
              border: "5px solid #141414",
              boxShadow: "0 10px 0 #141414",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
              fontWeight: 800,
              color: "#E03616",
            }}
          >
            P
          </div>
          <div
            style={{
              fontSize: 26,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#8b8d8e",
              fontWeight: 600,
            }}
          >
            {label}
          </div>
        </div>
        <div
          style={{
            marginTop: "auto",
            fontSize: title.length > 60 ? 52 : 64,
            fontWeight: 800,
            color: "#141414",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 36,
            height: 8,
            width: 120,
            background: "#E03616",
            display: "flex",
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
