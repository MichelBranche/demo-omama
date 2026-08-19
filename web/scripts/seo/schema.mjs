// JSON-LD graph builders. Everything asserted here is taken from the copy on
// the pages themselves — no invented ratings, prices or opening hours.
import { SITE, pageUrl } from "./site.mjs";
import { NEARBY, PAGES } from "./pages.mjs";

const hotelId = `${SITE.origin}/#hotel`;
const websiteId = `${SITE.origin}/#website`;

function hotelNode(lang) {
  return {
    "@type": "Hotel",
    "@id": hotelId,
    name: SITE.name,
    alternateName: SITE.shortName,
    url: pageUrl("homepage", lang),
    image: [`${SITE.origin}/images/esterni-1.jpg`, `${SITE.origin}/images/interni-6.jpg`, `${SITE.origin}/images/camera-3.jpg`],
    logo: `${SITE.origin}/images/omama-logo.png`,
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: SITE.priceRange,
    currenciesAccepted: "EUR",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      postalCode: SITE.address.postalCode,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    hasMap: `https://www.google.com/maps/search/?api=1&query=Via+Torino+14+Aosta`,
    sameAs: SITE.sameAs,
    amenityFeature: SITE.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a.name[lang] || a.name.it,
      value: true,
    })),
    numberOfRooms: SITE.rooms.length,
    containsPlace: SITE.rooms.map((room) => ({ "@id": `${SITE.origin}/#room-${room.id}` })),
  };
}

function websiteNode(lang) {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: `${SITE.origin}/`,
    name: SITE.name,
    inLanguage: SITE.locales[lang].hreflang,
    publisher: { "@id": hotelId },
  };
}

function breadcrumbNode(page, lang) {
  const home = PAGES.homepage.meta[lang].breadcrumb;
  const items = [{ "@type": "ListItem", position: 1, name: home, item: pageUrl("homepage", lang) }];
  if (page !== "homepage") {
    items.push({ "@type": "ListItem", position: 2, name: PAGES[page].meta[lang].breadcrumb, item: pageUrl(page, lang) });
  }
  return { "@type": "BreadcrumbList", "@id": `${pageUrl(page, lang)}#breadcrumb`, itemListElement: items };
}

function floorSize(size) {
  if (size.includes("-")) {
    const [min, max] = size.split("-");
    return { "@type": "QuantitativeValue", minValue: Number(min), maxValue: Number(max), unitCode: "MTK" };
  }
  return { "@type": "QuantitativeValue", value: Number(size), unitCode: "MTK" };
}

function roomNodes(lang) {
  return SITE.rooms.map((room) => ({
    "@type": "HotelRoom",
    "@id": `${SITE.origin}/#room-${room.id}`,
    name: `${room.name} · ${room.nickname}`,
    url: pageUrl("camere", lang),
    floorSize: floorSize(room.size),
    occupancy: { "@type": "QuantitativeValue", maxValue: room.occupancy, unitText: "person" },
    bed: { "@type": "BedDetails", numberOfBeds: 1 },
    amenityFeature: SITE.amenities.slice(0, 4).map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a.name[lang] || a.name.it,
      value: true,
    })),
    containedInPlace: { "@id": hotelId },
  }));
}

function attractionNodes(lang) {
  return [
    {
      "@type": "ItemList",
      "@id": `${pageUrl("aosta", lang)}#nearby`,
      name: PAGES.aosta.meta[lang].title,
      itemListElement: NEARBY.map((spot, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "TouristAttraction",
          name: spot.name[lang] || spot.name.it,
          address: { "@type": "PostalAddress", addressLocality: SITE.address.city, addressCountry: SITE.address.country },
        },
      })),
    },
  ];
}

function personNode(lang) {
  return {
    "@type": "Person",
    "@id": `${SITE.origin}/#chicco-margaroli`,
    name: SITE.artist.name,
    jobTitle: SITE.artist.jobTitle[lang] || SITE.artist.jobTitle.it,
    worksFor: { "@id": hotelId },
  };
}

const PAGE_TYPE = {
  Hotel: "WebPage",
  rooms: "CollectionPage",
  attractions: "WebPage",
  AboutPage: "AboutPage",
  ContactPage: "ContactPage",
  WebPage: "WebPage",
};

export function buildGraph({ page, lang, meta, faqs, buildDate }) {
  const config = PAGES[page];
  const url = pageUrl(page, lang);
  const types = [PAGE_TYPE[config.schema] || "WebPage"];
  if (faqs && faqs.length) types.push("FAQPage");

  const webPage = {
    "@type": types.length === 1 ? types[0] : types,
    "@id": `${url}#webpage`,
    url,
    name: meta.title,
    description: meta.description,
    inLanguage: SITE.locales[lang].hreflang,
    isPartOf: { "@id": websiteId },
    about: { "@id": hotelId },
    primaryImageOfPage: { "@type": "ImageObject", url: SITE.origin + config.ogImage },
    breadcrumb: { "@id": `${url}#breadcrumb` },
    dateModified: buildDate,
  };

  if (faqs && faqs.length) {
    webPage.mainEntity = faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    }));
  }

  const graph = [webPage, breadcrumbNode(page, lang), hotelNode(lang), websiteNode(lang)];

  if (config.schema === "rooms") {
    graph.push({
      "@type": "ItemList",
      "@id": `${url}#rooms`,
      name: meta.title,
      numberOfItems: SITE.rooms.length,
      itemListElement: SITE.rooms.map((room, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@id": `${SITE.origin}/#room-${room.id}` },
      })),
    });
    graph.push(...roomNodes(lang));
  }

  if (config.schema === "attractions") graph.push(...attractionNodes(lang));
  if (page === "omamamood") graph.push(personNode(lang));
  if (config.schema === "ContactPage") {
    graph.push({
      "@type": "ContactPoint",
      "@id": `${url}#contact`,
      contactType: "reservations",
      telephone: SITE.phone,
      email: SITE.email,
      availableLanguage: SITE.langs.map((l) => SITE.locales[l].hreflang),
      areaServed: "IT",
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
