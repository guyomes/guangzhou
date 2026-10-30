import React, { useState, useEffect, useMemo } from 'react';
import { ALL_ATTRACTIONS, CITIES_CONFIG } from './data/citiesData';
import { CATEGORY_LABELS_FR } from './data/guangzhouData';
import { Attraction, AttractionCategory, CityId } from './types/travel';
import { getSavedSpots, saveSpotToggle, getOfflineStatus, OfflineStatus } from './utils/offlineStorage';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { AttractionCard } from './components/AttractionCard';
import { AttractionModal } from './components/AttractionModal';
import { TaxiCardModal } from './components/TaxiCardModal';
import { GuangzhouMap } from './components/GuangzhouMap';
import { ItineraryView } from './components/ItineraryView';
import { SavedTripView } from './components/SavedTripView';
import { OfflineManagerModal } from './components/OfflineManagerModal';
import { 
  Search, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Compass, 
  WifiOff, 
  Filter, 
  Layers, 
  Bookmark, 
  Navigation,
  Globe2,
  Landmark,
  UtensilsCrossed,
  Trees,
  Gem,
  Building2,
  Download,
  ShoppingBag,
  Utensils,
  Zap,
  Hotel
} from 'lucide-react';

export default function App() {
  const isOnline = useOnlineStatus();
  const [activeTab, setActiveTab] = useState<'explore' | 'itineraries' | 'map' | 'saved'>('explore');
  const [selectedCity, setSelectedCity] = useState<CityId | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterRatingType, setFilterRatingType] = useState<'all' | 'top_rated' | 'hidden_gems' | 'dianping_fav'>('all');
  
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [taxiCardAttraction, setTaxiCardAttraction] = useState<Attraction | null>(null);
  
  const [offlineStatus, setOfflineStatus] = useState<OfflineStatus>(getOfflineStatus());
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [mapItineraryStops, setMapItineraryStops] = useState<string[] | undefined>(undefined);
  const [focusedMapAttractionId, setFocusedMapAttractionId] = useState<string | null>(null);

  // Load saved spots from localStorage on mount
  useEffect(() => {
    setSavedIds(getSavedSpots());
    setOfflineStatus(getOfflineStatus());
  }, []);

  const handleToggleSave = (id: string) => {
    const updated = saveSpotToggle(id);
    setSavedIds(updated);
  };

  const handleViewOnMap = (stopIds: string[]) => {
    setMapItineraryStops(stopIds);
    if (stopIds.length > 0) {
      setFocusedMapAttractionId(stopIds[0]);
    }
    setActiveTab('map');
  };

  // Filter attractions
  const filteredAttractions = useMemo(() => {
    return ALL_ATTRACTIONS.filter((item) => {
      // City filter
      if (selectedCity !== 'all' && item.cityId !== selectedCity) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Rating / Spotlight filter
      if (filterRatingType === 'top_rated' && !item.isTopRated) {
        return false;
      }
      if (filterRatingType === 'hidden_gems' && !item.isHiddenGem) {
        return false;
      }
      if (filterRatingType === 'dianping_fav') {
        const dp = item.scores.find(s => s.source === 'dianping');
        if (!dp || dp.score < 4.8) return false;
      }

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesFr = item.nameFr.toLowerCase().includes(q);
        const matchesEn = item.nameEn.toLowerCase().includes(q);
        const matchesCn = item.nameCn.includes(q);
        const matchesPinyin = item.pinyin.toLowerCase().includes(q);
        const matchesDistrict = item.district.toLowerCase().includes(q);
        const matchesTags = item.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesFr && !matchesEn && !matchesCn && !matchesPinyin && !matchesDistrict && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCity, selectedCategory, filterRatingType, searchQuery]);

  const savedAttractions = useMemo(() => {
    return ALL_ATTRACTIONS.filter(a => savedIds.includes(a.id));
  }, [savedIds]);

  // Current City Banner Image & Title
  const currentBanner = useMemo(() => {
    if (selectedCity === 'shenzhen') {
      return {
        image: './assets/images/shenzhen_skyline_bay_1793293122053.jpg',
        title: 'Shenzhen · 深圳 : Silicon Valley & Baie Maritime',
        subtitle: 'Mégalopole futuriste, 4e plus haute tour au monde (Ping An 599m), parcs côtiers et galeries d’art industriel.',
        badge: 'Guangdong Tech & Design',
      };
    }
    if (selectedCity === 'shantou') {
      return {
        image: './assets/images/shantou_xiaogongyuan_street_1793293123621.jpg',
        title: 'Shantou · 汕头 : Capitale Mondiale du Bœuf Chaoshan',
        subtitle: 'Arcades républicaines de Xiaogongyuan, découpe de bœuf minute légendaire et plages sauvages de l’île de Nan’ao.',
        badge: 'Chaoshan Gastronomie',
      };
    }
    if (selectedCity === 'chaozhou') {
      return {
        image: './assets/images/chaozhou_guangji_bridge_1793293122927.jpg',
        title: 'Chaozhou · 潮州 : Cité Impériale & Pont Flottant Song',
        subtitle: 'Pont de Guangji sur 18 bateaux flottants, 22 portiques de granit sculpté et cérémonie du thé Gongfu UNESCO.',
        badge: 'Histoire & Thé Gongfu',
      };
    }
    return {
      image: './assets/images/canton_tower_night_1793290740500.jpg',
      title: 'Explorez le Guangdong : Guangzhou, Shenzhen, Shantou & Chaozhou',
      subtitle: 'Descriptions traduites en français, comparatif exclusif des avis chinois (Dianping 大众点评) et internationaux (Tripadvisor), et génération d’itinéraires sur-mesure.',
      badge: 'Guangdong · 粤 · Guide 100% en Français & Hors Ligne',
    };
  }, [selectedCity]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100 antialiased pb-16 md:pb-0">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'map') setMapItineraryStops(undefined);
        }}
        savedCount={savedIds.length}
        onOpenOfflineModal={() => setIsOfflineModalOpen(true)}
        isOffline={!isOnline}
        isPackDownloaded={offlineStatus.isDownloaded}
      />

      {/* Offline Alert Bar when network drops */}
      {!isOnline && (
        <aside 
          aria-label="Avertissement mode hors ligne"
          className="bg-amber-500 text-white px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
        >
          <WifiOff className="w-4 h-4" />
          <span>Mode Hors Ligne Actif — Consultation des données et cartes locales mise en cache.</span>
        </aside>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Tab 1: Explore */}
        {activeTab === 'explore' && (
          <div className="space-y-6">
            {/* City Selection Ribbon */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 shrink-0 mr-1">
                Ville :
              </span>
              {[
                { id: 'all', name: 'Toutes les Villes', cn: '广东全省' },
                { id: 'guangzhou', name: 'Guangzhou (Canton)', cn: '广州' },
                { id: 'shenzhen', name: 'Shenzhen', cn: '深圳' },
                { id: 'shantou', name: 'Shantou', cn: '汕头' },
                { id: 'chaozhou', name: 'Chaozhou', cn: '潮州' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCity(c.id as any)}
                  className={`min-h-[44px] py-2 px-4 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
                    selectedCity === c.id
                      ? 'bg-rose-600 text-white shadow-md scale-[1.02]'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="font-normal opacity-70">({c.cn})</span>
                </button>
              ))}
            </div>

            {/* Dynamic Hero Banner */}
            <section className="relative rounded-3xl overflow-hidden bg-slate-950 text-white shadow-xl min-h-[280px] sm:min-h-[360px] flex items-end p-6 sm:p-10 transition-all duration-500">
              <img
                src={currentBanner.image}
                alt={currentBanner.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold tracking-wider uppercase">
                  <span>{currentBanner.badge}</span>
                </div>
                
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white text-balance">
                  {currentBanner.title}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  {currentBanner.subtitle}
                </p>

                {/* Hero Quick KPI Strip */}
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Avis Dianping & Tripadvisor</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4 text-rose-400" />
                    <span>100% Traduit en Français</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-emerald-400" />
                    <span>Carte & Fiches Hors Ligne</span>
                  </span>
                </div>
              </div>
            </section>

            {/* Search and Interactive Filter Bar */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par nom, quartier (Liwan, Tianhe), pinyin..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Spotlight Filter Buttons */}
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-x-auto text-xs shrink-0">
                  <button
                    onClick={() => setFilterRatingType('all')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                      filterRatingType === 'all'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Tous les spots ({ALL_ATTRACTIONS.length})
                  </button>
                  <button
                    onClick={() => setFilterRatingType('top_rated')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                      filterRatingType === 'top_rated'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-rose-700 dark:text-rose-400 hover:bg-rose-50'
                    }`}
                  >
                    ★ Top Notés
                  </button>
                  <button
                    onClick={() => setFilterRatingType('hidden_gems')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                      filterRatingType === 'hidden_gems'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-purple-700 dark:text-purple-400 hover:bg-purple-50'
                    }`}
                  >
                    ✦ Pépites Cachées
                  </button>
                  <button
                    onClick={() => setFilterRatingType('dianping_fav')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                      filterRatingType === 'dianping_fav'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50'
                    }`}
                    title="Favoris de l'application chinoise Dianping (Score >= 4.8)"
                  >
                    点评 Favoris Locaux
                  </button>
                </div>
              </div>

              {/* Category Filter Horizontal Ribbon */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'Toutes les catégories', icon: Sparkles },
                  { id: 'heritage', label: 'Histoire & Lingnan', icon: Landmark },
                  { id: 'modern', label: 'Architecture & Vues', icon: Building2 },
                  { id: 'food', label: 'Dim Sum & Gastronomie', icon: UtensilsCrossed },
                  { id: 'restaurant', label: 'Grandes Tables & Festins', icon: Utensils },
                  { id: 'mall', label: 'Malls & Shopping', icon: ShoppingBag },
                  { id: 'event', label: 'Spectacles & Robot Box', icon: Zap },
                  { id: 'nature', label: 'Nature & Collines', icon: Trees },
                  { id: 'art_hidden', label: 'Ruelles d’Art & Pépites', icon: Gem },
                  { id: 'hotel', label: 'Hôtels & Hébergements', icon: Hotel },
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`min-h-[44px] py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap shrink-0 ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-rose-500" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Results Grid */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {filteredAttractions.length} lieux trouvés {selectedCity !== 'all' ? `à ${CITIES_CONFIG[selectedCity].nameFr}` : 'au Guangdong'}
                </span>
                <button
                  onClick={() => setActiveTab('map')}
                  className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Afficher sur la carte interactive</span>
                </button>
              </div>

              {filteredAttractions.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 text-sm">
                    Aucune attraction ne correspond à vos critères de recherche.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setFilterRatingType('all');
                      setSelectedCity('all');
                    }}
                    className="mt-3 text-xs font-bold text-rose-600 hover:underline"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAttractions.map((attraction) => (
                    <AttractionCard
                      key={attraction.id}
                      attraction={attraction}
                      onOpenDetails={(item) => setSelectedAttraction(item)}
                      onOpenTaxiCard={(item) => setTaxiCardAttraction(item)}
                      isSaved={savedIds.includes(attraction.id)}
                      onToggleSave={handleToggleSave}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Tab 2: Itineraries */}
        {activeTab === 'itineraries' && (
          <ItineraryView
            initialCityId={selectedCity !== 'all' ? selectedCity : 'guangzhou'}
            onSelectAttraction={(item) => setSelectedAttraction(item)}
            onOpenTaxiCard={(item) => setTaxiCardAttraction(item)}
            onViewOnMap={handleViewOnMap}
          />
        )}

        {/* Tab 3: Interactive Map */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Carte Interactive : Guangzhou, Shenzhen, Shantou & Chaozhou
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Navigation fluide entre les métropoles avec tuiles et fiches hors ligne.
                </p>
              </div>

              {mapItineraryStops && mapItineraryStops.length > 0 && (
                <button
                  onClick={() => setMapItineraryStops(undefined)}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Effacer tracé itinéraire ({mapItineraryStops.length} étapes)
                </button>
              )}
            </div>

            <GuangzhouMap
              attractions={ALL_ATTRACTIONS}
              selectedCityId={selectedCity}
              onSelectCity={setSelectedCity}
              selectedAttractionId={focusedMapAttractionId}
              onSelectAttraction={(item) => setSelectedAttraction(item)}
              onOpenTaxiCard={(item) => setTaxiCardAttraction(item)}
              itineraryStopIds={mapItineraryStops}
              isOffline={!isOnline}
            />
          </div>
        )}

        {/* Tab 4: Saved Spots */}
        {activeTab === 'saved' && (
          <SavedTripView
            savedAttractions={savedAttractions}
            onOpenDetails={(item) => setSelectedAttraction(item)}
            onOpenTaxiCard={(item) => setTaxiCardAttraction(item)}
            onToggleSave={handleToggleSave}
            onViewOnMap={handleViewOnMap}
            onGoExplore={() => setActiveTab('explore')}
          />
        )}
      </main>

      {/* Detail Modal */}
      <AttractionModal
        attraction={selectedAttraction}
        onClose={() => setSelectedAttraction(null)}
        onOpenTaxiCard={(item) => setTaxiCardAttraction(item)}
        isSaved={selectedAttraction ? savedIds.includes(selectedAttraction.id) : false}
        onToggleSave={handleToggleSave}
      />

      {/* Taxi Flashcard Modal */}
      <TaxiCardModal
        attraction={taxiCardAttraction}
        onClose={() => setTaxiCardAttraction(null)}
      />

      {/* Offline Pack Manager Modal */}
      <OfflineManagerModal
        status={offlineStatus}
        isOpen={isOfflineModalOpen}
        onClose={() => setIsOfflineModalOpen(false)}
        onStatusUpdated={() => setOfflineStatus(getOfflineStatus())}
      />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'map') setMapItineraryStops(undefined);
        }}
        savedCount={savedIds.length}
      />
    </div>
  );
}
