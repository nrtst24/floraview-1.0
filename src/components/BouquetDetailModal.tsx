import React, { useState } from 'react';
import { X, Camera, Sparkles, Heart, Star, Share2, Info, Check, Plus, Minus, ShieldCheck, Clock, MapPin } from 'lucide-react';
import { PresetBouquet } from '../types';
import { ThreeBouquetViewer } from './ThreeBouquetViewer';

interface BouquetDetailModalProps {
  bouquet: PresetBouquet | null;
  onClose: () => void;
  onOpenAR: (bouquet: PresetBouquet) => void;
  onAddToCart: (bouquet: PresetBouquet, quantity: number, cardMessage?: string, addOns?: { name: string; price: number }[]) => void;
}

export const BouquetDetailModal: React.FC<BouquetDetailModalProps> = ({
  bouquet,
  onClose,
  onOpenAR,
  onAddToCart
}) => {
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('3d');
  const [quantity, setQuantity] = useState(1);
  const [cardMessage, setCardMessage] = useState('');
  const [recipientTo, setRecipientTo] = useState('');
  const [senderFrom, setSenderFrom] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState<{ name: string; price: number }[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  if (!bouquet) return null;

  const availableAddOns = [
    { name: 'Warm Fairy Light Twinkle String', price: 150 },
    { name: 'Ferrero Rocher Chocolates (8 pcs)', price: 380 },
    { name: 'Mini Plush Teddy Bear (Cuddly White)', price: 280 },
    { name: 'Gold Foil Dagupan Celebration Ribbon', price: 120 }
  ];

  const toggleAddOn = (addOn: { name: string; price: number }) => {
    setSelectedAddOns(prev =>
      prev.some(a => a.name === addOn.name)
        ? prev.filter(a => a.name !== addOn.name)
        : [...prev, addOn]
    );
  };

  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = (bouquet.price + addOnsTotal) * quantity;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: bouquet.name,
        text: `Look at this 3D floral bouquet: ${bouquet.name} on FloraView Dagupan!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const formattedCard = cardMessage ? `To: ${recipientTo || 'Loved One'}\n\n${cardMessage}\n\nWith Love, ${senderFrom || 'Secret Admirer'}` : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-white/95 backdrop-blur-md border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-medium">{bouquet.shopName}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-xs text-emerald-700 font-semibold">Fresh in Dagupan</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleShare}
              className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-600 transition-colors"
              title="Share bouquet"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 space-y-6">
          {/* Visual Showcase (3D vs High-Res Photo Switcher) */}
          <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80">
            {viewMode === '3d' ? (
              <div className="h-80 sm:h-96 relative bg-gradient-to-b from-stone-100/50 to-stone-50">
                <ThreeBouquetViewer
                  wrapper={bouquet.composition.wrapper}
                  ribbon={bouquet.composition.ribbon}
                  style={bouquet.composition.style}
                  stems={bouquet.composition.flowers.map(f => ({
                    name: f.name,
                    count: f.count,
                    colorHex: f.colorHex
                  }))}
                  autoRotateDefault={true}
                  className="w-full h-full"
                  cameraDistance={7.2}
                />
              </div>
            ) : (
              <div className="h-80 sm:h-96 relative bg-stone-100">
                <img
                  src={bouquet.image}
                  alt={bouquet.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* View Mode Toggle Buttons */}
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-stone-900/80 backdrop-blur-md p-1 rounded-xl text-white text-xs">
              <button
                type="button"
                onClick={() => setViewMode('3d')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  viewMode === '3d' ? 'bg-rose-600 text-white font-semibold' : 'text-stone-300 hover:text-white'
                }`}
              >
                3D Model
              </button>
              <button
                type="button"
                onClick={() => setViewMode('photo')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  viewMode === 'photo' ? 'bg-rose-600 text-white font-semibold' : 'text-stone-300 hover:text-white'
                }`}
              >
                Studio Photo
              </button>
            </div>

            {/* Launch AR Button */}
            <button
              type="button"
              onClick={() => onOpenAR(bouquet)}
              className="absolute bottom-3 right-3 px-3.5 py-2 rounded-xl bg-stone-900/90 hover:bg-stone-900 text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5 text-rose-400" />
              <span>Project on Table (AR)</span>
            </button>
          </div>

          {/* Title & Price Header */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-rose-600 font-semibold tracking-wide uppercase">
                {bouquet.occasions.join(' · ')}
              </span>
              <div className="flex items-center text-xs text-amber-600 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                {bouquet.rating} ({bouquet.reviewCount} customer reviews)
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
              {bouquet.name}
            </h2>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
                ₱{bouquet.price.toLocaleString()}
              </span>
              {bouquet.originalPrice && (
                <span className="text-sm font-mono text-stone-400 line-through tabular-nums">
                  ₱{bouquet.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                In Stock at Dagupan Atelier
              </span>
            </div>
          </div>

          {/* Meaning & Floristry Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Meaning & Florist Notes
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {bouquet.description}
            </p>
            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 text-xs text-rose-900">
              <strong>Symbolism:</strong> {bouquet.meaning}
            </div>
          </div>

          {/* Stems Recipe Breakdown */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Exact Flower Recipe & Materials
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {bouquet.composition.flowers.map(f => (
                <div key={f.name} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: f.colorHex }} />
                    <span className="text-stone-700 truncate">{f.name}</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900 tabular-nums">×{f.count}</span>
                </div>
              ))}
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/60 flex items-center justify-between">
                <span className="text-stone-700">Wrapper</span>
                <span className="font-medium text-stone-900 truncate">{bouquet.composition.wrapper.name}</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/60 flex items-center justify-between">
                <span className="text-stone-700">Ribbon</span>
                <span className="font-medium text-stone-900 truncate">{bouquet.composition.ribbon.name}</span>
              </div>
            </div>
          </div>

          {/* Add-ons upgrades */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Add-on Gifts & Celebrations
            </h3>
            <div className="space-y-2">
              {availableAddOns.map(addOn => {
                const isSelected = selectedAddOns.some(a => a.name === addOn.name);
                return (
                  <button
                    key={addOn.name}
                    type="button"
                    onClick={() => toggleAddOn(addOn)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/60 text-rose-950 font-medium'
                        : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-xs">
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${isSelected ? 'border-rose-600 bg-rose-600 text-white' : 'border-stone-300'}`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                      <span>{addOn.name}</span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-stone-900 tabular-nums">
                      +₱{addOn.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Complimentary Handwritten Card */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-3">
            <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Free Handwritten Dagupan Calligraphy Card
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Recipient (To):"
                value={recipientTo}
                onChange={e => setRecipientTo(e.target.value)}
                className="p-2 text-xs bg-white rounded-lg border border-amber-200 focus:outline-hidden"
              />
              <input
                type="text"
                placeholder="From:"
                value={senderFrom}
                onChange={e => setSenderFrom(e.target.value)}
                className="p-2 text-xs bg-white rounded-lg border border-amber-200 focus:outline-hidden"
              />
            </div>
            <textarea
              rows={2}
              placeholder="Write your dedication message (e.g. Happy Anniversary! Thank you for being my constant sunshine...)"
              value={cardMessage}
              onChange={e => setCardMessage(e.target.value)}
              className="w-full p-2.5 text-xs bg-white rounded-lg border border-amber-200 focus:outline-hidden resize-none"
            />
          </div>
        </div>

        {/* Fixed Sticky Action Footer */}
        <footer className="sticky bottom-0 z-20 p-4 bg-white border-t border-stone-200 flex items-center justify-between gap-3">
          {/* Quantity stepper */}
          <div className="flex items-center border border-stone-200 rounded-xl p-1 bg-stone-50">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white disabled:opacity-30"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-bold font-mono tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            type="button"
            onClick={() => {
              onAddToCart(bouquet, quantity, formattedCard, selectedAddOns);
              onClose();
            }}
            className="flex-1 h-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Add to Cart</span>
            <span className="font-mono">· ₱{totalPrice.toLocaleString()}</span>
          </button>
        </footer>
      </div>
    </div>
  );
};
