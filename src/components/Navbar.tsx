import React from 'react';
import { ShoppingBag, Search, User } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeView: 'shop' | 'tracker' | 'faqs' | 'sale' | 'account' | 'auth';
  setActiveView: (view: 'shop' | 'tracker' | 'faqs' | 'sale' | 'account' | 'auth') => void;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  user: UserProfile | null;
}

export default function Navbar({
  activeView,
  setActiveView,
  cartCount,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  user,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#FCFAF7]/95 backdrop-blur-md border-b-2 border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-end justify-between py-6 md:py-8 gap-4">
          
          {/* Logo Brand / Bold Typography Layout */}
          <div 
            className="flex flex-col cursor-pointer select-none group"
            onClick={() => setActiveView('shop')}
          >
            <span className="text-[9px] uppercase tracking-[0.25em] font-black text-stone-500 mb-1">
              ESTABLISHED 2012 — SEATTLE, WA
            </span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-3xl sm:text-4.5xl font-black tracking-tighter leading-none italic font-sans text-[#1A1A1A]">
                EASY<span className="font-serif font-normal not-italic text-stone-500">GROCERY</span>
              </h1>
            </div>
          </div>

          {/* Navigation Links with flat thick border selectors */}
          <div className="flex flex-wrap items-center justify-between w-full md:w-auto gap-4 md:gap-8 border-t md:border-t-0 border-stone-200 pt-4 md:pt-0">
            <nav className="flex gap-4 sm:gap-6 md:gap-8 text-[11px] uppercase tracking-[0.2em] font-black py-1">
              <button
                onClick={() => setActiveView('shop')}
                className={`transition-all duration-150 pb-1 cursor-pointer ${
                  activeView === 'shop'
                    ? 'border-b-2 border-[#1A1A1A] text-[#1A1A1A]'
                    : 'text-stone-400 hover:text-[#1A1A1A]'
                }`}
              >
                BROWSE catalog
              </button>
              <button
                onClick={() => setActiveView('sale')}
                className={`transition-all duration-150 pb-1 cursor-pointer ${
                  activeView === 'sale'
                    ? 'border-b-2 border-red-700 text-red-700 font-extrabold'
                    : 'text-stone-400 hover:text-red-700'
                }`}
              >
                % ON SALE
              </button>
              <button
                onClick={() => setActiveView('tracker')}
                className={`transition-all duration-150 pb-1 cursor-pointer ${
                  activeView === 'tracker'
                    ? 'border-b-2 border-[#1A1A1A] text-[#1A1A1A]'
                    : 'text-stone-400 hover:text-[#1A1A1A]'
                }`}
              >
                Track location
              </button>
              <button
                onClick={() => setActiveView('faqs')}
                className={`transition-all duration-150 pb-1 cursor-pointer ${
                  activeView === 'faqs'
                    ? 'border-b-2 border-[#1A1A1A] text-[#1A1A1A]'
                    : 'text-stone-400 hover:text-[#1A1A1A]'
                }`}
              >
                Info & FAQs
              </button>
            </nav>

            {/* Support Actions & Cart */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Search input styled clean / square */}
              {activeView === 'shop' && (
                <div className="relative hidden lg:block w-36 xl:w-44">
                  <input
                    type="text"
                    placeholder="FIND GOODS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-7 pr-2 py-1 border-b border-stone-300 focus:border-[#1A1A1A] text-[10px] uppercase font-bold tracking-wider bg-transparent focus:outline-none transition-colors text-stone-900 placeholder-stone-400 rounded-none animate-none"
                  />
                  <Search className="absolute left-1 top-1.5 w-3.5 h-3.5 text-stone-400" />
                </div>
              )}

              {/* Shopping Bag Button (Crisp Square layout) */}
              <button
                onClick={onOpenCart}
                className="relative py-1.5 px-3 rounded-none border-2 border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] transition-colors font-sans text-xs font-bold tracking-widest flex items-center gap-2 cursor-pointer"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                <span className="uppercase text-[10px] tracking-wider font-black hidden xs:inline">Bag</span>
                <span className="ml-0.5 px-1.5 py-0.5 bg-[#1A1A1A] text-white text-[9px] font-mono font-bold transition-colors">
                  {cartCount}
                </span>
              </button>

              {/* Co-Op Account Button (Signature Border Badge) */}
              <button
                onClick={() => setActiveView(user ? 'account' : 'auth')}
                className={`py-1.5 px-3 rounded-none border-2 border-[#1A1A1A] transition-all font-sans text-xs font-bold tracking-widest flex items-center gap-2 cursor-pointer ${
                  activeView === 'account' || activeView === 'auth'
                    ? 'bg-[#1A1A1A] text-[#FCFAF7]'
                    : 'bg-[#FCFAF7] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
                }`}
                title={user ? `Logged in as ${user.fullName}` : 'Join the Co-op / Sign In'}
              >
                <User className="w-4 h-4 stroke-[2.5]" />
                <span className="uppercase text-[10px] tracking-wider font-black hidden sm:inline">
                  {user ? (user.fullName.split(' ')[0]) : 'Sign In'}
                </span>
              </button>

            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
