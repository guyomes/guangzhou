import React from 'react';
import { Compass, Calendar, MapPin, Bookmark } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'explore' | 'itineraries' | 'map' | 'saved';
  onTabChange: (tab: 'explore' | 'itineraries' | 'map' | 'saved') => void;
  savedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  savedCount,
}) => {
  const tabs = [
    { id: 'explore', label: 'Explorer', icon: Compass },
    { id: 'itineraries', label: 'Itinéraires', icon: Calendar },
    { id: 'map', label: 'Carte', icon: MapPin },
    { id: 'saved', label: 'Mon Séjour', icon: Bookmark, badge: savedCount },
  ] as const;

  return (
    <nav 
      aria-label="Navigation principale mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-4 items-center h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center transition-colors relative ${
                isActive
                  ? 'text-rose-600 dark:text-rose-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {'badge' in tab && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
