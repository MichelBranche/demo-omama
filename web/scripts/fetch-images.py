import urllib.request
from pathlib import Path

OUT = Path(r"c:\Users\miche\Desktop\demo-omama\web\public\images")
OUT.mkdir(parents=True, exist_ok=True)

FILES = {
    "esterni-2.jpg": [
        "https://media.blastness.info/1758/Omama-Esterni/Esterni2.jpg",
        "https://cdn.blastness.biz/media/1758/Omama-Esterni/thumbs/full/Esterni2.jpg",
    ],
    "esterni-1.jpg": [
        "https://media.blastness.info/1758/Omama-Esterni/Esterni1.jpg",
        "https://cdn.blastness.biz/media/1758/Omama-Esterni/thumbs/full/Esterni1.jpg",
    ],
    "esterni-3.jpg": [
        "https://media.blastness.info/1758/Omama-Esterni/Esterni3.jpg",
        "https://cdn.blastness.biz/media/1758/Omama-Esterni/thumbs/full/Esterni3.jpg",
    ],
    "interni-1.jpg": [
        "https://media.blastness.info/1758/Omama-Interni/Interni1.jpg",
        "https://cdn.blastness.biz/media/1758/Omama-Interni/thumbs/full/Interni1.jpg",
    ],
    "interni-6.jpg": [
        "https://media.blastness.info/1758/Omama-Interni/Interni6.jpg",
        "https://cdn.blastness.biz/media/1758/Omama-Interni/thumbs/full/Interni6.jpg",
    ],
    "interni-28.jpg": [
        "https://media.blastness.info/1758/Omama-Interni/Interni28.jpg",
        "https://cdn.blastness.biz/media/1758/Omama-Interni/thumbs/full/Interni28.jpg",
    ],
    "dettaglio-5.jpg": [
        "https://media.blastness.info/1758/Omama-Interni/Interni-Dettagli5.jpg",
        "https://cdn.blastness.biz/media/1758/Omama-Interni/thumbs/full/Interni-Dettagli5.jpg",
    ],
    "camera-1.jpg": [
        "https://media.blastness.info/1758/Omama-Camere/Camera1.jpg",
        "https://cdn.blastness.biz/media/1758/Omama-Camere/thumbs/full/Camera1.jpg",
    ],
    "camera-3.jpg": [
        "https://media.blastness.info/1758/Omama-Camere/Camera3.jpg",
        "https://cdn.blastness.biz/media/1758/Omama-Camere/thumbs/full/Camera3.jpg",
    ],
    "camera-4.jpg": [
        "https://media.blastness.info/1758/Omama-Camere/Camera4.jpg",
        "https://cdn.blastness.biz/media/1758/Omama-Camere/thumbs/full/Camera4.jpg",
    ],
    "camera-6.jpg": [
        "https://media.blastness.info/1758/Omama-Camere/Camera6.jpg",
        "https://cdn.blastness.biz/media/1758/Omama-Camere/thumbs/full/Camera6.jpg",
    ],
    "camera-7.jpg": [
        "https://media.blastness.info/1758/Omama-Camere/Camera7.jpg",
        "https://cdn.blastness.biz/media/1758/Omama-Camere/thumbs/full/Camera7.jpg",
    ],
    "camera-16.jpg": [
        "https://media.blastness.info/1758/Omama-Camere/Camera16.jpg",
        "https://cdn.blastness.biz/media/1758/Omama-Camere/thumbs/full/Camera16.jpg",
    ],
    "camera-63.jpg": [
        "https://media.blastness.info/1758/Omama-Camere/Camera63.jpg",
        "https://cdn.blastness.biz/media/1758/Omama-Camere/thumbs/full/Camera63.jpg",
    ],
    "camera-66.jpg": [
        "https://media.blastness.info/1758/Omama-Camere/Camera66.jpg",
        "https://cdn.blastness.biz/media/1758/Omama-Camere/thumbs/full/Camera66.jpg",
    ],
    "camera-74.jpg": [
        "https://media.blastness.info/1758/Omama-Camere/Camera74.jpg",
        "https://cdn.blastness.biz/media/1758/Omama-Camere/thumbs/full/Camera74.jpg",
    ],
    "camera-75.jpg": [
        "https://media.blastness.info/1758/Omama-Camere/Camera75.jpg",
        "https://cdn.blastness.biz/media/1758/Omama-Camere/thumbs/full/Camera75.jpg",
    ],
    "camera-78.jpg": [
        "https://media.blastness.info/1758/Omama-Camere/Camera78.jpg",
        "https://cdn.blastness.biz/media/1758/Omama-Camere/thumbs/full/Camera78.jpg",
    ],
    "camera-79.jpg": [
        "https://media.blastness.info/1758/Omama-Camere/Camera79.jpg",
        "https://cdn.blastness.biz/media/1758/Omama-Camere/thumbs/full/Camera79.jpg",
    ],
    "meeting-1.jpg": [
        "https://media.blastness.info/1758/Omama-Conference/Conference-Center1.jpg",
        "https://cdn.blastness.biz/media/1758/Omama-Conference/thumbs/full/Conference-Center1.jpg",
    ],
    "meeting-14.jpg": [
        "https://media.blastness.info/1758/Omama-Conference/Conference-Center14.jpg",
        "https://cdn.blastness.biz/media/1758/Omama-Conference/thumbs/full/Conference-Center14.jpg",
    ],
}


def fetch(name: str, urls: list[str]) -> None:
    dest = OUT / name
    for url in urls:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30) as res:
                data = res.read()
            if len(data) > 8000:
                dest.write_bytes(data)
                print(f"ok {name} {len(data)}")
                return
        except Exception as exc:
            print(f"fail {name} {url} {exc}")
    print(f"MISSING {name}")


if __name__ == "__main__":
    for name, urls in FILES.items():
        fetch(name, urls)
    print("done", len(list(OUT.glob("*.jpg"))))
