import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
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
          flexDirection: "column",
          fontSize: 60,
          fontWeight: "bold",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
          borderRadius: "32px",
          boxShadow: "0 8px 32px rgba(37, 99, 235, 0.4)",
        }}
      >
        <div style={{ marginBottom: 8 }}>📊</div>
        <div style={{ fontSize: 32 }}>MB</div>
      </div>
    ),
    {
      ...size,
    }
  );
}
