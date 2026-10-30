#!/usr/bin/env python3
"""
fetch_images.py — review-first image downloader for the Guangdong travel guide.

Unlike scripts/fetch-images.mjs, this script NEVER writes into the app folders.
It downloads *candidate* photos into a review folder so you can look at them
first, then copy the approved ones into place:

    src/…  and  public/assets/images/     <-- the app reads these (read-only here)
    scripts/review-downloads/             <-- this script writes here

Requirements: Python 3.8+. Standard library only, no pip installs.

Quick start
-----------
    python3 scripts/fetch_images.py --list            # show every target + query
    python3 scripts/fetch_images.py --verify-only     # report missing/orphan images
    python3 scripts/fetch_images.py                   # download everything
    python3 scripts/fetch_images.py --only canton     # only matching filenames
    python3 scripts/fetch_images.py --candidates 3    # up to 3 options per place
    python3 scripts/fetch_images.py --sources commons,trip,tripadvisor

How targets are found
---------------------
The script scans src/**/*.{ts,tsx,js,jsx,json,css,html} for references of the
form assets/images/<name>.jpg. Whatever the data files actually reference is
what gets downloaded, so the list can never drift out of sync with the app.
Files sitting in public/assets/images/ that nothing references are reported as
orphans instead of being silently replaced.

Sources
-------
* commons       Wikimedia Commons (free licence, stable API)   -> default
* trip          Trip.com          (HTML scrape; often blocked)
* tripadvisor   TripAdvisor       (HTML scrape; often blocked)

Trip.com and TripAdvisor expose no public image API and their pages are
JS-rendered and bot-protected, so those two adapters are best-effort only. When
they fail the script says so and moves on; Commons is always tried first.

Licensing
---------
Commons results carry author + licence into credits.json, so you can attribute
properly. Images scraped from Trip.com / TripAdvisor are normally
all-rights-reserved: use them as visual references only, not in a shipped app,
unless you have explicit permission.
"""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

# --------------------------------------------------------------------------- #
# Configuration
# --------------------------------------------------------------------------- #

ROOT = Path(__file__).resolve().parent.parent
PUBLIC_DIR = ROOT / "public" / "assets" / "images"
SRC_DIR = ROOT / "src"
DEFAULT_OUT_DIR = Path(__file__).resolve().parent / "review-downloads"

COMMONS_API = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = (
    "GuangdongTravelGuideImageFetcher/1.0 "
    "(local review script; run manually)"
)

MIN_BYTES = 8 * 1024        # reject error pages / broken thumbnails
MIN_WIDTH = 800             # reject tiny Commons results
TIMEOUT = 30                # seconds per request
RETRIES = 3                 # attempts per HTTP request
REQUEST_DELAY = 0.6         # seconds between requests (be polite)
TARGET_WIDTH = 1600

IMAGE_EXT_RE = re.compile(
    r"assets/images/([A-Za-z0-9 ._\-]+?\.(?:jpg|jpeg|png|webp))", re.IGNORECASE
)

# --------------------------------------------------------------------------- #
# Per-file search queries
#
# Keyed by filename. Only files needing more than the auto-generated query
# (filename with underscores replaced by spaces) appear here. Add entries as
# you discover which auto-queries return poor results.
# --------------------------------------------------------------------------- #

QUERY_OVERRIDES: dict[str, list[str]] = {
    # --- Guangzhou ---
    "canton_tower_night_1793290740500.jpg": [
        "Canton Tower night",
        "Canton Tower",
    ],
    "chen_clan_ancestral_hall_1793290741668.jpg": [
        "Chen Clan Ancestral Hall",
        "Chen Clan Academy Guangzhou",
    ],
    "shamian_island_street_1793290742700.jpg": [
        "Shamian Island Guangzhou",
        "Shamian Island",
    ],
    "cantonese_dimsum_table_1793290742674.jpg": [
        "dim sum steamer basket",
        "yum cha dim sum",
    ],
    "dongshankou_redbrick_villa_1793294556329.jpg": [
        "Dongshankou Guangzhou",
        "Xinhepu Guangzhou",
        "Xiguan Guangzhou red brick",
    ],
    "yong_qing_fang_1793294746500.jpg": [
        "Cantonese Opera Art Museum Guangzhou",
        "Yongqing Fang Guangzhou",
        "Enning Road Guangzhou",
    ],
    "yuexiu_five_rams_sculpture_1793294557769.jpg": [
        "Five Rams Statue Guangzhou",
        "Yuexiu Park Guangzhou",
    ],
    "sacred_heart_cathedral_guangzhou_1793294557703.jpg": [
        "Sacred Heart Cathedral Guangzhou",
        "Shishi Cathedral Guangzhou",
    ],
    "xiaozhou_oyster_shell_house_1793294556757.jpg": [
        "Xiaozhou Village Guangzhou",
        "oyster shell wall Guangdong",
    ],
    "baiyun_mountain_cablecar_1793294558861.jpg": [
        "Baiyun Mountain Guangzhou",
        "Baiyun Mountain cable car",
    ],
    "pantang_village_1793294759675.jpg": [
        "Pantang Guangzhou",
        "Liwan Lake Guangzhou",
        "Xiguan Guangzhou",
    ],
    "baomo_garden_koi_pond_1793294559616.jpg": [
        "Baomo Garden",
        "Panyu garden Guangzhou koi",
    ],
    "guangdong_museum_1793294744924.jpg": [
        "Guangdong Museum",
        "Guangdong Museum Zhujiang New Town",
    ],
    "taikoo_hui_guangzhou_1793294562227.jpg": [
        "Taikoo Hui Guangzhou",
        "TaiKoo Hui",
    ],
    "guangzhou_opera_house_zaha_1793294560444.jpg": [
        "Guangzhou Opera House",
        "Guangzhou Opera House Zaha Hadid",
    ],
    # No free photo of this specific hotel exists on Commons. The query below
    # gets you a nearby landmark only — treat it as a placeholder to reject,
    # not to ship. A real photo of the Haijun Hotel must be supplied by hand.
    "haijun_hotel_guangzhou_1793352754159.jpg": [
        "Yanjiang Road Guangzhou",
        "Haizhu Bridge Guangzhou",
    ],

    # --- Shenzhen ---
    "shenzhen_skyline_bay_1793293122053.jpg": ["Shenzhen skyline", "Shenzhen Bay"],
    "ping_an_tower_1793294695737.jpg": [
        "Ping An Finance Centre",
        "Ping An Finance Center Shenzhen",
    ],
    "oct_loft_art_1793294697253.jpg": ["OCT-LOFT Shenzhen", "OCT Loft Shenzhen"],
    "dapeng_fortress_1793294697341.jpg": [
        "Dapeng Fortress",
        "Dapeng Ancient City",
    ],
    "shenzhen_mixc_world_1793294563524.jpg": [
        "MixC Shenzhen",
        "Shenzhen shopping mall Nanshan",
    ],
    "shenzhen_robot_arena_1793294562112.jpg": [
        "combat robot competition",
        "battle bots arena",
    ],
    "runyuan_chicken_1793294712418.jpg": [
        "coconut chicken hotpot",
        "Hainanese chicken coconut soup",
    ],
    "shenzhen_tech_canopy_1793296487433.jpg": [
        "Huaqiangbei",
        "Huaqiang North Shenzhen",
    ],

    # --- Shantou ---
    "shantou_xiaogongyuan_street_1793293123621.jpg": [
        "Xiaogongyuan Shantou",
        "Shantou qilou arcade",
    ],
    "chaoshan_beef_hotpot_1793293124531.jpg": [
        "Chaoshan beef hotpot",
        "Chinese beef hot pot",
    ],
    "nanao_lighthouse_1793294713423.jpg": [
        "Nan'ao Island",
        "Nanao Island Guangdong",
    ],
    "shantou_mixc_1793294712904.jpg": ["Shantou Longhu", "Shantou city"],
    "shantou_fuyuan_seafood_1793294564458.jpg": [
        "Teochew seafood",
        "Chinese seafood market crabs",
    ],

    # --- Chaozhou ---
    "chaozhou_guangji_bridge_1793293122927.jpg": [
        "Guangji Bridge Chaozhou",
        "Xiangzi Bridge",
    ],
    "chaozhou_paifang_1793294727841.jpg": [
        "Paifang Street Chaozhou",
        "Chaozhou archway",
    ],
    "chaozhou_kaiyuan_1793294728399.jpg": ["Kaiyuan Temple Chaozhou"],
    "chaozhou_tea_1793294729279.jpg": [
        "Gongfu tea",
        "Chinese tea ceremony gaiwan",
    ],
    "chaozhou_live_teochew_opera_1793294564378.jpg": [
        "Teochew opera",
        "Chaozhou opera",
    ],
    "chaozhou_goose_1793294744410.jpg": [
        "braised goose Chinese",
        "Chaozhou cuisine",
    ],
    "orange_hotel_chaozhou_1793349228049.jpg": [
        "hotel room interior modern China",
        "hotel guest room China",
    ],
    "orange_hotel_chaozhou_1793352768687.jpg": [
        "hotel twin room China",
        "Chaozhou Fengxi",
    ],
}

# --------------------------------------------------------------------------- #
# HTTP
# --------------------------------------------------------------------------- #

def fetch_bytes(
    url: str,
    headers: dict[str, str] | None = None,
    timeout: int = TIMEOUT,
    attempts: int = RETRIES,
) -> bytes:
    """GET a URL with retry/backoff on transient errors."""
    request_headers = {"User-Agent": USER_AGENT, **(headers or {})}
    last_error: Exception | None = None

    for attempt in range(attempts):
        request = urllib.request.Request(url, headers=request_headers)
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                return response.read()
        except urllib.error.HTTPError as exc:
            last_error = exc
            retryable = exc.code in (408, 425, 429, 500, 502, 503, 504)
            if not retryable or attempt == attempts - 1:
                raise
        except Exception as exc:  # noqa: BLE001 - network layer varies
            last_error = exc
            if attempt == attempts - 1:
                raise

        wait = 1.5 * (2 ** attempt)
        print(f"          ↻ retrying in {wait:.1f}s ({last_error})")
        time.sleep(wait)

    raise last_error or RuntimeError("request failed")


def fetch_json(url: str, headers: dict[str, str] | None = None) -> dict:
    raw = fetch_bytes(url, {"Accept": "application/json", **(headers or {})})
    return json.loads(raw.decode("utf-8", "replace"))


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #

def strip_html(value: object) -> str:
    text = re.sub(r"<[^>]+>", "", html.unescape(str(value or "")))
    return re.sub(r"\s+", " ", text).strip()


def sniff_image(data: bytes) -> str | None:
    """Return 'jpg' | 'png' | 'webp' if the payload looks like a real image."""
    if not data or len(data) < MIN_BYTES:
        return None
    if data[:3] == b"\xff\xd8\xff":
        return "jpg"
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "png"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "webp"
    return None


def expected_format(filename: str) -> str:
    suffix = Path(filename).suffix.lower().lstrip(".")
    return "jpg" if suffix == "jpeg" else suffix


def first_og_image(page_html: str) -> str | None:
    patterns = (
        r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)',
        r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image',
    )
    for pattern in patterns:
        match = re.search(pattern, page_html, re.I | re.S)
        if match:
            return html.unescape(match.group(1))
    return None


def auto_query(filename: str) -> str:
    """chen_clan_hall_1793290741668.jpg -> 'chen clan hall'"""
    stem = Path(filename).stem
    stem = re.sub(r"_\d{10,}$", "", stem)   # drop the timestamp
    stem = re.sub(r"_+", " ", stem).strip()
    return stem or Path(filename).stem


def queries_for(filename: str) -> list[str]:
    return QUERY_OVERRIDES.get(filename) or [auto_query(filename)]


# --------------------------------------------------------------------------- #
# Discovery
# --------------------------------------------------------------------------- #

def discover_referenced_images() -> list[str]:
    """Scan the source tree for assets/images/<name> references."""
    referenced: set[str] = set()

    if not SRC_DIR.exists():
        return []

    for path in sorted(SRC_DIR.rglob("*")):
        if path.suffix.lower() not in (".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".html"):
            continue
        try:
            text = path.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        for match in IMAGE_EXT_RE.finditer(text):
            referenced.add(match.group(1).replace(" ", "_"))

    return sorted(referenced)


def find_orphans(referenced: list[str]) -> list[str]:
    """Files present in public/assets/images/ that nothing references."""
    if not PUBLIC_DIR.exists():
        return []
    known = set(referenced)
    return sorted(
        path.name
        for path in PUBLIC_DIR.iterdir()
        if path.is_file()
        and path.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp")
        and path.name not in known
    )

# --------------------------------------------------------------------------- #
# Sources
# --------------------------------------------------------------------------- #

def search_commons(query: str, limit: int = 8) -> list[dict]:
    params = {
        "action": "query",
        "format": "json",
        "formatversion": "2",
        "generator": "search",
        "gsrnamespace": "6",                     # File: namespace
        "gsrlimit": str(limit),
        "gsrsearch": f"filetype:bitmap {query}",
        "prop": "imageinfo",
        "iiprop": "url|extmetadata|size|mime",
        "iiextmetadatafilter": "LicenseShortName|Artist|LicenseUrl|ObjectName",
        "iiurlwidth": str(TARGET_WIDTH),
    }
    url = f"{COMMONS_API}?{urllib.parse.urlencode(params)}"

    try:
        data = fetch_json(url)
    except Exception as exc:  # noqa: BLE001
        print(f"          ! commons query failed: {exc}")
        return []

    pages = (data.get("query") or {}).get("pages") or []
    candidates: list[dict] = []

    for page in pages:
        info = (page.get("imageinfo") or [{}])[0]
        thumb = info.get("thumburl") or info.get("url")
        width = info.get("thumbwidth") or info.get("width") or 0
        mime = info.get("mime") or ""

        if not thumb or width < MIN_WIDTH:
            continue
        if mime and mime not in ("image/jpeg", "image/png", "image/webp"):
            continue

        meta = info.get("extmetadata") or {}
        candidates.append(
            {
                "title": strip_html(
                    (meta.get("ObjectName") or {}).get("value") or page.get("title")
                ),
                "url": thumb,
                "page": info.get("descriptionurl") or page.get("title") or "",
                "author": strip_html((meta.get("Artist") or {}).get("value")) or "Unknown",
                "license": strip_html((meta.get("LicenseShortName") or {}).get("value"))
                or "See page",
                "license_url": strip_html((meta.get("LicenseUrl") or {}).get("value")),
                "source": "commons",
            }
        )

    # Prefer JPEG (smallest, most compatible) then everything else.
    candidates.sort(key=lambda c: 0 if c["url"].lower().endswith((".jpg", ".jpeg")) else 1)
    return candidates


def search_trip(query: str) -> list[dict]:
    """Best-effort Trip.com scrape. Returns [] when blocked (common)."""
    url = "https://www.trip.com/things-to-do/search/?" + urllib.parse.urlencode(
        {"keyword": query}
    )
    try:
        page = fetch_bytes(
            url,
            {"Accept": "text/html", "Accept-Language": "en-US,en;q=0.9"},
            attempts=1,
        ).decode("utf-8", "replace")
    except Exception as exc:  # noqa: BLE001
        print(f"          ! trip.com unavailable ({exc})")
        return []

    image = first_og_image(page)
    if not image:
        print("          ! trip.com returned no usable image")
        return []

    return [
        {
            "title": query,
            "url": image,
            "page": url,
            "author": "Trip.com (verify licence)",
            "license": "All rights reserved — reference only",
            "license_url": "",
            "source": "trip",
        }
    ]


def search_tripadvisor(query: str) -> list[dict]:
    """Best-effort TripAdvisor scrape. Returns [] when blocked (common)."""
    url = "https://www.tripadvisor.com/Search?" + urllib.parse.urlencode({"q": query})
    try:
        page = fetch_bytes(
            url,
            {"Accept": "text/html", "Accept-Language": "en-US,en;q=0.9"},
            attempts=1,
        ).decode("utf-8", "replace")
    except Exception as exc:  # noqa: BLE001
        print(f"          ! tripadvisor unavailable ({exc})")
        return []

    image = first_og_image(page)
    if not image:
        print("          ! tripadvisor returned no usable image")
        return []

    return [
        {
            "title": query,
            "url": image,
            "page": url,
            "author": "TripAdvisor (verify licence)",
            "license": "All rights reserved — reference only",
            "license_url": "",
            "source": "tripadvisor",
        }
    ]


SEARCHERS = {
    "commons": search_commons,
    "trip": search_trip,
    "tripadvisor": search_tripadvisor,
}

# --------------------------------------------------------------------------- #
# Download
# --------------------------------------------------------------------------- #

def save_candidate(candidate: dict, target: Path) -> str:
    """Download one candidate to `target`; raise ValueError if unusable."""
    data = fetch_bytes(
        candidate["url"],
        {"Accept": "image/*,*/*", "Referer": candidate.get("page") or COMMONS_API},
    )
    kind = sniff_image(data)
    if not kind:
        raise ValueError(f"not a usable image ({len(data)} bytes)")
    target.write_bytes(data)
    return kind


def candidate_paths(out_dir: Path, filename: str, index: int, kind: str) -> Path:
    """First candidate keeps the app filename; extras get an __altN suffix."""
    stem = Path(filename).stem
    expected = expected_format(filename)

    if kind != expected:
        # Wrong container: never hand a PNG to the app under a .jpg name.
        return out_dir / f"{stem}__{kind}.{kind}"
    if index == 0:
        return out_dir / filename
    return out_dir / f"{stem}__alt{index}.{expected}"


# --------------------------------------------------------------------------- #
# Reporting
# --------------------------------------------------------------------------- #

def write_reports(out_dir: Path, results: list[dict]) -> None:
    """Merge credits across runs and write credits.json + README.md."""
    credits_path = out_dir / "credits.json"
    existing: dict = {}
    if credits_path.exists():
        try:
            existing = json.loads(credits_path.read_text(encoding="utf-8"))
        except Exception:  # noqa: BLE001
            existing = {}

    merged = dict(existing)
    for result in results:
        if result.get("saved_as"):
            merged[result["saved_as"]] = {
                "targetFile": result["target"],
                "title": result.get("title", ""),
                "page": result.get("page", ""),
                "author": result.get("author", "Unknown"),
                "license": result.get("license", "See page"),
                "licenseUrl": result.get("license_url", ""),
                "source": result.get("source", ""),
                "fetchedAt": time.strftime("%Y-%m-%dT%H:%M:%S"),
            }

    credits_path.write_text(
        json.dumps(merged, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )

    lines = [
        "# Image review folder",
        "",
        "Candidates downloaded by `scripts/fetch_images.py`.",
        "Nothing here has been copied into the app yet.",
        "",
        "## Reviewing",
        "",
        "1. Open the images in this folder and judge each one.",
        "2. Copy the ones you approve into the app:",
        "",
        "```",
        "cp scripts/review-downloads/<file>.jpg public/assets/images/",
        "cp scripts/review-downloads/<file>.jpg src/assets/images/",
        "```",
        "",
        "3. Files ending in `__alt1`, `__alt2`, `__png`, `__webp` are alternatives —",
        "   only copy one per target, renamed back to the plain filename.",
        "",
    ]

    saved = [r for r in results if r.get("saved_as")]
    if saved:
        lines += [
            "## Downloaded this run",
            "",
            "| Target | Saved as | Source | Author | Licence |",
            "| ------ | -------- | ------ | ------ | ------- |",
        ]
        for result in sorted(saved, key=lambda r: r["target"]):
            page = result.get("page") or ""
            target = f"`{result['target']}`"
            if page:
                target = f"[{target}]({page})"
            lines.append(
                "| {target} | `{saved}` | {source} | {author} | {licence} |".format(
                    target=target,
                    saved=result["saved_as"],
                    source=result.get("source", "-"),
                    author=result.get("author", "-"),
                    licence=result.get("license", "-"),
                )
            )
        lines.append("")

    failures = [r for r in results if not r.get("saved_as")]
    if failures:
        lines += ["## No usable image found", ""]
        for result in sorted(failures, key=lambda r: r["target"]):
            reason = result.get("reason") or "no candidate matched"
            lines.append(f"- `{result['target']}` — {reason}")
            lines.append(f"  queries tried: {', '.join(result.get('queries', []))}")
        lines.append("")

    (out_dir / "README.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


# --------------------------------------------------------------------------- #
# CLI
# --------------------------------------------------------------------------- #

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Download candidate images for the Guangdong travel guide "
        "into a review folder (never into the app folders)."
    )
    parser.add_argument("--only", default=None, help="substring filter on filenames")
    parser.add_argument("--list", action="store_true", help="list targets and exit")
    parser.add_argument(
        "--verify-only",
        action="store_true",
        help="report missing referenced images and orphans, then exit",
    )
    parser.add_argument(
        "--out-dir",
        default=str(DEFAULT_OUT_DIR),
        help="where to save candidates (default: scripts/review-downloads)",
    )
    parser.add_argument(
        "--sources",
        default="commons",
        help="comma-separated: commons,trip,tripadvisor",
    )
    parser.add_argument(
        "--candidates",
        type=int,
        default=1,
        metavar="N",
        help="save up to N options per target (default 1)",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="re-download targets already present in the output folder",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()

    sources = [s.strip() for s in args.sources.split(",") if s.strip()]
    unknown = [s for s in sources if s not in SEARCHERS]
    if unknown:
        print(f"error: unknown source(s): {', '.join(unknown)}", file=sys.stderr)
        return 2
    if args.candidates < 1:
        print("error: --candidates must be >= 1", file=sys.stderr)
        return 2

    referenced = discover_referenced_images()
    if not referenced:
        print(
            "error: no assets/images/*.jpg references found under src/.\n"
            "       Are you running this from the repository root?",
            file=sys.stderr,
        )
        return 2

    orphans = find_orphans(referenced)
    targets = [name for name in referenced if not args.only or args.only in name]

    # --list ---------------------------------------------------------------
    if args.list:
        print(f"{len(referenced)} referenced image(s); {len(targets)} selected.\n")
        for name in targets:
            present = "✓" if (PUBLIC_DIR / name).exists() else "·"
            origin = "override" if name in QUERY_OVERRIDES else "auto"
            print(f"  {present} {name}")
            print(f"      [{origin}] {', '.join(queries_for(name))}")
        if orphans:
            print("\nUnreferenced files in public/assets/images/ (orphans):")
            for name in orphans:
                print(f"  - {name}")
        return 0

    # --verify-only --------------------------------------------------------
    if args.verify_only:
        missing = [n for n in referenced if not (PUBLIC_DIR / n).exists()]
        print(f"Referenced: {len(referenced)}  present: {len(referenced) - len(missing)}")
        if missing:
            print("\nMissing from public/assets/images/:")
            for name in missing:
                print(f"  ✗ {name}")
        if orphans:
            print("\nOrphans in public/assets/images/ (not referenced anywhere):")
            for name in orphans:
                print(f"  ? {name}")
        if not missing and not orphans:
            print("\nEverything referenced exists; no orphans. Nothing to do.")
        return 0

    # ----------------------------------------------------------------------
    out_dir = Path(args.out_dir).expanduser().resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"Referenced images : {len(referenced)}")
    print(f"Selected          : {len(targets)}")
    if orphans:
        print(f"Orphans skipped   : {len(orphans)}  (see --list)")
    print(f"Output folder     : {out_dir}")
    print(f"Sources           : {', '.join(sources)}")
    print(f"Options per target: {args.candidates}\n")

    results: list[dict] = []
    downloaded = skipped = failed = 0

    try:
        for position, filename in enumerate(targets, 1):
            prefix = f"[{position:>2}/{len(targets)}]"
            queries = queries_for(filename)
            record = {"target": filename, "queries": queries, "saved_as": None}

            already = (out_dir / filename).exists()
            if already and not args.overwrite:
                print(f"{prefix} … {filename} (already downloaded)")
                skipped += 1
                continue

            print(f"{prefix} → {filename}")

            saved_count = 0
            tried_urls: set[str] = set()
            reasons: list[str] = []

            for source_name in sources:
                if saved_count >= args.candidates:
                    break

                searcher = SEARCHERS[source_name]
                found_any = False

                for query in queries:
                    if saved_count >= args.candidates:
                        break

                    print(f"          search [{source_name}]: {query}")
                    try:
                        candidates = searcher(query)
                    except Exception as exc:  # noqa: BLE001
                        reasons.append(f"{source_name}: {exc}")
                        continue

                    if not candidates:
                        continue
                    found_any = True

                    for candidate in candidates:
                        if saved_count >= args.candidates:
                            break
                        if candidate["url"] in tried_urls:
                            continue
                        tried_urls.add(candidate["url"])

                        # Peek at the format before committing to a filename.
                        try:
                            data = fetch_bytes(
                                candidate["url"],
                                {
                                    "Accept": "image/*,*/*",
                                    "Referer": candidate.get("page") or COMMONS_API,
                                },
                            )
                        except Exception as exc:  # noqa: BLE001
                            print(f"          ✗ download failed: {exc}")
                            reasons.append(str(exc))
                            continue

                        kind = sniff_image(data)
                        if not kind:
                            print(f"          ✗ not a usable image ({len(data)} bytes)")
                            reasons.append("invalid image payload")
                            continue

                        destination = candidate_paths(
                            out_dir, filename, saved_count, kind
                        )
                        destination.write_bytes(data)

                        size_kb = destination.stat().st_size // 1024
                        print(f"          ✓ saved {destination.name} ({kind}, {size_kb} KB)")
                        print(f"            {candidate.get('title') or candidate['url']}")
                        print(f"            licence: {candidate.get('license', 'unknown')}")

                        record.update(
                            {
                                "saved_as": destination.name,
                                "title": candidate.get("title", ""),
                                "page": candidate.get("page", ""),
                                "author": candidate.get("author", "Unknown"),
                                "license": candidate.get("license", "See page"),
                                "license_url": candidate.get("license_url", ""),
                                "source": candidate.get("source", source_name),
                            }
                        )
                        results.append(dict(record))
                        saved_count += 1

                    time.sleep(REQUEST_DELAY)

                if found_any and saved_count == 0:
                    print(f"          ✗ {source_name} results all unusable")

            if saved_count == 0:
                record["reason"] = reasons[0] if reasons else "no candidate matched"
                results.append(record)
                print("          ✗ nothing usable for this target")
                failed += 1
            else:
                downloaded += 1

            time.sleep(REQUEST_DELAY)

    except KeyboardInterrupt:
        print("\n\nInterrupted — writing reports for what was downloaded so far…")
        results = [r for r in results if r.get("saved_as")] + [
            r for r in results if not r.get("saved_as")
        ]

    write_reports(out_dir, results)

    print(f"\nDone: {downloaded} target(s) with images, {skipped} skipped, {failed} failed.")
    print(f"Review:    {out_dir / 'README.md'}")
    print(f"Credits:   {out_dir / 'credits.json'}")
    print("\nNothing was written to public/assets/images/ or src/assets/images/.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
