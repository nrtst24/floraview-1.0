import React, { useEffect, useState } from 'react';
import { Flower2, Sparkles, MapPin, ChevronRight } from 'lucide-react';

interface SplashScreenProps {
  onEnterApp: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnterApp }) => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-gradient-to-b from-stone-900 via-stone-900 to-rose-950 text-white p-6 overflow-hidden">
      {/* Background Floral Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tagline */}
      <div className="pt-8 flex items-center justify-between text-xs tracking-wider uppercase text-rose-200/80 font-medium">
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-rose-400" />
          <span>Dagupan City, Pangasinan</span>
        </span>
        <span>Est. 2026</span>
      </div>

      {/* Center Hero Lockup */}
      <div className="flex flex-col items-center text-center my-auto py-8">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-2xl shadow-rose-600/40 animate-float-gentle">
            <Flower2 className="w-12 h-12 text-white stroke-[1.75]" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-amber-400 text-stone-900 p-1.5 rounded-full shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-2">
          FloraView
        </h1>
        <p className="text-sm font-light text-rose-100/90 max-w-xs mb-3">
          Interactive 3D Floristry & AR Bouquets in the City of Bangus
        </p>

        <div className="flex items-center gap-2 text-xs text-rose-300/80">
          <span>Real-time 3D Design</span>
          <span aria-hidden="true">·</span>
          <span>AR Tabletop View</span>
          <span aria-hidden="true">·</span>
          <span>Same-Day Perez Blvd Delivery</span>
        </div>
      </div>

      {/* Bottom CTA & Quick Enter */}
      <div className="pb-8 flex flex-col gap-3 max-w-sm w-full mx-auto">
        <button
          type="button"
          onClick={onEnterApp}
          className="w-full h-13 rounded-2xl bg-white text-stone-900 hover:bg-rose-50 font-semibold text-sm flex items-center justify-center gap-2 shadow-xl shadow-stone-950/40 active:scale-[0.98] transition-all"
        >
          <span>Explore Dagupan Blooms</span>
          <ChevronRight className="w-4 h-4 text-stone-600" />
        </button>

        <p className="text-[11px] text-center text-stone-400">
          Delivering fresh florals across Tapuac, Lucao, Bonuan & Perez Blvd
        </p>
      </div>
    </div>
  );
};
