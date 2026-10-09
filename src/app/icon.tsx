import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F7EAE0",
        }}
      >
        <span
          style={{
            color: "#000000",
            fontSize: 8,
            fontWeight: 700,
            fontFamily: "sans-serif",
            lineHeight: 1.3,
            letterSpacing: -0.3,
          }}
        >
          Jesper
        </span>
        <span
          style={{
            color: "#000000",
            fontSize: 8,
            fontWeight: 700,
            fontFamily: "sans-serif",
            lineHeight: 1.3,
            letterSpacing: -0.3,
          }}
        >
          L&oslash;rup
        </span>
      </div>
    ),
    { ...size }
  );
}
