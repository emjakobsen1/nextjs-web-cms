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
          alignItems: "center",
          justifyContent: "center",
          background: "#EEE3AF",
        }}
      >
        <span
          style={{
            color: "#000000",
            fontSize: 18,
            fontWeight: 400,
            fontFamily: "sans-serif",
            lineHeight: 1,
            letterSpacing: -1,
          }}
        >
          JL
        </span>
      </div>
    ),
    { ...size }
  );
}
