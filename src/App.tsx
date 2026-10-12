import React, { useState } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { MobileTopHeader } from './components/MobileTopHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ShopsScreen } from './components/ShopsScreen';
import { CustomBouquetBuilder } from './components/CustomBouquetBuilder';
import { CartScreen } from './components/CartScreen';
import { CheckoutScreen } from './components/CheckoutScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { BouquetDetailModal } from './components/BouquetDetailModal';
import { ARViewModal } from './components/ARViewModal';
import { AuthModal } from './components/AuthModal';

import { PRESET_BOUQUETS, INITIAL_ORDERS, INITIAL_USER, DAGUPAN_BARANGAYS, FLOWER_STEMS } from './data/mockData';
import { PresetBouquet, CustomBouquetConfig, CartItem, Order, UserProfile, WrapperOption, RibbonOption } from './types';

export default function App() {
  // Splash Screen State
  const [showSplash, setShowSplash] = useState<boolean>(true);

  // Active Tab: 'home' | 'shops' | 'builder' | 'cart' | 'checkout' | 'profile' | 'admin'
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Dagupan Location
  const [selectedBarangay, setSelectedBarangay] = useState<string>(DAGUPAN_BARANGAYS[0]);

  // Modals & Overlays
  const [selectedBouquetDetail, setSelectedBouquetDetail] = useState<PresetBouquet | null>(null);
  const [arTarget, setArTarget] = useState<{
    name: string;
    wrapper?: WrapperOption;
    ribbon?: RibbonOption;
    style?: 'round' | 'cascade' | 'korean_petite' | 'grand_fan';
    stems?: { name: string; count: number; colorHex: string; variety?: string }[];
  } | null>(null);

  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'admin'>('login');

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(INITIAL_USER);

  // Cart & Orders State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-1',
      bouquetId: PRESET_BOUQUETS[0].id,
      name: PRESET_BOUQUETS[0].name,
      isCustom: false,
      presetData: PRESET_BOUQUETS[0],
      unitPrice: PRESET_BOUQUETS[0].price,
      quantity: 1,
      image: PRESET_BOUQUETS[0].image,
      cardMessage: 'Happy Anniversary, Alyssa!',
      addOns: [{ name: 'Warm Fairy Light Twinkle String', price: 150 }]
    }
  ]);

  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [checkoutDeliveryMethod, setCheckoutDeliveryMethod] = useState<'trike_express' | 'van_scheduled' | 'store_pickup'>('trike_express');
  const [checkoutPromoDiscount, setCheckoutPromoDiscount] = useState<number>(0);

  // Customizer prefill state
  const [builderPrefillStemId, setBuilderPrefillStemId] = useState<string | undefined>(undefined);

  // ----------------------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------------------

  const handleAddToCartPreset = (
    bouquet: PresetBouquet,
    quantity = 1,
    cardMessage?: string,
    addOns: { name: string; price: number }[] = []
  ) => {
    const addOnsTotal = addOns.reduce((s, a) => s + a.price, 0);
    const existingIndex = cartItems.findIndex(i => !i.isCustom && i.bouquetId === bouquet.id);

    if (existingIndex > -1) {
      setCartItems(prev => {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      });
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}`,
        bouquetId: bouquet.id,
        name: bouquet.name,
        isCustom: false,
        presetData: bouquet,
        unitPrice: bouquet.price + addOnsTotal,
        quantity,
        image: bouquet.image,
        cardMessage,
        addOns
      };
      setCartItems(prev => [newItem, ...prev]);
    }
  };

  const handleAddToCartCustom = (customConfig: CustomBouquetConfig) => {
    const newItem: CartItem = {
      id: `cart-${Date.now()}`,
      name: customConfig.name,
      isCustom: true,
      customConfig,
      unitPrice: customConfig.calculatedPrice,
      quantity: 1,
      image: '/src/assets/images/hero_bouquet_dagupan_1791819801445.jpg',
      cardMessage: customConfig.cardMessage?.message,
      addOns: []
    };
    setCartItems(prev => [newItem, ...prev]);
    setCurrentTab('cart');
  };

  const handleOpenARForPreset = (bouquet: PresetBouquet) => {
    setArTarget({
      name: bouquet.name,
      wrapper: bouquet.composition.wrapper,
      ribbon: bouquet.composition.ribbon,
      style: bouquet.composition.style,
      stems: bouquet.composition.flowers.map(f => ({
        name: f.name,
        count: f.count,
        colorHex: f.colorHex
      }))
    });
  };

  const handleOpenARForCustom = (customConfig: CustomBouquetConfig) => {
    const mappedStems = customConfig.stems.map(s => {
      const stemObj = FLOWER_STEMS.find(f => f.id === s.flowerId)!;
      return {
        name: stemObj.name,
        count: s.quantity,
        colorHex: stemObj.colorHex,
        variety: stemObj.variety
      };
    });

    setArTarget({
      name: customConfig.name,
      wrapper: customConfig.wrapper,
      ribbon: customConfig.ribbon,
      style: customConfig.style,
      stems: mappedStems
    });
  };

  const handleSaveCustomToProfile = (customConfig: CustomBouquetConfig) => {
    if (currentUser) {
      setCurrentUser(prev => prev ? ({
        ...prev,
        savedCustomBouquets: [customConfig, ...prev.savedCustomBouquets],
        petalPoints: prev.petalPoints + 25 // bonus points for creating custom design
      }) : null);
    }
  };

  const handleProceedToCheckout = (
    method: 'trike_express' | 'van_scheduled' | 'store_pickup',
    discount: number
  ) => {
    setCheckoutDeliveryMethod(method);
    setCheckoutPromoDiscount(discount);
    setCurrentTab('checkout');
  };

  const handleOrderCompleted = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    if (currentUser) {
      setCurrentUser(prev => prev ? ({
        ...prev,
        petalPoints: prev.petalPoints + Math.round(newOrder.total * 0.05) // 5% cashback in petals
      }) : null);
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  const totalCartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 flex flex-col">
      {/* 1. Splash Screen */}
      {showSplash && (
        <SplashScreen onEnterApp={() => setShowSplash(false)} />
      )}

      {/* Main App Layout */}
      {!showSplash && (
        <>
          {/* Header (hidden in admin mode which has its own toolbar) */}
          {currentTab !== 'admin' && (
            <MobileTopHeader
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              cartCount={totalCartCount}
              user={currentUser}
              onOpenAuth={() => {
                setAuthMode('login');
                setIsAuthOpen(true);
              }}
              selectedBarangay={selectedBarangay}
              onSelectBarangay={setSelectedBarangay}
            />
          )}

          {/* Main Views Container */}
          <main className="flex-1">
            {/* HOME SCREEN */}
            {currentTab === 'home' && (
              <HomeScreen
                onSelectBouquet={b => setSelectedBouquetDetail(b)}
                onOpenAR={handleOpenARForPreset}
                onOpenCustomBuilder={() => {
                  setBuilderPrefillStemId(undefined);
                  setCurrentTab('builder');
                }}
                onSelectShop={() => setCurrentTab('shops')}
                onAddToCart={b => handleAddToCartPreset(b, 1)}
                selectedBarangay={selectedBarangay}
                onSelectBarangay={setSelectedBarangay}
              />
            )}

            {/* SHOPS & FLOWERS BROWSE SCREEN */}
            {currentTab === 'shops' && (
              <ShopsScreen
                onSelectBouquet={b => setSelectedBouquetDetail(b)}
                onOpenAR={handleOpenARForPreset}
                onAddToCart={b => handleAddToCartPreset(b, 1)}
                onOpenCustomBuilder={prefillStemId => {
                  setBuilderPrefillStemId(prefillStemId);
                  setCurrentTab('builder');
                }}
              />
            )}

            {/* 3D CUSTOM BOUQUET BUILDER */}
            {currentTab === 'builder' && (
              <CustomBouquetBuilder
                onAddToCart={handleAddToCartCustom}
                onOpenAR={handleOpenARForCustom}
                onSaveToProfile={handleSaveCustomToProfile}
                initialStemId={builderPrefillStemId}
              />
            )}

            {/* SHOPPING CART SCREEN */}
            {currentTab === 'cart' && (
              <CartScreen
                items={cartItems}
                onUpdateQuantity={(id, delta) => {
                  setCartItems(prev =>
                    prev
                      .map(item => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
                      .filter(item => item.quantity > 0)
                  );
                }}
                onRemoveItem={id => setCartItems(prev => prev.filter(i => i.id !== id))}
                onProceedToCheckout={handleProceedToCheckout}
                onExploreBouquets={() => setCurrentTab('home')}
              />
            )}

            {/* CHECKOUT SCREEN */}
            {currentTab === 'checkout' && (
              <CheckoutScreen
                items={cartItems}
                deliveryMethod={checkoutDeliveryMethod}
                promoDiscount={checkoutPromoDiscount}
                user={currentUser}
                onBackToCart={() => setCurrentTab('cart')}
                onOrderComplete={handleOrderCompleted}
              />
            )}

            {/* USER PROFILE SCREEN */}
            {currentTab === 'profile' && (
              <ProfileScreen
                user={currentUser}
                orders={orders}
                onOpenAuth={() => {
                  setAuthMode('login');
                  setIsAuthOpen(true);
                }}
                onLogout={() => setCurrentUser(null)}
                onOpenAdmin={() => setCurrentTab('admin')}
                onOpenCustomBuilderWithConfig={config => {
                  setBuilderPrefillStemId(undefined);
                  setCurrentTab('builder');
                }}
              />
            )}

            {/* FLORIST ADMIN PORTAL */}
            {currentTab === 'admin' && (
              <AdminDashboard
                orders={orders}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onExitAdmin={() => setCurrentTab('home')}
              />
            )}
          </main>

          {/* Bottom Thumb Navigation (hidden on admin view and checkout to avoid distraction) */}
          {currentTab !== 'admin' && currentTab !== 'checkout' && (
            <MobileBottomNav
              currentTab={currentTab}
              onSelectTab={setCurrentTab}
              cartCount={totalCartCount}
            />
          )}

          {/* 5. Flower Bouquet Detail Modal */}
          <BouquetDetailModal
            bouquet={selectedBouquetDetail}
            onClose={() => setSelectedBouquetDetail(null)}
            onOpenAR={handleOpenARForPreset}
            onAddToCart={handleAddToCartPreset}
          />

          {/* 7. AR Visualization Modal */}
          <ARViewModal
            isOpen={arTarget !== null}
            onClose={() => setArTarget(null)}
            bouquetName={arTarget?.name || 'FloraView Bouquet'}
            wrapper={arTarget?.wrapper}
            ribbon={arTarget?.ribbon}
            style={arTarget?.style}
            stems={arTarget?.stems}
            onAddToCart={() => {
              if (selectedBouquetDetail) {
                handleAddToCartPreset(selectedBouquetDetail, 1);
              }
            }}
          />

          {/* 2 & 11. Auth & Admin Login Modal */}
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            initialMode={authMode}
            onLoginSuccess={user => {
              setCurrentUser(user);
              if (user.role === 'admin') {
                setCurrentTab('admin');
              }
            }}
          />
        </>
      )}
    </div>
  );
}
