import { SuggestedItinerary } from '../types/travel';

export const SUGGESTED_ITINERARIES: SuggestedItinerary[] = [
  // --- GUANGZHOU ITINERARIES ---
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
            activityFr: 'Promenade digestive sous les banyans centenaires et découverte des demeures coloniales victoriennes et françaises.',
            transportAdviceFr: '15 min à pied au sud de Shangxiajiu ou 1 station jusqu’à Huangsha (Sortie F).'
          },
          {
            attractionId: 'canton-tower',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Ascension vers les ponts d’observation ou balade sur l’esplanade Haixinsha face à la tour scintillante.',
            foodSuggestionFr: 'Dîner cantonnais avec oie rôtie croustillante le long de la promenade Zhujiang.',
            transportAdviceFr: 'Prenez la Ligne 1 puis la Ligne 3 jusqu’à Canton Tower Station.'
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
            durationHours: 2.5,
            activityFr: 'Immersion dans la "Boîte à Merveilles" : porcelaines de Canton et Route de la Soie Maritime.',
            transportAdviceFr: 'Métro Ligne 3/5 jusqu’à Zhujiang New Town ou Zhujiang East Road.'
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
        titleFr: 'Jour 1 : Les Racines de Yangcheng',
        themeFr: 'Arts du Lingnan, Opéra Cantonais & Île de Shamian',
        summaryFr: 'Temple Chen, les venelles restaurées de Yong Qing Fang et le charme intemporel de Shamian.',
        stops: [
          {
            attractionId: 'chen-clan-ancestral-hall',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Visite architecturale complète et galeries de broderies cantonaises.',
            transportAdviceFr: 'Métro Ligne 1, Sortie D.'
          },
          {
            attractionId: 'cantonese-dimsum-yumcha',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Yum Cha à Taotaoju sur Shangxiajiu Pedestrian Street.',
            foodSuggestionFr: 'Duo de Siu Mai et brioches fondantes au jaune d’œuf coulant (Liusha Bao).',
            transportAdviceFr: 'À 10 min à pied.'
          },
          {
            attractionId: 'yong-qing-fang',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Musée de l’Opéra Cantonais sur l’eau, maison de Bruce Lee et boutiques d’artisans.',
            transportAdviceFr: 'Marche de 10 min le long d’Enning Road.'
          },
          {
            attractionId: 'shamian-island',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Balade crépusculaire sous les lampions de l’île de Shamian et dîner au White Swan Hotel.',
            transportAdviceFr: 'Courte traversée piétonne par la passerelle de Huangsha.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Collines Sacrées & Mégalopole Fluviale',
        themeFr: 'Légende des Cinq Béliers, Cité Nouvelle & Croisière',
        summaryFr: 'Vue sur la ville depuis Yuexiu, visite du musée provincial et croisière sous les étoiles.',
        stops: [
          {
            attractionId: 'yuexiu-park',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Les collines sacrées, la statue des Cinq Béliers et le pavillon Zhenhai.',
            transportAdviceFr: 'Métro Ligne 2, Yuexiu Park.'
          },
          {
            attractionId: 'sacred-heart-cathedral',
            timeSlot: 'dejeuner',
            durationHours: 1.5,
            activityFr: 'Cathédrale Shishi en granit sculpté et déjeuner de canard rôti.',
            foodSuggestionFr: 'Oie rôtie au miel et prunes (Shenjing Shao’e).',
            transportAdviceFr: 'Métro Ligne 2 jusqu’à Haizhu Square.'
          },
          {
            attractionId: 'guangdong-museum',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Expositions de la Route de la Soie et architecture de l’Opéra de Zaha Hadid voisin.',
            transportAdviceFr: 'Métro Ligne 5 vers Zhujiang New Town.'
          },
          {
            attractionId: 'pearl-river-cruise',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Croisière panoramique sur la rivière et contemplation de la Tour de Canton illuminée.',
            transportAdviceFr: 'Embarquement direct à Tianzi ou Haixinsha Pier.'
          }
        ]
      },
      {
        dayNumber: 3,
        titleFr: 'Jour 3 : Pépites Cachées & Ruelles d’Artistes',
        themeFr: 'Villas Républicaines de Dongshankou & Village Ancien de Pantang',
        summaryFr: 'Découvrez la Guangzhou bohème, les galeries d’art intimistes et les ruelles préservées.',
        stops: [
          {
            attractionId: 'pantang-ancient-village',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Flânerie dans le village millénaire au bord du lac Liwan et dégustation de gâteau de châtaigne d’eau.',
            foodSuggestionFr: 'Gâteau de châtaigne d’eau (Mati Gao) doré à la poêle.',
            transportAdviceFr: 'Métro Ligne 5, Station Zhongshanba.'
          },
          {
            attractionId: 'dongshankou',
            timeSlot: 'apres-midi',
            durationHours: 3,
            activityFr: 'Exploration des manoirs en brique rouge des années 1920, boutiques de créateurs et pause café artisanal.',
            foodSuggestionFr: 'Café de spécialité torréfié localement et pâtisseries fusion franco-chinoises.',
            transportAdviceFr: 'Métro Ligne 1/6 jusqu’à Dongshankou Station.'
          },
          {
            attractionId: 'taikoo-hui',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Pause shopping de prestige et thé sur le jardin suspendu (Roof Garden) de Taikoo Hui Tianhe.',
            foodSuggestionFr: 'Thé de spécialité et douceurs cantonnaises au café du toit-terrasse.',
            transportAdviceFr: 'Métro Ligne 1/3 jusqu’à Shipaiqiao Station (liaison directe souterraine).'
          },
          {
            attractionId: 'guangzhou-opera-house',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Soirée spectacle vivant dans la coquille futuriste de Zaha Hadid ou contemplation nocturne des "galets jumeaux" sur la rivière des Perles.',
            foodSuggestionFr: 'Dîner gastronomique avec vue sur les miroirs d’eau de Zhujiang New Town.',
            transportAdviceFr: 'Métro Ligne 3/5 ou navette APM jusqu’à Guangzhou Opera House.'
          }
        ]
      }
    ]
  },

  // --- SHENZHEN ITINERARIES ---
  {
    id: 'itinerary-sz-1-day',
    cityId: 'shenzhen',
    durationDays: 1,
    titleFr: 'Shenzhen Futuriste : Silicon Valley & Baie Maritime en 24h',
    subtitleFr: 'Du sommet du 4e plus haut gratte-ciel du monde au coucher de soleil sur la mer',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : L’Avant-Garde Technologique et Maritime',
        themeFr: 'Gratte-ciel Vertigineux, Bohème Industrielle & Baie Côtière',
        summaryFr: 'Contemplez la skyline depuis 541m au Ping An Centre, détendez-vous dans les galeries d’OCT-LOFT et admirez le coucher de soleil face à Hong Kong le long de la baie.',
        stops: [
          {
            attractionId: 'ping-an-finance-centre',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Ascension en ascenseur ultra-rapide à 541 mètres (116e étage) pour un panorama à 360° sur Shenzhen et Hong Kong.',
            transportAdviceFr: 'Métro Ligne 1 ou 3, Station Shopping Park (Gou Wu Gong Yuan), Sortie D.'
          },
          {
            attractionId: 'oct-loft-shenzhen',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Pause déjeuner créative, visite des galeries d’art contemporain et découverte de la librairie Old Heaven Books.',
            foodSuggestionFr: 'Café de spécialité infusé à froid et cuisine fusion créative au milieu des banyans tropicaux.',
            transportAdviceFr: 'Métro Ligne 1 jusqu’à Qiaocheng East (Sortie A).'
          },
          {
            attractionId: 'shenzhen-bay-park',
            timeSlot: 'soiree',
            durationHours: 3,
            activityFr: 'Balade côtière au coucher du soleil, vue sur la tour Spring Cocoon et spectacle de lumières nocturnes sur la baie.',
            foodSuggestionFr: 'Dîner de fruits de mer frais de la mer de Chine méridionale dans le quartier Houhai.',
            transportAdviceFr: 'Métro Ligne 9/11 jusqu’à Houhai ou Shenzhen Bay Park.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-sz-2-days',
    cityId: 'shenzhen',
    durationDays: 2,
    titleFr: 'Shenzhen 48h : Mégalopole & Forteresse Maritime',
    subtitleFr: 'Entre la vitesse du futur et les remparts Ming du XIVe siècle',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Sommets Urbains & Art Contemporain',
        themeFr: 'Skyline de Futian & Atmosphère Bohème',
        summaryFr: 'Panorama depuis le Ping An Centre et flânerie créative dans OCT-LOFT.',
        stops: [
          {
            attractionId: 'ping-an-finance-centre',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Terrasse Free Sky et sol de verre au 116e étage.',
            transportAdviceFr: 'Métro Ligne 1/3 Shopping Park.'
          },
          {
            attractionId: 'oct-loft-shenzhen',
            timeSlot: 'apres-midi',
            durationHours: 3,
            activityFr: 'Galerie OCAT, librairies d’art et concert intimiste.',
            transportAdviceFr: 'Métro Ligne 1 Qiaocheng East.'
          },
          {
            attractionId: 'shenzhen-bay-park',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Promenade nocturne au Talent Park face aux gratte-ciel illuminés.',
            transportAdviceFr: 'Métro Ligne 11 Houhai.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : L’Origine de Pengcheng & Mer de Chine',
        themeFr: 'Forteresse Ming de Dapeng & Plages Sauvages',
        summaryFr: 'Plongez dans les origines navales de Shenzhen et ses ruelles pavées de 600 ans.',
        stops: [
          {
            attractionId: 'dapeng-ancient-fortress',
            timeSlot: 'matin',
            durationHours: 3.5,
            activityFr: 'Découverte des portes impériales Ming, résidences de généraux et ruelles de granit.',
            foodSuggestionFr: 'Gâteaux de riz gluant traditionnels hakka et thé aux herbes.',
            transportAdviceFr: 'Prendre la Ligne 8 jusqu’à Yantian puis bus express E11 ou taxi vers Dapeng (40 min).'
          },
          {
            attractionId: 'shenzhen-mixc-world',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Shopping branché dans le mall à ciel ouvert, photo devant le Bubblecoat Elephant et flagships high-tech.',
            foodSuggestionFr: 'Thé glacé créatif chez Heytea Lab.',
            transportAdviceFr: 'Retour vers Nanshan en taxi ou métro Ligne 1 jusqu’à Hi-Tech Park Station.'
          },
          {
            attractionId: 'runyuan-coconut-chicken',
            timeSlot: 'soiree',
            durationHours: 1.5,
            activityFr: 'Dîner réconfortant du "plat officiel de Shenzhen" : poulet fermier poché minute dans de l’eau de coco fraîche.',
            foodSuggestionFr: 'Poulet de Wenchang, sauce soja aux calamansis et piments, riz Baozai Fan croustillant.',
            transportAdviceFr: 'Sur place à MixC World ou à 1 station de métro.'
          },
          {
            attractionId: 'shenzhen-robot-arena',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Soirée spectacle électrisante dans l’arène de combat Robot Box : étincelles de blindages d’acier et tournoi mécha.',
            transportAdviceFr: 'À 5 minutes au cœur du parc technologique de Nanshan.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-sz-3-days',
    cityId: 'shenzhen',
    durationDays: 3,
    titleFr: 'Shenzhen Grand Angle : Du XIVe Siècle à la Cité Cyberpunk en 3 Jours',
    subtitleFr: 'La totale : gratte-ciel vertigineux, forteresse impériale, arène de robots et verrière technologique LED',
    pace: 'balanced',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Vertige des Hauteurs & Esprit Bohème',
        themeFr: 'Skyline Futuriste & Énergie Créative',
        summaryFr: 'Vue panoramique depuis le Ping An Centre (541m), balade artistique à OCT-LOFT et coucher de soleil sur la baie côtière.',
        stops: [
          {
            attractionId: 'ping-an-finance-centre',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Ascension à 541 mètres pour une vue époustouflante sur Shenzhen et Hong Kong.',
            transportAdviceFr: 'Métro Lignes 1/3, Station Shopping Park, Sortie D.'
          },
          {
            attractionId: 'oct-loft-shenzhen',
            timeSlot: 'apres-midi',
            durationHours: 3,
            activityFr: 'Flânerie dans les anciennes usines reconverties, galeries d’art et café glacé de spécialité.',
            foodSuggestionFr: 'Café de torréfaction artisanale et pâtisseries à l’ombre des banyans géants.',
            transportAdviceFr: 'Métro Ligne 1 jusqu’à Qiaocheng East.'
          },
          {
            attractionId: 'shenzhen-bay-park',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Balade côtière au Talent Park et spectacle son et lumière sur le miroir d’eau face à la tour Spring Cocoon.',
            transportAdviceFr: 'Métro Ligne 11 jusqu’à Houhai.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : Les Racines de Pengcheng & Shopping de Prestige',
        themeFr: 'Forteresse Ming & Tendances Mondiales',
        summaryFr: 'Explorez les remparts de pierre de Dapeng avant de plonger dans le shopping branché de MixC World.',
        stops: [
          {
            attractionId: 'dapeng-ancient-fortress',
            timeSlot: 'matin',
            durationHours: 3.5,
            activityFr: 'Voyage dans le passé de la dynastie Ming : portes de granit, demeures d’amiraux et bord de mer.',
            foodSuggestionFr: 'Gâteaux de riz gluant traditionnels hakka et thés sauvages.',
            transportAdviceFr: 'Métro Ligne 8 jusqu’à Yantian puis bus E11 ou taxi vers Dapeng.'
          },
          {
            attractionId: 'shenzhen-mixc-world',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Découverte du mall ouvert, photo emblématique avec le Bubblecoat Elephant et flagships de haute technologie.',
            transportAdviceFr: 'Métro Ligne 1 jusqu’à Hi-Tech Park Station.'
          },
          {
            attractionId: 'runyuan-coconut-chicken',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Dîner réconfortant : poulet fermier mijoté dans trois eaux de coco fraîches et riz croustillant Baozai Fan.',
            transportAdviceFr: 'Sur place à MixC World.'
          }
        ]
      },
      {
        dayNumber: 3,
        titleFr: 'Jour 3 : Silicon Valley du Futur, Robots & Toit Technologique LED',
        themeFr: 'Gladiateurs Méchas & Verrière Digitale Cyberpunk',
        summaryFr: 'Vibrez devant les combats de robots dans l’arène Robot Box puis plongez dans l’ébullition nocturne sous la verrière technologique de Huaqiangbei.',
        stops: [
          {
            attractionId: 'shenzhen-robot-arena',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Immersion dans l’arène Robot Box : tournois de combats de robots télécommandés, étincelles d’acier et simulateur de pilotage.',
            transportAdviceFr: 'Métro Ligne 1, Hi-Tech Park ou Shenzhen University.'
          },
          {
            attractionId: 'shenzhen-tech-canopy',
            timeSlot: 'soiree',
            durationHours: 3,
            activityFr: 'Marche nocturne spectaculaire sous la monumentale verrière technologique LED de Huaqiangbei : projections 3D cyberpunk, néons futuristes et découverte des marchés de gadgets du futur.',
            foodSuggestionFr: 'Brochettes grillées au cumin et thés au citron écrasé faits minute (Yashi Xiang Lemon Tea) dans les allées animées.',
            transportAdviceFr: 'Métro Ligne 2 ou 7, Station Huaqiang North, direct sur la promenade piétonne sous le toit technologique.'
          }
        ]
      }
    ]
  },

  // --- SHANTOU ITINERARIES ---
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
            attractionId: 'shantou-xiaogongyuan',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Flânerie sous les lampions rouges illuminés, dégustation de crêpes de riz vapeur Changfen aux huîtres.',
            foodSuggestionFr: 'Changfen aux huîtres et œufs battus, soupe douce de canard au cédrat confit.',
            transportAdviceFr: 'Retour au centre historique en début de soirée.'
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
        titleFr: 'Jour 2 : Échappée Marine à l’Île de Nan’ao',
        themeFr: 'Pont Maritime de 11km, Plages & Phares',
        summaryFr: 'Traversez le gigantesque pont marin vers les eaux turquoise de Qing’ao Bay.',
        stops: [
          {
            attractionId: 'nanao-island-shantou',
            timeSlot: 'matin',
            durationHours: 4,
            activityFr: 'Traversée du grand pont maritime, plage de Qing’ao Bay et monument du Tropique du Cancer.',
            foodSuggestionFr: 'Ormeaux sauvages grillés à l’ail et huîtres géantes de Nan’ao cuites sur la plage.',
            transportAdviceFr: 'Bus touristique direct 105 ou taxi à la journée.'
          }
        ]
      }
    ]
  },

  // --- CHAOZHOU ITINERARIES ---
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
        titleFr: 'Jour 1 : Pont Flottant Song, 22 Portiques & Cérémonie du Thé',
        themeFr: 'Ingénierie Médiévale, Sanctuaire Tang & Art du Thé UNESCO',
        summaryFr: 'Traversez le mythique pont Guangji sur ses bateaux flottants, déambulez sous les 22 arcs de pierre de Paifang Street et initiez-vous au thé Gongfu Fenghuang Dancong.',
        stops: [
          {
            attractionId: 'chaozhou-kaiyuan-temple',
            timeSlot: 'matin',
            durationHours: 1.5,
            activityFr: 'Immersion spirituelle dans le sanctuaire Tang vieux de 1300 ans, contemplation des cloches Song et bas-reliefs dorés.',
            transportAdviceFr: 'Au cœur de la vieille ville, entrée directe par Kaiyuan Road.'
          },
          {
            attractionId: 'chaozhou-paifang-street',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: 'Découverte des 22 portiques monumentaux en granit sculpté et déjeuner de spécialités Teochew.',
            foodSuggestionFr: 'Omelette croustillante aux huîtres (Haojian), nouilles de canard aux herbes et gâteaux Yamu Nian.',
            transportAdviceFr: 'À 2 minutes à pied du temple Kaiyuan.'
          },
          {
            attractionId: 'chaozhou-gongfu-tea',
            timeSlot: 'apres-midi',
            durationHours: 2,
            activityFr: 'Séance de dégustation rituelle de thé Gongfu dans le patio historique de Zaiyang Tea House.',
            foodSuggestionFr: 'Thé Oolong Dancong arôme miel-orchidée (Mi Lan Xiang) accompagné de fruits confits au cédrat.',
            transportAdviceFr: 'Cour intérieure de Yijing Lane sur Paifang Street.'
          },
          {
            attractionId: 'chaozhou-guangji-bridge',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Traversée du pont flottant Song sur les 18 bateaux de bois, manœuvre d’ouverture à 17h30 et spectacle son et lumière à 20h00.',
            transportAdviceFr: 'Sortez par la porte est Guangji Gate Tower le long de la rivière Han.'
          }
        ]
      }
    ]
  },
  {
    id: 'itinerary-cz-2-days',
    cityId: 'chaozhou',
    durationDays: 2,
    titleFr: 'Chaozhou Intemporelle : 48h au Cœur de la Culture Teochew',
    subtitleFr: 'Artisanat d’or et de soie, ponts flottants et sérénité millénaire',
    pace: 'relaxed',
    focus: 'all',
    days: [
      {
        dayNumber: 1,
        titleFr: 'Jour 1 : Les Grands Joyaux Historiques',
        themeFr: 'Temple Kaiyuan, Pont Guangji & Spectacle Fluvial',
        summaryFr: 'Temple Tang, ponton flottant de bateaux et illuminations sur la rivière Han.',
        stops: [
          {
            attractionId: 'chaozhou-kaiyuan-temple',
            timeSlot: 'matin',
            durationHours: 2,
            activityFr: 'Visite contemplative du monastère Tang et de ses cours d’encens.',
            transportAdviceFr: 'Kaiyuan Road.'
          },
          {
            attractionId: 'chaozhou-guangji-bridge',
            timeSlot: 'apres-midi',
            durationHours: 3,
            activityFr: 'Visite des pavillons d’artisans et contemplation du ponton flottant.',
            transportAdviceFr: 'Porte Guangji.'
          }
        ]
      },
      {
        dayNumber: 2,
        titleFr: 'Jour 2 : L’Art de Vivre & les Portiques Royaux',
        themeFr: '22 Portiques Ming-Qing & Dégustation de Thé Dancong',
        summaryFr: 'Promenade sous les arches et initiation aux secrets du thé Gongfu.',
        stops: [
          {
            attractionId: 'chaozhou-paifang-street',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Découverte des métiers d’art : broderie d’or et céramiques fines.',
            transportAdviceFr: 'Taiping Road.'
          },
          {
            attractionId: 'chaozhou-gongfu-tea',
            timeSlot: 'apres-midi',
            durationHours: 2.5,
            activityFr: 'Atelier de dégustation des thés de montagne Fenghuang.',
            transportAdviceFr: 'Zaiyang Tea House.'
          },
          {
            attractionId: 'chaozhou-goose-banquet',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Dîner de prestige dans la cour d’un manoir Teochew : festin d’oie à tête de lion braisée au galanga et foie d’oie soyeux.',
            foodSuggestionFr: 'Assiette Cinq Trésors (magret, peau, foie d’oie fondant, tofu) trempée dans le vinaigre d’ail.',
            transportAdviceFr: 'Venelles de Xima Road, vieille ville.'
          },
          {
            attractionId: 'chaozhou-live-opera',
            timeSlot: 'soiree',
            durationHours: 2,
            activityFr: 'Représentation théâtrale nocturne de l’opéra de Chaozhou (UNESCO) : comédiens en costumes de soie et virtuosité des manches d’eau.',
            foodSuggestionFr: 'Thé Dancong chaud servi pendant la représentation.',
            transportAdviceFr: 'Esplanade de la porte Guangji ou pavillon Zaiyang.'
          }
        ]
      }
    ]
  },

  // --- MULTI-CITY GRAND TOURS ---
  {
    id: 'itinerary-multi-3-days-chaoshan',
    cityId: 'multi',
    durationDays: 3,
    titleFr: 'Odyssée Chaoshan : Shantou & Chaozhou en 3 Jours',
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
            attractionId: 'chaozhou-paifang-street',
            timeSlot: 'dejeuner',
            durationHours: 2,
            activityFr: '22 portiques impériaux et déjeuner d’omelette aux huîtres.',
            transportAdviceFr: 'À 5 min à pied.'
          },
          {
            attractionId: 'chaozhou-guangji-bridge',
            timeSlot: 'soiree',
            durationHours: 2.5,
            activityFr: 'Traversée des 18 bateaux en bois et spectacle nocturne.',
            transportAdviceFr: 'Porte Guangji.'
          }
        ]
      },
      {
        dayNumber: 3,
        titleFr: 'Jour 3 : L’Esprit du Thé & Retraite Dancong',
        themeFr: 'Cérémonie du Thé Gongfu & Retour',
        summaryFr: 'Initiez-vous au rituel du thé Fenghuang Dancong avant votre départ.',
        stops: [
          {
            attractionId: 'chaozhou-gongfu-tea',
            timeSlot: 'matin',
            durationHours: 2.5,
            activityFr: 'Atelier de thé Gongfu et dégustation d’Oolong Mi Lan Xiang.',
            transportAdviceFr: 'Zaiyang Tea House.'
          }
        ]
      }
    ]
  }
];
