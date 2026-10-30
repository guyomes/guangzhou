import React from 'react';
import { Attraction } from '../types/travel';
import { AttractionCard } from './AttractionCard';
import { Bookmark, Compass, Share2, Printer, MapPin, Sparkles, Navigation } from 'lucide-react';

interface SavedTripViewProps {
  savedAttractions: Attraction[];
  onOpenDetails: (attraction: Attraction) => void;
  onOpenTaxiCard: (attraction: Attraction) => void;
  onToggleSave: (id: string) => void;
  onViewOnMap: (stopIds: string[]) => void;
  onGoExplore: () => void;
}

export const SavedTripView: React.FC<SavedTripViewProps> = ({
  savedAttractions,
  onOpenDetails,
  onOpenTaxiCard,
  onToggleSave,
  onViewOnMap,
  onGoExplore,
}) => {
  const totalCost = savedAttractions.reduce((acc, a) => acc + a.estimatedCostRmb, 0);

  const handleShareTrip = () => {
    const tripSummary = `Mon voyage à Guangzhou :\n${savedAttractions.map(a => `• ${a.nameFr} (${a.nameCn}) - Métro : ${a.metroInfoFr}`).join('\n')}`;
    if (navigator.share) {
      navigator.share({
        title: 'Mon Tour de Guangzhou',
        text: tripSummary,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(tripSummary);
      alert('Résumé de votre séjour copié dans le presse-papier !');
    }
  };

  if (savedAttractions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 text-center max-w-lg mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <Bookmark className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Aucun lieu enregistré pour l'instant
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
          Parcourez l'onglet Explorer ou les Itinéraires suggérés et cliquez sur l'icône marque-page pour composer votre séjour sur-mesure à Guangzhou.
        </p>
        <button
          onClick={onGoExplore}
          className="mt-6 py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors inline-flex items-center gap-2"
        >
          <Compass className="w-4 h-4" />
          <span>Découvrir les lieux</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Overview Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4" />
            <span>Mon Carnet de Séjour</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            {savedAttractions.length} Lieux & Activités Sélectionnés
          </h2>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
            <span>Budget entrées estimé : <strong className="text-slate-800 dark:text-slate-200">{totalCost} RMB (~{Math.round(totalCost / 7.8)}€)</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onViewOnMap(savedAttractions.map(a => a.id))}
            className="py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-slate-800 transition shadow-sm"
          >
            <MapPin className="w-4 h-4" />
            <span>Voir tout sur la Carte</span>
          </button>
          <button
            onClick={handleShareTrip}
            className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            title="Partager ou copier l'itinéraire"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Partager</span>
          </button>
        </div>
      </div>

      {/* Grid of Saved Attractions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedAttractions.map((attraction) => (
          <AttractionCard
            key={attraction.id}
            attraction={attraction}
            onOpenDetails={onOpenDetails}
            onOpenTaxiCard={onOpenTaxiCard}
            onViewOnMap={(attr) => onViewOnMap([attr.id])}
            isSaved={true}
            onToggleSave={onToggleSave}
          />
        ))}
      </div>
    </div>
  );
};
