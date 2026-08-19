export const BOOKING_URL = "https://www.omamahotel.com/";

export const navLinks = [
  { href: "/camere", label: "Camere" },
  { href: "/living", label: "Vivere qui" },
  { href: "/aosta", label: "Aosta" },
  { href: "/omamamood", label: "OMAMAMOOD" },
] as const;

export const values = [
  {
    id: "condivisione",
    title: "Condivisione",
    kicker: "01",
    text: "Tavoli lunghi, colazione mai da soli, lounge che si comportano come un salotto di città. L’ospitalità qui è un atto collettivo.",
    image: "/images/interni-1.jpg",
    color: "sun",
  },
  {
    id: "liberta",
    title: "Libertà",
    kicker: "02",
    text: "Check-in dal telefono, cucina, lavanderia, arredi che si possono anche portare a casa. Ospite, non protocollo.",
    image: "/images/interni-6.jpg",
    color: "blush",
  },
  {
    id: "tecnologia",
    title: "Tecnologia",
    kicker: "03",
    text: "Domotica, tavoli hi-tech, LED wall con opere e paesaggi. La tech è calore operativo, non vetrina.",
    image: "/images/meeting-1.jpg",
    color: "leaf",
  },
] as const;

export const rooms = [
  {
    slug: "rooftop-suite",
    name: "Rooftop Suite",
    species: "Aria",
    size: "70 m²",
    guests: "8",
    color: "sun",
    image: "/images/camera-74.jpg",
    imageAlt: "/images/camera-75.jpg",
    gallery: ["/images/camera-74.jpg", "/images/camera-75.jpg", "/images/camera-39.jpg"],
    lead: "Aria e libertà. Un attico verso Emilius e Pila, sauna privata, velluti e pannelli Margaroli.",
  },
  {
    slug: "junior-suite",
    name: "Junior Suite",
    species: "Manto",
    size: "33 m²",
    guests: "5",
    color: "blush",
    image: "/images/camera-79.jpg",
    imageAlt: "/images/camera-79.jpg",
    gallery: ["/images/camera-79.jpg"],
    lead: "Vibrazioni chiare dal lato sud. Legno di pero, velluto, un’unica stanza che si comporta da suite.",
  },
  {
    slug: "family",
    name: "Family",
    species: "Nido",
    size: "30 m²",
    guests: "5",
    color: "leaf",
    image: "/images/camera-6.jpg",
    imageAlt: "/images/camera-7.jpg",
    gallery: ["/images/camera-6.jpg", "/images/camera-7.jpg", "/images/camera-4.jpg"],
    lead: "Spazio per chi viaggia in famiglia. Stesso disegno artistico, più metri per i giochi.",
  },
  {
    slug: "standard-plus",
    name: "Standard Plus",
    species: "Mosaico",
    size: "23–30 m²",
    guests: "5",
    color: "leaf",
    image: "/images/camera-66.jpg",
    imageAlt: "/images/camera-66.jpg",
    gallery: ["/images/camera-66.jpg"],
    lead: "La misura più elastica. Colore pieno, comfort smart, per leisure e lavoro nello stesso letto.",
  },
  {
    slug: "standard-view",
    name: "Standard View",
    species: "Vetta",
    size: "19–22 m²",
    guests: "2",
    color: "sun",
    image: "/images/camera-1.jpg",
    imageAlt: "/images/camera-3.jpg",
    gallery: ["/images/camera-1.jpg", "/images/camera-3.jpg"],
    lead: "Due persone, una vista. Montagna o centro, a seconda della finestra che ti capita.",
  },
  {
    slug: "standard-cozy",
    name: "Standard Cozy",
    species: "Tana",
    size: "22 m²",
    guests: "2",
    color: "blush",
    image: "/images/camera-16.jpg",
    imageAlt: "/images/camera-16.jpg",
    gallery: ["/images/camera-16.jpg"],
    lead: "La tana urbana. Compatta, calda, con la stessa carta da parati che rende unica ogni camera.",
  },
] as const;

export type Room = (typeof rooms)[number];

export const distances = [
  { n: "2 min", label: "Centro storico" },
  { n: "4 min", label: "Stazione" },
  { n: "8 min", label: "Cabinovia Pila" },
] as const;

export function getRoom(slug: string) {
  return rooms.find((room) => room.slug === slug);
}
