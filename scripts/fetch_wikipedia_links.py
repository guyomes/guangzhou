#!/usr/bin/env python3
"""Recover French and (auto-translated) Chinese Wikipedia links for places.

The script accepts either:

  * a data module in the same shape as ``src/data/guangzhouData.ts``
    (a ``const SOME_NAME: any[] = [ {...}, ... ];`` literal), or
  * a ``.json`` file (list of strings, list of objects, or an object mapping
    place name -> metadata), or
  * a plain text file with one place per line (``#`` comments allowed).

For each place the script resolves:

  * the French Wikipedia article (exact title first, then a search scoped to
    the place's city/country, then an English -> Wikidata fallback), and
  * the Chinese Wikipedia article through Wikidata's interlanguage links,
    rendered through the Google Translate proxy with ``_x_tr_sl=auto`` and
    ``_x_tr_tl=fr``.

Every candidate is checked against Wikidata: a candidate whose Wikidata item
has a ``P17`` (country) that is not China (Q148) is treated as a wrong-result
and rejected. This is what prevents e.g. ``Rivière des Perles`` from resolving
to the Swiss lake of the same name. ``P131`` (located in the administrative
territorial entity) is a secondary signal; candidates without any country
statement are accepted as ``unknown`` so that legitimate Chinese pages (which
sometimes lack P17) are not dropped.

If no Chinese sitelink exists on Wikidata, the script falls back to a
full-text search on zh.wikipedia.org, again scoped to the city and country.

The name candidates come from the per-language fields of the data file
(``nameFr`` for French, ``nameEn`` for English, ``nameCn`` for Chinese). An
existing ``wikipediaUrl`` field is used as a hint and canonicalised through
the API; if the hinted URL points to a missing page or to a page whose
Wikidata item is not located in China, it is treated as not found and the
search paths kick in.

Usage
-----
    python scripts/fetch_wikipedia_links.py src/data/guangzhouData.ts
    python scripts/fetch_wikipedia_links.py places.json -o places.wikipedia.json

Output
------
A JSON file next to the input (or ``-o``). Every original field is preserved
and the following keys are added per place: ``fr_title``, ``fr_url``,
``zh_title``, ``zh_url``, ``en_title``, ``wikidata``, ``fr_verdict`` and
``zh_verdict``. ``*_verdict`` is one of ``china`` (verified via P17=P17(China)),
``unknown`` (no country statement on Wikidata) or ``foreign`` (rejected; the
corresponding URL is ``null``).
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

USER_AGENT = "place-wikipedia-links/1.2 (contact@example.invalid)"
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

_PAUSE = DEFAULT_PAUSE
_VERBOSE = False

_QID_CACHE: dict[tuple[str, str], str | None] = {}
_SITELINK_CACHE: dict[tuple[str, str], str | None] = {}
_VERDICT_CACHE: dict[str, str] = {}


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
# Wikipedia / Wikidata lookups
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


# --- Wikidata verification -------------------------------------------------

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


def _entity_verdict(entity: dict[str, Any]) -> str:
    claims = entity.get("claims", {}) or {}
    countries = _claim_ids(claims, "P17")
    if CHINA_QID in countries:
        return "china"
    if countries:
        return "foreign"
    # No country statement: sometimes the country is only in the located-in
    # chain, in which case trust it if it points straight at China.
    if CHINA_QID in _claim_ids(claims, "P131"):
        return "china"
    return "unknown"


def verify_entities(qids: Iterable[str | None]) -> dict[str, str]:
    """Return ``{qid: verdict}`` for each non-empty QID (batched)."""
    wanted = [qid for qid in dict.fromkeys(qids) if qid]
    results: dict[str, str] = {}
    if not wanted:
        return results

    for chunk in _chunks(wanted, 50):
        to_fetch = [qid for qid in chunk if qid not in _VERDICT_CACHE]
        if to_fetch:
            data = api_get(
                WIKIDATA_API,
                {
                    "action": "wbgetentities",
                    "ids": "|".join(to_fetch),
                    "props": "claims",
                    "claims": "P17|P131",
                },
            )
            for qid, entity in data.get("entities", {}).items():
                if qid not in to_fetch:
                    continue
                if "missing" in entity:
                    _VERDICT_CACHE[qid] = "unknown"
                    continue
                _VERDICT_CACHE[qid] = _entity_verdict(entity)
        for qid in chunk:
            results[qid] = _VERDICT_CACHE.get(qid, "unknown")
    return results


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


def entity_verdict_for_title(api_url: str, title: str) -> str:
    qid = get_qid(api_url, title)
    if not qid:
        return "unknown"
    return verify_entities([qid]).get(qid, "unknown")


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


# --- Title resolution ------------------------------------------------------

def lookup_title(
    api_url: str,
    terms: list[str],
    city_terms: list[str] | None = None,
    country_terms: list[str] | None = None,
) -> str | None:
    """Resolve a title: exact matches first, then a scoped search."""
    for term in terms:
        title = exact_title(api_url, term)
        if not title:
            continue
        verdict = entity_verdict_for_title(api_url, title)
        if verdict == "foreign":
            _log(f"exact match '{term}' -> '{title}' rejected (foreign)")
            continue
        return title
    return search_title_with_context(
        api_url,
        terms,
        list(city_terms or []),
        list(country_terms or []),
    )


def search_title_with_context(
    api_url: str,
    terms: list[str],
    city_terms: list[str],
    country_terms: list[str],
) -> str | None:
    """Search ``<name> <city>``, then ``<name> <country>``, then ``<name>``.

    For each query we inspect the first :data:`SEARCH_RESULTS` hits and pick
    the first whose Wikidata item is located in China. A hit without any
    country statement is kept as a fallback only if no Chinese hit is found
    in the same query; hits that are demonstrably foreign are skipped.
    """
    queries: list[str] = []
    seen: set[str] = set()

    def add(query: str) -> None:
        if query and query not in seen:
            seen.add(query)
            queries.append(query)

    for term in terms:
        for city in city_terms:
            add(f"{term} {city}")
        for country in country_terms:
            add(f"{term} {country}")
        add(term)

    for query in queries:
        hits = search_titles(api_url, query)
        if not hits:
            continue
        qid_map = get_qids(api_url, hits)
        verdicts = verify_entities(list(qid_map.values()))

        chinese_hit: str | None = None
        unknown_hit: str | None = None
        for hit in hits:
            qid = qid_map.get(hit)
            verdict = verdicts.get(qid or "", "unknown")
            if verdict == "china":
                chinese_hit = hit
                break
            if verdict == "unknown" and unknown_hit is None:
                unknown_hit = hit

        if chinese_hit:
            _log(f"search hit for '{query}': {chinese_hit} (verified China)")
            return chinese_hit
        if unknown_hit:
            _log(f"search hit for '{query}': {unknown_hit} (unverified)")
            return unknown_hit
        _log(f"every hit for '{query}' is foreign, trying next query")

    return None


def canonical_title(api_url: str, title: str) -> str | None:
    """Follow redirects; return ``None`` for missing pages.

    Hinted URLs from the data file sometimes point to a page that does not
    exist. Returning ``None`` here makes the caller fall through to the search
    path instead of propagating a broken title.
    """
    try:
        resolved = exact_title(api_url, title)
    except Exception:
        return title
    if resolved is None:
        _log(f"hinted title '{title}' is missing, falling back to search")
    return resolved


def verify_hint(api_url: str, title: str) -> str | None:
    """Canonicalise a hinted title and discard wrong-country results."""
    resolved = canonical_title(api_url, title)
    if not resolved:
        return None
    verdict = entity_verdict_for_title(api_url, resolved)
    if verdict == "foreign":
        _log(f"hinted title '{resolved}' rejected (foreign)")
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

    city_id = place.get("cityId") or place.get("city_id") or place.get("city")
    if isinstance(city_id, str):
        names = CITY_NAMES.get(city_id.strip().lower(), {})
        for name in names.get(lang, []):
            add(name)

    return terms


_API_FOR_LANG = {"fr": FR_WIKI_API, "en": EN_WIKI_API, "zh": ZH_WIKI_API}


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

    hint_lang, hint_title = wiki_hint(place)

    fr_title: str | None = None
    en_title: str | None = None
    zh_title: str | None = None
    fr_verdict: str | None = None
    zh_verdict: str | None = None
    qid: str | None = None

    # 0. Use the existing wikipediaUrl field as a hint, unless it is missing
    #    or points to a page about another country.
    if hint_lang and hint_title:
        api = _API_FOR_LANG[hint_lang]
        verified = verify_hint(api, hint_title)
        if verified:
            if hint_lang == "fr":
                fr_title = verified
            elif hint_lang == "en":
                en_title = verified
            else:
                zh_title = verified

    # 1. Direct French lookup (exact title, then a scoped search).
    if not fr_title:
        fr_title = lookup_title(FR_WIKI_API, fr_terms, fr_cities, fr_countries)

    # 2. Fallback: English Wikipedia -> Wikidata -> French sitelink.
    if not fr_title:
        if not en_title:
            en_title = lookup_title(EN_WIKI_API, en_terms, en_cities, en_countries)
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

    # 5. Chinese article via Wikidata interlanguage link, if it is about China.
    if not zh_title and qid:
        candidate = get_sitelink(qid, "zhwiki")
        if candidate:
            verdict = entity_verdict_for_title(ZH_WIKI_API, candidate)
            if verdict == "foreign":
                _log(f"zh sitelink '{candidate}' rejected (foreign)")
            else:
                zh_title = candidate

    if fr_title:
        fr_verdict = entity_verdict_for_title(FR_WIKI_API, fr_title)

    # 6. Chinese full-text search, scoped to the city and country. The Chinese
    #    name is tried first so that entries like ``陈家祠 (陈氏书院)`` resolve
    #    to ``陈家祠`` before we fall back to the English/French titles.
    if not zh_title and zh_terms:
        zh_title = lookup_title(ZH_WIKI_API, zh_terms, zh_cities, zh_countries)

    if not zh_title:
        extra: list[str] = []
        if en_title:
            extra.append(en_title)
        if fr_title:
            extra.append(fr_title)
        if extra:
            zh_title = lookup_title(ZH_WIKI_API, extra, zh_cities, zh_countries)

    if zh_title:
        zh_verdict = entity_verdict_for_title(ZH_WIKI_API, zh_title)
        if zh_verdict == "foreign":
            _log(f"zh result '{zh_title}' rejected (foreign)")
            zh_title = None
            zh_verdict = None

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
    """Return the largest array of objects found in ``text``."""
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
        objects = parse_js_data_objects(text)
        if not objects:
            raise SystemExit(
                f"No array-of-objects literal found in {path}. "
                "Expected something like `const DATA: any[] = [ ... ];`."
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
            "guangzhouData-style .ts/.js module, a .json file, or a plain "
            "text file with one place per line."
        )
    )
    parser.add_argument(
        "input",
        type=Path,
        help=(
            "Input file: .ts/.tsx/.js/.jsx data module, .json, or one-name-"
            "per-line text."
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
    unverified = [
        r.get("name") or r.get("id")
        for r in results
        if r.get("fr_verdict") == "unknown" or r.get("zh_verdict") == "unknown"
    ]
    print(f"Wrote {len(results)} entries to {output}", file=sys.stderr)
    print(
        f"Missing French: {missing_fr}, missing Chinese: {missing_zh}",
        file=sys.stderr,
    )
    if unverified:
        print(
            "Unverified (no country statement on Wikidata, review manually): "
            + ", ".join(str(u) for u in unverified),
            file=sys.stderr,
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
