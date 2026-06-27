import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Hash, Globe, Compass, LogOut, CheckCircle, Award } from 'lucide-react';
import { UserProfile, Order } from '../types';

interface AccountPageProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onLogout: () => void;
  orders: Order[];
  onSelectView: (view: 'shop' | 'tracker') => void;
}

export default function AccountPage({
  user,
  onUpdateUser,
  onLogout,
  orders,
  onSelectView,
}: AccountPageProps) {
  const [formData, setFormData] = useState<UserProfile>({ ...user });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onUpdateUser(formData);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 450);
  };

  const userOrders = orders.filter((o) => o.email.toLowerCase() === user.email.toLowerCase());

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-10 animate-fade">
      
      {/* Visual Header card */}
      <div className="bg-[#1A1A1A] text-white p-6 sm:p-8 rounded-none border-2 border-[#1A1A1A] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-[#FCFAF7] border-2 border-stone-800 flex items-center justify-center text-[#1A1A1A] select-none">
            <span className="font-sans font-black text-2xl uppercase">
              {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : 'U'}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-sans font-black uppercase text-xl sm:text-2xl tracking-wide">{user.fullName}</h2>
              <span className="bg-red-700 text-white font-mono text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-none">
                EASYGROCERY MEMBER
              </span>
            </div>
            <p className="text-xs text-stone-300 font-serif italic mt-1">Logged in as {user.email}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          type="button"
          className="px-4 py-2 bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#1A1A1A] transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
          Log Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Profile Edit Form */}
        <div className="lg:col-span-2 bg-white border-2 border-[#1A1A1A] rounded-none p-6 sm:p-8 space-y-6">
          <div className="border-b-2 border-[#1A1A1A] pb-4">
            <h3 className="font-sans font-black uppercase text-base tracking-wider text-[#1A1A1A]">
              Profile Details
            </h3>
            <p className="text-xs text-stone-500 font-serif mt-1">
              Add or update your credentials and shipping context here to expedite checkout processing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {saveSuccess && (
              <div className="p-3 bg-stone-900 border border-stone-700 text-white text-[10px] uppercase font-bold tracking-widest flex items-center gap-1.5 rounded-none">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Profile credentials synced successfully!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-black text-stone-500 block">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full text-xs pl-8 pr-3 py-2.5 rounded-none border border-[#1A1A1A] bg-[#FCFAF7] uppercase font-bold focus:outline-none"
                  />
                  <User className="absolute left-2.5 top-3 w-4 h-4 text-stone-400" />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-black text-stone-500 block">
                  Mail Address
                </label>
                <div className="relative">
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs pl-8 pr-3 py-2.5 rounded-none border border-[#1A1A1A] bg-[#FCFAF7] focus:outline-none placeholder-stone-400"
                  />
                  <Mail className="absolute left-2.5 top-3 w-4 h-4 text-stone-400" />
                </div>
              </div>

              {/* Sex Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-black text-stone-500 block">
                  Sex / Gender
                </label>
                <select
                  value={formData.sex}
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                  className="w-full text-xs px-3 py-2.5 rounded-none border border-[#1A1A1A] bg-[#FCFAF7] font-bold focus:outline-none"
                >
                  <option value="">SELECT GENDER...</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Phone Line */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-black text-stone-500 block">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="E.G., (206) 555-0144"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs pl-8 pr-3 py-2.5 rounded-none border border-[#1A1A1A] bg-[#FCFAF7] font-mono font-bold focus:outline-none"
                  />
                  <Phone className="absolute left-2.5 top-3 w-4 h-4 text-stone-400" />
                </div>
              </div>

            </div>

            {/* User Address Block */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-widest font-black text-stone-500 block">
                User Address (Physical Delivery)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Street and house number"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full text-xs pl-8 pr-3 py-2.5 rounded-none border border-[#1A1A1A] bg-[#FCFAF7] uppercase font-bold focus:outline-none placeholder-stone-400"
                />
                <MapPin className="absolute left-2.5 top-3 w-4 h-4 text-stone-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Pincode / Zip */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-black text-stone-500 block">
                  Pincode / Zip Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="98122"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full text-xs pl-8 pr-3 py-2.5 rounded-none border border-[#1A1A1A] bg-[#FCFAF7] font-mono font-bold focus:outline-none placeholder-stone-400"
                  />
                  <Hash className="absolute left-2.5 top-3 w-4 h-4 text-stone-400" />
                </div>
              </div>

              {/* Country */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-black text-stone-500 block">
                  Country
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="United States"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full text-xs pl-8 pr-3 py-2.5 rounded-none border border-[#1A1A1A] bg-[#FCFAF7] uppercase font-bold focus:outline-none placeholder-stone-400"
                  />
                  <Globe className="absolute left-2.5 top-3 w-4 h-4 text-stone-400" />
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 bg-[#1A1A1A] text-[#FCFAF7] border-2 border-[#1A1A1A] hover:bg-[#FCFAF7] hover:text-[#1A1A1A] font-sans text-xs font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? 'SYNCING DETAILS...' : 'SAVE PROFILE DETAILS'}
              </button>
            </div>

          </form>
        </div>

        {/* Right column: Co-op stats & custom orders overview */}
        <div className="space-y-6">
          
          {/* Member badge card */}
          <div className="bg-[#FCFAF7] border-2 border-[#1A1A1A] p-6 text-center space-y-4">
            <Award className="w-10 h-10 text-stone-800 mx-auto stroke-[1.5]" />
            <div>
              <h4 className="text-xs font-sans font-black uppercase tracking-widest text-[#1A1A1A]">EasyGrocery Tier status</h4>
              <p className="font-serif italic text-stone-500 text-xs mt-1">Cascadian Golden Fern Member</p>
            </div>
            
            <div className="border-t border-stone-300 pt-3 flex justify-around text-center">
              <div>
                <span className="block font-mono text-base font-black text-[#1A1A1A]">3%</span>
                <span className="text-[8px] uppercase font-bold text-stone-400 tracking-wider">REBATE EARNED</span>
              </div>
              <div className="border-l border-stone-300"></div>
              <div>
                <span className="block font-mono text-base font-black text-[#1A1A1A]">{userOrders.length}</span>
                <span className="text-[8px] uppercase font-bold text-stone-400 tracking-wider">EASYGROCERY RESERVES</span>
              </div>
            </div>
          </div>

          {/* Past orders list */}
          <div className="bg-white border-2 border-[#1A1A1A] p-6 space-y-4">
            <h4 className="text-xs font-sans font-black uppercase tracking-wider text-[#1A1A1A] border-b border-stone-200 pb-2">
              Order history ({userOrders.length})
            </h4>
            
            {userOrders.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <Compass className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="text-xs text-stone-500 font-serif italic">No past reservation records found.</p>
                <button
                  onClick={() => onSelectView('shop')}
                  className="text-[10px] uppercase font-bold text-stone-850 underline hover:text-[#1A1A1A] block w-full mt-1"
                >
                  Order Hand-Picked Dry Goods
                </button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                {userOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3 border border-stone-300 bg-[#FCFAF7] text-xs flex justify-between items-center hover:border-black cursor-pointer"
                    onClick={() => onSelectView('tracker')}
                  >
                    <div>
                      <p className="font-mono font-bold text-[#1A1A1A] text-xs uppercase">{ord.id}</p>
                      <p className="text-[10px] text-stone-400 font-mono mt-0.5">{ord.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif italic font-black text-stone-900">₹{ord.total.toFixed(2)}</p>
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 font-mono text-[8px] font-black uppercase bg-[#1A1A1A] text-white tracking-widest">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
