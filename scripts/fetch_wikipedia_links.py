#!/usr/bin/env python3
"""Recover French and (auto-translated) Chinese Wikipedia links for places.

Input
-----
The script accepts:

  * a data module in the same shape as ``src/data/guangzhouData.ts`` or
    ``src/data/citiesData.ts`` — every top-level array declaration whose
    variable name ends with ``_ATTACTIONS`` is parsed, so
    ``RAW_GUANGZHOU_ATTACTIONS``, ``SHENZHEN_ATTACTIONS``,
    ``SHANTOU_ATTACTIONS``, ``CHAOZHOU_ATTACTIONS`` are all picked up from a
    single file. Relative ``import … from './…'`` statements are followed,
    letting a file like ``citiesData.ts`` be used on its own even though
    Guangzhou lives in ``guangzhouData.ts``.
  * a ``.json`` file (list of strings, list of objects, or an object mapping
    place name -> metadata), or
  * a plain text file with one place per line (``#`` comments allowed).

Resolution
----------
For each place the script resolves:

  * the French Wikipedia article (exact title first, then an ``intitle:``
    search, then a city/country-scoped search, then an English -> Wikidata
    fallback), and
  * the Chinese Wikipedia article through, in order: an existing hint, an
    exact-title hit, the Wikidata interlanguage link, a scoped search, and
    finally a scan of the district's Chinese Wikipedia page, rendered through
    the Google Translate proxy with ``_x_tr_sl=auto`` and ``_x_tr_tl=fr``.

Every candidate is verified against Wikidata by walking its ``P131``
("located in the administrative territorial entity") chain up to a few hops:

  * a candidate whose chain reaches the target city or Guangdong is accepted,
  * a candidate whose chain reaches China without those is only accepted when
    its title also contains the search name,
  * a candidate whose ``P17`` (country) is set to something other than China
    is rejected outright.

In addition, a candidate whose Wikidata item is the *district* the place
belongs to is discarded (so that e.g. the Chinese page for Baomo Garden never
comes back as the article about Panyu District). When no article is found this
way and the district page is available, the script scans the district page's
wikitext for a ``[[…]]`` link whose target or label matches the place name and
uses that target as the article title. Once a Chinese article is known, a
French title is fetched from its Wikidata ``frwiki`` sitelink if none was
found earlier.

Output
------
For ``.ts`` / ``.js`` inputs the script edits the source files *in place* by
default, adding the following fields to every place object literal:
``fr_title``, ``fr_url``, ``zh_title``, ``zh_url``, ``en_title``,
``wikidata``, ``fr_verdict``, ``zh_verdict``, ``fr_via`` and ``zh_via``.
All imported source files (reached through ``import … from './…'``) are
edited too. Use ``--dry-run`` to preview the changes without writing.

When ``-o`` is provided, the results are written to a single file instead:
a ``.ts``/``.js`` path produces a self-contained flat array, any other path
produces JSON. Non-``.ts`` inputs always produce JSON next to the input
(``<input>.wikipedia.json``) unless ``-o`` is given.

Usage
-----
    python scripts/fetch_wikipedia_links.py src/data/citiesData.ts
    python scripts/fetch_wikipedia_links.py src/data/citiesData.ts --dry-run
    python scripts/fetch_wikipedia_links.py src/data/citiesData.ts -o enriched.ts
    python scripts/fetch_wikipedia_links.py places.json -o places.wikipedia.json
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Iterable

USER_AGENT = "place-wikipedia-links/1.6 (contact@example.invalid)"
TIMEOUT = 20
RETRIES = 3
DEFAULT_PAUSE = 0.2
SEARCH_RESULTS = 5

FR_WIKI_API = "https://fr.wikipedia.org/w/api.php"
EN_WIKI_API = "https://en.wikipedia.org/w/api.php"
ZH_WIKI_API = "https://zh.wikipedia.org/w/api.php"
WIKIDATA_API = "https://www.wikidata.org/w/api.php"

FR_ARTICLE_BASE = "https://fr.wikipedia.org/wiki/"
ZH_TRANSLATE_BASE = "https://zh-wikipedia-org.translate.goog/wiki/"
ZH_TRANSLATE_QUERY = "?_x_tr_sl=auto&_x_tr_tl=fr"

JS_SUFFIXES = {".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"}

CHINA_QID = "Q148"
GUANGDONG_QID = "Q15126"

CITY_QIDS: dict[str, str] = {
    "guangzhou": "Q16572",
    "shenzhen": "Q15174",
    "shantou": "Q59112",
    "chaozhou": "Q59239",
}

CITY_NAMES: dict[str, dict[str, list[str]]] = {
    "guangzhou": {
        "fr": ["Canton", "Guangzhou"],
        "en": ["Guangzhou", "Canton"],
        "zh": ["广州", "广州市"],
    },
    "shenzhen": {
        "fr": ["Shenzhen"],
        "en": ["Shenzhen"],
        "zh": ["深圳", "深圳市"],
    },
    "shantou": {
        "fr": ["Shantou", "Swatow"],
        "en": ["Shantou", "Swatow"],
        "zh": ["汕头", "汕头市"],
    },
    "chaozhou": {
        "fr": ["Chaozhou"],
        "en": ["Chaozhou"],
        "zh": ["潮州", "潮州市"],
    },
}

COUNTRY_TERMS: dict[str, list[str]] = {
    "fr": ["Chine"],
    "en": ["China"],
    "zh": ["中国"],
}

_WIKI_SKIP_PREFIXES = (
    "file:",
    "image:",
    "category:",
    "template:",
    "wikipedia:",
    "wp:",
    "help:",
    "portal:",
    "special:",
    "module:",
    "user:",
    "talk:",
    "mediawiki:",
    "draft:",
)

# Suffix of the top-level arrays we collect from data modules.
_ATTRA_SUFFIX = "_ATTACTIONS"

# Matches `<kw> NAME: <Type> = [` where `<kw>` is `const`, `let`, or `var`
# (optionally preceded by `export`). Anchored to the start of a line so that
# indented object-literal fields such as `    scores: [` are never matched.
_VAR_ARRAY_ASSIGN_RE = re.compile(
    r"^(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][A-Za-z0-9_$]*)"
    r"\s*(?::\s*[^=;{}\n]+?)?\s*=\s*\[",
    re.MULTILINE,
)

# Matches `from './relative/path'` in import statements.
_REL_IMPORT_RE = re.compile(r"\bfrom\s+['\"](\.[^'\"]+)['\"]")

# Fields that this script injects into every place object literal.
_EXTRA_FIELD_KEYS: tuple[str, ...] = (
    "fr_title",
    "fr_url",
    "zh_title",
    "zh_url",
    "en_title",
    "wikidata",
    "fr_verdict",
    "zh_verdict",
    "fr_via",
    "zh_via",
)

# Matches a single line of one of our generated fields (indented anywhere).
_GENERATED_FIELD_RE = re.compile(
    r"^[ \t]*(?:" + "|".join(_EXTRA_FIELD_KEYS) + r")\s*:[^\n]*\n?",
    re.MULTILINE,
)

_PAUSE = DEFAULT_PAUSE
_VERBOSE = False

_QID_CACHE: dict[tuple[str, str], str | None] = {}
_SITELINK_CACHE: dict[tuple[str, str], str | None] = {}
_P17_CACHE: dict[str, list[str]] = {}
_P131_CACHE: dict[str, list[str]] = {}
_DISTRICT_QID_CACHE: dict[str, str | None] = {}


def _log(message: str) -> None:
    if _VERBOSE:
        print(f"  · {message}", file=sys.stderr)


def _chunks(items: list[str], size: int) -> Iterable[list[str]]:
    for start in range(0, len(items), size):
        yield items[start:start + size]


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
# Wikipedia / Wikidata page lookups
# ---------------------------------------------------------------------------

def _is_missing_page(page: dict[str, Any]) -> bool:
    if "missing" in page or "invalid" in page:
        return True
    if page.get("pageid") is None:
        return True
    return False


def exact_title(api_url: str, term: str) -> str | None:
    data = api_get(api_url, {"action": "query", "titles": term, "redirects": 1})
    for page in data.get("query", {}).get("pages", []):
        if _is_missing_page(page):
            continue
        title = page.get("title")
        if title:
            return title
    return None


def search_titles(api_url: str, term: str, limit: int = SEARCH_RESULTS) -> list[str]:
    data = api_get(
        api_url,
        {
            "action": "query",
            "list": "search",
            "srsearch": term,
            "srlimit": max(1, limit),
            "srnamespace": 0,
        },
    )
    hits = data.get("query", {}).get("search", [])
    return [hit.get("title") for hit in hits if hit.get("title")]


def fetch_wikitext(api_url: str, title: str) -> str | None:
    data = api_get(
        api_url,
        {
            "action": "query",
            "titles": title,
            "prop": "revisions",
            "rvslots": "main",
            "rvprop": "content",
            "rvlimit": 1,
            "redirects": 1,
        },
    )
    for page in data.get("query", {}).get("pages", []):
        if _is_missing_page(page):
            continue
        for rev in page.get("revisions", []) or []:
            slot = (rev.get("slots") or {}).get("main") or {}
            content = slot.get("content")
            if content:
                return content
    return None


def get_qids(api_url: str, titles: list[str]) -> dict[str, str]:
    wanted = [title for title in dict.fromkeys(titles) if title]
    results: dict[str, str] = {}
    if not wanted:
        return results

    for chunk in _chunks(wanted, 50):
        data = api_get(
            api_url,
            {
                "action": "query",
                "titles": "|".join(chunk),
                "prop": "pageprops",
                "ppprop": "wikibase_item",
                "redirects": 1,
            },
        )
        for page in data.get("query", {}).get("pages", []):
            if _is_missing_page(page):
                continue
            title = page.get("title")
            qid = page.get("pageprops", {}).get("wikibase_item")
            if title and qid:
                results[title] = qid
    return results


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
        if _is_missing_page(page):
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
# Wikidata location verification
# ---------------------------------------------------------------------------

def _claim_ids(claims: dict[str, Any], prop: str) -> list[str]:
    ids: list[str] = []
    for claim in claims.get(prop, []) or []:
        try:
            value = claim["mainsnak"]["datavalue"]["value"]
        except (KeyError, TypeError):
            continue
        if isinstance(value, dict) and value.get("id"):
            ids.append(value["id"])
    return ids


def _get_p17(qids: list[str]) -> None:
    wanted = [q for q in dict.fromkeys(qids) if q and q not in _P17_CACHE]
    if not wanted:
        return
    for chunk in _chunks(wanted, 50):
        data = api_get(
            WIKIDATA_API,
            {
                "action": "wbgetentities",
                "ids": "|".join(chunk),
                "props": "claims",
                "claims": "P17",
            },
        )
        for qid, entity in data.get("entities", {}).items():
            if qid not in wanted:
                continue
            if "missing" in entity:
                _P17_CACHE[qid] = []
                continue
            _P17_CACHE[qid] = _claim_ids(entity.get("claims", {}), "P17")


def _get_p131(qids: list[str]) -> None:
    wanted = [q for q in dict.fromkeys(qids) if q and q not in _P131_CACHE]
    if not wanted:
        return
    for chunk in _chunks(wanted, 50):
        data = api_get(
            WIKIDATA_API,
            {
                "action": "wbgetentities",
                "ids": "|".join(chunk),
                "props": "claims",
                "claims": "P131",
            },
        )
        for qid, entity in data.get("entities", {}).items():
            if qid not in wanted:
                continue
            if "missing" in entity:
                _P131_CACHE[qid] = []
                continue
            _P131_CACHE[qid] = _claim_ids(entity.get("claims", {}), "P131")


def _walk_ancestors(
    qid: str,
    target_qids: set[str],
    max_depth: int = 3,
) -> tuple[set[str], bool]:
    seen: set[str] = set()
    frontier = [qid]
    for _ in range(max_depth):
        if not frontier:
            break
        _get_p17(frontier)
        _get_p131(frontier)
        nxt: list[str] = []
        for q in frontier:
            parents = set(_P17_CACHE.get(q, ())) | set(_P131_CACHE.get(q, ()))
            for p in parents:
                if p in seen:
                    continue
                seen.add(p)
                if p in target_qids:
                    return seen, True
                nxt.append(p)
        frontier = nxt
    return seen, False


def classify_entity(qid: str | None, target_qids: set[str]) -> str:
    if not qid:
        return "unknown"
    _get_p17([qid])
    p17s = set(_P17_CACHE.get(qid, ()))
    if p17s and CHINA_QID not in p17s:
        return "foreign"

    if not target_qids:
        return "unknown"

    ancestors, hit = _walk_ancestors(qid, target_qids)
    if hit:
        if GUANGDONG_QID in ancestors or any(
            q in ancestors for q in target_qids if q != GUANGDONG_QID
        ):
            return "city"
        return "guangdong"
    if CHINA_QID in ancestors or CHINA_QID in p17s:
        return "other_china"
    return "unknown"


# ---------------------------------------------------------------------------
# Title matching (for the "weak" acceptance path)
# ---------------------------------------------------------------------------

_LATIN_WORD_RE = re.compile(r"\w+")
_CJK_RUN_RE = re.compile(r"[\u4e00-\u9fff]+")
_DISTRICT_SPLIT_RE = re.compile(r"[与和、及]")


def _title_matches(title: str, source_term: str) -> bool:
    if not title or not source_term:
        return False

    cjk_chunks = _CJK_RUN_RE.findall(source_term)
    if cjk_chunks:
        return any(chunk in title for chunk in cjk_chunks)

    tokens = [
        word
        for word in _LATIN_WORD_RE.findall(source_term.lower())
        if len(word) >= 4 and word.isalpha()
    ]
    if not tokens:
        return False
    lower = title.lower()
    matched = sum(1 for word in tokens if word in lower)
    return matched >= max(1, (len(tokens) * 2 + 2) // 3)


# ---------------------------------------------------------------------------
# District helpers
# ---------------------------------------------------------------------------

def district_zh_titles(place: dict[str, Any]) -> list[str]:
    raw = (
        place.get("districtCn")
        or place.get("district_cn")
        or place.get("districtZh")
        or place.get("district")
    )
    if not isinstance(raw, str) or not raw.strip():
        return []

    titles: list[str] = []
    for run in _CJK_RUN_RE.findall(raw):
        for part in _DISTRICT_SPLIT_RE.split(run):
            part = part.strip()
            if not part:
                continue
            if part.endswith(("区", "市", "县", "镇", "乡")):
                candidate = part
            else:
                candidate = part + "区"
            if candidate not in titles:
                titles.append(candidate)
    return titles


def _district_qids(place: dict[str, Any]) -> set[str]:
    qids: set[str] = set()
    for title in district_zh_titles(place):
        if title not in _DISTRICT_QID_CACHE:
            _DISTRICT_QID_CACHE[title] = get_qid(ZH_WIKI_API, title)
        qid = _DISTRICT_QID_CACHE[title]
        if qid:
            qids.add(qid)
    return qids


def is_district_placeholder(
    place: dict[str, Any],
    title: str | None,
    api_url: str,
) -> bool:
    if not title:
        return False
    for district in district_zh_titles(place):
        if title == district:
            return True
    district_qids = _district_qids(place)
    if not district_qids:
        return False
    qid = get_qid(api_url, title)
    return qid is not None and qid in district_qids


_WIKILINK_RE = re.compile(r"\[\[([^\[\]|]+?)(?:\|([^\[\]]*))?\]\]")
_DISTRICT_PAGE_ATTEMPT_LIMIT = 3


def _wikilinks(text: str) -> list[tuple[str, str]]:
    out: list[tuple[str, str]] = []
    for match in _WIKILINK_RE.finditer(text):
        target = match.group(1).strip()
        label = (match.group(2) or "").strip() or target
        if not target:
            continue
        out.append((target, label))
    return out


def _clean_link_target(target: str) -> str:
    return target.split("#", 1)[0].strip()


def _is_skipped_link(base: str) -> bool:
    if not base:
        return True
    if base.startswith(":"):
        return True
    lower = base.lower()
    return any(lower.startswith(prefix) for prefix in _WIKI_SKIP_PREFIXES)


def zh_title_from_district_page(
    place: dict[str, Any],
    target_qids: set[str],
) -> str | None:
    zh_terms = collect_terms(place, _ZH_NAME_KEYS)
    if not zh_terms:
        return None

    districts = district_zh_titles(place)
    if not districts:
        return None

    attempts = 0
    for district in districts:
        attempts += 1
        if attempts > _DISTRICT_PAGE_ATTEMPT_LIMIT:
            break
        page_title = exact_title(ZH_WIKI_API, district)
        if not page_title:
            _log(f"district page '{district}' not found on zh.wikipedia")
            continue
        text = fetch_wikitext(ZH_WIKI_API, page_title)
        if not text:
            _log(f"district page '{page_title}' has no wikitext")
            continue
        links = _wikilinks(text)
        _log(f"scanning {len(links)} links on '{page_title}'")

        for term in zh_terms:
            for raw_target, label in links:
                base = _clean_link_target(raw_target)
                if _is_skipped_link(base):
                    continue
                if base != term and label != term:
                    continue
                verdict = classify_entity(
                    get_qid(ZH_WIKI_API, base), target_qids
                )
                if verdict in ("city", "guangdong", "other_china", "unknown"):
                    _log(f"district-page hit for '{term}': '{base}' (exact)")
                    return base

        for term in zh_terms:
            for raw_target, label in links:
                base = _clean_link_target(raw_target)
                if _is_skipped_link(base):
                    continue
                if term not in base and term not in label:
                    continue
                verdict = classify_entity(
                    get_qid(ZH_WIKI_API, base), target_qids
                )
                if verdict in ("city", "guangdong"):
                    _log(f"district-page hit for '{term}': '{base}' ({verdict})")
                    return base

    return None


# ---------------------------------------------------------------------------
# Title resolution
# ---------------------------------------------------------------------------

def _intitle_safe(term: str) -> str:
    cleaned = re.sub(r'[&|(){}:;"\\/]+', " ", term)
    return " ".join(cleaned.split()).strip()


def lookup_title(
    api_url: str,
    terms: list[str],
    city_terms: list[str] | None = None,
    country_terms: list[str] | None = None,
    target_qids: set[str] | None = None,
) -> str | None:
    targets = target_qids or set()

    for term in terms:
        title = exact_title(api_url, term)
        if not title:
            continue
        qid = get_qid(api_url, title)
        verdict = classify_entity(qid, targets)
        if verdict in ("city", "guangdong", "unknown"):
            return title
        _log(f"exact match '{term}' -> '{title}' rejected ({verdict})")

    return search_title_with_context(
        api_url,
        terms,
        list(city_terms or []),
        list(country_terms or []),
        targets,
    )


def search_title_with_context(
    api_url: str,
    terms: list[str],
    city_terms: list[str],
    country_terms: list[str],
    target_qids: set[str],
) -> str | None:
    queries: list[tuple[str, str]] = []
    seen: set[str] = set()

    def add(query: str, source_term: str) -> None:
        if query and query not in seen:
            seen.add(query)
            queries.append((query, source_term))

    for term in terms:
        safe = _intitle_safe(term)
        if safe:
            add(f'intitle:"{safe}"', term)

    for term in terms:
        for city in city_terms:
            add(f"{term} {city}", term)
        for country in country_terms:
            add(f"{term} {country}", term)
        add(term, term)

    for query, source_term in queries:
        hits = search_titles(api_url, query)
        if not hits:
            continue
        qid_map = get_qids(api_url, hits)

        for hit in hits:
            verdict = classify_entity(qid_map.get(hit), target_qids)
            if verdict in ("city", "guangdong"):
                _log(f"search hit for '{query}': {hit} ({verdict})")
                return hit

        for hit in hits:
            verdict = classify_entity(qid_map.get(hit), target_qids)
            if verdict in ("unknown", "other_china") and _title_matches(
                hit, source_term
            ):
                _log(f"search hit for '{query}': {hit} ({verdict}, title match)")
                return hit

        _log(f"no verified hit for '{query}'")

    return None


def canonical_title(api_url: str, title: str) -> str | None:
    try:
        resolved = exact_title(api_url, title)
    except Exception:
        return title
    if resolved is None:
        _log(f"hinted title '{title}' is missing, falling back to search")
    return resolved


def verify_hint(
    api_url: str,
    title: str,
    target_qids: set[str],
) -> str | None:
    resolved = canonical_title(api_url, title)
    if not resolved:
        return None
    verdict = classify_entity(get_qid(api_url, resolved), target_qids)
    if verdict == "foreign":
        _log(f"hinted title '{resolved}' rejected ({verdict})")
        return None
    return resolved


# ---------------------------------------------------------------------------
# URL builders
# ---------------------------------------------------------------------------

def fr_url(title: str) -> str:
    slug = urllib.parse.quote(title.replace(" ", "_"), safe="")
    return f"{FR_ARTICLE_BASE}{slug}"


def zh_url(title: str) -> str:
    slug = urllib.parse.quote(title.replace(" ", "_"), safe="")
    return f"{ZH_TRANSLATE_BASE}{slug}{ZH_TRANSLATE_QUERY}"


def wiki_hint(place: dict[str, Any]) -> tuple[str | None, str | None]:
    raw = place.get("wikipediaUrl") or place.get("wikipedia_url") or place.get(
        "wikipediaFrUrl"
    )
    if not isinstance(raw, str) or not raw.strip():
        return None, None

    parsed = urllib.parse.urlparse(raw.strip())
    host = parsed.netloc.lower()
    path = parsed.path
    if not path.startswith("/wiki/"):
        return None, None

    title = urllib.parse.unquote(path[len("/wiki/"):]).replace("_", " ").strip()
    if not title:
        return None, None

    if host.endswith("fr.wikipedia.org") or host.endswith("fr.m.wikipedia.org"):
        return "fr", title
    if host.endswith("en.wikipedia.org") or host.endswith("en.m.wikipedia.org"):
        return "en", title
    if host.endswith("zh.wikipedia.org") or host.endswith("zh.m.wikipedia.org"):
        return "zh", title
    return None, None


# ---------------------------------------------------------------------------
# Per-place resolution
# ---------------------------------------------------------------------------

_FR_NAME_KEYS = (
    "fr_title",
    "wikipedia_fr",
    "nameFr",
    "name_fr",
    "nameEn",
    "name_en",
    "name",
    "title",
)
_EN_NAME_KEYS = (
    "en_title",
    "wikipedia_en",
    "nameEn",
    "name_en",
    "nameFr",
    "name_fr",
    "name",
    "title",
)
_ZH_NAME_KEYS = (
    "zh_title",
    "wikipedia_zh",
    "nameCn",
    "name_cn",
    "nameZh",
    "nameEn",
    "name_en",
    "nameFr",
    "name_fr",
    "name",
    "title",
)


def expand_term(value: str) -> list[str]:
    value = value.strip()
    if not value:
        return []
    terms = [value]
    for sep in ("(", "（"):
        if sep in value:
            base = value.split(sep, 1)[0].strip()
            if base and base not in terms:
                terms.append(base)
    return terms


def collect_terms(place: dict[str, Any], keys: tuple[str, ...]) -> list[str]:
    seen: set[str] = set()
    terms: list[str] = []
    for key in keys:
        value = place.get(key)
        if not isinstance(value, str):
            continue
        for term in expand_term(value):
            if term not in seen:
                seen.add(term)
                terms.append(term)
    return terms


_CITY_OVERRIDE_KEYS = {
    "fr": ("cityFr", "city_fr"),
    "en": ("cityEn", "city_en"),
    "zh": ("cityCn", "city_cn"),
}


def _place_city_id(place: dict[str, Any]) -> str:
    for key in ("cityId", "city_id", "city"):
        value = place.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip().lower()
    return ""


def city_terms_for(place: dict[str, Any], lang: str) -> list[str]:
    terms: list[str] = []

    def add(value: Any) -> None:
        if isinstance(value, str):
            value = value.strip()
            if value and value not in terms:
                terms.append(value)

    for key in _CITY_OVERRIDE_KEYS[lang]:
        add(place.get(key))

    cid = _place_city_id(place)
    names = CITY_NAMES.get(cid, {})
    for name in names.get(lang, []):
        add(name)

    return terms


def place_target_qids(place: dict[str, Any]) -> set[str]:
    targets: set[str] = set()

    for key in ("cityQid", "city_qid"):
        value = place.get(key)
        if isinstance(value, str) and value.strip():
            targets.add(value.strip())

    cid = _place_city_id(place)
    city_qid = CITY_QIDS.get(cid)
    if city_qid:
        targets.add(city_qid)
        targets.add(GUANGDONG_QID)
    return targets


_API_FOR_LANG = {"fr": FR_WIKI_API, "en": EN_WIKI_API, "zh": ZH_WIKI_API}


def _accept_zh(
    place: dict[str, Any],
    title: str | None,
    target_qids: set[str],
) -> str | None:
    if not title:
        return None
    if is_district_placeholder(place, title, ZH_WIKI_API):
        _log(f"zh candidate '{title}' is the district page, discarding")
        return None
    verdict = classify_entity(get_qid(ZH_WIKI_API, title), target_qids)
    if verdict == "foreign":
        _log(f"zh candidate '{title}' rejected (foreign)")
        return None
    return title


def _accept_fr(
    place: dict[str, Any],
    title: str | None,
    target_qids: set[str],
) -> str | None:
    if not title:
        return None
    if is_district_placeholder(place, title, FR_WIKI_API):
        _log(f"fr candidate '{title}' is the district page, discarding")
        return None
    verdict = classify_entity(get_qid(FR_WIKI_API, title), target_qids)
    if verdict == "foreign":
        _log(f"fr candidate '{title}' rejected (foreign)")
        return None
    return title


def resolve_place(place: dict[str, Any]) -> dict[str, Any]:
    fr_terms = collect_terms(place, _FR_NAME_KEYS)
    en_terms = collect_terms(place, _EN_NAME_KEYS)
    zh_terms = collect_terms(place, _ZH_NAME_KEYS)
    fr_cities = city_terms_for(place, "fr")
    en_cities = city_terms_for(place, "en")
    zh_cities = city_terms_for(place, "zh")
    fr_countries = COUNTRY_TERMS["fr"]
    en_countries = COUNTRY_TERMS["en"]
    zh_countries = COUNTRY_TERMS["zh"]
    target_qids = place_target_qids(place)

    hint_lang, hint_title = wiki_hint(place)

    fr_title: str | None = None
    en_title: str | None = None
    zh_title: str | None = None
    fr_verdict: str | None = None
    zh_verdict: str | None = None
    fr_via: str | None = None
    zh_via: str | None = None
    qid: str | None = None

    if hint_lang and hint_title:
        api = _API_FOR_LANG[hint_lang]
        verified = verify_hint(api, hint_title, target_qids)
        verified = (
            _accept_zh(place, verified, target_qids)
            if hint_lang == "zh"
            else (
                _accept_fr(place, verified, target_qids)
                if hint_lang == "fr"
                else verified
            )
        )
        if verified:
            if hint_lang == "fr":
                fr_title = verified
                fr_via = "hint"
            elif hint_lang == "en":
                en_title = verified
            else:
                zh_title = verified
                zh_via = "hint"

    if not fr_title:
        fr_title = _accept_fr(
            place,
            lookup_title(
                FR_WIKI_API, fr_terms, fr_cities, fr_countries, target_qids
            ),
            target_qids,
        )
        if fr_title:
            fr_via = "search"

    if not fr_title:
        if not en_title:
            en_title = lookup_title(
                EN_WIKI_API, en_terms, en_cities, en_countries, target_qids
            )
        if en_title:
            qid = get_qid(EN_WIKI_API, en_title)
            if qid:
                candidate = get_sitelink(qid, "frwiki")
                candidate = _accept_fr(place, candidate, target_qids)
                if candidate:
                    fr_title = candidate
                    fr_via = "sitelink"

    if not qid and fr_title:
        qid = get_qid(FR_WIKI_API, fr_title)

    if not en_title and qid:
        en_title = get_sitelink(qid, "enwiki")

    if not zh_title and qid:
        candidate = get_sitelink(qid, "zhwiki")
        candidate = _accept_zh(place, candidate, target_qids)
        if candidate:
            zh_title = candidate
            zh_via = "sitelink"

    if fr_title:
        fr_verdict = classify_entity(get_qid(FR_WIKI_API, fr_title), target_qids)

    if not zh_title and zh_terms:
        candidate = lookup_title(
            ZH_WIKI_API, zh_terms, zh_cities, zh_countries, target_qids
        )
        candidate = _accept_zh(place, candidate, target_qids)
        if candidate:
            zh_title = candidate
            zh_via = "search"

    if not zh_title:
        extra: list[str] = []
        if en_title:
            extra.append(en_title)
        if fr_title:
            extra.append(fr_title)
        if extra:
            candidate = lookup_title(
                ZH_WIKI_API, extra, zh_cities, zh_countries, target_qids
            )
            candidate = _accept_zh(place, candidate, target_qids)
            if candidate:
                zh_title = candidate
                zh_via = "search"

    if not zh_title:
        candidate = zh_title_from_district_page(place, target_qids)
        candidate = _accept_zh(place, candidate, target_qids)
        if candidate:
            zh_title = candidate
            zh_via = "district_page"

    if zh_title:
        zh_verdict = classify_entity(get_qid(ZH_WIKI_API, zh_title), target_qids)

    if not fr_title and zh_title:
        zh_qid = get_qid(ZH_WIKI_API, zh_title) or qid
        if zh_qid:
            candidate = get_sitelink(zh_qid, "frwiki")
            candidate = _accept_fr(place, candidate, target_qids)
            if candidate:
                fr_title = candidate
                fr_via = "sitelink"
                fr_verdict = classify_entity(
                    get_qid(FR_WIKI_API, fr_title), target_qids
                )

    if not qid and zh_title:
        qid = get_qid(ZH_WIKI_API, zh_title)

    result = dict(place)
    result["fr_title"] = fr_title
    result["fr_url"] = fr_url(fr_title) if fr_title else None
    result["zh_title"] = zh_title
    result["zh_url"] = zh_url(zh_title) if zh_title else None
    result["wikidata"] = qid
    result["en_title"] = en_title
    result["fr_verdict"] = fr_verdict
    result["zh_verdict"] = zh_verdict
    result["fr_via"] = fr_via
    result["zh_via"] = zh_via
    return result


# ---------------------------------------------------------------------------
# Minimal JavaScript / TypeScript literal parser
# ---------------------------------------------------------------------------

_NUMBER_RE = re.compile(r"[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?")
_IDENT_START_RE = re.compile(r"[A-Za-z_$]")
_IDENT_RE = re.compile(r"[A-Za-z0-9_$]*")
_ARRAY_ASSIGN_RE = re.compile(r"=\s*\[")


class JSLiteralParser:
    """Parse the subset of JS/TS needed for the data modules."""

    def __init__(self, text: str, pos: int = 0) -> None:
        self.text = text
        self.pos = pos
        self.length = len(text)

    def fail(self, message: str) -> None:
        line = self.text.count("\n", 0, self.pos) + 1
        raise ValueError(f"{message} (line {line})")

    def skip_ignored(self) -> None:
        while self.pos < self.length:
            ch = self.text[self.pos]
            if ch in " \t\r\n\ufeff":
                self.pos += 1
            elif self.text.startswith("//", self.pos):
                end = self.text.find("\n", self.pos)
                self.pos = self.length if end == -1 else end + 1
            elif self.text.startswith("/*", self.pos):
                end = self.text.find("*/", self.pos + 2)
                if end == -1:
                    self.fail("unterminated block comment")
                self.pos = end + 2
            else:
                return

    def parse_value(self) -> Any:
        self.skip_ignored()
        if self.pos >= self.length:
            self.fail("unexpected end of input")

        ch = self.text[self.pos]
        if ch == "{":
            return self.parse_object()
        if ch == "[":
            return self.parse_array()
        if ch in "\"'`":
            return self.parse_string()
        if ch.isdigit() or (
            ch in "-+"
            and self.pos + 1 < self.length
            and (self.text[self.pos + 1].isdigit() or self.text[self.pos + 1] == ".")
        ):
            return self.parse_number()

        ident = self.parse_identifier()
        if ident == "true":
            return True
        if ident == "false":
            return False
        if ident in ("null", "undefined"):
            return None
        return ident

    def parse_number(self) -> Any:
        match = _NUMBER_RE.match(self.text, self.pos)
        if not match:
            self.fail("invalid number")
        raw = match.group(0)
        self.pos = match.end()
        try:
            return int(raw)
        except ValueError:
            return float(raw)

    def parse_identifier(self) -> str:
        if self.pos >= self.length or not _IDENT_START_RE.match(self.text[self.pos]):
            self.fail("expected identifier")
        start = self.pos
        self.pos += 1
        match = _IDENT_RE.match(self.text, self.pos)
        if match:
            self.pos = match.end()
        return self.text[start:self.pos]

    def parse_string(self) -> str:
        quote = self.text[self.pos]
        self.pos += 1
        out: list[str] = []

        while self.pos < self.length:
            ch = self.text[self.pos]

            if ch == "\\":
                self.pos += 1
                if self.pos >= self.length:
                    self.fail("unterminated escape")
                esc = self.text[self.pos]
                if esc in "\r\n":
                    self.pos += 1
                    continue
                if esc == "u":
                    hex_value = self.text[self.pos + 1:self.pos + 5]
                    try:
                        out.append(chr(int(hex_value, 16)))
                    except ValueError:
                        self.fail("invalid unicode escape")
                    self.pos += 5
                    continue
                if esc == "x":
                    hex_value = self.text[self.pos + 1:self.pos + 3]
                    try:
                        out.append(chr(int(hex_value, 16)))
                    except ValueError:
                        self.fail("invalid hex escape")
                    self.pos += 3
                    continue
                out.append(
                    {
                        "n": "\n",
                        "t": "\t",
                        "r": "\r",
                        "b": "\b",
                        "f": "\f",
                        "v": "\v",
                        "0": "\0",
                    }.get(esc, esc)
                )
                self.pos += 1
                continue

            if ch == quote:
                self.pos += 1
                return "".join(out)

            out.append(ch)
            self.pos += 1

        self.fail("unterminated string")

    def parse_array(self) -> list[Any]:
        values, _spans = self.parse_array_with_spans()
        return values

    def parse_array_with_spans(
        self,
    ) -> tuple[list[Any], list[tuple[int, int]]]:
        """Parse an array literal.

        Return ``(values, spans)`` where ``spans`` holds ``(start, end)``
        positions for every object element; non-object elements get ``-1``.
        """
        self.skip_ignored()
        if self.pos >= self.length or self.text[self.pos] != "[":
            self.fail("expected '[' for array")
        self.pos += 1
        values: list[Any] = []
        spans: list[tuple[int, int]] = []
        while True:
            self.skip_ignored()
            if self.pos >= self.length:
                self.fail("unterminated array")
            if self.text[self.pos] == "]":
                self.pos += 1
                return values, spans

            item_start = self.pos
            if self.text[self.pos] == "{":
                value = self.parse_object()
                item_end = self.pos - 1  # position of closing '}'
                values.append(value)
                spans.append((item_start, item_end))
            else:
                value = self.parse_value()
                values.append(value)
                spans.append((-1, -1))

            self.skip_ignored()
            if self.pos < self.length and self.text[self.pos] == ",":
                self.pos += 1
                continue
            if self.pos < self.length and self.text[self.pos] == "]":
                self.pos += 1
                return values, spans
            self.fail("expected ',' or ']' in array")

    def parse_object(self) -> dict[str, Any]:
        self.pos += 1  # '{'
        obj: dict[str, Any] = {}
        while True:
            self.skip_ignored()
            if self.pos >= self.length:
                self.fail("unterminated object")
            if self.text[self.pos] == "}":
                self.pos += 1
                return obj

            if self.text[self.pos] in "\"'`":
                key = self.parse_string()
            else:
                key = self.parse_identifier()

            self.skip_ignored()
            if self.pos >= self.length or self.text[self.pos] != ":":
                self.fail("expected ':' in object")
            self.pos += 1

            obj[key] = self.parse_value()

            self.skip_ignored()
            if self.pos < self.length and self.text[self.pos] == ",":
                self.pos += 1
                continue
            if self.pos < self.length and self.text[self.pos] == "}":
                self.pos += 1
                return obj
            self.fail("expected ',' or '}' in object")


def parse_js_data_objects(text: str) -> list[dict[str, Any]] | None:
    """Fallback: the largest array of objects found in ``text``."""
    best: list[dict[str, Any]] | None = None

    for match in _ARRAY_ASSIGN_RE.finditer(text):
        start = match.end() - 1
        parser = JSLiteralParser(text, start)
        try:
            value = parser.parse_value()
        except (ValueError, IndexError):
            continue
        if not isinstance(value, list):
            continue
        objects = [item for item in value if isinstance(item, dict)]
        if objects and (best is None or len(objects) > len(best)):
            best = objects

    return best


def parse_js_attraction_arrays(
    text: str,
) -> list[tuple[dict[str, Any], int, int]]:
    """Parse every top-level ``*_ATTACTIONS`` array literal in ``text``.

    Returns ``[(obj, obj_start, obj_end), ...]`` in source order.
    """
    entries: list[tuple[dict[str, Any], int, int]] = []
    seen_ids: set[str] = set()

    for match in _VAR_ARRAY_ASSIGN_RE.finditer(text):
        if not match.group(1).endswith(_ATTRA_SUFFIX):
            continue
        array_start = match.end() - 1  # position of '['
        parser = JSLiteralParser(text, array_start)
        try:
            values, spans = parser.parse_array_with_spans()
        except (ValueError, IndexError):
            continue

        for item, span in zip(values, spans):
            if not isinstance(item, dict):
                continue
            ident = item.get("id")
            if isinstance(ident, str):
                if ident in seen_ids:
                    continue
                seen_ids.add(ident)
            entries.append((item, span[0], span[1]))

    return entries


def _resolve_import_target(base: Path) -> list[Path]:
    if base.suffix:
        candidates = [base]
    else:
        candidates = [
            base.with_suffix(ext)
            for ext in (".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs")
        ]
    candidates.extend(
        [
            base / "index.ts",
            base / "index.tsx",
            base / "index.js",
            base / "index.jsx",
        ]
    )
    return [candidate for candidate in candidates if candidate.exists()]


def _collect_js_attractions(
    path: Path,
    visited: set[Path],
) -> list[tuple[dict[str, Any], Path, int, int]]:
    """Recursively collect place objects from ``path`` and its imports.

    Returns ``[(place_dict, file_path, obj_start, obj_end), ...]`` so the
    caller can both resolve each place and locate its source span for
    in-place editing.
    """
    try:
        resolved = path.resolve()
    except OSError:
        resolved = path
    if resolved in visited:
        return []
    visited.add(resolved)

    if not path.exists():
        return []
    try:
        text = path.read_text(encoding="utf-8")
    except OSError:
        return []

    entries: list[tuple[dict[str, Any], Path, int, int]] = []

    for match in _REL_IMPORT_RE.finditer(text):
        target = path.parent / match.group(1)
        for candidate in _resolve_import_target(target):
            imported = _collect_js_attractions(candidate, visited)
            if imported:
                entries.extend(imported)
            break

    for item, start, end in parse_js_attraction_arrays(text):
        entries.append((item, path, start, end))

    return entries


# ---------------------------------------------------------------------------
# JS literal serialisation helpers (for the flat ``-o <file>.ts`` output)
# ---------------------------------------------------------------------------

def _js_escape(value: str) -> str:
    return (
        value.replace("\\", "\\\\")
        .replace("'", "\\'")
        .replace("\n", "\\n")
        .replace("\r", "\\r")
    )


def _js_repr(value: Any) -> str:
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return repr(value)
    return "'" + _js_escape(str(value)) + "'"


def _js_serialize_value(value: Any, indent: int = 0) -> str:
    pad = "  " * indent
    inner = "  " * (indent + 1)
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return repr(value)
    if isinstance(value, str):
        return "'" + _js_escape(value) + "'"
    if isinstance(value, list):
        if not value:
            return "[]"
        items = [inner + _js_serialize_value(v, indent + 1) for v in value]
        return "[\n" + ",\n".join(items) + ",\n" + pad + "]"
    if isinstance(value, dict):
        if not value:
            return "{}"
        items = []
        for key, val in value.items():
            safe_key = (
                key
                if re.match(r"^[A-Za-z_$][A-Za-z0-9_$]*$", str(key))
                else "'" + _js_escape(str(key)) + "'"
            )
            items.append(
                f"{inner}{safe_key}: {_js_serialize_value(val, indent + 1)}"
            )
        return "{\n" + ",\n".join(items) + ",\n" + pad + "}"
    return _js_repr(value)


# ---------------------------------------------------------------------------
# In-place field injection into JS/TS source files
# ---------------------------------------------------------------------------

def _strip_generated_fields(source: str) -> str:
    return _GENERATED_FIELD_RE.sub("", source)


def _inject_extra_fields(obj_source: str, extra: dict[str, Any]) -> str:
    """Insert ``extra`` fields just before the closing ``}`` of ``obj_source``.

    Any field already present with a name from :data:`_EXTRA_FIELD_KEYS`
    is removed first, so the transformation is idempotent.
    """
    if not extra:
        return obj_source
    stripped = _strip_generated_fields(obj_source)
    if not stripped.rstrip().endswith("}"):
        return obj_source

    lines = stripped.split("\n")
    close_idx = None
    for i in range(len(lines) - 1, -1, -1):
        if lines[i].lstrip().startswith("}"):
            close_idx = i
            break
    if close_idx is None:
        return obj_source

    close_line = lines[close_idx]
    close_indent = close_line[: len(close_line) - len(close_line.lstrip())]
    field_indent = close_indent + "  "

    before = lines[:close_idx]
    if before:
        last = before[-1]
        stripped_last = last.rstrip()
        if (
            stripped_last
            and not stripped_last.endswith(",")
            and not stripped_last.endswith("{")
        ):
            before[-1] = stripped_last + ","

    entries = list(extra.items())
    new_field_lines: list[str] = []
    for idx, (key, value) in enumerate(entries):
        trailing = "," if idx < len(entries) - 1 else ""
        new_field_lines.append(
            f"{field_indent}{key}: {_js_repr(value)}{trailing}"
        )

    return "\n".join(before + new_field_lines + [close_line])


def _write_js_sources_in_place(
    results_with_span: list[tuple[dict[str, Any], Path | None, int, int]],
    dry_run: bool,
) -> None:
    by_file: dict[Path, list[tuple[dict[str, Any], int, int]]] = {}
    for result, file_path, start, end in results_with_span:
        if file_path is None or start < 0 or end < 0:
            continue
        by_file.setdefault(file_path, []).append((result, start, end))

    if not by_file:
        print("No source locations to edit.", file=sys.stderr)
        return

    for path, entries in by_file.items():
        try:
            text = path.read_text(encoding="utf-8")
        except OSError as exc:
            print(f"Cannot read {path}: {exc}", file=sys.stderr)
            continue

        # Apply from the end so earlier edits do not shift later offsets.
        entries.sort(key=lambda entry: entry[1], reverse=True)

        for result, start, end in entries:
            obj_source = text[start:end + 1]
            extra = {key: result.get(key) for key in _EXTRA_FIELD_KEYS}
            new_source = _inject_extra_fields(obj_source, extra)
            if new_source != obj_source:
                text = text[:start] + new_source + text[end + 1:]

        if dry_run:
            print(f"[dry-run] would update {path}", file=sys.stderr)
        else:
            try:
                path.write_text(text, encoding="utf-8")
            except OSError as exc:
                print(f"Cannot write {path}: {exc}", file=sys.stderr)
                continue
            print(f"Updated {path}", file=sys.stderr)


# ---------------------------------------------------------------------------
# Input / output
# ---------------------------------------------------------------------------

def normalize_entry(entry: Any) -> dict[str, Any]:
    if isinstance(entry, str):
        return {"name": entry.strip()}
    if isinstance(entry, dict):
        return dict(entry)
    raise SystemExit(f"Unsupported input entry: {entry!r}")


def _load_non_js_places(path: Path) -> list[dict[str, Any]]:
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


def load_places_with_spans(
    path: Path,
) -> list[tuple[dict[str, Any], Path | None, int, int]]:
    """Load every place plus its source span (only for JS modules)."""
    if not path.exists():
        raise SystemExit(f"Input file not found: {path}")

    if path.suffix.lower() in JS_SUFFIXES:
        entries = _collect_js_attractions(path, set())
        if not entries:
            text = path.read_text(encoding="utf-8")
            fallback = parse_js_data_objects(text)
            if fallback:
                entries = [
                    (normalize_entry(item), path, -1, -1)
                    for item in fallback
                ]
        if not entries:
            raise SystemExit(
                f"No `_ATTACTIONS` array or array-of-objects literal found in "
                f"{path}. Expected something like "
                "`const SHENZHEN_ATTACTIONS: Attraction[] = [ ... ];`."
            )
        return entries

    places = _load_non_js_places(path)
    return [(normalize_entry(place), None, -1, -1) for place in places]


def display_name(place: dict[str, Any], fallback: str) -> str:
    for key in ("nameFr", "nameEn", "nameCn", "name", "title", "id"):
        value = place.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()
    return fallback


def _write_single_output(results: list[dict[str, Any]], output: Path) -> None:
    if output.suffix.lower() in JS_SUFFIXES:
        body = ",\n".join(_js_serialize_value(r, 1) for r in results)
        content = (
            "export const ATTRACTIONS_WITH_WIKIPEDIA: any[] = [\n"
            + body
            + ",\n];\n"
        )
        output.write_text(content, encoding="utf-8")
        return
    output.write_text(
        json.dumps(results, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Recover French and Chinese Wikipedia links for places. For .ts/.js "
            "modules every top-level array ending in _ATTACTIONS is parsed "
            "(relative imports are followed) and the source files are edited "
            "in place, adding fr/zh titles, URLs and verdicts to every place."
        )
    )
    parser.add_argument(
        "input",
        type=Path,
        help=(
            "Input file: a guangzhouData/citiesData-style .ts/.js module (all "
            "_ATTACTIONS arrays, relative imports followed), a .json file, or "
            "a one-name-per-line text file."
        ),
    )
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        help=(
            "Write results to a single file instead of editing sources in "
            "place. A .ts/.js suffix produces a flat TS array; anything else "
            "produces JSON."
        ),
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Do not write anything; just show which files would be edited.",
    )
    parser.add_argument(
        "--pause",
        type=float,
        default=DEFAULT_PAUSE,
        help=f"Seconds to sleep between API calls (default: {DEFAULT_PAUSE}).",
    )
    parser.add_argument(
        "--search-results",
        type=int,
        default=SEARCH_RESULTS,
        help=(
            "How many search results to inspect per query before giving up "
            f"(default: {SEARCH_RESULTS})."
        ),
    )
    parser.add_argument(
        "-v",
        "--verbose",
        action="store_true",
        help="Log every query, accepted titles, and rejected candidates.",
    )
    return parser.parse_args()


def main() -> int:
    global _PAUSE, _VERBOSE, SEARCH_RESULTS
    args = parse_args()
    _PAUSE = max(0.0, args.pause)
    _VERBOSE = bool(args.verbose)
    SEARCH_RESULTS = max(1, args.search_results)

    raw_entries = load_places_with_spans(args.input)
    if not raw_entries:
        print("No places found in input file.", file=sys.stderr)
        return 1

    results_with_span: list[tuple[dict[str, Any], Path | None, int, int]] = []
    total = len(raw_entries)
    for index, (place, file_path, start, end) in enumerate(raw_entries, start=1):
        name = display_name(place, f"place-{index}")
        print(f"[{index}/{total}] {name}", file=sys.stderr)
        try:
            result = resolve_place(place)
        except Exception as exc:
            result = dict(place)
            result["error"] = str(exc)
        result.setdefault("name", name)
        results_with_span.append((result, file_path, start, end))

    results = [r for r, _, _, _ in results_with_span]

    if args.output:
        _write_single_output(results, args.output)
        print(f"Wrote {len(results)} entries to {args.output}", file=sys.stderr)
    elif args.input.suffix.lower() in JS_SUFFIXES:
        _write_js_sources_in_place(results_with_span, dry_run=args.dry_run)
    else:
        output = args.input.with_suffix(".wikipedia.json")
        output.write_text(
            json.dumps(results, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"Wrote {len(results)} entries to {output}", file=sys.stderr)

    missing_fr = sum(1 for r in results if not r.get("fr_title"))
    missing_zh = sum(1 for r in results if not r.get("zh_title"))
    weak = [
        r.get("name") or r.get("id")
        for r in results
        if r.get("fr_verdict") in ("unknown", "other_china")
        or r.get("zh_verdict") in ("unknown", "other_china")
    ]
    via_counts: dict[str, int] = {}
    for r in results:
        for key in ("fr_via", "zh_via"):
            value = r.get(key)
            if value:
                via_counts[f"{key}:{value}"] = via_counts.get(f"{key}:{value}", 0) + 1

    print(
        f"Missing French: {missing_fr}, missing Chinese: {missing_zh}",
        file=sys.stderr,
    )
    if via_counts:
        summary = ", ".join(f"{k}={v}" for k, v in sorted(via_counts.items()))
        print(f"Resolution paths: {summary}", file=sys.stderr)
    if weak:
        print(
            "Weakly verified (accepted on title match only, review manually): "
            + ", ".join(str(u) for u in weak),
            file=sys.stderr,
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
