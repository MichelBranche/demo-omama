// Generates the images the metadata points at: social preview cards, favicons
// and the web app manifest.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { SITE } from "./site.mjs";
import { PAGES } from "./pages.mjs";

const LOGO = "images/omama-logo.png";

export async function buildOgImages(publicDir) {
  const outDir = join(publicDir, "images", "og");
  mkdirSync(outDir, { recursive: true });
  const written = [];

  for (const [page, config] of Object.entries(PAGES)) {
    const source = join(publicDir, config.ogImage.replace(/^\//, ""));
    const target = join(outDir, `${page}.jpg`);
    await sharp(source)
      .resize(1200, 630, { fit: "cover", position: "centre" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(target);
    written.push(`images/og/${page}.jpg`);
  }
  return written;
}

// ICO container wrapping a single 32x32 PNG frame.
function icoFromPng(png) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);
  entry.writeUInt8(32, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(header.length + entry.length, 12);

  return Buffer.concat([header, entry, png]);
}

export async function buildIcons(publicDir) {
  const iconDir = join(publicDir, "icons");
  mkdirSync(iconDir, { recursive: true });
  const logo = join(publicDir, LOGO);

  // The wordmark is dark with a transparent background, so it is flattened onto
  // white to stay legible in browser tabs and on iOS home screens.
  const square = (size, padding) =>
    sharp(logo)
      .resize(size - padding * 2, size - padding * 2, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .png();

  const written = [];
  for (const [size, padding] of [
    [32, 2],
    [180, 16],
    [192, 16],
    [512, 44],
  ]) {
    const name = size === 180 ? "apple-touch-icon.png" : `favicon-${size}.png`;
    await square(size, padding).toFile(join(iconDir, name));
    written.push(`icons/${name}`);
  }

  const png32 = await square(32, 2).toBuffer();
  writeFileSync(join(publicDir, "favicon.ico"), icoFromPng(png32));
  written.push("favicon.ico");
  return written;
}

export function buildManifest(publicDir) {
  const manifest = {
    name: SITE.name,
    short_name: SITE.shortName,
    description: PAGES.homepage.meta[SITE.defaultLang].description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    lang: SITE.defaultLang,
    theme_color: SITE.themeColor,
    background_color: SITE.backgroundColor,
    icons: [
      { src: "/icons/favicon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/favicon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "maskable" },
    ],
  };
  writeFileSync(join(publicDir, "site.webmanifest"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
  return "site.webmanifest";
}
