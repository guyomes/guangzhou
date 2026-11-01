#!/usr/bin/env python3
"""Recover French and (auto-translated) Chinese Wikipedia links for places.

For each place the script resolves:

  * the French Wikipedia article (exact title first, then the first search
    result, then an English -> Wikidata fallback), and
  * the Chinese Wikipedia article through Wikidata's interlanguage links,
    rendered through the Google Translate proxy with `_x_tr_sl=auto` and
    `_x_tr_tl=fr`.

If no Chinese sitelink exists on Wikidata, the script falls back to a
full-text search on zh.wikipedia.org.

Usage
-----
    python scripts/fetch_wikipedia_links.py places.json
    python scripts/fetch_wikipedia_links.py places.txt -o places.wikipedia.json

Input
-----
Accept `.json` (a list of strings, a list of objects, or an object mapping
place name -> metadata), or `.txt` / anything else (one place per line,
`#` comments allowed).

Output
------
A JSON file next to the input (or `-o`), one entry per place, with
`fr_title`, `fr_url`, `zh_title`, `zh_url`, `wikidata` and `en_title` keys.
"""

from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any

USER_AGENT = "place-wikipedia-links/1.0 (contact@example.invalid)"
TIMEOUT = 20
RETRIES = 3
DEFAULT_PAUSE = 0.2

FR_WIKI_API = "https://fr.wikipedia.org/w/api.php"
EN_WIKI_API = "https://en.wikipedia.org/w/api.php"
ZH_WIKI_API = "https://zh.wikipedia.org/w/api.php"
WIKIDATA_API = "https://www.wikidata.org/w/api.php"

FR_ARTICLE_BASE = "https://fr.wikipedia.org/wiki/"
ZH_TRANSLATE_BASE = "https://zh-wikipedia-org.translate.goog/wiki/"
ZH_TRANSLATE_QUERY = "?_x_tr_sl=auto&_x_tr_tl=fr"

_PAUSE = DEFAULT_PAUSE

_QID_CACHE: dict[tuple[str, str], str | None] = {}
_SITELINK_CACHE: dict[tuple[str, str], str | None] = {}


# ---------------------------------------------------------------------------
# HTTP helpers
# ---------------------------------------------------------------------------

def http_get_json(url: str, attempts: int = RETRIES) -> dict[str, Any]:
    last_exc: Exception | None = None
    for attempt in range(1, attempts + 1):
        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": USER_AGENT, "Accept": "application/json"},
            )
            with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            last_exc = exc
            time.sleep(1.0 * attempt)
    raise RuntimeError(f"Request failed after {attempts} attempts: {url}") from last_exc


def api_get(api_url: str, params: dict[str, Any]) -> dict[str, Any]:
    query = urllib.parse.urlencode(
        {**params, "format": "json", "formatversion": "2"}
    )
    data = http_get_json(f"{api_url}?{query}")
    if _PAUSE > 0:
        time.sleep(_PAUSE)
    return data


# ---------------------------------------------------------------------------
# Wikipedia / Wikidata lookups
# ---------------------------------------------------------------------------

def exact_title(api_url: str, term: str) -> str | None:
    data = api_get(api_url, {"action": "query", "titles": term, "redirects": 1})
    for page in data.get("query", {}).get("pages", []):
        if "missing" in page:
            continue
        title = page.get("title")
        if title:
            return title
    return None


def search_title(api_url: str, term: str) -> str | None:
    data = api_get(
        api_url,
        {
            "action": "query",
            "list": "search",
            "srsearch": term,
            "srlimit": 1,
            "srnamespace": 0,
        },
    )
    hits = data.get("query", {}).get("search", [])
    if hits:
        return hits[0].get("title")
    return None


def lookup_title(api_url: str, candidates: list[str]) -> str | None:
    for term in candidates:
        title = exact_title(api_url, term)
        if title:
            return title
    for term in candidates:
        title = search_title(api_url, term)
        if title:
            return title
    return None


def get_qid(api_url: str, title: str) -> str | None:
    key = (api_url, title)
    if key in _QID_CACHE:
        return _QID_CACHE[key]
    data = api_get(
        api_url,
        {
            "action": "query",
            "titles": title,
            "prop": "pageprops",
            "ppprop": "wikibase_item",
            "redirects": 1,
        },
    )
    qid: str | None = None
    for page in data.get("query", {}).get("pages", []):
        if "missing" in page:
            continue
        qid = page.get("pageprops", {}).get("wikibase_item")
        if qid:
            break
    _QID_CACHE[key] = qid
    return qid


def get_sitelink(qid: str, site: str) -> str | None:
    key = (qid, site)
    if key in _SITELINK_CACHE:
        return _SITELINK_CACHE[key]
    data = api_get(
        WIKIDATA_API,
        {
            "action": "wbgetentities",
            "ids": qid,
            "props": "sitelinks",
            "sitefilter": site,
        },
    )
    entity = data.get("entities", {}).get(qid, {})
    title = entity.get("sitelinks", {}).get(site, {}).get("title")
    _SITELINK_CACHE[key] = title
    return title


# ---------------------------------------------------------------------------
# URL builders
# ---------------------------------------------------------------------------

def fr_url(title: str) -> str:
    slug = urllib.parse.quote(title.replace(" ", "_"), safe="")
    return f"{FR_ARTICLE_BASE}{slug}"


def zh_url(title: str) -> str:
    slug = urllib.parse.quote(title.replace(" ", "_"), safe="")
    return f"{ZH_TRANSLATE_BASE}{slug}{ZH_TRANSLATE_QUERY}"


# ---------------------------------------------------------------------------
# Per-place resolution
# ---------------------------------------------------------------------------

_CANDIDATE_KEYS = (
    "name",
    "title",
    "name_en",
    "name_fr",
    "en",
    "fr",
    "en_title",
    "fr_title",
)


def candidate_terms(place: dict[str, Any]) -> list[str]:
    seen: set[str] = set()
    terms: list[str] = []
    for key in _CANDIDATE_KEYS:
        value = place.get(key)
        if isinstance(value, str) and value.strip():
            term = value.strip()
            if term not in seen:
                seen.add(term)
                terms.append(term)
    return terms


def resolve_place(place: dict[str, Any]) -> dict[str, Any]:
    candidates = candidate_terms(place)

    fr_title: str | None = place.get("fr_title") or place.get("wikipedia_fr")
    en_title: str | None = place.get("en_title") or place.get("wikipedia_en")
    zh_title: str | None = place.get("zh_title") or place.get("wikipedia_zh")
    qid: str | None = None

    # 1. Direct French lookup (exact title, then first search hit).
    if not fr_title:
        fr_title = lookup_title(FR_WIKI_API, candidates)

    # 2. Fallback: English Wikipedia -> Wikidata -> French sitelink.
    if not fr_title:
        if not en_title:
            en_title = lookup_title(EN_WIKI_API, candidates)
        if en_title:
            qid = get_qid(EN_WIKI_API, en_title)
            if qid:
                fr_title = get_sitelink(qid, "frwiki")

    # 3. Wikidata id from the French article (if still unknown).
    if not qid and fr_title:
        qid = get_qid(FR_WIKI_API, fr_title)

    # 4. English title from Wikidata (helps the Chinese fallback search).
    if not en_title and qid:
        en_title = get_sitelink(qid, "enwiki")

    # 5. Chinese article via Wikidata interlanguage link.
    if not zh_title and qid:
        zh_title = get_sitelink(qid, "zhwiki")

    # 6. Last resort: Chinese full-text search.
    if not zh_title:
        zh_candidates: list[str] = list(candidates)
        if en_title:
            zh_candidates.insert(0, en_title)
        if fr_title:
            zh_candidates.append(fr_title)
        zh_title = lookup_title(ZH_WIKI_API, zh_candidates)

    result = dict(place)
    result["fr_title"] = fr_title
    result["fr_url"] = fr_url(fr_title) if fr_title else None
    result["zh_title"] = zh_title
    result["zh_url"] = zh_url(zh_title) if zh_title else None
    result["wikidata"] = qid
    result["en_title"] = en_title
    return result


# ---------------------------------------------------------------------------
# Input / output
# ---------------------------------------------------------------------------

def normalize_entry(entry: Any) -> dict[str, Any]:
    if isinstance(entry, str):
        return {"name": entry.strip()}
    if isinstance(entry, dict):
        return dict(entry)
    raise SystemExit(f"Unsupported input entry: {entry!r}")


def load_places(path: Path) -> list[dict[str, Any]]:
    if not path.exists():
        raise SystemExit(f"Input file not found: {path}")

    text = path.read_text(encoding="utf-8")
    if path.suffix.lower() == ".json":
        data = json.loads(text)
        if isinstance(data, list):
            return [normalize_entry(item) for item in data]
        if isinstance(data, dict):
            items: list[dict[str, Any]] = []
            for name, info in data.items():
                if isinstance(info, dict):
                    item = {"name": name, **info}
                else:
                    item = {"name": name}
                items.append(item)
            return items
        raise SystemExit("JSON input must be a list or an object")

    return [
        {"name": line.strip()}
        for line in text.splitlines()
        if line.strip() and not line.strip().startswith("#")
    ]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Recover French and Chinese Wikipedia links for places."
    )
    parser.add_argument(
        "input",
        type=Path,
        help="Input file (.json or one-name-per-line .txt).",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        help="Output JSON file (default: <input>.wikipedia.json).",
    )
    parser.add_argument(
        "--pause",
        type=float,
        default=DEFAULT_PAUSE,
        help=f"Seconds to sleep between API calls (default: {DEFAULT_PAUSE}).",
    )
    return parser.parse_args()


def main() -> int:
    global _PAUSE
    args = parse_args()
    _PAUSE = max(0.0, args.pause)

    places = load_places(args.input)
    if not places:
        print("No places found in input file.", file=sys.stderr)
        return 1

    results: list[dict[str, Any]] = []
    total = len(places)
    for index, place in enumerate(places, start=1):
        name = (
            place.get("name")
            or place.get("title")
            or f"place-{index}"
        )
        print(f"[{index}/{total}] {name}", file=sys.stderr)
        try:
            result = resolve_place(place)
        except Exception as exc:  # keep going on individual failures
            result = dict(place)
            result["error"] = str(exc)
        result.setdefault("name", name)
        results.append(result)

    output = args.output or args.input.with_suffix(".wikipedia.json")
    output.write_text(
        json.dumps(results, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    missing_fr = sum(1 for r in results if not r.get("fr_title"))
    missing_zh = sum(1 for r in results if not r.get("zh_title"))
    print(f"Wrote {len(results)} entries to {output}", file=sys.stderr)
    print(
        f"Missing French: {missing_fr}, missing Chinese: {missing_zh}",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
