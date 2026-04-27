import json
import re
import ssl
import subprocess
import urllib.parse
import urllib.request
import uuid
from pathlib import Path

SCRIPT_DIR   = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
IMAGES_DIR   = PROJECT_ROOT / "static" / "images"
MARKERS_FILE = PROJECT_ROOT / "static" / "data" / "markers.json"

FULL_MAX_PX        = 1200
THUMB_DESKTOP_PX   = 150
THUMB_MOBILE_PX    = 80


def _slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:40]


def _geocode(address):
    url = "https://nominatim.openstreetmap.org/search?" + urllib.parse.urlencode(
        {"q": address, "format": "json", "limit": 1}
    )
    req = urllib.request.Request(url, headers={"User-Agent": "book-crawl/1.0"})
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    with urllib.request.urlopen(req, timeout=10, context=ctx) as r:
        data = json.load(r)
    if not data:
        raise RuntimeError(f"Could not geocode: {address}")
    return float(data[0]["lat"]), float(data[0]["lon"])


def _sips(*args):
    result = subprocess.run(["sips", *args], capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(f"sips failed (exit {result.returncode}):\n{result.stderr.strip()}")


def process_location(image_path, cafe_name, caption, address):
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    MARKERS_FILE.parent.mkdir(parents=True, exist_ok=True)

    uid  = str(uuid.uuid4())[:8]
    stem = f"{_slug(cafe_name)}-{uid}"

    full_name         = f"{stem}.jpg"
    thumb_desktop_name = f"{stem}-thumb.jpg"
    thumb_mobile_name  = f"{stem}-thumb-mobile.jpg"

    full_out          = str(IMAGES_DIR / full_name)
    thumb_desktop_out = str(IMAGES_DIR / thumb_desktop_name)
    thumb_mobile_out  = str(IMAGES_DIR / thumb_mobile_name)

    _sips("-Z", str(FULL_MAX_PX),      image_path, "--out", full_out)
    _sips("-Z", str(THUMB_DESKTOP_PX), image_path, "--out", thumb_desktop_out)
    _sips("-Z", str(THUMB_MOBILE_PX),  image_path, "--out", thumb_mobile_out)

    lat, lng = _geocode(address)

    entry = {
        "id":           uid,
        "cafe_name":    cafe_name,
        "caption":      caption,
        "address":      address,
        "image":        f"/images/{full_name}",
        "thumb":        f"/images/{thumb_desktop_name}",
        "thumb_mobile": f"/images/{thumb_mobile_name}",
        "lat":          lat,
        "lng":          lng,
    }

    markers = []
    if MARKERS_FILE.exists():
        with open(MARKERS_FILE) as f:
            markers = json.load(f)
    markers.append(entry)

    markers = [m for m in markers if (PROJECT_ROOT / "static" / m["image"].lstrip("/")).exists()]
    seen = {}
    for m in markers:
        seen[m["cafe_name"]] = m
    markers = list(seen.values())

    with open(MARKERS_FILE, "w") as f:
        json.dump(markers, f, indent=2)

    print(f"Added: {cafe_name} — {caption} → ({lat:.5f}, {lng:.5f})")
    print(f"  full:    static/images/{full_name}")
    print(f"  desktop: static/images/{thumb_desktop_name}")
    print(f"  mobile:  static/images/{thumb_mobile_name}")
    return entry

# process_location(
#     '/Users/josh/Desktop/IMG_0662.jpeg',
#     "The Little Bookroom",
#     "",
#     "8 Village Avenue, Brunswick East"
# )

# process_location(
#     '/Users/josh/Desktop/IMG_0663.jpeg',
#     "Brunswick Bound",
#     "",
#     "361 Sydney Road, Brunswick"
# )

process_location(
    '/Users/josh/Desktop/IMG_0664.jpeg',
    "Readings Kids",
    "",
    "315 Lygon Street, Carlton"
)

# process_location(
#     '/Users/josh/Desktop/IMG_0665.jpeg',
#     "Readings Carlton",
#     "",
#     "309 Lygon Street, Carlton"
# )

# process_location(
#     '/Users/josh/Desktop/IMG_0666.jpeg',
#     "Through the Looking Glass Fitzroy",
#     "",
#     "341 Brunswick Street, Fitzroy"
# )





# process_location(
#     '/Users/josh/Desktop/IMG_0658.jpeg',
#     "Jeffreys Books",
#     "",
#     "140 Glenferrie Road Malvern"
# )


# process_location(
#     '/Users/josh/Desktop/IMG_0657.jpeg',
#     "Readings Malvern",
#     "",
#     "185 Glenferrie Road Malvern"
# )

# process_location(
#     '/Users/josh/Desktop/IMG_0656.jpeg',
#     "The Leaf Bookshop",
#     "",
#     "3/283 High Street Ashburton 3147"
# )

# process_location(
#     '/Users/josh/Desktop/IMG_0655.jpeg',
#     "Readings Chadstone",
#     "",
#     "1341 Dandenong Road Malvern East"
# )


# process_location(
#     '/Users/josh/Desktop/IMG_0639.jpeg',
#     "Readings Emporium",
#     "",
#     "287 Lonsdale Street, Melbourne"
# )

#########

# process_location(
#     '/Users/josh/Desktop/IMG_0635.jpeg',
#     "The Chestnut Tree",
#     "Sat at a sunlit table, drinking a nice coffee",
#     "542 Barkly Street, West Footscray"
# )


# process_location(
#     '/Users/josh/Desktop/IMG_0632.jpeg',
#     "Seddon Book Alley",
#     "You're going to find treasures here",
#     "107 Victoria Street, Seddon"
# )


# process_location(
#     '/Users/josh/Desktop/IMG_0633.jpeg',
#     "Sun Bookshop",
#     "It connects right into a cool old cinema",
#     "10 Ballarat Street, Yarraville"
# )


# process_location(
#     '/Users/josh/Desktop/IMG_0634.jpeg',
#     "Book and Paper",
#     "They have some prints by local artists",
#     "36 Douglas Parade, Williamstown"
# )