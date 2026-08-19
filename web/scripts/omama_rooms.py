"""OMAMA room tabs for the Camere page (Units meet-units markup)."""
from __future__ import annotations

import re

ARROW_SVG = """<svg width="26" height="26" viewBox="0 0 26 26" fill="none">
<g clip-path="url(#clip0_4122_412)">
<path d="M15.702 8.33621L6.16911 8.33621L6.19039 5.79028L19.8087 5.79028L19.8087 20.2097L17.4043 20.2322L17.4043 10.1386L7.04154 21.1109L5.33924 19.3085L15.702 8.33621Z" fill="black" />
</g>
<defs>
<clipPath id="clip0_4122_412">
<rect width="26" height="26" fill="white" transform="translate(26 1.1365e-06) rotate(90)" />
</clipPath>
</defs>
</svg>"""

SWIPER_CTRL = """<div class="swiper-controls">
<button type="button" class="button-next button">
<svg width="25" height="25" viewBox="0 0 25 25" fill="none">
<path d="M17.6701 11.5044L11.5125 4.9846L13.2675 3.35466L22.064 12.6686L12.2022 21.9825L10.6336 20.3526L17.5369 13.8328L3.3391 13.8328L3.47227 11.5044L17.6701 11.5044Z" fill="black" />
</svg>
</button>
<button type="button" class="button-prev button">
<svg width="25" height="25" viewBox="0 0 25 25" fill="none">
<path d="M7.50774 13.3938L13.6653 19.9136L11.9103 21.5435L3.11382 12.2296L12.9756 2.91562L14.5442 4.54556L7.64091 11.0653L21.8387 11.0653L21.7056 13.3938L7.50774 13.3938Z" fill="black" />
</svg>
</button>
</div>"""

CHECK_SVG = """<svg width="44" height="44" viewBox="0 0 44 44" fill="none">
<rect x="2" y="2" width="40" height="40" rx="20" fill="#00AA3C" />
<rect x="2" y="2" width="40" height="40" rx="20" stroke="#F4E9E1" stroke-width="4" />
<path fill-rule="evenodd" clip-rule="evenodd"
d="M28.2965 14.8512C28.4825 14.7393 28.7047 14.7038 28.9163 14.7522C29.1279 14.8006 29.3126 14.929 29.4315 15.1106L30.2626 16.3783C30.371 16.5439 30.4173 16.7424 30.3935 16.9389C30.3697 17.1353 30.2773 17.3171 30.1325 17.452L30.13 17.4554L30.1182 17.4663L30.0704 17.5108L29.8815 17.6913C28.8364 18.7051 27.8229 19.7511 26.8425 20.8277C24.9981 22.8559 22.8078 25.5104 21.3336 28.0861C20.9223 28.8047 19.9174 28.9591 19.3213 28.3388L13.8771 22.6821C13.7991 22.601 13.7382 22.5051 13.698 22.4C13.6578 22.2949 13.6391 22.1828 13.6431 22.0703C13.6471 21.9578 13.6737 21.8473 13.7212 21.7453C13.7688 21.6434 13.8363 21.552 13.9199 21.4766L15.5654 19.9924C15.71 19.862 15.8954 19.7859 16.0899 19.7772C16.2844 19.7685 16.4758 19.8276 16.6315 19.9445L19.4095 22.0273C23.7489 17.7484 26.2095 16.1063 28.2965 14.8512Z"
fill="#F4E9E1" />
</svg>"""

BOOK_SVG = """<svg class="arrow" width="18" height="18" viewBox="0 0 18 18" fill="none">
<g clip-path="url(#clip0_4122_440)">
<path d="M10.8705 6.83367L4.27087 6.83366L4.2856 5.0711L13.7137 5.0711L13.7137 15.0538L12.049 15.0694L12.049 8.0815L4.87486 15.6777L3.69635 14.4299L10.8705 6.83367Z" fill="black" />
</g>
<defs>
<clipPath id="clip0_4122_440">
<rect width="18" height="18" fill="white" transform="translate(18) rotate(90)" />
</clipPath>
</defs>
</svg>
<svg class="shape-overlays" viewBox="0 0 100 100" preserveAspectRatio="none">
<path class="shape-overlays__path _1" fill="#FFB200"></path>
<path class="shape-overlays__path _2" fill="#E6313A"></path>
<path class="shape-overlays__path _3" fill="#267E6E"></path>
</svg>"""

PHONE_SVG = """<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
<path d="M15.75 12C15.75 11.625 12.375 10.125 12 10.125C11.25 10.125 10.5 11.25 9.75 11.625C9 12 8.25 11.25 7.5 10.5C7.2075 10.2075 6 9 6.375 8.25C6.75 7.5 7.875 6.75 7.875 6C7.875 5.625 6.375 2.25 6 2.25C4.5 2.25 3.375 3.375 3 4.5C2.625 5.625 2.625 6.375 3 7.875C3.375 9.375 3.75 10.5 5.625 12.375C7.5 14.25 8.625 14.625 10.125 15C11.625 15.375 12.375 15.375 13.5 15C14.625 14.625 15.75 13.5 15.75 12Z" fill="black" stroke="black" stroke-width="1.5" stroke-linecap="round"
stroke-linejoin="round" />
<path d="M12.72 7.5C12.4875 7.005 12.1725 6.555 11.79 6.18C11.4225 5.8125 10.98 5.505 10.5 5.28" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
<path d="M15.5625 6.75C15.285 5.6925 14.7375 4.7475 13.9875 3.9975C13.2375 3.255 12.3 2.7075 11.25 2.4375" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>"""

ICONS = {
    "bed": "/wp-content/uploads/2026/01/solar_bed-broken.svg",
    "bed2": "/wp-content/uploads/2026/01/solar_bed-broken1.svg",
    "bath": "/wp-content/uploads/2026/01/iconoir_bathroom.svg",
    "wifi": "/wp-content/uploads/2026/01/humbleicons_wifi.svg",
    "tv": "/wp-content/uploads/2026/01/hugeicons_tv-smart.svg",
    "ac": "/wp-content/uploads/2026/01/mynaui_air-conditioner.svg",
    "desk": "/wp-content/uploads/2026/01/streamline_workspace-desk.svg",
    "living": "/wp-content/uploads/2026/01/mdi_living-room-outline.svg",
    "balcony": "/wp-content/uploads/2026/01/material-symbols-light_balcony-rounded.svg",
}

# Only camera-*.jpg that belong to that category.
# Excluded on purpose: esterni, interni, meeting, dettaglio,
# camera-63 (bagni a tre lavabi, non è una camera),
# camera-78 (dettaglio tessera, non è una camera).
ROOMS = [
    {
        "name": "Standard Cozy",
        "meta": "22 m² · 2 ospiti",
        "species": "Tana",
        "lead": "La tana urbana. Compatta, calda, con la stessa carta da parati che rende unica ogni camera.",
        "thumb": "/images/thumbs/camera-16.jpg",
        "photos": ["/images/camera-16.jpg"],
        "next": (1, "Standard View"),
        "amenities": [
            ("bed", "22 m²"),
            ("bed2", "2 ospiti"),
            ("bath", "Bagno privato"),
            ("wifi", "Wi-Fi"),
            ("tv", "Smart TV"),
            ("ac", "Climatizzazione"),
        ],
    },
    {
        "name": "Standard View",
        "meta": "19–22 m² · 2 ospiti",
        "species": "Vetta",
        "lead": "Due persone, una vista. Montagna o centro, a seconda della finestra che ti capita.",
        "thumb": "/images/thumbs/camera-1.jpg",
        "photos": ["/images/camera-1.jpg", "/images/camera-3.jpg"],
        "next": (2, "Standard Plus"),
        "amenities": [
            ("bed", "19–22 m²"),
            ("bed2", "2 ospiti"),
            ("living", "Vista"),
            ("bath", "Bagno privato"),
            ("wifi", "Wi-Fi"),
            ("tv", "Smart TV"),
            ("ac", "Climatizzazione"),
        ],
    },
    {
        "name": "Standard Plus",
        "meta": "23–30 m² · 5 ospiti",
        "species": "Mosaico",
        "lead": "La misura più elastica. Colore pieno, comfort smart, per leisure e lavoro nello stesso letto.",
        "thumb": "/images/thumbs/camera-66.jpg",
        "photos": ["/images/camera-66.jpg"],
        "next": (3, "Family"),
        "amenities": [
            ("bed", "23–30 m²"),
            ("bed2", "5 ospiti"),
            ("bath", "Bagno privato"),
            ("desk", "Angolo lavoro"),
            ("wifi", "Wi-Fi"),
            ("tv", "Smart TV"),
            ("ac", "Climatizzazione"),
        ],
    },
    {
        "name": "Family",
        "meta": "30 m² · 5 ospiti",
        "species": "Nido",
        "lead": "Spazio per chi viaggia in famiglia. Stesso disegno artistico, più metri per i giochi.",
        "thumb": "/images/thumbs/camera-6.jpg",
        "photos": ["/images/camera-6.jpg", "/images/camera-7.jpg", "/images/camera-4.jpg"],
        "next": (4, "Junior Suite"),
        "amenities": [
            ("bed", "30 m²"),
            ("bed2", "5 ospiti"),
            ("living", "Più spazio"),
            ("bath", "Bagno privato"),
            ("wifi", "Wi-Fi"),
            ("tv", "Smart TV"),
            ("ac", "Climatizzazione"),
        ],
    },
    {
        "name": "Junior Suite",
        "meta": "33 m² · 5 ospiti",
        "species": "Manto",
        "lead": "Vibrazioni chiare dal lato sud. Legno di pero, velluto, un’unica stanza che si comporta da suite.",
        "thumb": "/images/thumbs/camera-79.jpg",
        "photos": ["/images/camera-79.jpg"],
        "next": (5, "Rooftop Suite"),
        "amenities": [
            ("bed", "33 m²"),
            ("bed2", "5 ospiti"),
            ("bath", "Bagno privato"),
            ("desk", "Legno di pero"),
            ("wifi", "Wi-Fi"),
            ("tv", "Smart TV"),
            ("ac", "Climatizzazione"),
        ],
    },
    {
        "name": "Rooftop Suite",
        "meta": "70 m² · 8 ospiti",
        "species": "Aria",
        "lead": "Aria e libertà. Un attico verso Emilius e Pila, sauna privata, velluti e pannelli Margaroli.",
        "thumb": "/images/thumbs/camera-74.jpg",
        "photos": ["/images/camera-74.jpg", "/images/camera-75.jpg", "/images/camera-39.jpg"],
        "next": None,
        "amenities": [
            ("bed", "70 m²"),
            ("bed2", "8 ospiti"),
            ("living", "Sauna privata"),
            ("balcony", "Attico"),
            ("bath", "Bagno privato"),
            ("wifi", "Wi-Fi"),
            ("tv", "Smart TV"),
            ("ac", "Climatizzazione"),
        ],
    },
]


def _slides(photos: list[str]) -> str:
    parts = []
    for src in photos:
        parts.append(
            f'<div class="swiper-slide">\n'
            f'<img width="1920" height="1280" src="{src}" class="attachment-full size-full" '
            f'alt="" decoding="async" />\n'
            f"</div>"
        )
    return "\n".join(parts)


def _amenity(icon: str, label: str) -> str:
    src = ICONS[icon]
    return (
        f'<li class="d-flex align-items-center">\n'
        f'<img width="45" height="45" src="{src}" class="attachment-full size-full" alt="" decoding="async" />\n'
        f'<span class="title d-block f-ab-16-120 color-black">{label}</span>\n'
        f"</li>"
    )


def _tab_button(idx: int, room: dict) -> str:
    return f"""<button type="button" class="unit-button d-flex align-items-center justify-content-between text-left button js-tab-button" data-id="{idx}">
<div class="inner-wrap">
<span class="title d-block f-al-34-100 color-black">{room["name"]}</span>
<div class="d-flex mt-5">
<span class="price d-block f-a-20-120 color-black">{room["meta"]}</span>
</div>
</div>
{ARROW_SVG}
</button>"""


def _item(idx: int, room: dict) -> str:
    open_attr = ' data-open="true"' if idx == 0 else ""
    next_html = ""
    nxt = room.get("next")
    if nxt:
        nid, nname = nxt
        next_html = (
            f'<p>Vuoi una camera più grande? '
            f'<strong><button class="js-nexttab-button" type="button" data-id="{nid}">{nname}</button></strong></p>'
        )
    amenities = "\n".join(_amenity(k, lab) for k, lab in room["amenities"])
    return f"""<li class="unit-item js-tab js-dropdown" data-id="{idx}"{open_attr} >
<button type="button" class="unit-button align-items-center text-left button js-dropdown-button" data-id="{idx}">
<img width="150" height="150" src="{room["thumb"]}" class="attachment-thumbnail size-thumbnail" alt="" decoding="async" />
<div class="inner-wrap">
<span class="title d-block f-al-34-100 color-black">{room["name"]}</span>
<div class="d-flex mt-5">
<span class="price d-block f-a-20-120 color-black">{room["meta"]}</span>
</div>
</div>
{ARROW_SVG}
</button>
<div class="js-pane">
<div class="pane-wrap">
<div class="gallery-wrap position-relative d-flex align-items-start overflow-hidden swiper-unit">
<div class="swiper-wrapper">
{_slides(room["photos"])}
</div>
{SWIPER_CTRL}
</div>
<div class="top-wrap d-flex justify-content-between">
<span class="label d-inline-block f-a-16-120 color-black">Description</span>
<span class="price d-inline-flex align-items-center f-ab-20-120-b">{room["meta"]}</span>
</div>
<div class="info-wrap mt-30">
<div class="left-wrap">
<span class="title d-block f-al-44-100 color-black">{room["name"]}</span>
<span class="subtitle d-block f-a-32-130 color-black mt-10">{room["species"]}</span>
<span class="description d-block f-a-20-120 color-black mt-20"><p>{room["lead"]}</p>
{next_html}
</span>
</div>
<div class="right-wrap">
<span class="rent-text d-block position-relative f-a-16-120 color-black background-yellow"><p><strong>Stessa mano. Camera diversa.</strong></p>
<p>Carta da parati Margaroli, bagno privato, Wi-Fi, climatizzazione. Prenota le date vere.</p>
{CHECK_SVG}
</span>
</div>
</div>
<ul class="amenities no-list mt-40">
{amenities}
</ul>
<div class="info">
<span class="f-a-14-120"><p>Ogni camera è unica. Sette carte da parati, bagno privato, Wi-Fi, climatizzazione, Smart TV, check-in dal telefono.</p>
</span>
</div>
</div>
</div>
</li>"""


def meet_units_html() -> str:
    buttons = "\n".join(_tab_button(i, r) for i, r in enumerate(ROOMS))
    items = "\n".join(_item(i, r) for i, r in enumerate(ROOMS))
    return f"""<section class="meet-units mt-30">
<div class="units-wrap js-simple-tabs">
<div class="units-buttons d-flex flex-column no-list">
{buttons}
<button type="button" class="cta_book button d-flex align-items-center justify-content-center background-green-light mt-5 js-color-button-fill" data-event="click" data-event-action="modal-open" data-event-id="monday">
<span class="title d-block f-ab-20-120 color-black">Prenota</span>
{BOOK_SVG}
</button>
<a class="cta_call d-flex align-items-center justify-content-center text-center mt-15" href="tel:+39016544593">
{PHONE_SVG}
<span class="title d-block f-a-20-120 color-black">Chiama</span>
<span class="d-block f-ab-20-120 color-black">+39 0165 44593</span>
</a>
</div>
<ul class="units-items no-list">
{items}
</ul>
</div>
</section>
"""


def inject_meet_units(html: str) -> str:
    start = html.find('<section class="meet-units mt-30">')
    end = html.find('<section class="community', start)
    if start < 0 or end < 0:
        raise RuntimeError("meet-units section not found")
    return html[:start] + meet_units_html().rstrip() + "\n" + html[end:]


COMMUNITY_PHOTOS = [
    ("/images/interni-1.jpg", "Lounge"),
    ("/images/interni-18.jpg", "Hall"),
    ("/images/interni-6.jpg", "LED wall"),
    ("/images/meeting-1.jpg", "Sala meeting"),
    ("/images/meeting-6.jpg", "Ingresso"),
]

_COMMUNITY_CTA = """<a class="cta_360 d-flex align-items-center justify-content-center background-purple mt-20 js-color-button-fill no-barba" href="/images/interni-1.jpg" data-fancybox="spazi-comuni" data-color="#C79DFC">
<span class="title d-block f-a-20-120 color-black">Guarda</span>
<svg class="360-arrow" width="21" height="21" viewBox="0 0 21 21" fill="none">
<path d="M14.875 13.412C16.9873 12.7838 18.375 11.7145 18.375 10.5C18.375 8.56625 14.8488 7 10.5 7C6.15125 7 2.625 8.56625 2.625 10.5C2.625 12.4338 6.15125 14 10.5 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
<path d="M7.875 11.375L10.5 14L7.875 16.625" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
</svg>
<svg class="shape-overlays" viewBox="0 0 100 100" preserveAspectRatio="none">
<path class="shape-overlays__path _1" fill="#FFB200"></path>
<path class="shape-overlays__path _2" fill="#E6313A"></path>
<path class="shape-overlays__path _3" fill="#267E6E"></path>
</svg>
</a>"""


def community_gallery_html() -> str:
    slides = []
    for src, caption in COMMUNITY_PHOTOS:
        slides.append(
            f'<a class="swiper-slide position-relative no-barba" href="{src}" data-fancybox="spazi-comuni">\n'
            f'<span class="caption d-block f-al-16-100 color-white">{caption}</span>\n'
            f'<img width="1920" height="1280" src="{src}" class="attachment-full size-full" alt="{caption}" decoding="async" />\n'
            f"</a>"
        )
    return "\n".join(slides)


def inject_community(html: str) -> str:
    start = html.find('<section class="community')
    if start < 0:
        return html
    end = html.find("</section>", start)
    if end < 0:
        return html
    end += len("</section>")
    section = html[start:end]
    section = re.sub(
        r'<div class="cta_360[\s\S]*?</div>',
        _COMMUNITY_CTA,
        section,
        count=1,
    )
    section = re.sub(
        r'<a class="cta_360[\s\S]*?</a>',
        _COMMUNITY_CTA,
        section,
        count=1,
    )

    def _gallery(match: re.Match[str]) -> str:
        return match.group(1) + "\n" + community_gallery_html() + "\n" + match.group(2)

    section = re.sub(
        r'(<div class="swiper-wrapper"[^>]*>)[\s\S]*?(</div>\s*<div class="swiper-controls">)',
        _gallery,
        section,
        count=1,
    )
    return html[:start] + section + html[end:]

