"""Rebuild Units homepage HTML with OMAMA copy/photos. No greedy regex."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from omama_chrome import (
    HEADER_LOGO,
    OMAMA_MARK,
    apply_langs,
    apply_preloader,
    fix_prenota_link,
    flatten_camere_nav,
    inject_assets,
    reorder_main_nav,
)

ROOT = Path(r"c:\Users\miche\Desktop\demo-omama\web")
SRC = Path(r"c:\Users\miche\Desktop\unit\units\units.gr\en\homepage\index.html")
OUT = ROOT / "public" / "en" / "homepage" / "index.html"

GALLERY = [
    "/images/thumbs/camera-74.jpg",
    "/images/thumbs/camera-79.jpg",
    "/images/thumbs/camera-6.jpg",
    "/images/thumbs/camera-66.jpg",
    "/images/thumbs/camera-1.jpg",
    "/images/thumbs/camera-16.jpg",
    "/images/thumbs/interni-1.jpg",
    "/images/thumbs/interni-6.jpg",
    "/images/thumbs/interni-28.jpg",
    "/images/thumbs/esterni-1.jpg",
    "/images/thumbs/esterni-2.jpg",
    "/images/thumbs/esterni-3.jpg",
    "/images/thumbs/meeting-1.jpg",
    "/images/thumbs/meeting-14.jpg",
    "/images/thumbs/dettaglio-5.jpg",
    "/images/thumbs/camera-3.jpg",
    "/images/thumbs/camera-4.jpg",
    "/images/thumbs/camera-7.jpg",
    "/images/thumbs/camera-63.jpg",
    "/images/thumbs/camera-75.jpg",
    "/images/thumbs/camera-78.jpg",
]

REPLACEMENTS = [
    ("<html lang=\"en-US\"", "<html lang=\"it\""),
    ("<title>HomePage - Units</title>", "<title>OMAMA Social Hotel · Aosta</title>"),
    ("https://units.gr/book", "https://book.blastness.com/results?lingua_int=ita&id_albergo=21301&dc=6913&id_stile="),
    ("Book your Unit", "Prenota"),
    ("Book your unit", "Prenota"),
    ("Student Homes", "Camere"),
    ("Our way of living ", "Omama"),
    ("Our way of living", "Omama"),
    ("https://units.gr/en/our-way-of-living/", "/en/living/index.html"),
    ("https://units.gr/en/community/", "/en/omamamood/index.html"),
    ("https://units.gr/en/contact/", "/en/aosta/index.html"),
    ("https://units.gr/en/unit/units-parkside/", "/en/camere/index.html"),
    ("https://units.gr/en/unit/units-theatro/", "/en/camere/index.html"),
    ("https://units.gr/en/faqs/", "/en/aosta/index.html"),
    ("https://units.gr/en/privacy-policy/", "/en/demo/index.html"),
    ("https://units.gr/en/cookies-policy/", "/en/demo/index.html"),
    ("Home of the uniquely awesome.", "O M A M A"),
    (
        "All-inclusive student accommodation with everything you need to live, study and connect.",
        "Un hotel in città, disegnato una camera alla volta.",
    ),
    (">Locations<", ">Hotel<"),
    ("Where your everyday    <br />\njust works", "Un suono affettivo,    <br />\nnel centro di Aosta"),
    (
        "Wake up, step out, you’re there. Campus, classes, nights out &#8211; all within easy reach. No time wasted. Because at Units, location isn’t random. It’s chosen to match your rhythm and make life work better.",
        "Condivisione, libertà, tecnologia. Non è un 4 stelle di montagna classico: è un social hotel, colorato, urbano, con le Alpi dietro la facciata.",
    ),
    ("Explore what’s", "Via Torino 14"),
    ("Coming soon", "Apri la mappa"),
    ("Move-in ready!", "Apri la mappa"),
    ("All-Inclusive Living", "Omama"),
    ("One Unit.  <br />\nAn entire universe.", "Camere tue.<br />\nVita condivisa."),
    ("Your rent covers everything", "Tutto incluso nello spirito"),
    (
        "Each unit is its own universe, combining spaces and services for effortless, all-inclusive student living. Everything is included in your rent. No hidden fees, no surprises. Fully equipped, design-led spaces that let your everyday flow, your way.",
        "Ogni camera è unica. Tavoli lunghi, check-in dal telefono, LED wall. L’ospitalità qui è un atto collettivo.",
    ),
    ("Community living spaces", "Tavoli lunghi"),
    ("Open access, 24/7", "Aperto, sempre"),
    ("Fully equipped gym", "Colazione condivisa"),
    ("Self-service laundry room", "Lounge da salotto"),
    (">Social areas<", ">Tavoli sociali<"),
    ("Security ", "Libertà"),
    ("Day and night", "Ospite, non protocollo"),
    ("24/7 CCTV Surveillance", "Check-in dal telefono"),
    ("7/7 Night patrol", "Niente badge da hotel"),
    ("High-security entrance door with electronic lock", "Arredi da portare a casa"),
    ("Smart and secure access control", "Niente badge da hotel"),
    (">Support<", ">Tecnologia<"),
    ("We’ve got you covered", "Calore operativo"),
    ("24/7 Resident support", "Domotica"),
    ("Check-in & Onboarding assistance", "LED wall"),
    ("Fast request handling", "Tavoli hi-tech"),
    ("Fast maintenance support", "Wi-Fi"),
    ("Continuous experience improvements", "Smart TV"),
    ("Smart Living ", "Speciazione"),
    ("Designed for everyday ease", "Disegnata da Margaroli"),
    ("Digital mobile key", "Sette carte da parati"),
    ("Shared spaces reservations  ", "750 m² di facciata"),
    ("Maintenance ticketing system", "Ogni camera un disegno"),
    ("Laundry – EasyPay", "Velluti e legno di pero"),
    ("Digital intercom", "Ta Fata"),
    ("Private kitchen & bathroom", "Camere uniche"),
    ("24/7 Security ", "Check-in dal telefono"),
    ("Fast and reliable maintenance", "Arte in facciata"),
    ("Smart living", "Social hotel"),
    ("Super-fast WiFi", "Wi-Fi"),
    ("24/7 Hot water ", "Domotica"),
    ("Electric bike stations", "LED wall"),
    ("Elevator access", "Pila a 8 minuti"),
    ("Our Units", "Camere"),
    ("Student living,   <br />\nredefined.", "Sei tipologie   <br />\ndi camera."),
    (
        "A new concept in student living – fully furnished, move-in ready units designed for comfort and ease. Units is more than just a place to stay; it’s a place to belong. Join a vibrant community and experience student living like never before.",
        "Chicco Margaroli ha disegnato ogni camera. Non è una griglia di comfort: sono stanze disegnate una a una.",
    ),
    ("Fully furnished", "Camere arredate"),
    ("Private workspace", "Smart TV"),
    ("Private kitchen", "Climatizzazione"),
    ("Private bathroom", "Wi-Fi"),
    ("Air-Conditioning", "Domotica"),
    ("Super-Fast WiFi", "Carte da parati"),
    ("Balcony", "Centro Aosta"),
    ("Check out our Units", "Tutte le camere"),
    ("A shared way \nof living", "Un atelier aperto."),
    (
        "At Units, community happens naturally. Through common spaces, shared moments, and experiences that bring people together &#8211; with the freedom to join in whenever and however you want.",
        "OMAMAMOOD. Arte, design e ospitalità. Laboratorio di Chicco Margaroli.",
    ),
    ("Join our community", "Entra nel laboratorio"),
    ("What defines us", "Cosa ci definisce"),
    ("For People", "Per le persone"),
    (
        "Everything starts with how it feels to live here. From private spaces to shared experiences, people always come first.",
        "Tavoli lunghi, colazione mai da soli, lounge che si comportano come un salotto di città.",
    ),
    ("By Design", "Per disegno"),
    (
        "Nothing is accidental. Every detail is designed to support the way you live and the way you feel, every day.",
        "Niente è accidentale. Margaroli ha disegnato camere, facciate, velluti. Ogni dettaglio tiene.",
    ),
    ("With Care", "Con cura"),
    (
        "At the heart of everything we do. We care for the people who live here, the spaces we create, and the city we’re part of.",
        "Ci occupiamo di chi dorme qui, degli spazi che abitiamo e della città di cui siamo pezzo.",
    ),
    ("Staying connected", "Resta connesso"),
    (">Instagram<", ">Hotel<"),
    (">Community<", ">OMAMAMOOD<"),
    (">Contact<", ">Aosta<"),
    (">Athens<", ">Rooftop Suite<"),
    ("Units Parkside", "Junior Suite"),
    (">Piraeus<", ">Family<"),
    ("Units Theatro", "Standard Plus"),
    ("© 2026 KORPO Development", "Via Torino 14 · Aosta"),
    (
        ' Web design by <a href="../../../www.bighorrorathens.com/index.html" target="_blank">Big Horror.</a> Code by <a href="https://lemonjelly.gr/" target="_blank">Lemonjelly</a>',
        ' Demo indipendente. Prenotazioni su <a href="https://book.blastness.com/results?lingua_int=ita&id_albergo=21301&dc=6913&id_stile=">motore di prenotazione</a></span>\n<span class="d-block f-a-14-120-b mt-10"><a class="omama-credit" href="https://michelbranche.it" target="_blank" rel="noopener">Website &amp; Design By <span class="omama-credit-name">Michel branche</span></a>',
    ),
    ("../../../cdn.jsdelivr.net/", "/cdn.jsdelivr.net/"),
    ("../../../cdnjs.cloudflare.com/", "/cdnjs.cloudflare.com/"),
    ("https://units.gr/wp-content/themes/units/public/dist/images/lottie/units_icon_home.json", "/wp-content/themes/units/public/dist/images/lottie/units_icon_home.json"),
    ("https://www.facebook.com/units.gr", "https://www.omamahotel.com/"),
    ("https://www.tiktok.com/@units.gr", "https://www.omamahotel.com/"),
    ("../../../www.instagram.com/units.gr/index.html", "https://www.omamahotel.com/"),
    ("../../../www.facebook.com/units.18.delayed", "https://www.omamahotel.com/"),
    ("../../../www.tiktok.com/%40units.19.delayed", "https://www.omamahotel.com/"),
    ('href="index.html"', 'href="/en/homepage/index.html"'),
    ('href="https://units.gr/"', 'href="/en/homepage/index.html"'),
]

SVGS = {
    "https://units.gr/wp-content/uploads/2026/01/mdi_living-room-outline-1.svg": "/wp-content/uploads/omama-ui/mdi_living-room-outline-1.svg",
    "https://units.gr/wp-content/uploads/2026/01/streamline_workspace-desk-1.svg": "/wp-content/uploads/omama-ui/streamline_workspace-desk-1.svg",
    "https://units.gr/wp-content/uploads/2026/01/noun-kitchen-6600449-1-1.svg": "/wp-content/uploads/omama-ui/noun-kitchen-6600449-1-1.svg",
    "https://units.gr/wp-content/uploads/2026/01/iconoir_bathroom-1.svg": "/wp-content/uploads/omama-ui/iconoir_bathroom-1.svg",
    "https://units.gr/wp-content/uploads/2026/01/hugeicons_tv-smart-1.svg": "/wp-content/uploads/omama-ui/hugeicons_tv-smart-1.svg",
    "https://units.gr/wp-content/uploads/2026/01/mynaui_air-conditioner-1.svg": "/wp-content/uploads/omama-ui/mynaui_air-conditioner-1.svg",
    "https://units.gr/wp-content/uploads/2026/01/humbleicons_wifi-1.svg": "/wp-content/uploads/omama-ui/humbleicons_wifi-1.svg",
    "https://units.gr/wp-content/uploads/2026/01/material-symbols-light_balcony-rounded-1.svg": "/wp-content/uploads/omama-ui/material-symbols-light_balcony-rounded-1.svg",
    "https://units.gr/wp-content/uploads/2026/05/people.svg": "/wp-content/uploads/omama-ui/people.svg",
    "https://units.gr/wp-content/uploads/2026/04/home-pencil-1.svg": "/wp-content/uploads/omama-ui/home-pencil-1.svg",
    "https://units.gr/wp-content/uploads/2026/04/home-Hart-1.svg": "/wp-content/uploads/omama-ui/home-Hart-1.svg",
    "https://units.gr/wp-content/uploads/2026/01/insta.svg": "/wp-content/uploads/omama-ui/insta.svg",
    "https://units.gr/wp-content/uploads/2026/01/facebook.svg": "/wp-content/uploads/omama-ui/facebook.svg",
    "https://units.gr/wp-content/uploads/2026/01/tiktok.svg": "/wp-content/uploads/omama-ui/tiktok.svg",
}

OMAMA_LOGO = OMAMA_MARK

HEAD_EXTRA = """<link rel="stylesheet" href="/omama-overrides.css" />
"""


def strip_script_by_id(html: str, script_id: str) -> str:
    return re.sub(
        rf'<script[^>]*id="{re.escape(script_id)}"[^>]*>[\s\S]*?</script>',
        "",
        html,
        count=1,
    )


def strip_external_script_by_id(html: str, script_id: str) -> str:
    return re.sub(rf'<script[^>]*id="{re.escape(script_id)}"[^>]*></script>', "", html)


def main() -> None:
    html = SRC.read_text(encoding="utf-8", errors="ignore")

    for old, new in REPLACEMENTS:
        html = html.replace(old, new)
    html = flatten_camere_nav(html)
    html = reorder_main_nav(html)
    html = html.replace(
        '<li id="menu-item-808" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-808"><a href="/en/demo/index.html">',
        '<li id="menu-item-808" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-808"><a href="/en/demo/index.html" target="_blank" rel="noopener">',
    )
    html = html.replace(
        '<li id="menu-item-807" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-807"><a href="/en/demo/index.html">',
        '<li id="menu-item-807" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-807"><a href="/en/demo/index.html" target="_blank" rel="noopener">',
    )
    for old, new in SVGS.items():
        html = html.replace(old, new)

    html = html.replace(
        '<link rel=\'stylesheet\' id=\'app/0-css\' href=\'../../wp-content/cache/wpfc-minified/djjfayfp/fjkg6.css\' media=\'all\' />',
        '<link rel=\'stylesheet\' id=\'app/0-css\' href=\'../../wp-content/cache/wpfc-minified/djjfayfp/fjkg6.css\' media=\'all\' />\n'
        + HEAD_EXTRA,
    )

    # Hero photo
    html = html.replace(
        "https://units.gr/wp-content/uploads/2026/04/Header_Homepage-mobile.jpg",
        "/images/esterni-2.jpg",
    )
    html = re.sub(
        r'src="../../wp-content/uploads/2026/05/Lounge-Area\.jpg"',
        'src="/images/esterni-2.jpg"',
        html,
        count=1,
    )
    html = re.sub(
        r'srcset="https://units\.gr/wp-content/uploads/2026/05/Lounge-Area[^"]+"',
        'srcset="/images/esterni-2.jpg"',
        html,
        count=1,
    )

    living = [
        "/images/interni-1.jpg",
        "/images/interni-6.jpg",
        "/images/meeting-1.jpg",
        "/images/dettaglio-5.jpg",
    ]
    html = html.replace("../../wp-content/uploads/2026/04/1__Community_Living_Spaces.jpg", living[0])
    html = html.replace("../../wp-content/uploads/2026/01/2.-Security-e1777987828492.jpg", "/images/interni-6.jpg")
    html = html.replace("../../wp-content/uploads/2026/01/3.-Support-1-e1768497722592.jpg", "/images/meeting-1.jpg")
    html = html.replace("../../wp-content/uploads/2026/01/Asset-1%402x-100.jpg", "/images/dettaglio-5.jpg")
    html = html.replace("../../wp-content/uploads/2026/01/Asset-1@2x-100.jpg", "/images/dettaglio-5.jpg")

    html = html.replace("../../wp-content/uploads/2026/05/Community_1.jpg", "/images/dettaglio-5.jpg")
    html = html.replace("../../wp-content/uploads/2026/05/Community_2.jpg", "/images/interni-28.jpg")

    gallery_json = json.dumps(GALLERY).replace("/", r"\/")
    html = re.sub(r"data-image-urls='\[.*?\]'", f"data-image-urls='{gallery_json}'", html, count=1)

    html = html.replace(
        '<img width="3000" height="2001" src="/images/esterni-2.jpg" class=" " alt="" decoding="async" srcset="/images/esterni-2.jpg" sizes="(max-width: 3000px) 100vw, 3000px" />',
        '<img width="1920" height="1080" src="/images/esterni-2.jpg" class=" " alt="" decoding="async" fetchpriority="high" sizes="100vw" />',
    )
    html = re.sub(
        r'<picture class="x-picture image-wrap js-gallery-item"[^>]*>[\s\S]*?</picture>',
        '<div class="x-picture image-wrap omama-hero-media">\n'
        '<img class="omama-hero-poster" width="1920" height="1280" src="/images/interni-6.jpg?v=hero1" alt="" decoding="async" fetchpriority="high" />\n'
        "</div>",
        html,
        count=1,
    )
    html = html.replace('<img src="#" alt="" />', "")

    html = html.replace(
        '<span class="title d-block f-al-96-100 color-white">O M A M A</span>',
        '<span class="title d-block f-al-96-100 color-white js-color-button-fill" data-color="#AB54F7">\n'
        '<span data-i18n="O M A M A">O M A M A</span>\n'
        '<svg class="shape-overlays" viewBox="0 0 100 100" preserveAspectRatio="none">\n'
        '<path class="shape-overlays__path _1" fill="#FFB200"></path>\n'
        '<path class="shape-overlays__path _2" fill="#E6313A"></path>\n'
        '<path class="shape-overlays__path _3" fill="#267E6E"></path>\n'
        "</svg>\n"
        "</span>",
    )
    html = html.replace(
        '<span class="description d-block f-ab-32-110 text-center color-white">Un hotel in città, disegnato una camera alla volta.</span>',
        '<span class="description d-block f-ab-32-110 text-center color-white js-color-button-fill" data-color="#AB54F7">\n'
        '<span data-i18n="Un hotel in città, disegnato una camera alla volta.">Un hotel in città, disegnato una camera alla volta.</span>\n'
        '<svg class="shape-overlays" viewBox="0 0 100 100" preserveAspectRatio="none">\n'
        '<path class="shape-overlays__path _1" fill="#FFB200"></path>\n'
        '<path class="shape-overlays__path _2" fill="#E6313A"></path>\n'
        '<path class="shape-overlays__path _3" fill="#267E6E"></path>\n'
        "</svg>\n"
        "</span>",
    )

    # Header / footer wordmark: keep SVG geometry but user wants OMAMA — inject text mark after logo svg open is messy.
    # Replace entire header logo svg block with text.
    html = re.sub(
        r'(<a class="logo d-block" href="/en/homepage/index.html" aria-label="brand logo">)\s*<svg[\s\S]*?</svg>\s*</a>',
        rf'\1{HEADER_LOGO}</a>',
        html,
        count=1,
    )
    html = re.sub(
        r'(<a class="logo" href="/en/homepage/index.html" aria-label="brand footer logo">)\s*<svg[\s\S]*?</svg>\s*</a>',
        rf'\1{OMAMA_MARK}</a>',
        html,
        count=1,
    )
    html = apply_preloader(html)
    html = apply_langs(html)
    html = fix_prenota_link(html)
    html = inject_assets(html)

    # Drop tracker scripts by id (exact, not spanning body)
    for sid in [
        "cookieyes",
        "google_gtagjs-js-consent-mode-data-layer",
        "google_gtagjs-js",
        "google_gtagjs-js-after",
        "pys-version-script",
        "googlesitekit-consent-mode-js",
        "jquery-bind-first-js",
        "js-cookie-pys-js",
        "js-tld-js",
        "pys-js-extra",
        "pys-js",
        "inavii-social-feed-front-js",
        "react-js",
        "react-dom-js",
        "react-jsx-runtime-js",
    ]:
        html = strip_script_by_id(html, sid)
        html = strip_external_script_by_id(html, sid)

    # Remove GTM inline block only (from comment to matching end comment)
    html = re.sub(
        r"<!-- Google Tag Manager snippet added by Site Kit -->\s*<script>\s*\( function\( w, d, s, l, i \) \{[\s\S]*?</script>\s*<!-- End Google Tag Manager snippet added by Site Kit -->",
        "",
        html,
        count=1,
    )
    html = re.sub(
        r"<!-- Google tag \(gtag\.js\) consent mode dataLayer added by Site Kit -->\s*<script id=\"google_gtagjs-js-consent-mode-data-layer\">[\s\S]*?</script>\s*<!-- End Google tag \(gtag\.js\) consent mode dataLayer added by Site Kit -->",
        "",
        html,
        count=1,
    )

    # Replace instagram dump with photo strip (keeps section, drops megabyte JSON)
    insta_photos = "".join(
        f'<a class="shot" href="/en/camere/index.html"><img loading="lazy" src="{src}" alt="OMAMA" /></a>'
        for src in [
            "/images/esterni-3.jpg",
            "/images/interni-1.jpg",
            "/images/camera-3.jpg",
            "/images/dettaglio-5.jpg",
            "/images/camera-74.jpg",
        ]
    )
    html = re.sub(
        r'<div id="instafeed">[\s\S]*?</div>\s*</div>\s*</div>\s*</section>',
        f'<div id="instafeed" class="omama-shots">{insta_photos}</div></div></div></section>',
        html,
        count=1,
    )

    html = re.sub(
        r'var ajax_object = \{.*?\};',
        'var ajax_object = {"ajax_url":"/","theme_dir":"/wp-content/themes/units","ajax_nonce":"","upload_dir":"/images","instafeedConfig":{"accessToken":""},"checkout_links":{"policy":"/en/demo/index.html","terms":"/en/demo/index.html"},"checkout_menu":""};',
        html,
        count=1,
    )

    html = re.sub(r'\s+srcset="https://units\.gr[^"]*"', "", html)

    html = html.replace(
        '<button class="cta button background-black js-color-button-fill" data-event="click" data-event-action="modal-open" data-event-id="monday" data-color="#AB54F7">',
        '<a class="cta button background-black js-color-button-fill no-barba" href="https://book.blastness.com/results?lingua_int=ita&id_albergo=21301&dc=6913&id_stile=" data-omama-book="1" data-event="click" data-event-action="modal-open" data-event-id="monday" data-color="#AB54F7">',
    )
    html = html.replace(
        """</svg>
</button>
</div>
</section>
<section class="locations">""",
        """</svg>
</a>
</div>
</section>
<section class="locations">""",
        1,
    )

    html = re.sub(
        r'<div class="tags d-flex">[\s\S]*?</div>',
        '<div class="tags d-flex">\n<a class="tag d-block f-ab-16-120 color-black background-orange" href="/en/mappa/index.html" data-i18n="Apri la mappa">Apri la mappa</a>\n</div>',
        html,
        count=1,
    )

    html = re.sub(
        r'<div class="map js-map">[\s\S]*?</div>\s*</section>',
        '<div class="map" data-omama-map data-lat="45.736969" data-lng="7.325019" data-zoom="16" data-title="OMAMA"></div></section>',
        html,
        count=1,
    )

    html = re.sub(
        r'<!-- INAVII SOCIAL FEED START -->[\s\S]*?<!-- INAVII SOCIAL FEED END -->',
        "",
        html,
        count=1,
    )
    html = strip_script_by_id(html, "inavii-social-feed-front-js-before")
    html = strip_script_by_id(html, "pll_cookie_script-js-after")
    html = re.sub(r'<noscript><img height="1" width="1"[\s\S]*?</noscript>', "", html, count=1)
    html = re.sub(
        r"<!-- Google Tag Manager \(noscript\) snippet added by Site Kit -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) snippet added by Site Kit -->",
        "",
        html,
        count=1,
    )

    from omama_faqs import inject_homepage_faqs

    html = inject_homepage_faqs(html)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(html, encoding="utf-8")
    print("wrote", OUT, "bytes", OUT.stat().st_size)
    print("has body", "<body" in html, "has hero", 'class="hero"' in html, "has living", "living-track" in html)


if __name__ == "__main__":
    main()
