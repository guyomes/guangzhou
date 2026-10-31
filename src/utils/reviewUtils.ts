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
      return `https://www.tripadvisor.com/Search?q=${encodeURIComponent(cleanEn + ' ' + cityNameEn)}`;
    case 'google':
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanCn + ' ' + cleanEn)}`;
    case 'ctrip':
      return `https://you.ctrip.com/sightsearch/all?keyword=${encodeURIComponent(cleanCn)}`;
    default:
      return `https://www.google.com/search?q=${encodeURIComponent(cleanCn + ' ' + score.sourceName)}`;
  }
}
