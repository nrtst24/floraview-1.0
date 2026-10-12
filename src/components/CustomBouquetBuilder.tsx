import React, { useState, useMemo } from 'react';
import { Camera, Sparkles, Plus, Minus, Check, RefreshCw, ShoppingBag, Heart, Palette, Info } from 'lucide-react';
import { ThreeBouquetViewer } from './ThreeBouquetViewer';
import { FLOWER_STEMS, WRAPPER_OPTIONS, RIBBON_OPTIONS } from '../data/mockData';
import { WrapperOption, RibbonOption, CustomBouquetConfig } from '../types';

interface CustomBouquetBuilderProps {
  onAddToCart: (customConfig: CustomBouquetConfig) => void;
  onOpenAR: (customConfig: CustomBouquetConfig) => void;
  onSaveToProfile: (customConfig: CustomBouquetConfig) => void;
  initialStemId?: string;
}

export const CustomBouquetBuilder: React.FC<CustomBouquetBuilderProps> = ({
  onAddToCart,
  onOpenAR,
  onSaveToProfile,
  initialStemId
}) => {
  const [activeTab, setActiveTab] = useState<'stems' | 'wrapper' | 'ribbon' | 'card'>('stems');
  const [bouquetName, setBouquetName] = useState('My Dagupan Bespoke Arrangement');
  const [style, setStyle] = useState<'round' | 'cascade' | 'korean_petite' | 'grand_fan'>('round');
  const [selectedWrapper, setSelectedWrapper] = useState<WrapperOption>(WRAPPER_OPTIONS[0]);
  const [selectedRibbon, setSelectedRibbon] = useState<RibbonOption>(RIBBON_OPTIONS[0]);

  // Stems selection: map of flowerId -> quantity
  const [selectedStems, setSelectedStems] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {
      'stem-rose-red': 8,
      'stem-lily-white': 2,
      'stem-babys-breath': 3,
      'stem-eucalyptus': 2
    };
    if (initialStemId && !initial[initialStemId]) {
      initial[initialStemId] = 5;
    }
    return initial;
  });

  const [toName, setToName] = useState('');
  const [fromName, setFromName] = useState('');
  const [cardMessage, setCardMessage] = useState('');
  const [stampStyle, setStampStyle] = useState('Floral Wax Seal');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Calculate live stem count and total price
  const totalStemsCount = useMemo(() => {
    return Object.values(selectedStems).reduce((sum, count) => sum + count, 0);
  }, [selectedStems]);

  const stemsCost = useMemo(() => {
    return Object.entries(selectedStems).reduce((sum, [stemId, count]) => {
      const stemObj = FLOWER_STEMS.find(s => s.id === stemId);
      return sum + (stemObj ? stemObj.stemPrice * count : 0);
    }, 0);
  }, [selectedStems]);

  const calculatedPrice = useMemo(() => {
    const baseAssemblyFee = 250; // Florist artisan arrangement fee
    return baseAssemblyFee + stemsCost + selectedWrapper.price + selectedRibbon.price;
  }, [stemsCost, selectedWrapper, selectedRibbon]);

  // Flattened stems for 3D Viewer
  const viewerStems = useMemo(() => {
    return Object.entries(selectedStems)
      .filter(([_, count]) => count > 0)
      .map(([stemId, count]) => {
        const flower = FLOWER_STEMS.find(s => s.id === stemId)!;
        return {
          name: flower.name,
          count,
          colorHex: flower.colorHex,
          variety: flower.variety
        };
      });
  }, [selectedStems]);

  const handleUpdateStem = (stemId: string, delta: number) => {
    setSelectedStems(prev => {
      const current = prev[stemId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [stemId]: next };
    });
  };

  const handleReset = () => {
    setSelectedStems({
      'stem-rose-red': 8,
      'stem-lily-white': 2,
      'stem-babys-breath': 3,
      'stem-eucalyptus': 2
    });
    setSelectedWrapper(WRAPPER_OPTIONS[0]);
    setSelectedRibbon(RIBBON_OPTIONS[0]);
    setStyle('round');
  };

  const currentCustomConfig: CustomBouquetConfig = {
    id: `custom-${Date.now()}`,
    name: bouquetName,
    style,
    wrapper: selectedWrapper,
    ribbon: selectedRibbon,
    stems: Object.entries(selectedStems)
      .filter(([_, q]) => q > 0)
      .map(([flowerId, quantity]) => ({ flowerId, quantity })),
    cardMessage: cardMessage ? { to: toName, from: fromName, message: cardMessage, stampStyle } : undefined,
    calculatedPrice,
    createdAt: new Date().toLocaleDateString()
  };

  const handleSave = () => {
    onSaveToProfile(currentCustomConfig);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen pb-24 bg-stone-50 text-stone-900">
      <div className="max-w-6xl mx-auto px-4 pt-4 space-y-5">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs text-rose-600 font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D Customizer Studio · Perez Blvd Atelier</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              Sculpt Your Bespoke Bouquet
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-medium text-stone-600 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 flex items-center gap-1.5 transition-colors"
            >
              <Heart className="w-3 h-3" />
              <span>{saveSuccess ? 'Saved!' : 'Save Preset'}</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenAR(currentCustomConfig)}
              className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Camera className="w-3.5 h-3.5 text-rose-400" />
              <span>View in AR</span>
            </button>
          </div>
        </div>

        {/* Studio Grid: 3D Canvas on Left, Controls on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: 3D Preview Canvas */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden sticky top-20">
            {/* Canvas Header */}
            <div className="p-3.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <input
                type="text"
                value={bouquetName}
                onChange={e => setBouquetName(e.target.value)}
                className="text-xs sm:text-sm font-semibold text-stone-800 bg-transparent border-b border-dashed border-stone-300 hover:border-stone-500 focus:border-rose-500 focus:outline-hidden max-w-xs"
              />

              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500">{totalStemsCount} stems</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="font-mono font-bold text-stone-900">₱{calculatedPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Live 3D Scene */}
            <div className="h-80 sm:h-96 md:h-[420px] relative bg-radial from-stone-50 via-stone-100/70 to-stone-200/40">
              <ThreeBouquetViewer
                wrapper={selectedWrapper}
                ribbon={selectedRibbon}
                style={style}
                stems={viewerStems}
                autoRotateDefault={true}
                className="w-full h-full"
                cameraDistance={7.2}
              />
            </div>

            {/* Quick 3D Style Switcher Strip */}
            <div className="p-3 border-t border-stone-100 bg-stone-50 flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">Bouquet Shape:</span>
              <div className="flex items-center gap-1">
                {(['round', 'cascade', 'korean_petite', 'grand_fan'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStyle(s)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                      style === s ? 'bg-stone-900 text-white font-medium' : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
                    }`}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Customization Builder Tabs */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden flex flex-col">
            {/* Step Tabs */}
            <div className="flex border-b border-stone-200 bg-stone-50">
              <button
                type="button"
                onClick={() => setActiveTab('stems')}
                className={`flex-1 py-3 text-xs font-medium text-center transition-colors border-b-2 ${
                  activeTab === 'stems'
                    ? 'border-rose-600 text-rose-700 bg-white font-semibold'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                1. Stems ({totalStemsCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('wrapper')}
                className={`flex-1 py-3 text-xs font-medium text-center transition-colors border-b-2 ${
                  activeTab === 'wrapper'
                    ? 'border-rose-600 text-rose-700 bg-white font-semibold'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                2. Wrapping
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ribbon')}
                className={`flex-1 py-3 text-xs font-medium text-center transition-colors border-b-2 ${
                  activeTab === 'ribbon'
                    ? 'border-rose-600 text-rose-700 bg-white font-semibold'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                3. Ribbon
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`flex-1 py-3 text-xs font-medium text-center transition-colors border-b-2 ${
                  activeTab === 'card'
                    ? 'border-rose-600 text-rose-700 bg-white font-semibold'
                    : 'border-transparent text-stone-600 hover:text-stone-900'
                }`}
              >
                4. Message
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-4 sm:p-5 max-h-[500px] overflow-y-auto space-y-4">
              {/* TAB 1: STEMS */}
              {activeTab === 'stems' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>Select quantities for each fresh flower stem:</span>
                    <span>Total: <strong className="text-stone-900">{totalStemsCount} stems</strong></span>
                  </div>

                  <div className="space-y-2">
                    {FLOWER_STEMS.map(stem => {
                      const qty = selectedStems[stem.id] || 0;
                      return (
                        <div
                          key={stem.id}
                          className={`p-3 rounded-2xl border transition-colors flex items-center justify-between ${
                            qty > 0 ? 'border-rose-200 bg-rose-50/40' : 'border-stone-200/80 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center shadow-xs"
                              style={{ backgroundColor: `${stem.colorHex}22`, border: `2px solid ${stem.colorHex}` }}
                            >
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stem.colorHex }} />
                            </div>

                            <div>
                              <h4 className="text-xs sm:text-sm font-semibold text-stone-900">{stem.name}</h4>
                              <p className="text-[11px] text-stone-500 font-mono">
                                ₱{stem.stemPrice} / stem · {stem.meaning.split(',')[0]}
                              </p>
                            </div>
                          </div>

                          {/* Stepper */}
                          <div className="flex items-center border border-stone-200 rounded-xl p-0.5 bg-white shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleUpdateStem(stem.id, -1)}
                              disabled={qty <= 0}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-25"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold font-mono tabular-nums">
                              {qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateStem(stem.id, 1)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-stone-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: WRAPPER */}
              {activeTab === 'wrapper' && (
                <div className="space-y-3">
                  <span className="text-xs text-stone-500 block">
                    Choose artisanal wrapping paper crafted for Dagupan tropical humidity:
                  </span>

                  <div className="grid grid-cols-2 gap-2.5">
                    {WRAPPER_OPTIONS.map(wrap => {
                      const isSelected = selectedWrapper.id === wrap.id;
                      return (
                        <button
                          key={wrap.id}
                          type="button"
                          onClick={() => setSelectedWrapper(wrap)}
                          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? 'border-rose-600 bg-rose-50/50 shadow-xs'
                              : 'border-stone-200/80 bg-white hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div
                              className="w-7 h-7 rounded-full shadow-inner border border-stone-200"
                              style={{ backgroundColor: wrap.colorHex }}
                            />
                            {isSelected && <Check className="w-4 h-4 text-rose-600" />}
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold text-stone-900">{wrap.name}</h4>
                            <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                              <span className="capitalize">{wrap.finish} finish</span>
                              <span className="font-mono font-medium">₱{wrap.price}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: RIBBON */}
              {activeTab === 'ribbon' && (
                <div className="space-y-3">
                  <span className="text-xs text-stone-500 block">
                    Select tailored satin ribbon for the handle waist bow:
                  </span>

                  <div className="grid grid-cols-2 gap-2.5">
                    {RIBBON_OPTIONS.map(rib => {
                      const isSelected = selectedRibbon.id === rib.id;
                      return (
                        <button
                          key={rib.id}
                          type="button"
                          onClick={() => setSelectedRibbon(rib)}
                          className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? 'border-rose-600 bg-rose-50/50 shadow-xs'
                              : 'border-stone-200/80 bg-white hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div
                              className="w-7 h-7 rounded-full shadow-inner border border-stone-200"
                              style={{ backgroundColor: rib.colorHex }}
                            />
                            {isSelected && <Check className="w-4 h-4 text-rose-600" />}
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold text-stone-900">{rib.name}</h4>
                            <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                              <span className="capitalize">{rib.material}</span>
                              <span className="font-mono font-medium">₱{rib.price}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: CARD & MESSAGE */}
              {activeTab === 'card' && (
                <div className="space-y-3.5">
                  <span className="text-xs text-stone-500 block">
                    Complimentary calligraphy gift card tied to your stems:
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">To (Recipient)</label>
                      <input
                        type="text"
                        placeholder="e.g. Alyssa Fernandez"
                        value={toName}
                        onChange={e => setToName(e.target.value)}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">From</label>
                      <input
                        type="text"
                        placeholder="e.g. Tristan"
                        value={fromName}
                        onChange={e => setFromName(e.target.value)}
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Heartfelt Message</label>
                    <textarea
                      rows={3}
                      placeholder="Write your note here... (e.g. Always grateful for your warmth and laughter.)"
                      value={cardMessage}
                      onChange={e => setCardMessage(e.target.value)}
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">Seal Stamp</label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {['Floral Wax Seal', 'Gold Foil Star', 'Pangasinan Crest'].map(stamp => (
                        <button
                          key={stamp}
                          type="button"
                          onClick={() => setStampStyle(stamp)}
                          className={`p-2 rounded-xl text-center border text-[11px] transition-colors ${
                            stampStyle === stamp ? 'border-amber-600 bg-amber-50 text-amber-900 font-semibold' : 'border-stone-200 bg-stone-50 text-stone-600'
                          }`}
                        >
                          {stamp}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action Strip */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-stone-400">Total Price</span>
                <div className="text-lg font-bold font-mono text-stone-900 tabular-nums">
                  ₱{calculatedPrice.toLocaleString()}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onAddToCart(currentCustomConfig)}
                disabled={totalStemsCount === 0}
                className="flex-1 max-w-xs h-11 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add 3D Bouquet to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
