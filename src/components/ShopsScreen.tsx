import React, { useState } from 'react';
import { Search, MapPin, Star, Clock, Phone, Sparkles, Filter, ChevronRight, Flower2 } from 'lucide-react';
import { FLOWER_SHOPS, PRESET_BOUQUETS, FLOWER_STEMS } from '../data/mockData';
import { PresetBouquet, FlowerShop, FlowerStemOption } from '../types';

interface ShopsScreenProps {
  onSelectBouquet: (bouquet: PresetBouquet) => void;
  onOpenAR: (bouquet: PresetBouquet) => void;
  onAddToCart: (bouquet: PresetBouquet) => void;
  onOpenCustomBuilder: (prefillStemId?: string) => void;
  initialShopId?: string;
}

export const ShopsScreen: React.FC<ShopsScreenProps> = ({
  onSelectBouquet,
  onOpenAR,
  onAddToCart,
  onOpenCustomBuilder,
  initialShopId
}) => {
  const [activeTab, setActiveTab] = useState<'bouquets' | 'shops' | 'stems'>('bouquets');
  const [selectedShopFilter, setSelectedShopFilter] = useState<string>(initialShopId && initialShopId !== 'all' ? initialShopId : 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<'all' | 'under1800' | '1800-2500' | 'above2500'>('all');
  const [selectedFlowerType, setSelectedFlowerType] = useState<string>('all');

  // Filtered bouquets
  const filteredBouquets = PRESET_BOUQUETS.filter(b => {
    if (selectedShopFilter !== 'all' && b.shopId !== selectedShopFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q) || b.shopName.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (priceRange === 'under1800' && b.price >= 1800) return false;
    if (priceRange === '1800-2500' && (b.price < 1800 || b.price > 2500)) return false;
    if (priceRange === 'above2500' && b.price <= 2500) return false;

    if (selectedFlowerType !== 'all') {
      const hasFlower = b.composition.flowers.some(f => f.name.toLowerCase().includes(selectedFlowerType.toLowerCase()));
      if (!hasFlower) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen pb-24 bg-stone-50 text-stone-900">
      <div className="max-w-6xl mx-auto px-4 pt-4 space-y-5">
        {/* Title & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Dagupan Flower Shops & Stems
            </h1>
            <p className="text-xs text-stone-500">
              Browse verified local florists in Perez Blvd, Lucao, Tapuac & Bonuan
            </p>
          </div>

          {/* Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl max-w-sm">
            <button
              type="button"
              onClick={() => setActiveTab('bouquets')}
              className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'bouquets' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Bouquets
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('shops')}
              className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'shops' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Florist Shops
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('stems')}
              className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === 'stems' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Raw Stems
            </button>
          </div>
        </div>

        {/* Search Bar & Filters */}
        <div className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search flowers, shop name, or occasion (e.g. Roses, Bonuan, Birthday)..."
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-rose-500 focus:bg-white"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <div className="flex items-center gap-1 text-xs text-stone-500 mr-2">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            {/* Shop filter dropdown */}
            <select
              value={selectedShopFilter}
              onChange={e => setSelectedShopFilter(e.target.value)}
              className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-700"
            >
              <option value="all">All Dagupan Shops</option>
              {FLOWER_SHOPS.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.barangay})</option>
              ))}
            </select>

            {/* Price filter dropdown */}
            <select
              value={priceRange}
              onChange={e => setPriceRange(e.target.value as any)}
              className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-700"
            >
              <option value="all">Any Price</option>
              <option value="under1800">Under ₱1,800</option>
              <option value="1800-2500">₱1,800 – ₱2,500</option>
              <option value="above2500">Above ₱2,500</option>
            </select>

            {/* Flower type */}
            <select
              value={selectedFlowerType}
              onChange={e => setSelectedFlowerType(e.target.value)}
              className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-700"
            >
              <option value="all">All Flower Stems</option>
              <option value="Rose">Roses</option>
              <option value="Sunflower">Sunflowers</option>
              <option value="Lily">Lilies</option>
              <option value="Carnation">Carnations</option>
              <option value="Hydrangea">Hydrangeas</option>
            </select>
          </div>
        </div>

        {/* 1. TAB: BOUQUETS */}
        {activeTab === 'bouquets' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredBouquets.map(bouquet => (
                <div
                  key={bouquet.id}
                  onClick={() => onSelectBouquet(bouquet)}
                  className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow cursor-pointer flex flex-col group"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                    <img
                      src={bouquet.image}
                      alt={bouquet.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute top-2.5 left-2.5 bg-stone-900/80 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
                      {bouquet.shopName.split(' ')[0]}
                    </div>

                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onOpenAR(bouquet);
                      }}
                      className="absolute bottom-2.5 right-2.5 bg-white/95 hover:bg-white text-stone-900 text-[10px] px-2.5 py-1 rounded-lg font-semibold shadow-xs flex items-center gap-1 backdrop-blur-md"
                    >
                      <Sparkles className="w-3 h-3 text-rose-600" />
                      <span>AR Inspect</span>
                    </button>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="text-sm font-semibold text-stone-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                        {bouquet.name}
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                        {bouquet.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-stone-400 font-mono">₱</span>
                        <span className="text-base font-bold text-stone-900 font-mono tabular-nums">
                          {bouquet.price.toLocaleString()}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onAddToCart(bouquet);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
                      >
                        Order
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredBouquets.length === 0 && (
              <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
                <Flower2 className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-stone-800">No flower bouquets matched your criteria</h3>
                <p className="text-xs text-stone-500 mt-1">Try resetting the filters or check another Dagupan flower shop.</p>
              </div>
            )}
          </div>
        )}

        {/* 2. TAB: FLORIST SHOPS */}
        {activeTab === 'shops' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FLOWER_SHOPS.map(shop => (
              <div
                key={shop.id}
                className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row"
              >
                <div className="sm:w-48 h-40 sm:h-auto relative bg-stone-100 shrink-0">
                  <img
                    src={shop.bannerImage}
                    alt={shop.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-stone-900/80 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
                    Verified Atelier
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-rose-600">{shop.barangay}</span>
                      <div className="flex items-center text-xs text-amber-600 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                        {shop.rating} ({shop.reviewCount})
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-stone-900 mt-1">{shop.name}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">{shop.street}</p>

                    <div className="mt-2 text-xs text-stone-600 flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>{shop.openingHours}</span>
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs text-stone-500">
                      <span>Specialties:</span>
                      <span className="text-stone-700 font-medium">{shop.specialties.join(', ')}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-500">
                      Delivery: <strong className="text-stone-800">{shop.estimatedDeliveryMin}</strong>
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedShopFilter(shop.id);
                        setActiveTab('bouquets');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                    >
                      <span>View Floral Menu</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. TAB: RAW STEMS CATALOG */}
        {activeTab === 'stems' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/60 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-rose-950">Looking to craft your bespoke arrangement?</h3>
                <p className="text-xs text-rose-700">Pick any fresh stem below and open it directly in our real-time 3D Bouquet Customizer!</p>
              </div>
              <button
                type="button"
                onClick={() => onOpenCustomBuilder()}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
              >
                Open 3D Builder
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {FLOWER_STEMS.map(stem => (
                <div
                  key={stem.id}
                  className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                      style={{ backgroundColor: `${stem.colorHex}22`, border: `1.5px solid ${stem.colorHex}` }}
                    >
                      <Flower2 className="w-5 h-5" style={{ color: stem.colorHex }} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-stone-900">{stem.name}</h4>
                        <span className="text-xs font-mono font-bold text-stone-900">
                          ₱{stem.stemPrice}/stem
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500">{stem.variety} · {stem.colorName}</p>
                      <p className="text-xs text-stone-600 mt-1 line-clamp-2">{stem.description}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div className="text-stone-500 text-[11px]">
                      <span>Vase Life: <strong>{stem.vaseLifeDays} days</strong></span>
                      <span className="mx-1.5">·</span>
                      <span className="text-emerald-700 font-medium">{stem.stockCount} in stock</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenCustomBuilder(stem.id)}
                      className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-medium text-xs transition-colors"
                    >
                      Add in 3D
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
