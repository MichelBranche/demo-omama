// Build-time port of the translation pass that omama-chrome.js used to run in
// the browser. Same dictionary, same matching rules, same precedence — the
// difference is that the translated text now ships inside the HTML, so search
// engines see a real page per language instead of one Italian page.
import { readFileSync } from "node:fs";
import { createContext, runInContext } from "node:vm";

const TRANSLATABLE =
  "span, p, a, button, strong, label, h1, h2, h3, h4, li, div.title, div.subtitle, div.description, address";

const SKIP =
  ".omama-lang-codes, svg, script, style, noscript, .char, .word, [data-omama-map], .omama-map-legend, .leaflet-container, .omama-map-pop, .js-nexttab-button";

const SKIP_CLASSES = ["omama-mark", "omama-hotel", "omama-wordmark", "omama-credit", "checkbox", "char", "word"];

export function loadDictionary(i18nFile) {
  const sandbox = { window: {} };
  createContext(sandbox);
  runInContext(readFileSync(i18nFile, "utf8"), sandbox);
  const dict = sandbox.window.OMAMA_I18N;
  if (!dict) throw new Error(`no OMAMA_I18N found in ${i18nFile}`);
  return { dict, titles: sandbox.window.OMAMA_TITLES || {} };
}

export function norm(value) {
  return String(value == null ? "" : value)
    .replace(/\u00a0/g, " ")
    .replace(/[\u2018\u2019\u02BC\u0060\u00B4']/g, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function createTranslator(dict) {
  const index = Object.create(null);
  for (const key of Object.keys(dict)) {
    const row = dict[key] || {};
    for (const value of [key, row.it, row.en, row.fr, row.de]) {
      if (!value) continue;
      const plain = norm(String(value));
      if (!plain) continue;
      if (plain.length < 2 && plain !== "e") continue;
      const prev = index[plain];
      if (!prev || key.length >= prev.length) index[plain] = key;
    }
  }

  const hasEntry = (key) => Object.prototype.hasOwnProperty.call(dict, key);

  const lookupKey = (text) => {
    if (!text) return "";
    if (hasEntry(text)) return text;
    return index[norm(text)] || "";
  };

  const textFor = (key, lang) => {
    const row = dict[key];
    if (!row) return key;
    if (lang === "it") return row.it || key;
    return row[lang] || row.it || key;
  };

  return { hasEntry, lookupKey, textFor };
}

function depth($el) {
  return $el.parents().length;
}

// Mirrors setContent() from omama-chrome.js: keep markup when the value or the
// element carries markup, otherwise touch text only.
function setContent($, el, value) {
  const $el = $(el);
  if (/<[a-z][\s\S]*>/i.test(value)) {
    $el.html(value);
    return;
  }
  if ($el.children().length && $el.find("br, strong, em, a, span.char, div").length) {
    $el.html(value);
    return;
  }
  if ($el.children().length === 0) {
    $el.text(value);
    return;
  }
  const onlyText = $el
    .children()
    .toArray()
    .every((child) => child.tagName === "br");
  if (onlyText) $el.text(value);
  else $el.html(value);
}

// Translates static content in place and reports what could not be matched.
export function translateDocument($, lang, translator) {
  const { hasEntry, lookupKey, textFor } = translator;
  const items = [];

  $(TRANSLATABLE).each((i, el) => {
    const $el = $(el);
    if ($el.closest(SKIP).length) return;
    if (SKIP_CLASSES.some((cls) => $el.hasClass(cls))) return;
    if ($el.attr("for") === "agreeToTerms") return;
    if ($el.find(".shape-overlays").length) return;

    const stored = $el.attr("data-i18n");
    const key = stored && hasEntry(stored) ? stored : lookupKey(norm($el.text()));
    if (!key || !hasEntry(key)) return;
    if (!stored && key.length < 2 && key !== "e") return;

    items.push({ el, key, stored: !!stored, depth: depth($el), len: (dictLength(translator, key) || key).length });
  });

  items.sort((a, b) => {
    if (a.stored !== b.stored) return a.stored ? -1 : 1;
    if (b.len !== a.len) return b.len - a.len;
    return b.depth - a.depth;
  });

  const claimed = [];
  let translated = 0;
  for (const item of items) {
    const $el = $(item.el);
    const blocked = claimed.some((other) => other !== item.el && ($.contains(other, item.el) || $.contains(item.el, other)));
    if (blocked) continue;
    if (!$el.attr("data-i18n")) $el.attr("data-i18n", item.key);
    setContent($, item.el, textFor(item.key, lang));
    claimed.push(item.el);
    translated += 1;
  }

  translateAttributes($, lang, translator);
  return { translated, candidates: items.length };
}

function dictLength(translator, key) {
  return translator.textFor(key, "it");
}

// aria-label / title / placeholder, same three passes as the runtime script.
function translateAttributes($, lang, translator) {
  const { hasEntry, lookupKey, textFor } = translator;

  const pass = (selector, attr, memo) => {
    $(selector).each((i, el) => {
      const $el = $(el);
      if ($el.closest(".omama-lang-codes").length) return;
      const stored = $el.attr(memo) || $el.attr(attr);
      const key = lookupKey(stored);
      if (!key || !hasEntry(key)) return;
      $el.attr(memo, key);
      $el.attr(attr, norm(textFor(key, lang)));
    });
  };

  pass("[aria-label]", "aria-label", "data-i18n-aria");
  pass("a[title], button[title]", "title", "data-i18n-title");
  pass("input[placeholder], textarea[placeholder]", "placeholder", "data-i18n-placeholder");
}

// Text that stayed Italian on a non-Italian page, so gaps are easy to spot.
export function findUntranslated($, lang, translator) {
  if (lang === "it") return [];
  const misses = [];
  $("[data-i18n]").each((i, el) => {
    const $el = $(el);
    const key = $el.attr("data-i18n");
    const expected = norm(translator.textFor(key, lang));
    const actual = norm($el.text());
    // Whitespace is ignored: line breaks in the dictionary values are markup,
    // and markup contributes no text of its own to the DOM.
    const squash = (value) => value.replace(/\s+/g, "");
    if (expected && actual && squash(expected) !== squash(actual)) misses.push({ key, expected, actual });
  });
  return misses;
}
