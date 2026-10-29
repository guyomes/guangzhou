import { Attraction } from '../types/travel';

const RAW_GUANGZHOU_ATTRACTIONS: any[] = [
  {
    id: 'canton-tower',
    cityId: 'guangzhou',
    nameFr: 'Tour de Canton',
    nameEn: 'Canton Tower',
    nameCn: '广州塔',
    pinyin: 'Guǎngzhōu Tǎ',
    cantonesePhonetic: 'Gwong-zau Taap',
    category: 'modern',
    district: 'Haizhu (海珠区)',
    lat: 23.1065,
    lng: 113.3245,
    metroInfoFr: 'Métro Ligne 3 ou Ligne APM, Station Canton Tower, Sortie A',
    metroInfoEn: 'Metro Line 3 or APM Line, Canton Tower Station, Exit A',
    addressCn: '广州市海珠区阅江西路222号',
    image: '/src/assets/images/canton_tower_night_1793290740500.jpg',
    thumbnailAlt: 'Tour de Canton illuminée de nuit au bord de la Rivière des Perles',
    descriptionFr: 'Symbole vertigineux du renouveau architectural de Guangzhou, la Tour de Canton s’élance à 600 mètres de hauteur avec sa silhouette torsadée caractéristique surnommée affectueusement "Xiao Man Yao" (taille de guêpe). De nuit, son jeu de lumières LED irisé dialogue avec les gratte-ciel scintillants de Zhujiang New Town. Les terrasses sommitales abritent la plus haute grande roue horizontale du monde (Bubble Tram) et offrent un panorama saisissant sur le delta de la Rivière des Perles.',
    descriptionEn: 'The defining modern landmark of Guangzhou, Canton Tower stands 600 meters tall with a distinctive twisted hyperboloid lattice frame affectionately called "slim waist". At night, dazzling LED illumination reflects off the Pearl River opposite Zhujiang New Town.',
    culturalNoteFr: 'Conçue par les architectes Mark Hemel et Barbara Kuit, sa forme fluide rend hommage à la grâce des silhouettes féminines traditionnelles du Lingnan.',
    visitingTipsFr: [
      'Montez vers 17h30 pour capturer à la fois la lumière dorée du crépuscule et l’illumination nocturne de 19h00.',
      'Le Bubble Tram au sommet (450m) tourne lentement en bordure du vide : frissons et photos inoubliables garantis.',
      'Réservez votre billet horodaté la veille pour éviter jusqu’à deux heures de file d’attente le week-end.'
    ],
    recommendedDuration: '2h - 3h',
    estimatedCostRmb: 150,
    bestTime: 'Coucher de soleil & Nuit (18h00 - 21h30)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 142000,
        badge: '必打卡榜 (Incontournable)',
        highlightQuote: '夜景绝美，坐摩天轮俯瞰整个广州珠江两岸，浪漫至极！(La vue nocturne est sublime, le Bubble Tram surplombant la rivière est un romantisme absolu).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.6,
        reviewCount: 6850,
        badge: 'Travelers’ Choice Best of the Best',
        highlightQuote: 'Engineering marvel with breathtaking 360-degree city views. Better than the Oriental Pearl in Shanghai.'
      },
      {
        source: 'google',
        sourceName: 'Google Maps',
        sourceType: 'western',
        score: 4.7,
        reviewCount: 9200,
        highlightQuote: 'Spectacular light show every evening. The promenade along the Pearl River is just as enjoyable as going up.'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Architecture', 'Vue Panoramique', 'Rivière des Perles', 'Photographie Nocturne']
  },
  {
    id: 'chen-clan-ancestral-hall',
    nameFr: 'Temple ancestral du clan Chen (Académie Chen)',
    nameEn: 'Chen Clan Ancestral Hall',
    nameCn: '陈家祠 (陈氏书院)',
    pinyin: 'Chén Jiā Cí',
    cantonesePhonetic: 'Can Gaa Ci',
    category: 'heritage',
    district: 'Liwan (荔湾区)',
    lat: 23.1281,
    lng: 113.2458,
    metroInfoFr: 'Métro Ligne 1 ou Ligne 8, Station Chen Clan Academy, Sortie D',
    metroInfoEn: 'Metro Line 1 or Line 8, Chen Clan Academy Station, Exit D',
    addressCn: '广州市荔湾区中山七路恩龙里34号',
    image: '/src/assets/images/chen_clan_ancestral_hall_1793290741668.jpg',
    thumbnailAlt: 'Façade ornée et sculptures sur faîtière du temple du clan Chen',
    descriptionFr: 'Érigé en 1894 sous la dynastie Qing par les membres de la famille Chen de 72 comtés du Guangdong, ce complexe somptueux est le chef-d’œuvre absolu de l’architecture Lingnan. Composé de 19 bâtiments reliés par d’harmonieuses cours intérieures pavées de granit, il impressionne par sa profusion décorative : faîtières en céramique polychrome de Shiwan, bas-reliefs en bois précieux sculpté, bronzes fondus et délicates dentelles de briques grises. Il abrite aujourd’hui le Musée d’Art Folklorique du Guangdong.',
    descriptionEn: 'Built in 1894 during the late Qing dynasty, Chen Clan Academy is the pinnacle of Lingnan folk architecture. Featuring 19 halls connected by tranquil courtyards, it is renowned for intricate wood, stone, brick carvings, and Shiwan ceramic roof ridges.',
    culturalNoteFr: 'Les faîtières narrent des légendes classiques chinoises comme "L’Investiture des Dieux". Aucun centimètre carré de corniche n’est laissé sans sculpture symbolisant prospérité et longévité.',
    visitingTipsFr: [
      'Levez les yeux dès l’entrée pour observer les figurines en céramique vernissée bravant le ciel cantonnais.',
      'Visitez les galeries de broderie de Canton (Guangxiu) et de sculptures sur ivoire végétal.',
      'Tarif modique de 10 RMB, gratuit pour les plus de 65 ans. Prévoyez votre passeport pour le contrôle d’accès.'
    ],
    recommendedDuration: '1h30 - 2h',
    estimatedCostRmb: 10,
    bestTime: 'Matinée (09h00 - 11h30) pour la douce lumière dans les cours',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 98000,
        badge: '岭南建筑第一名 (N°1 Patrimoine Lingnan)',
        highlightQuote: '三雕一彩一绣集大成者，砖雕木雕巧夺天工，每次带朋友来都叹为观止！(Le summum des arts décoratifs cantonais, chaque détail de sculpture est un miracle d’orfèvrerie).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.7,
        reviewCount: 4200,
        badge: 'N°1 Attraction Culturelle à Guangzhou',
        highlightQuote: 'Stunning preservation. If you only visit one cultural site in Guangzhou, make it this one.'
      },
      {
        source: 'ctrip',
        sourceName: 'Ctrip (携程)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 65000,
        highlightQuote: '门票十块钱良心之作，岭南文化活化石。(Un billet à 10 yuans d’une générosité rare, un fossile vivant de la culture cantonaise).'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Patrimoine Qing', 'Sculptures sur Bois', 'Céramique de Shiwan', 'Artisanat Lingnan']
  },
  {
    id: 'shamian-island',
    nameFr: 'Île de Shamian',
    nameEn: 'Shamian Island',
    nameCn: '沙面岛',
    pinyin: 'Shāmiàn Dǎo',
    cantonesePhonetic: 'Saa-min Dou',
    category: 'heritage',
    district: 'Liwan (荔湾区)',
    lat: 23.1098,
    lng: 113.2435,
    metroInfoFr: 'Métro Ligne 1 ou Ligne 6, Station Huangsha, Sortie F (traverser la passerelle)',
    metroInfoEn: 'Metro Line 1 or Line 6, Huangsha Station, Exit F (cross pedestrian overpass)',
    addressCn: '广州市荔湾区沙面北街',
    image: '/src/assets/images/shamian_island_street_1793290742700.jpg',
    thumbnailAlt: 'Allée arborée de banyans centenaires et demeures coloniales de Shamian',
    descriptionFr: 'Véritable oasis de quiétude protégée par les eaux de la Rivière des Perles, l’île de Shamian fut concédée aux puissances britannique et française au XIXe siècle à la suite des guerres de l’opium. Aujourd’hui entièrement piétonne, l’île déploie un ensemble unique de plus de 150 édifices néoclassiques, baroques et coloniaux, ombragés par de gigantesques banyans séculaires aux racines aériennes plongeantes. L’église Notre-Dame des Victoires et l’ancienne banque d’Indochine témoignent des liens historiques avec la France.',
    descriptionEn: 'A tranquil sandbank island granted as British and French concessions in the 19th century. Pedestrianized streets feature over 150 European colonial buildings, grand century-old banyan trees, riverside cafes, and historic chapels.',
    culturalNoteFr: 'Shamian ("face de sable") fut un avant-poste crucial du commerce de la soie et du thé sur la Route Maritime de la Soie bien avant les concessions.',
    visitingTipsFr: [
      'Promenez-vous tôt le matin pour observer les locaux pratiquer le Tai-chi sous les frondaisons centenaires.',
      'Faites une pause café sur la terrasse ombragée de l’ancien consulat ou de l’Hôtel White Swan, pionnier de l’hôtellerie 5 étoiles en Chine.',
      'Accès totalement libre et gratuit 24h/24.'
    ],
    recommendedDuration: '2h - 3h',
    estimatedCostRmb: 0,
    bestTime: 'Matin ou Fin d’après-midi pour la lumière filtrée des arbres',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.7,
        reviewCount: 118000,
        badge: '广州散步漫游榜 (Top Balade Piétonne)',
        highlightQuote: '古树参天，欧式建筑很有情调，白天拍照出片，晚上吹着江风喝咖啡特别惬意。(Des arbres centenaires majestueux, une architecture pleine de charme et une brise fluviale délicieuse).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.6,
        reviewCount: 5120,
        badge: 'Top Choice Guangzhou Walk',
        highlightQuote: 'A peaceful, shaded retreat from modern skyscrapers. Fascinating colonial history and pleasant gardens.'
      },
      {
        source: 'xiaohongshu',
        sourceName: 'Xiaohongshu (小红书)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 89000,
        highlightQuote: '法式复古胶片感拉满，随手一拍就是电影画面。(Ambiance cinéma rétro français assurée, chaque recoin est un cliché de film).'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Concessions Historiques', 'Banyans Centenaires', 'Flânerie', 'Patrimoine Franco-Britannique']
  },
  {
    id: 'cantonese-dimsum-yumcha',
    nameFr: 'Tradition du Yum Cha & Dim Sum (Taotaoju / Panxi)',
    nameEn: 'Cantonese Morning Yum Cha Dim Sum Culture',
    nameCn: '广府早茶点心 (陶陶居 / 泮溪酒家)',
    pinyin: 'Guǎngfǔ Zǎochá Diǎnxīn',
    cantonesePhonetic: 'Zou-caa Dim-sam',
    category: 'food',
    district: 'Liwan & Yuexiu (荔湾与越秀区)',
    lat: 23.1182,
    lng: 113.2421,
    metroInfoFr: 'Métro Ligne 1, Station Changshou Lu, Sortie D (vers Shangxiajiu / Taotaoju)',
    metroInfoEn: 'Metro Line 1, Changshou Road Station, Exit D',
    addressCn: '广州市荔湾区第十甫路20号 (陶陶居总店)',
    image: '/src/assets/images/cantonese_dimsum_table_1793290742674.jpg',
    thumbnailAlt: 'Table garnie de paniers en bambou avec raviolis Har Gow et théière cantonaise',
    descriptionFr: 'À Guangzhou, la gastronomie n’est pas qu’un art, c’est une philosophie incarnée par le proverbe "Manger à Canton" (食在广州). Le rituel matinal du Yum Cha ("boire le thé") réunit familles et amis autour de théières fumantes de Pu-erh ou Tieguanyin et de paniers vapeur tressés en bambou. Dégustez les "Quatre Rois Célestes" de la table cantonaise : les Har Gow (translucides raviolis aux crevettes croquantes), les Siu Mai au porc et crabe, les Char Siu Bao briochés et les tartelettes feuilletées aux œufs.',
    descriptionEn: 'The heartbeat of Guangzhou culinary culture. Morning Yum Cha ("drink tea") is a leisurely social institution where delicate bamboo baskets steam with crystal shrimp dumplings, siu mai pork dumplings, and silky rice rolls.',
    culturalNoteFr: 'Lorsque quelqu’un vous ressert du thé, tapotez deux doigts sur la table en signe de remerciement silencieux — une coutume née de la légende de l’empereur Qianlong incognito.',
    visitingTipsFr: [
      'Taotaoju (fondé en 1880) sur la rue Di Shifu offre le cadre le plus authentique avec ses vitraux mandchous.',
      'Panxi Restaurant au bord du lac Liwan propose un cadre féerique de jardin traditionnel Lingnan avec pontons sur l’eau.',
      'Arrivez avant 08h30 pour éviter le ticket d’attente ou après 13h00 pour un thé de l’après-midi plus paisible.'
    ],
    recommendedDuration: '2h',
    estimatedCostRmb: 85,
    bestTime: 'Matinée (08h00 - 11h00) ou Déjeuner',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 220000,
        badge: '必吃榜常客 (Palmarès Gastronomique Culinaire)',
        highlightQuote: '一盅两件，叹茶叹人生。虾饺皮薄如蝉翼，虾仁弹牙爽脆！(Une tasse de thé et deux douceurs : voilà la saveur de la vie. Des crevettes d’une fraîcheur remarquable).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.8,
        reviewCount: 3100,
        badge: 'Culinary Bucket List Must-Do',
        highlightQuote: 'The best dim sum experience on earth. Nothing in Hong Kong or London compares to fresh Guangzhou yum cha.'
      },
      {
        source: 'ctrip',
        sourceName: 'Ctrip (携程)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 78000,
        highlightQuote: '百年老字号，地道广府味，点心现点现蒸。(Maison centenaire aux saveurs cantonaises intemporelles, paniers étuvés minute).'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Gastronomie Cantonaise', 'Yum Cha', 'Étoile Gourmande', 'Art de Vivre']
  },
  {
    id: 'dongshankou',
    nameFr: 'Quartier historique de Dongshankou',
    nameEn: 'Dongshankou Historic Villa & Art District',
    nameCn: '东山口历史街区',
    pinyin: 'Dōngshānkǒu',
    cantonesePhonetic: 'Dung-saan-hau',
    category: 'art_hidden',
    district: 'Yuexiu (越秀区)',
    lat: 23.1238,
    lng: 113.2965,
    metroInfoFr: 'Métro Ligne 1 ou Ligne 6, Station Dongshankou, Sortie E ou F',
    metroInfoEn: 'Metro Line 1 or Line 6, Dongshankou Station, Exit E or F',
    addressCn: '广州市越秀区新河浦路 / 培正路',
    image: '/src/assets/images/dongshankou_redbrick_villa_1793294556329.jpg',
    thumbnailAlt: 'Ruelles aux briques rouges et villas bourgeoises des années 1920 à Dongshankou',
    descriptionFr: 'Véritable pépite préservée et repaire de la jeunesse créative cantonaise, Dongshankou dévoile le plus grand ensemble de villas occidentales en brique rouge des années 1920 et 1930 de Chine du Sud. Jadis quartier résidentiel des élites politiques et marchands d’outre-mer ("les jeunes maîtres de Dongshan"), ses ruelles pavées comme Xinhepu et Peizheng Road abritent désormais galeries d’art indépendantes, ateliers de céramique, cafés de spécialité torréfiés sur place et boutiques de créateurs avant-gardistes.',
    descriptionEn: 'The trendiest historic neighborhood in Guangzhou. Tree-lined streets lined with 1920s red-brick overseas Chinese villas house independent art galleries, artisanal coffee shops, indie bookstores, and select boutiques.',
    culturalNoteFr: 'Le dicton populaire disait : "Le pouvoir à Dongshan, la richesse à Xiguan" (东山的少爷，西关的小姐), évoquant le contraste entre l’aristocratie moderne de Dongshan et la bourgeoisie soyeuse de Liwan.',
    visitingTipsFr: [
      'Flânez sans plan le long de Kui Yuan (villa transformée en galerie d’art contemporain) et de Chun Yuan.',
      'Dégustez un café infusé à froid dans une cour intérieure végétalisée en admirant les balcons en fer forgé Art Déco.',
      'Parfait pour une après-midi décontractée loin des grands flux touristiques organisés.'
    ],
    recommendedDuration: '2h - 3h',
    estimatedCostRmb: 0,
    bestTime: 'Après-midi (14h00 - 18h00)',
    scores: [
      {
        source: 'xiaohongshu',
        sourceName: 'Xiaohongshu (小红书)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 310000,
        badge: '文艺潮人首选地 (N°1 Quartier Bohème & Mode)',
        highlightQuote: '红砖洋房太有民国复古韵味了！各种小众艺术空间和咖啡馆，逛一下午都不觉得累。(Les manoirs en briques rouges ont un cachet fou ! Galeries d’art et cafés intimistes sublimes).'
      },
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.7,
        reviewCount: 64000,
        highlightQuote: '广州最有小资情调的地方，新旧文化的完美交融。(Le spot le plus raffiné de Guangzhou, fusion idéale d’histoire et d’avant-garde).'
      },
      {
        source: 'google',
        sourceName: 'Google Maps',
        sourceType: 'western',
        score: 4.8,
        reviewCount: 1250,
        highlightQuote: 'A hidden gem overlooked by standard tour packages. Hipster coffee, cool architecture, zero crowds.'
      }
    ],
    isTopRated: false,
    isHiddenGem: true,
    tags: ['Pépite Cachée', 'Villas Rétro 1920', 'Galeries d’Art', 'Cafés de Spécialité']
  },
  {
    id: 'yong-qing-fang',
    nameFr: 'Yong Qing Fang & Musée de l’Opéra Cantonais',
    nameEn: 'Yong Qing Fang & Cantonese Opera Art Museum',
    nameCn: '永庆坊 & 粤剧艺术博物馆',
    pinyin: 'Yǒng Qìng Fāng',
    cantonesePhonetic: 'Wing-hing Fong',
    category: 'heritage',
    district: 'Liwan (荔湾区)',
    lat: 23.1175,
    lng: 113.2356,
    metroInfoFr: 'Métro Ligne 1 ou Ligne 6, Station Huangsha, Sortie B (8 min à pied)',
    metroInfoEn: 'Metro Line 1 or 6, Huangsha Station, Exit B',
    addressCn: '广州市荔湾区恩宁路永庆大街',
    image: '/src/assets/images/yong_qing_fang_1793294746500.jpg',
    thumbnailAlt: 'Pavillons sur l’eau du musée de l’opéra cantonais et ruelles traditionnelles de Xiguan',
    descriptionFr: 'Joyau de la rénovation urbaine patrimoniale de Guangzhou, Yong Qing Fang redonne vie aux ruelles historiques d’Enning Road au cœur de l’ancien Xiguan. On y arpente des venelles pavées bordées de maisons d’arcade (Qilou), de l’ancienne résidence d’arts martiaux de Bruce Lee, et d’échoppes d’artisans du cuivre. Le joyau du site est le somptueux Musée de l’Opéra Cantonais, construit comme un palais aquatique Lingnan où des comédiens costumés chantent sur une scène flottante surplombant un étang de carpes koï.',
    descriptionEn: 'The revitalized historic heart of old Xiguan. Ancient granite alleys and traditional arcade Qilou buildings flank the Cantonese Opera Art Museum, an exquisite water garden showcasing operatic theater, Bruce Lee ancestral home, and copper handicrafts.',
    culturalNoteFr: 'L’Opéra Cantonais est inscrit au patrimoine immatériel de l’UNESCO. Sa gestuelle raffinée et ses mélodies envoûtantes se marient à la perfection avec les reflets nocturnes du pavillon.',
    visitingTipsFr: [
      'Consultez les horaires des représentations gratuites d’opéra en plein air sur la scène lacustre (souvent les week-ends après-midi).',
      'Le pont Moon Bridge ("Yueliang Qiao") s’illumine le soir créant une illusion d’optique circulaire avec son reflet dans l’eau.',
      'Musée gratuit mais réservation nécessaire via mini-programme ou sur présentation du passeport à l’accueil.'
    ],
    recommendedDuration: '2h - 2h30',
    estimatedCostRmb: 0,
    bestTime: 'Fin d’après-midi jusqu’à la tombée de la nuit (16h30 - 20h30)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 88000,
        badge: '古镇老街第1名 (N°1 Quartier Historique Xiguan)',
        highlightQuote: '夜晚的月亮桥太绝了，粤剧博物馆的水榭戏台宛如仙境，既传统又新潮！(Le pont de lune le soir est magique, la scène flottante est digne d’un conte de fées).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.7,
        reviewCount: 1820,
        highlightQuote: 'Brilliant blend of restored heritage and lively modern culture. The Opera Museum gardens are breathtaking.'
      },
      {
        source: 'xiaohongshu',
        sourceName: 'Xiaohongshu (小红书)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 160000,
        highlightQuote: '穿汉服拍照天花板，月亮桥倒影一定要去打卡！(Le meilleur spot photo pour les amoureux d’esthétique classique chinoise).'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Opéra UNESCO', 'Xiguan Qilou', 'Bruce Lee', 'Architecture sur l’eau']
  },
  {
    id: 'yuexiu-park',
    nameFr: 'Parc Yuexiu & Sculpture des Cinq Béliers',
    nameEn: 'Yuexiu Park & Five Rams Stone Sculpture',
    nameCn: '越秀公园 & 五羊石雕',
    pinyin: 'Yuèxiù Gōngyuán',
    cantonesePhonetic: 'Jyut-sau Gung-jyun',
    category: 'nature',
    district: 'Yuexiu (越秀区)',
    lat: 23.1415,
    lng: 113.2642,
    metroInfoFr: 'Métro Ligne 2, Station Yuexiu Park, Sortie B1',
    metroInfoEn: 'Metro Line 2, Yuexiu Park Station, Exit B1',
    addressCn: '广州市越秀区解放北路988号',
    image: '/src/assets/images/yuexiu_five_rams_sculpture_1793294557769.jpg',
    thumbnailAlt: 'Parc Yuexiu avec lacs luxuriants et monument emblématique des Cinq Béliers',
    descriptionFr: 'Le plus grand poumon vert urbain de Guangzhou s’étend sur sept collines verdoyantes et trois lacs étincelants. C’est ici que se trouve le symbole fondateur de la cité : la statue des Cinq Béliers, sculptée dans plus de 130 blocs de granit, illustrant la légende des immortels descendus des cieux pour délivrer la ville de la famine en lui offrant des épis de riz. Le parc abrite également la tour Zhenhai du XIVe siècle (Musée de la Ville) et les vestiges de la muraille d’enceinte de la dynastie Ming.',
    descriptionEn: 'The largest municipal park in Guangzhou, spanning lush hills and serene lakes. Home to the legendary Five Rams stone sculpture that gave Guangzhou its nickname "City of Rams", as well as the 600-year-old Zhenhai Tower.',
    culturalNoteFr: 'Guangzhou est poétiquement appelée Yangcheng (羊城, la Cité des Béliers) et Suicheng (穗城, la Cité des Épis de Riz) en mémoire de cette légende protectrice.',
    visitingTipsFr: [
      'Visitez la tour Zhenhai (Zhenhai Lou) pour comprendre les 2200 ans d’histoire de la ville.',
      'Louez un petit bateau électrique sur le lac Beixiu pour vous détendre à l’ombre des collines boisées.',
      'Entrée du parc entièrement gratuite ; 10 RMB pour monter dans la tour Zhenhai.'
    ],
    recommendedDuration: '2h - 3h',
    estimatedCostRmb: 0,
    bestTime: 'Matinée fraîche (08h00 - 11h00)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.7,
        reviewCount: 92000,
        badge: '广州城市地标 (Emblème Municipal)',
        highlightQuote: '五羊石雕是广州人的集体记忆，公园绿树成荫，空气清新，适合全家散步。(Les Cinq Béliers incarnent la mémoire de Guangzhou ; parc d’une fraîcheur remarquable).'
      },
      {
        source: 'google',
        sourceName: 'Google Maps',
        sourceType: 'western',
        score: 4.6,
        reviewCount: 3800,
        highlightQuote: 'Beautiful huge park in the city center. The Zhenhai tower museum gave fantastic historical perspective.'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.5,
        reviewCount: 2900,
        highlightQuote: 'A lovely green escape. Seeing the Five Rams monument is an essential rite of passage for first-time visitors.'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Parc Urbain', 'Légende des 5 Béliers', 'Muraille Ming', 'Tour Zhenhai']
  },
  {
    id: 'sacred-heart-cathedral',
    nameFr: 'Cathédrale du Sacré-Cœur (Shishi)',
    nameEn: 'Sacred Heart Cathedral (Stone Room)',
    nameCn: '石室圣心大教堂',
    pinyin: 'Shíshì Shèngxīn Dàjiàotáng',
    cantonesePhonetic: 'Sek-sat Sing-sam Daai-gaau-tong',
    category: 'heritage',
    district: 'Yuexiu (越秀区)',
    lat: 23.1167,
    lng: 113.2575,
    metroInfoFr: 'Métro Ligne 2 ou Ligne 6, Station Haizhu Square, Sortie B2 (10 min à pied)',
    metroInfoEn: 'Metro Line 2 or 6, Haizhu Square Station, Exit B2',
    addressCn: '广州市越秀区一德路旧部前56号',
    image: '/src/assets/images/sacred_heart_cathedral_guangzhou_1793294557703.jpg',
    thumbnailAlt: 'Double flèche gothique en granit taillé de la cathédrale Shishi',
    descriptionFr: 'Surnommée "Shishi" (la Maison de Pierre), cette impressionnante cathédrale néogothique construite entre 1863 et 1888 est l’un des quatre seuls édifices religieux au monde intégralement construits en pierre de granit de taille (avec Notre-Dame de Paris et Westminster). Conçue par les architectes français Guillemin et Boillat, elle fut érigée par des maîtres tailleurs de pierre cantonais. Ses flèches s’élèvent à plus de 58 mètres et ses vitraux français projettent une lumière multicolore féerique dans la nef.',
    descriptionEn: 'Known as the "Stone House", this Roman Catholic cathedral took 25 years to build entirely out of granite blocks. Designed by French architects, it is one of only four all-granite Gothic cathedrals in the world.',
    culturalNoteFr: 'Les artisans locaux chinois ont réussi le tour de force d’adapter les arcs-boutants et croisées d’ogives européennes sans la moindre armature métallique, en utilisant du mortier à base de riz gluant.',
    visitingTipsFr: [
      'Respectez les règles vestimentaires strictes (épaules et genoux couverts, pas de shorts courts).',
      'Ouverte aux visiteurs du mardi au dimanche matin (fermé le lundi).',
      'Combinez votre visite avec le marché animé des fruits secs et fruits de mer séchés de Yide Road juste devant.'
    ],
    recommendedDuration: '1h',
    estimatedCostRmb: 0,
    bestTime: 'Mardi à Samedi après-midi (14h30 - 16h30) pour la lumière dans les vitraux',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 76000,
        badge: '远东巴黎圣母院 (Notre-Dame d’Extrême-Orient)',
        highlightQuote: '纯花岗岩石结构太震撼了，阳光透过彩色琉璃窗洒进教堂，神圣而庄严。(Le granit pur est impressionnant, la lumière à travers les vitraux est mystique).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.6,
        reviewCount: 2100,
        highlightQuote: 'Astonishing piece of French Gothic heritage in the bustling subtropical heart of Canton.'
      },
      {
        source: 'google',
        sourceName: 'Google Maps',
        sourceType: 'western',
        score: 4.7,
        reviewCount: 3400,
        highlightQuote: 'Incredible granite stonework. Free entry and very peaceful atmosphere.'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Architecture Gothique', 'Granit Massif', 'Vitraux Français', 'Histoire XIXe']
  },
  {
    id: 'xiaozhou-village',
    nameFr: 'Village d’artistes sur l’eau de Xiaozhou',
    nameEn: 'Xiaozhou Ancient Water Village & Art Colony',
    nameCn: '小洲村',
    pinyin: 'Xiǎozhōu Cūn',
    cantonesePhonetic: 'Siu-zau Cyun',
    category: 'art_hidden',
    district: 'Haizhu (海珠区)',
    lat: 23.0562,
    lng: 113.3648,
    metroInfoFr: 'Métro Ligne 4 ou 7, Station Higher Education Mega Center South, puis taxi ou bus 86 (10 min)',
    metroInfoEn: 'Metro Line 4 or 7, HEMC South Station, then short taxi ride (10 min)',
    addressCn: '广州市海珠区小洲南路小洲村',
    image: '/src/assets/images/xiaozhou_oyster_shell_house_1793294556757.jpg',
    thumbnailAlt: 'Canaux anciens de Xiaozhou bordés de maisons en coquilles d’huîtres et ponts de pierre',
    descriptionFr: 'Dissimulé aux confins méridionaux de Haizhu, Xiaozhou est l’un des derniers villages lacustres authentiques de l’ancien delta cantonnais fondé sous la dynastie Yuan. Ses canaux bordés de bananiers sont enjambés par des ponts en dos d’âne séculaires. Sa curiosité architecturale majeure réside dans ses maisons bâties en coquilles d’huîtres empilées ("Hao Ke Wu"), matériau traditionnel résistant à l’humidité et à la chaleur. Aujourd’hui, peintres et calligraphes de l’Académie des Beaux-Arts y ont installé leurs ateliers secrets.',
    descriptionEn: 'An ancient water village dating back to the Yuan Dynasty, crisscrossed by stone bridges, banyan trees, and river canals. Renowned for its rare oyster-shell houses ("Hao Ke Wu") and bohemians studios run by local painters.',
    culturalNoteFr: 'Les murs de coquilles d’huîtres sont une invention écologique cantonaise vieille de plus de 600 ans : imputrescibles, coupe-feu et naturellement isolants thermiques.',
    visitingTipsFr: [
      'Allez chercher la "Maison aux coquilles d’huîtres" (蚝壳屋) cachée dans la venelle Si Ma.',
      'Arrêtez-vous dans une maison de thé traditionnelle au bord de l’eau pour déguster du tofu au gingembre (Douhua).',
      'Ambiance bohème garantie, loin de tout tourisme de masse.'
    ],
    recommendedDuration: '2h - 3h',
    estimatedCostRmb: 0,
    bestTime: 'Après-midi ensoleillé pour les reflets sur les canaux',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.6,
        reviewCount: 39000,
        badge: '小众水乡秘境 (Havre Fluvial Secret)',
        highlightQuote: '保留了原始水乡的宁静，走在石板路上能听到水声，很有文艺气息。(Le calme originel du village sur l’eau est préservé, on entend le clapotis le long des ruelles pavées).'
      },
      {
        source: 'xiaohongshu',
        sourceName: 'Xiaohongshu (小红书)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 52000,
        highlightQuote: '蚝壳屋真的大开眼界！很多美院老师的画室，非常适合安静散心。(Les maisons en coquilles d’huîtres sont stupéfiantes ! Idéal pour flâner loin du bruit).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.4,
        reviewCount: 420,
        highlightQuote: 'Authentic hidden gem of old Canton that tourists rarely find. Great artist vibe.'
      }
    ],
    isTopRated: false,
    isHiddenGem: true,
    tags: ['Pépite Cachée', 'Village Lacustre', 'Maisons d’Huîtres', 'Ateliers de Peintres']
  },
  {
    id: 'pearl-river-cruise',
    nameFr: 'Croisière nocturne sur la Rivière des Perles',
    nameEn: 'Pearl River Night Cruise (Zhujiang Cruise)',
    nameCn: '珠江夜游',
    pinyin: 'Zhūjiāng Yèyóu',
    cantonesePhonetic: 'Zyu-gong Je-jau',
    category: 'modern',
    district: 'Yuexiu & Haizhu (越秀/海珠区)',
    lat: 23.1118,
    lng: 113.2798,
    metroInfoFr: 'Métro Ligne 2 ou Ligne 6, Station Haizhu Square, Embarcadère Dashatou ou Tianzi Pier',
    metroInfoEn: 'Metro Line 2 or 6, Haizhu Square Station, Tianzi or Dashatou Pier',
    addressCn: '广州市越秀区沿江东路466号大沙头码头',
    image: '/src/assets/images/canton_tower_night_1793290740500.jpg',
    thumbnailAlt: 'Bateaux illuminés glissant sous les ponts futuristes de Guangzhou',
    descriptionFr: 'Expérience féerique incontournable d’un séjour à Canton, la croisière sur la Rivière des Perles transforme la mégapole en un somptueux théâtre de reflets aquatiques. Durant 70 minutes de navigation paisible entre l’embarcadère Tianzi et le pont Liede, le bateau longe les façades néoclassiques de Yanjiang Road, passe sous des ponts suspendus parés de néons cinétiques et dévoile la perspective la plus magistrale sur la Tour de Canton et les gratte-ciel de Zhujiang New Town.',
    descriptionEn: 'The quintessential Guangzhou evening experience. Glide past historic colonial wharves, illuminated suspension bridges, and modern architectural masterpieces including Canton Tower and Haixin Bridge.',
    culturalNoteFr: 'L’embarcadère Tianzi (天字码头, "Quai Numéro Un") était sous les Qing l’embarcadère officiel réservé aux hauts fonctionnaires impériaux arrivant de Pékin.',
    visitingTipsFr: [
      'Privilégiez les billets sur le pont supérieur découvert (3e étage) pour prendre des photos sans reflets de vitre.',
      'Choisissez le créneau de 19h30 ou 20h00 quand tous les édifices sont illuminés à plein régime.',
      'Prévoyez une veste légère en hiver car la brise sur l’eau est rafraîchissante.'
    ],
    recommendedDuration: '1h15 (croisière) + 30 min embarquement',
    estimatedCostRmb: 118,
    bestTime: 'Soirée (départs entre 19h15 et 21h00)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 165000,
        badge: '广州夜游榜首 (N°1 Sorties Nocturnes)',
        highlightQuote: '吹着江风看两岸灯光秀，经过广州塔那一刻全船人都在惊呼欢呼！(La brise sur le fleuve, le spectacle des lumières... au passage devant la tour de Canton, tout le bateau applaudit !).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.6,
        reviewCount: 3950,
        badge: 'Top Guangzhou Night Activity',
        highlightQuote: 'A mesmerizing light show from the water. Seeing the skyline and bridges light up is unforgettable.'
      },
      {
        source: 'ctrip',
        sourceName: 'Ctrip (携程)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 112000,
        highlightQuote: '广州标志性游玩项目，视野无敌。(Projet emblématique de Guangzhou, vue panoramique imbattable).'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Croisière', 'Skyline Nocturne', 'Rivière des Perles', 'Romantique']
  },
  {
    id: 'baiyun-mountain',
    nameFr: 'Mont Baiyun (Montagne des Nuages Blancs)',
    nameEn: 'Baiyun Mountain (White Cloud Mountain)',
    nameCn: '白云山',
    pinyin: 'Báiyún Shān',
    cantonesePhonetic: 'Baak-wan Saan',
    category: 'nature',
    district: 'Baiyun (白云区)',
    lat: 23.1812,
    lng: 113.2985,
    metroInfoFr: 'Métro Ligne 2, Station Baiyun Park, puis navette ou téléphérique porte Sud (Lujing Road)',
    metroInfoEn: 'Metro Line 2, Baiyun Park Station or bus to South Gate Cable Car',
    addressCn: '广州市白云区广园中路白云山南门',
    image: '/src/assets/images/baiyun_mountain_cablecar_1793294558861.jpg',
    thumbnailAlt: 'Panorama luxuriant depuis le pic Moxing sur la mer de nuages et Guangzhou',
    descriptionFr: 'Surnommée "la première beauté de Yangcheng", la montagne Baiyun dresse ses crêtes boisées au nord de la métropole. Dès qu’un voile de brume ou une averse subtropicale caresse ses cimes, les nuages blancs s’accrochent aux collines, créant un paysage d’estampe chinoise féerique. On y grimpe en téléphérique panoramique jusqu’au pic Moxingling (382 m) pour contempler l’immensité de la cité, ou on flâne dans les jardins de bonsaïs et les vallées de pêchers en fleurs de Mingchun.',
    descriptionEn: 'Known as the "First Mountain of Lingnan", Baiyun Mountain boasts 30 misty peaks carpeted in subtropical forests. Take the scenic cable car up to Moxing Summit for sweeping city panoramas.',
    culturalNoteFr: 'Depuis plus d’un millénaire, les poètes chinois comme Su Shi venaient y boire le thé à l’eau de source de montagne et composer des vers sur les nuages vagabonds.',
    visitingTipsFr: [
      'Prenez le téléphérique à l’aller (25 RMB) pour survoler la canopée, puis descendez à pied à travers la bambouseraie.',
      'Dégustez au sommet le fameux "Shanshui Douhua" (tofu soyeux sucré à l’eau de source de montagne).',
      'Le pic Moxingling offre un panorama exceptionnel au lever du soleil.'
    ],
    recommendedDuration: '3h - 4h',
    estimatedCostRmb: 5,
    bestTime: 'Tôt le matin (07h30 - 11h00) pour la fraîcheur et la mer de brume',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.7,
        reviewCount: 130000,
        badge: '广州绿肺国家5A景区 (Poumon Vert 5A)',
        highlightQuote: '缆车上山风景绝赞，山顶吃一碗山水豆腐花，看整个广州尽收眼底。(Le téléphérique est spectaculaire, le tofu à l’eau de source au sommet est un régal).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.5,
        reviewCount: 3100,
        highlightQuote: 'Great escape from city traffic into lush pine forests and gardens. Fantastic views on clear days.'
      },
      {
        source: 'google',
        sourceName: 'Google Maps',
        sourceType: 'western',
        score: 4.6,
        reviewCount: 2800,
        highlightQuote: 'Easy hiking with paved walkways. Beautiful bird aviary and peaceful temple gardens.'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Nature & Randonnée', 'Téléphérique', 'Panorama', 'Tofu de Montagne']
  },
  {
    id: 'pantang-ancient-village',
    nameFr: 'Village ancien de Pantang Wuyue & Lac Liwan',
    nameEn: 'Pantang Wuyue Historic Village & Liwan Lake',
    nameCn: '泮塘五约 & 荔湾湖公园',
    pinyin: 'Pàntáng Wǔyuē',
    cantonesePhonetic: 'Pun-tong Ng-joek',
    category: 'art_hidden',
    district: 'Liwan (荔湾区)',
    lat: 23.1264,
    lng: 113.2325,
    metroInfoFr: 'Métro Ligne 5, Station Zhongshanba, Sortie A (5 min à pied vers Liwan Lake)',
    metroInfoEn: 'Metro Line 5, Zhongshanba Station, Exit A',
    addressCn: '广州市荔湾区泮塘五约直街',
    image: '/src/assets/images/pantang_village_1793294759675.jpg',
    thumbnailAlt: 'Maisons ancestrales en briques sombres et lampions traditionnels de Pantang Wuyue',
    descriptionFr: 'Vieux de plus de 900 ans, Pantang Wuyue est le village le plus ancien et le mieux préservé de l’ancien canton de Xiguan. Lové contre les eaux calmes du parc du lac Liwan, ce labyrinthe de ruelles pavées de dalles de granit est demeuré miraculeusement intact. Les anciennes maisons en briques grises aux portes coulissantes triples en bois (Tanglong) accueillent aujourd’hui des maîtres luthiers d’instruments traditionnels Guqin, des céramistes, des herboristes et des salons de thé nichés sous des banyans enchevêtrés.',
    descriptionEn: 'A 900-year-old intact village bordering serene Liwan Lake. Winding cobblestone alleys feature traditional triple sliding timber gates, ancient temples, Guqin zither makers, and bohemian courtyard tearooms.',
    culturalNoteFr: 'Pantang était historiquement réputé pour les "Cinq Trésors Aquatiques" (泮塘五秀), dont la châtaigne d’eau et la racine de lotus, célébrés dans les gâteaux traditionnels de châtaigne d’eau (Mati Gao).',
    visitingTipsFr: [
      'Goutez au gâteau tiède de châtaigne d’eau (马蹄糕) acheté chez les marchands séculaires au bord de l’étang.',
      'Entrez écouter le son cristallin du Guqin (cithare chinoise à sept cordes) dans l’atelier d’un luthier.',
      'Moins couru que Yongqingfang, c’est le secret le mieux gardé des amateurs de calme et d’authenticité cantonaise.'
    ],
    recommendedDuration: '1h30 - 2h',
    estimatedCostRmb: 0,
    bestTime: 'Fin de matinée ou après-midi paisible (11h00 - 16h00)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 31000,
        badge: '千年老村秘境 (Secret Millénaire Vivant)',
        highlightQuote: '比永庆坊更安静原始，原住民和文艺手作人共同生活，泮塘马蹄糕软糯清甜！(Plus authentique et paisible qu’Yongqingfang ; les gâteaux de châtaigne d’eau sont exquis).'
      },
      {
        source: 'xiaohongshu',
        sourceName: 'Xiaohongshu (小红书)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 47000,
        highlightQuote: '猫咪在青砖瓦房上晒太阳，藏在市中心的世外桃源。(Des chats qui somnolent sur les toits de tuiles vernissées, un havre de paix au centre-ville).'
      },
      {
        source: 'google',
        sourceName: 'Google Maps',
        sourceType: 'western',
        score: 4.7,
        reviewCount: 540,
        highlightQuote: 'Superb peaceful traditional village, virtually zero commercial tourist traps. Must visit.'
      }
    ],
    isTopRated: false,
    isHiddenGem: true,
    tags: ['Pépite Cachée', 'Village Millénaire', 'Musique Guqin', 'Gâteau de Châtaigne d’eau']
  },
  {
    id: 'baomo-garden',
    nameFr: 'Jardin Baomo (Panyu)',
    nameEn: 'Baomo Garden (Lingnan Classical Garden)',
    nameCn: '宝墨园',
    pinyin: 'Bǎomò Yuán',
    cantonesePhonetic: 'Bou-mak Jyun',
    category: 'heritage',
    district: 'Panyu (番禺区)',
    lat: 22.9015,
    lng: 113.2982,
    metroInfoFr: 'Métro Ligne 3, Station Shiqiao, puis bus direct Pan 67 ou taxi (25 min)',
    metroInfoEn: 'Metro Line 3, Shiqiao Station, then Pan 67 bus or taxi to Baomo Garden',
    addressCn: '广州市番禺区沙湾镇紫坭村村南路',
    image: '/src/assets/images/baomo_garden_koi_pond_1793294559616.jpg',
    thumbnailAlt: 'Ponts arqués en marbre blanc et cours d’eau peuplés de carpes koï au Jardin Baomo',
    descriptionFr: 'Créé à la fin de la dynastie Qing pour honorer la droiture du célèbre magistrat impérial Bao Zheng (Juge Bao), le jardin Baomo est un somptueux modèle d’architecture paysagère Lingnan. Il allie l’art des jardins chinois classiques à des ponts arqués en marbre blanc, d’immenses bas-reliefs en poterie vernissée primés au Livre Guinness des records, et des bassins translucides où nagent plus de cent mille carpes koï dorées que les visiteurs peuvent nourrir à la main.',
    descriptionEn: 'A magnificent Lingnan classical water garden in Panyu district honoring the legendary Judge Bao. Featuring white marble arched bridges, Guinness-record clay mural carvings, and crystal streams filled with thousands of vibrant koi fish.',
    culturalNoteFr: 'Le jardin expose une fresque murale colossale en poterie de Shiwan reproduisant "Le Long de la Rivière durant la Fête de Qingming", chef-d’œuvre absolu de la peinture chinoise classique.',
    visitingTipsFr: [
      'Achetez un petit sachet de nourriture pour carpes koï : leur ballet doré sous les ponts de marbre est spectaculaire.',
      'Combinez la journée avec la visite du village ancien de Shawan tout proche (à 10 min en taxi).',
      'Le restaurant du jardin sert la spécialité locale de Panyu : le lait de bufflonne au gingembre (Jiang Zhuang Nai).'
    ],
    recommendedDuration: '3h',
    estimatedCostRmb: 54,
    bestTime: 'Journée complète ou matinée ensoleillée (09h30 - 14h00)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 52000,
        badge: '岭南园林代表作 (Grand Chef-d’Œuvre Paysager)',
        highlightQuote: '锦鲤超多超治愈，白石拱桥与假山回廊交相辉映，比苏州园林更显开阔大气！(Des carpes koï innombrables, les ponts de marbre et galeries sont encore plus amples et majestueux qu’à Suzhou !).'
      },
      {
        source: 'ctrip',
        sourceName: 'Ctrip (携程)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 43000,
        highlightQuote: '番禺必去景点，园林精美，适合穿旗袍或汉服拍大片。(Incontournable à Panyu, décor grandiose pour la photographie).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.6,
        reviewCount: 980,
        highlightQuote: 'Fabulous traditional garden with millions of golden koi fish. A magical day trip outside downtown.'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Jardin Lingnan', 'Carpes Koï', 'Sculptures Guinness', 'Juge Bao']
  },
  {
    id: 'guangdong-museum',
    nameFr: 'Musée du Guangdong (Cité Nouvelle de Zhujiang)',
    nameEn: 'Guangdong Museum & Zhujiang New Town',
    nameCn: '广东省博物馆',
    pinyin: 'Guǎngdōng Shěng Bówùguǎn',
    cantonesePhonetic: 'Gwong-dung Saang Bok-mat-gun',
    category: 'modern',
    district: 'Tianhe (天河区)',
    lat: 23.1165,
    lng: 113.3262,
    metroInfoFr: 'Métro Ligne 3 ou Ligne 5, Station Zhujiang New Town, ou APM Station Grand Theater',
    metroInfoEn: 'Metro Line 3 or 5, Zhujiang New Town Station, or APM Grand Theater',
    addressCn: '广州市天河区珠江东路2号',
    image: '/src/assets/images/guangdong_museum_1793294744924.jpg',
    thumbnailAlt: 'Architecture futuriste de la boîte à trésor du musée provincial du Guangdong',
    descriptionFr: 'Conçu par le cabinet Rocco Design Architects sous la forme d’une monumentale "boîte à trésors sculptée" (Yuediao), le Musée Provincial du Guangdong est l’un des plus impressionnants musées d’art et d’histoire de Chine. Ses galeries d’exposition suspendues dévoilent les trésors de la porcelaine de Canton cuite pour les cours royales d’Europe, les bronzes archéologiques sous-marins de la Route de la Soie maritime et une spectaculaire galerie paléontologique avec squelettes géants de dinosaures.',
    descriptionEn: 'Housed in an architectural marvel inspired by traditional Cantonese multi-layered carved lacquer treasure boxes. Highlights include export ceramics, Lingnan woodcarvings, marine Silk Road artifacts, and dinosaur halls.',
    culturalNoteFr: 'Le musée est encadré par le célèbre Opéra de Guangzhou dessiné par Zaha Hadid et la Bibliothèque de Guangzhou, formant le triangle architectural le plus avant-gardiste de la métropole.',
    visitingTipsFr: [
      'Entrée gratuite mais réservation obligatoire avec votre numéro de passeport sur le compte WeChat officiel ou à l’accueil.',
      'Ne manquez pas la salle de la sculpture sur bois doré de Chaozhou (Chaozhou Jindiāo) d’une finesse époustouflante.',
      'Fermé le lundi.'
    ],
    recommendedDuration: '2h30 - 3h',
    estimatedCostRmb: 0,
    bestTime: 'Mardi à Dimanche après-midi (13h30 - 16h30)',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.8,
        reviewCount: 94000,
        badge: '国家一级博物馆 (Musée National Élite)',
        highlightQuote: '月光宝盒建筑太震撼了！端砚馆和木雕馆展品精美绝伦，免费吹空调看国宝，值哭！(La boîte à trésors est grandiose ! Les sculptures sur bois et pierres à encre sont des trésors nationaux).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.6,
        reviewCount: 1450,
        badge: 'Top Museum Guangzhou',
        highlightQuote: 'World-class museum with excellent bilingual signage. The building itself is a contemporary sculpture.'
      },
      {
        source: 'google',
        sourceName: 'Google Maps',
        sourceType: 'western',
        score: 4.7,
        reviewCount: 2200,
        highlightQuote: 'Free entry, magnificent architecture by Rocco, fascinating exhibits on maritime silk trade.'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Musée National', 'Zaha Hadid Voisine', 'Route de la Soie Maritime', 'Porcelaine de Canton']
  },
  {
    id: 'taikoo-hui',
    nameFr: 'Centre Commercial Taikoo Hui (Tianhe)',
    nameEn: 'Taikoo Hui Luxury Mall & Rooftop Garden',
    nameCn: '太古汇',
    pinyin: 'Tàigǔ Huì',
    cantonesePhonetic: 'Taai-gu Wui',
    category: 'mall',
    district: 'Tianhe (天河区)',
    lat: 23.1342,
    lng: 113.3325,
    metroInfoFr: 'Métro Ligne 3, Station Shipaiqiao, Sortie directe en sous-sol vers Taikoo Hui',
    metroInfoEn: 'Metro Line 3, Shipaiqiao Station, direct underground connection to Taikoo Hui',
    addressCn: '广州市天河区天河路383号太古汇',
    image: '/src/assets/images/taikoo_hui_guangzhou_1793294562227.jpg',
    thumbnailAlt: 'Façade en verre et atrium moderne de Taikoo Hui Tianhe avec boutiques de luxe',
    descriptionFr: 'Fleuron du shopping haut de gamme et du lifestyle contemporain à Guangzhou, Taikoo Hui s’impose comme le sanctuaire des grandes maisons internationales de mode, d’horlogerie et de gastronomie. Conçu par le cabinet Arquitectonica, il se distingue par son spectaculaire jardin suspendu au 3e étage (Roof Garden) offrant terrasses de cafés ombragées et fontaines zen au cœur du quartier des affaires de Tianhe. On y trouve également la librairie design Fangsuo Commune (方所) et une sélection raffinée de salons de thé gourmands.',
    descriptionEn: 'Guangzhou’s premier luxury shopping and lifestyle destination, housing global luxury flagships, Michelin-starred dining, the famed Fangsuo Commune cultural bookstore, and a tranquil open-air rooftop garden.',
    culturalNoteFr: 'Taikoo Hui a redéfini le commerce de luxe dans le Sud de la Chine en intégrant des cours intérieures baignées de lumière naturelle et des espaces d’exposition artistique permanente.',
    visitingTipsFr: [
      'Montez au Roof Garden du 3e niveau pour boire un verre en plein air loin du tumulte urbain.',
      'Ne manquez pas la monumentale librairie culturelle Fangsuo Commune (方所) au sous-sol MU, chef-d’œuvre d’esthétique taïwanaise.',
      'Climatisation idéale pour faire une pause shopping rafraîchissante en plein après-midi subtropical.'
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
        reviewCount: 156000,
        badge: '广州高端商场第1名 (N°1 Malls de Prestige)',
        highlightQuote: '广州顶奢商场天花板，顶楼露天花园太舒服了，方所书店也很好逛。(Le summum du shopping de prestige, le jardin sur le toit est un havre de paix).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.6,
        reviewCount: 1850,
        badge: 'Top Luxury Shopping Mall',
        highlightQuote: 'Immaculate, world-class luxury shopping. Beautiful rooftop terrace and wonderful bakery and tea selections.'
      },
      {
        source: 'xiaohongshu',
        sourceName: 'Xiaohongshu (小红书)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 240000,
        highlightQuote: '三楼空中花园拍照绝绝子，方所书店文创超丰富！(Le rooftop est idéal pour les photos, Fangsuo est une merveille de papeterie et de livres d’art).'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Shopping de Luxe', 'Rooftop Garden', 'Librairie Fangsuo', 'Tianhe CBD']
  },
  {
    id: 'guangzhou-opera-house',
    nameFr: 'Opéra de Guangzhou (Spectacles Vivants & Zaha Hadid)',
    nameEn: 'Guangzhou Opera House (Zaha Hadid Live Stage)',
    nameCn: '广州大剧院',
    pinyin: 'Guǎngzhōu Dà Jùyuàn',
    cantonesePhonetic: 'Gwong-zau Daai Kek-jyun',
    category: 'event',
    district: 'Tianhe (天河区)',
    lat: 23.1158,
    lng: 113.3218,
    metroInfoFr: 'Métro Ligne 3 ou Ligne 5, Station Zhujiang New Town, ou APM Station Guangzhou Opera House',
    metroInfoEn: 'Metro Line 3 or 5, Zhujiang New Town Station, or APM Guangzhou Opera House Station',
    addressCn: '广州市天河区珠江西路1号广州大剧院',
    image: '/src/assets/images/guangzhou_opera_house_zaha_1793294560444.jpg',
    thumbnailAlt: 'Architecture fluide en galets jumeaux de l’Opéra de Zaha Hadid illuminé le soir à Guangzhou',
    descriptionFr: 'Dernier chef-d’œuvre de l’architecte déconstructiviste Zaha Hadid, l’Opéra de Guangzhou évoque deux majestueux galets polis et sculptés par le courant de la Rivière des Perles ("Double Pebbles"). Cette merveille d’ingénierie acoustique comprend une grande salle de 1800 places en forme de coquille asymétrique illuminée par des milliers de micro-LED évoquant une voûte céleste étoilée. Il accueille tout au long de l’année de grands opéras internationaux, des ballets classiques, des concerts symphoniques et des productions théâtrales d’avant-garde.',
    descriptionEn: 'Designed by legendary architect Zaha Hadid as "two pebbles washed by the Pearl River", this 1,800-seat asymmetric acoustic wonder hosts world-class operas, Broadway musicals, classical ballets, and symphony concerts.',
    culturalNoteFr: 'Réputé pour son acoustique exceptionnelle conçue par le Dr Harold Marshall, l’édifice est classé par le critique du Guardian parmi les dix plus spectaculaires opéras du monde.',
    visitingTipsFr: [
      'Assistez à un concert de musique classique ou à un opéra en réservant sur le site officiel ou la billetterie sur place.',
      'Même sans assister à une représentation, le parvis et les passerelles en granit blanc sont féeriques de nuit avec les reflets des bassins.',
      'Des visites guidées des coulisses et de la grande salle sont organisées certains week-ends en matinée.'
    ],
    recommendedDuration: '2h - 3h (spectacle) ou 1h (architecture extérieure)',
    estimatedCostRmb: 180,
    bestTime: 'Soirée de spectacle (19h30) ou crépuscule pour les reflets architecturaux',
    scores: [
      {
        source: 'dianping',
        sourceName: 'Dianping (大众点评)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 68000,
        badge: '扎哈哈迪德传世之作 (Chef-d’Œuvre Éternel de Zaha Hadid)',
        highlightQuote: '双砾造型在珠江边太美了，大剧场满天星光的天花板美到窒息，音效无懈可击！(L’effet galets jumeaux est saisissant, le plafond en voûte étoilée est sublime et l’acoustique est sans faute).'
      },
      {
        source: 'tripadvisor',
        sourceName: 'Tripadvisor',
        sourceType: 'western',
        score: 4.7,
        reviewCount: 2200,
        badge: 'Top Cultural Performance Venue',
        highlightQuote: 'Zaha Hadid at her peak. Seeing a live orchestra performance here is a world-class audio-visual spectacle.'
      },
      {
        source: 'xiaohongshu',
        sourceName: 'Xiaohongshu (小红书)',
        sourceType: 'chinese',
        score: 4.9,
        reviewCount: 110000,
        highlightQuote: '夜景光影交错像科幻异次元！看一场音乐剧仪式感满满。(Jeux de lumière futuristes le soir, une soirée de spectacle inoubliable).'
      }
    ],
    isTopRated: true,
    isHiddenGem: false,
    tags: ['Spectacles Vivants', 'Zaha Hadid', 'Opéra & Ballets', 'Architecture Futuriste']
  }
];

export const GUANGZHOU_ATTRACTIONS: Attraction[] = RAW_GUANGZHOU_ATTRACTIONS.map(a => ({
  ...a,
  cityId: 'guangzhou' as const,
}));

export const CATEGORY_LABELS_FR: Record<string, { label: string; icon: string }> = {
  all: { label: 'Tous les lieux', icon: 'Sparkles' },
  heritage: { label: 'Histoire & Héritage Lingnan', icon: 'Landmark' },
  modern: { label: 'Icônes Modernes & Vues', icon: 'Building2' },
  food: { label: 'Gastronomie & Dim Sum', icon: 'UtensilsCrossed' },
  restaurant: { label: 'Grandes Tables & Festins', icon: 'Utensils' },
  mall: { label: 'Centres Commerciaux & Malls', icon: 'ShoppingBag' },
  event: { label: 'Spectacles & Robot Box', icon: 'Zap' },
  nature: { label: 'Nature & Collines', icon: 'Trees' },
  art_hidden: { label: 'Pépites & Ruelles d’Art', icon: 'Gem' },
};
