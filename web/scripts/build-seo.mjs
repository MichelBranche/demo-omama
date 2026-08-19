// Builds one static page per language from the Italian masters in pages-src/,
// then writes the sitemap, robots.txt, social cards and favicons.
//
//   npm run seo:build
//
// Output: public/{it,en,fr,de}/<page>/index.html — never edit those by hand,
// edit pages-src/ (structure) or scripts/seo/*.mjs (metadata) and rebuild.
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import * as cheerio from "cheerio";

import { SITE, PAGE_PATHS, pageUrl } from "./seo/site.mjs";
import { PAGES } from "./seo/pages.mjs";
import { ALT_BY_FILE, ICON_ALTS, TEMPLATES } from "./seo/media.mjs";
import { createTranslator, loadDictionary, norm, translateDocument, findUntranslated } from "./seo/i18n.mjs";
import { buildHead } from "./seo/head.mjs";
import { buildGraph } from "./seo/schema.mjs";
import { buildIcons, buildManifest, buildOgImages } from "./seo/assets.mjs";
import { renderInstagramSection } from "./seo/instagram.mjs";

const ROOT = join(import.meta.dirname, "..");
const SRC_DIR = join(ROOT, "pages-src");
const PUBLIC_DIR = join(ROOT, "public");
const BUILD_DATE = new Date().toISOString().slice(0, 10);
const BOOKING_LANG = { it: "ita", en: "eng", fr: "fra", de: "deu" };

const HEADING_SIZES = ["f-al-96-100", "f-al-64-100", "f-al-54-110", "f-al-44-100", "f-al-34-100", "f-al-26-110"];
const SIZE_RANK = new Map(HEADING_SIZES.map((cls, i) => [cls, i]));

const warnings = [];

function localPath(page, lang) {
  return pageUrl(page, lang, { absolute: false });
}

// ---------------------------------------------------------------- links & assets

function rewriteUrls($, lang) {
  const slugToPage = new Map(Object.entries(PAGE_PATHS).map(([page, slug]) => [slug || "homepage", page]));

  for (const attr of ["href", "src", "data-src"]) {
    $(`[${attr}]`).each((i, el) => {
      const value = $(el).attr(attr);
      if (!value) return;
      let next = value;

      // Absolute paths baked in by the old single-language layout.
      next = next.replace(/^\/en\/([a-z0-9-]+)\/index\.html/i, (match, slug) => {
        const page = slugToPage.get(slug) || slug;
        return PAGES[page] ? localPath(page, lang) : match;
      });

      // Document-relative asset paths: they only resolved by accident once the
      // URLs stopped matching the folder depth.
      next = next.replace(/^(?:\.\.\/)+/, "/");

      if (next !== value) $(el).attr(attr, next);
    });
  }

  // Booking engine deep links carry the interface language.
  $('a[href*="book.blastness.com"]').each((i, el) => {
    const $el = $(el);
    $el.attr("href", $el.attr("href").replace(/lingua_int=[a-z]{3}/i, `lingua_int=${BOOKING_LANG[lang]}`));
  });
}

// Real anchors, so both crawlers and users can reach every language version.
function buildLanguageSwitcher($, page, lang) {
  const labels = { it: "Lingua", en: "Language", fr: "Langue", de: "Sprache" };
  const names = { it: "Italiano", en: "English", fr: "Français", de: "Deutsch" };

  $(".omama-lang-codes").each((i, nav) => {
    const $nav = $(nav);
    $nav.attr("aria-label", labels[lang]);
    const links = SITE.langs.map((alt) => {
      const isCurrent = alt === lang;
      return (
        `<a href="${localPath(page, alt)}" data-lang="${alt}" hreflang="${SITE.locales[alt].hreflang}" lang="${alt}"` +
        ` class="${isCurrent ? "active" : ""}" title="${names[alt]}"${isCurrent ? ' aria-current="true"' : ""}` +
        ` data-barba-prevent="self">${alt.toUpperCase()}</a>`
      );
    });
    $nav.html(links.join(""));
  });
}

// ---------------------------------------------------------------- headings

function headingLevel($el, sizeClass, hasH1Already) {
  if (sizeClass !== null) {
    const rank = SIZE_RANK.get(sizeClass);
    if (!hasH1Already && rank <= SIZE_RANK.get("f-al-64-100")) return 1;
    if (rank <= SIZE_RANK.get("f-al-34-100")) return 2;
    return 3;
  }
  if ($el.hasClass("post_title")) return $el.hasClass("f-ab-20-120") ? 2 : 3;
  return 3; // card titles with no size utility class
}

function promoteHeadings($, page, lang) {
  const $article = $("article").first();
  if (!$article.length) return { h1: 0, promoted: 0 };

  let hasH1 = $("body").find("h1").length > 0;
  let promoted = 0;

  // Pages whose visible title cannot carry the H1 declare their own.
  const hidden = PAGES[page].hiddenH1;
  if (hidden && !hasH1) {
    $article.prepend(`<h1 class="omama-visually-hidden">${hidden[lang]}</h1>`);
    hasH1 = true;
  }

  const candidates = [];
  $article.find(".title, .post_title").each((i, el) => {
    const $el = $(el);
    if (["h1", "h2", "h3", "h4"].includes(el.tagName)) return;
    if ($el.closest("a, button").length) return;
    if ($el.parents(".title, .post_title").length) return;
    if (!$el.hasClass("d-block")) return; // keep inline labels inline
    // The theme animates the direct children of the hero wrapper with a
    // `> span` selector, so those elements must stay spans.
    if ($el.parent().hasClass("inner-wrap") && $el.closest("section.hero").length) return;

    const cls = ($el.attr("class") || "").split(/\s+/);
    const sizeClass = cls.find((c) => SIZE_RANK.has(c)) || null;
    // Only elements whose typography comes from a utility class are promoted:
    // those classes set font-size and font-weight themselves, so swapping the
    // tag cannot change how the text looks. Titles styled by a contextual rule
    // are left alone.
    if (!sizeClass && !$el.hasClass("post_title")) return;
    candidates.push({ el, $el, sizeClass });
  });

  // The largest title on the page becomes the H1; anything larger appearing
  // later would otherwise fight it.
  const firstH1 = candidates
    .filter((c) => c.sizeClass !== null)
    .sort((a, b) => SIZE_RANK.get(a.sizeClass) - SIZE_RANK.get(b.sizeClass))[0];

  for (const candidate of candidates) {
    const wantsH1 = !hasH1 && candidate === firstH1;
    const level = wantsH1 ? 1 : Math.max(2, headingLevel(candidate.$el, candidate.sizeClass, true));
    const tag = `h${level}`;
    const el = candidate.el;
    el.tagName = tag;
    candidate.$el.addClass("omama-heading");
    if (level === 1) hasH1 = true;
    promoted += 1;
  }

  if (!hasH1) warnings.push(`${page}/${lang}: nessun H1`);
  const count = $("body").find("h1").length;
  if (count > 1) warnings.push(`${page}/${lang}: ${count} H1`);
  return { h1: count, promoted };
}

// ---------------------------------------------------------------- images

function baseName(src) {
  const clean = String(src || "").replace(/\?.*$/, "");
  const file = clean.split("/").pop() || "";
  return file.replace(/\.[a-z0-9]+$/i, "");
}

function nearestHeading($, $img) {
  const $scope = $img.closest("[class*=item], [class*=card], [class*=unit], [class*=wrap], section").first();
  const $heading = $scope.find("h1, h2, h3, h4, .title, .post_title").first();
  const text = norm($heading.text());
  return text && text.length > 2 && text.length < 60 ? text : "";
}

function describeImages($, lang) {
  const used = new Map();
  let filled = 0;

  $("img").each((i, el) => {
    const $img = $(el);
    const src = $img.attr("src") || "";
    const name = baseName(src);
    const existing = ($img.attr("alt") || "").trim();

    if (existing) return; // author-provided text wins

    let alt = "";
    if (name in ICON_ALTS) {
      alt = ICON_ALTS[name][lang];
    } else if (name in ALT_BY_FILE) {
      alt = ALT_BY_FILE[name] ? ALT_BY_FILE[name][lang] : "";
    } else if (/\.svg($|\?)/i.test(src)) {
      alt = ""; // icon paired with its own visible label
    } else if (/^camera-/i.test(name) || /^thumbs/.test(name)) {
      const heading = nearestHeading($, $img);
      alt = heading ? TEMPLATES.room[lang](heading) : TEMPLATES.genericRoom[lang];
    } else {
      const heading = nearestHeading($, $img);
      alt = heading ? TEMPLATES.contextual[lang](heading) : TEMPLATES.generic[lang];
    }

    if (alt) {
      const seen = (used.get(alt) || 0) + 1;
      used.set(alt, seen);
      $img.attr("alt", seen > 1 ? TEMPLATES.nth[lang](alt, seen) : alt);
      filled += 1;
    } else {
      $img.attr("alt", "");
    }
  });

  // Off-screen photography is deferred; hero and slider images are not, so the
  // first paint and the carousels keep behaving exactly as before.
  let lazy = 0;
  $("img").each((i, el) => {
    const $img = $(el);
    const src = $img.attr("src") || "";
    if ($img.attr("loading")) return;
    if (/\.svg($|\?)/i.test(src)) return;
    if ($img.closest("section.hero, header, .swiper, .skeleton-container").length) return;
    if ($img.hasClass("omama-hero-poster")) return;
    $img.attr("loading", "lazy");
    $img.attr("decoding", "async");
    lazy += 1;
  });

  return { filled, lazy };
}

// ---------------------------------------------------------------- FAQ

function extractFaqs($) {
  const faqs = [];
  $('[data-i18n^="faq-q-"]').each((i, el) => {
    const $q = $(el);
    const key = $q.attr("data-i18n");
    const answerKey = key.replace("faq-q-", "faq-a-");
    const $a = $(`[data-i18n="${answerKey}"]`).first();
    const question = norm($q.text());
    const answer = norm($a.text());
    if (question && answer) faqs.push({ question, answer });
  });
  return faqs;
}

// ---------------------------------------------------------------- page build

function buildPage(page, lang, master, translator) {
  const $ = cheerio.load(master);
  const config = PAGES[page];
  const meta = config.meta[lang];

  $("html").attr("lang", lang).attr("data-omama-lang", lang).attr("data-omama-i18n", "static");

  translateDocument($, lang, translator);
  rewriteUrls($, lang);
  buildLanguageSwitcher($, page, lang);
  const headings = promoteHeadings($, page, lang);
  const images = describeImages($, lang);

  // Curated Instagram wall: injected after translation and image processing so
  // its per-language copy and explicit alt/lazy attributes are left untouched.
  if (page === "homepage") {
    const $anchor = $("section.locations").first();
    if ($anchor.length) $anchor.after(renderInstagramSection(lang));
  }

  const faqs = extractFaqs($);
  const graph = buildGraph({ page, lang, meta, faqs, buildDate: BUILD_DATE });

  const head = buildHead($, { page, lang, meta, config, graph });
  $("head").html(`\n${head}\n`);

  const misses = findUntranslated($, lang, translator);
  if (misses.length) warnings.push(`${page}/${lang}: ${misses.length} testi non tradotti (es. "${misses[0].key}")`);

  const outDir = join(PUBLIC_DIR, lang, PAGE_PATHS[page]);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), `<!DOCTYPE html>\n${$.html("html")}\n`, "utf8");

  return { headings, images, faqs: faqs.length };
}

// ---------------------------------------------------------------- sitemap & robots

function buildSitemap() {
  const rows = [];
  for (const [page, config] of Object.entries(PAGES)) {
    if (config.excludeFromSitemap) continue;
    for (const lang of SITE.langs) {
      const alternates = SITE.langs
        .map(
          (alt) =>
            `    <xhtml:link rel="alternate" hreflang="${SITE.locales[alt].hreflang}" href="${pageUrl(page, alt)}"/>`
        )
        .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(page, SITE.defaultLang)}"/>`)
        .join("\n");
      rows.push(
        [
          "  <url>",
          `    <loc>${pageUrl(page, lang)}</loc>`,
          `    <lastmod>${BUILD_DATE}</lastmod>`,
          `    <changefreq>${config.changefreq || "yearly"}</changefreq>`,
          `    <priority>${config.priority || "0.5"}</priority>`,
          alternates,
          "  </url>",
        ].join("\n")
      );
    }
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...rows,
    "</urlset>",
    "",
  ].join("\n");

  writeFileSync(join(PUBLIC_DIR, "sitemap.xml"), xml, "utf8");
  return rows.length;
}

function buildRobots() {
  const lines = SITE.indexable
    ? ["User-agent: *", "Allow: /", "", `Sitemap: ${SITE.origin}/sitemap.xml`, ""]
    : [
        "# Demo environment: crawling is disabled so this copy cannot compete",
        "# with the live site. Set indexable: true in scripts/seo/site.mjs and",
        "# rebuild to publish.",
        "User-agent: *",
        "Disallow: /",
        "",
      ];
  writeFileSync(join(PUBLIC_DIR, "robots.txt"), lines.join("\n"), "utf8");
}

// ---------------------------------------------------------------- main

async function main() {
  const { dict } = loadDictionary(join(PUBLIC_DIR, "omama-i18n.js"));
  const translator = createTranslator(dict);

  const pages = readdirSync(SRC_DIR).filter((name) => PAGES[name]);
  const missing = Object.keys(PAGES).filter((page) => !pages.includes(page));
  if (missing.length) throw new Error(`missing masters: ${missing.join(", ")}`);

  for (const lang of SITE.langs) rmSync(join(PUBLIC_DIR, lang), { recursive: true, force: true });

  let totals = { pages: 0, alts: 0, lazy: 0, faqs: 0 };
  for (const page of pages) {
    const master = readFileSync(join(SRC_DIR, page, "index.html"), "utf8").replace(/^\uFEFF/, "");
    for (const lang of SITE.langs) {
      const result = buildPage(page, lang, master, translator);
      totals.pages += 1;
      totals.alts += result.images.filled;
      totals.lazy += result.images.lazy;
      totals.faqs += result.faqs;
    }
  }

  const urls = buildSitemap();
  buildRobots();
  const og = await buildOgImages(PUBLIC_DIR);
  const icons = await buildIcons(PUBLIC_DIR);
  buildManifest(PUBLIC_DIR);

  console.log(`pagine generate      ${totals.pages} (${pages.length} pagine x ${SITE.langs.length} lingue)`);
  console.log(`alt scritti          ${totals.alts}`);
  console.log(`immagini lazy        ${totals.lazy}`);
  console.log(`FAQ strutturate      ${totals.faqs}`);
  console.log(`URL in sitemap       ${urls}`);
  console.log(`social card          ${og.length}`);
  console.log(`icone                ${icons.length}`);
  console.log(`indicizzabile        ${SITE.indexable ? "sì" : "no (noindex + robots Disallow)"}`);

  if (warnings.length) {
    console.log(`\n${warnings.length} avvisi:`);
    for (const warning of warnings.slice(0, 25)) console.log(`  - ${warning}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
