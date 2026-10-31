import { ReviewScore, Attraction } from '../types/travel';

export function getReviewSourceUrl(score: ReviewScore, attraction: Attraction): string {
  if (score.url && score.url.trim().length > 0) {
    return score.url;
  }

  const cleanCn = attraction.nameCn.replace(/\(.*?\)/g, '').trim();
  const cleanEn = attraction.nameEn.replace(/\(.*?\)/g, '').trim();
  const cityNameEn = attraction.cityId === 'guangzhou' ? 'Guangzhou' 
    : attraction.cityId === 'shenzhen' ? 'Shenzhen' 
    : attraction.cityId === 'shantou' ? 'Shantou' 
    : 'Chaozhou';

  switch (score.source) {
    case 'dianping':
      return `https://www.dianping.com/search/keyword/0/0_${encodeURIComponent(cleanCn)}`;
    case 'xiaohongshu':
      return `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(cleanCn)}`;
    case 'tripadvisor':
      return attraction.tripadvisorUrl || `https://www.tripadvisor.com/Search?q=${encodeURIComponent(cleanEn + ' ' + cityNameEn)}`;
    case 'google':
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanCn + ' ' + cleanEn)}`;
    case 'ctrip':
      return `https://you.ctrip.com/sightsearch/all?keyword=${encodeURIComponent(cleanCn)}`;
    default:
      return `https://www.google.com/search?q=${encodeURIComponent(cleanCn + ' ' + score.sourceName)}`;
  }
}

export function formatAnnualVisitors(num: number): string {
  if (!num || num <= 0) return 'Non communiqué';
  if (num >= 2_000_000) {
    const formatted = (num / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 });
    return `${formatted} millions`;
  }
  if (num >= 1_000_000) {
    const formatted = (num / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 });
    return `${formatted} million`;
  }
  return num.toLocaleString('fr-FR');
}
