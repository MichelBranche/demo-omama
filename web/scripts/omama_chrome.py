"""Shared Units→OMAMA chrome: paths, nav, logo, trackers."""
from __future__ import annotations

import re
from pathlib import Path

from omama_preloader import PRELOADER_SVG

OMAMA_MARK = '<span class="omama-mark">OMAMA</span>'
HEADER_LOGO = (
    '<span class="omama-logo-spin">'
    '<img class="omama-logo-img" src="/images/omama-logo.png" alt="" />'
    "</span>"
    '<span class="omama-wordmark">'
    '<span class="omama-mark">OMAMA</span>'
    '<span class="omama-hotel">hotel</span>'
    "</span>"
)
BOOK_URL = (
    "https://book.blastness.com/?id_albergo=21301&dc=6913&language=it&currency=EUR"
)
BOOK_EMBED = (
    "https://book.blastness.com/results?lingua_int=ita&id_albergo=21301&dc=6913&id_stile="
)


def _select_opts(count: int, start: int = 0, selected: int | None = None) -> str:
    if selected is None:
        selected = 1 if start == 1 else 0
    return "".join(
        f'<option value="{i}"{" selected" if i == selected else ""}>{i}</option>'
        for i in range(start, count + 1)
    )


BLASTNESS_IFRAME = (
    '<div class="omama-book-panel">'
    '<form class="omama-book-form" data-omama-book-form method="dialog">'
    '<div class="omama-book-grid">'
    '<label class="omama-book-field">'
    '<span data-i18n="Arrivo">Arrivo</span>'
    '<input type="date" name="checkin" required>'
    "</label>"
    '<label class="omama-book-field">'
    '<span data-i18n="Partenza">Partenza</span>'
    '<input type="date" name="checkout" required>'
    "</label>"
    '<label class="omama-book-field">'
    '<span data-i18n="Adulti">Adulti</span>'
    f'<select name="adults">{_select_opts(8, 1, 2)}</select>'
    "</label>"
    '<label class="omama-book-field">'
    '<span data-i18n="Bambini">Bambini</span>'
    f'<select name="children">{_select_opts(6, 0)}</select>'
    "</label>"
    '<label class="omama-book-field">'
    '<span data-i18n="Camere">Camere</span>'
    f'<select name="rooms">{_select_opts(4, 1)}</select>'
    "</label>"
    '<label class="omama-book-field omama-book-code">'
    '<span data-i18n="Codice sconto">Codice sconto</span>'
    '<input type="text" name="code" autocomplete="off" maxlength="40">'
    "</label>"
    "</div>"
    '<button type="submit" class="omama-book-submit">'
    '<span data-i18n="Cerca disponibilità">Cerca disponibilità</span>'
    "</button>"
    '<button type="button" class="omama-book-edit" data-omama-book-edit>'
    '<span data-i18n="Modifica ricerca">Modifica ricerca</span>'
    "</button>"
    "</form>"
    '<div class="omama-book-results" data-omama-book-results></div>'
    "</div>"
)
SKIP_SCRIPT = """<script>
try{if(sessionStorage.getItem("omama-entered")==="1")document.documentElement.classList.add("omama-skip-preloader")}catch(e){}
</script>
"""

NAV_ARROW = """<div class="d-flex align-items-center justify-content-between"><span class="index f-ab-14-120"></span> <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.17418 1.66471L0.574525 1.66471L0.589256 6.74452e-05L10.0173 6.90346e-05L10.0173 9.42815L8.3527 9.44288L8.3527 2.84322L1.17851 10.0174L3.1533e-06 8.8389L7.17418 1.66471Z" fill="black"/>
</svg>
</div>"""

CAMERE_LI = f'''<li class=" menu-item menu-item-type-post_type menu-item-object-page " data-id="1119"><a href="/en/camere/index.html" class=" ">{NAV_ARROW} <span class="f-ab-16-120">Camere</span></a></li>'''

PATHS = [
    ("https://cdn.jsdelivr.net/", "/cdn.jsdelivr.net/"),
    ("https://cdnjs.cloudflare.com/", "/cdnjs.cloudflare.com/"),
    (
        "https://units.gr/wp-content/themes/units/public/dist/scripts/main.js",
        "/wp-content/themes/units/public/dist/scripts/main9031.js",
    ),
    ("https://units.gr/wp-content/", "/wp-content/"),
    ("http://units.gr/wp-content/", "/wp-content/"),
    (
        "https://units.gr/wp-includes/js/jquery/jquery.min.js",
        "/wp-includes/js/jquery/jquery.minf43b.js",
    ),
    (
        "https://units.gr/wp-includes/js/jquery/jquery-migrate.min.js",
        "/wp-includes/js/jquery/jquery-migrate.min5589.js",
    ),
    ("https://units.gr/wp-includes/", "/wp-includes/"),
    ("https://units.gr/book", BOOK_EMBED),
    ('href="/book"', f'href="{BOOK_EMBED}"'),
    ("Come si of living", "Omama"),
    ("https://units.gr/en/homepage/", "/en/homepage/index.html"),
    ("https://units.gr/en/our-way-of-living/", "/en/living/index.html"),
    ("https://units.gr/en/community/", "/en/omamamood/index.html"),
    ("https://units.gr/en/contact/", "/en/aosta/index.html"),
    ("https://units.gr/en/unit/units-parkside/", "/en/camere/index.html"),
    ("https://units.gr/en/unit/units-theatro/", "/en/camere/index.html"),
    ("https://units.gr/en/faqs/", "/en/aosta/index.html"),
    ("https://units.gr/en/privacy-policy/", "/en/demo/index.html"),
    ("https://units.gr/en/cookies-policy/", "/en/demo/index.html"),
    ("Book your Unit", "Prenota"),
    ("Book your unit", "Prenota"),
    ("Student Homes", "Camere"),
    ("Our way of living\xa0", "Omama"),
    ("Our way of living", "Omama"),
    (">Community<", ">OMAMAMOOD<"),
    (">Contact<", ">Aosta<"),
    ("https://www.instagram.com/units.gr/", "https://www.omamahotel.com/"),
    ("https://www.facebook.com/units.gr", "https://www.omamahotel.com/"),
    ("https://www.tiktok.com/@units.gr", "https://www.omamahotel.com/"),
    ("https://www.linkedin.com/company/units-gr/", "https://www.omamahotel.com/"),
    ("mailto:hey@units.gr", "mailto:info@omamahotel.com"),
    ("+30 694 000 6565", "+39 0165 44593"),
    ("(+30) 694 000 6565", "+39 0165 44593"),
]


def strip_script_by_id(html: str, script_id: str) -> str:
    html = re.sub(
        rf'<script[^>]*id="{re.escape(script_id)}"[^>]*>[\s\S]*?</script>',
        "",
        html,
        count=1,
    )
    return re.sub(rf'<script[^>]*id="{re.escape(script_id)}"[^>]*></script>', "", html)


def flatten_camere_nav(html: str) -> str:
    html = re.sub(
        r'<li class="[^"]*hasChildren[^"]*"[\s\S]*?<div class="blocker"></div>\s*</li>',
        CAMERE_LI,
        html,
        count=1,
    )
    return html


def reorder_main_nav(html: str) -> str:
    """Aosta before OMAMAMOOD in the header menu."""
    return re.sub(
        r'(<li[^>]*data-id="789"[^>]*>[\s\S]*?</li>)\s*(<li[^>]*data-id="787"[^>]*>[\s\S]*?</li>)',
        r"\2\n\1",
        html,
        count=1,
    )


def apply_logo(html: str) -> str:
    html = re.sub(
        r'(<a class="logo d-block"[^>]*>)[\s\S]*?</a>',
        rf"\1{HEADER_LOGO}</a>",
        html,
        count=1,
    )
    html = re.sub(
        r'(<a class="logo"(?! d-block)[^>]*>)[\s\S]*?</a>',
        rf"\1{OMAMA_MARK}</a>",
        html,
        count=1,
    )
    return html


def apply_preloader(html: str) -> str:
    html, n = re.subn(
        r'(<div class="preloader"\s*>\s*)<svg class="logo"[\s\S]*?</svg>',
        lambda m: m.group(1) + PRELOADER_SVG,
        html,
        count=1,
    )
    if n != 1:
        raise RuntimeError(f"preloader svg replace count={n}")
    return html


GLOBE_SVG = """<svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<circle cx="10.78" cy="9.62" r="8.6" stroke="white" stroke-width="1.5"/>
<ellipse cx="10.78" cy="9.62" rx="3.5" ry="8.6" stroke="white" stroke-width="1.5"/>
<path d="M2.4 9.62h16.7M3.7 5.7h14.2M3.7 13.54h14.2" stroke="white" stroke-width="1.5"/>
</svg>"""

_LANGS = (
    ("it", "IT", True),
    ("en", "EN", False),
    ("fr", "FR", False),
    ("de", "DE", False),
)


def langs_html(href: str = "") -> str:
    codes = []
    for code, label, active in _LANGS:
        cls = ' class="active"' if active else ""
        codes.append(
            f'<button type="button" data-lang="{code}"{cls}>{label}</button>'
        )
    return (
        '<div class="lang omama-lang-pill background-black no-barba">\n'
        '<nav class="omama-lang-codes" aria-label="Lingua">\n'
        + "".join(codes)
        + "\n</nav>\n"
        + GLOBE_SVG
        + "\n</div>"
    )


def apply_langs(html: str) -> str:
    html, n = re.subn(
        r'<a data-lang="en-US" class="lang[^"]*" href="([^"]+)"[\s\S]*?</a>\s*'
        r'<a data-lang="el" class="lang[^"]*"[\s\S]*?</a>',
        lambda m: langs_html(),
        html,
    )
    if n < 1:
        raise RuntimeError(f"lang switcher replace count={n}")
    return html


def fix_prenota_link(html: str) -> str:
    html = html.replace(
        '<button class="d-none d-md-block open-modal-btn button background-purple-dark js-color-button-fill"',
        f'<a class="d-none d-md-block open-modal-btn button background-purple-dark js-color-button-fill" href="{BOOK_EMBED}" data-omama-book="1"',
    )
    html = html.replace(
        '</svg>\n</button>\n<div class="lang omama-lang-pill',
        '</svg>\n</a>\n<div class="lang omama-lang-pill',
    )
    html = html.replace(
        'class="open-modal-btn mobile button background-purple-dark" href="https://www.omamahotel.com/"',
        f'class="open-modal-btn mobile button background-purple-dark" href="{BOOK_URL}" data-omama-book="1"',
    )
    html = html.replace(
        'class="d-block d-md-none open-modal-btn button background-purple-dark" href="https://www.omamahotel.com/"',
        f'class="d-block d-md-none open-modal-btn button background-purple-dark" href="{BOOK_URL}" data-omama-book="1"',
    )
    html = html.replace(
        f'class="d-none d-md-block open-modal-btn button background-purple-dark js-color-button-fill" href="https://www.omamahotel.com/"',
        f'class="d-none d-md-block open-modal-btn button background-purple-dark js-color-button-fill" href="{BOOK_URL}" data-omama-book="1"',
    )
    html = html.replace(
        f'class="open-modal-btn mobile button background-purple-dark" href="{BOOK_EMBED}"',
        f'class="open-modal-btn mobile button background-purple-dark" href="{BOOK_EMBED}" data-omama-book="1"',
    )
    html = html.replace(
        f'class="d-block d-md-none open-modal-btn button background-purple-dark" href="{BOOK_EMBED}"',
        f'class="d-block d-md-none open-modal-btn button background-purple-dark" href="{BOOK_EMBED}" data-omama-book="1"',
    )
    html = html.replace(
        '<div data-svelte data-name="monday"></div>',
        BLASTNESS_IFRAME,
    )
    html = html.replace(
        'href="https://www.omamahotel.com/">Prenota</a>',
        f'href="{BOOK_EMBED}" data-omama-book="1">Prenota</a>',
    )
    return html


def inject_assets(html: str) -> str:
    if "omama-overrides.css" not in html:
        html = html.replace(
            "fjkg6.css' media='all' />",
            "fjkg6.css' media='all' />\n<link rel=\"stylesheet\" href=\"/omama-overrides.css\" />",
            1,
        )
    if "omama-skip-preloader" not in html:
        html = html.replace(
            '<link rel="stylesheet" href="/omama-overrides.css" />',
            '<link rel="stylesheet" href="/omama-overrides.css" />\n' + SKIP_SCRIPT,
            1,
        )
    if "/omama-i18n.js" not in html:
        if "/omama-chrome.js" in html:
            html = html.replace(
                '<script src="/omama-chrome.js"></script>',
                '<script src="/omama-i18n.js"></script>\n<script src="/omama-chrome.js"></script>',
                1,
            )
        else:
            html = re.sub(
                r'(<script id="app/0-js"[^>]*></script>)',
                r'\1\n<script src="/omama-i18n.js"></script>\n<script src="/omama-chrome.js"></script>',
                html,
                count=1,
            )
    elif "/omama-chrome.js" not in html:
        html = re.sub(
            r'(<script id="app/0-js"[^>]*></script>)',
            r'\1\n<script src="/omama-chrome.js"></script>',
            html,
            count=1,
        )
    return html


def apply_chrome(html: str) -> str:
    for old, new in PATHS:
        html = html.replace(old, new)
    html = re.sub(r'(["\'])//units\.gr/wp-content/', r"\1/wp-content/", html)
    html = html.replace("https:/wp-content/", "/wp-content/")
    html = html.replace("http:/wp-content/", "/wp-content/")

    html = html.replace(
        '<li id="menu-item-808" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-808"><a href="/en/demo/index.html">',
        '<li id="menu-item-808" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-808"><a href="/en/demo/index.html" target="_blank" rel="noopener">',
    )
    html = html.replace(
        '<li id="menu-item-807" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-807"><a href="/en/demo/index.html">',
        '<li id="menu-item-807" class="menu-item menu-item-type-post_type menu-item-object-page menu-item-807"><a href="/en/demo/index.html" target="_blank" rel="noopener">',
    )

    html = flatten_camere_nav(html)
    html = reorder_main_nav(html)
    html = apply_logo(html)
    html = apply_preloader(html)
    html = apply_langs(html)
    html = fix_prenota_link(html)
    html = inject_assets(html)

    for sid in [
        "cookieyes",
        "google_gtagjs-js-consent-mode-data-layer",
        "google_gtagjs-js",
        "google_gtagjs-js-after",
        "pys-version-script",
        "pys-js-extra",
        "pys-js",
        "inavii-social-feed-front-js",
        "inavii-social-feed-front-js-before",
        "pll_cookie_script-js-after",
    ]:
        html = strip_script_by_id(html, sid)

    html = re.sub(
        r'var ajax_object = \{.*?\};',
        'var ajax_object = {"ajax_url":"/","theme_dir":"/wp-content/themes/units","ajax_nonce":"","upload_dir":"/images","instafeedConfig":{"accessToken":""},"checkout_links":{"policy":"/en/demo/index.html","terms":"/en/demo/index.html"},"checkout_menu":""};',
        html,
        count=1,
    )
    html = re.sub(r'<noscript><img height="1" width="1"[\s\S]*?</noscript>', "", html)
    html = re.sub(
        r"<!-- Google Tag Manager[\s\S]*?<!-- End Google Tag Manager[\s\S]*?-->",
        "",
        html,
    )
    html = html.replace('<html lang="en-US"', '<html lang="it"')
    html = html.replace(
        ' Web design by <a href="https://www.bighorrorathens.com/" target="_blank">Big Horror.</a> Code by <a href="https://lemonjelly.gr/" target="_blank">Lemonjelly</a>',
        f' Demo indipendente. Prenotazioni su <a href="{BOOK_URL}" target="_blank" rel="noopener">book.blastness.com</a></span>\n<span class="d-block f-a-14-120-b mt-10"><a class="omama-credit" href="https://michelbranche.it" target="_blank" rel="noopener">Website &amp; Design By <span class="omama-credit-name">Michel branche</span></a>',
    )
    html = html.replace("© 2026 KORPO Development", "Via Torino 14 · Aosta")
    return html


def swap_remote_images(html: str, locals_: list[str]) -> str:
    """Replace remote WP upload JPGs with local photos, cycling."""
    found = re.findall(r'src="(https://units\.gr/wp-content/uploads/[^"]+\.(?:jpg|jpeg|png|webp))"', html)
    mapping = {}
    i = 0
    for src in found:
        if src not in mapping:
            mapping[src] = locals_[i % len(locals_)]
            i += 1
    for old, new in mapping.items():
        html = html.replace(old, new)
    html = re.sub(
        r'\s+srcset="https://units\.gr/wp-content/uploads/[^"]+\.(?:jpg|jpeg|png|webp)[^"]*"',
        "",
        html,
    )
    html = re.sub(
        r'\s+srcset="[^"]*/wp-content/uploads/[^"]*\.(?:jpg|jpeg|png|webp)[^"]*"',
        "",
        html,
    )
    return html


def write(path: Path, html: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(html, encoding="utf-8")
    print("wrote", path, path.stat().st_size)
