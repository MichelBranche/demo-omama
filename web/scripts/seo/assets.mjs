// Generates the images the metadata points at: social preview cards, favicons
// and the web app manifest.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { SITE } from "./site.mjs";
import { PAGES } from "./pages.mjs";

const LOGO = "images/omama-logo.png";
const BRAND_PURPLE = { r: 171, g: 84, b: 247, alpha: 1 };

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

async function preparedLogo(publicDir) {
  return sharp(join(publicDir, LOGO)).trim({ threshold: 10 }).png().toBuffer();
}

async function brandIcon(logoBuf, size, { logoScale = 0.75, rounded = false } = {}) {
  const logoSize = Math.max(1, Math.round(size * logoScale));
  const logoLayer = await sharp(logoBuf)
    .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  let pngBuffer = await sharp({
    create: { width: size, height: size, channels: 4, background: BRAND_PURPLE },
  })
    .composite([{ input: logoLayer, gravity: "centre" }])
    .flatten({ background: BRAND_PURPLE })
    .png()
    .toBuffer();

  if (rounded) {
    const radius = Math.round(size * 0.22);
    const mask = Buffer.from(
      `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="white"/></svg>`
    );
    pngBuffer = await sharp(pngBuffer)
      .ensureAlpha()
      .composite([{ input: mask, blend: "dest-in" }])
      .flatten({ background: BRAND_PURPLE })
      .png()
      .toBuffer();
  }

  return sharp(pngBuffer);
}

export async function buildIcons(publicDir) {
  const iconDir = join(publicDir, "icons");
  mkdirSync(iconDir, { recursive: true });
  const logoBuf = await preparedLogo(publicDir);

  const written = [];
  for (const [size, rounded, logoScale] of [
    [32, false, 0.75],
    [180, true, 0.73],
    [192, true, 0.73],
    [512, true, 0.73],
  ]) {
    const name = size === 180 ? "apple-touch-icon.png" : `favicon-${size}.png`;
    const icon = await brandIcon(logoBuf, size, { logoScale, rounded });
    await icon.png().toFile(join(iconDir, name));
    written.push(`icons/${name}`);
  }

  const icon32 = await brandIcon(logoBuf, 32, { logoScale: 0.75 });
  const png32 = await icon32.png().toBuffer();
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
    background_color: SITE.themeColor,
    icons: [
      { src: "/icons/favicon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/favicon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "maskable" },
    ],
  };
  writeFileSync(join(publicDir, "site.webmanifest"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
  return "site.webmanifest";
}
