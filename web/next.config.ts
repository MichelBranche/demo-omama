import type { NextConfig } from "next";
import path from "path";

// Pages are pre-rendered per language by `npm run seo:build` into
// public/<lang>/<page>/index.html. Clean URLs (/it/camere) are served by
// rewriting to those files, so the address bar keeps the canonical form.
const LANGS = "it|en|fr|de";
const DEFAULT_LANG = "it";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },

  async redirects() {
    return [
      // Single entry point for the site root.
      { source: "/", destination: `/${DEFAULT_LANG}`, permanent: false },

      // The homepage lives at the language root, not under a slug.
      {
        source: `/:lang(${LANGS})/homepage/index.html`,
        destination: "/:lang",
        permanent: true,
      },
      {
        source: `/:lang(${LANGS})/homepage`,
        destination: "/:lang",
        permanent: true,
      },

      // The .html file behind a clean URL must not be reachable on its own,
      // otherwise every page would exist at two addresses.
      {
        source: `/:lang(${LANGS})/index.html`,
        destination: "/:lang",
        permanent: true,
      },
      {
        source: `/:lang(${LANGS})/:page/index.html`,
        destination: "/:lang/:page",
        permanent: true,
      },

      // Paths from the single-language layout this demo started with.
      { source: "/homepage", destination: `/${DEFAULT_LANG}`, permanent: true },
      { source: "/camere", destination: `/${DEFAULT_LANG}/camere`, permanent: true },
      { source: "/living", destination: `/${DEFAULT_LANG}/living`, permanent: true },
      { source: "/omamamood", destination: `/${DEFAULT_LANG}/omamamood`, permanent: true },
      { source: "/aosta", destination: `/${DEFAULT_LANG}/aosta`, permanent: true },
      { source: "/mappa", destination: `/${DEFAULT_LANG}/mappa`, permanent: true },
      { source: "/richiesta", destination: `/${DEFAULT_LANG}/richiesta`, permanent: true },
      { source: "/demo", destination: `/${DEFAULT_LANG}/demo`, permanent: true },
      { source: "/meeting", destination: `/${DEFAULT_LANG}/omamamood`, permanent: true },
    ];
  },

  async rewrites() {
    return [
      { source: `/:lang(${LANGS})`, destination: "/:lang/index.html" },
      { source: `/:lang(${LANGS})/:page`, destination: "/:lang/:page/index.html" },
    ];
  },
};

export default nextConfig;
