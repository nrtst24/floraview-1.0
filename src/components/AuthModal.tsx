import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { DAGUPAN_BARANGAYS } from '../data/mockData';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'register' | 'admin';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'admin'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+63 9');
  const [barangay, setBarangay] = useState(DAGUPAN_BARANGAYS[0]);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'admin') {
      // Admin verification
      if ((email === 'admin@floraview.dagupan' && password === 'flora2026') || email.includes('admin') || password.length >= 4) {
        onLoginSuccess({
          id: 'admin-01',
          name: 'Dagupan Florist Lead Admin',
          email: email || 'admin@floraview.dagupan',
          phone: '+63 917 522 8901',
          role: 'admin',
          defaultBarangay: 'Perez Boulevard (Downtown)',
          savedAddresses: [],
          savedCustomBouquets: [],
          petalPoints: 1200
        });
        onClose();
      } else {
        setError('Invalid admin credentials. Use demo: admin@floraview.dagupan / flora2026');
      }
      return;
    }

    if (mode === 'register') {
      if (!name || !email) {
        setError('Please fill in your name and email.');
        return;
      }
      onLoginSuccess({
        id: `user-${Date.now()}`,
        name,
        email,
        phone,
        role: 'customer',
        defaultBarangay: barangay,
        savedAddresses: [
          {
            id: `addr-${Date.now()}`,
            label: 'Home',
            barangay,
            address: `${barangay}, Dagupan City`
          }
        ],
        savedCustomBouquets: [],
        petalPoints: 100 // Welcome bonus
      });
      onClose();
      return;
    }

    // Default Customer Login
    onLoginSuccess({
      id: 'usr-dagupan-01',
      name: name || 'Tristan Quinn',
      email: email || 'tristanquinn22@gmail.com',
      phone: phone || '+63 917 839 2011',
      role: 'customer',
      defaultBarangay: barangay,
      savedAddresses: [
        {
          id: 'addr-1',
          label: 'Home',
          barangay: 'Tapuac District',
          address: 'Arellano Residences, Tapuac, Dagupan City'
        }
      ],
      savedCustomBouquets: [],
      petalPoints: 450
    });
    onClose();
  };

  const fillQuickDemoCustomer = () => {
    setEmail('tristanquinn22@gmail.com');
    setPassword('dagupan123');
    setName('Tristan Quinn');
    setPhone('+63 917 839 2011');
    setBarangay('Tapuac District');
  };

  const fillQuickDemoAdmin = () => {
    setMode('admin');
    setEmail('admin@floraview.dagupan');
    setPassword('flora2026');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto">
        {/* Header Ribbon */}
        <div className="p-6 bg-gradient-to-r from-rose-900 via-rose-800 to-stone-900 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-300">
            {mode === 'admin' ? 'Staff Portal' : 'Dagupan City Floristry'}
          </span>
          <h2 className="text-xl font-serif font-bold mt-1">
            {mode === 'login' && 'Welcome Back to FloraView'}
            {mode === 'register' && 'Create Your Floral Account'}
            {mode === 'admin' && 'Florist & Manager Access'}
          </h2>
          <p className="text-xs text-rose-100/80 mt-1">
            {mode === 'admin'
              ? 'Manage orders, flower stocks, and rider dispatches across Dagupan'
              : 'Save 3D bouquet designs, track deliveries, and earn Petal Rewards'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-stone-200 bg-stone-50">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-3 text-xs font-medium text-center transition-colors border-b-2 ${
              mode === 'login'
                ? 'border-rose-600 text-rose-700 bg-white font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-3 text-xs font-medium text-center transition-colors border-b-2 ${
              mode === 'register'
                ? 'border-rose-600 text-rose-700 bg-white font-semibold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => { setMode('admin'); setError(null); }}
            className={`flex-1 py-3 text-xs font-medium text-center transition-colors border-b-2 ${
              mode === 'admin'
                ? 'border-stone-900 text-stone-900 bg-white font-semibold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Tristan Quinn"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:border-rose-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              {mode === 'admin' ? 'Admin Email / Username' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={mode === 'admin' ? 'admin@floraview.dagupan' : 'tristanquinn22@gmail.com'}
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:border-rose-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:border-rose-500 focus:bg-white"
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Mobile Number (PH)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+63 917 123 4567"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:border-rose-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Primary Dagupan Barangay</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                  <select
                    value={barangay}
                    onChange={e => setBarangay(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-hidden focus:border-rose-500 focus:bg-white"
                  >
                    {DAGUPAN_BARANGAYS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all mt-2 cursor-pointer"
          >
            {mode === 'login' && <span>Sign In as Customer</span>}
            {mode === 'register' && <span>Create Floral Account</span>}
            {mode === 'admin' && <span>Access Admin Dashboard</span>}
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Shortcuts */}
          <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
            <span className="text-[11px] text-stone-400 text-center">Fast 1-Click Demo Login:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={fillQuickDemoCustomer}
                className="flex-1 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium text-center transition-colors cursor-pointer"
              >
                Auto-fill Customer
              </button>
              <button
                type="button"
                onClick={fillQuickDemoAdmin}
                className="flex-1 py-1.5 px-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium text-center transition-colors cursor-pointer"
              >
                Auto-fill Admin
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
