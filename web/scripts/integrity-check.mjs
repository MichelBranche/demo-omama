// Compares each generated page against its master: the assets, the scripts and
// the hooks the site needs at runtime must all survive the rebuild.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as cheerio from "cheerio";
import { SITE, PAGE_PATHS } from "./seo/site.mjs";

const ROOT = join(import.meta.dirname, "..");
let failures = 0;

function summarise($) {
  return {
    styles: $("head style").length,
    stylesheets: $('head link[rel="stylesheet"]').length,
    headScripts: $("head script").length,
    bodyScripts: $("body script").length,
    // The curated Instagram wall is generated, not traced from the master, so
    // it is excluded to keep this a like-for-like comparison.
    images: $("img").length - $(".omama-ig img").length,
    barbaWrapper: $('[data-barba="wrapper"]').length,
    barbaContainer: $('[data-barba="container"]').length,
    namespace: $("[data-barba-namespace]").attr("data-barba-namespace") || "",
    heroMedia: $("section.hero .omama-hero-media, .omama-hero-media").length,
    maps: $("[data-omama-map]").length,
    bookButtons: $("[data-omama-book]").length,
    newsletter: $('[data-name="newsletter"]').length,
    preloader: $(".preloader").length,
    modal: $('.js-modal[data-id="monday"]').length,
    cursor: $(".js-block-cursor").length,
  };
}

for (const [page, slug] of Object.entries(PAGE_PATHS)) {
  const master = cheerio.load(readFileSync(join(ROOT, "pages-src", page, "index.html"), "utf8").replace(/^\uFEFF/, ""));
  const expected = summarise(master);

  for (const lang of SITE.langs) {
    const $ = cheerio.load(readFileSync(join(ROOT, "public", lang, slug, "index.html"), "utf8"));
    const actual = summarise($);
    const diffs = Object.keys(expected)
      .filter((key) => key !== "headScripts" && String(expected[key]) !== String(actual[key]))
      .map((key) => `${key}: ${expected[key]} -> ${actual[key]}`);

    // The head loses the two ld+json/tracker scripts on purpose.
    const scriptDelta = expected.headScripts - actual.headScripts;
    if (scriptDelta < 0 || scriptDelta > 2) diffs.push(`headScripts: ${expected.headScripts} -> ${actual.headScripts}`);

    if (diffs.length) {
      failures += 1;
      console.log(`${lang}/${slug || "(home)"}: ${diffs.join(", ")}`);
    }
  }
}

console.log(failures ? `\n${failures} pagine con differenze strutturali` : "struttura identica ai master su tutte le pagine");
process.exit(failures ? 1 : 0);
