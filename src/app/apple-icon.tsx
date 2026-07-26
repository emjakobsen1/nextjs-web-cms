import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#EEE3AF",
        }}
      >
        <span
          style={{
            color: "#000000",
            fontSize: 96,
            fontWeight: 400,
            fontFamily: "sans-serif",
            lineHeight: 1,
            letterSpacing: -4,
          }}
        >
          JL
        </span>
      </div>
    ),
    { ...size }
  );
}
