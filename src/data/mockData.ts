import { FlowerStemOption, WrapperOption, RibbonOption, FlowerShop, PresetBouquet, Order, UserProfile } from '../types';

export const DAGUPAN_BARANGAYS = [
  'Tapuac District',
  'Lucao District',
  'Bonuan Gueset',
  'Bonuan Boquig',
  'Perez Boulevard (Downtown)',
  'AB Fernandez Avenue',
  'Mayombo District',
  'Malued',
  'Pantal',
  'Pogo Grande',
  'Herrero-Perez',
  'Caranglaan',
  'Bolosan',
  'Salisay',
  'Calasiao Border (Neighboring)',
  'Mangaldan Border (Neighboring)'
];

export const FLOWER_STEMS: FlowerStemOption[] = [
  {
    id: 'stem-rose-red',
    name: 'Ecuadorian Crimson Rose',
    variety: 'Rose (Rosa)',
    colorName: 'Crimson Red',
    colorHex: '#be123c',
    stemPrice: 120,
    description: 'Long-stemmed velvety ruby rose with dense layers of petals and romantic fragrance.',
    meaning: 'Deep romantic love, passionate devotion, and enduring commitment.',
    vaseLifeDays: 9,
    defaultBloomSize: 1.0,
    iconColor: '#e11d48',
    inStock: true,
    stockCount: 180
  },
  {
    id: 'stem-rose-white',
    name: 'Benguet Highland White Rose',
    variety: 'Rose (Rosa)',
    colorName: 'Ivory White',
    colorHex: '#f8fafc',
    stemPrice: 110,
    description: 'Crisp mountain-grown white rose symbolizing pure beginnings and sincere affection.',
    meaning: 'Purity, spiritual reverence, and truthful devotion.',
    vaseLifeDays: 8,
    defaultBloomSize: 0.95,
    iconColor: '#e2e8f0',
    inStock: true,
    stockCount: 120
  },
  {
    id: 'stem-rose-blush',
    name: 'Dusty Blush Rose',
    variety: 'Rose (Rosa)',
    colorName: 'Soft Blush Pink',
    colorHex: '#fb7185',
    stemPrice: 115,
    description: 'Romantic vintage pink rose with gentle ruffled edges, perfect for soft palettes.',
    meaning: 'Gratitude, grace, gentle sweetness, and joy.',
    vaseLifeDays: 8,
    defaultBloomSize: 0.95,
    iconColor: '#f43f5e',
    inStock: true,
    stockCount: 95
  },
  {
    id: 'stem-sunflower',
    name: 'Radiant Golden Sunflower',
    variety: 'Sunflower (Helianthus)',
    colorName: 'Golden Honey Yellow',
    colorHex: '#eab308',
    stemPrice: 150,
    description: 'Bold uplifting yellow petals radiating around an intricate dark espresso seed center.',
    meaning: 'Warmth, happiness, loyalty, admiration, and optimism for milestones.',
    vaseLifeDays: 12,
    defaultBloomSize: 1.4,
    iconColor: '#f59e0b',
    inStock: true,
    stockCount: 75
  },
  {
    id: 'stem-lily-white',
    name: 'Casablanca White Lily',
    variety: 'Lily (Lilium)',
    colorName: 'Snow White & Gold Pistil',
    colorHex: '#f1f5f9',
    stemPrice: 180,
    description: 'Grand star-shaped blooms with exotic fragrance, prominent stamens, and regal presence.',
    meaning: 'Majesty, refined purity, honor, and prosperity.',
    vaseLifeDays: 10,
    defaultBloomSize: 1.5,
    iconColor: '#cbd5e1',
    inStock: true,
    stockCount: 60
  },
  {
    id: 'stem-tulip-pink',
    name: 'Holland Dawn Tulip',
    variety: 'Tulip (Tulipa)',
    colorName: 'Coral Pink',
    colorHex: '#f43f5e',
    stemPrice: 160,
    description: 'Silky cupped petals on crisp succulent green stems, classic modern luxury.',
    meaning: 'Confidence, true affection, and caring blessings.',
    vaseLifeDays: 7,
    defaultBloomSize: 0.85,
    iconColor: '#fb7185',
    inStock: true,
    stockCount: 50
  },
  {
    id: 'stem-carnation-blush',
    name: 'Double Frilled Carnation',
    variety: 'Carnation (Dianthus)',
    colorName: 'Powder Peach',
    colorHex: '#fed7aa',
    stemPrice: 85,
    description: 'Long-lasting ruffled blooms with a gentle clove scent and voluminous texture.',
    meaning: 'Fascination, motherly love, and fond remembrance.',
    vaseLifeDays: 14,
    defaultBloomSize: 0.9,
    iconColor: '#fdba74',
    inStock: true,
    stockCount: 140
  },
  {
    id: 'stem-babys-breath',
    name: 'Million Star Baby\'s Breath',
    variety: 'Gypsophila',
    colorName: 'Cloud White',
    colorHex: '#ffffff',
    stemPrice: 70,
    description: 'Ethereal airy spray of hundreds of tiny star-like blossoms that frame bouquets.',
    meaning: 'Everlasting love, innocence, and delicate harmony.',
    vaseLifeDays: 15,
    defaultBloomSize: 0.7,
    iconColor: '#94a3b8',
    inStock: true,
    stockCount: 200
  },
  {
    id: 'stem-eucalyptus',
    name: 'Silver Dollar Eucalyptus',
    variety: 'Foliage (Eucalyptus cinerea)',
    colorName: 'Sage Silver Green',
    colorHex: '#64748b',
    stemPrice: 60,
    description: 'Aromatic rounded silvery-green foliage adding modern organic architecture.',
    meaning: 'Protection, vitality, calm clarity, and abundance.',
    vaseLifeDays: 18,
    defaultBloomSize: 0.8,
    iconColor: '#475569',
    inStock: true,
    stockCount: 110
  },
  {
    id: 'stem-hydrangea-blue',
    name: 'Cloud Hydrangea',
    variety: 'Hydrangea macrophylla',
    colorName: 'Mist Periwinkle Blue',
    colorHex: '#60a5fa',
    stemPrice: 220,
    description: 'Grand cloud-like orb of hundreds of micro-petals, creating breathtaking fullness.',
    meaning: 'Heartfelt gratitude, abundance, and profound understanding.',
    vaseLifeDays: 7,
    defaultBloomSize: 1.6,
    iconColor: '#3b82f6',
    inStock: true,
    stockCount: 40
  }
];

export const WRAPPER_OPTIONS: WrapperOption[] = [
  {
    id: 'wrap-blush',
    name: 'Matte Rose Quartz',
    colorHex: '#fecdd3',
    price: 150,
    finish: 'matte',
    accentHex: '#fb7185'
  },
  {
    id: 'wrap-kraft',
    name: 'Artisan Rustic Kraft',
    colorHex: '#d97706',
    price: 120,
    finish: 'kraft',
    accentHex: '#b45309'
  },
  {
    id: 'wrap-charcoal',
    name: 'Onyx Midnight Matte',
    colorHex: '#1e293b',
    price: 180,
    finish: 'matte',
    accentHex: '#0f172a'
  },
  {
    id: 'wrap-pearl',
    name: 'Luminescent Pearl Frosted',
    colorHex: '#f8fafc',
    price: 160,
    finish: 'pearl',
    accentHex: '#e2e8f0'
  },
  {
    id: 'wrap-sage',
    name: 'Olive Botanical Green',
    colorHex: '#3f6212',
    price: 140,
    finish: 'matte',
    accentHex: '#365314'
  },
  {
    id: 'wrap-burgundy',
    name: 'Imperial Crimson Velvet',
    colorHex: '#881337',
    price: 200,
    finish: 'velvet',
    accentHex: '#4c0519'
  }
];

export const RIBBON_OPTIONS: RibbonOption[] = [
  {
    id: 'ribbon-champagne',
    name: 'Champagne Satin Silk',
    colorHex: '#fde68a',
    price: 80,
    material: 'satin'
  },
  {
    id: 'ribbon-ruby',
    name: 'Deep Crimson Velvet',
    colorHex: '#9f1239',
    price: 95,
    material: 'velvet'
  },
  {
    id: 'ribbon-dusty-pink',
    name: 'Dusty Rose Organza',
    colorHex: '#fda4af',
    price: 75,
    material: 'organza'
  },
  {
    id: 'ribbon-cream',
    name: 'Heritage Ivory Grosgrain',
    colorHex: '#fef3c7',
    price: 60,
    material: 'grosgrain'
  },
  {
    id: 'ribbon-gold',
    name: 'Metallic Dagupan Gold',
    colorHex: '#d97706',
    price: 90,
    material: 'satin'
  }
];

export const FLOWER_SHOPS: FlowerShop[] = [
  {
    id: 'shop-perez-atelier',
    name: 'Dagupan Blooms Atelier',
    street: 'Perez Boulevard (beside CSI Square)',
    barangay: 'Downtown Dagupan',
    landmark: 'Near City Plaza & CSI Market Square',
    rating: 4.9,
    reviewCount: 312,
    estimatedDeliveryMin: '30-45 mins',
    minOrder: 800,
    specialties: ['Ecuadorian Roses', 'Luxury Bridal', '3D Bouquet Studio'],
    bannerImage: '/src/assets/images/hero_bouquet_dagupan_1791819801445.jpg',
    contactNumber: '+63 (075) 522-8901',
    openingHours: '7:30 AM - 8:30 PM Daily'
  },
  {
    id: 'shop-bonuan-studio',
    name: 'Bonuan Flora & Petals Studio',
    street: 'Gueset Coastal Road',
    barangay: 'Bonuan Gueset',
    landmark: '5 mins from Bonuan Blue Beach Park',
    rating: 4.8,
    reviewCount: 184,
    estimatedDeliveryMin: '40-55 mins',
    minOrder: 750,
    specialties: ['Sunflowers', 'Rustic Burlap Wraps', 'Graduation Bouquets'],
    bannerImage: '/src/assets/images/sunflower_bouquet_dagupan_1791819815281.jpg',
    contactNumber: '+63 (075) 515-4420',
    openingHours: '8:00 AM - 7:00 PM Daily'
  },
  {
    id: 'shop-lucao-crafts',
    name: 'Bangus City Floral Crafts',
    street: 'Lucao Bypass Road',
    barangay: 'Lucao District',
    landmark: 'Across CSI The City Mall Lucao',
    rating: 4.9,
    reviewCount: 226,
    estimatedDeliveryMin: '35-50 mins',
    minOrder: 850,
    specialties: ['Korean Petite Bouquets', 'Pastel Peonies', 'Preserved Florals'],
    bannerImage: '/src/assets/images/pastel_spring_bouquet_1791819827248.jpg',
    contactNumber: '+63 (075) 523-7714',
    openingHours: '8:00 AM - 9:00 PM Daily'
  },
  {
    id: 'shop-tapuac-haven',
    name: 'Tapuac Botanical Haven',
    street: 'Arellano St. Ext.',
    barangay: 'Tapuac District',
    landmark: 'Near University of Pangasinan (PHINMA UPang)',
    rating: 4.7,
    reviewCount: 156,
    estimatedDeliveryMin: '30-45 mins',
    minOrder: 650,
    specialties: ['Student Prom Corsages', 'Budget Blooms', 'Celebration Stems'],
    bannerImage: '/src/assets/images/hero_bouquet_dagupan_1791819801445.jpg',
    contactNumber: '+63 (075) 529-3388',
    openingHours: '8:00 AM - 8:00 PM Daily'
  }
];

export const PRESET_BOUQUETS: PresetBouquet[] = [
  {
    id: 'bq-dagupan-crimson-royale',
    name: 'The Perez Boulevard Crimson Royale',
    shopId: 'shop-perez-atelier',
    shopName: 'Dagupan Blooms Atelier',
    price: 2450,
    originalPrice: 2800,
    rating: 4.95,
    reviewCount: 148,
    description: 'An opulent symphony of 12 Ecuadorian crimson roses interlaced with fragrant Casablanca lilies, baby\'s breath cloud, and fragrant eucalyptus leaves, sculpted in artisan matte rose quartz wrapping with a double champagne satin ribbon.',
    meaning: 'Profound eternal devotion, elegance, and unforgettable romantic celebration.',
    image: '/src/assets/images/hero_bouquet_dagupan_1791819801445.jpg',
    isBestSeller: true,
    occasions: ['Anniversary', 'Valentine\'s', 'Romantic Surprise', 'Proposal'],
    composition: {
      flowers: [
        { name: 'Ecuadorian Crimson Rose', count: 12, colorHex: '#be123c' },
        { name: 'Casablanca White Lily', count: 3, colorHex: '#f1f5f9' },
        { name: 'Baby\'s Breath Cloud', count: 4, colorHex: '#ffffff' },
        { name: 'Eucalyptus Cinerea', count: 4, colorHex: '#64748b' }
      ],
      wrapper: WRAPPER_OPTIONS[0],
      ribbon: RIBBON_OPTIONS[0],
      style: 'round'
    }
  },
  {
    id: 'bq-bonuan-golden-sunshine',
    name: 'Bonuan Sunburst Artisan Bouquet',
    shopId: 'shop-bonuan-studio',
    shopName: 'Bonuan Flora & Petals Studio',
    price: 1850,
    originalPrice: 2100,
    rating: 4.9,
    reviewCount: 92,
    description: 'A vibrant field bouquet of 7 radiant golden sunflowers, white matricaria sprays, and silver dollar eucalyptus enveloped in rustic earth-toned kraft wrap with a natural hessian jute bow. Captures the warm morning sun rising over Lingayen Gulf.',
    meaning: 'Unshakable happiness, academic graduation triumph, and sincere loyalty.',
    image: '/src/assets/images/sunflower_bouquet_dagupan_1791819815281.jpg',
    isBestSeller: true,
    occasions: ['Birthday', 'Graduation', 'Get Well Soon', 'Friendship'],
    composition: {
      flowers: [
        { name: 'Golden Sunflower', count: 7, colorHex: '#eab308' },
        { name: 'Baby\'s Breath Cloud', count: 3, colorHex: '#ffffff' },
        { name: 'Eucalyptus Foliage', count: 5, colorHex: '#64748b' }
      ],
      wrapper: WRAPPER_OPTIONS[1],
      ribbon: RIBBON_OPTIONS[4],
      style: 'round'
    }
  },
  {
    id: 'bq-lucao-pastel-serenade',
    name: 'Lucao Whispering Pastel Cloud',
    shopId: 'shop-lucao-crafts',
    shopName: 'Bangus City Floral Crafts',
    price: 2650,
    originalPrice: 2950,
    rating: 4.88,
    reviewCount: 76,
    description: 'Bespoke Korean aesthetic arrangement composed of powder-pink peonies, soft ivory ruffled carnations, and lilac hydrangeas encased in layered frosted vellum with an opulent lavender satin bow.',
    meaning: 'Gentle grace, deep empathy, refined luxury, and tender appreciation.',
    image: '/src/assets/images/pastel_spring_bouquet_1791819827248.jpg',
    isBestSeller: false,
    occasions: ['Mother\'s Day', 'Baby Shower', 'Birthday', 'Self Love'],
    composition: {
      flowers: [
        { name: 'Dusty Blush Rose', count: 6, colorHex: '#fb7185' },
        { name: 'Frilled Carnation', count: 6, colorHex: '#fed7aa' },
        { name: 'Cloud Hydrangea', count: 2, colorHex: '#60a5fa' },
        { name: 'Baby\'s Breath', count: 3, colorHex: '#ffffff' }
      ],
      wrapper: WRAPPER_OPTIONS[3],
      ribbon: RIBBON_OPTIONS[2],
      style: 'korean_petite'
    }
  },
  {
    id: 'bq-tapuac-midnight-velvet',
    name: 'The Tapuac Midnight Noir Rose',
    shopId: 'shop-tapuac-haven',
    shopName: 'Tapuac Botanical Haven',
    price: 2950,
    originalPrice: 3400,
    rating: 4.93,
    reviewCount: 110,
    description: '18 hand-selected deep scarlet roses against jet-black matte wrapping, tied with a dark crimson velvet ribbon. A dramatic high-fashion statement bouquet made for romantic evenings in Pangasinan.',
    meaning: 'Undying devotion, mysterious attraction, and uncompromising passion.',
    image: '/src/assets/images/hero_bouquet_dagupan_1791819801445.jpg',
    isBestSeller: false,
    occasions: ['Anniversary', 'Evening Date', 'Proposal', 'Birthday'],
    composition: {
      flowers: [
        { name: 'Ecuadorian Crimson Rose', count: 18, colorHex: '#be123c' },
        { name: 'Eucalyptus Foliage', count: 4, colorHex: '#64748b' }
      ],
      wrapper: WRAPPER_OPTIONS[2],
      ribbon: RIBBON_OPTIONS[1],
      style: 'grand_fan'
    }
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'DAG-2026-9281',
    createdAt: '2026-10-12 07:45 AM',
    customerName: 'Tristan Quinn',
    customerPhone: '+63 917 839 2011',
    recipientName: 'Alyssa Marie Fernandez',
    recipientPhone: '+63 920 541 9982',
    barangay: 'Tapuac District',
    deliveryAddress: 'Unit 4B, Arellano Residences, Tapuac',
    landmark: 'Across PHINMA University of Pangasinan Gate 2',
    deliveryDate: 'Today (Oct 12, 2026)',
    deliverySlot: '2:00 PM - 4:00 PM',
    deliveryMethod: 'trike_express',
    paymentMethod: 'GCash',
    items: [
      {
        id: 'item-ord-1',
        bouquetId: 'bq-dagupan-crimson-royale',
        name: 'The Perez Boulevard Crimson Royale',
        isCustom: false,
        unitPrice: 2450,
        quantity: 1,
        image: '/src/assets/images/hero_bouquet_dagupan_1791819801445.jpg',
        cardMessage: 'Happy 3rd Anniversary, Alyssa! Falling for you is always my favorite thing. - Tristan',
        addOns: [{ name: 'Fairy Light Twinkle String', price: 150 }]
      }
    ],
    subtotal: 2600,
    deliveryFee: 80,
    discount: 200,
    total: 2480,
    status: 'Rider Dispatched',
    riderInfo: {
      name: 'Kuya Ronald Dalisay',
      vehicle: 'Express Skygo Trike #28 (Dagupan Flora Courier)',
      contact: '+63 949 112 4099',
      currentArea: 'Cruising via Perez Blvd towards Tapuac Bridge'
    }
  },
  {
    id: 'ord-102',
    orderNumber: 'DAG-2026-9282',
    createdAt: '2026-10-12 08:15 AM',
    customerName: 'Beatriz Gomez',
    customerPhone: '+63 928 440 1932',
    recipientName: 'Dr. Roberto Gomez',
    recipientPhone: '+63 917 552 8301',
    barangay: 'Lucao District',
    deliveryAddress: 'Doctors Clinic 3, Nazareth General Hospital, Perez Blvd',
    landmark: '3rd Floor Specialist Wing',
    deliveryDate: 'Today (Oct 12, 2026)',
    deliverySlot: '11:00 AM - 1:00 PM',
    deliveryMethod: 'van_scheduled',
    paymentMethod: 'Maya',
    items: [
      {
        id: 'item-ord-2',
        bouquetId: 'bq-bonuan-golden-sunshine',
        name: 'Bonuan Sunburst Artisan Bouquet',
        isCustom: false,
        unitPrice: 1850,
        quantity: 1,
        image: '/src/assets/images/sunflower_bouquet_dagupan_1791819815281.jpg',
        cardMessage: 'Congratulations on your successful department symposium, Dad! Proud of you!',
        addOns: []
      }
    ],
    subtotal: 1850,
    deliveryFee: 120,
    discount: 0,
    total: 1970,
    status: 'Florist Arranging'
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-dagupan-01',
  name: 'Tristan Quinn',
  email: 'tristanquinn22@gmail.com',
  phone: '+63 917 839 2011',
  role: 'customer',
  defaultBarangay: 'Tapuac District',
  savedAddresses: [
    {
      id: 'addr-1',
      label: 'Home / Condo',
      barangay: 'Tapuac District',
      address: 'Unit 4B, Arellano Residences, Tapuac',
      landmark: 'Beside University of Pangasinan Gate 2'
    },
    {
      id: 'addr-2',
      label: 'Office',
      barangay: 'Downtown Dagupan',
      address: 'Suite 201, Perez Commercial Center, Perez Blvd',
      landmark: 'Across CSI Square'
    }
  ],
  savedCustomBouquets: [],
  petalPoints: 450
};
