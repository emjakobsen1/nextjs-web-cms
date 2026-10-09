import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const LINE_STYLE = {
  color: "#000000",
  fontSize: 16,
  fontWeight: 800,
  fontFamily: "sans-serif",
  lineHeight: 1,
  letterSpacing: -0.5,
  width: "100%",
  textAlign: "center" as const,
};

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "center",
          background: "#F7EAE0",
        }}
      >
        <span style={LINE_STYLE}>JES</span>
        <span style={LINE_STYLE}>PER</span>
      </div>
    ),
    { ...size }
  );
}
