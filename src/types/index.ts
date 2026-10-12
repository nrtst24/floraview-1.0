export interface FlowerStemOption {
  id: string;
  name: string;
  variety: string;
  colorName: string;
  colorHex: string;
  stemPrice: number;
  description: string;
  meaning: string;
  vaseLifeDays: number;
  defaultBloomSize: number;
  iconColor: string;
  inStock: boolean;
  stockCount: number;
}

export interface WrapperOption {
  id: string;
  name: string;
  colorHex: string;
  price: number;
  finish: 'matte' | 'kraft' | 'pearl' | 'velvet' | 'silk';
  accentHex: string;
}

export interface RibbonOption {
  id: string;
  name: string;
  colorHex: string;
  price: number;
  material: 'satin' | 'velvet' | 'organza' | 'grosgrain';
}

export interface FlowerShop {
  id: string;
  name: string;
  street: string;
  barangay: string;
  landmark: string;
  rating: number;
  reviewCount: number;
  estimatedDeliveryMin: string;
  minOrder: number;
  specialties: string[];
  bannerImage: string;
  contactNumber: string;
  openingHours: string;
}

export interface PresetBouquet {
  id: string;
  name: string;
  shopId: string;
  shopName: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  description: string;
  meaning: string;
  image: string;
  isBestSeller?: boolean;
  occasions: string[];
  composition: {
    flowers: { name: string; count: number; colorHex: string }[];
    wrapper: WrapperOption;
    ribbon: RibbonOption;
    style: 'round' | 'cascade' | 'korean_petite' | 'grand_fan';
  };
}

export interface CustomBouquetConfig {
  id: string;
  name: string;
  style: 'round' | 'cascade' | 'korean_petite' | 'grand_fan';
  wrapper: WrapperOption;
  ribbon: RibbonOption;
  stems: { flowerId: string; quantity: number }[];
  ribbonText?: string;
  cardMessage?: {
    to: string;
    from: string;
    message: string;
    stampStyle: string;
  };
  calculatedPrice: number;
  createdAt: string;
}

export interface CartItem {
  id: string;
  bouquetId?: string;
  name: string;
  isCustom: boolean;
  presetData?: PresetBouquet;
  customConfig?: CustomBouquetConfig;
  unitPrice: number;
  quantity: number;
  image: string;
  cardMessage?: string;
  addOns: { name: string; price: number }[];
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  recipientName: string;
  recipientPhone: string;
  barangay: string;
  deliveryAddress: string;
  landmark?: string;
  deliveryDate: string;
  deliverySlot: string;
  deliveryMethod: 'trike_express' | 'van_scheduled' | 'store_pickup';
  paymentMethod: 'GCash' | 'Maya' | 'COD' | 'BDO/BPI Bank';
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: 'Received' | 'Florist Arranging' | 'Quality Checked' | 'Rider Dispatched' | 'Delivered';
  riderInfo?: {
    name: string;
    vehicle: string;
    contact: string;
    currentArea: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  defaultBarangay: string;
  savedAddresses: {
    id: string;
    label: string;
    barangay: string;
    address: string;
    landmark?: string;
  }[];
  savedCustomBouquets: CustomBouquetConfig[];
  petalPoints: number;
}
