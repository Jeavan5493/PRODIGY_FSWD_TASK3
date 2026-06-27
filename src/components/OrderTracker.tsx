import React, { useState } from 'react';
import { Search, Clock, MapPin, Truck, CheckCircle, Package } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackerProps {
  orders: Order[];
  onFastForwardOrder: (orderId: string) => void;
}

const SAMPLE_ORDERS: Order[] = [
  {
    id: 'CH-2026-905102',
    date: '2026-06-12',
    total: 44.50,
    status: 'delivered',
    deliveryType: 'eco_courier',
    shippingAddress: {
      fullName: 'Thomas Miller',
      street: '1520 Belmont Ave',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98122',
      phone: '206-555-0187'
    },
    email: 'thomas@belmont.net',
    items: [],
    trackingHistory: [
      { status: 'pending', title: 'Order Received', description: 'Order recorded using secure sandbox.', time: 'June 12, 10:15 AM' },
      { status: 'preparing', title: 'Locally Bound & Managed', description: 'Gently selected blackberry jams and beeswax candles into premium basket boxes.', time: 'June 12, 11:30 AM' },
      { status: 'transit', title: 'With Cargo Rider', description: 'Assigned to our central Seattle courier unit #04 on cargo e-bike.', time: 'June 12, 12:45 PM' },
      { status: 'delivered', title: 'Safely Arrived', description: 'Rider confirmed delivery on front porch steps.', time: 'June 12, 1:15 PM' }
    ]
  },
  {
    id: 'CH-2026-440212',
    date: '2026-06-14',
    total: 27.00,
    status: 'preparing',
    deliveryType: 'pickup',
    shippingAddress: {
      fullName: 'Sarah Vance',
      street: '1205 E Pike St (Pickup)',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98122',
      phone: '206-555-1104'
    },
    email: 'vance.sarah@gmail.com',
    items: [],
    trackingHistory: [
      { status: 'pending', title: 'Order Approved', description: 'Booking confirmed for in-store pickup.', time: 'June 14, 4:00 PM' },
      { status: 'preparing', title: 'Assembling Package', description: 'Curating custom loose leaf teas and chocolate chocolates.', time: 'June 14, 4:30 PM' }
    ]
  }
];

export default function OrderTracker({ orders, onFastForwardOrder }: OrderTrackerProps) {
  const [searchID, setSearchID] = useState('');
  const [queriedOrder, setQueriedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState(false);

  const allAvailableOrders = [...orders, ...SAMPLE_ORDERS];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchID.trim()) return;

    const cleanID = searchID.trim().toUpperCase();
    const found = allAvailableOrders.find((o) => o.id.toUpperCase() === cleanID || o.id === cleanID);

    if (found) {
      setQueriedOrder(found);
      setErrorMsg(false);
    } else {
      setQueriedOrder(null);
      setErrorMsg(true);
    }
  };

  const selectSampleOrder = (order: Order) => {
    setSearchID(order.id);
    setQueriedOrder(order);
    setErrorMsg(false);
  };

  const handleTriggerSimulate = (orderId: string) => {
    onFastForwardOrder(orderId);
    
    setTimeout(() => {
      const refreshedList = [...orders, ...SAMPLE_ORDERS];
      const match = refreshedList.find((o) => o.id === orderId);
      if (match) {
        setQueriedOrder(match);
      }
    }, 50);
  };

  const statusLabels = {
    pending: { label: 'ORDER APPROVED', color: 'bg-stone-200 text-stone-800' },
    preparing: { label: 'IN PREPARATION', color: 'bg-stone-900 text-white' },
    transit: { label: 'OUT FOR DELIVERY', color: 'bg-[#5A6D5D] text-white' },
    delivered: { label: 'DELIVERED & COMPLETE', color: 'bg-[#5A6D5D] text-white' }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Visual Header */}
      <div className="text-center max-w-lg mx-auto mb-10 space-y-3">
        <h1 className="font-sans font-black text-3xl sm:text-4xl text-[#1A1A1A] tracking-tighter uppercase">
          TRACK RESERVATION
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-serif leading-relaxed">
          Curated, packed, and delivered on-site. Enter your reservation order code to trace real-time packaging and dispatch milestones.
        </p>
      </div>

      <div className="bg-[#FCFAF7] border-2 border-[#1A1A1A] rounded-none p-6 sm:p-8 shadow-none space-y-8">
        
        {/* Search Bar Input */}
        <form onSubmit={handleSearch} className="relative flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ENTER AN ORDER ID (E.G. CH-2026-905102)"
              value={searchID}
              onChange={(e) => setSearchID(e.target.value)}
              className="w-full text-xs pl-11 pr-4 py-3.5 rounded-none border border-[#1A1A1A] bg-white focus:outline-none focus:ring-0 uppercase font-mono font-bold placeholder-stone-400"
            />
            <Search className="absolute left-4 top-4 w-4 h-4 text-stone-400" />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 bg-[#1A1A1A] border border-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A] text-white text-xs font-black uppercase tracking-widest rounded-none transition-all cursor-pointer whitespace-nowrap"
          >
            LOCATE SHIPMENT
          </button>
        </form>

        {errorMsg && (
          <p className="text-xs text-stone-900 font-semibold p-3 rounded-none border border-red-500 bg-red-100/50 uppercase font-sans tracking-wide">
            ⚠️ Order number not found. Check your receipt, or select an active sandbox demo order below to view.
          </p>
        )}

        {/* Demo Quick selectors */}
        <div className="bg-[#EAE8E4] border border-stone-300 rounded-none p-4.5 space-y-3">
          <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-widest block">
            DEMO SANDBOX ACTIVE ORDERS:
          </span>
          <div className="flex flex-wrap gap-2">
            {allAvailableOrders.map((o) => (
              <button
                key={o.id}
                onClick={() => selectSampleOrder(o)}
                className={`px-3 py-2 rounded-none text-xs font-mono font-bold border transition-all text-left flex items-center justify-between gap-3 cursor-pointer ${
                  queriedOrder?.id === o.id
                    ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                    : 'bg-white border-[#1A1A1A] text-[#1A1A1A] hover:bg-stone-50'
                }`}
              >
                <span>{o.id}</span>
                <span className="text-[9px] font-black text-stone-500 uppercase px-1.5 py-0.5 rounded-none bg-stone-100 border border-stone-300 shrink-0">
                  {o.status}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Tracking Status Dashboard */}
        {queriedOrder ? (
          <div className="border-t-2 border-[#1A1A1A] pt-8 space-y-6">
            
            {/* Package Summary Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 rounded-none bg-[#FCFAF7] border-2 border-[#1A1A1A]">
              <div className="space-y-1">
                <span className="text-[9px] uppercase text-stone-500 font-black tracking-widest">STATUS</span>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-none text-[10px] font-black tracking-widest uppercase border border-[#1A1A1A] ${statusLabels[queriedOrder.status].color}`}>
                    {statusLabels[queriedOrder.status].label}
                  </span>
                </div>
              </div>

              <div className="space-y-0.5">
                <span className="text-[9px] uppercase text-stone-500 font-black block tracking-widest">DISPATCH TYPE</span>
                <span className="text-xs text-stone-800 font-bold uppercase tracking-wide">
                  {queriedOrder.deliveryType === 'pickup' 
                    ? 'LOBBY PICKUP (12TH & PIKE)' 
                    : queriedOrder.deliveryType === 'eco_courier'
                    ? 'ZERO-EMISSION CARGO E-BIKE'
                    : 'REGIONAL EXPRESS CARRIER'}
                </span>
              </div>

              {/* simulated accelerator */}
              {queriedOrder.status !== 'delivered' && (
                <button
                  onClick={() => handleTriggerSimulate(queriedOrder.id)}
                  className="px-4 py-2 bg-stone-900 border border-stone-900 hover:bg-[#FCFAF7] hover:text-[#1A1A1A] text-white font-black text-[10px] rounded-none transition-all cursor-pointer whitespace-nowrap uppercase tracking-widest inline-flex items-center gap-1"
                >
                  ⚡ ADVANCE STATUS
                </button>
              )}
            </div>

            {/* Custom Interactive Timeline Stepper */}
            <div className="space-y-6">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A] font-black">
                TRACKING MILESTONES
              </h3>

              <div className="relative border-l-2 border-[#1A1A1A] ml-4 pl-8 space-y-8 py-1.5 font-sans">
                
                {/* Milestone 4: Arrived */}
                <div className="relative">
                  <span className={`absolute -left-[41px] top-0.5 w-6 h-6 rounded-none border-2 flex items-center justify-center transition-all ${
                    queriedOrder.status === 'delivered'
                      ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                      : 'bg-white border-[#1A1A1A] text-stone-400'
                  }`}>
                    <span className="font-mono text-[10px] font-black">04</span>
                  </span>
                  <div>
                    <h4 className={`text-xs font-black uppercase tracking-wider ${queriedOrder.status === 'delivered' ? 'text-stone-900' : 'text-stone-400'}`}>
                      {queriedOrder.deliveryType === 'pickup' ? 'RETRIEVED AT Pike SHELVES' : 'SHIPPED & HAND-DELIVERED'}
                    </h4>
                    <p className="text-xs text-stone-600 font-serif mt-1 max-w-sm leading-relaxed">
                      {queriedOrder.deliveryType === 'pickup' 
                        ? 'Package retrieved from our custom shelves. Sourced with care in Seattle.'
                        : 'Simulated cargo courier completes the transit, sliding goods safely onto your porch steps.'}
                    </p>
                  </div>
                </div>

                {/* Milestone 3: On Route */}
                <div className="relative">
                  <span className={`absolute -left-[41px] top-0.5 w-6 h-6 rounded-none border-2 flex items-center justify-center transition-all ${
                    ['transit', 'delivered'].includes(queriedOrder.status)
                      ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                      : 'bg-white border-[#1A1A1A] text-stone-400'
                  }`}>
                    <span className="font-mono text-[10px] font-black">03</span>
                  </span>
                  <div>
                    <h4 className={`text-xs font-black uppercase tracking-wider ${['transit', 'delivered'].includes(queriedOrder.status) ? 'text-stone-900' : 'text-stone-400'}`}>
                      {queriedOrder.deliveryType === 'pickup' ? 'SECURING LOBBY LOCKER' : 'ROUTE DISPATCH IN TRANSIT'}
                    </h4>
                    <p className="text-xs text-stone-600 font-serif mt-1 max-w-sm leading-relaxed">
                      {queriedOrder.deliveryType === 'pickup'
                        ? 'Items have been transferred to our active reservation pickup drawers.'
                        : 'E-bike routing is underway! Dispatched courier travels coordinates with protective packaging.'}
                    </p>
                  </div>
                </div>

                {/* Milestone 2: Packaging block */}
                <div className="relative">
                  <span className={`absolute -left-[41px] top-0.5 w-6 h-6 rounded-none border-2 flex items-center justify-center transition-all ${
                    ['preparing', 'transit', 'delivered'].includes(queriedOrder.status)
                      ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                      : 'bg-white border-[#1A1A1A] text-stone-400'
                  }`}>
                    <span className="font-mono text-[10px] font-black">02</span>
                  </span>
                  <div>
                    <h4 className={`text-xs font-black uppercase tracking-wider ${['preparing', 'transit', 'delivered'].includes(queriedOrder.status) ? 'text-stone-900' : 'text-stone-400'}`}>
                      PREPARING GOODS & WRAPPING BASKET
                    </h4>
                    <p className="text-xs text-stone-600 font-serif mt-1 max-w-sm leading-relaxed">
                      Freshly sourcing regional jars of blackberry jam, chocolate bars, and dry provisions with eco-wrap parameters.
                    </p>
                  </div>
                </div>

                {/* Milestone 1: Approved */}
                <div className="relative">
                  <span className="absolute -left-[41px] top-0.5 w-6 h-6 rounded-none border-2 bg-[#1A1A1A] border-[#1A1A1A] text-white flex items-center justify-center">
                    <span className="font-mono text-[10px] font-black">01</span>
                  </span>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-stone-900">
                      RESERVATION APPROVED & LOGGED
                    </h4>
                    <p className="text-xs text-stone-600 font-serif mt-1 max-w-sm leading-relaxed">
                      Order authorized. Securely logged into local sandboxed system records on <span className="font-mono font-bold">{queriedOrder.date}</span>.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Recipient breakdown details */}
            <div className="pt-6 border-t-2 border-[#1A1A1A] flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-1.5">
                <span className="text-[9px] uppercase text-stone-500 font-black block tracking-widest">RECIPIENT LOGISTICS</span>
                <div className="text-xs font-bold text-stone-900 space-y-0.5">
                  <p className="font-black text-xs uppercase tracking-wide">{queriedOrder.shippingAddress.fullName}</p>
                  {queriedOrder.deliveryType !== 'pickup' && (
                    <p className="text-stone-600 font-serif font-normal italic">{queriedOrder.shippingAddress.street}, {queriedOrder.shippingAddress.city}, {queriedOrder.shippingAddress.state}</p>
                  )}
                  <p className="text-stone-500 font-mono text-[10px] font-black uppercase">{queriedOrder.email} • {queriedOrder.shippingAddress.phone}</p>
                </div>
              </div>

              <div className="space-y-1 text-right">
                <span className="text-[9px] uppercase text-stone-500 font-black block tracking-widest">ORDER TOTAL</span>
                <span className="font-serif italic font-black text-xl text-[#1A1A1A]">₹{queriedOrder.total.toFixed(2)}</span>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-6 text-stone-500 font-serif text-xs italic">
            Enter an order receipt ID above or select a demo sandbox order to track live packaging milestones!
          </div>
        )}

      </div>
    </div>
  );
}
