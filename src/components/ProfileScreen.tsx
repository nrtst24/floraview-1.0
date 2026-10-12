import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Package, Heart, Sparkles, Shield, ChevronRight, LogOut, CheckCircle2, Clock, Truck, Plus } from 'lucide-react';
import { UserProfile, Order, CustomBouquetConfig } from '../types';

interface ProfileScreenProps {
  user: UserProfile | null;
  orders: Order[];
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
  onOpenCustomBuilderWithConfig: (config: CustomBouquetConfig) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  orders,
  onOpenAuth,
  onLogout,
  onOpenAdmin,
  onOpenCustomBuilderWithConfig
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'saved' | 'addresses'>('orders');

  if (!user) {
    return (
      <div className="min-h-screen pb-24 bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-serif font-bold text-stone-900 mb-1">
          Your Floral Profile
        </h2>
        <p className="text-xs text-stone-500 max-w-xs mb-6">
          Sign in to track active Dagupan bouquet dispatches, save custom 3D bouquet recipes, and earn Petal Rewards!
        </p>
        <button
          type="button"
          onClick={onOpenAuth}
          className="h-12 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 cursor-pointer"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'Received': return 1;
      case 'Florist Arranging': return 2;
      case 'Quality Checked': return 3;
      case 'Rider Dispatched': return 4;
      case 'Delivered': return 5;
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen pb-28 bg-stone-50 text-stone-900">
      <div className="max-w-4xl mx-auto px-4 pt-4 space-y-5">
        {/* User Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-rose-950 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 relative">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-rose-600/80 border border-white/20 flex items-center justify-center text-xl font-serif font-bold text-white shrink-0">
                {user.name.charAt(0)}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">{user.name}</h2>
                  {user.role === 'admin' && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] bg-amber-400 text-stone-950 font-bold uppercase">
                      Admin
                    </span>
                  )}
                </div>

                <p className="text-xs text-rose-200/80">{user.email}</p>
                <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-1">
                  <MapPin className="w-3 h-3 text-rose-400" />
                  <span>{user.defaultBarangay}, Dagupan City</span>
                </div>
              </div>
            </div>

            {/* Loyalty points card */}
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between sm:flex-col sm:items-end gap-1">
              <span className="text-[11px] text-rose-200">Petal Rewards Balance</span>
              <div className="text-base font-bold font-mono text-amber-300 flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                <span>{user.petalPoints} Petals</span>
              </div>
              <span className="text-[10px] text-stone-400">Worth ₱{user.petalPoints} off your next bouquet</span>
            </div>
          </div>

          {/* Quick Admin switch button if user has admin privileges or wants to test admin */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Switch to Florist Admin Operations</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="text-rose-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="flex border-b border-stone-200 bg-white rounded-2xl p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 text-xs font-medium rounded-xl transition-colors ${
              activeTab === 'orders' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Orders & Tracking ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2 text-xs font-medium rounded-xl transition-colors ${
              activeTab === 'saved' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            My 3D Designs ({user.savedCustomBouquets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('addresses')}
            className={`flex-1 py-2 text-xs font-medium rounded-xl transition-colors ${
              activeTab === 'addresses' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Saved Dagupan Addresses
          </button>
        </div>

        {/* TAB 1: ORDERS & LIVE TRACKING */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map(order => {
              const currentStep = getStatusStep(order.status);
              return (
                <div
                  key={order.id}
                  className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-stone-900">{order.orderNumber}</span>
                        <span className="text-xs bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded-md">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5">Placed on {order.createdAt}</p>
                    </div>

                    <div className="text-right sm:text-right">
                      <span className="text-sm font-bold font-mono text-stone-900">₱{order.total.toLocaleString()}</span>
                      <p className="text-[11px] text-stone-500">{order.paymentMethod} · {order.items.length} item(s)</p>
                    </div>
                  </div>

                  {/* Visual Tracker Timeline */}
                  <div className="py-2">
                    <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-3">
                      Live Delivery Progress (Dagupan Dispatch)
                    </span>

                    <div className="grid grid-cols-5 gap-1 text-center relative">
                      {[
                        { step: 1, label: 'Received' },
                        { step: 2, label: 'Arranging' },
                        { step: 3, label: 'Inspected' },
                        { step: 4, label: 'Dispatched' },
                        { step: 5, label: 'Delivered' }
                      ].map(s => {
                        const isDone = currentStep >= s.step;
                        const isCurrent = currentStep === s.step;

                        return (
                          <div key={s.step} className="flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 transition-colors ${
                                isDone
                                  ? 'bg-rose-600 text-white shadow-xs shadow-rose-600/30'
                                  : 'bg-stone-200 text-stone-500'
                              }`}
                            >
                              {isDone ? '✓' : s.step}
                            </div>
                            <span
                              className={`text-[10px] truncate max-w-full ${
                                isCurrent ? 'text-rose-700 font-bold' : isDone ? 'text-stone-700 font-medium' : 'text-stone-400'
                              }`}
                            >
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {order.riderInfo && order.status === 'Rider Dispatched' && (
                      <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                        <Truck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <strong>Courier on the road:</strong> {order.riderInfo.name} ({order.riderInfo.vehicle})
                          <p className="text-stone-600 mt-0.5 text-[11px]">
                            Route: {order.riderInfo.currentArea} · Contact: {order.riderInfo.contact}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium text-stone-500">×{item.quantity}</span>
                          <span className="text-stone-800 font-medium">{item.name}</span>
                        </div>
                        <span className="font-mono text-stone-900">₱{(item.unitPrice * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Recipient summary */}
                  <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl">
                    Delivering to: <strong className="text-stone-800">{order.recipientName}</strong> at {order.deliveryAddress}, {order.barangay}
                    {order.landmark && ` (${order.landmark})`}
                  </div>
                </div>
              );
            })}

            {orders.length === 0 && (
              <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
                <Package className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-stone-800">No Orders Yet</h3>
                <p className="text-xs text-stone-500 mt-1">Browse our bouquets to surprise someone in Dagupan!</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED 3D DESIGNS */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            {user.savedCustomBouquets.map(design => (
              <div
                key={design.id}
                className="p-4 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex items-center justify-between"
              >
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">{design.name}</h3>
                  <p className="text-xs text-stone-500">
                    Style: {design.style} · Wrapper: {design.wrapper.name} · Ribbon: {design.ribbon.name}
                  </p>
                  <div className="text-xs font-mono font-bold text-rose-600 mt-1">
                    ₱{design.calculatedPrice.toLocaleString()}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenCustomBuilderWithConfig(design)}
                  className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold"
                >
                  Edit in 3D
                </button>
              </div>
            ))}

            {user.savedCustomBouquets.length === 0 && (
              <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
                <Heart className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-stone-800">No Saved 3D Custom Bouquets</h3>
                <p className="text-xs text-stone-500 mt-1">Sculpt your own bouquet in the 3D Studio and save your recipe here!</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-3">
            {user.savedAddresses.map(addr => (
              <div
                key={addr.id}
                className="p-4 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">{addr.label}</span>
                  <h4 className="text-sm font-semibold text-stone-900 mt-0.5">{addr.address}</h4>
                  <p className="text-xs text-stone-500">{addr.barangay}, Dagupan City</p>
                  {addr.landmark && (
                    <p className="text-[11px] text-stone-400 mt-0.5">Landmark: {addr.landmark}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
