"use client";

import Image from "next/image";
import Link from "next/link";
import { Cta } from "@/components/Cta";
import {
  ArrowsHeaderLeft,
  ArrowsHeaderRight,
  Bolt,
  Diamond,
  IconHeart,
  IconPencil,
  IconPeople,
} from "@/components/units/Icons";
import { BOOKING_URL } from "@/lib/content";
import { CtaArrow, ShapeOverlays } from "@/components/units/Icons";

const marqueeA = ["Tavoli lunghi", "Camere uniche", "Check-in dal telefono", "Arte in facciata"];
const marqueeB = ["Wi-Fi", "Domotica", "LED wall", "Pila a 8 minuti"];

function Marquee({
  items,
  bg,
  color,
  fill,
}: {
  items: string[];
  bg: string;
  color: string;
  fill: string;
}) {
  const row = [...items, ...items, ...items, ...items];
  return (
    <section className={`marquee ${bg}`}>
      <div className="marquee-track">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="item">
            <span className={`f-aleb-20-110 no-wrap ${color}`}>{item}</span>
            {i % 2 === 0 ? <Bolt fill={fill} /> : <Diamond fill={fill} />}
          </span>
        ))}
      </div>
    </section>
  );
}

const living = [
  {
    id: "condivisione",
    title: "Community living",
    subtitle: "Aperto, sempre",
    points: ["Tavoli lunghi", "Colazione condivisa", "Lounge da salotto"],
    image: "/images/interni-1.jpg",
  },
  {
    id: "liberta",
    title: "Libertà",
    subtitle: "Ospite, non protocollo",
    points: ["Check-in dal telefono", "Arredi da portare a casa", "Niente badge da hotel"],
    image: "/images/interni-6.jpg",
  },
  {
    id: "tecnologia",
    title: "Tecnologia",
    subtitle: "Calore operativo",
    points: ["Domotica", "LED wall", "Tavoli hi-tech", "Wi-Fi"],
    image: "/images/meeting-1.jpg",
  },
  {
    id: "speciazione",
    title: "Speciazione",
    subtitle: "Disegnata da Margaroli",
    points: ["Sette carte da parati", "750 m² di facciata", "Ogni camera un disegno"],
    image: "/images/dettaglio-5.jpg",
  },
];

const amenities = [
  "Camere arredate",
  "Smart TV",
  "Climatizzazione",
  "Wi-Fi",
  "Domotica",
  "Carte da parati",
  "Centro Aosta",
  "Pila 8 min",
];

const gallery = [
  "/images/camera-74.jpg",
  "/images/camera-79.jpg",
  "/images/camera-6.jpg",
  "/images/camera-66.jpg",
  "/images/camera-1.jpg",
  "/images/camera-16.jpg",
  "/images/interni-28.jpg",
  "/images/esterni-1.jpg",
  "/images/meeting-14.jpg",
];

const insta = ["/images/esterni-3.jpg", "/images/interni-1.jpg", "/images/camera-3.jpg", "/images/dettaglio-5.jpg"];

export function HomeView() {
  return (
    <article>
      <section className="hero">
        <div className="image-wrap omama-hero-media">
          <Image
            src="/videos/omama-hero.jpg"
            alt="Aosta"
            fill
            priority
            className="omama-hero-poster"
            sizes="100vw"
          />
          <video
            className="omama-hero-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/videos/omama-hero.jpg"
            aria-hidden
          >
            <source src="/videos/omama-hero.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="inner-wrap">
          <h1 className="title hero-title f-al-96-100 color-white">O M A M A</h1>
          <p className="description hero-copy f-ab-32-110 text-center color-white">
            Un hotel in città, disegnato una camera alla volta.
          </p>
          <Cta className="hero-cta" href={BOOKING_URL} external>
            Prenota
          </Cta>
        </div>
      </section>

      <section className="locations">
        <div className="info background-yellow">
          <div className="top-wrap">
            <span className="label d-inline-block f-a-16-120 color-black">Hotel</span>
          </div>
          <div className="middle-wrap">
            <h2 data-split className="title f-al-44-100 color-black">
              Un suono affettivo,
              <br />
              nel centro di Aosta.
            </h2>
            <p className="description f-a-20-120 color-black s-30">
              Condivisione, libertà, tecnologia. Non è un 4 stelle di montagna classico: è un social hotel, colorato,
              urbano, con le Alpi dietro la facciata.
            </p>
          </div>
          <div className="bottom-wrap">
            <span className="d-block f-ab-20-120 color-black">Via Torino 14</span>
            <div className="tags d-flex">
              <span className="tag d-block f-ab-16-120 background-gray">Centro storico</span>
              <span className="d-block f-ab-16-120 color-black">e</span>
              <span className="tag d-block f-ab-16-120 color-black background-orange">Pila 8 min</span>
            </div>
          </div>
        </div>
        <div className="photo">
          <Image src="/images/interni-1.jpg" alt="Lounge OMAMA" fill sizes="55vw" />
        </div>
      </section>

      <div className="pin-wrap">
        <Marquee items={marqueeA} bg="background-red" color="color-yellow" fill="#FFDB08" />
        <section className="living">
          <div className="living-track">
            <div className="info background-red-light">
              <div className="top-wrap">
                <span className="label d-inline-block f-a-16-120 color-black">Omama</span>
              </div>
              <div className="middle-wrap">
                <h2 data-split className="title f-al-44-100 color-black">
                  Camere tue.
                  <br />
                  Vita condivisa.
                </h2>
                <p className="subtitle d-block f-ab-20-120 color-black s-15">Tutto incluso nello spirito</p>
                <p className="description f-a-20-120 color-black s-15">
                  Ogni camera è unica. Tavoli lunghi, check-in dal telefono, LED wall. L’ospitalità qui è un atto
                  collettivo.
                </p>
              </div>
            </div>
            <div className="item-list">
              {living.map((item) => (
                <div className="item" key={item.id}>
                  <div className="image-wrap">
                    <Image src={item.image} alt={item.title} fill sizes="28vw" />
                  </div>
                  <div className="data-wrap">
                    <span className="title d-block f-al-26-110 color-black">{item.title}</span>
                    <span className="subtitle d-block f-ab-20-120 color-black s-10">{item.subtitle}</span>
                    <ul className="no-list">
                      {item.points.map((point) => (
                        <li key={point}>
                          <span className="title d-block f-a-18-180 color-black">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Marquee items={marqueeB} bg="background-blue" color="color-green-light" fill="#1BE349" />

      <section className="typical_unit">
        <div className="info">
          <div className="top-wrap">
            <span className="label d-inline-block f-a-16-120 color-black">Camere</span>
          </div>
          <div className="middle-wrap">
            <h2 data-split className="title f-al-44-100 color-black">
              Sei tipologie
              <br />
              di camera.
            </h2>
            <p className="description f-a-20-120 color-black s-40">
              Chicco Margaroli ha disegnato ogni camera. Non è una griglia di comfort: sono stanze disegnate una a una.
            </p>
            <div className="item-list">
              {amenities.map((item) => (
                <div className="item" key={item}>
                  <span className="amenity-dot" />
                  <span className="title d-block f-a-16-120-b color-black">{item}</span>
                </div>
              ))}
            </div>
            <Cta href="/camere">Tutte le camere</Cta>
          </div>
        </div>
        <div className="gallery-wrap">
          {gallery.map((src) => (
            <Link key={src} href="/camere">
              <Image src={src} alt="OMAMA" fill sizes="20vw" />
            </Link>
          ))}
          <div className="gallery-mark f-al-26-110">OMAMA</div>
        </div>
      </section>

      <section className="community">
        <div className="image-wrap">
          <Image src="/images/omamamood-16.jpg" alt="OMAMAMOOD" fill sizes="33vw" />
        </div>
        <div className="info-wrap background-red">
          <div className="top-wrap">
            <span className="label d-inline-block f-a-16-120 color-black">OMAMAMOOD</span>
          </div>
          <div className="middle-wrap mt-auto">
            <h2 data-split className="title f-al-44-100 color-black">
              Un atelier aperto.
            </h2>
            <p className="description f-a-20-120 color-black s-30">
              OMAMAMOOD. Arte, design e ospitalità. Laboratorio di Chicco Margaroli.
            </p>
            <Cta className="s-30" href="/omamamood">
              Entra nel laboratorio
            </Cta>
          </div>
        </div>
        <div className="image-wrap">
          <Image src="/images/chicco-margaroli.jpg" alt="Chicco Margaroli" fill sizes="33vw" />
        </div>
      </section>

      <section className="arrows-header d-flex align-items-center justify-content-between background-blue">
        <ArrowsHeaderLeft />
        <span className="f-al-44-100 text-center">Cosa ci definisce</span>
        <ArrowsHeaderRight />
      </section>

      <section className="what-we-stand-for">
        <div className="item background-blue">
          <IconPeople />
          <p className="title f-al-34-100 color-black s-30">Per le persone</p>
          <p className="description f-a-20-120 color-black s-20">
            Tavoli lunghi, colazione mai da soli, lounge che si comportano come un salotto di città.
          </p>
        </div>
        <div className="item background-blue">
          <IconPencil />
          <p className="title f-al-34-100 color-black s-30">Per disegno</p>
          <p className="description f-a-20-120 color-black s-20">
            Niente è accidentale. Margaroli ha disegnato camere, facciate, velluti. Ogni dettaglio tiene.
          </p>
        </div>
        <div className="item background-blue">
          <IconHeart />
          <p className="title f-al-34-100 color-black s-30">Con cura</p>
          <p className="description f-a-20-120 color-black s-20">
            Ci occupiamo di chi dorme qui, degli spazi che abitiamo e della città di cui siamo pezzo.
          </p>
        </div>
      </section>

      <section className="insta-feed">
        <Link href="/living" className="strip-bar background-black js-color-button-fill">
          <span className="f-ab-20-120 color-white">Omama</span>
          <CtaArrow />
          <ShapeOverlays />
        </Link>
        <div className="insta-container">
          <div className="info background-purple">
            <div className="top-wrap">
              <span className="label d-inline-block f-a-16-120 color-black">Hotel</span>
            </div>
            <span className="title d-block f-al-44-100 color-black">Resta connesso</span>
          </div>
          <div className="insta-photos">
            {insta.map((src) => (
              <div className="shot" key={src}>
                <Image src={src} alt="OMAMA" fill sizes="20vw" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
