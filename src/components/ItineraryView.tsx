import React, { useState } from 'react';
import { SuggestedItinerary, Attraction, CityId } from '../types/travel';
import { SUGGESTED_ITINERARIES } from '../data/itineraries';
import { ALL_ATTRACTIONS, CITIES_CONFIG } from '../data/citiesData';
import { Calendar, Clock, Navigation, MapPin, Utensils, Compass, ChevronRight, Sparkles, Footprints, Building2 } from 'lucide-react';

interface ItineraryViewProps {
  initialCityId?: CityId;
  onSelectAttraction: (attraction: Attraction) => void;
  onOpenTaxiCard: (attraction: Attraction) => void;
  onViewOnMap: (stopIds: string[]) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  initialCityId = 'guangzhou',
  onSelectAttraction,
  onOpenTaxiCard,
  onViewOnMap,
}) => {
  const [selectedCity, setSelectedCity] = useState<CityId | 'multi'>(initialCityId);
  const [selectedDuration, setSelectedDuration] = useState<number>(3);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [travelPace, setTravelPace] = useState<'relaxed' | 'balanced' | 'packed'>('balanced');
  const [travelFocus, setTravelFocus] = useState<'all' | 'food' | 'heritage' | 'modern' | 'hidden'>('all');

  // Filter itineraries by city
  const cityItineraries = SUGGESTED_ITINERARIES.filter(it => it.cityId === selectedCity);
  
  // Available durations for the selected city
  const availableDurations = Array.from(new Set(cityItineraries.map(it => it.durationDays))).sort((a, b) => a - b);

  // Find active itinerary
  const activeItinerary = 
    cityItineraries.find(it => it.durationDays === selectedDuration) ||
    cityItineraries[0] ||
    SUGGESTED_ITINERARIES[0];

  const currentDay = activeItinerary.days[activeDayIndex] || activeItinerary.days[0];

  const getAttractionById = (id: string): Attraction | undefined => {
    return ALL_ATTRACTIONS.find(a => a.id === id);
  };

  const dayStopAttractions = currentDay.stops
    .map(s => getAttractionById(s.attractionId))
    .filter((a): a is Attraction => a !== undefined);

  return (
    <div className="space-y-6 pb-12">
      {/* City & Duration Selector Bar */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        {/* City Choice Tabs */}
        <div>
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-2">
            1. Choisissez votre Destination
          </span>
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-x-auto">
            {[
              { id: 'guangzhou', name: 'Guangzhou (广州)' },
              { id: 'shenzhen', name: 'Shenzhen (深圳)' },
              { id: 'shantou', name: 'Shantou (汕头)' },
              { id: 'chaozhou', name: 'Chaozhou (潮州)' },
              { id: 'multi', name: 'Combiné Chaoshan (潮汕)' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedCity(c.id as any);
                  setActiveDayIndex(0);
                  const firstDuration = SUGGESTED_ITINERARIES.find(it => it.cityId === c.id)?.durationDays || 1;
                  setSelectedDuration(firstDuration);
                }}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCity === c.id
                    ? 'bg-slate-900 text-white dark:bg-rose-600 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Duration Choice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
              2. Durée du Séjour
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              Combien de jours prévoyez-vous ?
            </h2>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl shrink-0 self-start sm:self-auto overflow-x-auto max-w-full">
            {availableDurations.map((days) => (
              <button
                key={days}
                onClick={() => {
                  setSelectedDuration(days);
                  setActiveDayIndex(0);
                }}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedDuration === days
                    ? 'bg-slate-900 text-white dark:bg-rose-600 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {days} {days === 1 ? 'Jour' : 'Jours'}
              </button>
            ))}
          </div>
        </div>

        {/* Pace and Focus Filters */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              Rythme de visite souhaité :
            </span>
            <div className="flex items-center gap-2">
              {[
                { id: 'relaxed', label: 'Détendu (2-3 visites/j)' },
                { id: 'balanced', label: 'Équilibré (3-4 visites/j)' },
                { id: 'packed', label: 'Intense (5+ visites/j)' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setTravelPace(p.id as any)}
                  className={`py-1.5 px-2.5 rounded-lg border text-xs font-medium transition-colors ${
                    travelPace === p.id
                      ? 'border-slate-900 bg-slate-900 text-white dark:border-rose-600 dark:bg-rose-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              Ambiance prioritaire :
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'Tout explorer' },
                { id: 'food', label: 'Gastronomie & Dim Sum' },
                { id: 'heritage', label: 'Temples & Qing' },
                { id: 'hidden', label: 'Pépites d’Art' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTravelFocus(f.id as any)}
                  className={`py-1.5 px-2.5 rounded-lg border text-xs font-medium transition-colors ${
                    travelFocus === f.id
                      ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:border-rose-500 dark:text-rose-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary Title Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold mb-1">
              <Calendar className="w-4 h-4" />
              <span>Itinéraire {activeItinerary.durationDays} Jours Recommandé</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              {activeItinerary.titleFr}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {activeItinerary.subtitleFr}
            </p>
          </div>

          <button
            onClick={() => onViewOnMap(currentDay.stops.map(s => s.attractionId))}
            className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-colors shrink-0"
          >
            <Compass className="w-4 h-4" />
            <span>Tracer le Jour {activeDayIndex + 1} sur la Carte</span>
          </button>
        </div>
      </div>

      {/* Day Selector Tabs (if multi-day) */}
      {activeItinerary.days.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {activeItinerary.days.map((day, idx) => (
            <button
              key={day.dayNumber}
              onClick={() => setActiveDayIndex(idx)}
              className={`py-2.5 px-4 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
                activeDayIndex === idx
                  ? 'bg-slate-900 text-white dark:bg-rose-600 shadow-md scale-[1.02]'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Jour {day.dayNumber}</span>
              <span className="opacity-60 font-normal truncate max-w-[120px] hidden sm:inline">
                · {day.themeFr}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Active Day Overview Card */}
      <div className="bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-2 text-rose-800 dark:text-rose-400 font-bold text-xs uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Thématique du Jour : {currentDay.themeFr}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {currentDay.summaryFr}
        </p>
      </div>

      {/* Timeline Steps for Current Day */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {currentDay.stops.map((stop, stopIdx) => {
          const attraction = getAttractionById(stop.attractionId);
          if (!attraction) return null;

          const timeSlotLabels: Record<string, { label: string; color: string }> = {
            matin: { label: 'Matinée', color: 'bg-amber-500' },
            dejeuner: { label: 'Déjeuner Gourmand', color: 'bg-emerald-500' },
            'apres-midi': { label: 'Après-midi', color: 'bg-blue-500' },
            soiree: { label: 'Soirée & Nuit', color: 'bg-purple-500' },
          };

          const slotInfo = timeSlotLabels[stop.timeSlot] || { label: stop.timeSlot, color: 'bg-slate-500' };

          return (
            <div key={stopIdx} className="relative group">
              {/* Step indicator dot on line */}
              <div className="absolute -left-[1.85rem] sm:-left-[2.35rem] top-4 w-5 h-5 rounded-full bg-white dark:bg-slate-900 border-4 border-rose-500 flex items-center justify-center shadow-sm z-10" />

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                {/* Time slot & Duration */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                      Étape {stopIdx + 1} · {slotInfo.label}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {stop.durationHours}h sur place
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                    {attraction.district}
                  </span>
                </div>

                {/* Attraction info split */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                  <div className="flex items-start gap-3 flex-1">
                    <img
                      src={attraction.image}
                      alt={attraction.nameFr}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 cursor-pointer"
                      onClick={() => onSelectAttraction(attraction)}
                    />
                    <div>
                      <h4
                        onClick={() => onSelectAttraction(attraction)}
                        className="text-base font-bold text-slate-900 dark:text-white hover:text-rose-600 transition cursor-pointer"
                      >
                        {attraction.nameFr}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {attraction.nameCn} · {attraction.pinyin}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {stop.activityFr}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => onViewOnMap([attraction.id])}
                      className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition flex items-center gap-1 shadow-sm"
                      title="Centrer et zoomer sur ce lieu sur la carte interactive"
                    >
                      <MapPin className="w-3.5 h-3.5 text-white" />
                      <span>Carte</span>
                    </button>
                    <button
                      onClick={() => onOpenTaxiCard(attraction)}
                      className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-100 transition flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Taxi</span>
                    </button>
                    <button
                      onClick={() => onSelectAttraction(attraction)}
                      className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition"
                    >
                      Détails
                    </button>
                  </div>
                </div>

                {/* Food recommendation if lunchtime */}
                {stop.foodSuggestionFr && (
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
                    <Utensils className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Spécialité culinaire conseillée :</span>
                      <span>{stop.foodSuggestionFr}</span>
                    </div>
                  </div>
                )}

                {/* Transport advice to next spot */}
                <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Footprints className="w-3.5 h-3.5 text-slate-400" />
                  <span>Trajet : {stop.transportAdviceFr}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
