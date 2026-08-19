// Per-page metadata, written by hand in the four published languages.
// `title` stays under ~60 characters, `description` between 120 and 160.

export const PAGES = {
  homepage: {
    schema: "Hotel",
    ogImage: "/images/interni-6.jpg",
    changefreq: "monthly",
    priority: "1.0",
    // The visible hero title is the spaced-out wordmark "O M A M A", which says
    // nothing about the page, and it is animated through a `> span` selector in
    // the theme bundle. The H1 is therefore a descriptive one, kept for
    // crawlers and screen readers.
    hiddenH1: {
      it: "OMAMA Social Hotel nel centro di Aosta",
      en: "OMAMA Social Hotel in the centre of Aosta",
      fr: "OMAMA Social Hotel au centre d’Aoste",
      de: "OMAMA Social Hotel im Zentrum von Aosta",
    },
    meta: {
      it: {
        title: "OMAMA Social Hotel · Aosta, Via Torino 14",
        description:
          "Social hotel nel centro di Aosta: sei tipologie di camera disegnate da Chicco Margaroli, spazi condivisi e la cabinovia per Pila a 8 minuti.",
        breadcrumb: "Home",
      },
      en: {
        title: "OMAMA Social Hotel · Aosta city centre",
        description:
          "A social hotel in the centre of Aosta: six room types designed by Chicco Margaroli, shared spaces and the Pila cable car eight minutes away.",
        breadcrumb: "Home",
      },
      fr: {
        title: "OMAMA Social Hotel · centre d’Aoste",
        description:
          "Un social hotel au cœur d’Aoste : six types de chambres dessinées par Chicco Margaroli, des espaces partagés et la télécabine de Pila à 8 minutes.",
        breadcrumb: "Accueil",
      },
      de: {
        title: "OMAMA Social Hotel · Zentrum von Aosta",
        description:
          "Social Hotel im Zentrum von Aosta: sechs Zimmertypen von Chicco Margaroli, geteilte Räume und die Seilbahn nach Pila in acht Minuten.",
        breadcrumb: "Start",
      },
    },
  },

  camere: {
    schema: "rooms",
    ogImage: "/images/camera-3.jpg",
    changefreq: "monthly",
    priority: "0.9",
    meta: {
      it: {
        title: "Camere e suite · OMAMA Social Hotel Aosta",
        description:
          "Sei tipologie da 19 a 70 m²: Standard Cozy, View, Plus, Family, Junior Suite e Rooftop Suite con sauna privata. Bagno privato, Wi-Fi e Smart TV.",
        breadcrumb: "Camere",
      },
      en: {
        title: "Rooms & suites · OMAMA Social Hotel Aosta",
        description:
          "Six room types from 19 to 70 m²: Standard Cozy, View, Plus, Family, Junior Suite and Rooftop Suite with private sauna. Private bathroom, Wi-Fi, smart TV.",
        breadcrumb: "Rooms",
      },
      fr: {
        title: "Chambres et suites · OMAMA Aoste",
        description:
          "Six types de 19 à 70 m² : Standard Cozy, View, Plus, Family, Junior Suite et Rooftop Suite avec sauna privé. Salle de bain privée, Wi-Fi, Smart TV.",
        breadcrumb: "Chambres",
      },
      de: {
        title: "Zimmer & Suiten · OMAMA Social Hotel Aosta",
        description:
          "Sechs Zimmertypen von 19 bis 70 m²: Standard Cozy, View, Plus, Family, Junior Suite und Rooftop Suite mit privater Sauna. Bad, WLAN, Smart-TV.",
        breadcrumb: "Zimmer",
      },
    },
  },

  living: {
    schema: "AboutPage",
    ogImage: "/images/interni-1.jpg",
    changefreq: "yearly",
    priority: "0.7",
    meta: {
      it: {
        title: "Come si vive a OMAMA · Social hotel ad Aosta",
        description:
          "Un social hotel, non un quattro stelle di montagna: colazione condivisa, tavoli lunghi, check-in dal telefono e spazi che si comportano da salotto.",
        breadcrumb: "Omama",
      },
      en: {
        title: "Living at OMAMA · Social hotel in Aosta",
        description:
          "A social hotel, not a mountain four-star: shared breakfast, long tables, check-in from your phone and spaces that behave like a living room.",
        breadcrumb: "Omama",
      },
      fr: {
        title: "Vivre à OMAMA · Social hotel à Aoste",
        description:
          "Un social hotel, pas un quatre étoiles de montagne : petit-déjeuner partagé, grandes tables, check-in depuis le téléphone et des espaces-salon.",
        breadcrumb: "Omama",
      },
      de: {
        title: "Leben im OMAMA · Social Hotel in Aosta",
        description:
          "Ein Social Hotel, kein Vier-Sterne-Berghotel: gemeinsames Frühstück, lange Tische, Check-in per Handy und Räume, die sich wie ein Wohnzimmer verhalten.",
        breadcrumb: "Omama",
      },
    },
  },

  omamamood: {
    schema: "AboutPage",
    ogImage: "/images/omamamood-16.jpg",
    changefreq: "yearly",
    priority: "0.7",
    meta: {
      it: {
        title: "OMAMAMOOD · l’atelier di Chicco Margaroli",
        description:
          "Un atelier aperto dentro l’hotel: sette carte da parati, 750 m² di facciata e l’identità visiva firmata Chicco Margaroli nel cuore di Aosta.",
        breadcrumb: "OMAMAMOOD",
      },
      en: {
        title: "OMAMAMOOD · Chicco Margaroli’s studio",
        description:
          "An open studio inside the hotel: seven wallpapers, 750 m² of façade and a visual identity signed by Chicco Margaroli in the heart of Aosta.",
        breadcrumb: "OMAMAMOOD",
      },
      fr: {
        title: "OMAMAMOOD · l’atelier de Chicco Margaroli",
        description:
          "Un atelier ouvert dans l’hôtel : sept papiers peints, 750 m² de façade et une identité visuelle signée Chicco Margaroli au cœur d’Aoste.",
        breadcrumb: "OMAMAMOOD",
      },
      de: {
        title: "OMAMAMOOD · das Atelier von Chicco Margaroli",
        description:
          "Ein offenes Atelier im Hotel: sieben Tapeten, 750 m² Fassade und eine visuelle Identität von Chicco Margaroli im Herzen von Aosta.",
        breadcrumb: "OMAMAMOOD",
      },
    },
  },

  aosta: {
    schema: "attractions",
    ogImage: "/images/aosta-arco-augusto.jpg",
    changefreq: "yearly",
    priority: "0.8",
    meta: {
      it: {
        title: "Aosta a piedi da OMAMA · Via Torino 14",
        description:
          "Dal portone: Porta Praetoria, Arco di Augusto, Teatro Romano e Piazza Chanoux in pochi minuti a piedi. Cabinovia per Pila a 8 minuti.",
        breadcrumb: "Aosta",
      },
      en: {
        title: "Aosta on foot from OMAMA · Via Torino 14",
        description:
          "From the front door: Porta Praetoria, the Arch of Augustus, the Roman Theatre and Piazza Chanoux minutes away on foot. Pila cable car in 8 minutes.",
        breadcrumb: "Aosta",
      },
      fr: {
        title: "Aoste à pied depuis OMAMA · Via Torino 14",
        description:
          "Depuis la porte : Porta Praetoria, l’Arc d’Auguste, le Théâtre romain et la Piazza Chanoux à quelques minutes à pied. Télécabine de Pila à 8 minutes.",
        breadcrumb: "Aoste",
      },
      de: {
        title: "Aosta zu Fuß vom OMAMA · Via Torino 14",
        description:
          "Direkt vor der Tür: Porta Praetoria, Augustusbogen, Römisches Theater und Piazza Chanoux in wenigen Minuten. Seilbahn nach Pila in 8 Minuten.",
        breadcrumb: "Aosta",
      },
    },
  },

  mappa: {
    schema: "WebPage",
    ogImage: "/images/piazza-chanoux.png",
    changefreq: "yearly",
    priority: "0.5",
    // The map fills the viewport, so the H1 is added for crawlers and screen
    // readers only.
    hiddenH1: {
      it: "Mappa di Aosta a piedi da OMAMA",
      en: "Map of Aosta on foot from OMAMA",
      fr: "Carte d’Aoste à pied depuis OMAMA",
      de: "Karte von Aosta zu Fuß vom OMAMA",
    },
    meta: {
      it: {
        title: "Mappa di Aosta a piedi · OMAMA",
        description:
          "Mappa interattiva: centro storico, ciclabile lungo la Dora Baltea, parchi e tempi a piedi verso i monumenti, partendo da Via Torino 14.",
        breadcrumb: "Mappa",
      },
      en: {
        title: "Map of Aosta on foot · OMAMA",
        description:
          "Interactive map: the old town, the cycle path along the Dora Baltea, the parks and walking times to the monuments, starting from Via Torino 14.",
        breadcrumb: "Map",
      },
      fr: {
        title: "Carte d’Aoste à pied · OMAMA",
        description:
          "Carte interactive : centre historique, piste cyclable le long de la Doire Baltée, parcs et temps de marche vers les monuments depuis Via Torino 14.",
        breadcrumb: "Carte",
      },
      de: {
        title: "Karte von Aosta zu Fuß · OMAMA",
        description:
          "Interaktive Karte: Altstadt, Radweg entlang der Dora Baltea, Parks und Gehzeiten zu den Denkmälern, ausgehend von Via Torino 14.",
        breadcrumb: "Karte",
      },
    },
  },

  richiesta: {
    schema: "ContactPage",
    ogImage: "/images/esterni-2.jpg",
    changefreq: "yearly",
    priority: "0.6",
    meta: {
      it: {
        title: "Scrivici · OMAMA Social Hotel Aosta",
        description:
          "Una data, una richiesta, una domanda sulle camere: scrivi a info@omamahotel.com o chiama il +39 0165 44593. Siamo in Via Torino 14, Aosta.",
        breadcrumb: "Scrivici",
      },
      en: {
        title: "Contact us · OMAMA Social Hotel Aosta",
        description:
          "A date, a request, a question about the rooms: write to info@omamahotel.com or call +39 0165 44593. We are at Via Torino 14, Aosta.",
        breadcrumb: "Contact",
      },
      fr: {
        title: "Nous écrire · OMAMA Social Hotel Aoste",
        description:
          "Une date, une demande, une question sur les chambres : écrivez à info@omamahotel.com ou appelez le +39 0165 44593. Via Torino 14, Aoste.",
        breadcrumb: "Contact",
      },
      de: {
        title: "Schreiben Sie uns · OMAMA Hotel Aosta",
        description:
          "Ein Datum, eine Anfrage, eine Frage zu den Zimmern: schreiben Sie an info@omamahotel.com oder rufen Sie +39 0165 44593 an. Via Torino 14, Aosta.",
        breadcrumb: "Kontakt",
      },
    },
  },

  // Placeholder page for links that have no demo content: never indexed and
  // never listed in the sitemap, in any environment.
  demo: {
    schema: "WebPage",
    ogImage: "/images/esterni-1.jpg",
    noindex: true,
    excludeFromSitemap: true,
    meta: {
      it: {
        title: "Pagina non disponibile · OMAMA",
        description: "Questa pagina non fa parte della demo. Il sito ufficiale di OMAMA Social Hotel è su omamahotel.com.",
        breadcrumb: "Non disponibile",
      },
      en: {
        title: "Page not available · OMAMA",
        description: "This page is not part of the demo. The official OMAMA Social Hotel website is at omamahotel.com.",
        breadcrumb: "Not available",
      },
      fr: {
        title: "Page non disponible · OMAMA",
        description: "Cette page ne fait pas partie de la démo. Le site officiel d’OMAMA Social Hotel est sur omamahotel.com.",
        breadcrumb: "Non disponible",
      },
      de: {
        title: "Seite nicht verfügbar · OMAMA",
        description: "Diese Seite ist nicht Teil der Demo. Die offizielle Website von OMAMA Social Hotel ist omamahotel.com.",
        breadcrumb: "Nicht verfügbar",
      },
    },
  },
};

// Walking distances shown on the Aosta page, reused as structured data.
export const NEARBY = [
  { name: { it: "Porta Praetoria", en: "Porta Praetoria", fr: "Porta Praetoria", de: "Porta Praetoria" }, minutes: 4 },
  { name: { it: "Piazza Chanoux", en: "Piazza Chanoux", fr: "Piazza Chanoux", de: "Piazza Chanoux" }, minutes: 6 },
  { name: { it: "Arco di Augusto", en: "Arch of Augustus", fr: "Arc d’Auguste", de: "Augustusbogen" }, minutes: 5 },
  { name: { it: "Teatro Romano", en: "Roman Theatre", fr: "Théâtre romain", de: "Römisches Theater" }, minutes: 6 },
  { name: { it: "Collegiata di Sant’Orso", en: "Sant’Orso Collegiate Church", fr: "Collégiale Saint-Ours", de: "Stiftskirche Sant’Orso" }, minutes: 7 },
  { name: { it: "Cattedrale di Aosta", en: "Aosta Cathedral", fr: "Cathédrale d’Aoste", de: "Kathedrale von Aosta" }, minutes: 7 },
  { name: { it: "Stazione di Aosta", en: "Aosta railway station", fr: "Gare d’Aoste", de: "Bahnhof Aosta" }, minutes: 5 },
  { name: { it: "Cabinovia Aosta-Pila", en: "Aosta-Pila cable car", fr: "Télécabine Aoste-Pila", de: "Seilbahn Aosta-Pila" }, minutes: 8 },
];
