import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: "bold",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
          borderRadius: "6px",
          boxShadow: "0 2px 4px rgba(37, 99, 235, 0.3)",
        }}
      >
        MB
      </div>
    ),
    {
      ...size,
    }
  );
}
