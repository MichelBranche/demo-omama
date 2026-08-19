"""Make small textures for the Units WebGL gallery (original uses ~300x200)."""
from pathlib import Path
from PIL import Image

ROOT = Path(r"c:\Users\miche\Desktop\demo-omama\web\public\images")
OUT = ROOT / "thumbs"
OUT.mkdir(parents=True, exist_ok=True)

SOURCES = [
    "camera-74.jpg",
    "camera-79.jpg",
    "camera-6.jpg",
    "camera-66.jpg",
    "camera-1.jpg",
    "camera-16.jpg",
    "interni-1.jpg",
    "interni-6.jpg",
    "interni-28.jpg",
    "esterni-1.jpg",
    "esterni-2.jpg",
    "esterni-3.jpg",
    "meeting-1.jpg",
    "meeting-14.jpg",
    "dettaglio-5.jpg",
    "camera-3.jpg",
    "camera-4.jpg",
    "camera-7.jpg",
    "camera-63.jpg",
    "camera-75.jpg",
    "camera-78.jpg",
]

SIZE = (400, 267)


def main() -> None:
    for name in SOURCES:
        src = ROOT / name
        if not src.exists():
            print("missing", name)
            continue
        with Image.open(src) as im:
            im = im.convert("RGB")
            im.thumbnail((800, 800), Image.Resampling.LANCZOS)
            canvas = Image.new("RGB", SIZE, (20, 20, 20))
            # cover crop to 400x267
            tw, th = SIZE
            src_w, src_h = im.size
            scale = max(tw / src_w, th / src_h)
            nw, nh = int(src_w * scale), int(src_h * scale)
            im = im.resize((nw, nh), Image.Resampling.LANCZOS)
            left = (nw - tw) // 2
            top = (nh - th) // 2
            im = im.crop((left, top, left + tw, top + th))
            dest = OUT / name
            im.save(dest, "JPEG", quality=72, optimize=True, progressive=True)
            print(dest.name, dest.stat().st_size)


if __name__ == "__main__":
    main()
