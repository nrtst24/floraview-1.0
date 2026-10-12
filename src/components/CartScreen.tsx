import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, Tag, Sparkles, ChevronRight, Flower2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartScreenProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: (deliveryMethod: 'trike_express' | 'van_scheduled' | 'store_pickup', promoDiscount: number) => void;
  onExploreBouquets: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onExploreBouquets
}) => {
  const [deliveryMethod, setDeliveryMethod] = useState<'trike_express' | 'van_scheduled' | 'store_pickup'>('trike_express');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const deliveryFee = deliveryMethod === 'trike_express' ? 80 : deliveryMethod === 'van_scheduled' ? 120 : 0;

  const total = Math.max(0, subtotal + deliveryFee - promoDiscount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'DAGUPANLOVE' || code === 'FIRSTBLOOM') {
      const discount = Math.round(subtotal * 0.1);
      setPromoDiscount(discount);
      setPromoMessage(`Promo code applied! ₱${discount} discount saved.`);
    } else if (code === 'BANGUSFEST') {
      const discount = 200;
      setPromoDiscount(discount);
      setPromoMessage('Bangus Festival special! ₱200 discount applied.');
    } else {
      setPromoDiscount(0);
      setPromoMessage('Invalid voucher code. Try DAGUPANLOVE or BANGUSFEST.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pb-24 bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">
          Your Floral Bag is Empty
        </h2>
        <p className="text-xs text-stone-500 max-w-xs mb-6">
          Browse our artisanal Dagupan flower collection or sculpt your bespoke 3D bouquet in the studio!
        </p>
        <button
          type="button"
          onClick={onExploreBouquets}
          className="h-12 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
        >
          Explore Fresh Dagupan Blooms
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 bg-stone-50 text-stone-900">
      <div className="max-w-4xl mx-auto px-4 pt-5 space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Shopping Cart ({items.reduce((s, i) => s + i.quantity, 0)} items)
          </h1>
          <p className="text-xs text-stone-500">
            Freshly arranged upon order at our Dagupan City Florist partner ateliers
          </p>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {items.map(item => (
            <div
              key={item.id}
              className="p-4 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {item.isCustom ? (
                      <span className="text-[10px] font-semibold text-rose-600 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-md">
                        3D Custom Design
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">
                        Atelier Signature
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-stone-900 truncate mt-0.5">
                    {item.name}
                  </h3>

                  {item.addOns && item.addOns.length > 0 && (
                    <p className="text-[11px] text-stone-500 truncate">
                      Add-ons: {item.addOns.map(a => a.name).join(', ')}
                    </p>
                  )}

                  {item.cardMessage && (
                    <p className="text-[11px] text-rose-800/80 italic line-clamp-1 mt-0.5">
                      Card attached
                    </p>
                  )}

                  <div className="text-xs font-mono font-bold text-stone-900 mt-1">
                    ₱{item.unitPrice.toLocaleString()} each
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Delete */}
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                <div className="flex items-center border border-stone-200 rounded-xl p-0.5 bg-stone-50">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold font-mono tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-sm font-bold font-mono text-stone-900 tabular-nums min-w-[70px] text-right">
                  ₱{(item.unitPrice * item.quantity).toLocaleString()}
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  aria-label="Remove item"
                  className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dagupan Delivery Method Selector */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-rose-600" />
            <span>Select Dagupan City Delivery Option</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setDeliveryMethod('trike_express')}
              className={`p-3.5 rounded-2xl border text-left transition-colors cursor-pointer ${
                deliveryMethod === 'trike_express'
                  ? 'border-rose-600 bg-rose-50/50 shadow-2xs'
                  : 'border-stone-200 bg-white hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-stone-900 mb-1">
                <span>Express Trike Courier</span>
                <span className="font-mono text-rose-600">₱80</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Direct dispatch within 2 hours across Tapuac, Lucao, and Perez Blvd.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryMethod('van_scheduled')}
              className={`p-3.5 rounded-2xl border text-left transition-colors cursor-pointer ${
                deliveryMethod === 'van_scheduled'
                  ? 'border-rose-600 bg-rose-50/50 shadow-2xs'
                  : 'border-stone-200 bg-white hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-stone-900 mb-1">
                <span>Aircon Van Delivery</span>
                <span className="font-mono text-rose-600">₱120</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Temperature-controlled van for delicate Ecuadorian roses & grand bouquets.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryMethod('store_pickup')}
              className={`p-3.5 rounded-2xl border text-left transition-colors cursor-pointer ${
                deliveryMethod === 'store_pickup'
                  ? 'border-rose-600 bg-rose-50/50 shadow-2xs'
                  : 'border-stone-200 bg-white hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-stone-900 mb-1">
                <span>Atelier Store Pick-up</span>
                <span className="font-mono text-emerald-600">Free</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Pick up in person at Perez Boulevard (beside CSI Square).
              </p>
            </button>
          </div>
        </div>

        {/* Promo Voucher Code */}
        <div className="p-4 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
          <form onSubmit={handleApplyPromo} className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Voucher code (Try DAGUPANLOVE or BANGUSFEST)"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs uppercase font-mono tracking-wider focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Apply
            </button>
          </form>

          {promoMessage && (
            <p className={`text-xs mt-2 ${promoDiscount > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
              {promoMessage}
            </p>
          )}
        </div>

        {/* Price Breakdown Summary */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-2.5">
          <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Order Financial Summary
          </h3>

          <div className="flex items-center justify-between text-xs text-stone-600">
            <span>Bouquets Subtotal</span>
            <span className="font-mono tabular-nums">₱{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-600">
            <span>Dagupan Courier Delivery</span>
            <span className="font-mono tabular-nums">₱{deliveryFee}</span>
          </div>

          {promoDiscount > 0 && (
            <div className="flex items-center justify-between text-xs text-emerald-700 font-medium">
              <span>Voucher Discount</span>
              <span className="font-mono tabular-nums">-₱{promoDiscount.toLocaleString()}</span>
            </div>
          )}

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-sm sm:text-base font-bold text-stone-900">
            <span>Estimated Total</span>
            <span className="font-mono text-rose-600 tabular-nums">₱{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          type="button"
          onClick={() => onProceedToCheckout(deliveryMethod, promoDiscount)}
          className="w-full h-13 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-600/25 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Proceed to Recipient & Delivery Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
