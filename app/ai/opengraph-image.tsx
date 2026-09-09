import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Fluent, one-to-one AI coaching with Deej Burke";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const image = await readFile(join(process.cwd(), "public/fluent/og-background.jpg"));
  const background = `data:image/jpeg;base64,${image.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "flex-end",
          overflow: "hidden",
          background: "#faf8f4",
          color: "#1a1a18",
        }}
      >
        <img
          src={background}
          alt=""
          width="1200"
          height="630"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            width: "64%",
            height: "100%",
            flexDirection: "column",
            justifyContent: "center",
            padding: "64px 72px",
            background: "rgba(250, 248, 244, 0.9)",
            borderLeft: "8px solid #1e3a5f",
          }}
        >
          <div style={{ color: "#1e3a5f", fontSize: 76, fontFamily: "Georgia", lineHeight: 1 }}>
            Fluent
          </div>
          <div style={{ width: 90, height: 5, margin: "30px 0", background: "#b5532a" }} />
          <div style={{ maxWidth: 560, fontSize: 37, lineHeight: 1.22 }}>
            One-to-one AI coaching, with Deej Burke
          </div>
          <div style={{ marginTop: 42, color: "#5f5c55", fontSize: 22 }}>
            deejburke.co.za/AI-coaching-by-deej
          </div>
        </div>
      </div>
    ),
    size
  );
}
