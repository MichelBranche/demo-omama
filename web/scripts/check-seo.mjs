// Audits the generated pages: one H1, unique titles and descriptions of a sane
// length, canonical and hreflang consistency, valid JSON-LD, no leftovers from
// the theme this demo was traced from, and no missing alternative text.
//
//   npm run seo:check
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import * as cheerio from "cheerio";

import { SITE, PAGE_PATHS, pageUrl } from "./seo/site.mjs";
import { PAGES } from "./seo/pages.mjs";
import { createTranslator, loadDictionary, findUntranslated } from "./seo/i18n.mjs";

const PUBLIC_DIR = join(import.meta.dirname, "..", "public");
const LEFTOVERS = [
  "units.gr",
  "yoast",
  "wp-json",
  "oembed",
  "google-site-verification",
  "msapplication-TileImage",
  "generator",
  "shortlink",
  "hreflang=\"el\"",
  "PixelYourSite",
];

const problems = [];
const notes = [];
const titles = new Map();
const descriptions = new Map();
const verbose = process.argv.includes("--verbose");

const { dict } = loadDictionary(join(PUBLIC_DIR, "omama-i18n.js"));
const translator = createTranslator(dict);

function fail(where, message) {
  problems.push(`${where}: ${message}`);
}

for (const page of Object.keys(PAGES)) {
  for (const lang of SITE.langs) {
    const file = join(PUBLIC_DIR, lang, PAGE_PATHS[page], "index.html");
    const where = `${lang}/${PAGE_PATHS[page] || "(home)"}`;
    if (!existsSync(file)) {
      fail(where, "file mancante");
      continue;
    }

    const html = readFileSync(file, "utf8");
    const $ = cheerio.load(html);
    const config = PAGES[page];
    const url = pageUrl(page, lang);

    if (!html.startsWith("<!DOCTYPE html>")) fail(where, "doctype mancante");
    if ($("html").attr("lang") !== lang) fail(where, `lang="${$("html").attr("lang")}" invece di "${lang}"`);

    // Titles and descriptions
    const title = $("head > title").text();
    const description = $('meta[name="description"]').attr("content") || "";
    if (!title) fail(where, "title mancante");
    if (title.length > 65) fail(where, `title di ${title.length} caratteri`);
    if (!description) fail(where, "description mancante");
    else if (description.length < 80 || description.length > 170) fail(where, `description di ${description.length} caratteri`);
    if (titles.has(title)) fail(where, `title duplicato con ${titles.get(title)}`);
    titles.set(title, where);
    if (descriptions.has(description)) fail(where, `description duplicata con ${descriptions.get(description)}`);
    descriptions.set(description, where);

    // Canonical, hreflang, robots
    const canonical = $('link[rel="canonical"]').attr("href");
    if (canonical !== url) fail(where, `canonical "${canonical}" invece di "${url}"`);
    const alternates = $('link[rel="alternate"][hreflang]')
      .map((i, el) => $(el).attr("hreflang"))
      .get();
    for (const expected of [...SITE.langs.map((l) => SITE.locales[l].hreflang), "x-default"]) {
      if (!alternates.includes(expected)) fail(where, `hreflang ${expected} mancante`);
    }
    const robots = $('meta[name="robots"]').attr("content") || "";
    const shouldBlock = !SITE.indexable || config.noindex;
    if (shouldBlock !== robots.includes("noindex")) fail(where, `robots="${robots}" non coerente con la configurazione`);

    // Open Graph and Twitter
    for (const property of ["og:title", "og:description", "og:url", "og:image", "og:locale", "og:site_name"]) {
      if (!$(`meta[property="${property}"]`).attr("content")) fail(where, `${property} mancante`);
    }
    for (const name of ["twitter:card", "twitter:title", "twitter:image"]) {
      if (!$(`meta[name="${name}"]`).attr("content")) fail(where, `${name} mancante`);
    }
    const ogImage = $('meta[property="og:image"]').attr("content") || "";
    const ogFile = join(PUBLIC_DIR, ogImage.replace(SITE.origin, "").replace(/^\//, ""));
    if (!existsSync(ogFile)) fail(where, `og:image inesistente (${ogImage})`);

    // Headings
    const h1 = $("h1");
    if (h1.length !== 1) fail(where, `${h1.length} H1`);
    else if (!h1.text().trim()) fail(where, "H1 vuoto");

    // Structured data
    const blocks = $('script[type="application/ld+json"]');
    if (blocks.length !== 1) fail(where, `${blocks.length} blocchi JSON-LD`);
    blocks.each((i, el) => {
      try {
        const data = JSON.parse($(el).text());
        const graph = data["@graph"] || [];
        if (!graph.length) fail(where, "JSON-LD senza @graph");
        for (const node of graph) if (!node["@type"]) fail(where, "nodo JSON-LD senza @type");
      } catch (error) {
        fail(where, `JSON-LD non valido: ${error.message}`);
      }
    });

    // Images
    const missingAlt = $("img").filter((i, el) => $(el).attr("alt") === undefined).length;
    if (missingAlt) fail(where, `${missingAlt} <img> senza attributo alt`);
    const emptyAltPhotos = $("img")
      .filter((i, el) => {
        const src = $(el).attr("src") || "";
        return !($(el).attr("alt") || "").trim() && /\.(jpe?g|png|webp|avif)(\?|$)/i.test(src) && !/omama-logo/.test(src);
      })
      .get();
    if (emptyAltPhotos.length) fail(where, `${emptyAltPhotos.length} foto con alt vuoto`);

    // Internal links must stay inside the current language
    const inLanguage = /^\/(it|en|fr|de)($|[/#?])/;
    const internalLinks = $("a[href^='/']")
      .map((i, el) => $(el).attr("href"))
      .get();
    const strayLinks = internalLinks.filter(
      (href) => !inLanguage.test(href) && !/\.(jpe?g|png|webp|svg|ico|xml|txt|webmanifest)$/i.test(href)
    );
    if (strayLinks.length) fail(where, `link interni fuori lingua: ${[...new Set(strayLinks)].slice(0, 3).join(", ")}`);
    // Every language switcher on the page legitimately points elsewhere.
    const allowedCrossLinks = $(".omama-lang-codes").length * (SITE.langs.length - 1);
    const wrongLang = internalLinks.filter((href) => inLanguage.test(href) && !href.startsWith(`/${lang}`));
    if (wrongLang.length > allowedCrossLinks) fail(where, `${wrongLang.length} link verso un'altra lingua`);

    // Leftovers from the traced theme
    for (const needle of LEFTOVERS) {
      if ($("head").html().includes(needle)) fail(where, `residuo nel <head>: ${needle}`);
    }

    // Language switcher
    const switcher = $(".omama-lang-codes").first().find("a[href]");
    if (switcher.length !== SITE.langs.length) fail(where, `selettore lingua con ${switcher.length} link`);

    const misses = findUntranslated($, lang, translator);
    if (misses.length) {
      notes.push(`${where}: ${misses.length} testi non tradotti`);
      if (verbose) for (const miss of misses) notes.push(`      ${miss.key}\n        atteso: ${miss.expected}\n        reale:  ${miss.actual}`);
    }
  }
}

for (const file of ["robots.txt", "sitemap.xml", "site.webmanifest", "favicon.ico"]) {
  if (!existsSync(join(PUBLIC_DIR, file))) fail("root", `${file} mancante`);
}

const sitemap = readFileSync(join(PUBLIC_DIR, "sitemap.xml"), "utf8");
const expectedUrls = Object.entries(PAGES)
  .filter(([, config]) => !config.excludeFromSitemap)
  .flatMap(([page]) => SITE.langs.map((lang) => pageUrl(page, lang)));
for (const url of expectedUrls) if (!sitemap.includes(`<loc>${url}</loc>`)) fail("sitemap", `manca ${url}`);
for (const [page, config] of Object.entries(PAGES)) {
  if (config.excludeFromSitemap && sitemap.includes(pageUrl(page, SITE.defaultLang))) fail("sitemap", `${page} non dovrebbe esserci`);
}

console.log(`controllate ${Object.keys(PAGES).length * SITE.langs.length} pagine`);
if (notes.length) {
  console.log(`\n${notes.length} note (non bloccanti):`);
  for (const note of notes) console.log(`  - ${note}`);
}
if (problems.length) {
  console.log(`\n${problems.length} problemi:`);
  for (const problem of problems) console.log(`  - ${problem}`);
  process.exit(1);
}
console.log("\nnessun problema");
