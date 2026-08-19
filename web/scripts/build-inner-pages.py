"""Build OMAMA inner pages from live Units HTML."""
from __future__ import annotations

import re
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from omama_chrome import apply_chrome, swap_remote_images, write
from omama_faqs import inject_faqs
from omama_rooms import inject_community, inject_meet_units

ROOT = Path(r"c:\Users\miche\Desktop\demo-omama\web")
SRC = ROOT / "scripts" / "units-src"
PUB = ROOT / "public"

ROOMS = [
    "/images/camera-74.jpg",
    "/images/camera-79.jpg",
    "/images/camera-6.jpg",
    "/images/camera-66.jpg",
    "/images/camera-1.jpg",
    "/images/camera-16.jpg",
    "/images/camera-3.jpg",
    "/images/camera-4.jpg",
    "/images/camera-7.jpg",
]
HOTEL = [
    "/images/esterni-2.jpg",
    "/images/esterni-1.jpg",
    "/images/esterni-3.jpg",
    "/images/interni-1.jpg",
    "/images/interni-6.jpg",
    "/images/interni-28.jpg",
    "/images/dettaglio-5.jpg",
    "/images/meeting-1.jpg",
    "/images/meeting-14.jpg",
]


def fetch(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 200:
        return
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as res:
        dest.write_bytes(res.read())
    print("fetched", dest.name, dest.stat().st_size)


def mirror_uploads(html: str) -> None:
    urls = set(re.findall(r"https://units\.gr(/wp-content/uploads/[^\"'\s]+)", html))
    for path in urls:
        dest = PUB / path.lstrip("/")
        try:
            fetch("https://units.gr" + path, dest)
        except Exception as exc:
            print("skip", path, exc)


def living(html: str) -> str:
    html = html.replace("<title>Our way of living", "<title>Omama · OMAMA")
    html = html.replace(
        '<span class="d-block">Our way</span>',
        '<span class="d-block">Come si</span>',
    )
    html = html.replace(
        '<span class="d-block text-right">of Living</span>',
        '<span class="d-block text-right">vive</span>',
    )
    pairs = [
        ("A new approach to student living.", "Un social hotel, non un 4 stelle di montagna."),
        (
            " Built around people, everyday life and a true sense of belonging. Spaces that feel personal. Living that just works. ",
            " Condivisione, libertà, tecnologia. Spazi che si comportano come un salotto di città. ",
        ),
        (
            "More than a residence, Units is a lifestyle shaped by community, sustainability and the way students actually live.",
            "Più di un soggiorno: un atto collettivo disegnato da Chicco Margaroli.",
        ),
        ("How we think about living", "Come pensiamo l’ospitalità"),
        (
            "We believe student living should feel natural, not temporary.",
            "L’ospitalità qui deve sembrare naturale, non da protocollo.",
        ),
        ("Functional, but also personal.<br />\nSocial, yet never forced.", "Funzionale, ma personale.<br />\nSociale, mai forzata."),
        (
            "That’s why we design spaces that support everyday life, create room for connection,<br />\nand take the hassle out of it.",
            "Per questo i tavoli sono lunghi, il check-in è dal telefono,<br />\ne ogni camera è unica.",
        ),
        ("Because living shouldn’t feel like a compromise. It should feel just right.", "Perché dormire qui non è un compromesso. È stare al centro di Aosta."),
        ("Your Unit", "La tua camera"),
        (
            "Your own private space, designed for comfort, focus and everyday living. ",
            "Uno spazio proprio, disegnato una volta sola, da abitare senza badge.",
        ),
        ("Community living spaces", "Tavoli lunghi"),
        (
            "Spaces that inspire without holding you back – for study, relaxation, workouts, and connection.",
            "Lounge da salotto, colazione mai da soli, un LED wall al posto della reception muta.",
        ),
        ("Daily Support", "Tecnologia"),
        (
            "Everything you need, right when you need it. From maintenance to day-to-day support, we take care of the details. ",
            "Domotica, Wi-Fi, tavoli hi-tech. La tech è calore operativo.",
        ),
        ("Safety & Security", "Libertà"),
        (
            "A well-managed, secure environment that keeps you at ease, day and night.",
            "Ospite, non protocollo. Arredi unici, spazi pensati per sentirsi a casa.",
        ),
        ("Community & Events", "OMAMAMOOD"),
        (
            "Opportunities to meet, share and belong, naturally.",
            "Arte in facciata, laboratorio al piano, non un gift shop.",
        ),
        ("Digital Experience ", "Check-in dal telefono"),
        ("Digital Experience", "Check-in dal telefono"),
        (
            "Smart tools that make everyday living simple and effortless.",
            "Entri dall’app. Niente badge da hotel.",
        ),
        ("For People", "Per le persone"),
        ("By Design", "Per disegno"),
        ("With Care", "Con cura"),
        ("Because it’s shaped around real everyday life.", "Perché è fatto per la vita vera, in città."),
        ("Because it’s more than just a place to stay.", "Perché non è solo un letto tra le Alpi."),
        ("Because feeling at home is what matters most.", "Perché il suono affettivo viene prima del protocollo."),
        ("What this means for you", "Cosa significa per te"),
        ("What defines us", "Cosa ci definisce"),
        ("Why it's different", "Perché è diverso"),
        ("Check out our Units", "Tutte le camere"),
    ]
    for old, new in pairs:
        html = html.replace(old, new)
    html = swap_remote_images(html, HOTEL + ROOMS)
    html = html.replace(
        "https://units.gr/wp-content/themes/units/public/dist/images/lottie/units_main_anim_v4 750Kb.json",
        "/wp-content/themes/units/public/dist/images/lottie/units_main_anim_v4.json",
    )
    html = html.replace(
        "/wp-content/themes/units/public/dist/images/lottie/units_main_anim_v4 750Kb.json",
        "/wp-content/themes/units/public/dist/images/lottie/units_main_anim_v4.json",
    )
    return html


def community(html: str) -> str:
    html = html.replace("<title>Community - Units</title>", "<title>OMAMAMOOD · OMAMA</title>")
    pairs = [
        ("How we see community", "Artshopping"),
        ("More than shared spaces. <br />\nA shared way of living.", "Un atelier aperto."),
        (
            "<strong>We don’t believe in forced connections or fixed formulas.</strong><br />\n<strong>We believe in creating the right conditions.</strong><br />\nCommunity at Units grows through everyday moments, shared spaces and the freedom to engage &#8211; or step back &#8211; whenever you want. People move at their own pace and connect when it feels right. It’s not something you sign up for. It’s something that unfolds, day by day.",
            "Dentro OMAMA prende vita OMAMAMOOD: arte, design e ospitalità nello stesso spazio. Non un art hotel che colleziona opere già fatte. L’identità si costruisce qui.",
        ),
        ("Different rhythms", "Speciazione"),
        ("Health & Wellness", "Facciata viva"),
        ("Different routines", "Ta Fata"),
        ("Culture & Development", "Carte da parati"),
        ("Community Give-Back", "Aosta"),
        ("Different ways of living", "Social hotel"),
        ("Social Days & Nights", "Tavoli lunghi"),
        ("Events at Units ", "OMAMAMOOD"),
        ("Events", "Laboratorio"),
        (
            "A mix of experiences that shapes your day – from wellbeing and creativity to social nights and cultural moments.",
            "Arte in facciata, velluti, legno di pero. Stanze disegnate una a una.",
        ),
        ("You choose what fits.<br />\nWe make it happen.", "Sette carte da parati.<br />\nOgni camera un disegno."),
        ("Movement, balance and moments to reset.", "Mendel, stalli di Sant’Orso, Misericordie."),
        ("Group workouts and wellness activities that support both body and mind.", "750 m² di racconto sulle facciate. Non è decorazione: è il manifesto."),
        ("Easy-going gatherings and themed nights.", "Colazione mai da soli."),
        ("From casual meet-ups to parties and shared moments.  Always inclusive, always on your own terms.", "I tavoli lunghi tengono il ritmo della casa."),
        ("Spaces that bring people together", "Spazi che tengono insieme"),
        ("Community isn’t something you just observe. It’s something you live. Explore life at Units", "Un atelier aperto, nel cuore di Aosta."),
        ("360 view", "Entra"),
    ]
    for old, new in pairs:
        html = html.replace(old, new)
    html = swap_remote_images(html, HOTEL)
    return html


def contact(html: str) -> str:
    html = html.replace("<title>Contact - Units</title>", "<title>Aosta · OMAMA</title>")
    html = html.replace("Let's<br/>Connect!", "Aosta,<br/>poi la montagna.")
    html = html.replace("Any questions?<br />\nWe’re here to answer!", "Via Torino 14.<br />\nCentro, poi Pila.")
    html = html.replace(
        "Complete the form and our team will contact you shortly. ",
        "A piedi dal centro storico, dalla stazione e dalla cabinovia. Prenota sul sito ufficiale.",
    )
    html = re.sub(
        r'<div class="js-map">[\s\S]*?</div>',
        '<div class="map-photo omama-hero-media">\n'
        '<img class="omama-hero-poster" width="1280" height="720" src="/videos/omama-hero.jpg?v=hd4" alt="" decoding="async">\n'
        '<video class="omama-hero-video" autoplay muted loop playsinline preload="auto" poster="/videos/omama-hero.jpg?v=hd4" aria-hidden="true">\n'
        '<source src="/videos/omama-hero.mp4?v=hd4" type="video/mp4">\n'
        "</video>\n"
        "</div>",
        html,
        count=1,
    )
    html = re.sub(
        r'<div data-svelte data-name="contact"></div>',
        '<div class="omama-contact-form"><p class="f-a-20-120">Via Torino 14 · 11100 Aosta</p>'
        '<p class="f-a-20-120 mt-10"><a href="tel:+39016544593">+39 0165 44593</a></p>'
        '<a class="button background-purple-dark d-inline-block mt-20" href="https://book.blastness.com/results?lingua_int=ita&id_albergo=21301&dc=6913&id_stile=" data-omama-book="1" data-event="click" data-event-action="modal-open" data-event-id="monday">Prenota</a></div>',
        html,
        count=1,
    )
    return html


def camere(html: str) -> str:
    html = html.replace("<title>", "<title>Camere · OMAMA · ")
    pairs = [
        (
            "Student accommodation at Units Parkside ",
            "Sei tipologie di camera.",
        ),
        (
            "Fully equipped and move-in ready, our units provide everything you need to hit &#8220;student mode&#8221; from day one. Designed around your daily flow Units Parkside features a 24/7 gym, a laundry room, and social spaces. Whether you’re preparing for finals or catching up with friends, you’ll find the perfect balance to live, study, and unwind.",
            "Chicco Margaroli ha disegnato ogni camera. Carta da parati, bagno privato, check-in dal telefono. Dalla Standard Cozy alla Rooftop Suite.",
        ),
        ("All you need, just steps away", "Tutto a piedi."),
        (
            "Life made simple. Just a short walk from the NKUA Zografou Campus and with easy access to the city center, you’re exactly where you need to be. And for those much-needed breaks, Skopeftirio Park is just around the corner, the perfect spot to unwind and reset.",
            "Centro storico, stazione e cabinovia Pila. L’hotel è in Via Torino 14, sotto le mura.",
        ),
        ("You are just a walk away:", "A due minuti:"),
        ("to the NKUA Zografou Campus entrance", "al centro storico"),
        ("to the nearest supermarket", "alla stazione"),
        ("to the nearest bus stop", "all’Arco di Augusto"),
        ("to the tube station", "alla cabinovia Pila"),
        ("Community Living Spaces", "Spazi comuni"),
        (
            "Social areas to relax and connect, a self-service laundry room that makes life easier, and a fully equipped gym with 24/7 access, so you never lose your rhythm.",
            "Lounge da salotto, tavoli lunghi, LED wall. Spazi pensati per stare insieme.",
        ),
        ("A new take on student living", "Un social hotel, non un residence"),
        ("Seamless student living experience", "Check-in dal telefono"),
        ("Community-first approach", "Tavoli lunghi, colazione mai da soli"),
        ("All-inclusive rent - covering electricity, water, internet, heating/cooling and shared expenses.", "Prenota le date vere. Niente affitto mensile da residence."),
        ("Simple monthly payments, all done digitally.", "Paghi sul motore ufficiale OMAMA."),
        ("A two-month deposit secures your spot.", "Nessun deposito da contratto studente."),
        ("We take care of your unit - fast support, whenever you need it.", "Ti prendiamo in carico come ospite, non come inquilino."),
        ("Kick-start your student life!", "Disegnata da Margaroli"),
    ]
    for old, new in pairs:
        html = html.replace(old, new)
    html = html.replace("Units Parkside", "OMAMA")
    html = html.replace("Kick Unit", "Standard Cozy")
    html = html.replace("Boost Unit", "Standard Plus")
    html = html.replace("Flex Unit", "Family")
    html = html.replace("Vibe Unit", "Junior Suite")
    html = html.replace("Kick Units", "Standard Cozy")
    html = html.replace("Boost Units", "Standard Plus")
    html = html.replace("Flex Units", "Family")
    html = html.replace("Vibe Units", "Junior Suite")
    html = html.replace("From 640€ / month", "22 m² · 2 ospiti")
    html = html.replace("From 690€ / month", "23–30 m² · 5 ospiti")
    html = html.replace("From 740€ / month", "30 m² · 5 ospiti")
    html = html.replace("From 790€ / month", "33 m² · 5 ospiti")
    html = html.replace(">Location<", ">Hotel<")
    html = html.replace("Meet our Units", "Le camere")
    html = html.replace("Why Units", "Perché OMAMA")
    html = re.sub(
        r'<div class="map js-map">[\s\S]*?</div>',
        '<div class="map" data-omama-map data-lat="45.736969" data-lng="7.325019" data-zoom="16" data-title="OMAMA"></div>',
        html,
        count=1,
    )
    html = swap_remote_images(html, ROOMS + HOTEL)
    html = inject_meet_units(html)
    html = inject_community(html)
    html = inject_faqs(html)
    return html


def main() -> None:
    lottie_dir = PUB / "wp-content" / "themes" / "units" / "public" / "dist" / "images" / "lottie"
    try:
        fetch(
            "https://units.gr/wp-content/themes/units/public/dist/images/lottie/units_main_anim_v4%20750Kb.json",
            lottie_dir / "units_main_anim_v4.json",
        )
        fetch(
            "https://units.gr/wp-content/themes/units/public/dist/images/lottie/units_events.json",
            lottie_dir / "units_events.json",
        )
    except Exception as exc:
        print("lottie skip", exc)

    pages = [
        (SRC / "living.html", PUB / "en" / "living" / "index.html", living),
        (SRC / "community.html", PUB / "en" / "omamamood" / "index.html", community),
        (SRC / "contact.html", PUB / "en" / "aosta" / "index.html", contact),
        (SRC / "parkside.html", PUB / "en" / "camere" / "index.html", camere),
    ]
    for src, dest, fn in pages:
        raw = src.read_text(encoding="utf-8", errors="ignore")
        mirror_uploads(raw)
        html = apply_chrome(fn(raw))
        write(dest, html)
        assert "<body" in html and "omama-mark" in html
        assert "https:/wp-content/" not in html, dest


if __name__ == "__main__":
    main()
