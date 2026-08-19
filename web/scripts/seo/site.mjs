// Site-wide SEO configuration.
//
// GOING LIVE CHECKLIST
//   1. set `indexable: true`
//   2. check that `origin` is the domain the site is actually served from
//   3. run `npm run seo:build`
// Until step 1 every page ships `noindex, nofollow` and robots.txt blocks all
// crawlers, so this demo can never compete with the live omamahotel.com.

export const SITE = {
  indexable: false,
  origin: "https://www.omamahotel.com",

  defaultLang: "it",
  langs: ["it", "en", "fr", "de"],

  // Language tags used in hreflang, og:locale and <html lang>.
  locales: {
    it: { hreflang: "it-IT", ogLocale: "it_IT" },
    en: { hreflang: "en", ogLocale: "en_GB" },
    fr: { hreflang: "fr-FR", ogLocale: "fr_FR" },
    de: { hreflang: "de-DE", ogLocale: "de_DE" },
  },

  name: "OMAMA Social Hotel",
  shortName: "OMAMA",
  themeColor: "#AB54F7",
  backgroundColor: "#ffffff",

  address: {
    street: "Via Torino 14",
    postalCode: "11100",
    city: "Aosta",
    region: "Valle d'Aosta",
    regionCode: "IT-23",
    country: "IT",
  },
  geo: { lat: 45.736969, lng: 7.325019 },
  phone: "+39 0165 44593",
  email: "info@omamahotel.com",
  bookingEngine: "https://book.blastness.com/results?lingua_int=ita&id_albergo=21301&dc=6913&id_stile=",
  sameAs: ["https://www.instagram.com/omama_hotel/", "https://www.facebook.com/omamahotel/"],
  priceRange: "€€",

  // Room inventory, mirrored from the copy on the rooms page.
  rooms: [
    { id: "standard-cozy", name: "Standard Cozy", nickname: "Tana", size: "22", occupancy: 2 },
    { id: "standard-view", name: "Standard View", nickname: "Vetta", size: "19-22", occupancy: 2 },
    { id: "standard-plus", name: "Standard Plus", nickname: "Mosaico", size: "23-30", occupancy: 5 },
    { id: "family", name: "Family", nickname: "Nido", size: "30", occupancy: 5 },
    { id: "junior-suite", name: "Junior Suite", nickname: "Manto", size: "33", occupancy: 5 },
    { id: "rooftop-suite", name: "Rooftop Suite", nickname: "Aria", size: "70", occupancy: 8 },
  ],

  amenities: [
    { name: { it: "Wi-Fi gratuito", en: "Free Wi-Fi", fr: "Wi-Fi gratuit", de: "Kostenloses WLAN" }, schema: "Free Wi-Fi" },
    { name: { it: "Bagno privato", en: "Private bathroom", fr: "Salle de bain privée", de: "Privates Bad" }, schema: "Private bathroom" },
    { name: { it: "Smart TV", en: "Smart TV", fr: "Smart TV", de: "Smart-TV" }, schema: "Smart TV" },
    { name: { it: "Climatizzazione", en: "Air conditioning", fr: "Climatisation", de: "Klimaanlage" }, schema: "Air conditioning" },
    { name: { it: "Colazione condivisa", en: "Shared breakfast", fr: "Petit-déjeuner partagé", de: "Gemeinsames Frühstück" }, schema: "Breakfast" },
    { name: { it: "Sauna (Rooftop Suite)", en: "Sauna (Rooftop Suite)", fr: "Sauna (Rooftop Suite)", de: "Sauna (Rooftop Suite)" }, schema: "Sauna" },
  ],

  artist: {
    name: "Chicco Margaroli",
    jobTitle: { it: "Artista", en: "Artist", fr: "Artiste", de: "Künstlerin" },
  },
};

// Physical page folder -> public URL path (language prefix is added later).
// The homepage lives at the language root, every other page keeps its slug.
export const PAGE_PATHS = {
  homepage: "",
  camere: "camere",
  living: "living",
  omamamood: "omamamood",
  aosta: "aosta",
  mappa: "mappa",
  richiesta: "richiesta",
  demo: "demo",
};

export function pageUrl(page, lang, { absolute = true } = {}) {
  const slug = PAGE_PATHS[page];
  const path = slug ? `/${lang}/${slug}` : `/${lang}`;
  return absolute ? SITE.origin + path : path;
}
