import React from 'react';
import { Attraction } from '../types/travel';
import { X, Navigation, Bookmark, BookmarkCheck, Clock, MapPin, Ticket, Sparkles, CheckCircle2 } from 'lucide-react';

interface AttractionModalProps {
  attraction: Attraction | null;
  onClose: () => void;
  onOpenTaxiCard: (attraction: Attraction) => void;
  onViewOnMap?: (attraction: Attraction) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export const AttractionModal: React.FC<AttractionModalProps> = ({
  attraction,
  onClose,
  onOpenTaxiCard,
  onViewOnMap,
  isSaved,
  onToggleSave,
}) => {
  if (!attraction) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
      <div 
        className="w-full sm:max-w-2xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile Grab Bar */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Hero Image Container */}
        <div className="relative aspect-[16/9] w-full shrink-0 bg-slate-950">
          <img
            src={attraction.image}
            alt={attraction.thumbnailAlt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

          {/* Map and Close Buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {onViewOnMap && (
              <button
                onClick={() => {
                  onViewOnMap(attraction);
                  onClose();
                }}
                aria-label="Voir sur la carte"
                className="h-9 px-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 shadow-md backdrop-blur-md transition-colors text-xs font-bold"
                title="Centrer et zoomer sur la carte interactive"
              >
                <MapPin className="w-3.5 h-3.5 text-white" />
                <span>Voir sur la carte</span>
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Floating Actions on Hero */}
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold mb-1">
                <span>{attraction.district}</span>
                <span>·</span>
                <span>{attraction.nameCn}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                {attraction.nameFr}
              </h2>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                {attraction.pinyin} (Cantonnais : {attraction.cantonesePhonetic})
              </p>
            </div>

            <button
              onClick={() => onToggleSave(attraction.id)}
              className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors"
              title={isSaved ? 'Enregistré dans mon voyage' : 'Enregistrer'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 text-rose-400 fill-rose-400" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200">
          {/* Practical Info Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Durée suggérée</span>
              <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">
                {attraction.recommendedDuration}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block font-medium">
                {attraction.category === 'hotel' ? 'Tarif par nuit' : 'Billet d’entrée'}
              </span>
              <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">
                {attraction.category === 'hotel'
                  ? `~${attraction.estimatedCostRmb} RMB/nuit (~${Math.round(attraction.estimatedCostRmb / 7.8)}€)`
                  : (attraction.estimatedCostRmb === 0 ? 'Gratuit' : `${attraction.estimatedCostRmb} RMB (~${Math.round(attraction.estimatedCostRmb / 7.8)}€)`)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Meilleur moment</span>
              <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block truncate" title={attraction.bestTime}>
                {attraction.bestTime}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block font-medium">District</span>
              <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block">
                {attraction.district}
              </span>
            </div>
          </div>

          {/* Description Section */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Description & Récit du Lieu
            </h3>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {attraction.descriptionFr}
            </p>
          </section>

          {/* Cultural Secret / Note */}
          <section className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Anecdote & Culture Cantonaise</span>
            </div>
            <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              {attraction.culturalNoteFr}
            </p>
          </section>

          {/* Visiting Advice & Metro Access */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Accès en Métro & Conseils Pratiques
            </h3>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-slate-900 dark:text-white">Itinéraire Métro & Transport :</span>
                <span>{attraction.metroInfoFr}</span>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {attraction.visitingTipsFr.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Dual Review Score Breakdown (Chinese & Western Sites) */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Scores & Verbatim des Voyageurs
              </h3>
              <span className="text-xs text-slate-500">Plateformes Chinoises & Occidentales</span>
            </div>

            <div className="space-y-2.5">
              {attraction.scores.map((score, sIdx) => (
                <div
                  key={sIdx}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {score.sourceName}
                      </span>
                      {score.badge && (
                        <span className="text-[10px] font-medium text-rose-600 dark:text-rose-400">
                          {score.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-amber-500">★ {score.score.toFixed(1)} / 5</span>
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 font-mono">
                        ({score.reviewCount.toLocaleString('fr-FR')} avis)
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 p-2 rounded-lg">
                    "{score.highlightQuote}"
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2.5">
          {onViewOnMap && (
            <button
              onClick={() => {
                onViewOnMap(attraction);
                onClose();
              }}
              className="w-full sm:w-auto py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-md shrink-0"
            >
              <MapPin className="w-4 h-4 text-white" />
              <span>Voir sur la carte</span>
            </button>
          )}
          <button
            onClick={() => onOpenTaxiCard(attraction)}
            className="flex-1 w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <Navigation className="w-4 h-4 text-rose-500" />
            <span>Fiche Chauffeur de Taxi (向司机出示)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
