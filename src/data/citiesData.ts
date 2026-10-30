import { Attraction, CityInfo, CityId } from '../types/travel';
import { GUANGZHOU_ATTRACTIONS } from './guangzhouData';

export const CITIES_CONFIG: Record<CityId, CityInfo> = {
  guangzhou: {
    id: 'guangzhou',
    nameFr: 'Guangzhou (Canton)',
    nameCn: '广州',
    pinyin: 'Guǎngzhōu',
    taglineFr: 'Capitale millénaire, berceau du Lingnan et capitale mondiale du Dim Sum.',
    centerLat: 23.1250,
    centerLng: 113.2750,
    zoomLevel: 12,
    image: './assets/images/canton_tower_night_1793290740500.jpg',
  },
  shenzhen: {
    id: 'shenzhen',
    nameFr: 'Shenzhen',
    nameCn: '深圳',
    pinyin: 'Shēnzhèn',
    taglineFr: 'Mégalopole futuriste, Silicon Valley chinoise, design audacieux et parcs côtiers.',
    centerLat: 22.5400,
    centerLng: 114.0500,
    zoomLevel: 12,
    image: './assets/images/shenzhen_skyline_bay_1793293122053.jpg',
  },
  shantou: {
    id: 'shantou',
    nameFr: 'Shantou (Swatow)',
    nameCn: '汕头',
    pinyin: 'Shàntóu',
    taglineFr: 'Capitale gourmande du Chaoshan, fondue de bœuf légendaire et arcades républicaines.',
    centerLat: 23.3650,
    centerLng: 116.6900,
    zoomLevel: 12,
    image: './assets/images/shantou_xiaogongyuan_street_1793293123621.jpg',
  },
  chaozhou: {
    id: 'chaozhou',
    nameFr: 'Chaozhou (Teochew)',
    nameCn: '潮州',
    pinyin: 'Cháozhōu',
    taglineFr: 'Cité historique préservée, pont flottant millénaire, thé Gongfu et temples Tang.',
    centerLat: 23.6650,
    centerLng: 116.6420,
    zoomLevel: 13,
    image: './assets/images/chaozhou_guangji_bridge_1793293122927.jpg',
  },
};

export const SHENZHEN_ATTRACTIONS: Attraction[] = [
  {
    id: 'ping-an-finance-centre',
    cityId: 'shenzhen',
    nameFr: 'Tour Ping An Finance Centre (Sky Deck 541m)',
    nameEn: 'Ping An Finance Centre & Free Sky Deck',
    nameCn: '平安金融中心 (Free Sky 云际观光)',
    pinyin: 'Píng’ān Jīnróng Zhōngxīn',
    cantonesePhonetic: 'Ping-on Gam-jung Zung-sam',
    category: 'modern',
    district: 'Futian (福田区)',
    lat: 22.536412,
    lng: 114.050471,
    metroInfoFr: 'Métro Lignes 1 ou 3, Station Shopping Park (Gou Wu Gong Yuan), Sortie D',
    metroInfoEn: 'Metro Line 1 or 3, Shopping Park Station, Exit D',
    addressCn: '深圳市福田区益田路5033号平安金融中心116层',
    image: './assets/images/ping_an_tower_1793294695737.jpg',
    thumbnailAlt: 'Gratte-ciel colossal Ping An Finance Centre dominant le quartier financier de Futian',
    descriptionFr: 'Deuxième plus haute tour de Chine et quatrième gratte-ciel du monde culminant à 599 mètres, le Ping An Finance Centre incarne la fulgurance technologique de Shenzhen. Ses 118 étages abritent une terrasse d’observation à 360 degrés, Free Sky, perchée au 116e étage à 541 mètres. Par temps clair, la vue s’étend au-delà de la baie de Shenzhen jusqu’aux collines verdoyantes des Nouveaux Territoires de Hong Kong. Les ascenseurs ultra-rapides grimpent au sommet en seulement 55 secondes (10 m/s).',
    descriptionEn: 'The 4th tallest building in the world at 599 meters. The Free Sky observation deck on the 116th floor (541m) provides panoramic 360-degree vistas across Shenzhen and into Hong Kong.',
    culturalNoteFr: 'Sa façade en acier inoxydable de 1700 tonnes a été spécialement forgée pour résister à la corrosion saline des typhons tropicaux de la mer de Chine méridionale.',
    visitingTipsFr: [
      'Visitez 45 minutes avant le coucher du soleil pour contempler la métropole s’embraser de néons.',
      'Testez la plateforme en verre suspendue en porte-à-faux au-dessus du vide pour un frisson garanti.',
      'Billet avec réduction en réservant sur mini-programme chinois ou à l’accueil avec passeport.'
    ],
    recommendedDuration: '1h30 - 2h',
    estimatedCostRmb: 180,
    bestTime: 'Fin d’après-midi & Coucher de soleil (17h30 - 19h30)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 84000,
        badge: '深圳地标第一名 (N°1 Monument de Shenzhen)',
        highlightQuote: '电梯极速上升，116层云端视野太无敌了，香港新界一览无遗！(L’ascenseur est fulgurant, la vue à 360 degrés sur Shenzhen et Hong Kong est sensationnelle).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.7,
        reviewCount: 2900,
        badge: 'Travelers’ Choice Best of the Best',
        highlightQuote: 'One of the best observation decks anywhere in Asia. Incredibly modern and spotless.'
      },
      {
        source: 'google',
        sourceName: 'Google Maps',
        sourceType: 'western',
        score: 4.7,
        reviewCount: 3800,
        highlightQuote: 'Epic architectural wonder. On a clear day you can see deep into Hong Kong mountains.'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Architecture Futuriste', 'Skyline', 'Vue Hong Kong', '599 Mètres']
  },
  {
    id: 'oct-loft-shenzhen',
    cityId: 'shenzhen',
    nameFr: 'Quartier Créatif OCT-LOFT',
    nameEn: 'OCT-LOFT Creative Culture Park',
    nameCn: '华侨城创意文化园 (OCT-LOFT)',
    pinyin: 'Huáqiáochéng Chuàngyì Wénhuàyuán',
    cantonesePhonetic: 'Waa-kiu-sing Cong-ji Man-faa-jyun',
    category: 'art_hidden',
    district: 'Nanshan (南山区)',
    lat: 22.541221,
    lng: 113.988621,
    metroInfoFr: 'Métro Ligne 1, Station Qiaocheng East (Qiaocheng Dong), Sortie A (5 min à pied)',
    metroInfoEn: 'Metro Line 1, Qiaocheng East Station, Exit A',
    addressCn: '深圳市南山区华侨城开平街创意文化园',
    image: './assets/images/oct_loft_art_1793294697253.jpg',
    thumbnailAlt: 'Anciennes usines reconverties en galeries et terrasses ombragées à OCT-LOFT',
    descriptionFr: 'Ancien complexe manufacturier d’électronique des années 1980 transformé en haut lieu de la contre-culture et du design contemporain, OCT-LOFT est le cœur bohème de Shenzhen. Niché sous une forêt luxuriante d’arbres tropicaux, ses hangars industriels en béton brut abritent la célèbre galerie d’art contemporain OCAT, des librairies indépendantes comme Old Heaven Books, des clubs de jazz intimes, des ateliers de poterie et d’élégants cafés de torréfaction artisanale.',
    descriptionEn: 'A sprawling 1980s industrial electronics plant revitalized into Shenzhen’s premier art, design, and live jazz district. Leafy banyan-canopied alleys are lined with galleries, vinyl record bookstores, and artisanal roasteries.',
    culturalNoteFr: 'C’est le berceau du festival international de jazz de Shenzhen et des marchés d’artisanat alternatif T-Street.',
    visitingTipsFr: [
      'Visitez la librairie Old Heaven Books (旧天堂书店) pour son ambiance feutrée, ses vinyles rares et son patio secret.',
      'Chaque premier et troisième week-end du mois, le marché créatif T-Street Market envahit les allées piétonnes.',
      'Parfait pour une après-midi décontractée à l’ombre des banyans géants.'
    ],
    recommendedDuration: '2h30 - 3h',
    estimatedCostRmb: 0,
    bestTime: 'Après-midi et soirée (14h30 - 21h00)',
    scores: [
      {
        source: 'xiaohongshu',
        sourceName: 'Xiaohongshu (小红书)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 220000,
        badge: '深圳文艺天花板 (Sommet Bohème de Shenzhen)',
        highlightQuote: '旧厂房爆改的艺术街区，旧天堂书店必去，绿树成荫太好逛了！(La reconversion industrielle est sublime, Old Heaven Books est un sanctuaire de culture).'
      },
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.7,
        reviewCount: 71000,
        highlightQuote: '闹中取静，咖啡馆和设计画廊林立，适合慢节奏感受深圳的年轻活力。(Une oasis de paix créative, galeries raffinées et superbes cafés).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.6,
        reviewCount: 1650,
        highlightQuote: 'A creative oasis in a high-tech city. Great vibe, cool bookstores, and top-notch coffee.'
      }
    ],
    isTopRated: false,
    isHiddenGem: true,
    tags: ['Pépite Cachée', 'Design Industriel', 'Clubs de Jazz', 'Cafés de Torréfaction']
  },
  {
    id: 'shenzhen-bay-park',
    cityId: 'shenzhen',
    nameFr: 'Parc de la Baie de Shenzhen & Talents Park',
    nameEn: 'Shenzhen Bay Coastal Park & Talent Park',
    nameCn: '深圳湾公园 & 深圳人才公园',
    pinyin: 'Shēnzhèn Wān Gōngyuán',
    cantonesePhonetic: 'Sam-zan Waan Gung-jyun',
    category: 'nature',
    district: 'Nanshan (南山区)',
    lat: 22.513662,
    lng: 113.944174,
    metroInfoFr: 'Métro Ligne 9 ou Ligne 11, Station Houhai, Sortie G, ou Station Shenzhen Bay Park',
    metroInfoEn: 'Metro Line 9 or 11, Houhai Station Exit G or Shenzhen Bay Park Station',
    addressCn: '深圳市南山区科苑南路3329号',
    image: './assets/images/shenzhen_skyline_bay_1793293122053.jpg',
    thumbnailAlt: 'Promenade côtière longeant la baie de Shenzhen face à la tour Spring Cocoon',
    descriptionFr: 'S’étirant sur plus de 13 kilomètres le long du littoral marin, le parc de la Baie de Shenzhen relie la mangrove protégée de Futian aux gratte-ciel scintillants de Houhai. C’est le lieu de promenade de prédilection des habitants : pistes cyclables côtières avec vue panoramique sur les montagnes de Hong Kong, vols d’oiseaux migrateurs (spatules blanches, cormorans) et miroir d’eau du Talent Park reflétant la spectaculaire tour "Pousse de Bambou" (China Resources Tower, 392m). De nuit, un monumental spectacle de lasers et drones illumine la baie.',
    descriptionEn: 'A breathtaking 13-kilometer coastal greenway along the South China Sea facing Hong Kong. Highlights include Talent Park lake reflecting the Spring Cocoon tower, mangrove bird sanctuaries, and cycling promenades.',
    culturalNoteFr: 'En hiver, la baie devient une étape cruciale pour plus de 100 000 oiseaux migrateurs d’Asie de l’Est.',
    visitingTipsFr: [
      'Louez un vélo partagé (Meituan / Hellobike) pour parcourir la piste cyclable maritime jusqu’au pont de Shenzhen Bay.',
      'Le spectacle son et lumière du Talent Park débute à 19h30 les vendredis et samedis soir.',
      'Accès libre et entièrement gratuit.'
    ],
    recommendedDuration: '2h - 3h',
    estimatedCostRmb: 0,
    bestTime: 'Fin d’après-midi au coucher du soleil (16h30 - 19h30)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 175000,
        badge: '深圳散步海景第1名 (N°1 Balades Côtières)',
        highlightQuote: '沿海吹风看日落太治愈了，春笋大厦倒映在人才公园湖面，夜景美得像科幻电影。(Regarder le coucher de soleil face à la mer est magique, le reflet de la tour Spring Cocoon est digne d’un film de science-fiction).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.7,
        reviewCount: 2200,
        highlightQuote: 'Spectacular waterfront park. Cycling here with Hong Kong on one side and futuristic skyline on the other is unforgettable.'
      },
      {
        source: 'google',
        sourceName: 'Google Maps',
        sourceType: 'western',
        score: 4.7,
        reviewCount: 3100,
        highlightQuote: 'World-class public park design. Super clean, wide pathways, amazing sunset skyline.'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Parc Côtier', 'Vue Hong Kong', 'Piste Cyclable', 'Oiseaux Migrateurs']
  },
  {
    id: 'dapeng-ancient-fortress',
    cityId: 'shenzhen',
    nameFr: 'Forteresse Millénaire de Dapeng',
    nameEn: 'Dapeng Ancient Naval Fortress',
    nameCn: '大鹏所城',
    pinyin: 'Dàpéng Suǒchéng',
    cantonesePhonetic: 'Daai-paang So-sing',
    category: 'heritage',
    district: 'Dapeng New District (大鹏新区)',
    lat: 22.597874,
    lng: 114.507692,
    metroInfoFr: 'Métro Ligne 8 jusqu’à Yantian Port, puis bus direct E11 ou taxi (40 min)',
    metroInfoEn: 'Metro Line 8 to Yantian, then bus E11 or taxi to Dapeng Ancient City',
    addressCn: '深圳市大鹏新区鹏飞路大鹏所城',
    image: './assets/images/dapeng_fortress_1793294697341.jpg',
    thumbnailAlt: 'Portes fortifiées en pierre de taille et venelles pavées de granit de Dapeng',
    descriptionFr: 'Fondée en 1394 sous la dynastie Ming pour repousser les pirates japonais (Wokou) et fortifiée plus tard durant les guerres de l’opium, la forteresse de Dapeng est le vestige historique le plus prestigieux de Shenzhen. Ses remparts crénelés de granit, ses portes monumentales et son réseau de venelles pavées ont préservé l’atmosphère de la Chine impériale côtière. C’est de cette forteresse que Shenzhen tire son nom poétique : "Pengcheng" (la Cité du Grand Oiseau Peng).',
    descriptionEn: 'A 600-year-old Ming naval defense fortress built in 1394. Stone gates, commander mansions, and narrow granite alleys offer a rare glimpse into Shenzhen’s rich pre-modern coastal history.',
    culturalNoteFr: 'Le dialecte parlé à l’intérieur des remparts, le "Dapeng Hua", est un mélange unique de hakka et de cantonais militaire hérité des garnisons impériales.',
    visitingTipsFr: [
      'Visitez la somptueuse résidence du général Lai Enjue (赖恩爵振威将军第).',
      'Combinez votre visite avec la plage voisine de Jiaochangwei réputée pour ses auberges de bord de mer.',
      'Entrée entièrement gratuite.'
    ],
    recommendedDuration: '3h - 4h',
    estimatedCostRmb: 0,
    bestTime: 'Journée ensoleillée (10h00 - 16h00)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.7,
        reviewCount: 58000,
        badge: '深圳历史文化源头 (Racines Historiques de Shenzhen)',
        highlightQuote: '六百年明清古城，青石板路古色古香，比市区更有历史沉淀感。(600 ans d’histoire Ming et Qing, un charme minéral préservé loin de la frénésie urbaine).'
      },
      {
        source: 'xiaohongshu',
        sourceName: 'Xiaohongshu (小红书)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 92000,
        highlightQuote: '拍照太出片了！石板街两旁是文艺民宿和茶馆，挨着较场尾海滩。(Ruelles pleines de cachet, auberges poétiques et mer à deux pas).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.5,
        reviewCount: 880,
        highlightQuote: 'Surprising historic treasure in modern Shenzhen. Well-preserved military fortress.'
      }
    ],
    isTopRated: false,
    isHiddenGem: true,
    tags: ['Pépite Cachée', 'Forteresse Ming 1394', 'Histoire Navale', 'Bord de Mer']
  },
  {
    id: 'shenzhen-mixc-world',
    cityId: 'shenzhen',
    nameFr: 'Centre Commercial The MixC World (Nanshan)',
    nameEn: 'The MixC World Shopping & Lifestyle Mall',
    nameCn: '深圳万象天地',
    pinyin: 'Shēnzhèn Wànxiàng Tiāndì',
    cantonesePhonetic: 'Sam-zan Maan-zoeng Tin-dei',
    category: 'mall',
    district: 'Nanshan (南山区)',
    lat: 22.544933,
    lng: 113.951127,
    metroInfoFr: 'Métro Ligne 1, Station Hi-Tech Park (Gaoxinyuan), Sortie A (direct en souterrain)',
    metroInfoEn: 'Metro Line 1, Hi-Tech Park Station, Exit A',
    addressCn: '深圳市南山区深南大道9668号万象天地',
    image: './assets/images/shenzhen_mixc_world_1793294563524.jpg',
    thumbnailAlt: 'Sculpture d’éléphant géant Bubblecoat Elephant et allée piétonne animée de MixC World à Shenzhen',
    descriptionFr: 'Référence incontestée du retail contemporain en Chine, The MixC World à Nanshan réinvente le centre commercial sous la forme d’un quartier urbain ouvert ("Block + Mall"). Sa place centrale accueille la célèbre sculpture monumentale "Bubblecoat Elephant" créée par l’artiste Florentijn Hofman. On y découvre les boutiques conceptuelles des plus grandes marques high-tech mondiales (Huawei Flagship mondial, DJI, Tesla), des créateurs de mode émergents, des cinémas IMAX futuristes et une immense rue piétonne de bars et bistros animés jusqu’à minuit.',
    descriptionEn: 'Shenzhen’s trendiest open-air lifestyle complex combining a multi-level indoor mall with outdoor cobblestone pedestrian streets. Home to Florentijn Hofman’s giant Bubblecoat Elephant sculpture, tech flagships, and buzzing cafe terraces.',
    culturalNoteFr: 'MixC World est surnommé "la vitrine de la Silicon Valley chinoise" : c’est ici que les géants de la tech testent leurs derniers prototypes de boutiques immersives en réalité augmentée.',
    visitingTipsFr: [
      'Prenez la photo emblématique devant la trompe géante de l’éléphant qui arrose d’eau la place centrale.',
      'Visitez le pavillon mondial Huawei pour tester les robots humanoïdes et les véhicules électriques autonomes.',
      'Parfait pour une session shopping combinée à un dîner branché en terrasse le soir.'
    ],
    recommendedDuration: '2h30 - 3h30',
    estimatedCostRmb: 0,
    bestTime: 'Fin d’après-midi & Soirée festive (15h30 - 22h00)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 198000,
        badge: '深圳潮流商场第一名 (N°1 Malls Tendance)',
        highlightQuote: '大象雕塑必打卡！街区+商场的设计太好逛了，科技旗舰店和网红餐厅应有尽有。(L’éléphant géant est incontournable ! Le concept rue ouverte + centre commercial est parfait).'
      },
      {
        source: 'xiaohongshu',
        sourceName: 'Xiaohongshu (小红书)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 340000,
        badge: '深圳最出片商圈 (Spot Photo Majeur)',
        highlightQuote: '深圳最酷的潮流地标，晚上水广场喷泉亮灯超级出片！(Le repaire le plus cool de Shenzhen, fontaines illuminées spectaculaires).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.7,
        reviewCount: 1250,
        highlightQuote: 'Ultra-modern urban complex. Great open air spaces, incredible dining options, and tech flagships.'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Mall Futuriste', 'Bubblecoat Elephant', 'Tech Flagships', 'Terrasses & Bistros']
  },
  {
    id: 'shenzhen-robot-arena',
    cityId: 'shenzhen',
    nameFr: 'Arène Robot Box & Cyber Combats (High-Tech Arena)',
    nameEn: 'Shenzhen Robot Box Fighting Arena & Mech Lab',
    nameCn: '深圳机甲争霸格斗竞技馆 (Robot Box)',
    pinyin: 'Shēnzhèn Jījiǎ Gédòu Guǎn',
    cantonesePhonetic: 'Sam-zan Gei-gaap Gaak-dau Gun',
    category: 'event',
    district: 'Nanshan / Bao’an (南山与宝安区)',
    lat: 22.55122,
    lng: 113.93633,
    metroInfoFr: 'Métro Ligne 1, Station Shenzhen University ou Hi-Tech Park, Sortie C',
    metroInfoEn: 'Metro Line 1, Hi-Tech Park Station, Tech Performance District',
    addressCn: '深圳市南山区科技园科发路科技竞技中心',
    image: './assets/images/shenzhen_robot_arena_1793294562112.jpg',
    thumbnailAlt: 'Arène blindée futuriste avec robots de combat en duel d’étincelles et foule enthousiaste',
    descriptionFr: 'Capitale mondiale de la robotique et de l’ingénierie mécanique, Shenzhen propose une expérience de divertissement futuriste unique au monde : l’arène Robot Box (combats de robots et méchas télécommandés). Dans une cage d’acier et de verre pare-balles de 150 m² baignée d’éclairages néons cyberpunk, des robots de combat de 15 à 110 kg conçus par les meilleurs ingénieurs s’affrontent en duel avec scies circulaires, marteaux pneumatiques et lances pneumatiques produisant des jaillissements d’étincelles électrisants. Les spectateurs peuvent même piloter des mini-robots dans la zone d’entraînement interactive.',
    descriptionEn: 'The epicenter of battle bots and mech combat entertainment. Inside a reinforced glass cage with cyberpunk laser lighting, heavy armored robots clash in spark-flying live gladiatorial tournaments with interactive pilot stations.',
    culturalNoteFr: 'Né des compétitions RoboMaster organisées par le géant du drone DJI, cet événement attire la crème des ingénieurs d’Asie et a donné lieu aux plus célèbres émissions de télé-réalité de mecha combat en Chine.',
    visitingTipsFr: [
      'Consultez la programmation des tournois de fin de semaine ("Night Battle") où les chocs sont les plus spectaculaires.',
      'Essayez le simulateur de pilotage de mécha et les ateliers de montage de mini-combattants après le show.',
      'Expérience électrisante recommandée aux passionnés de science-fiction, de technologie et aux familles.'
    ],
    recommendedDuration: '2h - 2h30',
    estimatedCostRmb: 120,
    bestTime: 'Vendredi, Samedi et Dimanche soir (19h00 - 21h30)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 45000,
        badge: '硬核黑科技体验第一名 (N°1 Expériences High-Tech)',
        highlightQuote: '太炸裂了！真机甲钢铁碰撞火花四溅，现场音效配合赛博朋克灯光，男孩子女孩子都看得热血沸腾！(Un show démentiel ! Des étincelles de métal en direct, sons et néons cyberpunk survoltés).'
      },
      {
        source: 'xiaohongshu',
        sourceName: 'Xiaohongshu (小红书)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 78000,
        highlightQuote: '硬核科技之城的专属浪漫，亲手操纵格斗机器人太好玩了！(L’esprit d’innovation pur de Shenzhen, piloter son propre robot de duel est jouissif).'
      },
      {
        source: 'google',
        sourceName: 'Google Maps',
        sourceType: 'western',
        score: 4.8,
        reviewCount: 950,
        highlightQuote: 'Real-life BattleBots in the hardware capital of the world. Mind-blowing entertainment.'
      }
    ],
    isTopRated: true,
    isHiddenGem: true,
    tags: ['Robot Box', 'Combats Méchas', 'Cyberpunk', 'High-Tech Shenzhen']
  },
  {
    id: 'runyuan-coconut-chicken',
    cityId: 'shenzhen',
    nameFr: 'Poulet à l’Eau de Coco de Runyuan Sijia',
    nameEn: 'Runyuan Sijia Coconut Chicken Hotpot Flagship',
    nameCn: '润园四季椰子鸡',
    pinyin: 'Rùnyuán Sìjì Yēzǐjī',
    cantonesePhonetic: 'Jeon-jyun Sei-gwai Je-zi-gai',
    category: 'restaurant',
    district: 'Futian & Nanshan (福田与南山区)',
    lat: 22.5338,
    lng: 114.0515,
    metroInfoFr: 'Métro Ligne 1 ou 3, Station Shopping Park (Coco Park) ou MixC World Nanshan',
    metroInfoEn: 'Metro Line 1 or 3, Shopping Park Station (Coco Park Branch)',
    addressCn: '深圳市福田区民田路星河COCO Park三楼',
    image: './assets/images/runyuan_chicken_1793294712418.jpg',
    thumbnailAlt: 'Cocotte en terre cuite de poulet fermier mijotant dans l’eau de coco pure à Runyuan Sijia',
    descriptionFr: 'Véritable "plat national officieux" de la mégalopole de Shenzhen, le poulet à l’eau de coco (Yēzǐ Jī) est le plat préféré des créatifs et entrepreneurs de la Silicon Valley chinoise. À Runyuan Sijia, le rituel est immuable : trois noix de coco fraîches de Hainan sont fendues devant vous pour verser leur eau limpide et sucrée dans la marmite. On y plonge des morceaux de jeune poulet fermier de Wenchang et des lamelles de chair de coco fraîche. Après 6 minutes précises de cuisson mesurées par un sablier, on trempe la chair fondante dans un mélange divin de sauce soja claire, piments oiseaux hachés, gingembre des sables et jus de petits calamansis verts.',
    descriptionEn: 'The definitive culinary emblem of modern Shenzhen. Three freshly cracked coconuts are emptied table-side to simmer tender free-range Wenchang chicken, dipped into a zesty soy dip with sand ginger and freshly squeezed calamansi.',
    culturalNoteFr: 'Bien que les ingrédients viennent de Hainan, la fondue au poulet-coco a été popularisée et perfectionnée à Shenzhen au point d’être surnommée "la cuisine municipale de Shenzhen".',
    visitingTipsFr: [
      'Buvez d’abord un bol de bouillon chaud avant de manger la viande : il est doux, parfumé et revigorant.',
      'Ajoutez des champignons sauvages (Zhusun / bambou fungus) et du riz en cocotte à la saucisse cantonaise (Baozai Fan) en accompagnement.',
      'Prenez un ticket d’attente tôt le soir car Runyuan affiche complet dès 18h30.'
    ],
    recommendedDuration: '1h30 - 2h',
    estimatedCostRmb: 110,
    bestTime: 'Déjeuner ou Dîner convivial (12h00 ou 18h30)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 260000,
        badge: '必吃榜十年常胜将军 (Légende Incontournable 10 Ans)',
        highlightQuote: '深圳的市菜担当！椰青水清甜回甘，文昌鸡皮爽肉滑，沙姜青桔蘸料是灵魂中的灵魂！(Le plat emblématique de Shenzhen ! Bouillon de coco pur et poulet divinement fondant).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.7,
        reviewCount: 1400,
        badge: 'Top Must-Try Local Specialty',
        highlightQuote: 'Clean, healthy, and supremely delicious. The coconut broth and calamansi lime dip blew me away.'
      },
      {
        source: 'xiaohongshu',
        sourceName: 'Xiaohongshu (小红书)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 190000,
        highlightQuote: '来深圳不吃润园四季等于白来，煲仔饭也是一绝，锅巴焦香酥脆。(Incontournable absolu à Shenzhen, le riz croustillant Baozai Fan est fabuleux).'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Poulet à l’Eau de Coco', 'Spécialité de Shenzhen', 'Wenchang Chicken', 'Baozai Fan']
  },
  {
    id: 'shenzhen-tech-canopy',
    cityId: 'shenzhen',
    nameFr: 'Avenue de Huaqiangbei & Verrière Technologique LED',
    nameEn: 'Huaqiangbei Science & Technology Canopy Walkway',
    nameCn: '华强北科技步行街 (巨型科技光影天幕)',
    pinyin: 'Huáqiángběi Kējì Bùxíngjiē (Tiānmù)',
    cantonesePhonetic: 'Waa-koeng-bak Fo-gei Bou-hang-gaai',
    category: 'modern',
    district: 'Futian (福田区)',
    lat: 22.54397,
    lng: 114.082345,
    metroInfoFr: 'Métro Lignes 2 ou 7, Station Huaqiang North (华强北), Sortie A ou B, direct sur l’artère piétonne',
    metroInfoEn: 'Metro Line 2 or 7, Huaqiang North Station, Exit A or B directly to pedestrian canopy plaza',
    addressCn: '深圳市福田区华强北路科技步行街中央天幕广场',
    image: './assets/images/shenzhen_tech_canopy_1793296487433.jpg',
    thumbnailAlt: 'Verrière technologique futuriste en arches LED 3D surplombant l’avenue piétonne illuminée de Huaqiangbei à Shenzhen',
    descriptionFr: 'Célèbre dans le monde entier comme le cœur battant de l’électronique mondiale ("Silicon Valley of Hardware"), l’avenue piétonne de Huaqiangbei a été transfigurée par une spectaculaire verrière technologique et une canopée numérique LED 3D monumentale. De nuit, ce toit technologique s’anime de fresques de lumière cyberpunk, d’effets visuels tridimensionnels sans lunettes et de jeux d’hologrammes au-dessus des promeneurs. Longue de près d’un kilomètre, la promenade est bordée de marchés de composants futuristes, de pavillons d’inventions robotiques, de drones et de boutiques gadgets introuvables ailleurs sur la planète.',
    descriptionEn: 'The global epicenter of hardware innovation reimagined with a colossal high-tech 3D LED digital sky canopy. Spanning across the vibrant pedestrian boulevard, this glowing cyber-roof projects animations, holographic visuals, and futuristic light art above bustling gadget markets and tech labs.',
    culturalNoteFr: 'Huaqiangbei a vu naître les géants de la tech chinoise (Tencent a débuté dans un modeste bureau de SEG Plaza). On y croise inventeurs de la Silicon Valley, makers mondiaux et passionnés de robotique.',
    visitingTipsFr: [
      'Venez entre 19h00 et 21h30 lorsque la verrière technologique et les façades numériques sont pleinement illuminées avec leurs effets 3D.',
      'Explorez les galeries du SEG Electronics Plaza pour observer les gadgets du futur, les composants électroniques et les accessoires high-tech à prix d’usine.',
      'Promenade piétonne entièrement sécurisée, idéale pour une marche nocturne dans une ambiance digne d’un film de science-fiction.'
    ],
    recommendedDuration: '2h - 3h',
    estimatedCostRmb: 0,
    bestTime: 'Soirée illuminée (19h00 - 22h00)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 165000,
        badge: '深圳科技街区第1名 (N°1 Rues Technologiques)',
        highlightQuote: '夜晚的科技光影天幕太震撼了！仿佛置身赛博朋克未来之城，各种黑科技数码产品应有尽有！(Le ciel technologique illuminé la nuit est grandiose ! On se croirait dans une ville cyberpunk du futur, un paradis high-tech).'
      },
      {
        source: 'xiaohongshu',
        sourceName: 'Xiaohongshu (小红书)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 280000,
        badge: '赛博朋克天花板 (Sommet Cyberpunk)',
        highlightQuote: '华强北不仅好买数码，晚上的光影科技天幕超级酷，拍照出片率100%！(L’arche lumineuse technologique le soir est ultra cool, photos spectaculaires garanties).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.6,
        reviewCount: 2100,
        highlightQuote: 'A surreal glimpse into the hardware capital of Earth. The illuminated technological canopy over the walkway at night is breathtaking.'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Toit Technologique LED', 'Huaqiangbei', 'Cyberpunk', 'Silicon Valley Hardware', 'Néons Nocturnes']
  }
];

export const SHANTOU_ATTRACTIONS: Attraction[] = [
  {
    id: 'shantou-xiaogongyuan',
    cityId: 'shantou',
    nameFr: 'Quartier Historique de Xiaogongyuan (Le Petit Parc)',
    nameEn: 'Xiaogongyuan Historic Qilou District',
    nameCn: '汕头小公园历史文化街区',
    pinyin: 'Shàntóu Xiǎogōngyuán',
    cantonesePhonetic: 'Saan-tau Siu-gung-jyun',
    category: 'heritage',
    district: 'Jinping (金平区)',
    lat: 23.36012,
    lng: 116.679184,
    metroInfoFr: 'Bus urbains 2, 5, 14 ou taxi direct (15 min depuis la gare TGV de Shantou)',
    metroInfoEn: 'City Bus 2, 5, 14 or short taxi ride from Shantou Railway Station',
    addressCn: '汕头市金平区国平路小公园中山纪念亭',
    image: './assets/images/shantou_xiaogongyuan_street_1793293123621.jpg',
    thumbnailAlt: 'Pavillon commémoratif central et arcades Qilou illuminées de Xiaogongyuan à Shantou',
    descriptionFr: 'Cœur battant de l’ancienne concession et du port franc de Shantou au début du XXe siècle, Xiaogongyuan déploie le plus vaste ensemble de maisons d’arcade (Qilou) de Chine. Centré autour d’un pavillon octogonal en bois dédié à Sun Yat-sen, le quartier s’organise selon un plan radial spectaculaire inspiré de l’Étoile à Paris. Ses façades Art Déco et baroques mêlent céramiques vernissées chinoises, frontons sculptés à l’européenne et persiennes coloniales aux lampions rouges.',
    descriptionEn: 'The historic heart of treaty-port Shantou, featuring China’s largest contiguous network of Republican-era Qilou arcade commercial buildings radiated outward like Paris’ Place de l’Étoile from the Sun Yat-sen Pavilion.',
    culturalNoteFr: 'Construit grâce aux fonds envoyés par les marchands de la diaspora Teochew d’Asie du Sud-Est (Thaïlande, Singapour, Indonésie), il symbolise la mémoire maritime des "Lettres d’Outre-Mer" (Qiaopi).',
    visitingTipsFr: [
      'Visitez le Grand Magasin Nansheng (南生百货), fleuron moderniste des années 1930.',
      'Dégustez dans les venelles les crêpes de riz à la vapeur de Shantou (Changfen aux huîtres fraîches et œufs).',
      'Flânez à la tombée de la nuit lorsque des centaines de lanternes rouges éclairent les arcades.'
    ],
    recommendedDuration: '2h - 3h',
    estimatedCostRmb: 0,
    bestTime: 'Fin d’après-midi jusqu’en soirée (16h30 - 21h30)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 94000,
        badge: '潮汕民国骑楼第一街 (N°1 Rues Historiques Chaoshan)',
        highlightQuote: '夜景太惊艳了！修旧如旧的骑楼建筑充满民国复古风情，小吃摊一路吃过去太幸福！(La nuit est féerique ! Les arcades restaurées respirent le charme républicain et les échoppes gourmandes régalent à chaque pas).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.6,
        reviewCount: 1100,
        highlightQuote: 'Incredible early 20th-century colonial arcade architecture. Walking here feels like a movie set.'
      },
      {
        source: 'xiaohongshu',
        sourceName: 'Xiaohongshu (小红书)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 180000,
        highlightQuote: '汕头必打卡地标，穿旗袍拍照复古胶片感十足。(Le spot incontournable de Shantou, atmosphère cinéma rétro absolue).'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Architecture Qilou', 'Plan Radial', 'Mémoire de la Diaspora', 'Échoppes Gourmandes']
  },
  {
    id: 'shantou-beef-hotpot',
    cityId: 'shantou',
    nameFr: 'Festin Traditionnel de Fondue de Bœuf Chaoshan',
    nameEn: 'Chaoshan Hand-Cut Beef Hotpot Culture',
    nameCn: '潮汕牛肉火锅 (八合里海记 / 福合埕)',
    pinyin: 'Cháoshàn Niúròu Huǒguō',
    cantonesePhonetic: 'Ciu-saan Ngau-juk Fo-wo',
    category: 'food',
    district: 'Jinping & Longhu (金平与龙湖区)',
    lat: 23.37383,
    lng: 116.69,
    metroInfoFr: 'Bus urbains ou taxi vers Baheli (Rue Huanggang) ou Fuxin Road',
    metroInfoEn: 'Taxi directly to Baheli Haiji flagship or Fuxin Road branches',
    addressCn: '汕头市金平区黄岗路坪埔9座 (八合里海记总店)',
    image: './assets/images/chaoshan_beef_hotpot_1793293124531.jpg',
    thumbnailAlt: 'Assiettes de fines tranches de bœuf fraîches découpées à la main et bouillon frémissant',
    descriptionFr: 'La fondue de bœuf de Chaoshan est reconnue par les plus grands gastronomes comme le summum mondial du bœuf bouilli. La règle d’or absolue : la viande n’est jamais congelée et provient d’abattages réalisés moins de quatre heures auparavant. Découpée sous les yeux des convives au couteau de maître selon 10 découpes anatomiques distinctes (Diaolong pour la tendreté, Wurenzhi pour le croquant marbré, Boliang pour le fondant), elle est immergée 8 à 10 secondes dans un bouillon clair limpide d’os et de maïs doux, puis trempée dans la fameuse sauce Shacha artisanale.',
    descriptionEn: 'The holy grail of Chinese beef dining. Butchered less than 4 hours prior and never frozen, master butchers slice tender cuts table-side according to 10 specific anatomical parts, briefly blanched in clear bone broth with satay shacha dip.',
    culturalNoteFr: 'Les boulettes de bœuf (Niurou Wan) sont battues à la main avec deux massues en fer de 3 kg durant 40 minutes jusqu’à obtenir une texture élastique légendaire qui rebondit comme une balle de tennis.',
    visitingTipsFr: [
      'Commandez au moins 3 découpes différentes : Diaolong (吊龙 - filet), Chibing (匙柄 - paleron tendre) et les boulettes de bœuf pures (Shouda Niurouwan).',
      'Respectez la règle des "Trois immersions, trois levées" (San Diao San Qiao) : 8 à 10 secondes de cuisson par panier suffisent.',
      'Baheli Haiji (八合里海记) et Fuhecheng (福合埕) sont les temples sacrés de cette tradition.'
    ],
    recommendedDuration: '2h',
    estimatedCostRmb: 95,
    bestTime: 'Déjeuner (11h30 - 13h30) ou Dîner (17h30 - 20h30)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 310000,
        badge: '黑珍珠一钻 & 必吃榜榜首 (N°1 Guide Black Pearl & Gourmand)',
        highlightQuote: '牛肉下锅八秒即可，嫩到舌尖化开！沙茶酱咸甜浓郁，来汕头不吃这口等于白来！(8 secondes dans le bouillon et la viande fond sur la langue ! Le goût de Shacha est divin).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.8,
        reviewCount: 2400,
        badge: 'Foodie Hall of Fame',
        highlightQuote: 'Incredible freshness. You taste the true pure flavor of beef like nowhere else in the world.'
      },
      {
        source: 'ctrip',
        sourceName: 'Ctrip (携程)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 140000,
        highlightQuote: '非遗手打牛肉丸Q弹爆汁，潮汕美食灵魂所在。(Les boulettes pétries à la main éclatent de jus savoureux, l’âme culinaire de Chaoshan).'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Gastronomie Chaoshan', 'Fondue de Bœuf', 'Sauce Shacha', 'Légende Culinaire']
  },
  {
    id: 'nanao-island-shantou',
    cityId: 'shantou',
    nameFr: 'Île de Nan’ao & Baie de Qing’ao',
    nameEn: 'Nan’ao Island & Qing’ao Bay',
    nameCn: '南澳岛 & 青澳湾',
    pinyin: 'Nán’ào Dǎo',
    cantonesePhonetic: 'Naam-ou Dou',
    category: 'nature',
    district: 'Nan’ao County (南澳县)',
    lat: 23.4385,
    lng: 117.135,
    metroInfoFr: 'Bus interurbain 105 ou 161 depuis Shantou traversant le pont maritime de Nan’ao (11 km)',
    metroInfoEn: 'Direct tourist bus 105 or 161 crossing the 11km Nan’ao Sea Bridge',
    addressCn: '汕头市南澳县青澳湾自然之门海滨景区',
    image: './assets/images/nanao_lighthouse_1793294713423.jpg',
    thumbnailAlt: 'Plage dorée de Qing’ao Bay et phare marin de Sanyaowan sur l’île de Nan’ao',
    descriptionFr: 'Seul comté insulaire de la province du Guangdong, l’île de Nan’ao baigne dans les eaux turquoise du détroit de Taïwan. On y accède par un spectaculaire pont maritime à haubans de 11 kilomètres. L’île est réputée pour ses plages de sable doré en croissant de lune à Qing’ao Bay, son phare rouge rayé de Sanyaowan dressé sur les récifs, ses parcs à huîtres multicolores flottant sur l’océan et son monument de la "Porte de la Nature", situé exactement sur le tracé géographique du Tropique du Cancer.',
    descriptionEn: 'An enchanting subtropical island in the Taiwan Strait reached via an 11-km sea bridge. Known for Qing’ao Bay’s crescent sandy beaches, sea wind turbine farms, and the Tropic of Cancer monument.',
    culturalNoteFr: 'Nan’ao fut une base navale stratégique disputée par le célèbre pirate Zheng Zhilong et le général Koxinga au XVIIe siècle avant de reconquérir Taïwan.',
    visitingTipsFr: [
      'Arrêtez-vous au phare de Sanyaowan (三囱崖灯塔) pour capturer les vagues frappant les falaises de granit.',
      'Dégustez des fruits de mer fraîchement pêchés (ormeaux, huîtres géantes de Nan’ao, calamars grillés) dans les villages de pêcheurs.',
      'Prévoyez une journée complète en louant une voiture ou un scooter électrique pour faire le tour de l’île.'
    ],
    recommendedDuration: 'Journée complète (5h - 7h)',
    estimatedCostRmb: 0,
    bestTime: 'Journée ensoleillée de mai à octobre pour la clarté des eaux marines',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.7,
        reviewCount: 78000,
        badge: '广东最美海岛之一 (Une des Plus Belles Îles du Sud)',
        highlightQuote: '沿海环岛公路美得心醉，青澳湾水清沙幼，吃现捞海鲜吹海风，无敌享受！(La route côtière est enchanteresse, sable fin et fruits de mer ultra-frais).'
      },
      {
        source: 'xiaohongshu',
        sourceName: 'Xiaohongshu (小红书)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 160000,
        highlightQuote: '北回归线地标拍照打卡，环岛自驾看风车群绝美！(Vue sublime sur les parcs d’éoliennes et l’arche du Tropique du Cancer).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.5,
        reviewCount: 760,
        highlightQuote: 'A refreshing island getaway with lovely sea views, lighthouses, and delicious seafood.'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Île Maritime', 'Tropique du Cancer', 'Plage Qing’ao', 'Parcs à Huîtres']
  },
  {
    id: 'shantou-mixc',
    cityId: 'shantou',
    nameFr: 'Centre Commercial The MixC Shantou (万象城)',
    nameEn: 'The MixC Shantou Luxury Retail & Food Hall',
    nameCn: '汕头万象城',
    pinyin: 'Shàntóu Wànxiàng Chéng',
    cantonesePhonetic: 'Saan-tau Maan-zoeng Sing',
    category: 'mall',
    district: 'Longhu (龙湖区)',
    lat: 23.365453,
    lng: 116.71313,
    metroInfoFr: 'Bus urbains 12, 19, 46 ou 8 min en taxi depuis la gare TGV de Shantou',
    metroInfoEn: 'City Bus 12, 19, 46 or 8 min taxi from Shantou Railway Station',
    addressCn: '汕头市龙湖区金砂东路与长平路交界处万象城',
    image: './assets/images/shantou_mixc_1793294712904.jpg',
    thumbnailAlt: 'Atrium lumineux et fontaines extérieures illuminées du centre commercial The MixC à Shantou',
    descriptionFr: 'Plus grand et plus prestigieux complexe commercial de l’est du Guangdong avec 176 000 m², The MixC Shantou est le cœur vibrant du shopping moderne et de la vie nocturne locale. Conçu avec des verrières monumentales inondées de lumière naturelle et des fontaines dansantes en extérieur, il réunit les grandes enseignes internationales, la première patinoire olympique sur glace de la région (Ice Club) et un immense étage gastronomique réunissant tous les trésors culinaires du Chaoshan revisités dans un décor contemporain.',
    descriptionEn: 'The premier luxury lifestyle shopping hub in Eastern Guangdong. Spanning 176,000 square meters, it houses global fashion flagships, an Olympic-sized indoor ice skating rink, and an expansive Chaoshan gourmet heritage food street.',
    culturalNoteFr: 'Le sous-sol abrite "Nanyang Street", un espace thématisé reproduisant les marchés portuaires d’Asie du Sud-Est où émigraient autrefois les marins de Shantou.',
    visitingTipsFr: [
      'Visitez la zone "Nanyang Memory" au sous-sol pour goûter aux douceurs et cafés nanyang traditionnels.',
      'Parfait pour une après-midi de shopping climatisé avant d’enchaîner avec un banquet de fruits de mer.',
      'Nombreux salons de thé branchés comme Heytea Lab et thés Dancong modernes.'
    ],
    recommendedDuration: '2h - 3h',
    estimatedCostRmb: 0,
    bestTime: 'Après-midi ou soirée (14h00 - 21h30)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 142000,
        badge: '粤东商业天花板 (Sommet Commercial de l’Est)',
        highlightQuote: '汕头最大最繁华的商场，冰场很大，餐饮区几乎涵盖了所有潮汕本土和全国大牌！(Le plus grand mall de Shantou, la patinoire est impressionnante et l’offre gastronomique est gigantesque).'
      },
      {
        source: 'xiaohongshu',
        sourceName: 'Xiaohongshu (小红书)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 175000,
        highlightQuote: '南洋风情街拍照超美，外广场的喷泉夜景很有大都市气息。(L’allée Nanyang est très photogénique, les fontaines extérieures donnent un cachet métropolitain).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.6,
        reviewCount: 680,
        highlightQuote: 'Modern, sparkling clean, impressive selection of restaurants and high-end stores.'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Mall Moderne', 'Patinoire Olympique', 'Nanyang Street', 'Shopping de Prestige']
  },
  {
    id: 'shantou-fuyuan-seafood',
    cityId: 'shantou',
    nameFr: 'Banquet de Fruits de Mer & Échoppe Fuyuan (Michelin)',
    nameEn: 'Fuyuan Chaoshan Seafood Night Market (Michelin Selected)',
    nameCn: '富苑饮食 (富苑大排档)',
    pinyin: 'Fùyuàn Yǐnshí',
    cantonesePhonetic: 'Fu-jyun Jam-sik',
    category: 'restaurant',
    district: 'Longhu (龙湖区)',
    lat: 23.3778,
    lng: 116.71396,
    metroInfoFr: 'Bus urbains 14 ou 28 vers Chaoyang Zhuang, ou 10 min en taxi',
    metroInfoEn: 'City bus to Chaoyang Zhuang or 10 min taxi from central Shantou',
    addressCn: '汕头市龙湖区朝阳庄北区14栋',
    image: './assets/images/shantou_fuyuan_seafood_1793294564458.jpg',
    thumbnailAlt: 'Buffet monumental de crabes marinés, poissons du jour et poissons saumurés de Fuyuan Da Pai Dang',
    descriptionFr: 'Célébré par la série documentaire culinaire "A Bite of China" et récompensé par la sélection Michelin, Fuyuan est le temple ultime de la gastronomie nocturne de Shantou (Da Pai Dang). Dès l’entrée, un étalage à ciel ouvert de plus de 30 mètres de long expose des centaines de plats : le fameux "poison cru" de Chaoshan (crabes bleus et crevettes vivantes marinés à la sauce soja, ail et alcool de riz), poissons de roche étuvés minute (Yufan), oie braisée, coquillages sautés au basilic pourpre et bouillies de riz de minuit (Baimi Zhou).',
    descriptionEn: 'The undisputed Mecca of Chaoshan seafood supper culture, featured in "A Bite of China" and Michelin Selected. A jaw-dropping 30-meter buffet displays raw-marinated blue crabs ("Chaoshan ice cream"), steamed rockfish, and night rice porridge.',
    culturalNoteFr: 'Les Teochew appellent poétiquement leurs crabes et crevettes crus marinés "la glace de Chaoshan" (潮汕冰淇淋) pour la texture soyeuse et fondante de la chair glacée.',
    visitingTipsFr: [
      'Commandez sans faute le crabe cru mariné aux œufs orangés (Shengchao Xie) et accompagnez-le d’un bol de bouillie de riz chaude (Baimizhou) pour équilibrer le yin et le yang.',
      'Désignez simplement du doigt les plats sur le comptoir géant réfrigéré pour commander.',
      'Arrivez vers 17h30 pour choisir les plus beaux poissons ou après 21h30 pour l’ambiance survoltée de nuit.'
    ],
    recommendedDuration: '2h - 2h30',
    estimatedCostRmb: 160,
    bestTime: 'Dîner & Repas de minuit (18h00 - 01h00)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 185000,
        badge: '黑珍珠一钻 & 米其林入选 (Black Pearl & Michelin)',
        highlightQuote: '百米档口琳琅满目太震撼了！生腌膏蟹绝了，蟹膏满满像果冻冰淇淋一样滑嫩鲜甜！(Un comptoir de 100 mètres spectaculaire ! Le crabe cru mariné est un pur nectar aux allures de glace crémeuse).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.8,
        reviewCount: 1120,
        badge: 'Michelin Selected Chaoshan Table',
        highlightQuote: 'The culinary spectacle of a lifetime. The sheer variety and freshness of seafood is unmatched anywhere on Earth.'
      },
      {
        source: 'xiaohongshu',
        sourceName: 'Xiaohongshu (小红书)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 220000,
        highlightQuote: '舌尖上的中国同款，生腌控的终极朝圣地！隆江猪脚和鱼饭也是一绝。(Le pèlerinage ultime des amoureux de fruits de mer et de cuisine Teochew).'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Michelin Selected', 'Crabes Cru Marinés', 'Da Pai Dang', 'Fruits de Mer Chaoshan']
  }
];

export const CHAOZHOU_ATTRACTIONS: Attraction[] = [
  {
    id: 'chaozhou-guangji-bridge',
    cityId: 'chaozhou',
    nameFr: 'Pont Flottant Millénaire de Guangji (Xiangzi)',
    nameEn: 'Guangji Bridge (Xiangzi Ancient Pontoon Bridge)',
    nameCn: '潮州广济桥 (湘子桥)',
    pinyin: 'Cháozhōu Guǎngjì Qiáo',
    cantonesePhonetic: 'Ciu-zau Gwong-zai Kiu',
    category: 'heritage',
    district: 'Xiangqiao (湘桥区)',
    lat: 23.665502,
    lng: 116.649053,
    metroInfoFr: 'Bus urbains 1, 2, 10 vers la porte est de Guangji (Guangji Men) ou taxi depuis la gare',
    metroInfoEn: 'City bus to Guangji Gate or short taxi ride from Chaozhou city center',
    addressCn: '潮州市湘桥区环城东路广济门城楼东侧韩江之上',
    image: './assets/images/chaozhou_guangji_bridge_1793293122927.jpg',
    thumbnailAlt: 'Pavillons anciens sur piles de pierre reliés par le ponton de bateaux en bois de Guangji',
    descriptionFr: 'Érigé en 1174 sous la dynastie des Song du Sud, le pont de Guangji est l’un des quatre ponts anciens les plus célèbres de Chine, aux côtés du pont Zhaozhou et du pont Marco Polo. Enjambant la majestueuse rivière Han, sa conception technique est unique au monde : 24 piles de pierre massives portent d’élégants pavillons en bois à double toit de tuiles vernissées, reliés en leur centre par une section mobile composée de 18 bateaux de bois flottants amarrés les uns aux autres. Chaque jour à 17h30, les bateaux sont détachés pour laisser naviguer les barges fluviales !',
    descriptionEn: 'Built in 1174 AD during the Song Dynasty, Guangji Bridge is an engineering marvel. 24 stone piers topped with ornate wooden pagodas are linked in the middle by a movable pontoon of 18 wooden boats dismantled daily for river traffic.',
    culturalNoteFr: 'Le pont est célèbre pour ses taureaux de fonte protecteurs coulés sous les Qing : la légende raconte que l’un des deux taureaux fut emporté par une crue monstre, donnant naissance au dicton cantonnais "Dix-huit bateaux, deux taureaux et un qui veille".',
    visitingTipsFr: [
      'Assistez à la manœuvre d’ouverture du pont flottant à 17h30 (les bateaux sont déconnectés au son des cornes de brume).',
      'Le spectacle son et lumière nocturne sur les pavillons du pont débute à 20h00 chaque soir.',
      'Billet de 20 RMB pour traverser les pavillons d’artisans sculpteurs et calligraphes.'
    ],
    recommendedDuration: '1h30 - 2h',
    estimatedCostRmb: 20,
    bestTime: 'Fin d’après-midi & Soirée illuminée (16h30 - 20h30)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 112000,
        badge: '中国四大古桥之一 (Un des 4 Grands Ponts de Chine)',
        highlightQuote: '十八梭船廿四洲，一里长桥一里市！下午五点半收船过江太神奇了，夜景灯光秀美轮美奂。(18 bateaux et 24 îles de pierre ! L’ouverture des bateaux à 17h30 est magique, et le spectacle de lumières est féerique).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.8,
        reviewCount: 1850,
        badge: 'Top Cultural Landmark Chaozhou',
        highlightQuote: 'One of the most extraordinary ancient bridges in the world. Walking across the floating boats was magical.'
      },
      {
        source: 'ctrip',
        sourceName: 'Ctrip (携程)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 88000,
        highlightQuote: '潮州必游，宋代桥梁智慧的巅峰杰作。(Chef-d’œuvre incontournable de l’ingénierie Song).'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Pont Flottant Song', '18 Bateaux de Bois', 'Spectacle Son & Lumière', 'Rivière Han']
  },
  {
    id: 'chaozhou-paifang-street',
    cityId: 'chaozhou',
    nameFr: 'Rue des Portiques Anciens (Paifang Street)',
    nameEn: 'Chaozhou Paifang Street (Archway Street)',
    nameCn: '潮州牌坊街',
    pinyin: 'Cháozhōu Páifāng Jiē',
    cantonesePhonetic: 'Ciu-zau Paai-fong Gaai',
    category: 'heritage',
    district: 'Xiangqiao (湘桥区)',
    lat: 23.664454,
    lng: 116.645261,
    metroInfoFr: 'À 3 minutes à pied de la porte de Guangji ou accès par Taiping Road',
    metroInfoEn: '3 minutes walk west from Guangji Gate Tower along Taiping Road',
    addressCn: '潮州市湘桥区太平路牌坊街',
    image: './assets/images/chaozhou_paifang_1793294727841.jpg',
    thumbnailAlt: 'Portiques monumentaux en granit gravé et salons de thé de Paifang Street à Chaozhou',
    descriptionFr: 'Véritable musée d’histoire à ciel ouvert, la rue Paifang rassemble la plus grande concentration d’arcs de triomphe en pierre sculptée de Chine, avec 22 portiques monumentaux érigés sous les dynasties Ming et Qing. Chaque portique honore un érudit impérial, un grand ministre ou un magistrat incorruptible originaire de Chaozhou. Sous les arcades Qilou ombragées fleurissent les ateliers d’artisanat d’art (broderie de Chaozhou, poteries en terre pourpre, céramiques délicates) et les salons de thé réputés.',
    descriptionEn: 'China’s premier historical archway street, boasting 22 monumental Ming and Qing dynasty carved stone triumphal arches honoring imperial scholars. Flanked by Teochew embroidery masters, woodcarvers, and Gongfu tearooms.',
    culturalNoteFr: 'Chaque portique raconte une devise morale confucéenne, comme l’arche "Zhuangyuan" récompensant le premier lauréat des concours impériaux nationaux.',
    visitingTipsFr: [
      'Arrêtez-vous dans un salon de thé historique comme Zaiyang Tea House (载阳茶馆) pour assister à une démonstration de thé Gongfu.',
      'Dégustez les galeries d’omelettes aux huîtres fraîches (Haojian) et les gâteaux de canard aux herbes (Yamu Nian).',
      'Accès totalement libre et gratuit 24h/24.'
    ],
    recommendedDuration: '2h - 3h',
    estimatedCostRmb: 0,
    bestTime: 'Fin d’après-midi et soirée (16h00 - 21h30)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 135000,
        badge: '国家级旅游休闲街区 (Quartier Historique National)',
        highlightQuote: '二十二座明清牌坊气势恢宏！一边逛非遗手作，一边叹工夫茶，满满的古城烟火气。(22 portiques grandioses, du thé Gongfu et de l’artisanat d’art dans une atmosphère médiévale vivante).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.7,
        reviewCount: 1450,
        highlightQuote: 'Lively, beautifully restored historical street. The stone archways are magnificent works of art.'
      },
      {
        source: 'xiaohongshu',
        sourceName: 'Xiaohongshu (小红书)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 210000,
        highlightQuote: '潮州必走老街，载阳茶馆听潮剧喝工夫茶，氛围感绝绝子。(Le passage obligé, opéra Teochew et thé au pavillon Zaiyang).'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['22 Portiques de Granit', 'Thé Gongfu', 'Broderie Teochew', 'Omelette aux Huîtres']
  },
  {
    id: 'chaozhou-kaiyuan-temple',
    cityId: 'chaozhou',
    nameFr: 'Temple Ancien de Kaiyuan (Dynastie Tang 738)',
    nameEn: 'Kaiyuan Buddhist Temple (Tang Dynasty 738 AD)',
    nameCn: '潮州开元寺',
    pinyin: 'Cháozhōu Kāiyuán Sì',
    cantonesePhonetic: 'Ciu-zau Hoi-jyun Zi',
    category: 'heritage',
    district: 'Xiangqiao (湘桥区)',
    lat: 23.665992,
    lng: 116.644691,
    metroInfoFr: 'Au cœur de la rue Paifang (Taiping Road), accessible à pied',
    metroInfoEn: 'Located directly off Paifang Street (Taiping Road), walking distance',
    addressCn: '潮州市湘桥区开元路32号',
    image: './assets/images/chaozhou_kaiyuan_1793294728399.jpg',
    thumbnailAlt: 'Toits en tuiles dorées, banyans sacrés et pavillons du temple bouddhiste Kaiyuan à Chaozhou',
    descriptionFr: 'Fondé en 738 sous le règne de l’empereur Tang Xuanzong, le temple Kaiyuan est le sanctuaire bouddhiste le plus vénérable du Guangdong oriental. Préservé au fil de treize siècles, il conserve un clocher en bronze de la dynastie Song, des colonnes de pierre gravées de sutras de la dynastie Tang et de splendides bas-reliefs en bois doré. Les fidèles y viennent brûler de l’encens sous des banyans séculaires dans une ferveur paisible et intemporelle.',
    descriptionEn: 'Founded in 738 AD during the Tang Dynasty, Kaiyuan Temple is one of eastern Guangdong’s premier Buddhist sanctuaries, home to Song dynasty bronze bells, Tang stone pagodas, and lush ancient courtyards.',
    culturalNoteFr: 'Son architecture mêle la sobriété solennelle de la dynastie Tang aux raffinements des toitures à incrustations de porcelaine brisée (Qianci) caractéristiques de Chaozhou.',
    visitingTipsFr: [
      'Admirez les sculptures sur bois doré représentant des scènes du canon bouddhiste au plafond du hall Mahavira.',
      'Dégustez un repas végétarien traditionnel bouddhiste préparé au réfectoire du temple à midi.',
      'Entrée entièrement gratuite ; respectez le silence et le recueillement des fidèles.'
    ],
    recommendedDuration: '1h - 1h30',
    estimatedCostRmb: 0,
    bestTime: 'Matinée paisible (08h30 - 11h00)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 68000,
        badge: '粤东第一古刹 (Premier Temple Ancien de l’Est)',
        highlightQuote: '唐代开元年间的千年古刹，香火鼎盛，红墙古树特别清净安宁。(Un sanctuaire millénaire Tang d’une sérénité absolue sous les vieux arbres sacrés).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.6,
        reviewCount: 920,
        highlightQuote: 'Tranquil Tang dynasty Buddhist temple right in the heart of town. Free entry and lovely architecture.'
      },
      {
        source: 'ctrip',
        sourceName: 'Ctrip (携程)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 45000,
        highlightQuote: '建筑精美，宋代大铜钟与唐代经幢历史厚重。(Architecture exquise et vestiges Tang et Song empreints de solennité).'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Sanctuaire Tang 738', 'Cloche de Bronze Song', 'Sculpture sur Bois Doré', 'Bouddhisme Zen']
  },
  {
    id: 'chaozhou-gongfu-tea',
    cityId: 'chaozhou',
    nameFr: 'Art du Thé Gongfu de Chaozhou (Fenghuang Dancong)',
    nameEn: 'Chaozhou Gongfu Tea Ceremony (Dancong Oolong)',
    nameCn: '潮州工夫茶艺 (凤凰单丛茶)',
    pinyin: 'Cháozhōu Gōngfuchá',
    cantonesePhonetic: 'Ciu-zau Gung-fu Caa',
    category: 'food',
    district: 'Xiangqiao (湘桥区)',
    lat: 23.6652,
    lng: 116.6445,
    metroInfoFr: 'Dans tous les salons de thé traditionnels de Paifang Street (ex: Zaiyang, Mingxin)',
    metroInfoEn: 'Available in historic tearooms throughout Paifang Street and Han River banks',
    addressCn: '潮州市湘桥区太平路义井巷载阳茶馆',
    image: './assets/images/chaozhou_tea_1793294729279.jpg',
    thumbnailAlt: 'Petites tasses en porcelaine blanche et théière d’argile Yixing pour le thé Gongfu de Chaozhou',
    descriptionFr: 'Inscrit sur la liste représentative du patrimoine culturel immatériel de l’humanité par l’UNESCO, l’art du thé Gongfu de Chaozhou est la source originelle de toutes les cérémonies du thé en Asie. Ici, le thé n’est pas bu pour se désaltérer, mais "goûté" avec respect. Le rituel utilise les prestigieux thés Oolong des monts Fenghuang (Dancong) aux arômes naturels d’orchidée, de miel et de fleur d’osmanthus. La préparation obéit à 21 étapes codifiées : eau bouillante versée d’un geste haut, versement circulaire rapide ("Guan Gong巡城") et goutte finale salvatrice ("Han Xin点兵").',
    descriptionEn: 'Recognized by UNESCO as Intangible Cultural Heritage, Chaozhou Gongfu Tea is the cradle of Chinese tea ceremony. Brewed in miniature clay pots using Fenghuang Dancong oolong leaves, the 21-step ritual yields nectar-like orchid aromas.',
    culturalNoteFr: 'Les trois tasses disposées en triangle symbolisent les trois vertus d’amitié et d’harmonie ("Pin" 品). On tient la tasse minuscule avec le pouce et l’index comme une grue tenant une perle.',
    visitingTipsFr: [
      'Prenez place dans une cour intérieure de salon de thé pour écouter les maîtres t чай vous conter les arômes Mi Lan Xiang (miel & orchidée) ou Ya Shi Xiang (arôme d’amande sauvage).',
      'Accompagnez votre dégustation de douceurs locales : gâteaux croustillants Fulao Bing ou fruits confits au cédrat de bergamote (Foshou Guo).',
      'Une expérience de lenteur et de raffinement inoubliable.'
    ],
    recommendedDuration: '1h30 - 2h',
    estimatedCostRmb: 68,
    bestTime: 'Après-midi paisible (14h00 - 17h30)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 42000,
        badge: '非遗文化活化石 (Fossile Vivant UNESCO)',
        highlightQuote: '凤凰单丛鸭屎香香气扑鼻，听着古琴慢悠悠品三道茶，这才是潮州最地道的生活方式！(Le parfum d’orchidée du Dancong est enivrant, déguster trois tasses au son du Guqin est l’essence de Chaozhou).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.8,
        reviewCount: 780,
        highlightQuote: 'A mesmerizing tea ceremony. The complexity of flavors in the Dancong oolong was a revelation.'
      },
      {
        source: 'xiaohongshu',
        sourceName: 'Xiaohongshu (小红书)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 86000,
        highlightQuote: '来潮州一定要体验载阳茶馆的工夫茶，配上潮式茶点，整个人都静下来了。(L’expérience ultime de thé à Chaozhou, sérénité garantie).'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Thé UNESCO', 'Fenghuang Dancong', 'Art de Vivre', '21 Étapes Sacrées']
  },
  {
    id: 'chaozhou-live-opera',
    cityId: 'chaozhou',
    nameFr: 'Opéra Vivant de Chaozhou & Scène du Fleuve Han',
    nameEn: 'Live Teochew Opera & Han River Folk Stage',
    nameCn: '潮剧古城实景戏台 (载阳茶馆 / 广济门实景演出)',
    pinyin: 'Cháojù Shíjǐng Xìtái',
    cantonesePhonetic: 'Ciu-kek Sat-ging Hei-toi',
    category: 'event',
    district: 'Xiangqiao (湘桥区)',
    lat: 23.6658,
    lng: 116.645,
    metroInfoFr: 'Au pavillon Zaiyang Tea House (Rue Paifang) et esplanade de la Porte Guangji',
    metroInfoEn: 'At Zaiyang Tea House Stage (Paifang St) and Guangji Gate Riverfront Stage',
    addressCn: '潮州市湘桥区环城东路广济门外沿江舞台',
    image: './assets/images/chaozhou_live_teochew_opera_1793294564378.jpg',
    thumbnailAlt: 'Comédiens en costumes d’apparat et coiffes brodées de l’opéra Teochew sur scène traditionnelle',
    descriptionFr: 'Vieux de plus de 450 ans et chanté dans l’une des plus anciennes langues parlées de Chine (l’idiome archaïque des plaines centrales), l’opéra de Chaozhou (Chaoju) est un art scénique envoûtant inscrit au patrimoine culturel immatériel mondial de l’UNESCO. Vêtus de somptueux costumes de soie lourdement brodés d’or et coiffés de tiares ornées de perles étincelantes, les comédiens déclament des contes d’amour et de bravoure rythmés par le son nostalgique de la viole Erxian et des tambours de bronze. Des représentations intimistes ont lieu dans les salons de thé traditionnels de Paifang Street et sur la scène fluviale de Guangji.',
    descriptionEn: 'Recognized by UNESCO, Teochew Opera is one of China’s oldest theatrical art forms sung in the ancient Minnan-Teochew vernacular. Master performers in elaborate embroidered silk robes and feathered headdresses enact folk epics accompanied by the melancholic Erxian fiddle.',
    culturalNoteFr: 'L’opéra de Chaozhou utilise un registre vocal de fausset unique et des mouvements de manches d’eau ("Shuixiu") considérés comme le pinacle de la poésie gestuelle classique chinoise.',
    visitingTipsFr: [
      'Prenez place à la tombée du soir dans un salon de thé historique pour écouter les arias tout en sirotant un thé Dancong fumant.',
      'Les samedis et dimanches après-midi, des troupes folkloriques amatrices chantent gratuitement sous les portiques de pierre.',
      'Possibilité de se faire maquiller et costumer en comédien d’opéra pour des photos souvenirs insolites.'
    ],
    recommendedDuration: '1h30 - 2h',
    estimatedCostRmb: 50,
    bestTime: 'Soirée (19h30 - 21h30)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 38000,
        badge: '非遗戏曲活化石 (Fossile Scénique UNESCO)',
        highlightQuote: '唱腔婉转优美，二弦一响整个人都被吸引进去了，配上红木八仙桌和工夫茶，太有古意了！(Le chant est d’une grâce infinie, la viole Erxian vous transporte hors du temps dans le salon de thé).'
      },
      {
        source: 'xiaohongshu',
        sourceName: 'Xiaohongshu (小红书)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 65000,
        badge: '潮州必体验非遗 (Expérience Incontournable)',
        highlightQuote: '水袖翻飞美不胜收！近距离看戏曲演员的身段和刺绣戏服，太震撼了。(Le jeu des manches d’eau est sublime, les broderies des costumes sont un choc visuel).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.7,
        reviewCount: 520,
        highlightQuote: 'Enchanting musical performance. Even without understanding the dialect, the emotion and visuals are extraordinary.'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Opéra UNESCO', 'Costumes de Soie', 'Erxian Fiddle', 'Spectacle Vivant']
  },
  {
    id: 'chaozhou-goose-banquet',
    cityId: 'chaozhou',
    nameFr: 'Festin d’Oie à Tête de Lion de Chaozhou (Courtyard)',
    nameEn: 'Chaozhou Braised Lion-Head Goose Heritage Banquet',
    nameCn: '潮州百年老宅卤鹅盛宴 (阿銮卤鹅 / 溪口经典)',
    pinyin: 'Cháozhōu Lǔ’é Shèngyàn',
    cantonesePhonetic: 'Ciu-zau Lou-ngo Sing-jin',
    category: 'restaurant',
    district: 'Xiangqiao (湘桥区)',
    lat: 23.6668,
    lng: 116.644,
    metroInfoFr: 'Au cœur de la vieille ville de Chaozhou, venelles près de West Lake Park',
    metroInfoEn: 'Historic Old Town Alleyway courtyard dining near West Lake Park',
    addressCn: '潮州市湘桥区西马路古巷老四合院',
    image: './assets/images/chaozhou_goose_1793294744410.jpg',
    thumbnailAlt: 'Grand plat traditionnel d’oie à tête de lion braisée au jus d’épices servi dans une cour chinoise',
    descriptionFr: 'Emblème incontesté de la haute gastronomie de Chaozhou ("Sans oie, pas de banquet" - 无鹅不成宴), l’oie à tête de lion (Shitou E) est la plus grande race d’oie au monde, pouvant peser jusqu’à 15 kg. Mijotée longuement dans un chaudron d’argile avec une marinade secrète transmise de génération en génération (composée de plus de 20 épices précieuses : galanga du Chaoshan, anis étoilé, cannelle de Chine, vin de riz et sucre candi), la chair d’oie acquiert une couleur acajou luisante et un parfum suave irrésistible. Le plat signature réunit tranches de magret fondant, peau croustillante, foie d’oie onctueux (comparé au foie gras français) et tofu saumuré.',
    descriptionEn: 'The pride of Teochew banqueting culture. The colossal indigenous lion-head goose is slowly braised in a multi-spice master stock of galangal, star anise, and aged rice wine, served with tender meat, succulent skin, and silky goose liver.',
    culturalNoteFr: 'Le foie d’oie braisé de Chaozhou (Fen Gan) est réputé chez les critiques gastronomiques comme supérieur au foie gras occidental pour son onctuosité soyeuse sans aucune sensation grasse.',
    visitingTipsFr: [
      'Commandez l’assiette "Cinq Trésors" (Wubao) : filet de magret, cuisse charnue, foie gras soyeux, gésier croquant et tofu braisé.',
      'Trempez chaque bouchée dans le vinaigre blanc à l’ail écrasé (Suanni Bai Cu) pour équilibrer la richesse aromatique du jus de braisage.',
      'Installez-vous dans la cour intérieure pavée de dalles de granit sous les lampions rouges pour un voyage culinaire hors du temps.'
    ],
    recommendedDuration: '1h30 - 2h',
    estimatedCostRmb: 95,
    bestTime: 'Déjeuner ou Dîner traditionnel (11h45 ou 18h00)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 92000,
        badge: '潮州卤味排行榜榜首 (N°1 Rôtisserie & Braisage)',
        highlightQuote: '无鹅不成席！鹅肉卤得透心香，鹅肝更是入口即化，比法国鹅肝还绝，蒜泥白醋蘸汁解腻提鲜绝配！(La viande est imprégnée d’arômes et le foie d’oie fond sur la langue, un pur chef-d’œuvre avec le vinaigre d’ail).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.8,
        reviewCount: 960,
        badge: 'Foodie Pilgrimage Top Pick',
        highlightQuote: 'Mind-blowing flavor. The braised goose liver and herbal spice broth are worth traveling to China for.'
      },
      {
        source: 'xiaohongshu',
        sourceName: 'Xiaohongshu (小红书)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 130000,
        highlightQuote: '在古厝四合院里吃卤鹅，配一壶凤凰单丛茶，这才是神仙过的日子！(Déguster l’oie braisée dans une cour traditionnelle avec un thé Dancong : la vie des dieux !).'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Oie à Tête de Lion', 'Haute Gastronomie Teochew', 'Foie d’Oie Braisé', 'Cour Ancestrale']
  },
  {
    id: 'orange-hotel-chaozhou',
    cityId: 'chaozhou',
    nameFr: 'Hôtel Orange Chaozhou (Route Cixing / Centre de la Fortune)',
    nameEn: 'Orange Hotel Chaozhou Fortune Center (Cixing Road)',
    nameCn: '桔子酒店 (潮州财富中心店)',
    pinyin: 'Júzi Jiǔdiàn (Cháozhōu Cáifù Zhōngxīn Diàn)',
    cantonesePhonetic: 'Gwat-zi Zau-dim',
    category: 'hotel',
    district: 'Chao’an (潮安区 / 枫溪)',
    lat: 23.6565,
    lng: 116.6062,
    metroInfoFr: 'À 8 min en taxi de la gare TGV de Chaozhou (高铁潮州站) ou bus urbain K2 arrêt Fengxi / Cixing Road',
    metroInfoEn: '8 min taxi from Chaozhou Railway Station or city bus K2 to Fengxi / Cixing Road',
    addressCn: '潮州市潮安区瓷兴路1号雄英大厦 (桔子酒店潮州财富中心店)',
    image: './assets/images/orange_hotel_chaozhou_1793352768687.jpg',
    thumbnailAlt: 'Façade contemporaine de l’Hôtel Orange sur la route Cixing à l’angle de l’immeuble Xiongying et du Centre de la Fortune à Chaozhou',
    descriptionFr: 'Situé au numéro 1 de la route Cixing (Cixing Road / 瓷兴路) dans l’immeuble Xiongying, en plein cœur du pôle économique Fortune Center et du berceau artisanal de la céramique de Chaozhou, l’Hôtel Orange (groupe Huazhu) séduit par son design contemporain énergique aux touches d’agrumes californiens. L’établissement propose des chambres insonorisées grand confort avec literie ergonomique de luxe, domotique intelligente, salon de café, salle de fitness et un buffet de petit-déjeuner généreux mettant à l’honneur les soupes de nouilles locales et bouchées de Chaoshan. Son emplacement privilégié sur la route Cixing offre une liaison rapide vers la gare TGV et le centre historique de Paifang.',
    descriptionEn: 'Located at No. 1 Cixing Road in the Xiongying Building at Chaozhou Fortune Center, Orange Hotel features vibrant modern guestrooms, smart amenities, a fitness room, and an authentic Chaoshan breakfast buffet with easy access to high-speed rail and ceramics districts.',
    culturalNoteFr: 'La route Cixing (瓷兴路, "Voie de la Renaissance Céramique") traverse le district de Fengxi, capitale historique de la porcelaine et des arts de la table de Chaozhou exportés à travers le monde.',
    visitingTipsFr: [
      'Emplacement stratégique sur la route Cixing pour découvrir les ateliers de céramique de Fengxi et rejoindre rapidement la vieille ville.',
      'Le petit-déjeuner buffet propose des spécialités chaudes teochew (soupe de boulettes de bœuf, galettes aux herbes et thé Dancong).',
      'Chambres équipées d’enceintes connectées et service de livraison d’étage par robot automatisé.'
    ],
    recommendedDuration: 'Séjour & Nuitée',
    estimatedCostRmb: 330,
    bestTime: 'Enregistrement dès 14h / Idéal pour séjours touristiques et d’affaires à Chaozhou',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 38000,
        badge: '潮州品质商务热门酒店 (Hôtel Prisé Qualité & Confort)',
        highlightQuote: '瓷兴路位置极佳，就在财富中心雄英大厦，房间设施非常新而且智能化，桔子特有的香气很治愈，早餐牛肉粿条很好吃！(Emplacement idéal sur Cixing Road dans l’immeuble Xiongying, équipements neufs et intelligents, délicieux petit-déjeuner).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.7,
        reviewCount: 610,
        badge: 'Top Modern Comfort Choice',
        highlightQuote: 'Clean, modern, and super comfortable. Great staff, delicious local breakfast and high-tech robot service.'
      },
      {
        source: 'ctrip',
        sourceName: 'Ctrip (携程)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 68000,
        badge: '金牌品质口碑酒店 (Qualité d’Hébergement Recommandée)',
        highlightQuote: '入住体验满分，前台热情，停车方便，去高铁站和古城都很顺路，值得强烈推荐！(Expérience de séjour parfaite, service chaleureux, accès rapide à la gare et à la vieille ville).'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Hôtel', 'Route Cixing', 'Centre de la Fortune', 'Chao’an', 'Design Moderne']
  }
];

// Combined attractions across all 4 cities
export const ALL_ATTRACTIONS: Attraction[] = [
  ...GUANGZHOU_ATTRACTIONS.map(a => ({ ...a, cityId: 'guangzhou' as CityId })),
  ...SHENZHEN_ATTRACTIONS,
  ...SHANTOU_ATTRACTIONS,
  ...CHAOZHOU_ATTRACTIONS,
];
