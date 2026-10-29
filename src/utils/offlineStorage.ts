import { ALL_ATTRACTIONS } from '../data/citiesData';
import { SUGGESTED_ITINERARIES } from '../data/itineraries';

const STORAGE_KEY_SAVED_SPOTS = 'gz_voyage_saved_spots';
const STORAGE_KEY_OFFLINE_READY = 'gz_voyage_offline_ready';
const STORAGE_KEY_CUSTOM_PLAN = 'gz_voyage_custom_plan';

export interface OfflineStatus {
  isDownloaded: boolean;
  downloadDate?: string;
  itemCount: number;
  estimatedSizeMb: number;
}

export function getSavedSpots(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SAVED_SPOTS);
    return raw ? JSON.parse(raw) : ['canton-tower', 'chen-clan-ancestral-hall', 'ping-an-finance-centre', 'shantou-xiaogongyuan', 'chaozhou-guangji-bridge'];
  } catch {
    return ['canton-tower', 'chen-clan-ancestral-hall', 'ping-an-finance-centre', 'shantou-xiaogongyuan', 'chaozhou-guangji-bridge'];
  }
}

export function saveSpotToggle(id: string): string[] {
  const current = getSavedSpots();
  const exists = current.includes(id);
  const updated = exists ? current.filter(item => item !== id) : [...current, id];
  try {
    localStorage.setItem(STORAGE_KEY_SAVED_SPOTS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save spot in localStorage', err);
  }
  return updated;
}

export function getOfflineStatus(): OfflineStatus {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_OFFLINE_READY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return {
    isDownloaded: false,
    itemCount: ALL_ATTRACTIONS.length,
    estimatedSizeMb: 8.5,
  };
}

export async function downloadOfflinePack(
  onProgress?: (percent: number, statusText: string) => void
): Promise<boolean> {
  if (onProgress) onProgress(15, 'Mise en mémoire des fiches détaillées (Guangzhou, Shenzhen, Shantou, Chaozhou)...');
  
  // Save full data payload in localStorage
  try {
    localStorage.setItem('gz_offline_attractions', JSON.stringify(ALL_ATTRACTIONS));
    localStorage.setItem('gz_offline_itineraries', JSON.stringify(SUGGESTED_ITINERARIES));
  } catch (e) {
    console.warn('LocalStorage limit reached or disabled', e);
  }

  // Pre-fetch tiles for Guangdong key city nodes
  if ('caches' in window) {
    try {
      if (onProgress) onProgress(35, 'Mise en cache cartographique multi-villes...');
      const cache = await caches.open('osm-tiles-cache');
      
      // Sample key tiles for Guangzhou, Shenzhen, Shantou, Chaozhou
      const sampleTileUrls = [
        // Guangzhou
        'https://tile.openstreetmap.org/12/3336/1779.png',
        'https://tile.openstreetmap.org/12/3336/1780.png',
        // Shenzhen (Lat ~22.54, Lng ~114.05)
        'https://tile.openstreetmap.org/12/3345/1796.png',
        'https://tile.openstreetmap.org/12/3345/1797.png',
        // Shantou (Lat ~23.36, Lng ~116.68)
        'https://tile.openstreetmap.org/12/3375/1772.png',
        // Chaozhou (Lat ~23.66, Lng ~116.63)
        'https://tile.openstreetmap.org/12/3375/1766.png',
      ];

      for (let i = 0; i < sampleTileUrls.length; i++) {
        try {
          const res = await fetch(sampleTileUrls[i], { mode: 'no-cors' });
          if (res) {
            await cache.put(sampleTileUrls[i], res);
          }
        } catch {
          // Continue if individual tile fails
        }
        if (onProgress) {
          const pct = 35 + Math.round(((i + 1) / sampleTileUrls.length) * 55);
          onProgress(pct, `Tuiles cartographiques téléchargées (${i + 1}/${sampleTileUrls.length})...`);
        }
      }
    } catch (err) {
      console.warn('CacheStorage failed to pre-cache tiles', err);
    }
  }

  if (onProgress) onProgress(100, 'Pack 4 villes hors ligne prêt pour utilisation sans connexion !');

  const status: OfflineStatus = {
    isDownloaded: true,
    downloadDate: new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    itemCount: ALL_ATTRACTIONS.length,
    estimatedSizeMb: 11.2
  };

  try {
    localStorage.setItem(STORAGE_KEY_OFFLINE_READY, JSON.stringify(status));
  } catch (e) {
    console.error(e);
  }

  return true;
}

export function clearOfflinePack(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_OFFLINE_READY);
    localStorage.removeItem('gz_offline_attractions');
    localStorage.removeItem('gz_offline_itineraries');
    if ('caches' in window) {
      caches.delete('osm-tiles-cache');
    }
  } catch (err) {
    console.error(err);
  }
}
