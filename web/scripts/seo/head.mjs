// Rebuilds <head> from scratch.
//
// The masters still carry the head of the WordPress theme this demo was traced
// from: Yoast metadata for units.gr, oEmbed and wp-json endpoints, a Greek
// hreflang, someone else's Google verification token. Only the assets the site
// actually needs are carried over; everything else is written here.
import { SITE, pageUrl } from "./site.mjs";

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function keptAssets($) {
  const kept = [];
  $("head")
    .children()
    .each((i, el) => {
      const $el = $(el);
      const tag = el.tagName;

      if (tag === "style") {
        kept.push($.html(el));
        return;
      }
      if (tag === "link" && ($el.attr("rel") || "").toLowerCase() === "stylesheet") {
        kept.push($.html(el));
        return;
      }
      if (tag === "script") {
        const type = ($el.attr("type") || "").toLowerCase();
        const id = $el.attr("id") || "";
        const cls = $el.attr("class") || "";
        if (type === "application/ld+json") return; // stale Yoast graph
        if (id === "pys-version-script") return; // tracker banner in the console
        if (cls.includes("yoast")) return;
        kept.push($.html(el));
      }
    });
  return kept;
}

export function buildHead($, { page, lang, meta, config, graph }) {
  const url = pageUrl(page, lang);
  const locale = SITE.locales[lang];
  const noindex = !SITE.indexable || config.noindex;
  const ogImage = `${SITE.origin}/images/og/${page}.jpg`;

  const hero = $("section.hero img").first().attr("src");
  const needsMapAssets = $("[data-omama-map]").length > 0;

  const lines = [];
  const add = (line) => lines.push(line);

  add('<meta charset="utf-8">');
  add('<meta name="viewport" content="width=device-width, initial-scale=1">');
  add(`<title>${escapeAttr(meta.title)}</title>`);
  add(`<meta name="description" content="${escapeAttr(meta.description)}">`);
  add(
    noindex
      ? '<meta name="robots" content="noindex, nofollow">'
      : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">'
  );
  add(`<link rel="canonical" href="${escapeAttr(url)}">`);

  add("");
  for (const alt of SITE.langs) {
    add(`<link rel="alternate" hreflang="${SITE.locales[alt].hreflang}" href="${escapeAttr(pageUrl(page, alt))}">`);
  }
  add(`<link rel="alternate" hreflang="x-default" href="${escapeAttr(pageUrl(page, SITE.defaultLang))}">`);

  add("");
  add(`<meta property="og:type" content="website">`);
  add(`<meta property="og:site_name" content="${escapeAttr(SITE.name)}">`);
  add(`<meta property="og:locale" content="${locale.ogLocale}">`);
  for (const alt of SITE.langs) {
    if (alt !== lang) add(`<meta property="og:locale:alternate" content="${SITE.locales[alt].ogLocale}">`);
  }
  add(`<meta property="og:url" content="${escapeAttr(url)}">`);
  add(`<meta property="og:title" content="${escapeAttr(meta.title)}">`);
  add(`<meta property="og:description" content="${escapeAttr(meta.description)}">`);
  add(`<meta property="og:image" content="${escapeAttr(ogImage)}">`);
  add('<meta property="og:image:width" content="1200">');
  add('<meta property="og:image:height" content="630">');
  add(`<meta property="og:image:alt" content="${escapeAttr(meta.title)}">`);
  add('<meta name="twitter:card" content="summary_large_image">');
  add(`<meta name="twitter:title" content="${escapeAttr(meta.title)}">`);
  add(`<meta name="twitter:description" content="${escapeAttr(meta.description)}">`);
  add(`<meta name="twitter:image" content="${escapeAttr(ogImage)}">`);

  add("");
  add(`<meta name="theme-color" content="${SITE.themeColor}">`);
  add(`<meta name="apple-mobile-web-app-title" content="${escapeAttr(SITE.shortName)}">`);
  add('<link rel="icon" href="/favicon.ico?v=omama2" sizes="32x32">');
  add('<link rel="icon" type="image/png" href="/icons/favicon-32.png?v=omama2" sizes="32x32">');
  add('<link rel="icon" type="image/png" href="/icons/favicon-192.png?v=omama2" sizes="192x192">');
  add('<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png?v=omama2">');
  add('<link rel="manifest" href="/site.webmanifest?v=omama2">');

  add("");
  add('<link rel="preconnect" href="https://book.blastness.com" crossorigin>');
  if (needsMapAssets) {
    add('<link rel="preconnect" href="https://unpkg.com" crossorigin>');
    add('<link rel="preconnect" href="https://tile.openstreetmap.org" crossorigin>');
  }
  if (hero) add(`<link rel="preload" as="image" href="${escapeAttr(hero)}" fetchpriority="high">`);

  add("");
  lines.push(...keptAssets($));
  // The theme fades the body in from JavaScript; without scripting the page
  // would stay invisible.
  add("<noscript><style>body{opacity:1 !important}</style></noscript>");

  add("");
  add(`<script type="application/ld+json">${JSON.stringify(graph)}</script>`);

  return lines.join("\n");
}
