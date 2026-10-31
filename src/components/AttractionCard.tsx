import React from 'react';
import { Attraction } from '../types/travel';
import { Bookmark, BookmarkCheck, Navigation, Star, Heart, MapPin, ExternalLink } from 'lucide-react';
import { formatAnnualVisitors } from '../utils/reviewUtils';

interface AttractionCardProps {
  attraction: Attraction;
  onOpenDetails: (attraction: Attraction) => void;
  onOpenTaxiCard: (attraction: Attraction) => void;
  onViewOnMap?: (attraction: Attraction) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
}

export const AttractionCard: React.FC<AttractionCardProps> = ({
  attraction,
  onOpenDetails,
  onOpenTaxiCard,
  onViewOnMap,
  isSaved,
  onToggleSave,
}) => {

  return (
    <article className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Visual Header */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={attraction.image}
          alt={attraction.thumbnailAlt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // High quality fallback container if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />

        {/* Top Badges / Indicators */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {attraction.category === 'hotel' && (
            <span className="bg-sky-600/95 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-sm">
              🏨 Hôtel
            </span>
          )}
          {attraction.isTopRated && (
            <span className="bg-rose-600/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-sm">
              ★ Coup de Cœur
            </span>
          )}
          {attraction.isHiddenGem && (
            <span className="bg-purple-600/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-sm">
              ✦ Pépite Cachée
            </span>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(attraction.id);
          }}
          aria-label={isSaved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-rose-600 dark:hover:text-rose-400 transition-colors shadow-sm"
        >
          {isSaved ? (
            <BookmarkCheck className="w-4 h-4 text-rose-600 fill-rose-600" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>

        {/* Bottom Bar overlay: District & Cost */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-3 pt-6 flex items-center justify-between text-white text-xs">
          <span className="font-medium text-slate-200">{attraction.district}</span>
          <span className="font-semibold text-rose-300">
            {attraction.category === 'hotel'
              ? `~${attraction.estimatedCostRmb} RMB/nuit`
              : (attraction.estimatedCostRmb === 0 ? 'Entrée Gratuite' : `${attraction.estimatedCostRmb} RMB`)}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata (Zero-pill rule) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-medium">
            <span>{attraction.recommendedDuration}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-700 dark:text-slate-300">{attraction.nameCn}</span>
            <span aria-hidden="true">·</span>
            <span className="italic">{attraction.pinyin}</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            {attraction.nameFr}
          </h3>

          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {attraction.descriptionFr}
          </p>

          {/* Avis éditorial, Score, Fréquentation & Liens */}
          <div className="mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 space-y-2">
            {/* Stars & Annual Visitors */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-500 flex items-center gap-1">
                ★ {attraction.overallScore.toFixed(1)} <span className="text-[11px] font-normal text-slate-500">/ 5</span>
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                👥 ~{formatAnnualVisitors(attraction.annualVisitors)} / an
              </span>
            </div>

            {/* Quote prefixed with "Notre avis : " */}
            <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2 leading-relaxed border-l-2 border-rose-400/80 pl-2">
              "{attraction.ourOpinionFr}"
            </p>

            {/* Direct Links: Tripadvisor & Wikipédia */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
              <a
                href={attraction.tripadvisorUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 transition-colors"
                title="Consulter la fiche Tripadvisor"
              >
                <span>Tripadvisor</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>

              {attraction.wikipediaUrl ? (
                <a
                  href={attraction.wikipediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 transition-colors"
                  title="Consulter l'article Wikipédia"
                >
                  <span>Wikipédia</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ) : (
                <span className="text-[10px] text-slate-400">Guangdong Guide</span>
              )}
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
          <button
            onClick={() => onOpenDetails(attraction)}
            className="flex-1 py-2 px-2.5 text-xs font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-center truncate"
          >
            Guide & Conseils
          </button>
          
          {onViewOnMap && (
            <button
              onClick={() => onViewOnMap(attraction)}
              className="py-2 px-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1 shrink-0"
              title="Centrer et zoomer sur la carte interactive"
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Carte</span>
            </button>
          )}

          <button
            onClick={() => onOpenTaxiCard(attraction)}
            className="py-2 px-2.5 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-lg transition-colors flex items-center gap-1 shrink-0"
            title="Afficher la fiche taxi en chinois avec prononciation"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Taxi</span>
          </button>
        </div>
      </div>
    </article>
  );
};
