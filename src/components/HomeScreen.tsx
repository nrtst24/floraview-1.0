import React, { useState } from 'react';
import { Camera, Sparkles, MapPin, ChevronRight, Star, Heart, ArrowUpRight, Palette, Clock, ShieldCheck } from 'lucide-react';
import { PRESET_BOUQUETS, DAGUPAN_BARANGAYS, FLOWER_SHOPS } from '../data/mockData';
import { PresetBouquet } from '../types';
import { ThreeBouquetViewer } from './ThreeBouquetViewer';

interface HomeScreenProps {
  onSelectBouquet: (bouquet: PresetBouquet) => void;
  onOpenAR: (bouquet: PresetBouquet) => void;
  onOpenCustomBuilder: () => void;
  onSelectShop: (shopId: string) => void;
  onAddToCart: (bouquet: PresetBouquet) => void;
  selectedBarangay: string;
  onSelectBarangay: (barangay: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectBouquet,
  onOpenAR,
  onOpenCustomBuilder,
  onSelectShop,
  onAddToCart,
  selectedBarangay,
  onSelectBarangay
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = ['All', 'Romantic Roses', 'Sunflowers', 'Graduation', 'Pastel Clouds', 'Celebrations'];

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const filteredBouquets = PRESET_BOUQUETS.filter(b => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Romantic Roses') return b.composition.flowers.some(f => f.name.includes('Rose'));
    if (selectedCategory === 'Sunflowers') return b.composition.flowers.some(f => f.name.includes('Sunflower'));
    if (selectedCategory === 'Graduation') return b.occasions.includes('Graduation');
    if (selectedCategory === 'Pastel Clouds') return b.name.includes('Pastel') || b.composition.flowers.some(f => f.name.includes('Carnation') || f.name.includes('Hydrangea'));
    return true;
  });

  const heroBouquet = PRESET_BOUQUETS[0];

  return (
    <div className="min-h-screen pb-24 bg-stone-50 text-stone-900">
      {/* 1. Dagupan City Delivery Bar */}
      <div className="bg-stone-900 text-stone-200 px-4 py-2.5 text-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="text-stone-400">Delivering to:</span>
            <button
              type="button"
              onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
              className="font-medium text-white underline decoration-dotted underline-offset-2 hover:text-rose-300 transition-colors flex items-center gap-1"
            >
              <span>{selectedBarangay}</span>
              <span className="text-[10px] text-stone-400">▼</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-stone-400">
            <span>Dagupan Same-Day Delivery: Perez · Tapuac · Lucao · Bonuan</span>
          </div>
        </div>

        {/* Location selector dropdown */}
        {isLocationMenuOpen && (
          <div className="mt-2.5 p-3 bg-stone-800 rounded-2xl border border-stone-700 max-w-sm">
            <span className="text-[11px] font-semibold text-stone-300 block mb-2">Select Dagupan Barangay / District:</span>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
              {DAGUPAN_BARANGAYS.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    onSelectBarangay(b);
                    setIsLocationMenuOpen(false);
                  }}
                  className={`text-left text-xs px-2.5 py-1.5 rounded-lg truncate transition-colors ${
                    selectedBarangay === b ? 'bg-rose-600 text-white font-medium' : 'text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-5 space-y-6">
        {/* 2. Interactive 3D Hero Showcase Card */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-rose-950 text-white shadow-xl border border-stone-800">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            {/* Left Content */}
            <div className="p-6 md:p-8 md:col-span-6 flex flex-col justify-center space-y-3 z-10">
              <div className="flex items-center gap-2 text-xs text-rose-300">
                <span className="font-semibold tracking-wider uppercase text-[11px] text-rose-400">3D Interactive Floral Studio</span>
                <span aria-hidden="true">·</span>
                <span>Dagupan City</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-white leading-tight">
                Inspect Blooms in 3D. <br />
                <span className="text-rose-300 italic">Visualize in AR.</span>
              </h1>

              <p className="text-xs sm:text-sm text-stone-300 line-clamp-2">
                Spin 360°, inspect petals in high fidelity, and project onto your dining table before our Perez Boulevard florists hand-tie your order.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenAR(heroBouquet)}
                  className="h-11 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Launch AR Tabletop View</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenCustomBuilder}
                  className="h-11 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                >
                  <Palette className="w-4 h-4 text-rose-300" />
                  <span>Design Custom 3D Bouquet</span>
                </button>
              </div>

              {/* Trust signals */}
              <div className="pt-2 flex items-center gap-3 text-[11px] text-stone-400">
                <span>₱ Fresh Flowers Daily</span>
                <span aria-hidden="true">·</span>
                <span>Express Trike & Van Dispatch</span>
                <span aria-hidden="true">·</span>
                <span>4.9★ Dagupan Reviews</span>
              </div>
            </div>

            {/* Right 3D Interactive Canvas preview */}
            <div className="md:col-span-6 h-72 sm:h-80 md:h-96 relative bg-gradient-to-t from-stone-950/60 to-transparent">
              <ThreeBouquetViewer
                wrapper={heroBouquet.composition.wrapper}
                ribbon={heroBouquet.composition.ribbon}
                style={heroBouquet.composition.style}
                stems={heroBouquet.composition.flowers.map(f => ({
                  name: f.name,
                  count: f.count,
                  colorHex: f.colorHex
                }))}
                autoRotateDefault={true}
                className="w-full h-full"
                cameraDistance={7.2}
              />

              <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-rose-200 border border-stone-700/60">
                <span>Featured: Crimson Royale</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Category Filter Tabs */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900">
              Browse Dagupan Floral Collections
            </h2>
            <span className="text-xs text-stone-500">
              {filteredBouquets.length} handcrafted arrangements
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-xs font-medium rounded-xl whitespace-nowrap shrink-0 transition-colors ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* 4. Bouquet Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredBouquets.map(bouquet => (
            <div
              key={bouquet.id}
              onClick={() => onSelectBouquet(bouquet)}
              className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow cursor-pointer flex flex-col group"
            >
              {/* Image & Badges */}
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={bouquet.image}
                  alt={bouquet.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Favorite button */}
                <button
                  type="button"
                  onClick={e => toggleFavorite(bouquet.id, e)}
                  aria-label="Add to favorites"
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-stone-600 hover:text-rose-600 transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favorites.includes(bouquet.id) ? 'fill-rose-600 text-rose-600' : ''
                    }`}
                  />
                </button>

                {/* 3D & AR action trigger pill overlay */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                  <span className="bg-stone-950/75 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 font-medium">
                    <Sparkles className="w-3 h-3 text-rose-400" />
                    <span>3D View</span>
                  </span>

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onOpenAR(bouquet);
                    }}
                    className="bg-white/90 hover:bg-white text-stone-900 text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold backdrop-blur-md shadow-xs transition-colors"
                  >
                    <Camera className="w-3 h-3 text-rose-600" />
                    <span>AR Mode</span>
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                    <span>{bouquet.shopName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center text-amber-600 font-medium">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-0.5" />
                      {bouquet.rating}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-stone-900 group-hover:text-rose-600 transition-colors line-clamp-1">
                    {bouquet.name}
                  </h3>

                  <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                    {bouquet.description}
                  </p>
                </div>

                {/* Price and Add button */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-400 font-mono">₱</span>
                    <span className="text-base font-bold text-stone-900 font-mono tabular-nums">
                      {bouquet.price.toLocaleString()}
                    </span>
                    {bouquet.originalPrice && (
                      <span className="ml-1 text-[11px] text-stone-400 line-through font-mono tabular-nums">
                        ₱{bouquet.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      onAddToCart(bouquet);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>Add</span>
                    <span className="text-[10px]">+</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* 5. Custom 3D Bouquet Studio Feature Banner */}
        <section className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              Bespoke Floristry Studio
            </span>
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Can't find the exact bouquet you imagine?
            </h3>
            <p className="text-xs text-stone-600 max-w-lg">
              Pick your favorite flower stems, wrapper colors, and satin ribbons in our 3D customizer. Watch the live 3D preview render your arrangement stem by stem!
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCustomBuilder}
            className="h-11 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-2 whitespace-nowrap shadow-sm transition-colors shrink-0"
          >
            <Palette className="w-4 h-4 text-amber-400" />
            <span>Open 3D Studio</span>
          </button>
        </section>

        {/* 6. Dagupan City Partner Flower Shops */}
        <section className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900">
              Partner Florists in Dagupan City
            </h2>
            <button
              type="button"
              onClick={() => onSelectShop('all')}
              className="text-xs text-rose-600 font-medium hover:underline flex items-center"
            >
              <span>View all shops</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {FLOWER_SHOPS.map(shop => (
              <div
                key={shop.id}
                onClick={() => onSelectShop(shop.id)}
                className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs hover:border-stone-300 transition-colors cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="text-stone-900 font-semibold">{shop.barangay}</span>
                    <span className="flex items-center text-amber-600 font-medium">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-0.5" />
                      {shop.rating}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-stone-900">{shop.name}</h4>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-1">{shop.street}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span>{shop.estimatedDeliveryMin}</span>
                  </span>
                  <span className="text-rose-600 font-medium">Browse Stems →</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
