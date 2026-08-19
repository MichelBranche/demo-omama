"""Copy Units static site and swap OMAMA copy + photos."""
from __future__ import annotations

import json
import re
import shutil
import urllib.request
from pathlib import Path

ROOT = Path(r"c:\Users\miche\Desktop\demo-omama\web")
UNIT = Path(r"c:\Users\miche\Desktop\unit\units")
PUB = ROOT / "public"
SRC_HTML = UNIT / "units.gr" / "en" / "homepage" / "index.html"
OUT_HTML = PUB / "en" / "homepage" / "index.html"

FONT_FILES = [
    "AeonikPro/aeonikpro-regular.woff2",
    "AeonikPro/aeonikpro-regular.woff",
    "AeonikPro/aeonikpro-bold.woff2",
    "AeonikPro/aeonikpro-bold.woff",
    "Bunch/Bunch-Bold.woff2",
    "Bunch/Bunch-Bold.woff",
    "Bunch/Bunch-ExtraBold.woff",
    "Alfabet/Alfabet-Black.woff2",
    "Alfabet/Alfabet-ExtraBold.woff2",
]

LOTTIE = "https://units.gr/wp-content/themes/units/public/dist/images/lottie/units_icon_home.json"

SVGS = [
    "https://units.gr/wp-content/uploads/2026/01/mdi_living-room-outline-1.svg",
    "https://units.gr/wp-content/uploads/2026/01/streamline_workspace-desk-1.svg",
    "https://units.gr/wp-content/uploads/2026/01/noun-kitchen-6600449-1-1.svg",
    "https://units.gr/wp-content/uploads/2026/01/iconoir_bathroom-1.svg",
    "https://units.gr/wp-content/uploads/2026/01/hugeicons_tv-smart-1.svg",
    "https://units.gr/wp-content/uploads/2026/01/mynaui_air-conditioner-1.svg",
    "https://units.gr/wp-content/uploads/2026/01/humbleicons_wifi-1.svg",
    "https://units.gr/wp-content/uploads/2026/01/material-symbols-light_balcony-rounded-1.svg",
    "https://units.gr/wp-content/uploads/2026/05/people.svg",
    "https://units.gr/wp-content/uploads/2026/04/home-pencil-1.svg",
    "https://units.gr/wp-content/uploads/2026/04/home-Hart-1.svg",
    "https://units.gr/wp-content/uploads/2026/01/insta.svg",
    "https://units.gr/wp-content/uploads/2026/01/facebook.svg",
    "https://units.gr/wp-content/uploads/2026/01/tiktok.svg",
]


def copytree(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    if src.is_dir():
        shutil.copytree(src, dst, dirs_exist_ok=True)
    elif src.exists():
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dst)


def fetch(url: str, dest: Path) -> bool:
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as res:
            dest.write_bytes(res.read())
        print("ok", dest.name, dest.stat().st_size)
        return True
    except Exception as exc:
        print("fail", url, exc)
        return False


def copy_assets() -> None:
    copies = [
        (UNIT / "units.gr" / "wp-content" / "cache", PUB / "wp-content" / "cache"),
        (UNIT / "units.gr" / "wp-content" / "themes", PUB / "wp-content" / "themes"),
        (UNIT / "units.gr" / "wp-includes" / "js" / "jquery", PUB / "wp-includes" / "js" / "jquery"),
        (UNIT / "cdn.jsdelivr.net", PUB / "cdn.jsdelivr.net"),
        (UNIT / "cdnjs.cloudflare.com", PUB / "cdnjs.cloudflare.com"),
    ]
    for src, dst in copies:
        print("copy", src, "->", dst)
        copytree(src, dst)

    font_root = PUB / "wp-content" / "themes" / "units" / "public" / "dist" / "fonts"
    for rel in FONT_FILES:
        fetch("https://units.gr/wp-content/themes/units/public/dist/fonts/" + rel, font_root / rel)

    fetch(LOTTIE, PUB / "wp-content" / "themes" / "units" / "public" / "dist" / "images" / "lottie" / "units_icon_home.json")

    for url in SVGS:
        name = url.split("/")[-1]
        fetch(url, PUB / "wp-content" / "uploads" / "omama-ui" / name)


def patch_css_fonts() -> None:
    css_path = PUB / "wp-content" / "cache" / "wpfc-minified" / "djjfayfp" / "fjkg6.css"
    css = css_path.read_text(encoding="utf-8", errors="ignore")
    css = css.replace(
        "../../../themes/units/public/dist/fonts/AeonikPro/aeonikpro-regular.2e.delayed",
        "../../../themes/units/public/dist/fonts/AeonikPro/aeonikpro-regular.woff2",
    )
    css = css.replace("//units.gr/wp-content/themes/units/public/dist/fonts/", "../../../themes/units/public/dist/fonts/")
    css_path.write_text(css, encoding="utf-8")
    print("patched css fonts")


GALLERY = [
    "/images/camera-74.jpg",
    "/images/camera-79.jpg",
    "/images/camera-6.jpg",
    "/images/camera-66.jpg",
    "/images/camera-1.jpg",
    "/images/camera-16.jpg",
    "/images/interni-1.jpg",
    "/images/interni-6.jpg",
    "/images/interni-28.jpg",
    "/images/esterni-1.jpg",
    "/images/esterni-2.jpg",
    "/images/esterni-3.jpg",
    "/images/meeting-1.jpg",
    "/images/meeting-14.jpg",
    "/images/dettaglio-5.jpg",
    "/images/camera-3.jpg",
    "/images/camera-4.jpg",
    "/images/camera-7.jpg",
    "/images/camera-63.jpg",
    "/images/camera-75.jpg",
    "/images/camera-78.jpg",
]


def build_html() -> None:
    html = SRC_HTML.read_text(encoding="utf-8", errors="ignore")

    # Drop trackers / consent / analytics
    html = re.sub(r"<script id=\"cookieyes\"[\s\S]*?</script>", "", html, count=1)
    html = re.sub(r"<!-- Google tag[\s\S]*?<!-- End Google tag[\s\S]*?</script>", "", html)
    html = re.sub(r"<!-- Google Tag Manager[\s\S]*?<!-- End Google Tag Manager[\s\S]*?</script>", "", html)
    html = re.sub(r"<script id=\"google_gtagjs[\s\S]*?</script>", "", html)
    html = re.sub(r"<script id=\"pys-[\s\S]*?</script>", "", html)
    html = re.sub(r"<script[^>]*googlesitekit[\s\S]*?</script>", "", html)
    html = re.sub(r"<script id=\"jquery-bind-first-js\"[\s\S]*?</script>", "", html)
    html = re.sub(r"<script id=\"js-cookie-pys-js\"[\s\S]*?</script>", "", html)
    html = re.sub(r"<script id=\"js-tld-js\"[\s\S]*?</script>", "", html)
    html = re.sub(r"<script id=\"pys-js\"[\s\S]*?</script>", "", html)
    html = re.sub(r"<script id=\"inavii-social-feed-front-js\"[\s\S]*?</script>", "", html)
    html = re.sub(r"<script type='application/javascript'\s+id='pys-version-script'>[\s\S]*?</script>", "", html)

    html = html.replace("<html lang=\"en-US\"", "<html lang=\"it\"")
    html = html.replace("<title>HomePage - Units</title>", "<title>OMAMA Social Hotel · Aosta</title>")
    html = html.replace("content=\"HomePage - Units\"", "content=\"OMAMA Social Hotel · Aosta\"")

    # Booking / nav
    html = html.replace("https://units.gr/book", "https://www.omamahotel.com/")
    html = html.replace("https://units.gr/en/homepage/", "/")
    html = html.replace("href=\"index.html\"", "href=\"/en/homepage/index.html\"")
    html = html.replace("Book your Unit", "Prenota")
    html = html.replace("Book your unit", "Prenota")

    html = html.replace("Student Homes", "Camere")
    html = html.replace("Our way of living", "Omama")
    html = html.replace("Our way of living ", "Omama")
    html = html.replace(">Community<", ">OMAMAMOOD<")
    html = html.replace(">Contact<", ">Aosta<")

    html = html.replace("https://units.gr/en/our-way-of-living/", "/omamamood")
    html = html.replace("https://units.gr/en/community/", "/omamamood")
    html = html.replace("https://units.gr/en/contact/", "/aosta")
    html = html.replace("https://units.gr/en/unit/units-parkside/", "/camere")
    html = html.replace("https://units.gr/en/unit/units-theatro/", "/camere")
    html = html.replace("https://units.gr/en/faqs/", "/aosta")
    html = html.replace("https://units.gr/en/privacy-policy/", "/en/demo/index.html")
    html = html.replace("https://units.gr/en/cookies-policy/", "/en/demo/index.html")

    # Hero
    html = html.replace("Home of the uniquely awesome.", "O M A M A")
    html = html.replace(
        "All-inclusive student accommodation with everything you need to live, study and connect.",
        "Un hotel in città, disegnato una camera alla volta.",
    )

    # Locations
    html = html.replace(">Locations<", ">Hotel<")
    html = html.replace("Where your everyday    <br />\njust works", "Un suono affettivo,    <br />\nnel centro di Aosta")
    html = html.replace(
        "Wake up, step out, you’re there. Campus, classes, nights out &#8211; all within easy reach. No time wasted. Because at Units, location isn’t random. It’s chosen to match your rhythm and make life work better.",
        "Condivisione, libertà, tecnologia. Non è un 4 stelle di montagna classico: è un social hotel, colorato, urbano, con le Alpi dietro la facciata.",
    )
    html = html.replace("Explore what’s", "Via Torino 14")
    html = html.replace("Coming soon", "Centro storico")
    html = html.replace("Move-in ready!", "Pila 8 min")

    # Living
    html = html.replace("All-Inclusive Living", "Omama")
    html = html.replace("One Unit.  <br />\nAn entire universe.", "Camere tue.<br />\nVita condivisa.")
    html = html.replace("Your rent covers everything", "Tutto incluso nello spirito")
    html = html.replace(
        "Each unit is its own universe, combining spaces and services for effortless, all-inclusive student living. Everything is included in your rent. No hidden fees, no surprises. Fully equipped, design-led spaces that let your everyday flow, your way.",
        "Ogni camera è unica. Tavoli lunghi, check-in dal telefono, LED wall. L’ospitalità qui è un atto collettivo. Nessun protocollo da brochure: si vive insieme.",
    )
    html = html.replace("Community living spaces", "Tavoli lunghi")
    html = html.replace("Open access, 24/7", "Aperto, sempre")
    html = html.replace("Fully equipped gym", "Colazione condivisa")
    html = html.replace("Self-service laundry room", "Lounge da salotto")
    html = html.replace(">Social areas<", ">Tavoli sociali<")
    html = html.replace("Security ", "Libertà")
    html = html.replace("Day and night", "Ospite, non protocollo")
    html = html.replace("24/7 CCTV Surveillance", "Check-in dal telefono")
    html = html.replace("7/7 Night patrol", "Niente badge da hotel")
    html = html.replace("High-security entrance door with electronic lock", "Arredi da portare a casa")
    html = html.replace("Smart and secure access control", "Niente badge da hotel")
    html = html.replace(">Support<", ">Tecnologia<")
    html = html.replace("We’ve got you covered", "Calore operativo")
    html = html.replace("24/7 Resident support", "Domotica")
    html = html.replace("Check-in & Onboarding assistance", "LED wall")
    html = html.replace("Fast request handling", "Tavoli hi-tech")
    html = html.replace("Fast maintenance support", "Wi-Fi")
    html = html.replace("Continuous experience improvements", "Smart TV")
    html = html.replace("Smart Living ", "Speciazione")
    html = html.replace("Designed for everyday ease", "Disegnata da Margaroli")
    html = html.replace("Digital mobile key", "Sette carte da parati")
    html = html.replace("Shared spaces reservations", "750 m² di facciata")
    html = html.replace("Maintenance ticketing system", "Ogni camera un disegno")
    html = html.replace("Laundry – EasyPay", "Velluti e legno di pero")
    html = html.replace("Digital intercom", "Ta Fata")

    # Marquees
    html = html.replace("Private kitchen & bathroom", "Camere uniche")
    html = html.replace("24/7 Security", "Check-in dal telefono")
    html = html.replace("Fast and reliable maintenance", "Arte in facciata")
    html = html.replace("Smart living", "Social hotel")
    html = html.replace("Super-fast WiFi", "Wi-Fi")
    html = html.replace("24/7 Hot water", "Domotica")
    html = html.replace("Electric bike stations", "LED wall")
    html = html.replace("Elevator access", "Pila a 8 minuti")

    # Typical unit
    html = html.replace("Our Units", "Camere")
    html = html.replace("Student living,   <br />\nredefined.", "Sei tipologie   <br />\ndi camera.")
    html = html.replace(
        "A new concept in student living – fully furnished, move-in ready units designed for comfort and ease. Units is more than just a place to stay; it’s a place to belong. Join a vibrant community and experience student living like never before.",
        "Chicco Margaroli ha disegnato ogni camera. Non è una griglia di comfort: sono stanze disegnate una a una.",
    )
    html = html.replace("Fully furnished", "Camere arredate")
    html = html.replace("Private workspace", "Smart TV")
    html = html.replace("Private kitchen", "Climatizzazione")
    html = html.replace("Private bathroom", "Wi-Fi")
    html = html.replace("Air-Conditioning", "Domotica")
    html = html.replace("Super-Fast WiFi", "Carte da parati")
    html = html.replace("Balcony", "Centro Aosta")
    html = html.replace("Check out our Units", "Tutte le camere")

    # Community
    html = html.replace("A shared way \nof living", "Un atelier aperto.")
    html = html.replace(
        "At Units, community happens naturally. Through common spaces, shared moments, and experiences that bring people together &#8211; with the freedom to join in whenever and however you want.",
        "OMAMAMOOD. Arte, design e ospitalità. Laboratorio di Chicco Margaroli.",
    )
    html = html.replace("Join our community", "Entra nel laboratorio")

    html = html.replace("What defines us", "Cosa ci definisce")
    html = html.replace("For People", "Per le persone")
    html = html.replace(
        "Everything starts with how it feels to live here. From private spaces to shared experiences, people always come first.",
        "Tavoli lunghi, colazione mai da soli, lounge che si comportano come un salotto di città.",
    )
    html = html.replace("By Design", "Per disegno")
    html = html.replace(
        "Nothing is accidental. Every detail is designed to support the way you live and the way you feel, every day.",
        "Niente è accidentale. Margaroli ha disegnato camere, facciate, velluti. Ogni dettaglio tiene.",
    )
    html = html.replace("With Care", "Con cura")
    html = html.replace(
        "At the heart of everything we do. We care for the people who live here, the spaces we create, and the city we’re part of.",
        "Ci occupiamo di chi dorme qui, degli spazi che abitiamo e della città di cui siamo pezzo.",
    )

    html = html.replace("Staying connected", "Resta connesso")
    html = html.replace(">Instagram<", ">Hotel<")
    html = html.replace("English", "Italiano")
    html = html.replace("Ελληνικά", "Aosta")

    html = html.replace("© 2026 KORPO Development", "Via Torino 14 · Aosta")
    html = html.replace(
        " Web design by <a href=\"../../../www.bighorrorathens.com/index.html\" target=\"_blank\">Big Horror.</a> Code by <a href=\"https://lemonjelly.gr/\" target=\"_blank\">Lemonjelly</a>",
        " Demo indipendente. Prenotazioni su <a href=\"https://www.omamahotel.com/\" target=\"_blank\">omamahotel.com</a>",
    )

    # CTA: don't open empty svelte modal
    html = html.replace(' data-event="click" data-event-action="modal-open" data-event-id="monday"', "")
    html = html.replace('class="d-none d-md-block open-modal-btn button background-purple-dark js-color-button-fill"', 'class="d-none d-md-block open-modal-btn button background-purple-dark js-color-button-fill" href="https://www.omamahotel.com/"')
    html = re.sub(
        r"<button class=\"d-none d-md-block open-modal-btn button background-purple-dark js-color-button-fill\"([^>]*)>",
        r'<a class="d-none d-md-block open-modal-btn button background-purple-dark js-color-button-fill" href="https://www.omamahotel.com/"\1>',
        html,
        count=1,
    )
    html = html.replace(
        "</svg>\n</button>\n<a data-lang=\"en-US\"",
        "</svg>\n</a>\n<a data-lang=\"en-US\"",
        1,
    )

    # Hero / living / community images
    html = re.sub(
        r'<source media="\(max-width:768px\)" srcset="https://units\.gr/wp-content/uploads/[^"]+">',
        '<source media="(max-width:768px)" srcset="/images/esterni-2.jpg">',
        html,
        count=1,
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

    living_imgs = [
        "/images/interni-1.jpg",
        "/images/interni-6.jpg",
        "/images/meeting-1.jpg",
        "/images/dettaglio-5.jpg",
    ]
    living_pat = re.compile(r'<div class="item swiper-slide">\s*<div class="image-wrap">\s*<img[^>]+>')

    def living_sub(match: re.Match[str], i=[0]):
        idx = i[0]
        i[0] += 1
        src = living_imgs[idx % len(living_imgs)]
        return match.group(0).split("<img")[0] + f'<img src="{src}" alt="" />'

    html = living_pat.sub(living_sub, html)

    html = re.sub(
        r'src="../../wp-content/uploads/2026/05/Community_1\.jpg"',
        'src="/images/dettaglio-5.jpg"',
        html,
        count=1,
    )
    html = re.sub(
        r'srcset="https://units\.gr/wp-content/uploads/2026/05/Community_1[^"]+"',
        'srcset="/images/dettaglio-5.jpg"',
        html,
        count=1,
    )
    html = re.sub(
        r'src="../../wp-content/uploads/2026/05/Community_2\.jpg"',
        'src="/images/interni-28.jpg"',
        html,
        count=1,
    )
    html = re.sub(
        r'srcset="https://units\.gr/wp-content/uploads/2026/05/Community_2[^"]+"',
        'srcset="/images/interni-28.jpg"',
        html,
        count=1,
    )

    gallery_json = json.dumps(GALLERY).replace("/", r"\/")
    html = re.sub(r"data-image-urls='\[.*?\]'", f"data-image-urls='{gallery_json}'", html, count=1)

    # UI svgs local
    for url in SVGS:
        name = url.split("/")[-1]
        html = html.replace(url, "/wp-content/uploads/omama-ui/" + name)

    html = html.replace(
        "https://units.gr/wp-content/themes/units/public/dist/images/lottie/units_icon_home.json",
        "/wp-content/themes/units/public/dist/images/lottie/units_icon_home.json",
    )

    # Language links -> stay on site
    html = html.replace('href="https://units.gr/"', 'href="/aosta"')

    # Social
    html = html.replace("../../../www.instagram.com/units.gr/index.html", "https://www.omamahotel.com/")
    html = html.replace("https://www.facebook.com/units.gr", "https://www.omamahotel.com/")
    html = html.replace("https://www.tiktok.com/@units.gr", "https://www.omamahotel.com/")
    html = html.replace("../../../www.facebook.com/units.18.delayed", "https://www.omamahotel.com/")
    html = html.replace("../../../www.tiktok.com/%40units.19.delayed", "https://www.omamahotel.com/")

    # Nav submenu leftover "Athens" etc
    html = html.replace(">Athens<", ">Rooftop Suite<")
    html = html.replace("Units Parkside", "Junior Suite")
    html = html.replace(">Piraeus<", ">Family<")
    html = html.replace("Units Theatro", "Standard Plus")

    OUT_HTML.parent.mkdir(parents=True, exist_ok=True)
    OUT_HTML.write_text(html, encoding="utf-8")
    print("wrote", OUT_HTML, "bytes", OUT_HTML.stat().st_size)


if __name__ == "__main__":
    copy_assets()
    patch_css_fonts()
    build_html()
    print("done")
