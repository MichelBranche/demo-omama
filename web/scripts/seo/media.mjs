// Alternative text for every content image, in the four published languages.
//
// Icons that sit next to their own visible label stay `alt=""` on purpose: a
// screen reader announcing "wifi icon, Wi-Fi" is noise, not information.

export const ALT_BY_FILE = {
  "omama-logo": null, // decorative: the logo link already carries an aria-label

  "interni-1": {
    it: "Lounge di OMAMA con tavoli lunghi e sedute da salotto",
    en: "OMAMA lounge with long tables and living-room seating",
    fr: "Le lounge d’OMAMA avec ses grandes tables et ses assises de salon",
    de: "OMAMA-Lounge mit langen Tischen und Wohnzimmer-Sitzgelegenheiten",
  },
  "interni-6": {
    it: "Spazi comuni di OMAMA Social Hotel nel centro di Aosta",
    en: "Shared spaces at OMAMA Social Hotel in the centre of Aosta",
    fr: "Les espaces communs d’OMAMA Social Hotel au centre d’Aoste",
    de: "Gemeinschaftsräume des OMAMA Social Hotel im Zentrum von Aosta",
  },
  "interni-18": {
    it: "Angolo colazione condivisa di OMAMA",
    en: "Shared breakfast corner at OMAMA",
    fr: "Le coin petit-déjeuner partagé d’OMAMA",
    de: "Bereich für das gemeinsame Frühstück im OMAMA",
  },
  "esterni-1": {
    it: "Facciata di OMAMA Social Hotel in Via Torino 14, Aosta",
    en: "Façade of OMAMA Social Hotel at Via Torino 14, Aosta",
    fr: "Façade d’OMAMA Social Hotel, Via Torino 14, Aoste",
    de: "Fassade des OMAMA Social Hotel in der Via Torino 14, Aosta",
  },
  "esterni-2": {
    it: "Ingresso di OMAMA sotto le mura romane di Aosta",
    en: "Entrance to OMAMA below the Roman walls of Aosta",
    fr: "Entrée d’OMAMA sous les murs romains d’Aoste",
    de: "Eingang des OMAMA unterhalb der römischen Stadtmauer von Aosta",
  },
  "esterni-3": {
    it: "La facciata disegnata da Chicco Margaroli, 750 m² di superficie",
    en: "The façade designed by Chicco Margaroli, 750 m² of surface",
    fr: "La façade dessinée par Chicco Margaroli, 750 m² de surface",
    de: "Die von Chicco Margaroli gestaltete Fassade, 750 m² Fläche",
  },
  "dettaglio-5": {
    it: "Dettaglio di una carta da parati disegnata per OMAMA",
    en: "Detail of a wallpaper designed for OMAMA",
    fr: "Détail d’un papier peint dessiné pour OMAMA",
    de: "Detail einer für OMAMA entworfenen Tapete",
  },
  "chicco-margaroli": {
    it: "L’artista Chicco Margaroli nel laboratorio di OMAMA",
    en: "Artist Chicco Margaroli in the OMAMA studio",
    fr: "L’artiste Chicco Margaroli dans l’atelier d’OMAMA",
    de: "Die Künstlerin Chicco Margaroli im Atelier des OMAMA",
  },
  "omamamood-13": {
    it: "Opere dell’atelier OMAMAMOOD esposte in hotel",
    en: "Works from the OMAMAMOOD studio on show inside the hotel",
    fr: "Œuvres de l’atelier OMAMAMOOD exposées dans l’hôtel",
    de: "Werke des OMAMAMOOD-Ateliers im Hotel",
  },
  "omamamood-16": {
    it: "Il laboratorio OMAMAMOOD aperto dentro l’hotel",
    en: "The OMAMAMOOD studio, open inside the hotel",
    fr: "L’atelier OMAMAMOOD, ouvert dans l’hôtel",
    de: "Das OMAMAMOOD-Atelier, offen im Hotel",
  },
  "omamamood-21": {
    it: "Identità visiva OMAMAMOOD applicata agli spazi comuni",
    en: "OMAMAMOOD visual identity applied to the shared spaces",
    fr: "L’identité visuelle OMAMAMOOD dans les espaces communs",
    de: "OMAMAMOOD-Bildsprache in den Gemeinschaftsräumen",
  },
  "meeting-1": {
    it: "Sala riunioni di OMAMA con tavoli hi-tech e LED wall",
    en: "OMAMA meeting room with hi-tech tables and LED wall",
    fr: "Salle de réunion d’OMAMA avec tables high-tech et mur LED",
    de: "Besprechungsraum im OMAMA mit Hightech-Tischen und LED-Wall",
  },
  "meeting-6": {
    it: "Tavolo sociale per lavorare negli spazi comuni di OMAMA",
    en: "Social table for working in the shared spaces at OMAMA",
    fr: "Table sociale pour travailler dans les espaces communs d’OMAMA",
    de: "Sozialer Tisch zum Arbeiten in den Gemeinschaftsräumen des OMAMA",
  },
  "aosta-arco-augusto": {
    it: "Arco di Augusto ad Aosta, a 5 minuti a piedi da OMAMA",
    en: "The Arch of Augustus in Aosta, a five-minute walk from OMAMA",
    fr: "L’Arc d’Auguste à Aoste, à cinq minutes à pied d’OMAMA",
    de: "Der Augustusbogen in Aosta, fünf Minuten zu Fuß vom OMAMA",
  },
  "piazza-chanoux": {
    it: "Piazza Chanoux, il salotto di Aosta a 6 minuti a piedi",
    en: "Piazza Chanoux, the drawing room of Aosta, six minutes on foot",
    fr: "La Piazza Chanoux, le salon d’Aoste, à six minutes à pied",
    de: "Piazza Chanoux, der Salon von Aosta, sechs Minuten zu Fuß",
  },
  monastero: {
    it: "Collegiata di Sant’Orso ad Aosta",
    en: "The Sant’Orso Collegiate Church in Aosta",
    fr: "La collégiale Saint-Ours à Aoste",
    de: "Die Stiftskirche Sant’Orso in Aosta",
  },
  "anfiteatro-romano": {
    it: "Teatro Romano di Aosta, a 6 minuti a piedi da OMAMA",
    en: "The Roman Theatre of Aosta, a six-minute walk from OMAMA",
    fr: "Le Théâtre romain d’Aoste, à six minutes à pied d’OMAMA",
    de: "Das Römische Theater von Aosta, sechs Minuten zu Fuß vom OMAMA",
  },
};

// Social icons are the only content of their link, so they need a real name.
export const ICON_ALTS = {
  insta: { it: "Instagram", en: "Instagram", fr: "Instagram", de: "Instagram" },
  "insta-1": { it: "Instagram", en: "Instagram", fr: "Instagram", de: "Instagram" },
  facebook: { it: "Facebook", en: "Facebook", fr: "Facebook", de: "Facebook" },
  fb: { it: "Facebook", en: "Facebook", fr: "Facebook", de: "Facebook" },
};

export const TEMPLATES = {
  // Used when a photo sits under a heading: "<heading> — OMAMA, Aosta".
  contextual: {
    it: (h) => `${h} — OMAMA Social Hotel, Aosta`,
    en: (h) => `${h} — OMAMA Social Hotel, Aosta`,
    fr: (h) => `${h} — OMAMA Social Hotel, Aoste`,
    de: (h) => `${h} — OMAMA Social Hotel, Aosta`,
  },
  room: {
    it: (name) => `Camera ${name} di OMAMA Social Hotel, Aosta`,
    en: (name) => `${name} room at OMAMA Social Hotel, Aosta`,
    fr: (name) => `Chambre ${name} d’OMAMA Social Hotel, Aoste`,
    de: (name) => `Zimmer ${name} im OMAMA Social Hotel, Aosta`,
  },
  genericRoom: {
    it: "Camera di OMAMA Social Hotel nel centro di Aosta",
    en: "A room at OMAMA Social Hotel in the centre of Aosta",
    fr: "Une chambre d’OMAMA Social Hotel au centre d’Aoste",
    de: "Zimmer im OMAMA Social Hotel im Zentrum von Aosta",
  },
  generic: {
    it: "OMAMA Social Hotel, Via Torino 14, Aosta",
    en: "OMAMA Social Hotel, Via Torino 14, Aosta",
    fr: "OMAMA Social Hotel, Via Torino 14, Aoste",
    de: "OMAMA Social Hotel, Via Torino 14, Aosta",
  },
  // Disambiguates several photos that would otherwise share one description.
  nth: {
    it: (base, n) => `${base} (foto ${n})`,
    en: (base, n) => `${base} (photo ${n})`,
    fr: (base, n) => `${base} (photo ${n})`,
    de: (base, n) => `${base} (Foto ${n})`,
  },
};
