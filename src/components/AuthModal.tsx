import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, ArrowRight } from 'lucide-react';
import { DAGUPAN_BARANGAYS } from '../data/mockData';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
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
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    if (mode === 'register' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    // Demo-only customer authentication. Replace this handler with your Laravel API.
    onLoginSuccess({
      id: mode === 'register' ? `user-${Date.now()}` : 'usr-dagupan-01',
      name: mode === 'register' ? name : (name || email.split('@')[0]),
      email,
      phone,
      role: 'customer',
      defaultBarangay: barangay,
      savedAddresses: [{
        id: `addr-${Date.now()}`,
        label: 'Home',
        barangay,
        address: `${barangay}, Dagupan City`
      }],
      savedCustomBouquets: [],
      petalPoints: mode === 'register' ? 100 : 450
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto">
        <div className="p-6 bg-gradient-to-r from-rose-900 via-rose-800 to-stone-900 text-white relative">
          <button type="button" onClick={onClose} aria-label="Close" className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80">
            <X className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-300">Dagupan City Floristry</span>
          <h2 className="text-xl font-serif font-bold mt-1">
            {mode === 'login' ? 'Welcome Back to FloraView' : 'Create Your Floral Account'}
          </h2>
          <p className="text-xs text-rose-100/80 mt-1">Save 3D bouquet designs, track deliveries, and earn Petal Rewards.</p>
        </div>

        <div className="flex border-b border-stone-200 bg-stone-50">
          {(['login', 'register'] as const).map(tab => (
            <button key={tab} type="button" onClick={() => { setMode(tab); setError(null); }}
              className={`flex-1 py-3 text-xs font-medium capitalize border-b-2 ${mode === tab ? 'border-rose-600 text-rose-700 bg-white font-semibold' : 'border-transparent text-stone-600 hover:text-stone-900'}`}>
              {tab === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">{error}</div>}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Full Name</label>
              <div className="relative"><User className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input required value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm" />
              </div>
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
            <div className="relative"><Mail className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">Password</label>
            <div className="relative"><Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm" />
            </div>
          </div>
          {mode === 'register' && <>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Mobile Number (PH)</label>
              <div className="relative"><Phone className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+63 917 123 4567" className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Primary Dagupan Barangay</label>
              <div className="relative"><MapPin className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                <select value={barangay} onChange={e => setBarangay(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm">
                  {DAGUPAN_BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
          </>}
          <button type="submit" className="w-full h-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 mt-2">
            <span>{mode === 'login' ? 'Sign In as Customer' : 'Create Floral Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-[11px] text-stone-400 text-center">Customer access only</p>
        </form>
      </div>
    </div>
  );
};
