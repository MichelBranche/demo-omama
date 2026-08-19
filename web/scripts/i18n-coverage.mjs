// Compares each translated page against its Italian twin and reports text that
// stayed identical, i.e. copy with no dictionary entry.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as cheerio from "cheerio";
import { SITE, PAGE_PATHS } from "./seo/site.mjs";
import { PAGES } from "./seo/pages.mjs";

const PUBLIC_DIR = join(import.meta.dirname, "..", "public");

// Proper nouns and identical-by-design strings: brand, people, places, plus the
// contact details (address, e-mail, domains) that read the same in every language.
const KEEP = [
  /^(OMAMA|OMAMAMOOD|Chicco Margaroli|Aosta|Pila|Wi-Fi|Smart TV|IT|EN|FR|DE|Instagram|Facebook)/i,
  /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i,
  /^(?:https?:\/\/)?(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/\S*)?$/i,
  /^Via Torino 14\b/,
];

function keep(text) {
  return KEEP.some((pattern) => pattern.test(text));
}

function texts(lang, page) {
  const file = join(PUBLIC_DIR, lang, PAGE_PATHS[page], "index.html");
  const $ = cheerio.load(readFileSync(file, "utf8"));
  const out = [];
  $("main, footer")
    .find("p, span, a, li, h1, h2, h3, h4, label, button, strong")
    .each((i, el) => {
      const $el = $(el);
      if ($el.children().length) return;
      const text = $el.text().replace(/\s+/g, " ").trim();
      if (text.length < 18) return;
      out.push(text);
    });
  return out;
}

let total = 0;
let identical = 0;
const samples = new Map();

for (const page of Object.keys(PAGES)) {
  const italian = texts("it", page);
  for (const lang of SITE.langs.filter((l) => l !== "it")) {
    const other = texts(lang, page);
    for (let i = 0; i < Math.min(italian.length, other.length); i += 1) {
      total += 1;
      if (italian[i] === other[i] && !keep(italian[i])) {
        identical += 1;
        if (!samples.has(italian[i])) samples.set(italian[i], `${page}/${lang}`);
      }
    }
  }
}

console.log(`frasi confrontate      ${total}`);
console.log(`identiche all'italiano ${identical} (${((identical / total) * 100).toFixed(1)}%)`);
if (samples.size) {
  console.log(`\n${samples.size} frasi senza traduzione:`);
  for (const [text, where] of samples.entries()) {
    console.log(`  [${where}]\n    ${text}`);
  }
  process.exit(1);
}
console.log("nessuna frase senza traduzione");
