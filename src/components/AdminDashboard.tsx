import React, { useState } from 'react';
import { Shield, Package, TrendingUp, Users, CheckCircle2, Clock, Truck, ArrowLeft, RefreshCw, AlertCircle, Flower2, Plus, Minus } from 'lucide-react';
import { Order, FlowerStemOption } from '../types';
import { FLOWER_STEMS } from '../data/mockData';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
  onExitAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'riders'>('orders');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [stemsList, setStemsList] = useState<FlowerStemOption[]>(FLOWER_STEMS);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered').length;

  const filteredOrders = orders.filter(o => {
    if (statusFilter === 'all') return true;
    return o.status === statusFilter;
  });

  const handleUpdateStock = (stemId: string, delta: number) => {
    setStemsList(prev =>
      prev.map(s => (s.id === stemId ? { ...s, stockCount: Math.max(0, s.stockCount + delta) } : s))
    );
  };

  const handleToggleStock = (stemId: string) => {
    setStemsList(prev =>
      prev.map(s => (s.id === stemId ? { ...s, inStock: !s.inStock } : s))
    );
  };

  return (
    <div className="min-h-screen pb-24 bg-stone-100 text-stone-900">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-30 bg-stone-900 text-white border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onExitAdmin}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              title="Return to Customer App"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold text-white font-serif">FloraView Ops</span>
                <span className="text-[10px] font-bold bg-amber-400 text-stone-950 px-1.5 py-0.5 rounded-sm uppercase">
                  Dagupan Atelier Admin
                </span>
              </div>
              <p className="text-[11px] text-stone-400">Perez Boulevard Central Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs text-stone-400 font-mono">
              Logged in: Lead Florist Manager
            </span>
            <button
              type="button"
              onClick={onExitAdmin}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors"
            >
              Storefront View
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-6 space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
            <span className="text-xs text-stone-500 font-medium">Today's Revenue</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 mt-1">
              ₱{totalRevenue.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">Dagupan orders today</span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
            <span className="text-xs text-stone-500 font-medium">Active Arranging Orders</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-rose-600 mt-1">
              {activeOrdersCount}
            </div>
            <span className="text-[11px] text-stone-500">Pending or in transit</span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
            <span className="text-xs text-stone-500 font-medium">Fresh Stems Inventory</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 mt-1">
              {stemsList.reduce((acc, s) => acc + s.stockCount, 0)}
            </div>
            <span className="text-[11px] text-stone-500">Available cold room stems</span>
          </div>

          <div className="p-4 rounded-3xl bg-white border border-stone-200/80 shadow-2xs">
            <span className="text-xs text-stone-500 font-medium">Active Couriers</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 mt-1">
              3 Riders
            </div>
            <span className="text-[11px] text-stone-500">Skygo Trike & Van</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex border-b border-stone-200 bg-white rounded-2xl p-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Live Dagupan Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
              activeTab === 'inventory' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Flower Stems Stock Manager
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('riders')}
            className={`flex-1 py-2 text-xs font-medium rounded-xl transition-colors cursor-pointer ${
              activeTab === 'riders' ? 'bg-stone-900 text-white font-semibold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Rider & Courier Dispatch
          </button>
        </div>

        {/* 1. ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Status Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['all', 'Received', 'Florist Arranging', 'Quality Checked', 'Rider Dispatched', 'Delivered'].map(st => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                    statusFilter === st ? 'bg-stone-900 text-white font-semibold' : 'bg-white text-stone-600 border border-stone-200 hover:text-stone-900'
                  }`}
                >
                  {st === 'all' ? 'All Orders' : st}
                </button>
              ))}
            </div>

            {/* Orders Feed */}
            <div className="space-y-3.5">
              {filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-3.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-stone-900">{order.orderNumber}</span>
                        <span className="text-xs bg-stone-100 text-stone-800 font-semibold px-2.5 py-0.5 rounded-full border border-stone-200">
                          {order.status}
                        </span>
                        <span className="text-xs text-stone-400">· {order.createdAt}</span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1">
                        Customer: <strong>{order.customerName}</strong> ({order.customerPhone})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-base font-bold font-mono text-stone-900">₱{order.total.toLocaleString()}</span>
                        <p className="text-[11px] text-stone-500">{order.paymentMethod} · {order.deliveryMethod.replace('_', ' ')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Recipient & Location Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50 p-3 rounded-2xl border border-stone-100">
                    <div>
                      <span className="text-stone-400 uppercase text-[10px] font-bold">Recipient & Address</span>
                      <p className="font-semibold text-stone-800 mt-0.5">{order.recipientName} ({order.recipientPhone})</p>
                      <p className="text-stone-600">{order.deliveryAddress}, {order.barangay}</p>
                      {order.landmark && <p className="text-stone-500 italic mt-0.5">Landmark: {order.landmark}</p>}
                    </div>

                    <div>
                      <span className="text-stone-400 uppercase text-[10px] font-bold">Delivery Time Slot</span>
                      <p className="font-medium text-stone-800 mt-0.5">{order.deliveryDate}</p>
                      <p className="text-stone-600">{order.deliverySlot}</p>
                    </div>
                  </div>

                  {/* Items Specs Breakdown */}
                  <div className="space-y-1.5 text-xs">
                    <span className="text-stone-400 uppercase text-[10px] font-bold">Bouquet Recipe to Assemble</span>
                    {order.items.map(item => (
                      <div key={item.id} className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-stone-900">×{item.quantity} {item.name}</span>
                          {item.cardMessage && (
                            <p className="text-[11px] text-rose-800 italic mt-0.5">
                              Attached Calligraphy Card: "{item.cardMessage}"
                            </p>
                          )}
                          {item.addOns && item.addOns.length > 0 && (
                            <p className="text-[11px] text-amber-700 mt-0.5">
                              Add-ons: {item.addOns.map(a => a.name).join(', ')}
                            </p>
                          )}
                        </div>
                        <span className="font-mono font-semibold">₱{(item.unitPrice * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Florist Status Progression Buttons */}
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-stone-500">Update Order Workflow:</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onUpdateOrderStatus(order.id, 'Florist Arranging')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          order.status === 'Florist Arranging' ? 'bg-amber-600 text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                        }`}
                      >
                        Start Arranging
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateOrderStatus(order.id, 'Quality Checked')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          order.status === 'Quality Checked' ? 'bg-purple-600 text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                        }`}
                      >
                        Quality Checked
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateOrderStatus(order.id, 'Rider Dispatched')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          order.status === 'Rider Dispatched' ? 'bg-blue-600 text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                        }`}
                      >
                        Dispatch Rider
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateOrderStatus(order.id, 'Delivered')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          order.status === 'Delivered' ? 'bg-emerald-600 text-white' : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                        }`}
                      >
                        Mark Delivered
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. INVENTORY TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Dagupan Cold-Room Floral Stock</h3>
                <p className="text-xs text-stone-500">Update available stems delivered daily from Benguet and international growers.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {stemsList.map(stem => (
                <div
                  key={stem.id}
                  className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${stem.colorHex}22`, border: `1.5px solid ${stem.colorHex}` }}
                    >
                      <Flower2 className="w-5 h-5" style={{ color: stem.colorHex }} />
                    </div>

                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-stone-900">{stem.name}</h4>
                      <p className="text-[11px] text-stone-500">{stem.variety} · ₱{stem.stemPrice}/stem</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-stone-500">Stock Count</span>
                      <div className="text-base font-bold font-mono text-stone-900">{stem.stockCount} stems</div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleUpdateStock(stem.id, -5)}
                        className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center text-xs"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStock(stem.id, 10)}
                        className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center text-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStock(stem.id)}
                        className={`ml-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                          stem.inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {stem.inStock ? 'Active' : 'Paused'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. RIDERS TAB */}
        {activeTab === 'riders' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  On Active Dispatch
                </span>
                <span className="text-xs text-stone-400 font-mono">Trike #28</span>
              </div>
              <h3 className="text-base font-bold text-stone-900">Kuya Ronald Dalisay</h3>
              <p className="text-xs text-stone-600">Vehicle: Skygo Express Trike with insulated floral carrier box</p>
              <p className="text-xs text-stone-500">Contact: +63 949 112 4099</p>
              <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-700">
                Current Location: Cruising Perez Blvd towards Tapuac Bridge
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                  Available at Hub
                </span>
                <span className="text-xs text-stone-400 font-mono">Van #04</span>
              </div>
              <h3 className="text-base font-bold text-stone-900">Kuya Jun Fernandez</h3>
              <p className="text-xs text-stone-600">Vehicle: Aircon Delivery Van (Chilled 16°C)</p>
              <p className="text-xs text-stone-500">Contact: +63 949 881 2044</p>
              <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-700">
                Current Location: Waiting at Perez Blvd Atelier loading dock
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
