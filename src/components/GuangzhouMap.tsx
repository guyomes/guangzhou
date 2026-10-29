import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Attraction, CityId } from '../types/travel';
import { CITIES_CONFIG } from '../data/citiesData';
import { Layers, MapPin, Compass, ShieldCheck, WifiOff } from 'lucide-react';

interface GuangzhouMapProps {
  attractions: Attraction[];
  selectedCityId: CityId | 'all';
  onSelectCity?: (city: CityId | 'all') => void;
  selectedAttractionId?: string | null;
  onSelectAttraction: (attraction: Attraction) => void;
  onOpenTaxiCard: (attraction: Attraction) => void;
  itineraryStopIds?: string[];
  isOffline: boolean;
}

export const GuangzhouMap: React.FC<GuangzhouMapProps> = ({
  attractions,
  selectedCityId,
  onSelectCity,
  selectedAttractionId,
  onSelectAttraction,
  onOpenTaxiCard,
  itineraryStopIds,
  isOffline,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const polylineRef = useRef<L.Polyline | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'top' | 'hidden' | 'itinerary'>('all');
  const [activeAttraction, setActiveAttraction] = useState<Attraction | null>(null);

  // Filtered attractions based on selected city and filter
  const displayedAttractions = attractions.filter(attraction => {
    if (selectedCityId !== 'all' && attraction.cityId !== selectedCityId) {
      return false;
    }
    if (filterMode === 'top') return attraction.isTopRated;
    if (filterMode === 'hidden') return attraction.isHiddenGem;
    if (filterMode === 'itinerary' && itineraryStopIds && itineraryStopIds.length > 0) {
      return itineraryStopIds.includes(attraction.id);
    }
    return true;
  });

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialCenter: [number, number] = selectedCityId !== 'all' && CITIES_CONFIG[selectedCityId]
        ? [CITIES_CONFIG[selectedCityId].centerLat, CITIES_CONFIG[selectedCityId].centerLng]
        : [23.125, 113.285];

      const initialZoom = selectedCityId !== 'all' && CITIES_CONFIG[selectedCityId]
        ? CITIES_CONFIG[selectedCityId].zoomLevel
        : 12;

      // Initialize Leaflet map
      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 7,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Pan to city when selectedCityId changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedCityId !== 'all' && CITIES_CONFIG[selectedCityId]) {
      const city = CITIES_CONFIG[selectedCityId];
      map.flyTo([city.centerLat, city.centerLng], city.zoomLevel, { duration: 1.2 });
    } else if (selectedCityId === 'all') {
      map.flyTo([23.1, 114.8], 8, { duration: 1.2 });
    }
  }, [selectedCityId]);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    const routeLatLngs: [number, number][] = [];

    displayedAttractions.forEach((attraction) => {
      const isSelected = attraction.id === selectedAttractionId;
      const isHidden = attraction.isHiddenGem;

      // Color scheme according to category
      let pinColor = '#3b82f6'; // blue
      if (attraction.category === 'heritage') pinColor = '#e11d48'; // rose
      if (attraction.category === 'food' || attraction.category === 'restaurant') pinColor = '#f59e0b'; // amber
      if (attraction.category === 'mall') pinColor = '#0ea5e9'; // sky blue
      if (attraction.category === 'event') pinColor = '#ec4899'; // pink
      if (attraction.category === 'modern') pinColor = '#6366f1'; // indigo
      if (attraction.category === 'nature') pinColor = '#10b981'; // emerald
      if (isHidden) pinColor = '#8b5cf6'; // violet for hidden gems

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="
            position: relative;
            transform: translate(-50%, -100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
          ">
            <div style="
              background: ${pinColor};
              color: white;
              border-radius: 9999px;
              padding: ${isSelected ? '6px 12px' : '4px 9px'};
              font-size: 11px;
              font-weight: 700;
              font-family: system-ui, -apple-system, sans-serif;
              box-shadow: 0 4px 12px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              gap: 5px;
              border: 2px solid #ffffff;
              transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
              transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            ">
              <span>${isHidden ? '✦' : '●'}</span>
              <span style="max-width: 130px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${attraction.nameFr}
              </span>
            </div>
            <div style="
              width: 0;
              height: 0;
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 6px solid ${pinColor};
            "></div>
          </div>
        `,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
      });

      const marker = L.marker([attraction.lat, attraction.lng], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          setActiveAttraction(attraction);
          map.panTo([attraction.lat, attraction.lng], { animate: true });
        });

      // Bind French tooltip for clear readability
      marker.bindTooltip(`
        <div style="font-weight: 700; font-size: 12px; color: #0f172a; font-family: system-ui, sans-serif;">
          ${attraction.nameFr}
        </div>
        <div style="font-size: 10px; color: #475569; margin-top: 2px;">
          ${attraction.district} · ★ ${attraction.scores[0]?.score?.toFixed(1) || '4.8'} / 5
        </div>
      `, {
        direction: 'top',
        offset: [0, -32],
        opacity: 0.96,
      });

      markersRef.current[attraction.id] = marker;

      if (itineraryStopIds && itineraryStopIds.includes(attraction.id)) {
        routeLatLngs.push([attraction.lat, attraction.lng]);
      }
    });

    // Draw connecting itinerary line if in itinerary mode
    if (filterMode === 'itinerary' && routeLatLngs.length > 1) {
      polylineRef.current = L.polyline(routeLatLngs, {
        color: '#f43f5e',
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 8',
      }).addTo(map);

      map.fitBounds(L.latLngBounds(routeLatLngs), { padding: [40, 40] });
    }
  }, [displayedAttractions, selectedAttractionId, filterMode, itineraryStopIds]);

  // Center on selected attraction if prop changed
  useEffect(() => {
    if (selectedAttractionId && mapInstanceRef.current) {
      const match = attractions.find(a => a.id === selectedAttractionId);
      if (match) {
        setActiveAttraction(match);
        mapInstanceRef.current.setView([match.lat, match.lng], 14, { animate: true });
      }
    }
  }, [selectedAttractionId, attractions]);

  const handleCenterGuangzhou = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([23.125, 113.285], 12, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-12rem)] md:h-[620px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-900">
      {/* Offline Status Badge & City Switcher */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-1.5 max-w-[calc(100%-140px)]">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white backdrop-blur-md text-xs font-medium border border-slate-700 shadow-lg">
          {isOffline ? (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Hors Ligne</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Précachée</span>
            </>
          )}
        </div>

        {onSelectCity && (
          <div className="flex items-center gap-1 p-0.5 bg-slate-900/90 backdrop-blur-md rounded-full border border-slate-700 shadow-lg text-[11px] overflow-x-auto">
            {(['all', 'guangzhou', 'shenzhen', 'shantou', 'chaozhou'] as const).map((cId) => (
              <button
                key={cId}
                onClick={() => onSelectCity(cId)}
                className={`px-2.5 py-1 rounded-full font-semibold transition-colors whitespace-nowrap ${
                  selectedCityId === cId
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {cId === 'all' ? 'Toutes' : (cId === 'guangzhou' ? 'Canton' : CITIES_CONFIG[cId].nameFr.split(' ')[0])}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 p-1 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-800 text-xs backdrop-blur-md">
        <button
          onClick={() => setFilterMode('all')}
          className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
            filterMode === 'all'
              ? 'bg-slate-900 text-white dark:bg-rose-600'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Tous ({attractions.length})
        </button>
        <button
          onClick={() => setFilterMode('top')}
          className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
            filterMode === 'top'
              ? 'bg-slate-900 text-white dark:bg-rose-600'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Top Notés
        </button>
        <button
          onClick={() => setFilterMode('hidden')}
          className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
            filterMode === 'hidden'
              ? 'bg-purple-600 text-white'
              : 'text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40'
          }`}
        >
          ✦ Pépites
        </button>
      </div>

      {/* Center map button */}
      <button
        onClick={handleCenterGuangzhou}
        aria-label="Recentrer sur Guangzhou"
        className="absolute bottom-20 right-3 z-[1000] w-10 h-10 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 transition-colors"
      >
        <Compass className="w-5 h-5 text-rose-500" />
      </button>

      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Active Attraction Bottom Card */}
      {activeAttraction && (
        <div className="absolute bottom-4 left-3 right-3 md:left-6 md:right-auto md:w-96 z-[1000] bg-white dark:bg-slate-900 rounded-2xl p-3.5 shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-lg">
          <div className="flex items-start gap-3">
            <img
              src={activeAttraction.image}
              alt={activeAttraction.nameFr}
              className="w-18 h-18 rounded-xl object-cover shrink-0"
              onError={(e) => {
                // Fallback styled avatar if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                  {activeAttraction.district}
                </span>
                <button
                  onClick={() => setActiveAttraction(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs px-1"
                >
                  ✕
                </button>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {activeAttraction.nameFr}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {activeAttraction.nameCn} · {activeAttraction.pinyin}
              </p>
              
              {/* Dual Review Highlights */}
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-amber-600">★ {activeAttraction.scores[0]?.score}</span>
                <span>(Dianping)</span>
                <span>·</span>
                <span className="font-semibold text-emerald-600">★ {activeAttraction.scores[1]?.score || 4.7}</span>
                <span>(Tripadvisor)</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onSelectAttraction(activeAttraction)}
              className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-slate-900 dark:bg-rose-600 rounded-lg hover:bg-slate-800 transition text-center"
            >
              Fiche détaillée en français
            </button>
            <button
              onClick={() => onOpenTaxiCard(activeAttraction)}
              className="py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 transition"
              title="Montrer au chauffeur de taxi"
            >
              向司机出示 🚕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
