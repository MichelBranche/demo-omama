"""Units preloader SVG, redrawn as OMAMA. Keep animation hooks used by main9031.js."""

from __future__ import annotations

import math

# Unique-line glyphs copied from Units (same cut, same y).
_S = (
    "M253.695 256.267H257.41C257.7 260.151 260.715 262.716 265.131 262.716C269.009 262.716 "
    "271.776 260.937 271.776 257.798C271.776 254.198 268.224 253.454 263.85 252.71C259.186 "
    "251.923 254.396 250.393 254.396 244.773C254.396 239.855 258.401 236.545 264.261 236.545"
    "C270.7 236.545 274.663 240.145 274.996 245.354H271.28C270.87 242.002 268.181 239.812 "
    "264.261 239.812C260.34 239.812 257.984 241.464 257.984 244.567C257.984 248.04 261.494 "
    "248.741 265.831 249.485C270.537 250.272 275.37 251.845 275.37 257.465C275.37 262.468 "
    "271.16 265.983 265.088 265.983C258.027 265.983 253.901 261.972 253.695 256.267Z"
)
_O = (
    "M469.344 251.263C469.344 242.745 474.998 236.544 483.135 236.544C491.272 236.544 "
    "496.927 242.745 496.927 251.263C496.927 259.78 491.272 265.981 483.135 265.981C474.998 "
    "265.981 469.344 259.78 469.344 251.263ZM493.248 251.263C493.248 244.608 489.158 239.853 "
    "483.135 239.853C477.112 239.853 473.023 244.608 473.023 251.263C473.023 257.917 477.112 "
    "262.672 483.135 262.672C489.158 262.672 493.248 257.917 493.248 251.263Z"
)
_I = "M154.814 236.792H158.409V265.733H154.814V236.792Z"
_T = "M286.063 240.096H276.693V236.787H299.027V240.096H289.657V265.728H286.063V240.096Z"
_E = (
    "M221.731 236.792H240.143V240.101H225.319V249.363H237.667V252.672H225.319V262.43H240.675"
    "V265.739H221.725V236.798L221.731 236.792Z"
)
_H = (
    "M442.957 236.792H446.551V249.363H461.497V236.792H465.091V265.733H461.497V252.666H446.551"
    "V265.733H442.957V236.792Z"
)

# origin_x, width, d, extra (fill-rule)
_GLYPHS = {
    "S": (253.695, 21.675, _S, ""),
    "O": (469.344, 27.583, _O, ""),
    "I": (154.814, 3.595, _I, ""),
    "T": (276.693, 22.334, _T, ""),
    "E": (221.731, 18.944, _E, ""),
    "H": (442.957, 22.134, _H, ""),
}


def _unique_c(x: float) -> str:
    # Same ring as Units O, open on the right.
    cx, cy = 483.135, 251.263
    ro, ri = 13.791, 10.112
    a = math.radians(48)
    cos_a, sin_a = math.cos(a), math.sin(a)
    ot = (cx + ro * cos_a, cy - ro * sin_a)
    ob = (cx + ro * cos_a, cy + ro * sin_a)
    it = (cx + ri * cos_a, cy - ri * sin_a)
    ib = (cx + ri * cos_a, cy + ri * sin_a)
    d = (
        f"M{ot[0]:.3f} {ot[1]:.3f}"
        f"A{ro} {ro} 0 1 0 {ob[0]:.3f} {ob[1]:.3f}"
        f"L{ib[0]:.3f} {ib[1]:.3f}"
        f"A{ri} {ri} 0 1 1 {it[0]:.3f} {it[1]:.3f}Z"
    )
    dx = x - (cx - ro)
    return (
        f'<g transform="translate({dx:.3f},0)">'
        f'<path d="{d}" fill="black" /></g>'
    )


def _unique_a(x: float) -> str:
    y0, y1 = 236.792, 265.733
    d = (
        f"M{x:.3f} {y1}L{x + 8.35:.3f} {y0}H{x + 12.65:.3f}L{x + 21:.3f} {y1}"
        f"H{x + 16.55:.3f}L{x + 15.05:.3f} 259.15H{x + 5.95:.3f}L{x + 4.45:.3f} {y1}Z"
        f"M{x + 7.15:.3f} 255.55H{x + 13.85:.3f}L{x + 10.5:.3f} 244.05Z"
    )
    return f'<path d="{d}" fill="black" fill-rule="evenodd" />'


def _unique_l(x: float) -> str:
    d = (
        f"M{x:.3f} 236.792H{x + 3.595:.3f}V262.43H{x + 18.944:.3f}V265.739H{x:.3f}Z"
    )
    return f'<path d="{d}" fill="black" />'


def _placed(letter: str, x: float) -> str:
    ox, _w, d, _ = _GLYPHS[letter]
    dx = x - ox
    return (
        f'<g transform="translate({dx:.3f},0)">'
        f'<path d="{d}" fill="black" /></g>'
    )


def _unique_markup() -> str:
    gap = 5.15
    space = 12.0
    chunks: list[tuple[str, float]] = []
    x = 0.0
    for ch in "SOCIAL HOTEL AOSTA":
        if ch == " ":
            x += space
            continue
        if ch == "C":
            w = 27.583
            chunks.append(("C", x))
        elif ch == "A":
            w = 21.0
            chunks.append(("A", x))
        elif ch == "L":
            w = 18.944
            chunks.append(("L", x))
        else:
            w = _GLYPHS[ch][1]
            chunks.append((ch, x))
        x += w + gap
    total = x - gap
    shift = 340.5 - total / 2
    parts = []
    for ch, lx in chunks:
        px = lx + shift
        if ch == "C":
            parts.append(_unique_c(px))
        elif ch == "A":
            parts.append(_unique_a(px))
        elif ch == "L":
            parts.append(_unique_l(px))
        else:
            parts.append(_placed(ch, px))
    return "\n".join(parts)


def _ellipse(cx: float, cy: float, rx: float, ry: float, reverse: bool = False) -> str:
    k = 0.5522847498
    ox, oy = rx * k, ry * k
    if not reverse:
        return (
            f"M{cx:.3f} {cy - ry:.3f}"
            f"C{cx + ox:.3f} {cy - ry:.3f} {cx + rx:.3f} {cy - oy:.3f} {cx + rx:.3f} {cy:.3f}"
            f"C{cx + rx:.3f} {cy + oy:.3f} {cx + ox:.3f} {cy + ry:.3f} {cx:.3f} {cy + ry:.3f}"
            f"C{cx - ox:.3f} {cy + ry:.3f} {cx - rx:.3f} {cy + oy:.3f} {cx - rx:.3f} {cy:.3f}"
            f"C{cx - rx:.3f} {cy - oy:.3f} {cx - ox:.3f} {cy - ry:.3f} {cx:.3f} {cy - ry:.3f}Z"
        )
    return (
        f"M{cx:.3f} {cy - ry:.3f}"
        f"C{cx - ox:.3f} {cy - ry:.3f} {cx - rx:.3f} {cy - oy:.3f} {cx - rx:.3f} {cy:.3f}"
        f"C{cx - rx:.3f} {cy + oy:.3f} {cx - ox:.3f} {cy + ry:.3f} {cx:.3f} {cy + ry:.3f}"
        f"C{cx + ox:.3f} {cy + ry:.3f} {cx + rx:.3f} {cy + oy:.3f} {cx + rx:.3f} {cy:.3f}"
        f"C{cx + rx:.3f} {cy - oy:.3f} {cx + ox:.3f} {cy - ry:.3f} {cx:.3f} {cy - ry:.3f}Z"
    )


def _letter_o(x: float, w: float) -> str:
    y0, y1 = 42.347, 192.08
    cx, cy = x + w / 2, (y0 + y1) / 2
    rx, ry = w / 2, (y1 - y0) / 2
    stem = 38.0
    d = _ellipse(cx, cy, rx, ry) + _ellipse(cx, cy, rx - stem, ry - stem, reverse=True)
    return f'<path class="char" d="{d}" fill="black" fill-rule="evenodd" />'


def _letter_m(x: float, w: float) -> str:
    y0, y1 = 42.347, 192.08
    stem = 42.0
    mid = x + w / 2
    v_outer = y0 + 52.0
    v_inner = y0 + 104.0
    d = (
        f"M{x:.3f} {y1:.3f}V{y0:.3f}H{x + stem:.3f}"
        f"L{mid:.3f} {v_outer:.3f}L{x + w - stem:.3f} {y0:.3f}"
        f"H{x + w:.3f}V{y1:.3f}H{x + w - stem:.3f}V{y0 + 56:.3f}"
        f"L{mid:.3f} {v_inner:.3f}L{x + stem:.3f} {y0 + 56:.3f}V{y1:.3f}Z"
    )
    return f'<path class="char" d="{d}" fill="black" />'


def _letter_a(x: float, w: float) -> str:
    y0, y1 = 42.347, 192.08
    top_w = 52.0
    peak = x + w / 2
    tl, tr = peak - top_w / 2, peak + top_w / 2
    stem = 42.0
    bar_top, bar_bot = 118.0, 148.0
    hole_top = 66.0
    inset = 16.0

    def lerp(x1: float, y_a: float, x2: float, y_b: float, y: float) -> float:
        return x1 + (x2 - x1) * (y - y_a) / (y_b - y_a)

    ol_top = lerp(tl, y0, x, y1, bar_top)
    or_top = lerp(tr, y0, x + w, y1, bar_top)
    ol_bot = lerp(tl, y0, x, y1, bar_bot)
    or_bot = lerp(tr, y0, x + w, y1, bar_bot)
    ol_ht = lerp(tl, y0, x, y1, hole_top)
    or_ht = lerp(tr, y0, x + w, y1, hole_top)
    d = (
        f"M{x:.3f} {y1:.3f}L{tl:.3f} {y0:.3f}H{tr:.3f}L{x + w:.3f} {y1:.3f}Z"
        f"M{x + stem:.3f} {y1:.3f}H{x + w - stem:.3f}"
        f"L{or_bot - inset:.3f} {bar_bot:.3f}L{ol_bot + inset:.3f} {bar_bot:.3f}Z"
        f"M{ol_ht + inset:.3f} {hole_top:.3f}H{or_ht - inset:.3f}"
        f"L{or_top - inset:.3f} {bar_top:.3f}L{ol_top + inset:.3f} {bar_top:.3f}Z"
    )
    return f'<path class="char" d="{d}" fill="black" fill-rule="evenodd" />'


HOUSE = (
    '<path class="house-path" d="M751.486 192.074H691.965V152.298L721.728 132.407L751.486 152.298V192.074Z" fill="black" />'
)


def build_preloader_svg() -> str:
    letters = "\n".join(
        [
            _letter_o(0, 122),
            _letter_m(129, 148),
            _letter_a(284, 118),
            _letter_m(409, 148),
            _letter_a(564, 118),
        ]
    )
    return f"""<svg class="logo" width="752" height="266" viewBox="0 0 752 266" fill="none" xmlns="http://www.w3.org/2000/svg">
<g class="unique">
{_unique_markup()}
</g>
<g class="letters">
{letters}
{HOUSE}
</g>
</svg>"""


PRELOADER_SVG = build_preloader_svg()
