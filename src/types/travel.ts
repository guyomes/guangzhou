export type CityId = 'guangzhou' | 'shenzhen' | 'shantou' | 'chaozhou';

export interface CityInfo {
  id: CityId;
  nameFr: string;
  nameCn: string;
  pinyin: string;
  taglineFr: string;
  centerLat: number;
  centerLng: number;
  zoomLevel: number;
  image: string;
}

export type AttractionCategory = 
  | 'heritage'
  | 'modern'
  | 'food'
  | 'nature'
  | 'art_hidden'
  | 'mall'
  | 'restaurant'
  | 'event';

export interface ReviewScore {
  source: 'dianping' | 'tripadvisor' | 'google' | 'ctrip' | 'xiaohongshu';
  sourceName: string;
  sourceType: 'chinese' | 'western';
  score: number; // 0 to 5.0
  reviewCount: number;
  badge?: string; // e.g. "必吃榜" or "Choix des Voyageurs"
  highlightQuote: string;
}

export interface Attraction {
  id: string;
  cityId: CityId;
  nameFr: string;
  nameEn: string;
  nameCn: string;
  pinyin: string;
  cantonesePhonetic: string;
  category: AttractionCategory;
  district: string;
  lat: number;
  lng: number;
  metroInfoFr: string;
  metroInfoEn: string;
  addressCn: string;
  image: string;
  thumbnailAlt: string;
  descriptionFr: string;
  descriptionEn: string;
  culturalNoteFr: string;
  visitingTipsFr: string[];
  recommendedDuration: string; // e.g. "1h30 - 2h"
  estimatedCostRmb: number; // 0 for free
  bestTime: string; // e.g. "Coucher de soleil & Nuit"
  scores: ReviewScore[];
  isTopRated: boolean;
  isHiddenGem: boolean;
  tags: string[];
}

export interface ItineraryStop {
  attractionId: string;
  timeSlot: 'matin' | 'dejeuner' | 'apres-midi' | 'soiree';
  durationHours: number;
  activityFr: string;
  foodSuggestionFr?: string;
  transportAdviceFr: string;
}

export interface ItineraryDay {
  dayNumber: number;
  titleFr: string;
  themeFr: string;
  summaryFr: string;
  stops: ItineraryStop[];
}

export interface SuggestedItinerary {
  id: string;
  cityId: CityId | 'multi';
  durationDays: number;
  titleFr: string;
  subtitleFr: string;
  pace: 'relaxed' | 'balanced' | 'packed';
  focus: 'all' | 'food' | 'heritage' | 'modern' | 'hidden';
  days: ItineraryDay[];
}

export interface UserTripPlan {
  durationDays: number;
  selectedAttractionIds: string[];
  customDays: { [day: number]: string[] };
}
