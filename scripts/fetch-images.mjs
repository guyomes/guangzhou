#!/usr/bin/env node
/**
 * scripts/fetch-images.mjs
 *
 * Replaces the placeholder/generated pictures of the guide with real,
 * freely-licensed photographs fetched from Wikimedia Commons.
 *
 * The app references images by plain relative path ("./assets/images/xxx.jpg",
 * served from public/), so this script keeps the exact existing filenames and
 * simply overwrites the files — no data file needs to be touched, and the
 * service-worker / precache keeps working.
 *
 * Instead of hardcoding fragile image URLs, every entry describes *search
 * queries*; the best matching Commons file is looked up through the MediaWiki
 * API, then downloaded at 1600px. Licences and authors are collected into
 * public/assets/images/credits.json + CREDITS.md.
 *
 * Entries flagged `local: true` are exceptions: they are hand-supplied
 * photographs of places that Commons simply does not cover (a specific
 * commercial hotel, for instance). Such files are NEVER searched, NEVER
 * downloaded and NEVER overwritten — not even by --force — because replacing a
 * genuine picture with a generic look-alike is exactly the bug this flag is
 * meant to prevent. See the Haijun Hotel entry for the reasoning.
 *
 * Usage:
 *   node scripts/fetch-images.mjs                 # fetch only missing images
 *   node scripts/fetch-images.mjs --force         # re-download every fetched image
 *   node scripts/fetch-images.mjs --list          # show the manifest (📌 = hand-supplied)
 *   node scripts/fetch-images.mjs --only=canton   # only matching filenames
 *   node scripts/fetch-images.mjs --allow-failures
 *
 * Requires Node 18+ (global fetch).
 */

import { existsSync } from 'node:fs';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, 'public', 'assets', 'images');
const SRC_DIR = path.join(ROOT, 'src', 'assets', 'images');
const CREDITS_JSON = path.join(PUBLIC_DIR, 'credits.json');
const CREDITS_MD = path.join(PUBLIC_DIR, 'CREDITS.md');

const API = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT =
  'GuangdongTravelGuide/1.0 (static site build script; https://commons.wikimedia.org)';
const TARGET_WIDTH = 1600;
const MIN_BYTES = 12_000;
const REQUEST_DELAY_MS = 350;

/**
 * filename -> ordered search queries (first query with a result wins).
 *
 * A "representative" note means no photo of that exact business exists on
 * Commons, so a faithful photo of the dish / street / neighbourhood is used.
 *
 * `local: true` marks a hand-supplied photograph: skipped entirely by this
 * script (see the header comment).
 */
const MANIFEST = {
  // ---------- Guangzhou ----------
  'canton_tower_night_1793290740500.jpg': {
    queries: ['Canton Tower night', 'Canton Tower'],
  },
  'chen_clan_ancestral_hall_1793290741668.jpg': {
    queries: ['Chen Clan Ancestral Hall', 'Chen Clan Academy Guangzhou'],
  },
  'shamian_island_street_1793290742700.jpg': {
    queries: ['Shamian Island Guangzhou', 'Shamian Island'],
  },
  'cantonese_dimsum_table_1793290742674.jpg': {
    queries: ['dim sum steamer basket', 'yum cha dim sum'],
  },
  'dongshankou_redbrick_villa_1793294556329.jpg': {
    queries: ['Dongshankou Guangzhou', 'Xinhepu Guangzhou', 'Xiguan Guangzhou'],
    note: 'representative neighbourhood photo',
  },
  'yong_qing_fang_1793294746500.jpg': {
    queries: [
      'Cantonese Opera Art Museum Guangzhou',
      'Yongqing Fang Guangzhou',
      'Enning Road Guangzhou',
    ],
  },
  'yuexiu_five_rams_sculpture_1793294557769.jpg': {
    queries: ['Five Rams Statue Guangzhou', 'Yuexiu Park Guangzhou'],
  },
  'sacred_heart_cathedral_guangzhou_1793294557703.jpg': {
    queries: ['Sacred Heart Cathedral Guangzhou'],
  },
  'xiaozhou_oyster_shell_house_1793294556757.jpg': {
    queries: ['Xiaozhou Village Guangzhou', 'oyster shell wall Guangdong'],
    note: 'representative neighbourhood photo',
  },
  'baiyun_mountain_cablecar_1793294558861.jpg': {
    queries: ['Baiyun Mountain Guangzhou', 'Baiyun Mountain cable car'],
  },
  'pantang_village_1793294759675.jpg': {
    queries: ['Pantang Guangzhou', 'Liwan Lake Guangzhou', 'Xiguan Guangzhou'],
    note: 'representative neighbourhood photo',
  },
  'baomo_garden_koi_pond_1793294559616.jpg': {
    queries: ['Baomo Garden', 'Panyu garden Guangzhou koi'],
  },
  'guangdong_museum_1793294744924.jpg': {
    queries: ['Guangdong Museum', 'Guangdong Museum Zhujiang New Town'],
  },
  'taikoo_hui_guangzhou_1793294562227.jpg': {
    queries: ['Taikoo Hui Guangzhou', 'TaiKoo Hui'],
  },
  'guangzhou_opera_house_zaha_1793294560444.jpg': {
    queries: ['Guangzhou Opera House'],
  },

  // ------------------------------------------------------------------
  // Hand-supplied photographs
  // ------------------------------------------------------------------
  // No freely-licensed photograph of this specific hotel exists on Wikimedia
  // Commons. A generic Pearl River / Haizhu Bridge shot was used as a
  // placeholder before, which is misleading: guests cannot recognise the
  // property they are booking. The genuine photo must be dropped in by hand
  // (taken on site, or a press-kit image used with the hotel's permission) and
  // is never fetched, never overwritten.
  'haijun_hotel_guangzhou_1793352754159.jpg': {
    local: true,
    queries: [],
    note: 'genuine hotel photo required — this file is referenced by guangzhouData.ts',
  },
  // Orphaned: no longer referenced by any data file (guangzhouData.ts uses
  // ..._1793352754159.jpg). Kept as a local slot so it is never refilled with
  // an automatic look-alike; safe to delete along with its import if unused.
  'haijun_hotel_guangzhou_1793349214586.jpg': {
    local: true,
    queries: [],
    note: 'orphaned duplicate — safe to delete',
  },

  // ---------- Shenzhen ----------
  'shenzhen_skyline_bay_1793293122053.jpg': {
    queries: ['Shenzhen skyline', 'Shenzhen Bay skyline'],
  },
  'ping_an_tower_1793294695737.jpg': {
    queries: ['Ping An Finance Centre', 'Ping An Finance Center Shenzhen'],
  },
  'oct_loft_art_1793294697253.jpg': {
    queries: ['OCT-LOFT Shenzhen', 'OCT Loft Shenzhen'],
  },
  'dapeng_fortress_1793294697341.jpg': {
    queries: ['Dapeng Fortress', 'Dapeng Ancient City'],
  },
  'shenzhen_mixc_world_1793294563524.jpg': {
    queries: ['MixC Shenzhen', 'Shenzhen shopping mall Nanshan'],
    note: 'representative mall photo',
  },
  'shenzhen_robot_arena_1793294562112.jpg': {
    queries: ['combat robot competition', 'battle bots arena'],
    note: 'representative photo of a robot fight',
  },
  'runyuan_chicken_1793294712418.jpg': {
    queries: ['coconut chicken hotpot', 'Hainanese chicken coconut soup'],
    note: 'representative dish photo',
  },
  'shenzhen_tech_canopy_1793296487433.jpg': {
    queries: ['Huaqiangbei', 'Huaqiang North Shenzhen'],
  },

  // ---------- Shantou ----------
  'shantou_xiaogongyuan_street_1793293123621.jpg': {
    queries: ['Xiaogongyuan Shantou', 'Shantou qilou arcade'],
  },
  'chaoshan_beef_hotpot_1793293124531.jpg': {
    queries: ['Chaoshan beef hotpot', 'Chinese beef hot pot'],
    note: 'representative dish photo',
  },
  'nanao_lighthouse_1793294713423.jpg': {
    queries: ["Nan'ao Island", 'Nanao Island Guangdong'],
    note: 'representative island photo',
  },
  'shantou_mixc_1793294712904.jpg': {
    queries: ['Shantou Longhu', 'Shantou city'],
    note: 'representative mall photo',
  },
  'shantou_fuyuan_seafood_1793294564458.jpg': {
    queries: ['Teochew seafood', 'Chinese seafood market crabs'],
    note: 'representative dish photo',
  },

  // ---------- Chaozhou ----------
  'chaozhou_guangji_bridge_1793293122927.jpg': {
    queries: ['Guangji Bridge Chaozhou', 'Xiangzi Bridge'],
  },
  'chaozhou_paifang_1793294727841.jpg': {
    queries: ['Paifang Street Chaozhou', 'Chaozhou archway'],
  },
  'chaozhou_kaiyuan_1793294728399.jpg': {
    queries: ['Kaiyuan Temple Chaozhou'],
  },
  'chaozhou_tea_1793294729279.jpg': {
    queries: ['Gongfu tea', 'Chinese tea ceremony gaiwan'],
    note: 'representative dish photo',
  },
  'chaozhou_live_teochew_opera_1793294564378.jpg': {
    queries: ['Teochew opera', 'Chaozhou opera'],
  },
  'chaozhou_goose_1793294744410.jpg': {
    queries: ['braised goose Chinese', 'Chaozhou cuisine'],
    note: 'representative dish photo',
  },
  'orange_hotel_chaozhou_1793349228049.jpg': {
    queries: ['hotel room interior modern China', 'hotel guest room China'],
    note: 'representative hotel photo',
  },
  'orange_hotel_chaozhou_1793352768687.jpg': {
    queries: ['hotel twin room China', 'Chaozhou Fengxi'],
    note: 'representative hotel photo',
  },
};

// --------------------------------------------------------------------------
// CLI
// --------------------------------------------------------------------------
const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith('--') && !a.includes('=')));
const options = Object.fromEntries(
  argv
    .filter((a) => a.startsWith('--') && a.includes('='))
    .map((a) => {
      const [key, ...rest] = a.slice(2).split('=');
      return [key, rest.join('=')];
    })
);

const FORCE = flags.has('--force');
const LIST_ONLY = flags.has('--list');
const ALLOW_FAILURES = flags.has('--allow-failures');
const ONLY = options.only ?? null;

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function stripHtml(value) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

/** Rejects HTML error pages and truncated downloads. */
function isImageBuffer(buffer) {
  if (!buffer || buffer.length < MIN_BYTES) return false;

  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng =
    buffer.subarray(0, 8).toString('latin1') === '\x89PNG\r\n\x1a\n';
  const isWebp =
    buffer.subarray(0, 4).toString('latin1') === 'RIFF' &&
    buffer.subarray(8, 12).toString('latin1') === 'WEBP';

  return isJpeg || isPng || isWebp;
}

async function fetchWithRetry(url, attempt = 0) {
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: '*/*' },
  });

  if ((response.status === 429 || response.status >= 500) && attempt < 4) {
    const wait = 1500 * 2 ** attempt;
    console.warn(`  ↻ HTTP ${response.status} — retrying in ${wait} ms`);
    await sleep(wait);
    return fetchWithRetry(url, attempt + 1);
  }

  return response;
}

async function searchCommons(query) {
  const url = new URL(API);
  url.search = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    generator: 'search',
    gsrnamespace: '6', // File: namespace
    gsrlimit: '8',
    gsrsearch: `filetype:bitmap ${query}`,
    prop: 'imageinfo',
    iiprop: 'url|mime|size|extmetadata',
    iiextmetadatafilter: 'LicenseShortName|Artist|LicenseUrl',
    iiurlwidth: String(TARGET_WIDTH),
  }).toString();

  const response = await fetchWithRetry(url);
  if (!response.ok) {
    throw new Error(`Commons API error ${response.status}`);
  }

  const data = await response.json();
  const pages = data?.query?.pages ?? [];

  return pages
    .map((page) => {
      const info = page?.imageinfo?.[0];
      if (!info) return null;
      const meta = info.extmetadata ?? {};

      return {
        title: page.title,
        url: info.thumburl || info.url,
        mime: info.mime ?? '',
        width: info.thumbwidth ?? info.width ?? 0,
        author: stripHtml(meta.Artist?.value) || 'unknown',
        license: stripHtml(meta.LicenseShortName?.value) || 'unknown',
        licenseUrl: meta.LicenseUrl?.value ?? '',
      };
    })
    .filter(Boolean)
    .filter((candidate) => /^image\/(jpeg|png|webp)$/.test(candidate.mime))
    .sort(
      (a, b) => Number(b.mime === 'image/jpeg') - Number(a.mime === 'image/jpeg')
    );
}

async function downloadImage(url) {
  const response = await fetchWithRetry(url);
  if (!response.ok) {
    throw new Error(`download failed with HTTP ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (!isImageBuffer(buffer)) {
    throw new Error(`invalid image payload (${buffer.length} bytes)`);
  }

  return buffer;
}

async function readCredits() {
  try {
    return JSON.parse(await readFile(CREDITS_JSON, 'utf8'));
  } catch {
    return {};
  }
}

function renderCredits(credits) {
  const rows = Object.entries(credits)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([file, credit]) => {
      const link = credit.page ? `[${credit.title}](${credit.page})` : credit.title;
      const licence = credit.licenseUrl
        ? `[${credit.license}](${credit.licenseUrl})`
        : credit.license;
      return `| \`${file}\` | ${link} | ${credit.author} | ${licence} |`;
    });

  return [
    '# Image credits',
    '',
    'All photographs in this folder were fetched from [Wikimedia Commons]',
    '(https://commons.wikimedia.org) by `scripts/fetch-images.mjs`.',
    'They remain the property of their authors and are used under the licence',
    'listed below. Regenerate this file with `node scripts/fetch-images.mjs`.',
    '',
    'Photographs listed as hand-supplied in the script manifest (currently the',
    'Haijun Hotel) do not appear here: they are not sourced from Commons and',
    'their attribution must be documented separately.',
    '',
    '| File | Commons page | Author | Licence |',
    '| --- | --- | --- | --- |',
    ...rows,
    '',
  ].join('\n');
}

// --------------------------------------------------------------------------
// Main
// --------------------------------------------------------------------------
async function main() {
  const entries = Object.entries(MANIFEST).filter(
    ([file]) => !ONLY || file.includes(ONLY)
  );

  if (LIST_ONLY) {
    console.log(`${entries.length} image(s) in the manifest:\n`);
    for (const [file, config] of entries) {
      const present = (await fileExists(path.join(PUBLIC_DIR, file))) ? '✓' : '·';
      console.log(`${present} ${config.local ? '📌 ' : ''}${file}`);
      if (config.local) {
        console.log('    HAND-SUPPLIED: never downloaded, never overwritten');
      } else {
        console.log(`    queries: ${config.queries.join('  |  ')}`);
      }
      if (config.note) console.log(`    note: ${config.note}`);
    }
    return;
  }

  await mkdir(PUBLIC_DIR, { recursive: true });
  const mirrorToSrc = existsSync(SRC_DIR);
  if (mirrorToSrc) await mkdir(SRC_DIR, { recursive: true });

  const credits = await readCredits();
  const downloaded = [];
  const skipped = [];
  const failed = [];
  const missingLocal = [];

  console.log(`Fetching ${entries.length} image(s) into ${PUBLIC_DIR}\n`);

  for (const [file, config] of entries) {
    const targetPath = path.join(PUBLIC_DIR, file);
    const exists = await fileExists(targetPath);

    // ------------------------------------------------------------------
    // Hand-supplied photographs: never fetched, never overwritten.
    //
    // Note that --force deliberately does NOT apply here: re-running the
    // script must never replace a genuine photo of the Haijun Hotel with a
    // generic riverside picture.
    // ------------------------------------------------------------------
    if (config.local) {
      if (!exists) {
        missingLocal.push(file);
        console.warn(
          `📌 ${file} — MISSING\n` +
            `    Place the genuine photograph at: ${path.relative(ROOT, targetPath)}` +
            (mirrorToSrc
              ? `\n    (and mirror it to ${path.relative(ROOT, path.join(SRC_DIR, file))})`
              : '')
        );
        continue;
      }

      skipped.push(file);
      console.log(`📌 ${file} (hand-supplied — kept as is)`);
      continue;
    }

    if (!FORCE && exists) {
      skipped.push(file);
      console.log(`• ${file} (already present)`);
      continue;
    }

    let candidate = null;
    let lastError = null;

    for (const query of config.queries) {
      try {
        const results = await searchCommons(query);
        if (results.length > 0) {
          candidate = results[0];
          break;
        }
      } catch (error) {
        lastError = error;
      }
      await sleep(REQUEST_DELAY_MS);
    }

    if (!candidate) {
      const reason = lastError?.message ?? 'no Commons result';
      failed.push({ file, reason });
      console.warn(`✗ ${file} — ${reason}`);
      continue;
    }

    try {
      const buffer = await downloadImage(candidate.url);
      await writeFile(targetPath, buffer);
      if (mirrorToSrc) {
        await writeFile(path.join(SRC_DIR, file), buffer);
      }

      credits[file] = {
        source: 'Wikimedia Commons',
        title: candidate.title,
        author: candidate.author,
        license: candidate.license,
        licenseUrl: candidate.licenseUrl,
        page: `https://commons.wikimedia.org/wiki/${encodeURIComponent(
          candidate.title
        )}`,
        fetchedAt: new Date().toISOString(),
      };

      downloaded.push(file);
      console.log(`✓ ${file}\n    ← ${candidate.title} (${candidate.license})`);
    } catch (error) {
      failed.push({ file, reason: error.message });
      console.warn(`✗ ${file} — ${error.message}`);
    }

    await sleep(REQUEST_DELAY_MS);
  }

  await writeFile(CREDITS_JSON, `${JSON.stringify(credits, null, 2)}\n`);
  await writeFile(CREDITS_MD, renderCredits(credits));

  console.log(
    `\nDone: ${downloaded.length} downloaded, ${skipped.length} skipped, ` +
      `${failed.length + missingLocal.length} failed.`
  );

  if (missingLocal.length > 0) {
    console.log('\nHand-supplied photographs still missing:');
    for (const file of missingLocal) {
      console.log(`  - ${file} → public/assets/images/${file}`);
    }
    console.log(
      '  These are never downloaded on purpose: Commons has no photo of that'
    );
    console.log('  specific place, and a substitute would be misleading.');
  }

  if (failed.length > 0) {
    console.log('\nFailed entries (add better queries in MANIFEST):');
    for (const item of failed) console.log(`  - ${item.file}: ${item.reason}`);
  }

  if ((failed.length > 0 || missingLocal.length > 0) && !ALLOW_FAILURES) {
    process.exitCode = 1;
  }

  console.log(`\nCredits written to ${path.relative(ROOT, CREDITS_MD)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
