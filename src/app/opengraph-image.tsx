import { ImageResponse } from "next/og";

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
          padding: 80,
          background: "#FFFFFF",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 400,
            color: "#000000",
            letterSpacing: 4,
            textTransform: "uppercase",
            background: "#C8BFE7",
            padding: "10px 20px",
            alignSelf: "flex-start",
          }}
        >
          Drummer · Improviser · Composer
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 120,
              fontWeight: 400,
              color: "#000000",
              lineHeight: 1,
              letterSpacing: -2,
              textTransform: "uppercase",
            }}
          >
            Jesper L&#248;rup
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontStyle: "italic",
              fontWeight: 300,
              color: "#000000",
              marginTop: 24,
            }}
          >
            Jazz, improvisation and experimental live music
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
