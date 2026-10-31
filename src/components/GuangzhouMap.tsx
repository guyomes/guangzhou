import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Attraction, CityId } from '../types/travel';
import { CITIES_CONFIG } from '../data/citiesData';
import { Layers, MapPin, Compass, ShieldCheck, WifiOff, Route as RouteIcon } from 'lucide-react';

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
  const lastFittedRouteRef = useRef<string | null>(null);

  const isItineraryRoute = !!itineraryStopIds && itineraryStopIds.length > 1;

  const [filterMode, setFilterMode] = useState<'all' | 'top' | 'hidden' | 'itinerary'>(
    isItineraryRoute ? 'itinerary' : 'all'
  );
  const [activeAttraction, setActiveAttraction] = useState<Attraction | null>(null);

  // Filtered attractions based on selected city and filter.
  // Route stops are always included so the polyline has all its vertices on-screen.
  const displayedAttractions = attractions.filter((attraction) => {
    const isItineraryStop = isItineraryRoute && itineraryStopIds!.includes(attraction.id);
    if (isItineraryStop) return true;

    if (selectedCityId !== 'all' && attraction.cityId !== selectedCityId) {
      return false;
    }
    if (filterMode === 'top') return attraction.isTopRated;
    if (filterMode === 'hidden') return attraction.isHiddenGem;
    if (filterMode === 'itinerary') return !isItineraryRoute;
    return true;
  });

  // When the user opens a day itinerary, default to the "itinerary" filter view.
  useEffect(() => {
    if (isItineraryRoute) {
      setFilterMode('itinerary');
    }
  }, [isItineraryRoute]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      let initialCenter: [number, number] = [23.125, 113.275];
      let initialZoom = 12;

      const targetedSpot = selectedAttractionId
        ? attractions.find((a) => a.id === selectedAttractionId)
        : null;
      if (targetedSpot) {
        initialCenter = [targetedSpot.lat, targetedSpot.lng];
        initialZoom = 16;
        setActiveAttraction(targetedSpot);
      } else if (selectedCityId !== 'all' && CITIES_CONFIG[selectedCityId]) {
        initialCenter = [
          CITIES_CONFIG[selectedCityId].centerLat,
          CITIES_CONFIG[selectedCityId].centerLng,
        ];
        initialZoom = CITIES_CONFIG[selectedCityId].zoomLevel;
      }

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

      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          if (targetedSpot) {
            mapInstanceRef.current.flyTo(
              [targetedSpot.lat, targetedSpot.lng],
              16,
              { duration: 0.8 }
            );
          }
        }
      }, 150);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Pan to city when selectedCityId changes, unless a specific attraction is focused
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (selectedAttractionId) return;

    if (selectedCityId !== 'all' && CITIES_CONFIG[selectedCityId]) {
      const city = CITIES_CONFIG[selectedCityId];
      map.flyTo([city.centerLat, city.centerLng], city.zoomLevel, { duration: 1.2 });
    } else if (selectedCityId === 'all') {
      map.flyTo([23.1, 114.8], 8, { duration: 1.2 });
    }
  }, [selectedCityId, selectedAttractionId]);

  // Update Markers + itinerary polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers & polyline before redrawing
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (!isItineraryRoute) {
      lastFittedRouteRef.current = null;
    }

    // Resolve itinerary stops in the day's declared order
    const itineraryAttractions: Attraction[] = isItineraryRoute
      ? itineraryStopIds!
          .map((id) => attractions.find((a) => a.id === id))
          .filter((a): a is Attraction => !!a)
      : [];

    displayedAttractions.forEach((attraction) => {
      const isSelected = attraction.id === selectedAttractionId;
      const isHidden = attraction.isHiddenGem;

      const itineraryIndex = isItineraryRoute
        ? itineraryAttractions.findIndex((a) => a.id === attraction.id)
        : -1;
      const isItineraryStop = itineraryIndex >= 0;

      // Color scheme according to category (overridden by rose when on route)
      let pinColor = '#3b82f6';
      if (attraction.category === 'heritage') pinColor = '#e11d48';
      if (attraction.category === 'food' || attraction.category === 'restaurant') pinColor = '#f59e0b';
      if (attraction.category === 'mall') pinColor = '#0ea5e9';
      if (attraction.category === 'event') pinColor = '#ec4899';
      if (attraction.category === 'modern') pinColor = '#6366f1';
      if (attraction.category === 'nature') pinColor = '#10b981';
      if (attraction.category === 'hotel') pinColor = '#0284c7';
      if (isHidden) pinColor = '#8b5cf6';
      if (isItineraryStop) pinColor = '#e11d48';

      let categorySymbol = '●';
      if (attraction.category === 'hotel') categorySymbol = '🏨';
      else if (isHidden) categorySymbol = '✦';
      else if (attraction.category === 'food' || attraction.category === 'restaurant') categorySymbol = '🍴';
      else if (attraction.category === 'mall') categorySymbol = '🛍️';
      else if (attraction.category === 'event') categorySymbol = '⚡';
      else if (attraction.category === 'nature') categorySymbol = '🌿';
      else if (attraction.category === 'heritage') categorySymbol = '🏛️';
      else if (attraction.category === 'modern') categorySymbol = '🏙️';

      const prefixHtml = isItineraryStop
        ? `<span style="
            display:inline-flex;
            align-items:center;
            justify-content:center;
            width:18px;
            height:18px;
            border-radius:50%;
            background:#ffffff;
            color:${pinColor};
            font-size:11px;
            font-weight:800;
            line-height:1;
          ">${itineraryIndex + 1}</span>`
        : `<span style="font-size: 12px; line-height: 1;">${categorySymbol}</span>`;

      const customIcon = L.divIcon({
        className: 'leaflet-custom-marker-wrapper',
        html: `
          <div style="
            position: absolute;
            left: 0;
            bottom: 0;
            transform: translate(-50%, 0);
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            pointer-events: auto;
            user-select: none;
          ">
            <div style="
              background: ${pinColor};
              color: white;
              border-radius: 9999px;
              padding: ${isSelected || isItineraryStop ? '6px 12px' : '4px 9px'};
              font-size: 11px;
              font-weight: 700;
              font-family: system-ui, -apple-system, sans-serif;
              box-shadow: 0 4px 12px rgba(0,0,0,0.35);
              display: flex;
              align-items: center;
              gap: 5px;
              border: 2px solid #ffffff;
              white-space: nowrap;
              transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
              transform-origin: bottom center;
              transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            ">
              ${prefixHtml}
              <span style="max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${attraction.nameFr}
              </span>
            </div>
            <div style="
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 7px solid ${pinColor};
              margin-top: -1px;
              filter: drop-shadow(0 1px 1px rgba(0,0,0,0.25));
            "></div>
            <div style="
              width: 5px;
              height: 5px;
              border-radius: 50%;
              background: ${pinColor};
              border: 1px solid #ffffff;
              box-shadow: 0 0 2px rgba(0,0,0,0.6);
              margin-top: -1px;
            "></div>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([attraction.lat, attraction.lng], { icon: customIcon })
        .addTo(map)
        .on('click', () => {
          setActiveAttraction(attraction);
          const targetZoom = Math.max(map.getZoom(), 16);
          map.flyTo([attraction.lat, attraction.lng], targetZoom, {
            animate: true,
            duration: 1.0,
          });
        });

      marker.bindTooltip(
        `
          <div style="font-weight: 700; font-size: 12px; color: #0f172a; font-family: system-ui, sans-serif;">
            ${isItineraryStop ? `Étape ${itineraryIndex + 1} · ` : ''}${attraction.nameFr}
          </div>
          <div style="font-size: 10px; color: #475569; margin-top: 2px;">
            ${attraction.district} · ★ ${attraction.scores[0]?.score?.toFixed(1) || '4.8'} / 5
          </div>
        `,
        {
          direction: 'top',
          offset: [0, -38],
          opacity: 0.96,
        }
      );

      markersRef.current[attraction.id] = marker;
    });

    // Draw the itinerary polyline in declared visit order
    if (isItineraryRoute && itineraryAttractions.length > 1) {
      const routeLatLngs = itineraryAttractions.map(
        (a) => [a.lat, a.lng] as [number, number]
      );

      polylineRef.current = L.polyline(routeLatLngs, {
        color: '#e11d48',
        weight: 5,
        opacity: 0.9,
        dashArray: '10 8',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      // Draw small dots at each stop for a cleaner path
      itineraryAttractions.forEach((a) => {
        L.circleMarker([a.lat, a.lng], {
          radius: 4,
          color: '#e11d48',
          fillColor: '#ffffff',
          fillOpacity: 1,
          weight: 2,
        }).addTo(map);
      });

      // Fit the map to the entire route exactly once per unique route
      const routeKey = itineraryStopIds!.join('|');
      if (routeKey !== lastFittedRouteRef.current) {
        lastFittedRouteRef.current = routeKey;
        setTimeout(() => {
          if (!mapInstanceRef.current) return;
          mapInstanceRef.current.invalidateSize();
          mapInstanceRef.current.fitBounds(L.latLngBounds(routeLatLngs), {
            padding: [60, 60],
            maxZoom: 15,
            animate: true,
            duration: 0.8,
          });
        }, 220);
      }
    }
  }, [displayedAttractions, selectedAttractionId, filterMode, itineraryStopIds, attractions, isItineraryRoute]);

  // Center & zoom closely on selected attraction if prop changed.
  // While a route is active we keep the whole path in view.
  useEffect(() => {
    if (!selectedAttractionId) return;
    const map = mapInstanceRef.current;
    if (!map) return;

    const match = attractions.find((a) => a.id === selectedAttractionId);

    if (isItineraryRoute) {
      if (match) setActiveAttraction(match);
      return;
    }

    if (match) {
      setActiveAttraction(match);
      map.flyTo([match.lat, match.lng], 16, { animate: true, duration: 1.2 });
    }
  }, [selectedAttractionId, attractions, isItineraryRoute]);

  const handleCenterGuangzhou = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([23.125, 113.275], 12, { animate: true });
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
                {cId === 'all'
                  ? 'Toutes'
                  : cId === 'guangzhou'
                    ? 'Canton'
                    : CITIES_CONFIG[cId].nameFr.split(' ')[0]}
              </button>
            ))}
          </div>
        )}

        {isItineraryRoute && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600 text-white backdrop-blur-md text-xs font-bold border border-rose-400 shadow-lg">
            <RouteIcon className="w-3.5 h-3.5" />
            <span>
              Itinéraire · {itineraryStopIds!.length} étapes
            </span>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 p-1 rounded-xl shadow-lg border border-slate-200/80 dark:border-slate-800 text-xs backdrop-blur-md">
        {isItineraryRoute && (
          <button
            onClick={() => setFilterMode('itinerary')}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1 ${
              filterMode === 'itinerary'
                ? 'bg-rose-600 text-white'
                : 'text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40'
            }`}
            title="Afficher uniquement les étapes de l’itinéraire"
          >
            <RouteIcon className="w-3.5 h-3.5" />
            Itinéraire
          </button>
        )}
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

              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-amber-600">
                  ★ {activeAttraction.scores[0]?.score?.toFixed(1)}
                </span>
                <span>({activeAttraction.scores[0]?.sourceName?.split(' ')[0] || 'Dianping'})</span>
                {activeAttraction.scores[1] && (
                  <>
                    <span>·</span>
                    <span className="font-semibold text-emerald-600">
                      ★ {activeAttraction.scores[1].score?.toFixed(1)}
                    </span>
                    <span>({activeAttraction.scores[1].sourceName?.split(' ')[0] || 'Tripadvisor'})</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo(
                    [activeAttraction.lat, activeAttraction.lng],
                    17,
                    { duration: 0.8 }
                  );
                }
              }}
              className="py-2 px-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-lg transition"
              title="Zoomer au plus près sur la carte"
            >
              🔍 Zoom
            </button>
            <button
              onClick={() => onSelectAttraction(activeAttraction)}
              className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-slate-900 dark:bg-rose-600 rounded-lg hover:bg-slate-800 transition text-center"
            >
              Fiche détaillée en français
            </button>
            <button
              onClick={() => onOpenTaxiCard(activeAttraction)}
              className="py-2 px-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 transition"
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
