import React, { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, Hash, Globe, ChevronRight, Compass } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [sex, setSex] = useState('Male');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [country, setCountry] = useState('United States');

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (isSignUp) {
        // Sign Up Flow
        if (!email || !password || !fullName || !phone || !address || !pincode || !country) {
          setError('PLEASE FILL IN ALL REQUIRED FIELD CHANNELS.');
          setIsLoading(false);
          return;
        }

        const newUser: UserProfile = {
          fullName,
          email,
          sex,
          phone,
          address,
          pincode,
          country
        };

        onLoginSuccess(newUser);
      } else {
        // Sign In Flow (allow fast fallback for demo purposes)
        if (!email || !password) {
          setError('EMAIL AND PASSWORD RESERVATIONS REQUIRED.');
          setIsLoading(false);
          return;
        }

        // Generate an elegant demo account based on the email provided
        const demoUser: UserProfile = {
          fullName: email.split('@')[0].toUpperCase().replace(/[^A-Z]/g, ' ') || 'HONORED GUEST',
          email,
          sex: 'Prefer not to say',
          phone: '(206) 555-0144',
          address: '1205 E PIKE ST',
          pincode: '98122',
          country: 'United States'
        };

        onLoginSuccess(demoUser);
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 animate-fade">
      
      {/* Container Ledger Sheet Box */}
      <div className="bg-[#FCFAF7] border-2 border-[#1A1A1A] p-6 sm:p-8 rounded-none shadow-xl space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2 border-b-2 border-[#1A1A1A] pb-5">
          <span className="text-[9px] uppercase tracking-[0.2em] font-black text-stone-500">
            EASYGROCERY Co-Op
          </span>
          <h2 className="font-sans font-black text-2xl uppercase tracking-tight text-[#1A1A1A]">
            {isSignUp ? 'REGISTER VISITOR' : 'CO-OP SIGN IN'}
          </h2>
          <p className="text-xs font-serif text-stone-500 max-w-xs mx-auto">
            {isSignUp 
              ? 'Complete registration for seasonal honey and local courier access.' 
              : 'Sign in to access your bespoke orders and easygrocery reserves.'
            }
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-700 text-white text-[10px] uppercase font-bold tracking-widest text-center rounded-none">
            ⚠️ {error}
          </div>
        )}

        {/* Input Forms */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-black text-stone-600 block">
                Full Name *
              </label>
              <div className="relative">
                <input
                  required
                  type="text"
                  placeholder="ALEX CARTER"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 border border-[#1A1A1A] bg-white uppercase font-bold focus:outline-none focus:ring-0 placeholder-stone-400"
                />
                <User className="absolute left-2.5 top-2.5 w-4 h-4 text-stone-400" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-stone-600 block">
              Mail Address / Email *
            </label>
            <div className="relative">
              <input
                required
                type="email"
                placeholder="YOUR.NAME@EXAMPLE.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 border border-[#1A1A1A] bg-white focus:outline-none focus:ring-0 placeholder-stone-400"
              />
              <Mail className="absolute left-2.5 top-2.5 w-4 h-4 text-stone-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest font-black text-stone-600 block">
              Access Code / Password *
            </label>
            <div className="relative">
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 border border-[#1A1A1A] bg-white focus:outline-none focus:ring-0 placeholder-stone-400"
              />
              <Lock className="absolute left-2.5 top-2.5 w-4 h-4 text-stone-400" />
            </div>
          </div>

          {isSignUp && (
            <>
              {/* Additional Details (Sex, Phone, Address, pincode, country) */}
              <div className="grid grid-cols-2 gap-3.5">
                
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-black text-stone-600 block">
                    Sex *
                  </label>
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    className="w-full text-xs px-2 py-2 border border-[#1A1A1A] bg-white font-bold focus:outline-none"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-black text-stone-600 block">
                    Phone line *
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="tel"
                      placeholder="(206) 555-0144"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs pl-7 pr-2 py-2 border border-[#1A1A1A] bg-white font-mono font-bold focus:outline-none placeholder-stone-400"
                    />
                    <Phone className="absolute left-2 top-2.5 w-3.5 h-3.5 text-stone-400" />
                  </div>
                </div>

              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-black text-stone-600 block">
                  Delivery Address *
                </label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    placeholder="E.G., 1205 E PIKE ST"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full text-xs pl-7 pr-2 py-2 border border-[#1A1A1A] bg-white uppercase font-bold focus:outline-none placeholder-stone-400"
                  />
                  <MapPin className="absolute left-2 top-2.5 w-3.5 h-3.5 text-stone-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-black text-stone-600 block">
                    Pincode / Zip *
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      placeholder="98122"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full text-xs pl-7 pr-2 py-2 border border-[#1A1A1A] bg-white font-mono font-bold focus:outline-none placeholder-stone-400"
                    />
                    <Hash className="absolute left-2 top-2.5 w-3.5 h-3.5 text-stone-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-black text-stone-600 block">
                    Country *
                  </label>
                  <div className="relative">
                    <input
                      required
                      type="text"
                      placeholder="United States"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full text-xs pl-7 pr-2 py-2 border border-[#1A1A1A] bg-white uppercase font-bold focus:outline-none placeholder-stone-400"
                    />
                    <Globe className="absolute left-2 top-2.5 w-3.5 h-3.5 text-stone-400" />
                  </div>
                </div>

              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A] border-2 border-[#1A1A1A] text-white text-xs font-black uppercase tracking-widest transition-all mt-4 cursor-pointer disabled:opacity-50"
          >
            {isLoading 
              ? (isSignUp ? 'CREATING LEDGER...' : 'CONFIRMING ENTRY...') 
              : (isSignUp ? 'COMPLETE REGISTRATION' : 'SECURE LOG IN')
            }
          </button>

        </form>

        {/* Toggle Anchor */}
        <div className="border-t border-stone-200 pt-4 text-center">
          <button
            onClick={handleToggle}
            className="text-[10px] uppercase font-black tracking-widest text-stone-500 hover:text-[#1A1A1A] underline transition-colors cursor-pointer"
          >
            {isSignUp 
              ? 'ALREADY A MEMBER? SECURE SIGN IN' 
              : 'NEW VISITOR? REGISTER A NEW PROFILE'
            }
          </button>
        </div>

      </div>

    </div>
  );
}
