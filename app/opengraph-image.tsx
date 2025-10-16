/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export default async function Image() {
  const svgData = await readFile(
    join(process.cwd(), "public", "icon0.svg"),
    "base64"
  );
  const svgSrc = `data:image/svg+xml;base64,${svgData}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={svgSrc} height="100" alt="test" />
      </div>
    )
  );
}
