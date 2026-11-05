import type { NextConfig } from "next";

// PREVIEW_EXPORT=1 builds a static copy for preview hosting (no contact API).
const exportMode = process.env.PREVIEW_EXPORT === "1";

const config: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  poweredByHeader: false,
  ...(exportMode
    ? { output: "export" as const, images: { unoptimized: true } }
    : {
        // The playable game is a static build in public/festival-town/game/.
        // Next.js does not serve a folder's index.html on its own, so map the folder to it.
        async rewrites() {
          return [{ source: "/festival-town/game/", destination: "/festival-town/game/index.html" }];
        },
        // The school data room is shared by link only: keep the page and its PDFs out of search.
        async headers() {
          return [{ source: "/festival-town/data-room/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
        },
      }),
};

export default config;
