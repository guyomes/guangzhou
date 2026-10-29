import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { Download, ShieldCheck, WifiOff } from 'lucide-react';

interface HeaderProps {
  activeTab: 'explore' | 'itineraries' | 'map' | 'saved';
  onTabChange: (tab: 'explore' | 'itineraries' | 'map' | 'saved') => void;
  savedCount: number;
  onOpenOfflineModal: () => void;
  isOffline: boolean;
  isPackDownloaded: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  savedCount,
  onOpenOfflineModal,
  isOffline,
  isPackDownloaded,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single line, no subtitle clutter) */}
        <button
          onClick={() => onTabChange('explore')}
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 flex items-center gap-2 text-left"
        >
          <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white text-xs font-black shadow-sm">
            粤
          </span>
          <span>Guangdong Voyage</span>
        </button>

        {/* Zone 2: 4 clean single-line nav links (desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onTabChange('explore')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 ${
              activeTab === 'explore'
                ? 'text-rose-600 dark:text-rose-400 border-b-2 border-rose-600'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Explorer
          </button>
          <button
            onClick={() => onTabChange('itineraries')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 ${
              activeTab === 'itineraries'
                ? 'text-rose-600 dark:text-rose-400 border-b-2 border-rose-600'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Itinéraires
          </button>
          <button
            onClick={() => onTabChange('map')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 ${
              activeTab === 'map'
                ? 'text-rose-600 dark:text-rose-400 border-b-2 border-rose-600'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Carte Hors Ligne
          </button>
          <button
            onClick={() => onTabChange('saved')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'text-rose-600 dark:text-rose-400 border-b-2 border-rose-600'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Mon Séjour</span>
            {savedCount > 0 && (
              <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                {savedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          <PWAInstallButton />

          <button
            onClick={onOpenOfflineModal}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              isOffline
                ? 'bg-amber-500 text-white'
                : isPackDownloaded
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-rose-600 dark:hover:bg-rose-700'
            }`}
            title="Gérer les données hors ligne pour smartphone"
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hors Ligne</span>
              </>
            ) : isPackDownloaded ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Pack Prêt</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Pack Hors Ligne</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
