#!/usr/bin/env python3
"""Recover French and (auto-translated) Chinese Wikipedia links for places.

The script accepts either:

  * a data module in the same shape as ``src/data/guangzhouData.ts`` or
    ``src/data/citiesData.ts`` — any number of top-level arrays whose variable
    name ends with ``_ATTACTIONS`` are parsed (so ``RAW_GUANGZHOU_ATTACTIONS``,
    ``SHENZHEN_ATTACTIONS``, ``SHANTOU_ATTACTIONS``, ``CHAOZHOU_ATTACTIONS``
    are all picked up from a single file). Relative ``import … from './…'``
    statements are followed, letting a file like ``citiesData.ts`` be used on
    its own even though Guangzhou lives in ``guangzhouData.ts``; or
  * a ``.json`` file (list of strings, list of objects, or an object mapping
    place name -> metadata), or
  * a plain text file with one place per line (``#`` comments allowed).

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

The name candidates come from the per-language fields of the data file
(``nameFr`` for French, ``nameEn`` for English, ``nameCn`` for Chinese). An
existing ``wikipediaUrl`` field is used as a hint and canonicalised through
the API; if the hinted URL points to a missing page, it is treated as not
found and the search paths kick in.

Usage
-----
    python scripts/fetch_wikipedia_links.py src/data/citiesData.ts
    python scripts/fetch_wikipedia_links.py src/data/guangzhouData.ts
    python scripts/fetch_wikipedia_links.py places.json -o places.wikipedia.json

Output
------
A JSON file next to the input (or ``-o``). Every original field is preserved
and the following keys are added per place: ``fr_title``, ``fr_url``,
``zh_title``, ``zh_url``, ``en_title``, ``wikidata``, ``fr_verdict``,
``zh_verdict``, ``fr_via`` and ``zh_via``.
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

USER_AGENT = "place-wikipedia-links/1.5 (contact@example.invalid)"
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

# Known city QIDs. All four cities live in Guangdong (Q15126); keeping the
# province QID alongside lets us accept places whose district chain reaches
# 广州市 through a district rather than directly.
CITY_QIDS: dict[str, str] = {
    "guangzhou": "Q16572",
    "shenzhen": "Q15174",
    "shantou": "Q59112",
    "chaozhou": "Q59239",
}

# Localised city names used to disambiguate searches. Only the names for the
# target wiki's language are appended to a query. The first name is the
# preferred one; the others are tried in order as fallbacks.
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

# Localised country names, appended after the city names in search queries.
COUNTRY_TERMS: dict[str, list[str]] = {
    "fr": ["Chine"],
    "en": ["China"],
    "zh": ["中国"],
}

# Namespace prefixes ignored when scanning wikitext for article links.
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

# Matches `<Name>: <Type> = [`. The type is optional and permits `any[]`,
# `Attraction[]`, `Array<Attraction>`, `Record<…>`, etc. We exclude `=`, `;`,
# `{` and `}` from the type so that a `= {` assignment is never matched.
_VAR_ARRAY_ASSIGN_RE = re.compile(
    r"\b([A-Za-z_$][A-Za-z0-9_$]*)\s*(?::\s*[^=;{}]+?)?=\s*\["
)

# Matches `from './relative/path'` in import statements.
_REL_IMPORT_RE = re.compile(r"\bfrom\s+['\"](\.[^'\"]+)['\"]")

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
    """True for the "Wikipédia ne possède pas d'article avec ce nom" case."""
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
    """Return ``{page_title: wikidata_qid}`` for existing pages only."""
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
    """BFS the P17/P131 graph. Early-returns once a target QID is reached."""
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
    """Return ``city``/``guangdong``/``other_china``/``foreign``/``unknown``.

    ``city`` and ``guangdong`` are both strong positives (they mean the
    candidate is inside the target province); ``other_china`` and ``unknown``
    are weak positives and must be combined with a title match to be accepted.
    """
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
        # Whether we hit 广州市 or 广东省, treat both as positive signals.
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
    """True when ``title`` visibly mentions the name we searched for."""
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
    # Require at least two thirds of the distinctive words. This is what
    # rejects "Dynastie Chen" for "Temple ancestral du clan Chen".
    return matched >= max(1, (len(tokens) * 2 + 2) // 3)


# ---------------------------------------------------------------------------
# District helpers
# ---------------------------------------------------------------------------

def district_zh_titles(place: dict[str, Any]) -> list[str]:
    """Extract the Chinese district page titles, e.g. ``["番禺区"]``.

    Handles compound district fields such as ``'Liwan & Yuexiu (荔湾与越秀区)'``
    or ``'Yuexiu & Haizhu (越秀/海珠区)'`` by splitting on common separators
    and appending ``区`` when it is missing.
    """
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
    """True when ``title`` is the district page the place belongs to."""
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
    """Strip fragments and normalise the target."""
    base = target.split("#", 1)[0].strip()
    return base


def _is_skipped_link(base: str) -> bool:
    if not base:
        return True
    if base.startswith(":"):  # interlanguage: ``:fr:Foo``
        return True
    lower = base.lower()
    return any(lower.startswith(prefix) for prefix in _WIKI_SKIP_PREFIXES)


def zh_title_from_district_page(
    place: dict[str, Any],
    target_qids: set[str],
) -> str | None:
    """Find an article linked from the district's Chinese Wikipedia page.

    Chinese district pages often list every notable place inside the
    district, including sites that do not have enough notability to get their
    own article from a full-text search. We scan the district page's wikitext
    for a ``[[…]]`` link whose target or label matches the place's Chinese
    name, and return its target.
    """
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

        # 1. exact match on the target or label
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

        # 2. substring match, restricted to entities verified in the target
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
    """Sanitise a phrase so it can be embedded inside ``intitle:"…"``."""
    cleaned = re.sub(r'[&|(){}:;"\\/]+', " ", term)
    return " ".join(cleaned.split()).strip()


def lookup_title(
    api_url: str,
    terms: list[str],
    city_terms: list[str] | None = None,
    country_terms: list[str] | None = None,
    target_qids: set[str] | None = None,
) -> str | None:
    """Resolve a title: exact match first, then a scoped search."""
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
    """Search ``intitle:``, then ``<name> <city>``, ``<name> <country>``, bare.

    For each query the returned hits are classified against the target city.
    A hit that lives in the target city or in Guangdong is accepted outright.
    A hit whose Wikidata item is only known to be "in China" (or which has no
    location statements at all) is accepted only if its title visibly contains
    the name we searched for; otherwise we try the next query.
    """
    queries: list[tuple[str, str]] = []
    seen: set[str] = set()

    def add(query: str, source_term: str) -> None:
        if query and query not in seen:
            seen.add(query)
            queries.append((query, source_term))

    # Prefix the pipeline with the exact-title operator so that
    # ``intitle:"陈家祠"`` finds ``陈家祠`` directly even when the name
    # includes a parenthesised alternate form.
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
    """Follow redirects; return ``None`` for missing pages."""
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
    """Canonicalise a hinted title and discard foreign results."""
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
    """Return ``(language, title)`` from an existing ``wikipediaUrl`` field."""
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
    """Split ``陈家祠 (陈氏书院)`` into ``["陈家祠 (陈氏书院)", "陈家祠"]``."""
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
    """Return the place's city names in ``lang``, primary name first."""
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
    """Return the set of Wikidata QIDs that mark a hit as "in the city"."""
    targets: set[str] = set()

    # A place may override the city QID entirely (used for unknown cities).
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
    """Validate a Chinese candidate; return it only if usable."""
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

    # 0. Use the existing wikipediaUrl field as a hint, unless it points to a
    #    page about another country or to the district page.
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

    # 1. Direct French lookup (exact title, then a scoped search).
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

    # 2. Fallback: English Wikipedia -> Wikidata -> French sitelink.
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

    # 3. Wikidata id from the French article (if still unknown).
    if not qid and fr_title:
        qid = get_qid(FR_WIKI_API, fr_title)

    # 4. English title from Wikidata (helps the Chinese fallback search).
    if not en_title and qid:
        en_title = get_sitelink(qid, "enwiki")

    # 5. Chinese article via Wikidata interlanguage link, after verification.
    if not zh_title and qid:
        candidate = get_sitelink(qid, "zhwiki")
        candidate = _accept_zh(place, candidate, target_qids)
        if candidate:
            zh_title = candidate
            zh_via = "sitelink"

    if fr_title:
        fr_verdict = classify_entity(get_qid(FR_WIKI_API, fr_title), target_qids)

    # 6. Chinese full-text search, scoped to the city and country.
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

    # 6b. Last resort: the district's Chinese page lists the place.
    if not zh_title:
        candidate = zh_title_from_district_page(place, target_qids)
        candidate = _accept_zh(place, candidate, target_qids)
        if candidate:
            zh_title = candidate
            zh_via = "district_page"

    if zh_title:
        zh_verdict = classify_entity(get_qid(ZH_WIKI_API, zh_title), target_qids)

    # 6c. Derive a French title from the Chinese page when possible.
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

    # 7. Backfill the Wikidata id if it is still unknown.
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
    """Parse the subset of JS/TS needed for the data modules.

    Supports objects, arrays, single/double quoted strings, template literals,
    numbers, booleans, ``null``/``undefined``, trailing commas, and both
    ``//`` and ``/* */`` comments.
    """

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
        self.pos += 1  # '['
        items: list[Any] = []
        while True:
            self.skip_ignored()
            if self.pos >= self.length:
                self.fail("unterminated array")
            if self.text[self.pos] == "]":
                self.pos += 1
                return items

            items.append(self.parse_value())

            self.skip_ignored()
            if self.pos < self.length and self.text[self.pos] == ",":
                self.pos += 1
                continue
            if self.pos < self.length and self.text[self.pos] == "]":
                self.pos += 1
                return items
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
    """Fallback: return the largest array of objects found in ``text``.

    Used only when no ``_ATTACTIONS`` array is found in the module (or its
    relative imports), so that arbitrary ``.ts``/``.js`` files keep working.
    """
    best: list[dict[str, Any]] | None = None

    for match in _ARRAY_ASSIGN_RE.finditer(text):
        start = match.end() - 1  # position of '['
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


def parse_js_attraction_arrays(text: str) -> list[dict[str, Any]]:
    """Parse every ``<Name>_ATTACTIONS: … = [ … ]`` literal in ``text``.

    Only top-level names ending in ``_ATTACTIONS`` are considered, which is
    what lets a module like ``src/data/citiesData.ts`` (which defines
    ``SHENZHEN_ATTACTIONS``, ``SHANTOU_ATTACTIONS``, ``CHAOZHOU_ATTACTIONS``...)
    be read without executing TypeScript. Aliases built from a function call
    (``GUANGZHOU_ATTACTIONS = RAW_GUANGZHOU_ATTACTIONS.map(…)``) and arrays
    that use spread syntax are simply skipped — the underlying ``_ATTACTIONS``
    literal is what gets picked up.
    """
    objects: list[dict[str, Any]] = []
    seen_ids: set[str] = set()

    for match in _VAR_ARRAY_ASSIGN_RE.finditer(text):
        name = match.group(1)
        if not name.endswith(_ATTRA_SUFFIX):
            continue

        start = match.end() - 1  # position of '['
        parser = JSLiteralParser(text, start)
        try:
            value = parser.parse_value()
        except (ValueError, IndexError):
            continue
        if not isinstance(value, list):
            continue

        for item in value:
            if not isinstance(item, dict):
                continue
            ident = item.get("id")
            if isinstance(ident, str):
                if ident in seen_ids:
                    continue
                seen_ids.add(ident)
            objects.append(item)

    return objects


def _resolve_import_target(base: Path) -> list[Path]:
    """Return existing candidate paths for a base import path, best first."""
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
) -> list[dict[str, Any]]:
    """Recursively collect ``*_ATTACTIONS`` arrays starting from ``path``.

    Relative ``import … from './…'`` statements are followed so that a single
    entry point (e.g. ``citiesData.ts``) yields the data of every module it
    re-exports, without needing to list them on the command line. Imported
    arrays come before the file's own arrays, matching the ordering used by
    ``ALL_ATTACTIONS``.
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

    objects: list[dict[str, Any]] = []

    for match in _REL_IMPORT_RE.finditer(text):
        target = path.parent / match.group(1)
        for candidate in _resolve_import_target(target):
            imported = _collect_js_attractions(candidate, visited)
            if imported:
                objects.extend(imported)
            break

    objects.extend(parse_js_attraction_arrays(text))
    return objects


def js_attractions_from_file(path: Path) -> list[dict[str, Any]]:
    """Collect ``*_ATTACTIONS`` arrays from ``path`` and its relative imports."""
    objects = _collect_js_attractions(path, set())

    # De-duplicate by ``id`` at the top level, in case the same array is
    # reachable through more than one import chain.
    seen: set[str] = set()
    result: list[dict[str, Any]] = []
    for item in objects:
        ident = item.get("id")
        if isinstance(ident, str):
            if ident in seen:
                continue
            seen.add(ident)
        result.append(item)
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
    suffix = path.suffix.lower()

    if suffix in JS_SUFFIXES:
        objects = js_attractions_from_file(path)
        if not objects:
            objects = parse_js_data_objects(text)
        if not objects:
            raise SystemExit(
                f"No `_ATTACTIONS` array or array-of-objects literal found in "
                f"{path}. Expected something like "
                "`const SHENZHEN_ATTACTIONS: Attraction[] = [ ... ];`."
            )
        return [normalize_entry(item) for item in objects]

    if suffix == ".json":
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


def display_name(place: dict[str, Any], fallback: str) -> str:
    for key in ("nameFr", "nameEn", "nameCn", "name", "title", "id"):
        value = place.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()
    return fallback


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Recover French and Chinese Wikipedia links for places. Accepts a "
            "guangzhouData/citiesData-style .ts/.js module (all arrays whose "
            "name ends with _ATTACTIONS are collected, and relative imports "
            "are followed), a .json file, or a plain text file with one place "
            "per line."
        )
    )
    parser.add_argument(
        "input",
        type=Path,
        help=(
            "Input file: .ts/.tsx/.js/.jsx data module (arrays ending in "
            "_ATTACTIONS, with relative imports followed), .json, or a "
            "one-name-per-line text file."
        ),
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
        help="Log every query, the accepted title, and rejected candidates.",
    )
    return parser.parse_args()


def main() -> int:
    global _PAUSE, _VERBOSE, SEARCH_RESULTS
    args = parse_args()
    _PAUSE = max(0.0, args.pause)
    _VERBOSE = bool(args.verbose)
    SEARCH_RESULTS = max(1, args.search_results)

    places = load_places(args.input)
    if not places:
        print("No places found in input file.", file=sys.stderr)
        return 1

    results: list[dict[str, Any]] = []
    total = len(places)
    for index, place in enumerate(places, start=1):
        name = display_name(place, f"place-{index}")
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

    print(f"Wrote {len(results)} entries to {output}", file=sys.stderr)
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
