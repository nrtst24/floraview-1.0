import React from 'react';
import { ShoppingBag, Sparkles, MapPin, Shield } from 'lucide-react';
import { UserProfile } from '../types';

interface MobileTopHeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  cartCount: number;
  user: UserProfile | null;
  onOpenAuth: () => void;
  selectedBarangay: string;
  onSelectBarangay: (barangay: string) => void;
}

export const MobileTopHeader: React.FC<MobileTopHeaderProps> = ({
  currentTab,
  onSelectTab,
  cartCount,
  user,
  onOpenAuth,
  selectedBarangay
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className="text-left whitespace-nowrap shrink-0 group flex items-center gap-1.5 cursor-pointer"
        >
          <span className="text-lg font-serif font-bold text-stone-900 group-hover:text-rose-600 transition-colors">
            FloraView
          </span>
          <span className="text-xs text-rose-600 font-sans font-semibold">Dagupan</span>
        </button>

        {/* Zone 2: Concise Navigation / Dagupan Location Indicator */}
        <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className={`whitespace-nowrap shrink-0 hover:text-stone-900 transition-colors cursor-pointer ${
              currentTab === 'home' ? 'text-rose-600 font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('shops')}
            className={`whitespace-nowrap shrink-0 hover:text-stone-900 transition-colors cursor-pointer ${
              currentTab === 'shops' ? 'text-rose-600 font-semibold' : ''
            }`}
          >
            Shops
          </button>
          <button
            type="button"
            onClick={() => onSelectTab('builder')}
            className={`whitespace-nowrap shrink-0 hover:text-stone-900 transition-colors cursor-pointer ${
              currentTab === 'builder' ? 'text-rose-600 font-semibold' : ''
            }`}
          >
            3D Studio
          </button>
          {user?.role === 'admin' && (
            <button
              type="button"
              onClick={() => onSelectTab('admin')}
              className={`whitespace-nowrap shrink-0 hover:text-stone-900 transition-colors cursor-pointer ${
                currentTab === 'admin' ? 'text-stone-950 font-bold' : ''
              }`}
            >
              Admin Operations
            </button>
          )}
        </div>

        {/* Mobile quick barangay ticker */}
        <div className="sm:hidden flex items-center text-xs text-stone-500 truncate max-w-[140px]">
          <MapPin className="w-3.5 h-3.5 text-rose-500 mr-1 shrink-0" />
          <span className="truncate">{selectedBarangay}</span>
        </div>

        {/* Zone 3: 1 Primary Action (Cart trigger or Profile/Admin) */}
        <div className="flex items-center gap-2 shrink-0">
          {user?.role === 'admin' ? (
            <button
              type="button"
              onClick={() => onSelectTab('admin')}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Shield className="w-3 h-3 text-amber-400" />
              <span>Admin</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSelectTab('cart')}
              aria-label={`Cart with ${cartCount} items`}
              className="relative p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {!user && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
