import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ShivNarayan Sah — Full-Stack Developer",
    short_name: "ShivNarayan",
    description:
      "Portfolio of ShivNarayan Sah, a full-stack developer in Kathmandu, Nepal.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f1e6",
    theme_color: "#bf5a33",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
