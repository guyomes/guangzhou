import { SuggestedItinerary, ItineraryDay, ItineraryStop } from '../types/travel';

export function getPacedItinerary(
  baseItinerary: SuggestedItinerary,
  pace: 'relaxed' | 'balanced' | 'packed'
): SuggestedItinerary {
  const paceConfig = {
    relaxed: {
      tag: '[Détendu]',
      subtitleSuffix: ' · Rythme détendu (2-3 visites/j, pauses thé et flânerie sans précipitation)',
    },
    balanced: {
      tag: '[Équilibré]',
      subtitleSuffix: ' · Rythme équilibré (3-4 visites/j, harmonie entre grands sites et dégustations)',
    },
    packed: {
      tag: '[Intense]',
      subtitleSuffix: ' · Rythme intense (5+ visites/j, circuit optimisé de l’aube à la nuit)',
    },
  };

  const config = paceConfig[pace];

  const pacedDays: ItineraryDay[] = baseItinerary.days.map((day) => {
    const allStops = day.stops;
    let selectedStops: ItineraryStop[] = allStops;

    if (pace === 'relaxed') {
      // Pick 2 or 3 premier relaxed stops (morning highlight, lunch feast, afternoon or evening highlight)
      if (allStops.length >= 4) {
        const morning = allStops.find(s => s.timeSlot === 'matin') || allStops[0];
        const lunch = allStops.find(s => s.timeSlot === 'dejeuner') || allStops[1];
        const afternoon = allStops.find(s => s.timeSlot === 'apres-midi');
        const evening = allStops.find(s => s.timeSlot === 'soiree');
        const candidateThird = afternoon || evening || allStops[allStops.length - 1];

        const chosen: ItineraryStop[] = [morning];
        if (lunch && lunch.attractionId !== morning.attractionId) chosen.push(lunch);
        if (candidateThird && !chosen.some(s => s.attractionId === candidateThird.attractionId)) {
          chosen.push(candidateThird);
        }
        selectedStops = chosen.slice(0, 3);
      } else if (allStops.length === 3) {
        selectedStops = [allStops[0], allStops[1]];
      }

      selectedStops = selectedStops.map(s => ({
        ...s,
        durationHours: Math.min(Math.round((s.durationHours * 1.5) * 2) / 2, 3.5),
        transportAdviceFr: s.transportAdviceFr + ' Prenez votre temps, sans aucune hâte.'
      }));
    } else if (pace === 'balanced') {
      // 3 to 4 stops
      if (allStops.length > 4) {
        const morning = allStops.find(s => s.timeSlot === 'matin') || allStops[0];
        const lunch = allStops.find(s => s.timeSlot === 'dejeuner') || allStops[1];
        const afternoon = allStops.find(s => s.timeSlot === 'apres-midi') || allStops[2];
        const evening = allStops.find(s => s.timeSlot === 'soiree') || allStops[allStops.length - 1];
        
        const map = new Map<string, ItineraryStop>();
        [morning, lunch, afternoon, evening].forEach(s => {
          if (s) map.set(s.attractionId, s);
        });
        selectedStops = Array.from(map.values()).slice(0, 4);
      }
      selectedStops = selectedStops.map(s => ({
        ...s,
        durationHours: Math.max(1.5, Math.min(s.durationHours, 2.5)),
      }));
    } else if (pace === 'packed') {
      // Keep ALL 5+ stops
      selectedStops = allStops.map(s => ({
        ...s,
        durationHours: Math.max(1, Math.min(s.durationHours, 1.5)),
        transportAdviceFr: s.transportAdviceFr + ' Transfert direct pour enchaîner sans attendre.'
      }));
    }

    const summaries = {
      relaxed: `[Rythme Détendu · ${selectedStops.length} visites] ${day.summaryFr} Prenez le temps de vous imprégner de l'atmosphère, de savourer un thé et de flâner sans contrainte horaire.`,
      balanced: `[Rythme Équilibré · ${selectedStops.length} visites] ${day.summaryFr}`,
      packed: `[Rythme Intense · ${selectedStops.length} visites] ${day.summaryFr} Programme cadencé et optimisé du matin au soir pour une découverte exhaustive.`
    };

    return {
      ...day,
      themeFr: `${day.themeFr} (${pace === 'relaxed' ? 'Détendu' : pace === 'packed' ? 'Intense' : 'Équilibré'})`,
      summaryFr: summaries[pace],
      stops: selectedStops
    };
  });

  const rawTitle = baseItinerary.titleFr.replace(/^\[(Détendu|Équilibré|Intense)\]\s*/, '');
  const rawSubtitle = baseItinerary.subtitleFr.split(' · Rythme')[0];

  return {
    ...baseItinerary,
    id: `${baseItinerary.id}-${pace}`,
    pace,
    titleFr: `${config.tag} ${rawTitle}`,
    subtitleFr: `${rawSubtitle}${config.subtitleSuffix}`,
    days: pacedDays
  };
}

// -------------------------------------------------------------
// BASE ITINERARIES: 1, 2, 3, 4, and 5 DAYS FOR ALL 5 DESTINATIONS
// -------------------------------------------------------------
export const SUGGESTED_ITINERARIES: SuggestedItinerary[] = [
  // ==========================================
  // GUANGZHOU ITINERARIES (1 to 5 Days)
  // ==========================================
  {
    id: 'itinerary-gz-1-day',
    cityId: 'guangzhou',
    durationDays: 1,
    titleFr: 'Guangzhou Express : Les Incontournables en 24h',
    subtitleFr: 'De l’art Lingnan ancestral aux lumières futuristes de la Rivière des Perles',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : De l’Âme Ancestrale au Vertige Moderne',
        themeFr: 'Héritage, Saveurs et Panoramas Nocturnes',
        summaryFr: 'Un concentré d’émotions débutant par les dentelles de bois du temple Chen, poursuivi par la quiétude coloniale de Shamian et conclu au pied de la Tour de Canton illuminée.',
        stops: [
          {
            attractionId: 'chen-clan-ancestral-hall',
            timeSlot: 'matin',
            durationHours: 1.5,
            activityFr: 'Visite guidée des cours intérieures et contemplation des sculptures sur faîtière en céramique de Shiwan.',
            transportAdviceFr: 'Prenez le Métro Ligne 1 jusqu’à Chen Clan Academy (Sortie D). Arrivez dès l’ouverture à 09h00.'
          },
          {
            attractionId: 'cantonese-dimsum-yumcha',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Déjeuner traditionnel Yum Cha à Taotaoju ou Guangzhou Restaurant avec thé Pu-erh et paniers vapeur.',
            foodSuggestionFr: 'Har Gow aux crevettes, Siu Mai porc-crabe, petits pains Char Siu briochés.',
            transportAdviceFr: '15 min de marche vers Di Shifu Road ou 1 station de métro jusqu’à Changshou Lu.'
          },
          {
            attractionId: 'shamian-island',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Promenade sous les banyans centenaires et découverte des demeures coloniales victoriennes et françaises.',
            transportAdviceFr: '15 min à pied au sud de Shangxiajiu ou 1 station jusqu’à Huangsha (Sortie F).'
          },
          {
            attractionId: 'canton-tower',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Ascension vers les ponts d’observation ou balade sur l’esplanade Haixinsha face à la tour scintillante.',
            foodSuggestionFr: 'Dîner cantonnais avec oie rôtie croustillante le long de la promenade Zhujiang.',
            transportAdviceFr: 'Prenez la Ligne 1 puis la Ligne 3 jusqu’à Canton Tower Station.'
          },
          {
            attractionId: 'pearl-river-cruise',
            timeSlot: 'soiree',
            durationHours: 1.5,
            activityFr: 'Embarquement à Dashatou ou Haixinsha pour une croisière nocturne sur la Rivière des Perles.',
            transportAdviceFr: '5 min de marche jusqu’à l’embarcadère au pied de la tour.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-gz-2-days',
    cityId: 'guangzhou',
    durationDays: 2,
    titleFr: 'Guangzhou Classique : 48h entre Deux Mondes',
    subtitleFr: 'La symbiose parfaite entre le vieux Xiguan et la métropole du XXIe siècle',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : L’Ancien Canton et les Saveurs Historiques',
        themeFr: 'Architecture Lingnan, Île de Shamian & Croisière Fluviale',
        summaryFr: 'Explorez le cœur historique des marchands cantonais et embarquez le soir pour une féérie aquatique.',
        stops: [
          {
            attractionId: 'chen-clan-ancestral-hall',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Émerveillement devant le chef-d’œuvre des artisans sculpteurs du clan Chen.',
            transportAdviceFr: 'Métro Ligne 1, Station Chen Clan Academy.'
          },
          {
            attractionId: 'cantonese-dimsum-yumcha',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Grand banquet Dim Sum à Panxi Restaurant au bord du lac Liwan.',
            foodSuggestionFr: 'Gâteaux de châtaigne d’eau, crêpes de riz Changfen soyeuses aux crevettes.',
            transportAdviceFr: '10 min en taxi ou bus le long de Longjin Road.'
          },
          {
            attractionId: 'shamian-island',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Flânerie sous les arbres séculaires, visite de l’église Notre-Dame des Victoires.',
            transportAdviceFr: 'À quelques minutes au sud de Liwan.'
          },
          {
            attractionId: 'pearl-river-cruise',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Embarquement à Tianzi Pier pour une croisière magique sous les ponts illuminés.',
            foodSuggestionFr: 'Dégustez un bouillon de fruits de mer frais au bord du quai avant le départ.',
            transportAdviceFr: 'Métro Ligne 6 jusqu’à Haizhu Square ou 10 min de taxi.'
          },
          {
            attractionId: 'haijun-hotel-guangzhou',
            timeSlot: 'soiree',
            durationHours: 1,
            activityFr: 'Promenade nocturne sur les berges illuminées de Yanjiang Road devant l’Hôtel Haijun.',
            transportAdviceFr: 'À deux pas de Tianzi Pier.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Collines Sacrées et Skyline Futuriste',
        themeFr: 'Parc Yuexiu, Trésors Nationaux & Cité Nouvelle de Zhujiang',
        summaryFr: 'Rendez hommage à la légende des Cinq Béliers puis plongez dans l’audace architecturale de Zhujiang New Town.',
        stops: [
          {
            attractionId: 'yuexiu-park',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Marche matinale jusqu’à la sculpture des Cinq Béliers et visite de la tour Ming Zhenhai.',
            transportAdviceFr: 'Métro Ligne 2, Station Yuexiu Park (Sortie B1).'
          },
          {
            attractionId: 'sacred-heart-cathedral',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Découverte de la cathédrale de granit et déjeuner dans les ruelles animées de Yide Road.',
            foodSuggestionFr: 'Riz en cocotte de terre cuite (Baozai Fan) à la saucisse cantonaise et canard laqué.',
            transportAdviceFr: 'Métro Ligne 2 jusqu’à Haizhu Square.'
          },
          {
            attractionId: 'guangdong-museum',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Immersion dans la "Boîte à Merveilles" : porcelaines de Canton et Route de la Soie Maritime.',
            transportAdviceFr: 'Métro Ligne 3/5 jusqu’à Zhujiang New Town ou Zhujiang East Road.'
          },
          {
            attractionId: 'guangzhou-opera-house',
            timeSlot: 'apres-midi',
            durationHours: 1.5,
            activityFr: 'Contemplation des courbes fluides de l’Opéra conçu par Zaha Hadid face au bassin miroir.',
            transportAdviceFr: '5 min de marche à pied sur la place centrale de Zhujiang.'
          },
          {
            attractionId: 'canton-tower',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Coucher de soleil depuis les ponts panoramiques et spectacle LED nocturne.',
            transportAdviceFr: 'Navette APM traversant la rivière en souterrain jusqu’à Canton Tower.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-gz-3-days',
    cityId: 'guangzhou',
    durationDays: 3,
    titleFr: 'Guangzhou Vivante : 3 Jours de Culture, Saveurs & Pépites',
    subtitleFr: 'La traversée complète des quartiers secrets d’artistes et des grandes traditions',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Vieux Xiguan, Traditions & Île Coloniale',
        themeFr: 'Temple Chen, Dim Sum Ancestral & Shamian',
        summaryFr: 'Commencez par la magnificence sculpturale du Temple Chen, le rituel du thé Yum Cha et la nonchalance européenne de Shamian.',
        stops: [
          {
            attractionId: 'chen-clan-ancestral-hall',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Exploration des 19 pavillons d’artisanat d’art traditionnel.',
            transportAdviceFr: 'Métro Ligne 1, arrêt Chen Clan Academy.'
          },
          {
            attractionId: 'cantonese-dimsum-yumcha',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Déjeuner Yum Cha traditionnel avec chariot à vapeur et thés grands crus.',
            foodSuggestionFr: 'Raviolis transparents Har Gow, beignets de taro frits, thé Ti Kuan Yin.',
            transportAdviceFr: '10 min à pied vers Shangxiajiu Pedestrian Street.'
          },
          {
            attractionId: 'shamian-island',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Pause café sous les vérandas victoriennes et photos sous les banians.',
            transportAdviceFr: 'Promenade à pied vers le sud.'
          },
          {
            attractionId: 'pearl-river-cruise',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Croisière féérique avec buffet ou thé de nuit sur la Rivière des Perles.',
            transportAdviceFr: 'Embarquement Quai Dashatou.'
          },
          {
            attractionId: 'haijun-hotel-guangzhou',
            timeSlot: 'soiree',
            durationHours: 1,
            activityFr: 'Balade nocturne le long de Yanjiang Road devant l’Hôtel Haijun.',
            transportAdviceFr: 'À 5 minutes à pied de Tianzi Pier.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Quartiers Créatifs, Art Déco & Opéra Fluvial',
        themeFr: 'Pantang, Yongqing Fang & Dongshankou',
        summaryFr: 'Plongez dans le renouveau artistique cantonnais : villages d’eau restaurés, musée de l’Opéra et villas coloniales en brique rouge.',
        stops: [
          {
            attractionId: 'pantang-ancient-village',
            timeSlot: 'matin',
            durationHours: 1.5,
            activityFr: 'Balade matinale au bord de la baie des Litchis et découverte des maisons d’eau.',
            transportAdviceFr: 'Métro Ligne 5, Station Zhongshanba.'
          },
          {
            attractionId: 'yong-qing-fang',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Visite de la demeure de Bruce Lee et du Musée de l’Opéra Cantonais sur l’eau.',
            transportAdviceFr: '10 min à pied le long du canal Liwan.'
          },
          {
            attractionId: 'cantonese-dimsum-yumcha',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Déjeuner bistronomique cantonnais : canard rôti croustillant et nouilles Wonton.',
            transportAdviceFr: 'Restaurants de spécialités à Yongqing Fang.'
          },
          {
            attractionId: 'dongshankou',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Flânerie bohème au milieu des villas républicaines en brique rouge, galeries d’art et concept stores branchés.',
            transportAdviceFr: 'Métro Ligne 1/6 jusqu’à Dongshankou (Sortie F).'
          },
          {
            attractionId: 'guangzhou-opera-house',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Contemplation nocturne des deux galets futuristes de Zaha Hadid illuminés sur la rivière des Perles.',
            transportAdviceFr: 'Métro Ligne 1 puis Ligne 3 vers Zhujiang New Town.'
          }
        ]
      },
      {
        dayNumber: 3,
        titleFr: 'Jour 3 : Collines Légendaires & Vertige Moderne',
        themeFr: 'Parc Yuexiu, Cathédrale de Granit & Tour de Canton',
        summaryFr: 'Clôturez par le symbole des Cinq Béliers, la majesté néogothique du Sacré-Cœur et le sommet étincelant de la Tour de Canton.',
        stops: [
          {
            attractionId: 'yuexiu-park',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Pèlerinage aux Cinq Béliers de pierre et vue panoramique depuis la colline.',
            transportAdviceFr: 'Métro Ligne 2, Station Yuexiu Park.'
          },
          {
            attractionId: 'sacred-heart-cathedral',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Visite de la cathédrale entièrement bâtie en blocs de granit taillés à la main, puis déjeuner de rue.',
            foodSuggestionFr: 'Riz en cocotte Baozai Fan et soupe de wontons aux crevettes entières.',
            transportAdviceFr: 'Métro Ligne 2 vers Haizhu Square.'
          },
          {
            attractionId: 'guangdong-museum',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Trésors de porcelaine céladon, soieries impériales et fossiles du Guangdong.',
            transportAdviceFr: 'Métro Ligne 3/5 vers Zhujiang New Town.'
          },
          {
            attractionId: 'taikoo-hui',
            timeSlot: 'apres-midi',
            durationHours: 1.5,
            activityFr: 'Immersion dans le temple du luxe et de l’architecture moderne à Tianhe CBD.',
            transportAdviceFr: 'Métro Ligne 3 vers Shipaiqiao.'
          },
          {
            attractionId: 'canton-tower',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Montée au belvédère 450m, Bubble Tram sur les toits du monde et vue sur toute la mégalopole.',
            transportAdviceFr: 'Métro Ligne 3, Canton Tower Station.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-gz-4-days',
    cityId: 'guangzhou',
    durationDays: 4,
    titleFr: 'Guangzhou Grandeur : 4 Jours Montagne, Ciel & Arts',
    subtitleFr: 'Des sommets de Baiyun aux chefs-d’œuvre du Lingnan et à la skyline futuriste',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Origines Historiques & Île de Shamian',
        themeFr: 'Temple Chen, Dim Sum Impérial & Balade Coloniale',
        summaryFr: 'Entrez dans Canton par son temple le plus raffiné et les allées ombragées de Shamian.',
        stops: [
          {
            attractionId: 'chen-clan-ancestral-hall',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Visite des 19 cours traditionnelles et boiseries dorées.',
            transportAdviceFr: 'Métro Ligne 1, Chen Clan Academy.'
          },
          {
            attractionId: 'cantonese-dimsum-yumcha',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Banquet Dim Sum chez Panxi au bord du lac.',
            foodSuggestionFr: 'Har Gow, Siu Mai et brioches Baozi.',
            transportAdviceFr: '10 min en taxi.'
          },
          {
            attractionId: 'shamian-island',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Découverte des façades coloniales et des galeries d’art.',
            transportAdviceFr: 'Métro Ligne 1/6 vers Huangsha.'
          },
          {
            attractionId: 'pearl-river-cruise',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Croisière nocturne sous les ponts illuminés de la Rivière des Perles.',
            transportAdviceFr: 'Embarcadère Tianzi Pier.'
          },
          {
            attractionId: 'haijun-hotel-guangzhou',
            timeSlot: 'soiree',
            durationHours: 1,
            activityFr: 'Soirée au bord de l’eau devant l’Hôtel Haijun sur Yanjiang Road.',
            transportAdviceFr: 'À 5 minutes à pied de l’embarcadère.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Collines Sacrées & Skyline de Zhujiang',
        themeFr: 'Parc Yuexiu, Musée du Guangdong & Tour de Canton',
        summaryFr: 'Rendez hommage aux Cinq Béliers et contemplez la skyline ultramoderne.',
        stops: [
          {
            attractionId: 'yuexiu-park',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Marche dans le parc Yuexiu et sculpture des Cinq Béliers.',
            transportAdviceFr: 'Métro Ligne 2, Yuexiu Park.'
          },
          {
            attractionId: 'sacred-heart-cathedral',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Cathédrale de granit et déjeuner de rue dans le quartier Yide.',
            foodSuggestionFr: 'Riz croustillant en cocotte Baozai Fan.',
            transportAdviceFr: 'Métro Ligne 2 vers Haizhu Square.'
          },
          {
            attractionId: 'guangdong-museum',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Visite de la Boîte à Merveilles du Guangdong.',
            transportAdviceFr: 'Métro Ligne 3/5 vers Zhujiang New Town.'
          },
          {
            attractionId: 'guangzhou-opera-house',
            timeSlot: 'apres-midi',
            durationHours: 1.5,
            activityFr: 'Architecture avant-gardiste de Zaha Hadid.',
            transportAdviceFr: '5 min de marche.'
          },
          {
            attractionId: 'canton-tower',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Coucher de soleil au sommet de la Tour de Canton et Bubble Tram.',
            transportAdviceFr: 'Navette APM vers Canton Tower.'
          }
        ]
      },
      {
        dayNumber: 3,
        titleFr: 'Jour 3 : Quartiers d’Artistes, Opéra & Briques Rouges',
        themeFr: 'Pantang, Yongqing Fang & Dongshankou',
        summaryFr: 'Canaux anciens, musée de l’Opéra Cantonais et atmosphère bohème des villas républicaines.',
        stops: [
          {
            attractionId: 'pantang-ancient-village',
            timeSlot: 'matin',
            durationHours: 1.5,
            activityFr: 'Promenade dans les ruelles du village millénaire de Pantang.',
            transportAdviceFr: 'Métro Ligne 5, Zhongshanba.'
          },
          {
            attractionId: 'yong-qing-fang',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Demeure de Bruce Lee et musée de l’Opéra sur l’eau.',
            transportAdviceFr: '10 min à pied.'
          },
          {
            attractionId: 'cantonese-dimsum-yumcha',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Déjeuner dans une maison de thé historique de Xiguan.',
            foodSuggestionFr: 'Pains briochés Char Siu et crêpes de riz à la vapeur.',
            transportAdviceFr: 'Ruelles de Yongqing Fang.'
          },
          {
            attractionId: 'dongshankou',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Exploration des villas en briques rouges des années 1920 et galeries.',
            transportAdviceFr: 'Métro Ligne 1/6 vers Dongshankou.'
          },
          {
            attractionId: 'taikoo-hui',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Dîner gastronomique et promenade dans le centre commercial de luxe Taikoo Hui.',
            transportAdviceFr: 'Métro Ligne 3 vers Shipaiqiao.'
          }
        ]
      },
      {
        dayNumber: 4,
        titleFr: 'Jour 4 : Sérénité Naturelle & Ciel de Baiyun',
        themeFr: 'Montagne Baiyun, Téléphérique & Jardins Zen',
        summaryFr: 'Prenez de la hauteur sur le poumon vert de Canton avec téléphérique et panoramas à couper le souffle.',
        stops: [
          {
            attractionId: 'baiyun-mountain',
            timeSlot: 'matin',
            durationHours: 3.5,
            activityFr: 'Ascension en téléphérique jusqu’à Moxing Ridge et panorama vertigineux sur toute la ville.',
            foodSuggestionFr: 'Dégustation du célèbre tofu artisanal aux fleurs de montagne (Shanshui Douhua).',
            transportAdviceFr: 'Bus direct ou taxi vers la porte sud de Baiyun Mountain.'
          },
          {
            attractionId: 'cantonese-dimsum-yumcha',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Déjeuner au restaurant de montagne Mingchun avec soupe mijotée cantonaise.',
            transportAdviceFr: 'Sur le plateau sommital de Baiyun.'
          },
          {
            attractionId: 'yuexiu-park',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Descente vers les pavillons ombragés et jardins botaniques.',
            transportAdviceFr: 'Bus urbain ou taxi (15 min).'
          },
          {
            attractionId: 'canton-tower',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Dernière soirée contemplative face au spectacle de lumières de la tour depuis Haixinsha.',
            transportAdviceFr: 'Métro Ligne 3 vers Zhujiang New Town.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-gz-5-days',
    cityId: 'guangzhou',
    durationDays: 5,
    titleFr: 'Guangzhou Immersion Totale : 5 Jours de Splendeur Lingnan',
    subtitleFr: 'La découverte exhaustive : temples, monts sacrés, pépites fluviales et jardins impériaux',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Cœur Ancien & Île de Shamian',
        themeFr: 'Temple Chen, Dim Sum Ancestral & Shamian',
        summaryFr: 'Le grand classique du vieux Canton, entre artisanat d’exception et romantisme colonial.',
        stops: [
          {
            attractionId: 'chen-clan-ancestral-hall',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Visite des 19 salles et chefs-d’œuvre de sculpture sur bois.',
            transportAdviceFr: 'Métro Ligne 1, Chen Clan Academy.'
          },
          {
            attractionId: 'cantonese-dimsum-yumcha',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Déjeuner Yum Cha traditionnel avec thé Pu-erh millésimé.',
            transportAdviceFr: '10 min à pied vers Shangxiajiu.'
          },
          {
            attractionId: 'shamian-island',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Découverte des demeures coloniales victoriennes et françaises.',
            transportAdviceFr: 'Métro Ligne 1/6 vers Huangsha.'
          },
          {
            attractionId: 'pearl-river-cruise',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Croisière nocturne sur la Rivière des Perles.',
            transportAdviceFr: 'Embarcadère Tianzi Pier.'
          },
          {
            attractionId: 'haijun-hotel-guangzhou',
            timeSlot: 'soiree',
            durationHours: 1,
            activityFr: 'Vue sur le fleuve depuis la promenade de l’Hôtel Haijun.',
            transportAdviceFr: 'À 5 minutes à pied.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Collines Sacrées & Skyline Moderne',
        themeFr: 'Parc Yuexiu, Musée du Guangdong & Tour de Canton',
        summaryFr: 'De la statue des Cinq Béliers au Bubble Tram au sommet de la Tour de Canton.',
        stops: [
          {
            attractionId: 'yuexiu-park',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Sculpture des Cinq Béliers et remparts Ming.',
            transportAdviceFr: 'Métro Ligne 2, Yuexiu Park.'
          },
          {
            attractionId: 'sacred-heart-cathedral',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Cathédrale de granit et riz en cocotte Baozai Fan.',
            transportAdviceFr: 'Métro Ligne 2 vers Haizhu Square.'
          },
          {
            attractionId: 'guangdong-museum',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Porcelaines et trésors maritimes.',
            transportAdviceFr: 'Métro Ligne 3/5 vers Zhujiang New Town.'
          },
          {
            attractionId: 'guangzhou-opera-house',
            timeSlot: 'apres-midi',
            durationHours: 1.5,
            activityFr: 'Opéra de Zaha Hadid.',
            transportAdviceFr: '5 min de marche.'
          },
          {
            attractionId: 'canton-tower',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Ascension au belvédère 450m et grand spectacle de lumières.',
            transportAdviceFr: 'Navette APM.'
          }
        ]
      },
      {
        dayNumber: 3,
        titleFr: 'Jour 3 : Quartiers Créatifs & Villas Rétro',
        themeFr: 'Pantang, Yongqing Fang & Dongshankou',
        summaryFr: 'La scène bohème de Canton, musées d’opéra et boutiques d’artisans.',
        stops: [
          {
            attractionId: 'pantang-ancient-village',
            timeSlot: 'matin',
            durationHours: 1.5,
            activityFr: 'Matinée le long du lac Liwan et village ancien de Pantang.',
            transportAdviceFr: 'Métro Ligne 5, Zhongshanba.'
          },
          {
            attractionId: 'yong-qing-fang',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Demeure de Bruce Lee et scène aquatique d’opéra.',
            transportAdviceFr: '10 min à pied.'
          },
          {
            attractionId: 'cantonese-dimsum-yumcha',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Déjeuner dans une auberge de Xiguan.',
            transportAdviceFr: 'Sur place à Yongqing Fang.'
          },
          {
            attractionId: 'dongshankou',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Villas coloniales en brique rouge et concept stores.',
            transportAdviceFr: 'Métro Ligne 1/6 vers Dongshankou.'
          },
          {
            attractionId: 'taikoo-hui',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Shopping moderne et dîner gastronomique à Tianhe.',
            transportAdviceFr: 'Métro Ligne 3.'
          }
        ]
      },
      {
        dayNumber: 4,
        titleFr: 'Jour 4 : Ciel & Forêts de la Montagne Baiyun',
        themeFr: 'Poumon Vert, Téléphérique & Panoramas',
        summaryFr: 'Une parenthèse oxygénante au-dessus de la ville avec le téléphérique de Baiyun.',
        stops: [
          {
            attractionId: 'baiyun-mountain',
            timeSlot: 'matin',
            durationHours: 3.5,
            activityFr: 'Téléphérique panoramique jusqu’au sommet Moxing Ridge.',
            transportAdviceFr: 'Porte Sud de Baiyun Mountain.'
          },
          {
            attractionId: 'cantonese-dimsum-yumcha',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Déjeuner de spécialités de montagne et thé biologique.',
            transportAdviceFr: 'Sur place.'
          },
          {
            attractionId: 'yuexiu-park',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Promenade dans les serres botaniques et allées fleuries.',
            transportAdviceFr: 'Bus direct vers Yuexiu.'
          },
          {
            attractionId: 'haijun-hotel-guangzhou',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Dîner cantonnais avec vue sur le fleuve près de l’Hôtel Haijun.',
            transportAdviceFr: 'Métro Ligne 2 vers Haizhu Square.'
          }
        ]
      },
      {
        dayNumber: 5,
        titleFr: 'Jour 5 : Palais Impérial Baomo & Village Xiaozhou',
        themeFr: 'Jardin Baomo à Panyu & Maisons en Coquilles d’Huîtres',
        summaryFr: 'Les 100 000 carpes koï du jardin impérial Baomo et le village bucolique d’artistes de Xiaozhou.',
        stops: [
          {
            attractionId: 'baomo-garden',
            timeSlot: 'matin',
            durationHours: 3,
            activityFr: 'Exploration du jardin classique de Baomo à Panyu, étangs de carpes koï géantes et ponts de marbre blanc.',
            transportAdviceFr: 'Métro Ligne 3 jusqu’à Shiqiao puis bus touristique direct ou taxi (30 min).'
          },
          {
            attractionId: 'cantonese-dimsum-yumcha',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Déjeuner traditionnel de Panyu : desserts au lait de bufflonne de Shawan et oie rôtie.',
            transportAdviceFr: 'Auberges traditionnelles aux abords du jardin Baomo.'
          },
          {
            attractionId: 'xiaozhou-village',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Flânerie dans le village d’artistes de Xiaozhou, canaux séculaires et maisons en coquilles d’huîtres (Haoqiao).',
            transportAdviceFr: 'Taxi vers Xiaozhou Village sur l’île de Haizhu.'
          },
          {
            attractionId: 'guangzhou-opera-house',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Ultime soirée de gala devant l’Opéra de Guangzhou illuminé sur la Rivière des Perles.',
            transportAdviceFr: 'Métro Ligne 3 vers Zhujiang New Town.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // SHENZHEN ITINERARIES (1 to 5 Days)
  // ==========================================
  {
    id: 'itinerary-sz-1-day',
    cityId: 'shenzhen',
    durationDays: 1,
    titleFr: 'Shenzhen Silicon Valley : Le Vertige Futuriste en 24h',
    subtitleFr: 'Gratte-ciel record, village d’art contemporain et gastronomie au bouillon de coco',
    pace: 'balanced',
    focus: 'modern',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Sommets Urbains & Art Contemporain',
        themeFr: 'Ping An 541m, Poulet Coco & Canopée Technologique',
        summaryFr: 'Prenez la mesure de la Silicon Valley chinoise depuis la deuxième plus haute tour du monde, régalez-vous d’un poulet mijoté à l’eau de coco et vibrez sous les lumières de Huaqiangbei.',
        stops: [
          {
            attractionId: 'ping-an-finance-centre',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Ascension en ascenseur ultra-rapide vers le Sky Deck Free Sky à 541 mètres au-dessus du CBD de Futian.',
            transportAdviceFr: 'Métro Ligne 1 ou 3, Station Shopping Park (Sortie D).'
          },
          {
            attractionId: 'runyuan-coconut-chicken',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Déjeuner dans le temple du poulet à l’eau de coco Runyuan Sijia : eau de trois noix de coco fraîches et trempette au calamansi.',
            foodSuggestionFr: 'Jeune poulet fermier de Wenchang, lamelles de chair de coco fraîche, riz en cocotte à la saucisse cantonaise.',
            transportAdviceFr: 'Situé dans le centre commercial adjacent Coco Park (5 min à pied).'
          },
          {
            attractionId: 'oct-loft-shenzhen',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Flânerie sous les banians d’OCT-LOFT, galeries d’art contemporain, librairie Old Heaven Books et concept stores de design.',
            transportAdviceFr: 'Métro Ligne 1 jusqu’à Qiaocheng East (Sortie A).'
          },
          {
            attractionId: 'shenzhen-tech-canopy',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Promenade nocturne sous la verrière technologique LED de Huaqiangbei : ciel illuminé futuriste et gadgets high-tech.',
            transportAdviceFr: 'Métro Ligne 2 ou 7 vers Huaqiang North.'
          },
          {
            attractionId: 'shenzhen-robot-arena',
            timeSlot: 'soiree',
            durationHours: 1.5,
            activityFr: 'Combats spectaculaires de robots gladiateurs dans l’arène Robot Box.',
            transportAdviceFr: 'Court trajet en métro vers Nanshan / Futian.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-sz-2-days',
    cityId: 'shenzhen',
    durationDays: 2,
    titleFr: 'Shenzhen Tech & Horizon Marin : 48h Électrisantes',
    subtitleFr: 'Des sommets financiers de Futian aux plages d’art et de design de Nanshan',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Cœur Financier & Galeries d’Avant-Garde',
        themeFr: 'Tour Ping An, Poulet Coco & Village Créatif OCT-LOFT',
        summaryFr: 'Prenez de la hauteur à Futian avant de vous perdre dans l’oasis créative d’OCT-LOFT.',
        stops: [
          {
            attractionId: 'ping-an-finance-centre',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Visite panoramique Free Sky à 541 mètres et plancher de verre suspendu.',
            transportAdviceFr: 'Métro Ligne 1/3, Shopping Park.'
          },
          {
            attractionId: 'runyuan-coconut-chicken',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Poulet à l’eau de coco pure à Coco Park.',
            foodSuggestionFr: 'Poulet fermier Wenchang et riz Baozai Fan.',
            transportAdviceFr: '5 min à pied.'
          },
          {
            attractionId: 'oct-loft-shenzhen',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Galeries d’art contemporain et terrasses ombragées d’OCT-LOFT.',
            transportAdviceFr: 'Métro Ligne 1 vers Qiaocheng East.'
          },
          {
            attractionId: 'shenzhen-tech-canopy',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Soirée cyberpunk sous la voûte technologique lumineuse de Huaqiangbei.',
            transportAdviceFr: 'Métro Ligne 2/7 vers Huaqiang North.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Mégalopole Créative & Horizon Côtier',
        themeFr: 'MixC World, Combats de Robots & Baie de Shenzhen',
        summaryFr: 'Shopping d’architecture à MixC World, tournoi de robots gladiateurs et coucher de soleil sur la baie.',
        stops: [
          {
            attractionId: 'shenzhen-mixc-world',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Photos sous l’éléphant géant Bubble de Florentijn Hofman et boutiques avant-gardistes.',
            transportAdviceFr: 'Métro Ligne 1, Hi-Tech Park Station.'
          },
          {
            attractionId: 'runyuan-coconut-chicken',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Déjeuner dans le quartier branché de Nanshan.',
            transportAdviceFr: 'Sur place à MixC World.'
          },
          {
            attractionId: 'shenzhen-robot-arena',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Sensations fortes devant les duels de robots blindés de 110 kg dans l’arène Robot Box.',
            transportAdviceFr: 'Taxi direct ou métro Nanshan.'
          },
          {
            attractionId: 'shenzhen-bay-park',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Balade côtière au coucher du soleil au Talent Park, face à la tour Spring Cocoon illuminée.',
            transportAdviceFr: 'Métro Ligne 9 ou 11 vers Shenzhen Bay Park.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-sz-3-days',
    cityId: 'shenzhen',
    durationDays: 3,
    titleFr: 'Shenzhen Métropole & Bastion Maritime : 72h Complètes',
    subtitleFr: 'Entre forteresse militaire des Ming, haute technologie et littoral de la mer de Chine',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Vertige de Futian & Oasis d’OCT-LOFT',
        themeFr: 'Ping An, Coco Park & Art Contemporain',
        summaryFr: 'Plongez dans le contraste saisissant entre gratte-ciel mondiaux et friches industrielles réinventées.',
        stops: [
          {
            attractionId: 'ping-an-finance-centre',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Sky Deck Free Sky 541m.',
            transportAdviceFr: 'Métro Ligne 1/3, Shopping Park.'
          },
          {
            attractionId: 'runyuan-coconut-chicken',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Poulet fermier à l’eau de coco pure à Coco Park.',
            transportAdviceFr: 'Adjacent à la tour.'
          },
          {
            attractionId: 'oct-loft-shenzhen',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Boutiques de design et cafés spécialisés sous la canopée arborée.',
            transportAdviceFr: 'Métro Ligne 1 vers Qiaocheng East.'
          },
          {
            attractionId: 'shenzhen-bay-park',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Spectacle de lumières nocturnes sur la baie de Shenzhen.',
            transportAdviceFr: 'Métro Ligne 9.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Bastion Ming & Littoral Sauvage de Dapeng',
        themeFr: 'Forteresse de Dapeng & Plages de l’Est',
        summaryFr: 'Remontez le temps jusqu’en 1394 à l’intérieur de la citadelle navale préservée de Dapeng.',
        stops: [
          {
            attractionId: 'dapeng-ancient-fortress',
            timeSlot: 'matin',
            durationHours: 3.5,
            activityFr: 'Exploration des ruelles pavées de granit, des portes fortifiées et des demeures d’amiraux de la dynastie Qing.',
            foodSuggestionFr: 'Fruits de mer sauvages fraîchement débarqués : seiches sautées et coquilles Saint-Jacques à l’ail.',
            transportAdviceFr: 'Bus express touristique E11 ou taxi/Didi direct depuis le centre de Shenzhen (environ 1h).'
          },
          {
            attractionId: 'runyuan-coconut-chicken',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Retour en ville et pause gourmande décontractée.',
            transportAdviceFr: 'Retour vers Nanshan.'
          },
          {
            attractionId: 'shenzhen-tech-canopy',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Balade nocturne sous le ciel technologique de Huaqiangbei.',
            transportAdviceFr: 'Métro Ligne 2/7.'
          }
        ]
      },
      {
        dayNumber: 3,
        titleFr: 'Jour 3 : Silicon Valley Hardware & Cyber-Arène',
        themeFr: 'Huaqiangbei, MixC World & Combats de Robots',
        summaryFr: 'Vibrez devant les combats de robots dans l’arène Robot Box puis explorez les marchés électroniques de Huaqiangbei.',
        stops: [
          {
            attractionId: 'shenzhen-mixc-world',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Architecture commerciale moderne et concept stores de créateurs.',
            transportAdviceFr: 'Métro Ligne 1, Hi-Tech Park.'
          },
          {
            attractionId: 'runyuan-coconut-chicken',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Déjeuner dans le pôle gastronomique de MixC World.',
            transportAdviceFr: 'Sur place.'
          },
          {
            attractionId: 'shenzhen-robot-arena',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Pilotage de robots de duel et combats réels dans la cage d’acier.',
            transportAdviceFr: '15 min de métro.'
          },
          {
            attractionId: 'shenzhen-tech-canopy',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Marche nocturne spectaculaire sous la monumentale verrière technologique LED de Huaqiangbei.',
            transportAdviceFr: 'Métro Ligne 2 ou 7, Huaqiang North.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-sz-4-days',
    cityId: 'shenzhen',
    durationDays: 4,
    titleFr: 'Shenzhen Grand Angle : 4 Jours Cyber, Art & Forteresse',
    subtitleFr: 'La symbiose absolue de l’histoire maritime Ming et de l’hyper-futurisme',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Vertige de Futian & Ciel Panoramique',
        themeFr: 'Ping An, Coco Park & Soirée Skyline',
        summaryFr: 'Immersion au cœur battant de la métropole financière.',
        stops: [
          {
            attractionId: 'ping-an-finance-centre',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Pont d’observation Free Sky à 541 mètres.',
            transportAdviceFr: 'Métro Ligne 1/3, Shopping Park.'
          },
          {
            attractionId: 'runyuan-coconut-chicken',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Poulet fermier à l’eau de coco à Coco Park.',
            transportAdviceFr: 'À 5 minutes.'
          },
          {
            attractionId: 'oct-loft-shenzhen',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Galeries d’art contemporain et concept stores.',
            transportAdviceFr: 'Métro Ligne 1 vers Qiaocheng East.'
          },
          {
            attractionId: 'shenzhen-bay-park',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Coucher de soleil sur la baie et spectacle nocturne.',
            transportAdviceFr: 'Métro Ligne 9.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Forteresse de Dapeng & Côte Sauvage',
        themeFr: 'Histoire Maritime Ming & Péninsule Orientale',
        summaryFr: 'Citadelle de 1394 et sentiers côtiers de la mer de Chine.',
        stops: [
          {
            attractionId: 'dapeng-ancient-fortress',
            timeSlot: 'matin',
            durationHours: 3.5,
            activityFr: 'Portes fortifiées et manoirs militaires séculaires.',
            foodSuggestionFr: 'Poissons et coquillages grillés au feu de bois.',
            transportAdviceFr: 'Bus express E11 ou taxi vers Dapeng.'
          },
          {
            attractionId: 'runyuan-coconut-chicken',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Retour en ville et repas réconfortant.',
            transportAdviceFr: 'Retour Nanshan.'
          },
          {
            attractionId: 'shenzhen-tech-canopy',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Toit LED lumineux de Huaqiangbei.',
            transportAdviceFr: 'Métro Ligne 2/7.'
          }
        ]
      },
      {
        dayNumber: 3,
        titleFr: 'Jour 3 : Design Avant-Garde & Combats Robotiques',
        themeFr: 'MixC World, Robot Box & Arène Futuriste',
        summaryFr: 'Sculptures géantes, shopping de prestige et duel de machines.',
        stops: [
          {
            attractionId: 'shenzhen-mixc-world',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Éléphant Bubble et ruelles commerçantes piétonnes.',
            transportAdviceFr: 'Métro Ligne 1, Hi-Tech Park.'
          },
          {
            attractionId: 'runyuan-coconut-chicken',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Déjeuner dans les restaurants de Nanshan.',
            transportAdviceFr: 'Sur place.'
          },
          {
            attractionId: 'shenzhen-robot-arena',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Combats de méchas dans l’arène Robot Box.',
            transportAdviceFr: 'Métro Nanshan.'
          },
          {
            attractionId: 'ping-an-finance-centre',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Soirée cocktail et panorama nocturne sur Futian.',
            transportAdviceFr: 'Métro vers Shopping Park.'
          }
        ]
      },
      {
        dayNumber: 4,
        titleFr: 'Jour 4 : Capitale Mondiale de l’Électronique',
        themeFr: 'Huaqiangbei & Parcs Technologiques de la Baie',
        summaryFr: 'Plongez dans les marchés de composants, drones et réalité virtuelle.',
        stops: [
          {
            attractionId: 'shenzhen-tech-canopy',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Exploration des marchés géants de semi-conducteurs et d’innovations.',
            transportAdviceFr: 'Métro Ligne 2, Huaqiang North.'
          },
          {
            attractionId: 'runyuan-coconut-chicken',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Pause gourmande rafraîchissante.',
            transportAdviceFr: 'Coco Park Futian.'
          },
          {
            attractionId: 'oct-loft-shenzhen',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Dernière halte culturelle dans les librairies et ateliers d’OCT-LOFT.',
            transportAdviceFr: 'Métro Ligne 1.'
          },
          {
            attractionId: 'shenzhen-bay-park',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Clôture au Talent Park devant le spectacle laser de la baie.',
            transportAdviceFr: 'Métro Ligne 11.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-sz-5-days',
    cityId: 'shenzhen',
    durationDays: 5,
    titleFr: 'Shenzhen Ultime : 5 Jours Cyberpunk, Mer & Nature',
    subtitleFr: 'Le grand tour complet de la Silicon Valley d’Asie',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Vertige de Futian & Horizon Céleste',
        themeFr: 'Ping An, Coco Park & Baie de Shenzhen',
        summaryFr: 'L’ascension de la tour la plus haute du Sud et la quiétude de la baie.',
        stops: [
          {
            attractionId: 'ping-an-finance-centre',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Observatoire Free Sky à 541 mètres.',
            transportAdviceFr: 'Métro Ligne 1/3, Shopping Park.'
          },
          {
            attractionId: 'runyuan-coconut-chicken',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Déjeuner au poulet de coco de Hainan.',
            transportAdviceFr: 'À 5 minutes.'
          },
          {
            attractionId: 'shenzhen-bay-park',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Promenade le long de la mer face aux collines de Hong Kong.',
            transportAdviceFr: 'Métro Ligne 9/11.'
          },
          {
            attractionId: 'shenzhen-tech-canopy',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Ciel LED de Huaqiangbei illuminé.',
            transportAdviceFr: 'Métro Ligne 2/7.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Quartier Bohème & Design d’OCT-LOFT',
        themeFr: 'OCT-LOFT, MixC World & Café de Spécialité',
        summaryFr: 'Friches d’anciennes usines de téléviseurs converties en galeries d’art et librairies d’exception.',
        stops: [
          {
            attractionId: 'oct-loft-shenzhen',
            timeSlot: 'matin',
            durationHours: 3,
            activityFr: 'Marché d’artisans T-Street, ateliers de poterie et galeries d’art contemporain.',
            transportAdviceFr: 'Métro Ligne 1 vers Qiaocheng East.'
          },
          {
            attractionId: 'runyuan-coconut-chicken',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Déjeuner dans le quartier créatif.',
            transportAdviceFr: 'À deux pas.'
          },
          {
            attractionId: 'shenzhen-mixc-world',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Shopping d’architecture et galeries éphémères.',
            transportAdviceFr: 'Métro Ligne 1 vers Hi-Tech Park.'
          },
          {
            attractionId: 'shenzhen-robot-arena',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Combats nocturnes de robots de combat.',
            transportAdviceFr: 'Nanshan District.'
          }
        ]
      },
      {
        dayNumber: 3,
        titleFr: 'Jour 3 : Bastion Maritime Ming de Dapeng',
        themeFr: 'Forteresse de 1394 & Plages Sauvages',
        summaryFr: 'Échappée historique vers les remparts navals de la dynastie Ming.',
        stops: [
          {
            attractionId: 'dapeng-ancient-fortress',
            timeSlot: 'matin',
            durationHours: 4,
            activityFr: 'Exploration de la citadelle maritime, temple Tianhou et remparts de pierre.',
            foodSuggestionFr: 'Huîtres et crabes sauvages grillés de la péninsule de Dapeng.',
            transportAdviceFr: 'Bus direct E11 ou taxi vers Dapeng.'
          },
          {
            attractionId: 'runyuan-coconut-chicken',
            timeSlot: 'apres-midi',
            durationHours: 1.5,
            activityFr: 'Retour en ville pour un goûter et bouillon de coco.',
            transportAdviceFr: 'Retour Nanshan.'
          },
          {
            attractionId: 'shenzhen-bay-park',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Soirée paisible au bord de l’océan au Talent Park.',
            transportAdviceFr: 'Métro Ligne 11.'
          }
        ]
      },
      {
        dayNumber: 4,
        titleFr: 'Jour 4 : Capitale Mondiale du Hardware',
        themeFr: 'Huaqiangbei, Laboratoires Makers & Cyber-Arène',
        summaryFr: 'Plongée dans la Mecque mondiale de l’innovation électronique.',
        stops: [
          {
            attractionId: 'shenzhen-tech-canopy',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Visite des centres de pièces électroniques et réalité augmentée de Huaqiangbei.',
            transportAdviceFr: 'Métro Ligne 2/7.'
          },
          {
            attractionId: 'runyuan-coconut-chicken',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Déjeuner convivial à Coco Park.',
            transportAdviceFr: 'Court trajet en métro.'
          },
          {
            attractionId: 'shenzhen-robot-arena',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Atelier de pilotage et duel dans la cage blindée Robot Box.',
            transportAdviceFr: 'Métro Ligne 1.'
          },
          {
            attractionId: 'ping-an-finance-centre',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Coucher de soleil doré sur les gratte-ciel de Futian.',
            transportAdviceFr: 'Shopping Park.'
          }
        ]
      },
      {
        dayNumber: 5,
        titleFr: 'Jour 5 : Grand Panorama Éco-Urbain & Adieux',
        themeFr: 'Parc des Talents, MixC & Clôture Cyber',
        summaryFr: 'Une dernière journée d’exception combinant nature côtière et architecture audacieuse.',
        stops: [
          {
            attractionId: 'shenzhen-bay-park',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Promenade matinale à vélo le long de la côte de Shenzhen Bay.',
            transportAdviceFr: 'Métro Ligne 9/11.'
          },
          {
            attractionId: 'shenzhen-mixc-world',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Déjeuner dans l’un des meilleurs bistrots design de MixC World.',
            transportAdviceFr: 'Métro Ligne 1.'
          },
          {
            attractionId: 'oct-loft-shenzhen',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Derniers achats d’œuvres d’art et de design local.',
            transportAdviceFr: 'Métro Ligne 1 vers Qiaocheng East.'
          },
          {
            attractionId: 'shenzhen-tech-canopy',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Clôture grandiose sous la verrière LED féerique de Huaqiangbei.',
            transportAdviceFr: 'Métro Ligne 2/7 vers Huaqiang North.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // SHANTOU ITINERARIES (1 to 5 Days)
  // ==========================================
  {
    id: 'itinerary-st-1-day',
    cityId: 'shantou',
    durationDays: 1,
    titleFr: 'Shantou Gourmande : Le Grand Festin en 24h',
    subtitleFr: 'La Mecque du bœuf tranché minute et l’élégance républicaine du Petit Parc',
    pace: 'balanced',
    focus: 'food',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Arcades Qilou & Légende de la Fondue',
        themeFr: 'Histoire Maritime, Concessions & Saveurs Célestes',
        summaryFr: 'Arpentez le réseau d’arcades de Xiaogongyuan et offrez-vous l’incontournable fondue de bœuf découpé minute chez Baheli.',
        stops: [
          {
            attractionId: 'shantou-xiaogongyuan',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Balade architecturale sous les façades baroques du pavillon Sun Yat-sen et découverte des anciennes boutiques de thé.',
            transportAdviceFr: 'Bus 2, 5, 14 ou taxi direct (15 min de la gare de Shantou).'
          },
          {
            attractionId: 'shantou-beef-hotpot',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Cérémonie de la fondue de bœuf frais chez Baheli Haiji avec découpe chirurgicale à table et sauce Shacha.',
            foodSuggestionFr: 'Morceaux choisis : Diaolong (filet marbré), Chibing (fondant) et boulettes de bœuf sautillantes pétries à la main.',
            transportAdviceFr: '10 min en taxi vers Huanggang Road.'
          },
          {
            attractionId: 'shantou-mixc',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Pause climatisée, immersion dans le décor rétro de Nanyang Street et thés Phoenix Dancong rafraîchissants.',
            transportAdviceFr: '10 min en taxi vers Jinsha East Road.'
          },
          {
            attractionId: 'shantou-fuyuan-seafood',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Banquet Michelin chez Fuyuan Da Pai Dang : étalage de crabes crus marinés, poissons du jour et porridge de minuit.',
            foodSuggestionFr: 'Crabe bleu mariné aux œufs orangés (Shengchao Xie) et bouillie de riz chaude Baimizhou.',
            transportAdviceFr: '10 min en taxi dans le quartier Chaoyang Zhuang.'
          },
          {
            attractionId: 'shantou-xiaogongyuan',
            timeSlot: 'soiree',
            durationHours: 1.5,
            activityFr: 'Flânerie sous les lampions rouges illuminés, dégustation de crêpes de riz vapeur Changfen aux huîtres.',
            transportAdviceFr: 'Retour au centre historique en soirée.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-st-2-days',
    cityId: 'shantou',
    durationDays: 2,
    titleFr: 'Shantou & Île de Nan’ao : Mer & Gastronomie en 48h',
    subtitleFr: 'Des ruelles coloniales aux plages sauvages du Tropique du Cancer',
    pace: 'relaxed',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Cœur Républicain & Saveurs de Chaoshan',
        themeFr: 'Xiaogongyuan & Fondue de Bœuf Inoubliable',
        summaryFr: 'Architecture républicaine, musée des lettres d’outre-mer et banquet de bœuf.',
        stops: [
          {
            attractionId: 'shantou-xiaogongyuan',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Exploration du quartier historique et des magasins coloniaux.',
            transportAdviceFr: 'Centre-ville de Shantou.'
          },
          {
            attractionId: 'shantou-beef-hotpot',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Grand festin de bœuf découpé minute chez Baheli Haiji avec bouillon clair et sauce Shacha.',
            transportAdviceFr: 'Baheli Haiji Huanggang Road.'
          },
          {
            attractionId: 'shantou-mixc',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Shopping moderne, patinoire olympique et immersion dans le décor rétro de Nanyang Street.',
            foodSuggestionFr: 'Thé Dancong glacé et douceurs de Nanyang.',
            transportAdviceFr: '10 min en taxi vers Jinsha East Road.'
          },
          {
            attractionId: 'shantou-fuyuan-seafood',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Banquet nocturne Michelin à Fuyuan Da Pai Dang : comptoir géant de crabes marinés, poissons du jour et porridge de minuit.',
            foodSuggestionFr: 'Crabe cru mariné aux œufs (Shengchao Xie), palourdes sautées au basilic et bouillie Baimizhou.',
            transportAdviceFr: 'À 5 minutes en taxi dans le quartier Chaoyang Zhuang.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Échappée Marine à Nan’ao & Grand Manoir de Chen Cihong',
        themeFr: 'Pont Maritime de 11 km, Plages & Première Demeure Lingnan',
        summaryFr: 'Traversez le gigantesque pont marin vers les plages turquoise de Nan’ao le matin, puis explorez dans l’après-midi les 506 pièces et galeries coloniales de l’Ancienne Résidence de Chen Cihong à Chenghai.',
        stops: [
          {
            attractionId: 'nanao-island-shantou',
            timeSlot: 'matin',
            durationHours: 3.5,
            activityFr: 'Traversée du grand pont maritime, plage de Qing’ao Bay et monument du Tropique du Cancer.',
            foodSuggestionFr: 'Ormeaux sauvages grillés à l’ail et huîtres géantes de Nan’ao cuites sur la plage.',
            transportAdviceFr: 'Bus touristique direct 105 ou taxi le matin.'
          },
          {
            attractionId: 'shantou-beef-hotpot',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Déjeuner de spécialités de bœuf marbré et canard laqué sur le retour.',
            transportAdviceFr: 'Trajet retour vers Chenghai.'
          },
          {
            attractionId: 'shantou-chen-cihong-residence',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Visite guidée des 506 salles de la "Première Demeure Lingnan", admiration des faïences italiennes centenaires et des galeries à arcades occidentales.',
            foodSuggestionFr: 'Dégustation d’oie braisée aux cinq épices de Chenghai (Lion Head Goose) dans le village historique de Qianmei.',
            transportAdviceFr: '35 min de route depuis la tête du pont de Nan’ao vers Qianmei Village à Chenghai.'
          },
          {
            attractionId: 'shantou-fuyuan-seafood',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Ultime souper de poissons vapeur et crabes marinés au retour en ville.',
            transportAdviceFr: 'Taxi vers Chaoyang Zhuang.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-st-3-days',
    cityId: 'shantou',
    durationDays: 3,
    titleFr: 'Shantou Patrimoine & Côte Bleue : 3 Jours Teochew',
    subtitleFr: 'La trilogie parfaite : saveurs mythiques, domaine de Chen Cihong et beauté insulaire',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Cité Républicaine & Légende de la Fondue',
        themeFr: 'Xiaogongyuan, Bœuf Baheli & Soirée Fuyuan',
        summaryFr: 'Plongez dans le vieux port franc de Shantou et ses trésors culinaires.',
        stops: [
          {
            attractionId: 'shantou-xiaogongyuan',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Architecture radiale Qilou et Pavillon commémoratif Sun Yat-sen.',
            transportAdviceFr: 'Centre historique de Shantou.'
          },
          {
            attractionId: 'shantou-beef-hotpot',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Fondue de bœuf découpé minute chez Baheli Haiji.',
            transportAdviceFr: 'Taxi vers Huanggang Road.'
          },
          {
            attractionId: 'shantou-mixc',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Ambiance Nanyang Street et thé Phoenix Dancong rafraîchissant.',
            transportAdviceFr: '10 min en taxi.'
          },
          {
            attractionId: 'shantou-fuyuan-seafood',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Banquet Michelin à Fuyuan : crabes bleus marinés et étalage de poissons.',
            transportAdviceFr: 'Taxi vers Chaoyang Zhuang.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Première Demeure Lingnan & Manoir Chenghai',
        themeFr: 'Chen Cihong Guju & Festin d’Oie Lion Head',
        summaryFr: 'Explorez le palais monumental de Chen Cihong, chef-d’œuvre métissant Orient et Occident.',
        stops: [
          {
            attractionId: 'shantou-chen-cihong-residence',
            timeSlot: 'matin',
            durationHours: 3,
            activityFr: 'Découverte des 506 salles, des cours en "Quatre chevaux tirant un chariot" et des carreaux italiens de 1910.',
            foodSuggestionFr: 'Oie braisée de Chenghai au village de Qianmei.',
            transportAdviceFr: 'Taxi ou bus 103/209 vers Qianmei Village (40 min).'
          },
          {
            attractionId: 'shantou-beef-hotpot',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Déjeuner traditionnel de bœuf marbré et boulettes artisanales.',
            transportAdviceFr: 'Chenghai / Shantou.'
          },
          {
            attractionId: 'shantou-mixc',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Détente moderne et shopping d’artisanat de Chaoshan.',
            transportAdviceFr: 'Retour vers Shantou CBD.'
          },
          {
            attractionId: 'shantou-fuyuan-seafood',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Souper nocturne avec poissons étuvés Yufan et bouillie Baimizhou.',
            transportAdviceFr: 'Taxi.'
          }
        ]
      },
      {
        dayNumber: 3,
        titleFr: 'Jour 3 : Échappée Insulaire à Nan’ao',
        themeFr: 'Pont Maritime de 11km, Plages & Phares',
        summaryFr: 'Passez le pont sur l’océan vers les plages de sable fin du Tropique du Cancer.',
        stops: [
          {
            attractionId: 'nanao-island-shantou',
            timeSlot: 'matin',
            durationHours: 4,
            activityFr: 'Traversée du pont de Nan’ao, plage de Qing’ao Bay et phare marin de Sanyaowan.',
            foodSuggestionFr: 'Huîtres géantes et ormeaux sauvages grillés les pieds dans le sable.',
            transportAdviceFr: 'Bus touristique direct 105 ou taxi à la journée.'
          },
          {
            attractionId: 'shantou-fuyuan-seafood',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Festin marin au retour de l’île.',
            transportAdviceFr: 'Retour sur le continent.'
          },
          {
            attractionId: 'shantou-xiaogongyuan',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Dernière marche sous les lampions rouges de Xiaogongyuan et crêpes vapeur Changfen.',
            transportAdviceFr: 'Centre historique.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-st-4-days',
    cityId: 'shantou',
    durationDays: 4,
    titleFr: 'Shantou Profondeur : 4 Jours Festin & Mémoire Maritime',
    subtitleFr: 'La découverte complète de la capitale mondiale du bœuf et des perles de l’océan',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Cœur Républicain & Festin Baheli',
        themeFr: 'Xiaogongyuan & Fondue Légendaire',
        summaryFr: 'Les arcades Qilou de Xiaogongyuan et la découpe chirurgicale du bœuf chez Baheli.',
        stops: [
          {
            attractionId: 'shantou-xiaogongyuan',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Visite du centre historique et musée postal Qiaopi.',
            transportAdviceFr: 'Centre de Shantou.'
          },
          {
            attractionId: 'shantou-beef-hotpot',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Fondue de bœuf découpé minute chez Baheli Haiji.',
            transportAdviceFr: 'Taxi direct.'
          },
          {
            attractionId: 'shantou-mixc',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Détente à Nanyang Street à MixC Shantou.',
            transportAdviceFr: '10 min de taxi.'
          },
          {
            attractionId: 'shantou-fuyuan-seafood',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Souper Michelin Fuyuan Da Pai Dang.',
            transportAdviceFr: 'Taxi.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Manoir de Chen Cihong & Oie de Chenghai',
        themeFr: 'Première Demeure Lingnan & Qianmei',
        summaryFr: 'Les 506 salles impériales du "Roi du riz au Siam" et les galeries coloniales.',
        stops: [
          {
            attractionId: 'shantou-chen-cihong-residence',
            timeSlot: 'matin',
            durationHours: 3,
            activityFr: 'Visite approfondie des complexes Langzhong Di et Shanju Shi.',
            transportAdviceFr: 'Bus 103 ou taxi vers Chenghai.'
          },
          {
            attractionId: 'shantou-beef-hotpot',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Déjeuner bœuf et oie braisée aux cinq épices.',
            transportAdviceFr: 'Chenghai.'
          },
          {
            attractionId: 'shantou-mixc',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Pause thé glacé Dancong et patinoire olympique.',
            transportAdviceFr: 'Retour à Shantou.'
          },
          {
            attractionId: 'shantou-fuyuan-seafood',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Crabes crus marinés et poissons vapeur Yufan.',
            transportAdviceFr: 'Chaoyang Zhuang.'
          }
        ]
      },
      {
        dayNumber: 3,
        titleFr: 'Jour 3 : Île de Nan’ao & Tropique du Cancer',
        themeFr: 'Pont Maritime de 11km & Qing’ao Bay',
        summaryFr: 'Falaises granitiques, parcs d’éoliennes et sable doré.',
        stops: [
          {
            attractionId: 'nanao-island-shantou',
            timeSlot: 'matin',
            durationHours: 4,
            activityFr: 'Tour de l’île en scooter ou taxi : phare de Sanyaowan et baie de Qing’ao.',
            foodSuggestionFr: 'Fruits de mer frais grillés sur la plage.',
            transportAdviceFr: 'Pont de Nan’ao.'
          },
          {
            attractionId: 'shantou-fuyuan-seafood',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Grand déjeuner de crustacés au retour sur la terre ferme.',
            transportAdviceFr: 'Retour continent.'
          },
          {
            attractionId: 'shantou-xiaogongyuan',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Soirée illuminée dans les venelles du Petit Parc.',
            transportAdviceFr: 'Centre historique.'
          }
        ]
      },
      {
        dayNumber: 4,
        titleFr: 'Jour 4 : Immersion Gourmande & Douceurs Nocturnes',
        themeFr: 'Marchés Teochew, Thé & Saveurs Côtières',
        summaryFr: 'Une journée dédiée aux dégustations d’artisans et à la douceur de vivre maritime.',
        stops: [
          {
            attractionId: 'shantou-xiaogongyuan',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Matinée gourmande : dégustation de crêpes de riz Changfen aux huîtres et jus de cédrat.',
            transportAdviceFr: 'Venelles de Xiaogongyuan.'
          },
          {
            attractionId: 'shantou-beef-hotpot',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Ultime session de découpes anatomiques de bœuf chez Baheli.',
            transportAdviceFr: 'Huanggang Road.'
          },
          {
            attractionId: 'shantou-chen-cihong-residence',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Séance photo dans les galeries ombragées du manoir Chen Cihong.',
            transportAdviceFr: 'Taxi vers Chenghai.'
          },
          {
            attractionId: 'shantou-fuyuan-seafood',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Grand banquet de clôture à Fuyuan Da Pai Dang.',
            transportAdviceFr: 'Chaoyang Zhuang.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-st-5-days',
    cityId: 'shantou',
    durationDays: 5,
    titleFr: 'Shantou l’Odyssée Gourmande : 5 Jours en Terre Teochew',
    subtitleFr: 'La découverte absolue : gastronomie d’exception, îles marines et manoirs impériaux',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Cité Républicaine & Légende de la Fondue',
        themeFr: 'Xiaogongyuan & Bœuf Baheli',
        summaryFr: 'Le Petit Parc, les arcades Qilou et la fondue de bœuf ultra-fraîche.',
        stops: [
          {
            attractionId: 'shantou-xiaogongyuan',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Visite architecturale de Xiaogongyuan.',
            transportAdviceFr: 'Centre de Shantou.'
          },
          {
            attractionId: 'shantou-beef-hotpot',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Fondue chez Baheli Haiji.',
            transportAdviceFr: 'Huanggang Road.'
          },
          {
            attractionId: 'shantou-mixc',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Nanyang Street et thés de Chaoshan.',
            transportAdviceFr: 'Taxi.'
          },
          {
            attractionId: 'shantou-fuyuan-seafood',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Crabes crus marinés chez Fuyuan.',
            transportAdviceFr: 'Chaoyang Zhuang.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Première Demeure Lingnan Chen Cihong',
        themeFr: 'Manoir de 506 pièces & Oie de Chenghai',
        summaryFr: 'Le domaine monumental du Roi du riz au Siam à Chenghai.',
        stops: [
          {
            attractionId: 'shantou-chen-cihong-residence',
            timeSlot: 'matin',
            durationHours: 3,
            activityFr: 'Cours intérieures, faïences italiennes et sculptures sur bois.',
            transportAdviceFr: 'Qianmei Village.'
          },
          {
            attractionId: 'shantou-beef-hotpot',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Déjeuner de spécialités bœuf et oie braisée.',
            transportAdviceFr: 'Chenghai.'
          },
          {
            attractionId: 'shantou-mixc',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Shopping et salons de thé Dancong.',
            transportAdviceFr: 'Retour Shantou.'
          },
          {
            attractionId: 'shantou-fuyuan-seafood',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Poissons vapeur Yufan et bouillie de minuit.',
            transportAdviceFr: 'Taxi.'
          }
        ]
      },
      {
        dayNumber: 3,
        titleFr: 'Jour 3 : Échappée Côtière à l’Île de Nan’ao',
        themeFr: 'Pont Maritime de 11km & Tropique du Cancer',
        summaryFr: 'Eaux turquoise, parcs à huîtres et phares sur les récifs.',
        stops: [
          {
            attractionId: 'nanao-island-shantou',
            timeSlot: 'matin',
            durationHours: 4,
            activityFr: 'Traversée du grand pont et plage de Qing’ao Bay.',
            foodSuggestionFr: 'Fruits de mer frais grillés au village insulaire.',
            transportAdviceFr: 'Pont de Nan’ao.'
          },
          {
            attractionId: 'shantou-fuyuan-seafood',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Grand buffet de poissons frais au retour.',
            transportAdviceFr: 'Retour continent.'
          },
          {
            attractionId: 'shantou-xiaogongyuan',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Soirée illuminée dans les venelles du Petit Parc.',
            transportAdviceFr: 'Centre historique.'
          }
        ]
      },
      {
        dayNumber: 4,
        titleFr: 'Jour 4 : Immersion Marchande & Mémoire Maritime',
        themeFr: 'Diaspora Teochew & Trésors Gastronomiques',
        summaryFr: 'L’héritage de la diaspora Teochew et la gastronomie de rue.',
        stops: [
          {
            attractionId: 'shantou-xiaogongyuan',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Visite des échoppes de médecine traditionnelle et maisons de thé.',
            transportAdviceFr: 'Venelles de Xiaogongyuan.'
          },
          {
            attractionId: 'shantou-beef-hotpot',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Découpes anatomiques rares chez Baheli.',
            transportAdviceFr: 'Huanggang Road.'
          },
          {
            attractionId: 'shantou-chen-cihong-residence',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Détente dans les jardins du manoir Chen Cihong.',
            transportAdviceFr: 'Chenghai.'
          },
          {
            attractionId: 'shantou-fuyuan-seafood',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Crabes bleus et crevettes crues marinées.',
            transportAdviceFr: 'Chaoyang Zhuang.'
          }
        ]
      },
      {
        dayNumber: 5,
        titleFr: 'Jour 5 : Grand Festin d’Adieu au Chaoshan',
        themeFr: 'Saveurs Célestes & Souvenirs d’Océan',
        summaryFr: 'Une dernière journée pour savourer le meilleur de Shantou.',
        stops: [
          {
            attractionId: 'shantou-xiaogongyuan',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Dernière dégustation de Changfen aux huîtres et gâteaux Teochew.',
            transportAdviceFr: 'Xiaogongyuan.'
          },
          {
            attractionId: 'shantou-beef-hotpot',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Ultime fondue de bœuf avec boulettes artisanales sautillantes.',
            transportAdviceFr: 'Baheli.'
          },
          {
            attractionId: 'shantou-mixc',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Achat de thés Dancong et douceurs de Nanyang.',
            transportAdviceFr: 'MixC Shantou.'
          },
          {
            attractionId: 'shantou-fuyuan-seafood',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Banquet de gala d’adieu chez Fuyuan Da Pai Dang.',
            transportAdviceFr: 'Chaoyang Zhuang.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // CHAOZHOU ITINERARIES (1 to 5 Days)
  // ==========================================
  {
    id: 'itinerary-cz-1-day',
    cityId: 'chaozhou',
    durationDays: 1,
    titleFr: 'Chaozhou Millénaire : Pont Flottant & Thé Gongfu en 24h',
    subtitleFr: 'La quintessence de la civilisation Teochew et des traditions impériales',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Sanctuaires Tang, 22 Portiques & Pont Flottant',
        themeFr: 'Temple Kaiyuan, Oie Braisée & Cérémonie du Pont',
        summaryFr: 'Vivez le rituel d’une cité préservée depuis la dynastie des Song : temple Tang sous les arbres Bodhi, portiques de pierre, grand banquet d’oie et manœuvre des 18 bateaux flottants de Guangji.',
        stops: [
          {
            attractionId: 'chaozhou-kaiyuan-temple',
            timeSlot: 'matin',
            durationHours: 1.5,
            activityFr: 'Recueillement sous les arbres Bodhi séculaires du grand monastère Tang fondé en 738.',
            transportAdviceFr: 'Au cœur de la vieille ville piétonne, accessible à pied depuis la rue Paifang.'
          },
          {
            attractionId: 'chaozhou-paifang-street',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Marche sous les 22 arches impériales de pierre sculptée et visite des échoppes de céramique.',
            transportAdviceFr: 'Sortie directe par la ruelle du temple Kaiyuan.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Festin d’oie à tête de lion mijotée dans son bouillon maître aux cinq épices avec foie gras soyeux.',
            foodSuggestionFr: 'Foie d’oie fondant, peau croustillante, trempette au vinaigre d’ail blanc de Chaoshan.',
            transportAdviceFr: 'Restaurants réputés le long de Paifang Street (Xiwu ou Wenguang).'
          },
          {
            attractionId: 'chaozhou-gongfu-tea',
            timeSlot: 'apres-midi',
            durationHours: 1.5,
            activityFr: 'Cérémonie du thé Gongfu Cha avec dégustation de Dancong du Mont Phénix dans un pavillon en bois.',
            transportAdviceFr: 'Maison de thé traditionnelle dans une cour de Paifang Street.'
          },
          {
            attractionId: 'chaozhou-guangji-bridge',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Manœuvre de déconnexion des 18 bateaux en bois à 17h30 au son des cors, puis spectacle son et lumière.',
            transportAdviceFr: 'Sortie par la porte est Guangji Men donnant directement sur le fleuve Han.'
          },
          {
            attractionId: 'chaozhou-live-opera',
            timeSlot: 'soiree',
            durationHours: 1.5,
            activityFr: 'Représentation nocturne d’opéra Chaoju en plein air au bord du fleuve.',
            transportAdviceFr: 'Théâtre au bord du fleuve Han.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-cz-2-days',
    cityId: 'chaozhou',
    durationDays: 2,
    titleFr: 'Chaozhou Immersion Céleste : 48h entre Fleuve & Arts',
    subtitleFr: 'La symbiose des maîtres sculpteurs, du thé Gongfu et du pont Song',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Cité Médiévale & Magie du Pont Flottant',
        themeFr: 'Temple Kaiyuan, Portiques & Bateaux de Guangji',
        summaryFr: 'Ressentez l’esprit de la dynastie Song en arpentant les pavillons sur piles de pierre du pont Guangji.',
        stops: [
          {
            attractionId: 'chaozhou-kaiyuan-temple',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Sanctuaire bouddhiste Tang et cours de méditation.',
            transportAdviceFr: 'Centre historique de Chaozhou.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Grand banquet d’oie braisée Lion Head Goose.',
            transportAdviceFr: 'Paifang Street.'
          },
          {
            attractionId: 'chaozhou-paifang-street',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Découverte des 22 portiques et artisans de broderie sur soie.',
            transportAdviceFr: 'À pied.'
          },
          {
            attractionId: 'chaozhou-guangji-bridge',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Ouverture du pont flottant à 17h30 et spectacle son et lumière sur le fleuve Han.',
            transportAdviceFr: 'Porte Guangji Men.'
          },
          {
            attractionId: 'chaozhou-live-opera',
            timeSlot: 'soiree',
            durationHours: 1.5,
            activityFr: 'Opéra traditionnel de Chaozhou aux manches d’eau.',
            transportAdviceFr: 'Bord du fleuve Han.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Art du Thé Gongfu & Voie Céramique de Cixing',
        themeFr: 'Cérémonie du Thé, Céramiques & Hôtel Orange Cixing Road',
        summaryFr: 'Initiez-vous aux 21 gestes de la cérémonie du thé Gongfu et découvrez les ateliers de porcelaine le long de la route Cixing.',
        stops: [
          {
            attractionId: 'chaozhou-gongfu-tea',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Cérémonie rituelle du thé Dancong Phénix dans une cour ancienne.',
            foodSuggestionFr: 'Thé Ya Shi Xiang (Parfum Déjection de Canard) aux notes d’orchidée sauvage.',
            transportAdviceFr: 'Maison de thé traditionnelle de Paifang Street.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Nouilles de riz Kway Teow sautées au bœuf et ailes d’oie croustillantes.',
            transportAdviceFr: 'Restaurant artisanal de la vieille ville.'
          },
          {
            attractionId: 'orange-hotel-chaozhou',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Découverte des ateliers de céramique de Fengxi sur la route Cixing et détente à l’Hôtel Orange.',
            transportAdviceFr: '10 min en taxi vers Cixing Road / Xiongying Building.'
          },
          {
            attractionId: 'chaozhou-paifang-street',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Dernière promenade nocturne sous les 22 arches de pierre illuminées.',
            transportAdviceFr: 'Retour en centre historique.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-cz-3-days',
    cityId: 'chaozhou',
    durationDays: 3,
    titleFr: 'Chaozhou l’Âme des Song : 3 Jours Rituels & Porcelaine',
    subtitleFr: 'La traversée complète des arts, du thé et des monuments historiques',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Temples Tang & Pont Flottant de Guangji',
        themeFr: 'Temple Kaiyuan, Portiques & Bateaux de Bois',
        summaryFr: 'Temple Tang sous les arbres Bodhi et la magie du pont flottant Song.',
        stops: [
          {
            attractionId: 'chaozhou-kaiyuan-temple',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Sanctuaire Tang fondé en 738.',
            transportAdviceFr: 'Vieille ville.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Festin d’oie braisée aux cinq épices.',
            transportAdviceFr: 'Paifang Street.'
          },
          {
            attractionId: 'chaozhou-paifang-street',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Les 22 portiques impériaux de pierre sculptée.',
            transportAdviceFr: 'À pied.'
          },
          {
            attractionId: 'chaozhou-guangji-bridge',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Spectacle son et lumière sur le pont flottant.',
            transportAdviceFr: 'Porte Guangji.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Art du Thé Gongfu & Voie Céramique',
        themeFr: 'Thé Dancong & Route Cixing',
        summaryFr: 'Cérémonie du thé Gongfu et ateliers de céramique de Fengxi.',
        stops: [
          {
            attractionId: 'chaozhou-gongfu-tea',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Initiation à la cérémonie du thé Gongfu Cha.',
            transportAdviceFr: 'Paifang Street.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Nouilles Teochew et volaille laquée.',
            transportAdviceFr: 'Vieille ville.'
          },
          {
            attractionId: 'orange-hotel-chaozhou',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Ateliers d’art de la céramique le long de la route Cixing et repos à l’Hôtel Orange.',
            transportAdviceFr: 'Route Cixing, Fengxi.'
          },
          {
            attractionId: 'chaozhou-live-opera',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Représentation théâtrale de l’opéra Chaoju.',
            transportAdviceFr: 'Berge du fleuve Han.'
          }
        ]
      },
      {
        dayNumber: 3,
        titleFr: 'Jour 3 : Remparts du Fleuve Han & Maîtres Artisans',
        themeFr: 'Pont Guangji, Broderies & Soirée Fluviale',
        summaryFr: 'Visite des pavillons d’artisans sur le pont de Guangji et adieux à la cité des Song.',
        stops: [
          {
            attractionId: 'chaozhou-guangji-bridge',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Traversée matinale des pavillons de bois et observation des piliers Song.',
            transportAdviceFr: 'Porte de Guangji.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Déjeuner dans une auberge de Paifang Street.',
            transportAdviceFr: 'Paifang Street.'
          },
          {
            attractionId: 'chaozhou-paifang-street',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Achat de broderies sur soie et thés Phoenix Dancong grands crus.',
            transportAdviceFr: 'À pied.'
          },
          {
            attractionId: 'chaozhou-gongfu-tea',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Dernière dégustation de thé au crépuscule sur les toits anciens.',
            transportAdviceFr: 'Maison de thé.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-cz-4-days',
    cityId: 'chaozhou',
    durationDays: 4,
    titleFr: 'Chaozhou Sérénité & Traditions : 4 Jours Impériaux',
    subtitleFr: 'La contemplation des dynasties Tang et Song au rythme du thé et du fleuve Han',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Sanctuaires Tang & Pont Song',
        themeFr: 'Temple Kaiyuan & Guangji Bridge',
        summaryFr: 'Monastère Tang et pont flottant de 18 bateaux.',
        stops: [
          {
            attractionId: 'chaozhou-kaiyuan-temple',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Visite du temple Kaiyuan.',
            transportAdviceFr: 'Vieille ville.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Oie braisée Teochew.',
            transportAdviceFr: 'Paifang Street.'
          },
          {
            attractionId: 'chaozhou-paifang-street',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Portiques de pierre Paifang.',
            transportAdviceFr: 'À pied.'
          },
          {
            attractionId: 'chaozhou-guangji-bridge',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Ouverture du pont et spectacle nocturne.',
            transportAdviceFr: 'Porte Guangji.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Thé Gongfu Cha & Voie Céramique',
        themeFr: 'Dancong du Mont Phénix & Route Cixing',
        summaryFr: 'L’art du thé Teochew et la porcelaine de Fengxi.',
        stops: [
          {
            attractionId: 'chaozhou-gongfu-tea',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Cérémonie du thé Gongfu.',
            transportAdviceFr: 'Paifang Street.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Nouilles de riz Kway Teow.',
            transportAdviceFr: 'Vieille ville.'
          },
          {
            attractionId: 'orange-hotel-chaozhou',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Ateliers de céramique de Fengxi sur la route Cixing et pause à l’Hôtel Orange.',
            transportAdviceFr: 'Route Cixing.'
          },
          {
            attractionId: 'chaozhou-live-opera',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Opéra Chaoju au bord du fleuve.',
            transportAdviceFr: 'Fleuve Han.'
          }
        ]
      },
      {
        dayNumber: 3,
        titleFr: 'Jour 3 : Remparts & Histoire Fluviale',
        themeFr: 'Pont de Guangji & Maîtres Sculpteurs',
        summaryFr: 'Les pavillons d’artisans sculpteurs et les remparts de la porte Guangji.',
        stops: [
          {
            attractionId: 'chaozhou-guangji-bridge',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Visite des pavillons de bois sur les piliers de pierre du XIIe siècle.',
            transportAdviceFr: 'Porte de Guangji.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Déjeuner dans les ruelles historiques.',
            transportAdviceFr: 'Paifang Street.'
          },
          {
            attractionId: 'chaozhou-paifang-street',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Musées de broderie et de sculpture sur bois dorée.',
            transportAdviceFr: 'À pied.'
          },
          {
            attractionId: 'chaozhou-gongfu-tea',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Dégustation crépusculaire de thés rares.',
            transportAdviceFr: 'Maison de thé.'
          }
        ]
      },
      {
        dayNumber: 4,
        titleFr: 'Jour 4 : Sérénité Méditative & Adieux à Chaozhou',
        themeFr: 'Temple Kaiyuan & Fleuve Han Scintillant',
        summaryFr: 'Une journée de quiétude pour savourer le rythme ancestral de Chaozhou.',
        stops: [
          {
            attractionId: 'chaozhou-kaiyuan-temple',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Chants matinaux des moines et recueillement.',
            transportAdviceFr: 'Temple Kaiyuan.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Grand banquet d’oie aux cinq épices.',
            transportAdviceFr: 'Paifang Street.'
          },
          {
            attractionId: 'chaozhou-guangji-bridge',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Dernière traversée piétonne du pont flottant.',
            transportAdviceFr: 'Porte Guangji.'
          },
          {
            attractionId: 'chaozhou-live-opera',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Concert d’adieu de musique traditionnelle Teochew sur les berges.',
            transportAdviceFr: 'Berges du fleuve Han.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-cz-5-days',
    cityId: 'chaozhou',
    durationDays: 5,
    titleFr: 'Chaozhou l’Épopée Teochew : 5 Jours de Grand Patrimoine',
    subtitleFr: 'L’immersion intégrale dans la capitale des arts, du thé et de la porcelaine',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Sanctuaires Tang & Pont Song',
        themeFr: 'Temple Kaiyuan, Portiques & Bateaux Flottants',
        summaryFr: 'Temple Tang sous les arbres Bodhi et le pont de Guangji.',
        stops: [
          {
            attractionId: 'chaozhou-kaiyuan-temple',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Visite du temple Kaiyuan.',
            transportAdviceFr: 'Vieille ville.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Oie braisée Teochew.',
            transportAdviceFr: 'Paifang Street.'
          },
          {
            attractionId: 'chaozhou-paifang-street',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Les 22 portiques de pierre.',
            transportAdviceFr: 'À pied.'
          },
          {
            attractionId: 'chaozhou-guangji-bridge',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Spectacle son et lumière nocturne.',
            transportAdviceFr: 'Porte Guangji.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Art du Thé Gongfu Cha & Voie Céramique',
        themeFr: 'Thé Dancong & Route Cixing',
        summaryFr: 'La cérémonie du thé Gongfu et la céramique de Fengxi.',
        stops: [
          {
            attractionId: 'chaozhou-gongfu-tea',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Cérémonie rituelle du thé Gongfu.',
            transportAdviceFr: 'Paifang Street.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Nouilles Teochew.',
            transportAdviceFr: 'Vieille ville.'
          },
          {
            attractionId: 'orange-hotel-chaozhou',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Ateliers de céramique sur la route Cixing et détente à l’Hôtel Orange.',
            transportAdviceFr: 'Route Cixing.'
          },
          {
            attractionId: 'chaozhou-live-opera',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Opéra Chaoju au bord du fleuve Han.',
            transportAdviceFr: 'Berges du fleuve Han.'
          }
        ]
      },
      {
        dayNumber: 3,
        titleFr: 'Jour 3 : Piliers Song & Sculpteurs sur Bois',
        themeFr: 'Pont Guangji & Broderie sur Soie',
        summaryFr: 'L’artisanat d’or et de soie de Chaozhou.',
        stops: [
          {
            attractionId: 'chaozhou-guangji-bridge',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Pavillons d’artisans sur le pont flottant.',
            transportAdviceFr: 'Porte Guangji.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Déjeuner dans Paifang Street.',
            transportAdviceFr: 'À pied.'
          },
          {
            attractionId: 'chaozhou-paifang-street',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Ateliers de sculpture sur bois doré et broderie.',
            transportAdviceFr: 'Paifang Street.'
          },
          {
            attractionId: 'chaozhou-gongfu-tea',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Dégustation de thé Dancong.',
            transportAdviceFr: 'Maison de thé.'
          }
        ]
      },
      {
        dayNumber: 4,
        titleFr: 'Jour 4 : Voie Céramique & Saveurs de Fengxi',
        themeFr: 'Route Cixing, Porcelaine & Fleuve Han',
        summaryFr: 'Immersion dans le berceau mondial de la céramique de Chaozhou.',
        stops: [
          {
            attractionId: 'orange-hotel-chaozhou',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Découverte des manufactures de porcelaine et galeries d’art céramique le long de la route Cixing.',
            transportAdviceFr: 'Route Cixing, district de Fengxi.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Déjeuner gastronomique de canard et oie braisée.',
            transportAdviceFr: 'Vieille ville.'
          },
          {
            attractionId: 'chaozhou-kaiyuan-temple',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Cloches de bronze Song et stèles anciennes.',
            transportAdviceFr: 'Temple Kaiyuan.'
          },
          {
            attractionId: 'chaozhou-live-opera',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Représentation théâtrale nocturne.',
            transportAdviceFr: 'Fleuve Han.'
          }
        ]
      },
      {
        dayNumber: 5,
        titleFr: 'Jour 5 : Apothéose Céleste des Maîtres Teochew',
        themeFr: 'Pont Guangji, Thé Éternel & Adieux',
        summaryFr: 'Une dernière journée inoubliable sur les traces des empereurs et des maîtres du thé.',
        stops: [
          {
            attractionId: 'chaozhou-guangji-bridge',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Dernière traversée matinale du pont flottant au lever du soleil.',
            transportAdviceFr: 'Porte Guangji.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Grand banquet de clôture avec foie gras d’oie et thés millésimés.',
            transportAdviceFr: 'Paifang Street.'
          },
          {
            attractionId: 'chaozhou-paifang-street',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Achat de thé Phénix Dancong et porcelaines de collection.',
            transportAdviceFr: 'Paifang Street.'
          },
          {
            attractionId: 'chaozhou-gongfu-tea',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Cérémonie finale du thé Gongfu Cha avec vue sur les lumières du fleuve Han.',
            transportAdviceFr: 'Maison de thé.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // MULTI-CITY ITINERARIES: COMBINÉ CHAOSHAN (1 to 5 Days)
  // ==========================================
  {
    id: 'itinerary-multi-1-day',
    cityId: 'multi',
    durationDays: 1,
    titleFr: 'Chaoshan Express : Le Grand Duo en 24h',
    subtitleFr: 'Le pont flottant de Chaozhou et la fondue de bœuf de Shantou en une journée',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : De la Cité Médiévale aux Arcades de Shantou',
        themeFr: 'Chaozhou le matin, Shantou l’après-midi',
        summaryFr: 'Visitez le pont flottant de Guangji et le temple Kaiyuan à Chaozhou, puis rejoignez Shantou pour Xiaogongyuan et la fondue de bœuf Baheli.',
        stops: [
          {
            attractionId: 'chaozhou-guangji-bridge',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Traversée du pont flottant Song sur le fleuve Han et visite du temple Kaiyuan.',
            transportAdviceFr: 'Arrivée en TGV à la gare de Chaozhou.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Déjeuner d’oie braisée Lion Head Goose dans Paifang Street.',
            transportAdviceFr: 'Paifang Street.'
          },
          {
            attractionId: 'shantou-xiaogongyuan',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Trajet express vers Shantou (30 min) et exploration des arcades Qilou du Petit Parc.',
            transportAdviceFr: 'Train express ou taxi Shantou-Chaozhou (30 min).'
          },
          {
            attractionId: 'shantou-beef-hotpot',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Grand festin de bœuf découpé minute chez Baheli Haiji.',
            transportAdviceFr: 'Taxi direct.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-multi-2-days',
    cityId: 'multi',
    durationDays: 2,
    titleFr: 'Chaoshan Élite : Chaozhou & Shantou en 48h',
    subtitleFr: 'La symbiose du patrimoine impérial et des capitales gourmandes',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Chaozhou la Médiévale & Thé Gongfu',
        themeFr: 'Temple Kaiyuan, 22 Portiques & Pont Flottant',
        summaryFr: 'Immergez-vous dans l’art de vivre Song à Chaozhou.',
        stops: [
          {
            attractionId: 'chaozhou-kaiyuan-temple',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Temple Tang sous les arbres Bodhi.',
            transportAdviceFr: 'Vieille ville de Chaozhou.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Festin d’oie braisée aux cinq épices.',
            transportAdviceFr: 'Paifang Street.'
          },
          {
            attractionId: 'chaozhou-paifang-street',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Les 22 portiques de pierre et cérémonie du thé Gongfu Cha.',
            transportAdviceFr: 'À pied.'
          },
          {
            attractionId: 'chaozhou-guangji-bridge',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Manœuvre du pont flottant à 17h30 et spectacle illuminé.',
            transportAdviceFr: 'Porte Guangji.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Shantou Républicaine & Festin de Bœuf',
        themeFr: 'Xiaogongyuan, Bœuf Baheli & Manoir Chen Cihong',
        summaryFr: 'Rejoignez Shantou pour le bœuf de renommée mondiale et le manoir de Chen Cihong.',
        stops: [
          {
            attractionId: 'shantou-chen-cihong-residence',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'La "Première Demeure Lingnan" et ses 506 salles à Chenghai.',
            transportAdviceFr: 'Taxi ou train vers Shantou/Chenghai (30 min).'
          },
          {
            attractionId: 'shantou-beef-hotpot',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Fondue sacrée de bœuf chez Baheli Haiji.',
            transportAdviceFr: 'Huanggang Road.'
          },
          {
            attractionId: 'shantou-xiaogongyuan',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Arcades Qilou de Xiaogongyuan et mémoire portuaire.',
            transportAdviceFr: 'Centre historique.'
          },
          {
            attractionId: 'shantou-fuyuan-seafood',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Crabes crus marinés et poissons du jour chez Fuyuan.',
            transportAdviceFr: 'Chaoyang Zhuang.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-multi-3-days-chaoshan',
    cityId: 'multi',
    durationDays: 3,
    titleFr: 'Chaoshan Gourmet & Histoire : Le Grand Triangle en 3 Jours',
    subtitleFr: 'La plus grande aventure gastronomique et patrimoniale de Chine du Sud',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Shantou & le Royaume du Bœuf',
        themeFr: 'Arcades Qilou de Xiaogongyuan & Fondue de Bœuf Baheli',
        summaryFr: 'Arrivée à Shantou, architecture républicaine et banquet culinaire légendaire.',
        stops: [
          {
            attractionId: 'shantou-xiaogongyuan',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Flânerie sous les arcades coloniales du Petit Parc.',
            transportAdviceFr: 'Arrivée par train TGV à Shantou Station.'
          },
          {
            attractionId: 'shantou-beef-hotpot',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'La fondue de bœuf découpé minute chez Baheli Haiji.',
            transportAdviceFr: 'Taxi direct.'
          },
          {
            attractionId: 'shantou-mixc',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Découverte de Nanyang Street et détente moderne.',
            transportAdviceFr: '10 min de taxi.'
          },
          {
            attractionId: 'shantou-fuyuan-seafood',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Dîner de fruits de mer Michelin chez Fuyuan.',
            transportAdviceFr: 'Chaoyang Zhuang.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Chaozhou la Médiévale & Pont Guangji',
        themeFr: 'Temple Kaiyuan, 22 Portiques & Pont Flottant',
        summaryFr: 'Trajet rapide Shantou-Chaozhou (30 min en TGV ou taxi) et découverte du pont flottant Song.',
        stops: [
          {
            attractionId: 'chaozhou-kaiyuan-temple',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Sanctuaire Tang et cours d’arbres Bodhi.',
            transportAdviceFr: 'Train express Shantou-Chaozhou (25 min).'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Festin d’oie braisée Lion Head Goose.',
            transportAdviceFr: 'Paifang Street.'
          },
          {
            attractionId: 'chaozhou-paifang-street',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Les 22 portiques impériaux et dégustation de thé Dancong.',
            transportAdviceFr: 'À pied.'
          },
          {
            attractionId: 'chaozhou-guangji-bridge',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Traversée des 18 bateaux en bois et spectacle nocturne.',
            transportAdviceFr: 'Porte Guangji Men.'
          }
        ]
      },
      {
        dayNumber: 3,
        titleFr: 'Jour 3 : Chen Cihong Guju & Île de Nan’ao',
        themeFr: 'Manoir Impérial & Beauté Côtière',
        summaryFr: 'Visite du manoir Chen Cihong et traversée du pont maritime de Nan’ao.',
        stops: [
          {
            attractionId: 'shantou-chen-cihong-residence',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Visite des 506 salles et faïences italiennes du grand manoir Qianmei à Chenghai.',
            transportAdviceFr: 'Taxi vers Chenghai.'
          },
          {
            attractionId: 'nanao-island-shantou',
            timeSlot: 'apres-midi',
            durationHours: 3.5,
            activityFr: 'Traversée du pont de Nan’ao de 11 km et baignade à Qing’ao Bay.',
            foodSuggestionFr: 'Ormeaux et huîtres géantes grillées sur l’île.',
            transportAdviceFr: 'Pont de Nan’ao.'
          },
          {
            attractionId: 'shantou-fuyuan-seafood',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Clôture gastronomique avec les crabes marinés de Fuyuan.',
            transportAdviceFr: 'Retour sur le continent.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-multi-4-days',
    cityId: 'multi',
    durationDays: 4,
    titleFr: 'Chaoshan Magistral : 4 Jours Mer, Villes & Palais',
    subtitleFr: 'La découverte exhaustive de Shantou, Chaozhou, Chenghai et l’île de Nan’ao',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Shantou Républicaine & Fondue Baheli',
        themeFr: 'Xiaogongyuan, Bœuf Minute & Soirée Fuyuan',
        summaryFr: 'L’élégance républicaine du Petit Parc et la fondue de bœuf.',
        stops: [
          {
            attractionId: 'shantou-xiaogongyuan',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Arcades Qilou de Xiaogongyuan.',
            transportAdviceFr: 'Centre de Shantou.'
          },
          {
            attractionId: 'shantou-beef-hotpot',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Fondue chez Baheli Haiji.',
            transportAdviceFr: 'Huanggang Road.'
          },
          {
            attractionId: 'shantou-mixc',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Nanyang Street et thés de Chaoshan.',
            transportAdviceFr: 'Taxi.'
          },
          {
            attractionId: 'shantou-fuyuan-seafood',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Banquet de fruits de mer chez Fuyuan.',
            transportAdviceFr: 'Chaoyang Zhuang.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Échappée Insulaire à Nan’ao',
        themeFr: 'Pont Maritime de 11km & Tropique du Cancer',
        summaryFr: 'Plages de sable fin et phares côtiers.',
        stops: [
          {
            attractionId: 'nanao-island-shantou',
            timeSlot: 'matin',
            durationHours: 4,
            activityFr: 'Qing’ao Bay, Porte de la Nature et phare marin.',
            foodSuggestionFr: 'Fruits de mer frais sur la plage.',
            transportAdviceFr: 'Pont maritime de Nan’ao.'
          },
          {
            attractionId: 'shantou-beef-hotpot',
            timeSlot: 'apres-midi',
            durationHours: 1.5,
            activityFr: 'Déjeuner de bœuf et boulettes artisanales.',
            transportAdviceFr: 'Retour continent.'
          },
          {
            attractionId: 'shantou-xiaogongyuan',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Lanternes rouges et crêpes Changfen le soir.',
            transportAdviceFr: 'Xiaogongyuan.'
          }
        ]
      },
      {
        dayNumber: 3,
        titleFr: 'Jour 3 : Première Demeure Lingnan Chen Cihong',
        themeFr: 'Palais de 506 pièces & Oie de Chenghai',
        summaryFr: 'Le manoir monumental de Chen Cihong à Qianmei.',
        stops: [
          {
            attractionId: 'shantou-chen-cihong-residence',
            timeSlot: 'matin',
            durationHours: 3,
            activityFr: 'Visite des 506 pièces, faïences centenaires et cours intérieures.',
            transportAdviceFr: 'Taxi vers Chenghai.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Oie braisée aux cinq épices de Chenghai.',
            transportAdviceFr: 'Chenghai.'
          },
          {
            attractionId: 'orange-hotel-chaozhou',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Transfert vers Chaozhou et route Cixing des céramiques.',
            transportAdviceFr: 'Taxi vers Chaozhou Cixing Road.'
          },
          {
            attractionId: 'chaozhou-live-opera',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Opéra de Chaozhou en plein air.',
            transportAdviceFr: 'Berges du fleuve Han.'
          }
        ]
      },
      {
        dayNumber: 4,
        titleFr: 'Jour 4 : Chaozhou Médiévale & Pont Flottant',
        themeFr: 'Temple Kaiyuan, Paifang & Pont Guangji',
        summaryFr: 'La magie de la dynastie Song au bord du fleuve Han.',
        stops: [
          {
            attractionId: 'chaozhou-kaiyuan-temple',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Sanctuaire Tang fondé en 738.',
            transportAdviceFr: 'Centre historique.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Festin d’oie braisée Lion Head Goose.',
            transportAdviceFr: 'Paifang Street.'
          },
          {
            attractionId: 'chaozhou-paifang-street',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Portiques Paifang et cérémonie du thé Gongfu Cha.',
            transportAdviceFr: 'À pied.'
          },
          {
            attractionId: 'chaozhou-guangji-bridge',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Ouverture des 18 bateaux en bois et spectacle nocturne.',
            transportAdviceFr: 'Porte Guangji.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-multi-5-days',
    cityId: 'multi',
    durationDays: 5,
    titleFr: 'L’Odyssée Chaoshan : 5 Jours Mythiques en Terre Teochew',
    subtitleFr: 'Le grand circuit complet : 3 villes, 1 île marine, 500 pièces impériales et traditions Song',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Shantou Républicaine & Légende du Bœuf',
        themeFr: 'Xiaogongyuan & Fondue Baheli',
        summaryFr: 'Le charme républicain et la meilleure fondue de bœuf de Chine.',
        stops: [
          {
            attractionId: 'shantou-xiaogongyuan',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Visite de Xiaogongyuan et arcades Qilou.',
            transportAdviceFr: 'Centre de Shantou.'
          },
          {
            attractionId: 'shantou-beef-hotpot',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Fondue chez Baheli Haiji.',
            transportAdviceFr: 'Huanggang Road.'
          },
          {
            attractionId: 'shantou-mixc',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Nanyang Street et douceurs de Chaoshan.',
            transportAdviceFr: 'Taxi.'
          },
          {
            attractionId: 'shantou-fuyuan-seafood',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Crabes crus marinés chez Fuyuan Da Pai Dang.',
            transportAdviceFr: 'Chaoyang Zhuang.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Échappée Maritime à l’Île de Nan’ao',
        themeFr: 'Pont Maritime de 11km & Tropique du Cancer',
        summaryFr: 'Les eaux turquoise du détroit de Taïwan et la baie de Qing’ao.',
        stops: [
          {
            attractionId: 'nanao-island-shantou',
            timeSlot: 'matin',
            durationHours: 4,
            activityFr: 'Plage de Qing’ao Bay, phare de Sanyaowan et parcs éoliens.',
            foodSuggestionFr: 'Ormeaux et huîtres géantes cuites sur la plage.',
            transportAdviceFr: 'Pont de Nan’ao.'
          },
          {
            attractionId: 'shantou-fuyuan-seafood',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Banquet de fruits de mer frais au retour de l’île.',
            transportAdviceFr: 'Retour continent.'
          },
          {
            attractionId: 'shantou-xiaogongyuan',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Flânerie sous les lampions rouges de Xiaogongyuan.',
            transportAdviceFr: 'Centre historique.'
          }
        ]
      },
      {
        dayNumber: 3,
        titleFr: 'Jour 3 : Première Demeure Lingnan Chen Cihong',
        themeFr: 'Manoir de 506 pièces & Route Céramique',
        summaryFr: 'Le palais impérial du Roi du riz au Siam à Chenghai.',
        stops: [
          {
            attractionId: 'shantou-chen-cihong-residence',
            timeSlot: 'matin',
            durationHours: 3,
            activityFr: 'Visite des 506 salles, des cours en "Quatre chevaux tirant un chariot" et des carreaux italiens.',
            transportAdviceFr: 'Taxi vers Chenghai.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Déjeuner d’oie braisée aux cinq épices de Chenghai.',
            transportAdviceFr: 'Chenghai.'
          },
          {
            attractionId: 'orange-hotel-chaozhou',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Arrivée à Chaozhou, découverte de la route Cixing et détente à l’Hôtel Orange.',
            transportAdviceFr: 'Taxi vers Chaozhou Cixing Road.'
          },
          {
            attractionId: 'chaozhou-live-opera',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Opéra traditionnel Chaoju sur les berges du fleuve Han.',
            transportAdviceFr: 'Fleuve Han.'
          }
        ]
      },
      {
        dayNumber: 4,
        titleFr: 'Jour 4 : Chaozhou Médiévale & Cérémonie du Pont',
        themeFr: 'Temple Kaiyuan, 22 Portiques & Pont Flottant',
        summaryFr: 'L’art de vivre Song et le pont flottant mobile de 18 bateaux.',
        stops: [
          {
            attractionId: 'chaozhou-kaiyuan-temple',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Sanctuaire Tang fondé en 738.',
            transportAdviceFr: 'Vieille ville.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Nouilles Teochew et foie gras d’oie.',
            transportAdviceFr: 'Paifang Street.'
          },
          {
            attractionId: 'chaozhou-paifang-street',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Arches Paifang et ateliers de céramique.',
            transportAdviceFr: 'À pied.'
          },
          {
            attractionId: 'chaozhou-guangji-bridge',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Spectacle son et lumière sur le pont de Guangji.',
            transportAdviceFr: 'Porte Guangji.'
          }
        ]
      },
      {
        dayNumber: 5,
        titleFr: 'Jour 5 : Apothéose du Thé Gongfu Cha & Clôture',
        themeFr: 'Thé Dancong Phénix, Remparts & Adieux',
        summaryFr: 'Célébrez l’art du thé ancestral avant un grand banquet d’adieu.',
        stops: [
          {
            attractionId: 'chaozhou-gongfu-tea',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Initiation à la cérémonie du thé Gongfu Cha avec un maître artisan.',
            transportAdviceFr: 'Paifang Street.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Grand festin de clôture d’oie braisée.',
            transportAdviceFr: 'Paifang Street.'
          },
          {
            attractionId: 'chaozhou-guangji-bridge',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Dernière traversée piétonne des pavillons de Guangji.',
            transportAdviceFr: 'Porte Guangji.'
          },
          {
            attractionId: 'orange-hotel-chaozhou',
            timeSlot: 'soiree',
            durationHours: 1.5,
            activityFr: 'Derniers achats d’artisanat de porcelaine sur la route Cixing.',
            transportAdviceFr: 'Route Cixing.'
          }
        ]
      }
    ]
  }
];
