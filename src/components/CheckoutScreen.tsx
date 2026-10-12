import React, { useState } from 'react';
import { ArrowLeft, Check, ShieldCheck, MapPin, Calendar, Clock, CreditCard, Sparkles, Phone, User, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Order, UserProfile } from '../types';
import { DAGUPAN_BARANGAYS } from '../data/mockData';

interface CheckoutScreenProps {
  items: CartItem[];
  deliveryMethod: 'trike_express' | 'van_scheduled' | 'store_pickup';
  promoDiscount: number;
  user: UserProfile | null;
  onBackToCart: () => void;
  onOrderComplete: (order: Order) => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  items,
  deliveryMethod,
  promoDiscount,
  user,
  onBackToCart,
  onOrderComplete
}) => {
  const [recipientName, setRecipientName] = useState('Alyssa Marie Fernandez');
  const [recipientPhone, setRecipientPhone] = useState('+63 920 541 9982');
  const [barangay, setBarangay] = useState(user?.defaultBarangay || 'Tapuac District');
  const [address, setAddress] = useState('Unit 4B, Arellano Residences, Tapuac');
  const [landmark, setLandmark] = useState('Beside PHINMA University of Pangasinan Gate 2');
  const [deliveryDate, setDeliveryDate] = useState('Today (Same-Day Express)');
  const [deliverySlot, setDeliverySlot] = useState('2:00 PM - 4:00 PM (Afternoon)');
  const [paymentMethod, setPaymentMethod] = useState<'GCash' | 'Maya' | 'COD' | 'BDO/BPI Bank'>('GCash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = deliveryMethod === 'trike_express' ? 80 : deliveryMethod === 'van_scheduled' ? 120 : 0;
  const total = Math.max(0, subtotal + deliveryFee - promoDiscount);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `DAG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
        customerName: user?.name || 'Tristan Quinn',
        customerPhone: user?.phone || '+63 917 839 2011',
        recipientName,
        recipientPhone,
        barangay,
        deliveryAddress: address,
        landmark,
        deliveryDate,
        deliverySlot,
        deliveryMethod,
        paymentMethod,
        items,
        subtotal,
        deliveryFee,
        discount: promoDiscount,
        total,
        status: 'Received',
        riderInfo: {
          name: 'Kuya Jun (Dagupan Flora Dispatch)',
          vehicle: 'Skygo Express Trike #19',
          contact: '+63 949 881 2044',
          currentArea: 'Perez Blvd Florist Atelier'
        }
      };

      // Confetti burst
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Fallback safe
      }

      setIsSubmitting(false);
      setConfirmedOrder(newOrder);
      onOrderComplete(newOrder);
    }, 1200);
  };

  if (confirmedOrder) {
    return (
      <div className="min-h-screen pb-24 bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 animate-bounce">
          <CheckCircle2 className="w-10 h-10 stroke-[2]" />
        </div>

        <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
          Dagupan City Order Placed
        </span>
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
          Salamat! Your Bouquet is Confirmed.
        </h2>
        <p className="text-xs text-stone-600 max-w-sm mb-4">
          Our florists at Perez Boulevard have received your order ticket <strong>{confirmedOrder.orderNumber}</strong>. We will hand-tie the stems and dispatch via local courier.
        </p>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 max-w-sm w-full text-left space-y-2 mb-6 text-xs">
          <div className="flex justify-between text-stone-500">
            <span>Tracking Code:</span>
            <span className="font-mono font-bold text-stone-900">{confirmedOrder.orderNumber}</span>
          </div>
          <div className="flex justify-between text-stone-500">
            <span>Recipient:</span>
            <span className="font-medium text-stone-800">{confirmedOrder.recipientName} ({confirmedOrder.barangay})</span>
          </div>
          <div className="flex justify-between text-stone-500">
            <span>Payment Mode:</span>
            <span className="font-medium text-stone-800">{confirmedOrder.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-stone-500 pt-2 border-t border-stone-100 font-bold text-stone-900">
            <span>Total Amount:</span>
            <span className="font-mono text-rose-600 text-sm">₱{confirmedOrder.total.toLocaleString()}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToCart}
          className="h-12 px-6 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-lg shadow-stone-900/20 cursor-pointer"
        >
          View Order in Profile & Live Tracker
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 bg-stone-50 text-stone-900">
      <div className="max-w-3xl mx-auto px-4 pt-4 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToCart}
            className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:text-stone-900"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-serif font-bold text-stone-900">
              Checkout & Delivery Details
            </h1>
            <p className="text-xs text-stone-500">
              Dagupan City, Pangasinan
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="space-y-4">
          {/* Section 1: Recipient Details */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-3.5">
            <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-600" />
              <span>Recipient Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">Recipient's Full Name</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={e => setRecipientName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">Mobile Contact (+63 9xx)</label>
                <input
                  type="tel"
                  required
                  value={recipientPhone}
                  onChange={e => setRecipientPhone(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">Dagupan City Barangay</label>
              <select
                value={barangay}
                onChange={e => setBarangay(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:bg-white"
              >
                {DAGUPAN_BARANGAYS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">Street Address, Unit / House No.</label>
              <input
                type="text"
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-600 mb-1">Dagupan Landmark (Helps Rider Dispatch)</label>
              <input
                type="text"
                value={landmark}
                onChange={e => setLandmark(e.target.value)}
                placeholder="e.g. Near CSI Square, across PHINMA UPang Gate 2"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:bg-white"
              />
            </div>
          </div>

          {/* Section 2: Delivery Schedule */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-3.5">
            <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-600" />
              <span>Preferred Delivery Time</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">Delivery Date</label>
                <select
                  value={deliveryDate}
                  onChange={e => setDeliveryDate(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:bg-white"
                >
                  <option value="Today (Same-Day Express)">Today (Same-Day Express)</option>
                  <option value="Tomorrow (Morning)">Tomorrow</option>
                  <option value="This Weekend">This Coming Saturday / Sunday</option>
                  <option value="Special Date (Scheduled)">Custom Milestone Date</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">Time Slot Window</label>
                <select
                  value={deliverySlot}
                  onChange={e => setDeliverySlot(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:bg-white"
                >
                  <option value="9:00 AM - 11:30 AM (Morning Sunshine)">9:00 AM - 11:30 AM (Morning Sunshine)</option>
                  <option value="2:00 PM - 4:00 PM (Afternoon)">2:00 PM - 4:00 PM (Afternoon Dispatch)</option>
                  <option value="5:00 PM - 7:30 PM (Sunset Romance)">5:00 PM - 7:30 PM (Sunset Romance)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-3.5">
            <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-rose-600" />
              <span>Select Payment Method</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['GCash', 'Maya', 'COD', 'BDO/BPI Bank'] as const).map(m => {
                const isSelected = paymentMethod === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPaymentMethod(m)}
                    className={`p-3 rounded-2xl border text-center transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-rose-600 bg-rose-50 text-rose-950 font-bold shadow-2xs'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <div className="text-xs">{m}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">
                      {m === 'GCash' && 'Instant QR / E-Wallet'}
                      {m === 'Maya' && 'Digital Wallet'}
                      {m === 'COD' && 'Cash on Delivery'}
                      {m === 'BDO/BPI Bank' && 'Online Transfer'}
                    </div>
                  </button>
                );
              })}
            </div>

            {paymentMethod === 'GCash' && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>GCash verified merchant: <strong>FloraView Dagupan Atelier (0917-522-8901)</strong></span>
              </div>
            )}
          </div>

          {/* Section 4: Order Summary Review */}
          <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Items Total ({items.length} arrangements)</span>
              <span className="font-mono font-medium">₱{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Dagupan Courier</span>
              <span className="font-mono font-medium">₱{deliveryFee}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Voucher Discount</span>
                <span className="font-mono font-medium">-₱{promoDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-2 border-t border-stone-100 flex justify-between text-sm sm:text-base font-bold text-stone-900">
              <span>Total to Pay</span>
              <span className="font-mono text-rose-600">₱{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-13 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-600/25 active:scale-[0.98] transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <span>Dispatching Order to Atelier...</span>
            ) : (
              <span>Confirm Order & Dispatch to Perez Blvd (₱{total.toLocaleString()})</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
