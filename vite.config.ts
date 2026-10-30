import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: './',
          // The guide now covers four cities, so the install prompt and the
          // home-screen label must not claim to be Guangzhou-only.
          name: 'Guangdong Voyage - Guide & Itinéraires',
          // Launchers truncate this hard (roughly 12 characters), so keep it
          // short: "Guangdong" alone would already risk clipping.
          short_name: 'GD Voyage',
          description:
            'Guide de voyage interactif de Guangzhou, Shenzhen, Shantou et Chaozhou : itinéraires sur mesure, descriptions en français, avis chinois et internationaux, cartes et fiches hors ligne.',
          // The entire interface is French; lets the OS pick the right font
          // stack and display language in the install sheet.
          lang: 'fr',
          categories: ['travel', 'navigation', 'utilities'],
          theme_color: '#0f172a',
          background_color: '#0f172a',
          display: 'standalone',
          start_url: './',
          scope: './',
          icons: [
            {
              src: './pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: './pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: './pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          // The photographs are real, fairly heavy files (a few hundred KB
          // each). Precaching all of them would add ~10-15 MB to the install
          // for every visitor, including those who never use the offline pack,
          // so they are cached on demand instead (see runtimeCaching below)
          // and pre-warmed by "Télécharger le pack hors ligne".
          globIgnores: ['**/assets/images/**', '**/CREDITS.md', '**/credits.json'],
          // Workbox silently skips files above this cap with only a build-time
          // warning; the default 2 MB would drop large photos without failing.
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          // Drop precached bundles from previous builds so a stale hashed
          // JS/CSS chunk can never be served after a deploy.
          cleanupOutdatedCaches: true,
          runtimeCaching: [
            {
              // Photographs of the places and city banners.
              //
              // Same cache name as IMAGE_CACHE_NAME in src/utils/offlineStorage.ts
              // on purpose: the offline pack and this runtime route share one
              // bucket, so downloading the pack also satisfies later requests
              // and clearOfflinePack() flushes both at once.
              urlPattern: /\/assets\/images\/.*\.(?:jpg|jpeg|png|webp)$/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gz-voyage-images',
                expiration: {
                  maxEntries: 120,
                  maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/.*tile\.openstreetmap\.org\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'osm-tiles-cache',
                expiration: {
                  maxEntries: 500,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/unpkg\.com\/leaflet.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'leaflet-assets-cache',
                expiration: {
                  maxEntries: 20,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
