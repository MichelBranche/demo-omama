// Smoke test contro un server avviato (next dev/start): verifica che routing,
// redirect e head SEO arrivino davvero al browser, non solo su disco.
// Uso: node scripts/check-http.mjs [base]   (default http://127.0.0.1:3000)

import { SITE, PAGE_PATHS, pageUrl } from "./seo/site.mjs";
import { PAGES } from "./seo/pages.mjs";

const BASE = (process.argv[2] || "http://127.0.0.1:3000").replace(/\/$/, "");
const problems = [];
const notes = [];

function fail(message) {
  problems.push(message);
}

async function get(path, redirect = "follow") {
  const response = await fetch(BASE + path, { redirect });
  const type = response.headers.get("content-type") || "";
  const body = type.includes("image/") ? "" : await response.text();
  return { status: response.status, location: response.headers.get("location"), type, body };
}

// Il generatore produce URL assoluti sul dominio di produzione: per confrontarli
// con quello che serve il server locale si rimappa l'origin.
function local(url) {
  return url.replace(SITE.origin, "");
}

const pages = Object.keys(PAGES);

// 1. Ogni pagina canonica risponde 200 con l'html giusto.
const seen = new Map();
for (const lang of SITE.langs) {
  for (const page of pages) {
    const path = local(pageUrl(page, lang));
    const { status, type, body } = await get(path, "manual");
    if (status !== 200) {
      fail(`${path} risponde ${status} invece di 200`);
      continue;
    }
    if (!type.includes("text/html")) fail(`${path} servito come ${type}`);

    const htmlLang = (body.match(/<html[^>]*\blang="([^"]+)"/) || [])[1];
    if (htmlLang !== lang) fail(`${path} ha lang="${htmlLang}", atteso "${lang}"`);

    const canonical = (body.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
    if (canonical !== pageUrl(page, lang)) {
      fail(`${path} canonical "${canonical}" invece di "${pageUrl(page, lang)}"`);
    }

    const robots = (body.match(/<meta name="robots" content="([^"]+)"/) || [])[1] || "";
    const wantsNoindex = !SITE.indexable || Boolean(PAGES[page].noindex);
    if (wantsNoindex !== robots.includes("noindex")) {
      fail(`${path} robots="${robots}" non coerente con indexable=${SITE.indexable}`);
    }

    const alternates = [...SITE.langs.map((alt) => SITE.locales[alt].hreflang), "x-default"];
    for (const alt of alternates) {
      if (!body.includes(`hreflang="${alt}"`)) fail(`${path} manca hreflang ${alt}`);
    }

    const title = (body.match(/<title>([^<]*)<\/title>/) || [])[1] || "";
    const description = (body.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
    if (!title) fail(`${path} senza title`);
    if (!description) fail(`${path} senza description`);
    if (seen.has(title)) fail(`title duplicato tra ${seen.get(title)} e ${path}`);
    seen.set(title, path);

    const h1 = body.match(/<h1\b/g) || [];
    if (h1.length !== 1) fail(`${path} ha ${h1.length} h1`);

    const jsonld = body.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (!jsonld) {
      fail(`${path} senza JSON-LD`);
    } else {
      try {
        const graph = JSON.parse(jsonld[1]);
        if (!Array.isArray(graph["@graph"]) || !graph["@graph"].length) {
          fail(`${path} JSON-LD con @graph vuoto`);
        }
      } catch (error) {
        fail(`${path} JSON-LD non valido: ${error.message}`);
      }
    }
  }
}

// 2. I vecchi percorsi devono reindirizzare, non morire.
const legacy = [["/", `/${SITE.defaultLang}`]];
for (const page of pages) {
  const slug = PAGE_PATHS[page];
  const clean = local(pageUrl(page, SITE.defaultLang));
  legacy.push([`/en/${page}/index.html`, local(pageUrl(page, "en"))]);
  legacy.push([`/it/${page}/index.html`, local(pageUrl(page, "it"))]);
  if (slug) legacy.push([`/${slug}`, clean]);
}
legacy.push(["/homepage", `/${SITE.defaultLang}`]);
legacy.push(["/en/homepage", "/en"]);

for (const [from, to] of legacy) {
  const { status, location } = await get(from, "manual");
  if (status < 300 || status > 399) {
    fail(`${from} risponde ${status}, atteso un redirect verso ${to}`);
    continue;
  }
  if (location !== to) fail(`${from} reindirizza a ${location} invece di ${to}`);
}

// 3. Asset SEO serviti.
for (const path of [
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
  "/icons/favicon-32.png",
  "/icons/favicon-192.png",
  "/icons/favicon-512.png",
  "/icons/apple-touch-icon.png",
  "/site.webmanifest",
]) {
  const { status } = await get(path, "manual");
  if (status !== 200) fail(`${path} risponde ${status}`);
}

const robotsTxt = await get("/robots.txt");
if (SITE.indexable) {
  if (!robotsTxt.body.includes("Sitemap:")) fail("robots.txt senza Sitemap");
  if (/Disallow: \/$/m.test(robotsTxt.body)) fail("robots.txt blocca tutto ma il sito è indicizzabile");
} else if (!/Disallow: \/$/m.test(robotsTxt.body)) {
  fail("robots.txt non blocca la demo");
}

const sitemap = await get("/sitemap.xml");
const urls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const listed = pages.filter((page) => !PAGES[page].excludeFromSitemap);
const expected = SITE.langs.length * listed.length;
if (urls.length !== expected) fail(`sitemap con ${urls.length} url, attesi ${expected}`);
for (const url of urls) {
  const { status } = await get(local(url), "manual");
  if (status !== 200) fail(`sitemap indica ${url} che risponde ${status}`);
}
for (const page of pages.filter((name) => PAGES[name].excludeFromSitemap)) {
  for (const lang of SITE.langs) {
    if (urls.includes(pageUrl(page, lang))) fail(`sitemap include ${page} (${lang}) che va escluso`);
  }
}
notes.push(`${urls.length} url in sitemap, tutti 200`);

// 4. Le og:image devono esistere davvero.
const ogImages = new Set();
for (const lang of SITE.langs) {
  for (const page of pages) {
    const { body } = await get(local(pageUrl(page, lang)), "manual");
    const og = (body.match(/<meta property="og:image" content="([^"]+)"/) || [])[1];
    if (og) ogImages.add(local(og));
    else fail(`${pageUrl(page, lang)} senza og:image`);
  }
}
for (const image of ogImages) {
  const { status, type } = await get(image, "manual");
  if (status !== 200) fail(`og:image ${image} risponde ${status}`);
  else if (!type.includes("image/")) fail(`og:image ${image} servita come ${type}`);
}
notes.push(`${ogImages.size} og:image verificate`);

console.log(`Smoke test HTTP su ${BASE}`);
for (const note of notes) console.log(`  ${note}`);
if (problems.length) {
  console.log(`\n${problems.length} problemi:`);
  for (const problem of problems) console.log(`  - ${problem}`);
  process.exit(1);
}
console.log(`\n${SITE.langs.length * pages.length} pagine, ${legacy.length} redirect: tutto ok`);
